import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabase } from "@/lib/supabase-server";
import { getModule, getWorkflow } from "@/lib/modules";
import { buildSystemPrompt } from "@/src/agent/system-prompt";
import { getModelForWorkflow, FAST_MODEL } from "@/src/agent/model-routing";
import { getSkill } from "@/src/skills";
import { retrieveContext } from "@/src/knowledge/retrieval";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Code Execution + web search can take 2-3 min on complex Opus workflows.
// Vercel Hobby caps at 10s; Pro caps at 60s default and accepts up to 300s
// when you set maxDuration. Fluid compute / Enterprise goes higher.
export const maxDuration = 300;

const ANTHROPIC_BETAS = ["code-execution-2025-05-22", "files-api-2025-04-14"].join(",");

// Lazy-init — Next.js build collects page data by evaluating route modules;
// constructing the SDK client at module scope risks a build-time throw.
let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      defaultHeaders: { "anthropic-beta": ANTHROPIC_BETAS },
    });
  }
  return _anthropic;
}

// Download a file produced by the code_execution sandbox via the Files API.
async function downloadAnthropicFile(fileId: string): Promise<Buffer | null> {
  try {
    const res = await fetch(`https://api.anthropic.com/v1/files/${fileId}/content`, {
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": ANTHROPIC_BETAS,
      },
    });
    if (!res.ok) {
      console.warn(`[chat] file download ${fileId} returned ${res.status}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return buf;
  } catch (err) {
    console.warn(`[chat] file download error ${fileId}:`, err);
    return null;
  }
}

// Walk the final message content, find any files created by code_execution, and
// return them as a list of { filename, base64, media_type } ready to serialise.
type GeneratedFile = {
  filename: string;
  base64: string;
  media_type: string;
};

function guessMediaType(filename: string): string {
  const f = filename.toLowerCase();
  if (f.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (f.endsWith(".pptx")) return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  if (f.endsWith(".xlsx")) return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (f.endsWith(".pdf")) return "application/pdf";
  if (f.endsWith(".csv")) return "text/csv";
  if (f.endsWith(".md")) return "text/markdown";
  if (f.endsWith(".txt")) return "text/plain";
  return "application/octet-stream";
}

async function extractGeneratedFiles(
  finalMessage: Anthropic.Message
): Promise<GeneratedFile[]> {
  const files: GeneratedFile[] = [];
  for (const block of finalMessage.content) {
    // The SDK types for code_execution tool result evolve between versions, so
    // we walk the content as unknown and defensively extract the file shape.
    const b = block as unknown as {
      type: string;
      content?: Array<{
        type: string;
        file_id?: string;
        filename?: string;
      }>;
    };
    if (b.type !== "code_execution_tool_result") continue;
    for (const item of b.content ?? []) {
      if (item.type === "code_execution_output" && item.file_id) {
        const filename = item.filename || `output-${item.file_id}`;
        const buf = await downloadAnthropicFile(item.file_id);
        if (!buf) continue;
        files.push({
          filename,
          base64: buf.toString("base64"),
          media_type: guessMediaType(filename),
        });
      }
    }
  }
  return files;
}

type ChatBody = {
  module: string;
  workflow: string;
  message: string;
  conversationId?: string;
  context?: { client?: string; industry?: string; geography?: string };
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChatBody;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const mod = getModule(body.module);
  const workflow = getWorkflow(body.module, body.workflow);
  if (!mod || !workflow) return new Response("Invalid module/workflow", { status: 400 });

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile) return new Response("No profile", { status: 400 });

  const { data: memories } = await supabase
    .from("memories")
    .select("fact")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("extracted_at", { ascending: false })
    .limit(20);

  // RAG retrieval — embed the user's message, pull top-k relevant chunks from
  // the document_chunks table (Capgemini reference docs + the user's own uploads).
  const retrievedKnowledge = await retrieveContext(
    supabase,
    body.message,
    body.workflow,
    user.id
  );

  const skillInstructions =
    getSkill(body.module, body.workflow) || "(no skill instructions defined)";

  const skillPlusKnowledge = retrievedKnowledge
    ? `${retrievedKnowledge}\n${skillInstructions}`
    : skillInstructions;

  const systemPrompt = buildSystemPrompt(
    profile,
    memories || [],
    skillPlusKnowledge,
    mod.name,
    workflow.name,
    body.context
  );

  let history: { role: "user" | "assistant"; content: string }[] = [];
  let conversationId = body.conversationId;

  if (conversationId) {
    const { data: existing } = await supabase
      .from("conversations")
      .select("messages")
      .eq("id", conversationId)
      .maybeSingle();
    if (existing?.messages) history = existing.messages;
  }

  history.push({ role: "user", content: body.message });

  const model = getModelForWorkflow(body.workflow);

  // All context now flows through the system prompt (constitution + skill + retrieved
  // knowledge). The request messages are pure conversation history — no base64 attachments.
  const requestMessages = history.map((m) => ({
    role: m.role,
    content: m.content,
  })) as unknown as Anthropic.MessageParam[];

  const encoder = new TextEncoder();
  let fullResponse = "";
  let inputTokens = 0;
  let outputTokens = 0;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const resp = getAnthropic().messages.stream({
          model,
          max_tokens: 8192,
          system: [
            { type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } },
          ] as unknown as Anthropic.TextBlockParam[],
          messages: requestMessages,
          tools: [
            { type: "web_search_20250305" as const, name: "web_search" } as unknown as Anthropic.Tool,
            { type: "code_execution_20250522" as const, name: "code_execution" } as unknown as Anthropic.Tool,
          ],
        });

        for await (const event of resp) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const text = event.delta.text;
            fullResponse += text;
            controller.enqueue(encoder.encode(text));
          }
          if (event.type === "message_start") {
            inputTokens = event.message.usage.input_tokens ?? 0;
            outputTokens = event.message.usage.output_tokens ?? 0;
          }
          if (event.type === "message_delta") {
            outputTokens = event.usage.output_tokens ?? outputTokens;
          }
        }

        // Stream text is done. Now extract any files the sandbox produced and
        // emit them as a sentinel trailer the client can parse.
        let generatedFiles: GeneratedFile[] = [];
        try {
          const finalMessage = await resp.finalMessage();
          generatedFiles = await extractGeneratedFiles(finalMessage);
          if (generatedFiles.length > 0) {
            console.log(
              `[chat] generated ${generatedFiles.length} file(s): ${generatedFiles.map((f) => f.filename).join(", ")}`
            );
          }
        } catch (err) {
          console.warn("[chat] file extraction failed:", err);
        }

        if (generatedFiles.length > 0) {
          const payload = JSON.stringify({ files: generatedFiles });
          controller.enqueue(encoder.encode(`\n\n<<<FILES>>>${payload}<<<END>>>`));
        }

        controller.close();

        const finalHistory = [...history, { role: "assistant" as const, content: fullResponse }];
        const title = body.message.slice(0, 60);
        const costUsd = estimateCost(model, inputTokens, outputTokens);

        if (conversationId) {
          await supabase
            .from("conversations")
            .update({
              messages: finalHistory,
              model_used: model,
              input_tokens: inputTokens,
              output_tokens: outputTokens,
              cost_usd: costUsd,
              updated_at: new Date().toISOString(),
            })
            .eq("id", conversationId);
        } else {
          const { data: inserted } = await supabase
            .from("conversations")
            .insert({
              user_id: user.id,
              module: body.module,
              workflow: body.workflow,
              title,
              messages: finalHistory,
              model_used: model,
              input_tokens: inputTokens,
              output_tokens: outputTokens,
              cost_usd: costUsd,
            })
            .select()
            .single();
          conversationId = inserted?.id;
        }

        extractMemories(user.id, fullResponse, body.message, conversationId).catch(() => {});
      } catch (err) {
        controller.enqueue(
          encoder.encode(`\n\n_Error: ${err instanceof Error ? err.message : "stream failed"}_`)
        );
        controller.close();
      }
    },
  });

  const headers = new Headers({
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-cache",
    "x-conversation-id": conversationId || "",
    "x-model": model,
  });

  return new Response(stream, { headers });
}

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  // USD per 1M tokens (input, output)
  const pricing: Record<string, [number, number]> = {
    "claude-opus-4-6": [15, 75],
    "claude-sonnet-4-6": [3, 15],
    "claude-haiku-4-5-20251001": [1, 5],
  };
  const [inRate, outRate] = pricing[model] ?? [3, 15];
  return Number(((inputTokens * inRate + outputTokens * outRate) / 1_000_000).toFixed(6));
}

async function extractMemories(
  userId: string,
  assistantText: string,
  userText: string,
  conversationId?: string
) {
  try {
    const supabase = await createServerSupabase();
    const result = await getAnthropic().messages.create({
      model: FAST_MODEL,
      max_tokens: 1024,
      system:
        "Extract durable facts about the user from this conversation that would be useful in future sessions. Return JSON: {\"memories\":[{\"fact\":\"...\",\"category\":\"preference|context|goal|constraint\"}]}. Return {\"memories\":[]} if nothing notable.",
      messages: [
        { role: "user", content: `User said: ${userText}\n\nAssistant replied: ${assistantText.slice(0, 4000)}` },
      ],
    });
    const text = result.content
      .filter((c) => c.type === "text")
      .map((c) => (c as { text: string }).text)
      .join("");
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return;
    const parsed = JSON.parse(match[0]) as { memories: { fact: string; category: string }[] };
    if (!parsed.memories?.length) return;
    await supabase.from("memories").insert(
      parsed.memories.map((m) => ({
        user_id: userId,
        fact: m.fact,
        category: m.category,
        source_conversation_id: conversationId || null,
        is_active: true,
        extracted_at: new Date().toISOString(),
      }))
    );
  } catch {}
}
