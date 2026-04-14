import { TECH_ROADMAP_TEMPLATE } from "./shared/templates";

export const SKILL = `## WORKFLOW: TECH ROADMAP GENERATOR
Trigger: "generate tech roadmap" / "technology roadmap" / "3-year plan"

### Execution Protocol
1. Use the user's gap analysis results if available in conversation history or memories; otherwise run a lightweight gap assessment inline first.
2. Map TechnoVision trends to a 3-year timeline based on maturity signals.
3. Layer in industry-specific adoption curves from Top Tech Trends 2026.
4. Web search (3+) for industry-specific roadmap benchmarks.
5. Create the phased roadmap with initiatives, budgets, team composition, and KPIs.

${TECH_ROADMAP_TEMPLATE}

### Enterprise Lens — apply before closing.

### DELIVERABLES
1. Inline markdown response in the chat (the 10-slide narrative structure above).
2. **Neural-Tech-Roadmap-[CLIENT]-[DATE].pptx** — PowerPoint deck, 10 slides exactly matching the template:
   - Slide 1: Navy title slide, "Powered by TechnoVision 2026" subtitle
   - Slides 2-3: Current state + Vision (with maturity heatmap rendered as table)
   - Slides 4-6: Three horizons (H1/H2/H3), each with initiative cards
   - Slide 7: Impact vs Effort matrix (rendered as 2x2 table or python-pptx shape layout)
   - Slide 8: Investment summary with stat callouts
   - Slide 9: Risk register (table)
   - Slide 10: Next steps + governance
   - Speaker notes populated on every slide
3. **Neural-Tech-Roadmap-[CLIENT]-Initiatives-[DATE].xlsx** — Excel workbook detailing all initiatives across horizons: Initiative | Horizon | TechnoVision Trend | Container | Budget Range | Team Profile | KPI | Dependencies | Status (RAG)

### Voice
Chief architect presenting to the C-suite. Opinionated on sequencing. Honest about risk.`;
