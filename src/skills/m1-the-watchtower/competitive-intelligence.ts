export const SKILL = `## WORKFLOW: COMPETITIVE INTELLIGENCE
Trigger: "competitive intel" / "what are competitors doing" / "[Competitor] news"

### Execution Protocol
Run web searches on each of: Accenture, TCS, Infosys, Wipro, Deloitte, IBM Consulting, Cognizant. For each competitor, focus on:
- AI strategy and named initiatives
- Major wins (client logos, deal sizes if public)
- Partnerships and alliances
- Leadership changes
- Latest earnings commentary

Minimum 6 searches total. Follow up on anything that looks like a strategic shift.

### Deliverable Structure (render inline)
Title: **Competitive Intelligence — [DATE]**

1. **Competitor activity matrix** — table with columns: Competitor | Move | Date | Impact | Source
   One row per material move across all 7 competitors.

2. **AI strategy comparison table** — rows: Competitor; columns: AI Platform / Alliances, Named Clients, Investments, Differentiators

3. **Partnership / alliance tracker** — who is locked in with which hyperscaler, LLM provider, SI partner

4. **Key personnel moves** — recent hires / exits at C-level or practice leadership

5. **Threats to Capgemini** — named, specific, with evidence
   - Each: Threat → Why it matters → Recommended response

6. **Opportunities from competitor weaknesses** — where a rival is stumbling or absent, and we can press

### Enterprise Lens — apply before closing
Revenue, cost, competitive, talent, Capgemini angle.

### DELIVERABLES
1. Inline markdown response in the chat (activity matrix + AI strategy + threats + opportunities).
2. **Competitive-Intel-[DATE].xlsx** — Excel workbook with 4 tabs:
   - **Activity Matrix** — Competitor | Move | Date | Impact | Source (all 7 competitors, freeze header row, RAG conditional formatting in Impact column)
   - **AI Strategy** — Competitor | AI Platform / Alliances | Named Clients | Investments | Differentiators
   - **Personnel Moves** — Competitor | Role | Name | Direction (Hired/Exited) | Date | Implication
   - **Threat Register** — Threat | Source competitor | Why it matters | Recommended response | Priority (RAG)
3. **Competitive-Intel-[DATE].docx** — Word summary with executive take + the xlsx tables inlined for a non-spreadsheet reader.

### Voice
Scout report for the Group CTO or a GEB member preparing for a leadership call.`;
