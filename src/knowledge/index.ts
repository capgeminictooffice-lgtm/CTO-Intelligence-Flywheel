// ============================================================================
// KNOWLEDGE BASE
// ----------------------------------------------------------------------------
// Loads and serves the Capgemini reference PDFs (TechnoVision 2026 + Top Tech
// Trends 2026). Each workflow that needs deep reference context declares which
// docs it wants in the WORKFLOW_ATTACHMENTS map below. The /api/chat route
// calls getKnowledgeAttachments() and prepends the document blocks to the
// first user message with cache_control so Anthropic caches them between
// requests.
//
// Feature flag: KNOWLEDGE_PDFS_ENABLED=1 in .env.local to enable. Off by
// default because the full PDFs are ~100k input tokens, which exceeds Opus'
// Tier-1 rate limit of 30k tokens/min. When off, we rely on the TechnoVision
// structural summary already embedded in the m2 skill prompts.
// ============================================================================

import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type KnowledgeDoc = {
  id: string;
  filename: string;
  title: string;
  data: string; // base64
};

export type KnowledgeDocumentBlock = {
  type: "document";
  source: { type: "base64"; media_type: "application/pdf"; data: string };
  title?: string;
  cache_control?: { type: "ephemeral" };
};

const sourcesDir = join(process.cwd(), "src", "knowledge", "sources");

function loadDoc(id: string, filename: string, title: string): KnowledgeDoc | null {
  try {
    const bytes = readFileSync(join(sourcesDir, filename));
    return { id, filename, title, data: bytes.toString("base64") };
  } catch (err) {
    console.warn(`[knowledge] Could not load ${filename}:`, err);
    return null;
  }
}

let cache: Record<string, KnowledgeDoc | null> | null = null;

function getDocs(): Record<string, KnowledgeDoc | null> {
  if (cache) return cache;
  cache = {
    tv_part1: loadDoc(
      "tv_part1",
      "technovision-2026-part1.pdf",
      "Capgemini TechnoVision 2026 — Part 1 (containers 1-4)"
    ),
    tv_part2: loadDoc(
      "tv_part2",
      "technovision-2026-part2.pdf",
      "Capgemini TechnoVision 2026 — Part 2 (containers 5-8)"
    ),
    top_trends: loadDoc(
      "top_trends",
      "Capgemini_Top_Tech_Trends_Report_2026.pdf",
      "Capgemini Top Tech Trends Report 2026"
    ),
  };
  const loaded = Object.values(cache).filter(Boolean).length;
  console.log(`[knowledge] Loaded ${loaded}/3 reference PDFs into memory`);
  return cache;
}

// Which reference docs each workflow needs. Workflows not listed get nothing.
const WORKFLOW_ATTACHMENTS: Record<string, string[]> = {
  // m2 — Tech, Translated
  gap_analysis: ["tv_part1", "tv_part2", "top_trends"],
  tech_roadmap: ["tv_part1", "tv_part2", "top_trends"],
  board_paper: ["tv_part1", "tv_part2", "top_trends"],
  architecture_blueprint: ["tv_part1", "tv_part2"],
  role_briefing: ["tv_part1", "tv_part2", "top_trends"],
  scoring_simulation: ["tv_part1", "tv_part2"],
  client_proposition: ["tv_part1", "tv_part2", "top_trends"],

  // m3 — Sprint Studio
  innovation_day: ["tv_part1", "tv_part2", "top_trends"],
  innovation_roadmap: ["tv_part1", "tv_part2", "top_trends"],
  tech_scouting: ["top_trends"],

  // m1 — The Watchtower
  daily_digest: ["top_trends"],
  startup_radar: ["top_trends"],

  // m4 — CTO Ground Truth
  trend_radar: ["top_trends"],
};

const KNOWLEDGE_PDFS_ENABLED = process.env.KNOWLEDGE_PDFS_ENABLED === "1";

export function getKnowledgeAttachments(workflowId: string): KnowledgeDocumentBlock[] {
  if (!KNOWLEDGE_PDFS_ENABLED) return [];
  const ids = WORKFLOW_ATTACHMENTS[workflowId] ?? [];
  if (ids.length === 0) return [];
  const docs = getDocs();
  const blocks: KnowledgeDocumentBlock[] = [];
  for (const id of ids) {
    const doc = docs[id];
    if (!doc) continue;
    blocks.push({
      type: "document",
      source: { type: "base64", media_type: "application/pdf", data: doc.data },
      title: doc.title,
      cache_control: { type: "ephemeral" },
    });
  }
  return blocks;
}

export function getAttachedDocIds(workflowId: string): string[] {
  if (!KNOWLEDGE_PDFS_ENABLED) return [];
  return WORKFLOW_ATTACHMENTS[workflowId] ?? [];
}
