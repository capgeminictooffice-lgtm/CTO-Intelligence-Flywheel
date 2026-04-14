// ============================================================================
// INGEST KNOWLEDGE SCRIPT
// ----------------------------------------------------------------------------
// One-off run: extracts text from the Capgemini reference PDFs, chunks them,
// uses Claude Haiku to generate a 50-word "context" per chunk (Anthropic's
// Contextual Retrieval technique), embeds with OpenAI text-embedding-3-small,
// and inserts into the document_chunks table as global (user_id = NULL).
//
// Usage:   node scripts/ingest-knowledge.mjs
// Env:     ANTHROPIC_API_KEY, OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL,
//          SUPABASE_SERVICE_ROLE_KEY (for global inserts bypassing RLS)
// ============================================================================
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const sourcesDir = join(root, "src", "knowledge", "sources");

// Load .env.local manually (script runs outside Next.js)
const env = readFileSync(join(root, ".env.local"), "utf8")
  .split("\n")
  .filter((l) => l.trim() && !l.startsWith("#"))
  .reduce((acc, line) => {
    const [k, ...rest] = line.split("=");
    acc[k.trim()] = rest.join("=").trim();
    return acc;
  }, {});

const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
const OPENAI_API_KEY = env.OPENAI_API_KEY;
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!ANTHROPIC_API_KEY || !OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing one or more env vars. Need: ANTHROPIC_API_KEY, OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Inline chunker (JS copy of src/knowledge/chunker.ts so the script has no build step).
function chunkText(raw) {
  const TARGET_CHARS = 800 * 4;
  const OVERLAP_CHARS = 150 * 4;
  const normalized = raw.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]+/g, " ").trim();
  const chunks = [];
  let idx = 0;
  let currentSection = null;
  let cursor = 0;
  while (cursor < normalized.length) {
    const end = Math.min(cursor + TARGET_CHARS, normalized.length);
    let sliceEnd = end;
    if (end < normalized.length) {
      const para = normalized.lastIndexOf("\n\n", end);
      if (para > cursor + TARGET_CHARS * 0.5) sliceEnd = para;
      else {
        const sentence = normalized.lastIndexOf(". ", end);
        if (sentence > cursor + TARGET_CHARS * 0.5) sliceEnd = sentence + 1;
      }
    }
    const text = normalized.slice(cursor, sliceEnd).trim();
    if (text.length > 0) {
      const firstLine = text.split("\n")[0];
      if (firstLine.length < 120 && /^[A-Z0-9]/.test(firstLine) && !firstLine.endsWith(".")) {
        currentSection = firstLine;
      }
      chunks.push({ index: idx++, section: currentSection, text });
    }
    if (sliceEnd >= normalized.length) break;
    cursor = Math.max(sliceEnd - OVERLAP_CHARS, cursor + 1);
  }
  return chunks;
}

const SOURCES = [
  {
    doc_id: "technovision-2026-part1",
    doc_title: "Capgemini TechnoVision 2026 — Part 1 (containers 1-4)",
    filename: "technovision-2026-part1.pdf",
  },
  {
    doc_id: "technovision-2026-part2",
    doc_title: "Capgemini TechnoVision 2026 — Part 2 (containers 5-8)",
    filename: "technovision-2026-part2.pdf",
  },
  {
    doc_id: "top-tech-trends-2026",
    doc_title: "Capgemini Top Tech Trends Report 2026",
    filename: "Capgemini_Top_Tech_Trends_Report_2026.pdf",
  },
];

async function generateContext(docTitle, fullTextPreview, chunk) {
  const resp = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 120,
    system:
      "Given a document and a chunk of that document, write a 50-word standalone context sentence for the chunk that answers: where in the document does this sit, and what topic does it belong to? Output ONLY the context sentence, no quotes, no preamble.",
    messages: [
      {
        role: "user",
        content: `<document>\nTITLE: ${docTitle}\nPREVIEW: ${fullTextPreview.slice(0, 2000)}\n</document>\n\n<chunk>\n${chunk.slice(0, 1500)}\n</chunk>\n\nWrite the context sentence now.`,
      },
    ],
  });
  const text = resp.content.filter((c) => c.type === "text").map((c) => c.text).join("").trim();
  return text;
}

async function embed(text) {
  const resp = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return resp.data[0].embedding;
}

async function ingestSource(source) {
  const path = join(sourcesDir, source.filename);
  console.log(`\n→ ${source.doc_id}`);
  console.log(`  reading ${source.filename}...`);
  const buf = readFileSync(path);
  const parser = new PDFParse({ data: buf });
  const parsed = await parser.getText();
  await parser.destroy();
  const text = parsed.text;
  const pageCount = parsed.numpages ?? parsed.pages ?? "?";
  console.log(`  extracted ${text.length} chars, ${pageCount} pages`);

  const chunks = chunkText(text);
  console.log(`  chunked into ${chunks.length} pieces`);

  // Remove any existing global chunks for this doc_id so re-running the script is idempotent.
  const { error: delErr } = await supabase
    .from("document_chunks")
    .delete()
    .is("user_id", null)
    .eq("doc_id", source.doc_id);
  if (delErr) console.warn(`  warn: could not delete existing chunks: ${delErr.message}`);

  const preview = text.slice(0, 3000);
  let inserted = 0;
  for (const chunk of chunks) {
    try {
      const context = await generateContext(source.doc_title, preview, chunk.text);
      const contextualized = `${context}\n\n${chunk.text}`;
      const embedding = await embed(contextualized);

      const { error } = await supabase.from("document_chunks").insert({
        source: "global",
        doc_id: source.doc_id,
        doc_title: source.doc_title,
        user_id: null,
        chunk_index: chunk.index,
        section: chunk.section,
        context,
        content: chunk.text,
        embedding,
      });
      if (error) {
        console.warn(`  chunk ${chunk.index}: insert error — ${error.message}`);
      } else {
        inserted++;
        if (inserted % 10 === 0) console.log(`  inserted ${inserted}/${chunks.length}...`);
      }
    } catch (err) {
      console.warn(`  chunk ${chunk.index}: ${err.message}`);
    }
  }
  console.log(`  done: ${inserted}/${chunks.length} chunks inserted`);
}

(async () => {
  for (const source of SOURCES) {
    await ingestSource(source);
  }
  console.log("\n✅ Ingestion complete.");
})().catch((err) => {
  console.error("Ingest failed:", err);
  process.exit(1);
});
