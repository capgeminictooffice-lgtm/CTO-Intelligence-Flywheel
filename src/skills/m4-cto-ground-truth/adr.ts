export const SKILL = `## WORKFLOW: ARCHITECTURE DECISION RECORD
Trigger: "X vs Y?" / "migrate to X?" / "is X ready?" / technology comparison

### Execution Protocol
1. Web search: both technologies — comparison, known gotchas, migration experiences (3+ searches each)
2. Web search: engineer sentiment, adoption signals, vendor health
3. Web search: real-world failure stories for each option
4. Score across 10 dimensions

### Deliverable Structure
Title: **ADR — [TITLE] — [DATE]**

1. **Context and decision drivers** — why this decision is happening now

2. **Options** — for each option:
   - **Pros**
   - **Cons**
   - **Cost (3yr TCO)**

3. **10-dimension trade-off matrix** — render as a table:
   | Dimension | Weight | Option A score | Option B score | Weighted A | Weighted B |
   Dimensions: Performance · 3yr TCO · Ops Complexity · Talent · Ecosystem · Vendor Health · Security · Migration Effort · Lock-in · Innovation

4. **Weighted score total** — with a clear winner

5. **Risk register** — top 5 risks for the recommended option, each with mitigation

6. **Recommendation** — bold, specific, with the strongest counter-argument explicitly called out and rebutted.

7. **Reversibility assessment** — how hard is it to back out of this decision, and at what cost?

8. **Implementation roadmap** — month by month, minimum 6 months.

### Enterprise Lens — apply before closing.

### DELIVERABLES
1. Inline markdown response in the chat (all 8 sections of the ADR).
2. **ADR-[TITLE]-[DATE].docx** — Word document in formal ADR format:
   - Navy title page with decision title + date + status (Proposed / Accepted)
   - Context and decision drivers
   - Options with pros/cons/cost sub-sections
   - 10-dimension trade-off matrix as a formatted table with weighted totals and conditional highlighting for the winning column
   - Risk register table
   - Recommendation with the counter-argument explicitly rebutted
   - Reversibility + cost-to-reverse assessment
   - Month-by-month implementation roadmap
   - Footer with review sign-off placeholders

### Voice
Principal architect making a call in front of the architecture review board. No hedging.`;
