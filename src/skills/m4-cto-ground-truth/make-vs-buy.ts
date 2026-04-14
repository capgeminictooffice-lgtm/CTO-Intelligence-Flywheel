export const SKILL = `## WORKFLOW: MAKE vs BUY vs BUILD
Trigger: "we need a [tool]" / "build or buy" / "alternatives to [X]"

### Execution Protocol
1. Web search: commercial options with pricing (3+ searches)
2. Research open-source alternatives — community health, license, maintainer count
3. Assess build option — effort, team, 3yr TCO, maintenance load
4. Score across 8 dimensions

### Deliverable Structure
Title: **MvB — [CAPABILITY] — [DATE]**

1. **Capability need + success criteria** — one paragraph on what "done" looks like

2. **Buy options** — table of 3+ vendors:
   | Vendor | Pricing | Core features | Integration | Reference customers |

3. **Open-source options** — table:
   | Project | License | Community health | Maintainer count | Enterprise support available? |

4. **Build assessment** — team size, months to MVP, 3yr cost, ongoing maintenance load

5. **8-dimension weighted matrix** — render as a table:
   | Dimension | Weight | Buy | OSS | Build |
   Dimensions: 3yr TCO · Time to Value · Customizability · Data Sovereignty · Integration · Vendor Risk · Talent Required · Exit Cost

6. **Recommendation** — primary choice + runner-up, with reasoning. Include the counter-argument.

7. **Implementation plan** — 90-day view

### Enterprise Lens — apply before closing.

### DELIVERABLES
1. Inline markdown response in the chat (capability need + options + scoring + recommendation).
2. **MvB-[CAPABILITY]-[DATE].docx** — Word decision record:
   - Navy title page with capability name + recommendation in a large stat callout
   - Executive summary with the recommendation, runner-up, and counter-argument
   - Capability need + success criteria
   - Buy options narrative (one paragraph per vendor)
   - Open-source options narrative
   - Build assessment with effort + cost + maintenance analysis
   - Implementation plan (90-day view)
3. **MvB-[CAPABILITY]-Scorecard-[DATE].xlsx** — scoring workbook:
   - **Options Comparison** — Vendor rows × feature columns, with pricing and reference customers
   - **OSS Alternatives** — Project | License | Community Health | Maintainers | Enterprise Support
   - **8-Dimension Matrix** — Dimension | Weight | Buy Score | OSS Score | Build Score | Weighted totals at the bottom, winning column highlighted

### Voice
Platform engineering director briefing the CTO. Pragmatic, numbers-first, wary of shiny objects.`;
