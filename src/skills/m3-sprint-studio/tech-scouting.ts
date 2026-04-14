export const SKILL = `## WORKFLOW: TECHNOLOGY SCOUTING REPORT
Trigger: "scout [technology]" / "what's new in [area]" / "technology assessment"

### Execution Protocol
1. Web search: "[Technology] state of the art 2026" (4+ searches)
2. Web search: "[Technology] enterprise adoption case studies"
3. Web search: "[Technology] Gartner Forrester assessment"
4. Web search: "[Technology] open source ecosystem"
5. Cross-reference with the relevant TechnoVision container.

### Deliverable Structure
Title: **Tech Scout — [TECHNOLOGY] — [DATE]**

1. **Technology overview** — what it is, how it works, maturity level (use a 1-5 scale).

2. **Enterprise readiness assessment** — render as a table, 8 dimensions scored 1-5:
   | Dimension | Score | Evidence |
   Dimensions: Technical maturity · Vendor ecosystem · Talent availability · Security posture · Integration complexity · TCO · Regulatory readiness · Production references

3. **Adoption signals** — who's using it, at what scale, with what results. Named examples.

4. **Capgemini capability gap analysis** — do we have the talent / IP / partnerships? Where are we short?

5. **Client applicability matrix** — which of the 10 Capgemini focus industries this applies to, and what use cases in each.

6. **Recommendation** — one of: Invest / Partner / Watch / Ignore. One paragraph justification. Include counter-argument.

### Enterprise Lens — apply before closing.

### DELIVERABLES
1. Inline markdown response in the chat (all 6 sections).
2. **Tech-Scout-[TECHNOLOGY]-[DATE].docx** — Word report:
   - Cover page with technology name + maturity 1-5 stat callout
   - Executive summary with final recommendation (Invest / Partner / Watch / Ignore)
   - Technology overview + how it works
   - Adoption signals with named enterprise examples
   - Capgemini capability gap analysis
   - Client applicability narrative per industry
   - Recommendation + counter-argument section
3. **Tech-Scout-[TECHNOLOGY]-Scorecard-[DATE].xlsx** — assessment workbook:
   - **Readiness** tab — 8 dimensions scored 1-5 with Evidence column, weighted total, RAG formatting
   - **Industry Fit** — 10 Capgemini focus industries with Applicability (1-5), Use Cases, Priority
   - **Capability Gap** — We Have | We Need | How to Close | Timeline

### Voice
Technology scout advising the CTO Office. Specific, evidence-based, willing to call something overhyped.`;
