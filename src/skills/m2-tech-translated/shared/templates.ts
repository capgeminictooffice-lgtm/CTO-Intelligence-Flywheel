// Reusable output templates for m2 workflows.

export const BOARD_PAPER_TEMPLATE = `## BOARD PAPER OUTPUT TEMPLATE
Structure the deliverable as 6-8 "pages" of markdown (use H2 headings to divide pages). Maximum 200 words per page.

### Page 1 — Title block
- Title: [Topic] — Strategic Technology Brief
- Subtitle: Prepared for [Client/Board] | [Date]
- Classification: Confidential
- Powered by: TechnoVision 2026

### Page 2 — Executive Summary (ONE page max)
- **Context**: 2-3 sentences on why this matters now
- **Key Finding**: the single most important insight
- **Recommendation**: clear, opinionated, with timeline
- **Investment**: order-of-magnitude estimate

### Pages 3-4 — Strategic Context
- **TechnoVision trend mapping**: which containers and trends apply, italicised
- **Market data**: sourced from web search, cited inline
- **Industry landscape**: competitive dynamics

### Page 5 — Impact Assessment
- **Revenue Impact**: quantified or directional
- **Cost Impact**: quantified or directional
- **Risk Impact**: what happens if we don't act
- **Competitive Impact**: how this changes our position vs Accenture / TCS / Infosys

### Page 6 — Recommendation & Options
- **Recommended Path** (bold, specific)
- **Alternative 1** with trade-offs
- **Alternative 2** with trade-offs
- **Counter-argument**: strongest objection + rebuttal

### Page 7 — Implementation Overview
- Phase 1 (0-3 months)
- Phase 2 (3-6 months)
- Phase 3 (6-12 months)
- Key dependencies and risks

### Page 8 — Appendix
- Data sources, methodology, detailed analysis

### Formatting rules for the board paper
- Bold stat callouts for key numbers
- Tables for any comparison
- TechnoVision trend names italicised
- Use dividers (\`---\`) between pages so the markdown is visually chunked
`;

export const TECH_ROADMAP_TEMPLATE = `## TECH ROADMAP OUTPUT TEMPLATE
Structure as 8-10 "slides" of markdown (H2 per slide). This is a roadmap deck rendered as text.

### Slide 1 — Title
- **[Client] Technology Roadmap [Year Range]**
- Subtitle: "Powered by TechnoVision 2026"

### Slide 2 — Current State
- Technology maturity assessment
- Key capabilities and gaps
- Describe a maturity heatmap or radar (as a text table)

### Slide 3 — Vision
- Where technology takes the business
- 3-year north star statement
- Before → after comparison

### Slides 4-6 — Three Horizons
- **H1 (0-12 months) — Foundation**: data, infrastructure, governance. 3-4 initiatives, each with TechnoVision trend link, budget range, KPIs.
- **H2 (12-24 months) — Acceleration**: AI integration, automation, new capabilities. 3-4 initiatives.
- **H3 (24-36 months) — Transformation**: autonomous operations, new business models. 3-4 initiatives.

### Slide 7 — Initiative Portfolio
- Matrix: Impact vs Effort (use a text table or quadrant description)
- Color-coded by horizon

### Slide 8 — Investment Summary
- Total investment range
- ROI timeline
- Comparison to industry benchmarks

### Slide 9 — Risk Register
- Top 5 risks with mitigation strategies

### Slide 10 — Next Steps
- Immediate actions (next 30 days)
- Decision points needed
- Governance structure
`;

export const ARCHITECTURE_BLUEPRINT_TEMPLATE = `## ARCHITECTURE BLUEPRINT OUTPUT TEMPLATE
Structure the deliverable in 6 sections.

### Section 1 — Architecture Overview
- Purpose and scope
- Design principles (list 5-7)
- **TechnoVision alignment** — which trends drive this architecture (italicised, with containers)

### Section 2 — Logical Architecture
- Layer descriptions (presentation, application, data, infrastructure)
- Component inventory
- Integration patterns

### Section 3 — Technology Stack
- Recommended technologies per layer
- Selection rationale — why this over alternatives
- Vendor considerations — maintain platform neutrality

### Section 4 — Data Architecture
- Data flows
- Storage strategy
- Governance and privacy

### Section 5 — Security & Compliance
- Security controls per layer
- Compliance requirements mapping
- Identity and access management

### Section 6 — Implementation
- Build phases
- Team composition
- Timeline and milestones
`;
