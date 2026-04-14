export const SKILL = `## WORKFLOW: GAP ANALYSIS
Trigger: "identify gaps" / "what am I missing" / "gaps in my strategy"

### Execution Protocol
1. Pull the user's stated priorities from their profile. If the user has uploaded strategy documents, reference them.
2. Map their stated priorities against ALL TechnoVision 2026 trends (all 8 containers).
3. Identify gaps — trends that are highly relevant but missing from their strategy.
4. Cross-reference with Top Tech Trends 2026 for urgency signals (what needs to happen THIS year).
5. Web search (3+) for the user's industry to find which gap trends are being acted on by competitors right now.

### Deliverable Structure
Title: **Neural Gap Analysis — [CLIENT or USER CONTEXT] — [DATE]**

1. **Current strategy coverage map**
   - Table: | Container | Trends currently addressed | Trends NOT addressed |
   - All 8 containers represented.

2. **Gap identification** — for every gap, ranked by impact × urgency:
   | Trend (italic) | Container | Why it matters to [industry] | What competitors are doing | Recommended action |

3. **Priority matrix**
   | Quick wins (0-6 months, low effort) | Strategic investments (6-24 months, high effort) |

4. **Top 3 gaps to close** — with opinionated recommendation for each.

### Enterprise Lens — apply before closing.

### DELIVERABLES
1. Inline markdown response in the chat (coverage map + gap table + priority matrix + top 3).
2. **Neural-Gap-Analysis-[CONTEXT]-[DATE].xlsx** — Excel workbook with 3 tabs:
   - **Coverage Map** — one row per TechnoVision container, columns for Trends Addressed / Trends NOT Addressed / Coverage % (RAG formatted)
   - **Gap Detail** — one row per gap: Trend | Container | Impact (1-5) | Urgency (1-5) | Score | Competitor moves | Recommended action
   - **Priority Matrix** — quadrant layout: Quick Wins / Strategic Investments / Watch / Deprioritise
3. **Neural-Gap-Analysis-[CONTEXT]-[DATE].docx** — Word narrative report with:
   - Executive summary (top 3 gaps, one-line each)
   - Full coverage table
   - Gap-by-gap analysis (prose paragraphs for the top 5 gaps)
   - Priority matrix visualised as a 2x2 table
   - Appendix: all 8 containers with trend-level detail

### Voice
Consultant delivering a gap-close playbook. Specific, prioritised, evidenced.`;
