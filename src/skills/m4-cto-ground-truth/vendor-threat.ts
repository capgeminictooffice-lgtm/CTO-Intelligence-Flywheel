export const SKILL = `## WORKFLOW: VENDOR THREAT ASSESSMENT
Trigger: vendor + negative event — acquired / breach / price hike / shutdown

### Execution Protocol
1. Web search: event details (4+ searches)
2. Web search: acquirer history (if acquisition)
3. Web search: customer impact reports, public complaints, analyst commentary
4. Web search: alternatives — at least 3 named vendors with pricing tiers

### Deliverable Structure
Title: **Vendor Risk — [VENDOR] — [DATE]**

1. **Situation summary** — 3-5 sentences. What happened, when, confirmed by whom.

2. **Impact assessment** — table across 5 dimensions:
   | Dimension | Impact level | Detail |
   Dimensions: Data Security · Service Continuity · Cost · Contract · Talent

3. **Three scenarios** — each as a subsection:
   - **STAY** — pros, cons, cost to hold, conditions that would change this
   - **NEGOTIATE** — specific leverage points, target ask, walk-away position
   - **MIGRATE** — target alternative, timeline, effort estimate, switching cost

4. **Alternative vendor comparison table**
   | Vendor | Pricing | Feature parity | Switching cost | Reference customers |

5. **Recommendation** — opinionated. One of STAY / NEGOTIATE / MIGRATE. With a paragraph justifying the choice.

6. **Immediate actions** — table: | Action | Owner profile | Deadline |

### Enterprise Lens — apply before closing.

### DELIVERABLES
1. Inline markdown response in the chat (situation + impact + 3 scenarios + recommendation + actions).
2. **Vendor-Risk-[VENDOR]-[DATE].docx** — Word brief:
   - Navy title page with vendor + date + classification "Confidential"
   - Executive summary (situation in 3 sentences + recommended scenario + #1 action)
   - Full situation narrative
   - Impact assessment as a formatted table (5 dimensions, RAG severity)
   - The 3 scenarios as sub-sections (STAY / NEGOTIATE / MIGRATE) with pros/cons/cost
   - Alternative vendor comparison table
   - Immediate actions table with owners + deadlines
   - Appendix: sources, dates, confirmations

### Voice
Crisis-mode COO. Fast, specific, decisive.`;
