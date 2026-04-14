// ============================================================================
// USER DOCUMENT INGEST (server-side, called by /api/documents/ingest)
// ----------------------------------------------------------------------------
// Same pipeline as scripts/ingest-knowledge.mjs but:
//   - Source: a document row from the user's `documents` table
//   - user_id is set to the uploader so retrieval can filter to "global + mine"
//   - Runs inline with the user's Supabase client (respects RLS)
// ============================================================================

import "server-only";
import { PDFParse } from "pdf-parse";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import type { SupabaseClient } from "@supabase/supabase-js";
import { chunkText } from "./chunker";

// Lazy-init API clients — module-load construction throws during Next.js build.
let _anthropic: Anthropic | null = null;
let _openai: OpenAI | null = null;
function getAnthropic(): Anthropic {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

async function generateContext(
  docTitle: string,
  preview: string,
  chunk: string
): Promise<string> {
  const resp = await getAnthropic().messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 120,
    system:
      "Given a document and a chunk of that document, write a 50-word standalone context sentence for the chunk that answers: where in the document does this sit, and what topic does it belong to? Output ONLY the context sentence, no quotes, no preamble.",
    messages: [
      {
        role: "user",
        content: `<document>\nTITLE: ${docTitle}\nPREVIEW: ${preview.slice(0, 2000)}\n</document>\n\n<chunk>\n${chunk.slice(0, 1500)}\n</chunk>\n\nWrite the context sentence now.`,
      },
    ],
  });
  return resp.content
    .filter((c) => c.type === "text")
    .map((c) => (c as { text: string }).text)
    .join("")
    .trim();
}

async function embed(text: string): Promise<number[]> {
  const resp = await getOpenAI().embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return resp.data[0].embedding;
}

export type IngestResult = {
  docId: string;
  chunks: number;
  errors: string[];
};

export async function ingestUserDocument(
  supabase: SupabaseClient,
  userId: string,
  docRow: { id: string; filename: string; file_type: string | null; storage_path: string }
): Promise<IngestResult> {
  const result: IngestResult = {
    docId: docRow.id,
    chunks: 0,
    errors: [],
  };

  // Only PDFs are supported for now. Word/PowerPoint support can be added later
  // with mammoth/pptx-parser.
  if (!docRow.file_type?.includes("pdf")) {
    result.errors.push(`Unsupported file type: ${docRow.file_type}`);
    return result;
  }

  // Download from Supabase Storage.
  const { data: fileBlob, error: dlErr } = await supabase.storage
    .from("documents")
    .download(docRow.storage_path);
  if (dlErr || !fileBlob) {
    result.errors.push(`Download failed: ${dlErr?.message ?? "no blob"}`);
    return result;
  }

  const arrayBuffer = await fileBlob.arrayBuffer();
  const buf = Buffer.from(arrayBuffer);

  let text: string;
  try {
    const parser = new PDFParse({ data: buf });
    const parsed = await parser.getText();
    await parser.destroy();
    text = parsed.text;
  } catch (err) {
    result.errors.push(`PDF parse failed: ${err instanceof Error ? err.message : "unknown"}`);
    return result;
  }

  if (!text || text.length < 50) {
    result.errors.push("PDF text extraction produced no content");
    return result;
  }

  const chunks = chunkText(text);
  const preview = text.slice(0, 3000);

  // Remove any existing chunks for this document (idempotent re-ingest).
  await supabase.from("document_chunks").delete().eq("doc_id", docRow.id).eq("user_id", userId);

  for (const chunk of chunks) {
    try {
      const context = await generateContext(docRow.filename, preview, chunk.text);
      const embedding = await embed(`${context}\n\n${chunk.text}`);

      const { error } = await supabase.from("document_chunks").insert({
        source: "user_upload",
        doc_id: docRow.id,
        doc_title: docRow.filename,
        user_id: userId,
        chunk_index: chunk.index,
        section: chunk.section,
        context,
        content: chunk.text,
        embedding,
      });

      if (error) {
        result.errors.push(`Chunk ${chunk.index}: ${error.message}`);
      } else {
        result.chunks++;
      }
    } catch (err) {
      result.errors.push(
        `Chunk ${chunk.index}: ${err instanceof Error ? err.message : "unknown"}`
      );
    }
  }

  return result;
}
