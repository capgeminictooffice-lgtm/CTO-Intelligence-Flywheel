export const SKILL = `## WORKFLOW: CONTRACT REVIEW
Trigger: "[vendor] renewal" / "renegotiate [vendor]"

### Execution Protocol
1. Web search: vendor pricing, list vs actual
2. Web search: vendor market position, recent customer defections
3. Web search: competing offers in the same category (at least 2 alternatives)
4. Check memories for past negotiation history with this vendor.

### Deliverable Structure
Title: **Contract Review — [VENDOR] — [DATE]**

1. **Current contract summary** — what we have, what we pay, what's in scope

2. **Market comparison table** — vendor vs 2-3 alternatives:
   | Vendor | Pricing | Features | Reference customers | Switching cost |

3. **Leverage points** — enumerate each:
   - Market leverage (is the vendor under competitive pressure?)
   - Volume leverage (are we a big customer?)
   - Timing leverage (end of vendor's fiscal quarter?)
   - Switching leverage (how credible is a migration?)
   - Multi-year leverage (what do we get for a 3yr commit?)

4. **Negotiation strategy**
   - **Target price** (what we want)
   - **Walk-away price** (what we won't go above)
   - **BATNA** (best alternative to a negotiated agreement)

5. **Tactics**
   - Lead with: [opening position]
   - Anchor on: [framing]
   - Ask for: [concessions]
   - Concede: [what we'll give up]

6. **Recommendation** — opinionated: renew, renegotiate hard, or switch. With reasoning.

7. **Risk if we switch** — honest assessment of the transition cost.

### Enterprise Lens — apply before closing.

### DELIVERABLES
1. Inline markdown response in the chat (contract summary + comparison + leverage + strategy + tactics).
2. **Contract-[VENDOR]-[DATE].docx** — Word negotiation brief:
   - Navy title page with vendor + date + target savings in a stat callout
   - Executive summary (current spend, target, walk-away, BATNA)
   - Current contract summary
   - Full narrative on leverage points
   - Negotiation strategy with target/walk-away/BATNA table
   - Tactics cheat sheet (Lead / Anchor / Ask / Concede) in a call-out box
   - Recommendation
   - Switch risk assessment
3. **Contract-[VENDOR]-Comparison-[DATE].xlsx** — market comparison workbook:
   - **Vendors** tab — Vendor | Pricing | Features | Reference Customers | Switching Cost | Recommendation (RAG)
   - **Leverage** tab — Leverage Point | Strength (1-5) | Evidence | How to Use

### Voice
Chief procurement officer + CTO hybrid. Hard-nosed, specific, prepared.`;
