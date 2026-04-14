// ============================================================================
// SKILL REGISTRY
// ----------------------------------------------------------------------------
// Single entry point that maps (moduleId, workflowId) → the assembled skill
// prompt. Each workflow file exports a `SKILL` string; each module folder has
// a `module.ts` exporting `MODULE_HEADER`. Getting a skill returns:
//     <module header> + <workflow skill>
// which gets injected into the system prompt by src/agent/system-prompt.ts.
// ============================================================================

import { MODULE_HEADER as M1_HEADER } from "./m1-the-watchtower/module";
import { SKILL as M1_CLIENT_INTEL } from "./m1-the-watchtower/client-intelligence";
import { SKILL as M1_INDUSTRY_SCAN } from "./m1-the-watchtower/industry-scan";
import { SKILL as M1_COMPETITIVE } from "./m1-the-watchtower/competitive-intelligence";
import { SKILL as M1_STARTUP } from "./m1-the-watchtower/startup-radar";
import { SKILL as M1_DIGEST } from "./m1-the-watchtower/daily-digest";

import { MODULE_HEADER as M2_HEADER } from "./m2-tech-translated/module";
import { SKILL as M2_GAP } from "./m2-tech-translated/gap-analysis";
import { SKILL as M2_ROADMAP } from "./m2-tech-translated/tech-roadmap";
import { SKILL as M2_BOARD } from "./m2-tech-translated/board-paper";
import { SKILL as M2_ARCH } from "./m2-tech-translated/architecture-blueprint";
import { SKILL as M2_ROLE } from "./m2-tech-translated/role-briefing";
import { SKILL as M2_SCORE } from "./m2-tech-translated/scoring-simulation";
import { SKILL as M2_PROPOSITION } from "./m2-tech-translated/client-proposition";

import { MODULE_HEADER as M3_HEADER } from "./m3-sprint-studio/module";
import { SKILL as M3_INNO_DAY } from "./m3-sprint-studio/innovation-day";
import { SKILL as M3_INNO_ROADMAP } from "./m3-sprint-studio/innovation-roadmap";
import { SKILL as M3_PILOT } from "./m3-sprint-studio/pilot-tracker";
import { SKILL as M3_VENTURE } from "./m3-sprint-studio/venture-intelligence";
import { SKILL as M3_SCOUT } from "./m3-sprint-studio/tech-scouting";

import { MODULE_HEADER as M4_HEADER } from "./m4-cto-ground-truth/module";
import { SKILL as M4_MORNING } from "./m4-cto-ground-truth/morning-war-room";
import { SKILL as M4_VENDOR } from "./m4-cto-ground-truth/vendor-threat";
import { SKILL as M4_ADR } from "./m4-cto-ground-truth/adr";
import { SKILL as M4_BOARD } from "./m4-cto-ground-truth/board-deck";
import { SKILL as M4_REG } from "./m4-cto-ground-truth/regulation-scanner";
import { SKILL as M4_MVB } from "./m4-cto-ground-truth/make-vs-buy";
import { SKILL as M4_MEETING } from "./m4-cto-ground-truth/meeting-prep";
import { SKILL as M4_TREND } from "./m4-cto-ground-truth/trend-radar";
import { SKILL as M4_CONTRACT } from "./m4-cto-ground-truth/contract-review";
import { SKILL as M4_LINKEDIN } from "./m4-cto-ground-truth/linkedin-pov";
import { SKILL as M4_COMMS } from "./m4-cto-ground-truth/communication-copilot";
import { SKILL as M4_BLOG } from "./m4-cto-ground-truth/blog-writer";

const MODULE_HEADERS: Record<string, string> = {
  m1: M1_HEADER,
  m2: M2_HEADER,
  m3: M3_HEADER,
  m4: M4_HEADER,
};

const SKILLS: Record<string, Record<string, string>> = {
  m1: {
    client_intelligence: M1_CLIENT_INTEL,
    industry_scan: M1_INDUSTRY_SCAN,
    competitive_intelligence: M1_COMPETITIVE,
    startup_radar: M1_STARTUP,
    daily_digest: M1_DIGEST,
  },
  m2: {
    gap_analysis: M2_GAP,
    tech_roadmap: M2_ROADMAP,
    board_paper: M2_BOARD,
    architecture_blueprint: M2_ARCH,
    role_briefing: M2_ROLE,
    scoring_simulation: M2_SCORE,
    client_proposition: M2_PROPOSITION,
  },
  m3: {
    innovation_day: M3_INNO_DAY,
    innovation_roadmap: M3_INNO_ROADMAP,
    pilot_tracker: M3_PILOT,
    venture_intelligence: M3_VENTURE,
    tech_scouting: M3_SCOUT,
  },
  m4: {
    morning_war_room: M4_MORNING,
    vendor_threat: M4_VENDOR,
    adr: M4_ADR,
    board_deck: M4_BOARD,
    regulation_scanner: M4_REG,
    make_vs_buy: M4_MVB,
    meeting_prep: M4_MEETING,
    trend_radar: M4_TREND,
    contract_review: M4_CONTRACT,
    linkedin_pov: M4_LINKEDIN,
    communication_copilot: M4_COMMS,
    blog_writer: M4_BLOG,
  },
};

/**
 * Returns the full skill prompt for a (moduleId, workflowId):
 *   [module header] + [workflow-specific skill]
 * Returns null if either is unknown.
 */
export function getSkill(moduleId: string, workflowId: string): string | null {
  const header = MODULE_HEADERS[moduleId];
  const workflow = SKILLS[moduleId]?.[workflowId];
  if (!header || !workflow) return null;
  return `${header}\n\n${workflow}`;
}

export function getModuleHeader(moduleId: string): string | null {
  return MODULE_HEADERS[moduleId] ?? null;
}
