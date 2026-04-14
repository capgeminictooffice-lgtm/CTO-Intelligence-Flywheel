export type Workflow = { id: string; name: string; complexity: "complex" | "general" | "fast" };

export type Module = {
  id: string;
  name: string;
  color: string;
  description: string;
  icon: string;
  workflows: Workflow[];
};

export const MODULES: Module[] = [
  {
    id: "m1",
    name: "The Watchtower",
    color: "#0D9488",
    icon: "Radar",
    description:
      "Your 24/7 AI-powered intelligence service. Real-time scans on any client, industry, competitor, or technology domain.",
    workflows: [
      { id: "client_intelligence", name: "Client intelligence scan", complexity: "general" },
      { id: "industry_scan", name: "Industry scan", complexity: "general" },
      { id: "competitive_intelligence", name: "Competitive intelligence", complexity: "general" },
      { id: "startup_radar", name: "Startup radar", complexity: "general" },
      { id: "daily_digest", name: "Daily digest", complexity: "general" },
    ],
  },
  {
    id: "m2",
    name: "Tech, Translated",
    color: "#6D28D9",
    icon: "Brain",
    description:
      "AI technology advisor grounded in TechnoVision 2026. Generate board papers, tech roadmaps, architecture blueprints, and strategy briefs.",
    workflows: [
      { id: "gap_analysis", name: "Gap analysis", complexity: "general" },
      { id: "tech_roadmap", name: "Tech roadmap", complexity: "complex" },
      { id: "board_paper", name: "Board paper", complexity: "complex" },
      { id: "architecture_blueprint", name: "Architecture blueprint", complexity: "complex" },
      { id: "role_briefing", name: "Role briefing", complexity: "general" },
      { id: "scoring_simulation", name: "Scoring simulation", complexity: "complex" },
      { id: "client_proposition", name: "Client proposition", complexity: "complex" },
    ],
  },
  {
    id: "m3",
    name: "Sprint Studio",
    color: "#B45309",
    icon: "Lightbulb",
    description:
      "Innovation planning co-pilot. Plan client innovation days, build roadmaps, track prototypes, scout technologies and venture opportunities.",
    workflows: [
      { id: "innovation_day", name: "Innovation day planner", complexity: "complex" },
      { id: "innovation_roadmap", name: "Innovation roadmap", complexity: "complex" },
      { id: "pilot_tracker", name: "Pilot tracker", complexity: "general" },
      { id: "venture_intelligence", name: "Venture intelligence", complexity: "general" },
      { id: "tech_scouting", name: "Technology scouting", complexity: "general" },
    ],
  },
  {
    id: "m4",
    name: "CTO Ground Truth",
    color: "#0070AD",
    icon: "Bot",
    description:
      "The Group CTO's digital operator. 12 battle-tested workflows for daily operations — from morning briefings to weekend blog writing.",
    workflows: [
      { id: "morning_war_room", name: "Morning war room", complexity: "general" },
      { id: "vendor_threat", name: "Vendor threat", complexity: "complex" },
      { id: "adr", name: "ADR", complexity: "complex" },
      { id: "board_deck", name: "Board deck", complexity: "complex" },
      { id: "regulation_scanner", name: "Regulation scanner", complexity: "complex" },
      { id: "make_vs_buy", name: "Make vs buy", complexity: "complex" },
      { id: "meeting_prep", name: "Meeting prep", complexity: "general" },
      { id: "trend_radar", name: "Trend radar", complexity: "general" },
      { id: "contract_review", name: "Contract review", complexity: "general" },
      { id: "linkedin_pov", name: "LinkedIn POV", complexity: "general" },
      { id: "communication_copilot", name: "Comms copilot", complexity: "general" },
      { id: "blog_writer", name: "Blog writer", complexity: "complex" },
    ],
  },
];

export function getModule(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id);
}

export function getWorkflow(moduleId: string, workflowId: string): Workflow | undefined {
  return getModule(moduleId)?.workflows.find((w) => w.id === workflowId);
}

// Model routing lives in src/lib/prompts — this module only owns module/workflow metadata.

export const ROLES = ["CTO", "CFO", "CDO", "CIO", "GCP", "GEB Member", "GEC Member", "Sales Lead"];

export const INDUSTRIES = [
  "Banking & Capital Markets",
  "Insurance",
  "Automotive",
  "Life Sciences",
  "Retail & Consumer",
  "Energy & Utilities",
  "Telecom & Media",
  "Government & Public Sector",
  "Manufacturing",
  "Aerospace & Defense",
];

export const GEOGRAPHIES = ["EU", "North America", "APAC", "EMEA", "UK", "India", "Latin America"];
