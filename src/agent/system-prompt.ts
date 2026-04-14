// ============================================================================
// SYSTEM PROMPT ASSEMBLER
// ----------------------------------------------------------------------------
// Every /api/chat call flows through buildSystemPrompt(). It stitches together:
//   1. The constitution (agent identity + rules, static)
//   2. The user's context (profile, memories, selected client/industry/geo)
//   3. The module header + workflow-specific skill instructions
// The result is what Anthropic sees in the `system` field.
// ============================================================================

import type { Profile } from "@/lib/supabase";
import { CONSTITUTION } from "./constitution";

export type ChatContext = {
  client?: string;
  industry?: string;
  geography?: string;
};

export type MemoryRow = { fact: string };

export function buildSystemPrompt(
  profile: Profile,
  memories: MemoryRow[],
  skillInstructions: string,
  moduleName: string,
  workflowName: string,
  selected?: ChatContext
): string {
  const clientsList = profile.clients || [];
  const industriesList = profile.industries || [];
  const geographiesList = profile.geographies || [];

  const ctxClient =
    selected?.client ??
    (clientsList.length === 1
      ? clientsList[0]
      : clientsList.length > 1
        ? `Multiple: ${clientsList.join(", ")}`
        : "General");
  const ctxIndustry =
    selected?.industry ??
    (industriesList.length === 1
      ? industriesList[0]
      : industriesList.length > 1
        ? `Multiple: ${industriesList.join(", ")}`
        : "All");
  const ctxGeo =
    selected?.geography ??
    (geographiesList.length === 1
      ? geographiesList[0]
      : geographiesList.length > 1
        ? `Multiple: ${geographiesList.join(", ")}`
        : "Global");

  const memorySection =
    memories.length > 0
      ? `\n# REMEMBERED FROM PAST CONVERSATIONS\n${memories.map((m) => `- ${m.fact}`).join("\n")}\n`
      : "";

  const multiClientNote =
    clientsList.length > 1 && !selected?.client
      ? `\nNOTE: This user works across multiple clients. If the request is client-specific, ask which client before proceeding.\n`
      : "";

  return `${CONSTITUTION}

# USER CONTEXT (loaded automatically — do NOT ask for this information)
Name: ${profile.name || "Unknown"}
Role: ${profile.role || "Unknown"}
Client: ${ctxClient}
Industry: ${ctxIndustry}
Geography: ${ctxGeo}
Priorities: ${profile.priorities || "None specified"}
${memorySection}${multiClientNote}
# CURRENT SESSION
Module: ${moduleName}
Workflow: ${workflowName}

# SKILL INSTRUCTIONS

${skillInstructions}`;
}
