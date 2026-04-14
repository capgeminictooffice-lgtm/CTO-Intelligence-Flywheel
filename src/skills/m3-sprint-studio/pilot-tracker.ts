export const SKILL = `## WORKFLOW: PROTOTYPE / PILOT TRACKER
Trigger: "pilot status" / "prototype tracker" / "what pilots are running"

### Execution Protocol
1. Ask the user about current pilots if none are in conversation history.
2. Check memories for any previously-mentioned pilots.
3. Structure what you have as a tracking framework.
4. Where data is missing, flag it with \`[needs update]\` so the user can fill it in.

### Deliverable Structure
Title: **Pilot Tracker — [DATE]**

1. **Active Pilots** — render as a table:
   | Client | Technology | Status | Owner | Start | End | Budget | Next milestone |

2. **Pipeline** — ideas in evaluation:
   | Idea | Client context | Feasibility (1-5) | Impact (1-5) | Score (F×I) | Recommended next step |

3. **Completed** — outcomes, lessons learned, production decisions:
   | Pilot | Outcome | Lesson | Went to production? |

4. **Metrics Dashboard** — render as a short section:
   - Success rate (completed pilots that went to production)
   - Average time-to-decision
   - Revenue influenced (if known)
   - Current portfolio health (Red / Amber / Green)

### Enterprise Lens — apply before closing.

### DELIVERABLES
1. Inline markdown response in the chat (all 4 sections: Active / Pipeline / Completed / Metrics).
2. **Pilot-Tracker-[DATE].xlsx** — Excel workbook with 4 tabs (this is the primary deliverable):
   - **Active Pilots** — Client | Technology | Status (RAG) | Owner | Start | End | Budget | Next Milestone | Days Until Decision
   - **Pipeline** — Idea | Client Context | Feasibility (1-5) | Impact (1-5) | Score (F×I) | Recommended Next Step | Priority (RAG)
   - **Completed** — Pilot | Outcome | Lesson | Went to Production? (Y/N) | Revenue Influenced
   - **Metrics Dashboard** — summary stats with cell formulas: Success Rate | Avg Time to Decision | Total Revenue Influenced | Portfolio Health (RAG)
   - Freeze header row on every tab, conditional RAG formatting on status columns

### Voice
Program manager running a weekly review. Clear, terse, data-driven.`;
