// ============================================================================
// MODEL ROUTING
// ----------------------------------------------------------------------------
// Which Claude model does which workflow. Single source of truth.
//   - Opus   → deep reasoning, highest cost (14 complex workflows)
//   - Sonnet → balanced cost/quality (15 general workflows)
//   - Haiku  → fast, cheap, internal only (memory extraction)
// To re-route a workflow, change one line.
// ============================================================================

export const MODEL_ROUTING: Record<string, string> = {
  // COMPLEX → Opus
  board_paper: "claude-opus-4-6",
  tech_roadmap: "claude-opus-4-6",
  architecture_blueprint: "claude-opus-4-6",
  adr: "claude-opus-4-6",
  board_deck: "claude-opus-4-6",
  regulation_scanner: "claude-opus-4-6",
  blog_writer: "claude-opus-4-6",
  innovation_day: "claude-opus-4-6",
  innovation_roadmap: "claude-opus-4-6",
  scoring_simulation: "claude-opus-4-6",
  client_proposition: "claude-opus-4-6",
  vendor_threat: "claude-opus-4-6",
  make_vs_buy: "claude-opus-4-6",
  gap_analysis: "claude-opus-4-6",

  // GENERAL → Sonnet
  client_intelligence: "claude-sonnet-4-6",
  industry_scan: "claude-sonnet-4-6",
  competitive_intelligence: "claude-sonnet-4-6",
  startup_radar: "claude-sonnet-4-6",
  daily_digest: "claude-sonnet-4-6",
  role_briefing: "claude-sonnet-4-6",
  pilot_tracker: "claude-sonnet-4-6",
  venture_intelligence: "claude-sonnet-4-6",
  tech_scouting: "claude-sonnet-4-6",
  morning_war_room: "claude-sonnet-4-6",
  meeting_prep: "claude-sonnet-4-6",
  trend_radar: "claude-sonnet-4-6",
  contract_review: "claude-sonnet-4-6",
  linkedin_pov: "claude-sonnet-4-6",
  communication_copilot: "claude-sonnet-4-6",
};

// Internal-only fast model for memory extraction. Never user-facing.
export const FAST_MODEL = "claude-haiku-4-5-20251001";

const DEFAULT_MODEL = "claude-sonnet-4-6";

export function getModelForWorkflow(workflowId: string): string {
  return MODEL_ROUTING[workflowId] ?? DEFAULT_MODEL;
}
