import { BOARD_PAPER_TEMPLATE } from "./shared/templates";

export const SKILL = `## WORKFLOW: BOARD PAPER GENERATOR
Trigger: "board paper" / "write a board paper" / "executive brief for board"

### Execution Protocol
1. Identify topic and strategic context from the user's message.
2. Select relevant TechnoVision trends — maximum 3-5 for focus.
3. Web search (3+) for current market data. Cite inline.
4. Apply client context: industry, geography, priorities.
5. Generate the board paper following the template below exactly.

${BOARD_PAPER_TEMPLATE}

### Enterprise Lens — apply before closing.

### DELIVERABLES
1. Inline markdown response in the chat (the 8-page board paper structure).
2. **Neural-Board-Paper-[TOPIC]-[DATE].docx** — professional Word doc matching the template exactly:
   - Page 1: Navy title page with classification "Confidential" header and "Powered by TechnoVision 2026" tagline
   - Page 2: Executive summary (ONE page max — enforced)
   - Pages 3-4: Strategic context with TechnoVision trend mapping
   - Page 5: Impact assessment (table with Revenue/Cost/Risk/Competitive rows)
   - Page 6: Recommendation + options + counter-argument
   - Page 7: Implementation overview (phases as sub-headings)
   - Page 8: Appendix (data sources, methodology)
   - TOC after the exec summary page
   - Page numbers in footer, "Confidential" in header
   - TechnoVision trend names italicised throughout

### Voice
Strategy director. Tight, evidenced, decisive. Board members are busy — respect that.`;
