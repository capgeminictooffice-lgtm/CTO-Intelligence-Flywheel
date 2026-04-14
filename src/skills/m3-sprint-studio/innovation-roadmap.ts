export const SKILL = `## WORKFLOW: INNOVATION ROADMAP BUILDER
Trigger: "innovation roadmap for [client/industry]" / "technology roadmap"

### Execution Protocol
1. Web search: "[Industry] technology adoption curve 2026-2028" (2+ searches)
2. Web search: "[Industry] innovation leaders case studies"
3. Reference TechnoVision 2026 containers relevant to the domain — name the trends.
4. Cross-reference Top Tech Trends 2026 for timing signals.

### Deliverable Structure
Title: **Innovation Roadmap — [TOPIC] — [DATE]**

1. **Current state assessment framework**
   - Maturity heatmap as a text table (rows: capabilities, columns: maturity 1-5)
   - Key capabilities vs key gaps

2. **3-horizon model** — render as a structured section per horizon:

   ### Horizon 1 — 0-6 months: Quick wins, proven technologies
   - Initiatives (3-5), each with:
     - Description
     - TechnoVision trend (italicised, container named)
     - Investment sizing (order of magnitude)
     - Success metric
     - Owner profile

   ### Horizon 2 — 6-18 months: Scaling pilots, emerging capabilities
   - Same structure

   ### Horizon 3 — 18-36 months: Transformational bets, frontier tech
   - Same structure

3. **Technology recommendations per horizon** — mapped explicitly to TechnoVision containers.

4. **Investment sizing** — total investment range across all 3 horizons, with year-by-year phasing.

5. **Success metrics and KPI framework** — what to measure and when.

6. **Risk register** — top 5 risks with mitigation.

### Enterprise Lens — apply before closing.

### DELIVERABLES
1. Inline markdown response in the chat (current state + 3 horizons + investment sizing + risks).
2. **Innovation-Roadmap-[TOPIC]-[DATE].pptx** — PowerPoint deck:
   - Navy title slide
   - Current state slide with maturity heatmap (python-pptx table with RAG cell shading)
   - One slide per horizon (H1/H2/H3) with initiative cards laid out as shapes
   - Investment summary slide with stat callouts for totals per horizon
   - KPI framework slide
   - Risk register slide
   - Speaker notes on every slide
3. **Innovation-Roadmap-[TOPIC]-Initiatives-[DATE].xlsx** — portfolio tracker:
   - **Initiatives** tab — Initiative | Horizon | TechnoVision Trend | Container | Investment | Success Metric | Owner Profile | Status (RAG)
   - **Investment** tab — year-by-year phasing with totals
   - **Risks** tab — Risk | Likelihood | Impact | Mitigation | Owner

### Voice
Portfolio manager briefing an innovation board. Specific about bets, honest about uncertainty.`;
