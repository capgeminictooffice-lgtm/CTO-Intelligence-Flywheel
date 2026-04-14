export const SKILL = `## WORKFLOW: REGULATION IMPACT SCANNER
Trigger: any regulation mention — EU AI Act, DORA, NIS2, GDPR refresh, sector-specific rules

### Execution Protocol
1. Web search: requirements (minimum 5 searches across this list)
2. Web search: penalties and enforcement status
3. Web search: industry guidance from regulators
4. Web search: how Big 4 / SIs are advising clients
5. Web search: recent enforcement actions

### Deliverable Structure
Title: **[REGULATION] Impact — [DATE]**

1. **Overview** — effective dates, penalties, scope, enforcement body

2. **Applicability assessment** — does this apply to the user's client / industry, and to what degree?

3. **Requirements breakdown** — render as a table: | Requirement | Owner function | Deadline | Evidence expected |

4. **Gap analysis** — table: | Requirement | Current state | Target state | Gap | Effort to close |

5. **Risk assessment** — what's the penalty exposure, what's the reputational risk?

6. **6-month remediation roadmap** — month-by-month plan.

7. **Regulatory overlap** — does this interact with other rules the user is already managing? Flag conflicts.

8. **Capgemini advisory angle** — how is Capgemini positioned to help clients here? Named offers, alliances, IP.

### Enterprise Lens — apply before closing.

### DELIVERABLES
1. Inline markdown response in the chat (all 8 sections of the regulation impact assessment).
2. **[REGULATION]-Impact-[DATE].docx** — Word briefing:
   - Navy title page with regulation + effective date + penalty ceiling in a large stat callout
   - Executive summary (does this apply to us? + headline exposure + #1 action)
   - Full overview with enforcement body + scope
   - Requirements breakdown as a formatted table
   - Gap analysis table
   - Risk assessment with penalty exposure numbers
   - 6-month remediation roadmap as a timeline table
   - Regulatory overlap commentary
   - Capgemini advisory angle
3. **[REGULATION]-Gap-Analysis-[DATE].xlsx** — companion workbook:
   - **Requirements** tab — Requirement | Owner Function | Deadline | Evidence Expected | Current State | Gap | Effort | Status (RAG)
   - **Remediation** tab — Month-by-month action items with owners and milestones

### Voice
Regulatory affairs lead. Formal, precise, specific about dates and penalties. Zero ambiguity.`;
