// ============================================================================
// RETRIEVAL
// ----------------------------------------------------------------------------
// Called from /api/chat on every request. Embeds the user's query via OpenAI,
// runs the match_document_chunks RPC in Supabase (pgvector), returns the
// top-k most similar chunks filtered to global + the user's own uploads, and
// formats them as a markdown block for injection into the system prompt.
// ============================================================================

import "server-only";
import OpenAI from "openai";
import type { SupabaseClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type RetrievedChunk = {
  id: number;
  source: string;
  doc_id: string;
  doc_title: string | null;
  section: string | null;
  context: string | null;
  content: string;
  similarity: number;
};

// Workflows that benefit from higher top-k because they need broad coverage.
const HIGH_K_WORKFLOWS = new Set([
  "board_paper",
  "tech_roadmap",
  "gap_analysis",
  "innovation_roadmap",
  "client_proposition",
  "architecture_blueprint",
]);

// Workflows that don't benefit from knowledge retrieval — skip to save cost/latency.
const SKIP_WORKFLOWS = new Set([
  "communication_copilot",
  "meeting_prep",
  "morning_war_room",
  "daily_digest",
  "trend_radar",
  "startup_radar",
]);

export async function retrieveContext(
  supabase: SupabaseClient,
  userMessage: string,
  workflowId: string,
  userId: string
): Promise<string> {
  if (SKIP_WORKFLOWS.has(workflowId)) return "";
  if (!process.env.OPENAI_API_KEY) {
    console.warn("[retrieval] OPENAI_API_KEY not set — skipping retrieval");
    return "";
  }

  try {
    const embedResp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: userMessage,
    });
    const queryEmbedding = embedResp.data[0].embedding;

    const matchCount = HIGH_K_WORKFLOWS.has(workflowId) ? 15 : 8;

    const { data: matches, error } = await supabase.rpc("match_document_chunks", {
      query_embedding: queryEmbedding as unknown as number[],
      match_count: matchCount,
      filter_user_id: userId,
    });

    if (error) {
      console.warn("[retrieval] match_document_chunks error:", error);
      return "";
    }

    const chunks = (matches || []) as RetrievedChunk[];
    if (chunks.length === 0) return "";

    console.log(
      `[retrieval] workflow=${workflowId} retrieved ${chunks.length} chunks (avg similarity: ${(
        chunks.reduce((s, c) => s + c.similarity, 0) / chunks.length
      ).toFixed(3)})`
    );

    return formatChunksAsMarkdown(chunks);
  } catch (err) {
    console.warn("[retrieval] failed:", err);
    return "";
  }
}

function formatChunksAsMarkdown(chunks: RetrievedChunk[]): string {
  const blocks = chunks.map((chunk, i) => {
    const title = chunk.doc_title || chunk.doc_id;
    const section = chunk.section ? ` — ${chunk.section}` : "";
    const contextLine = chunk.context ? `_Context: ${chunk.context}_\n\n` : "";
    return `### [${i + 1}] ${title}${section}\n${contextLine}${chunk.content}`;
  });

  return `# RELEVANT KNOWLEDGE (retrieved from Capgemini reference documents and user's uploaded files)

Use these passages to ground your response. Cite them by their [number] tag when you reference specific facts. If a passage contradicts your general knowledge, prefer the passage — it's from the user's authoritative source.

${blocks.join("\n\n---\n\n")}

`;
}
