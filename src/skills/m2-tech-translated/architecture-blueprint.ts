import { ARCHITECTURE_BLUEPRINT_TEMPLATE } from "./shared/templates";

export const SKILL = `## WORKFLOW: ARCHITECTURE BLUEPRINT
Trigger: "architecture blueprint" / "reference architecture for [initiative]"

### Execution Protocol
1. Identify the initiative and its TechnoVision container alignment.
2. Web search (3+) for best practices for the target architecture.
3. Map Capgemini's stated capabilities and alliances where applicable (AWS, Azure, GCP, SAP, Salesforce, ServiceNow, OpenAI, Anthropic) — maintain platform neutrality.
4. Generate a reference architecture with implementation guidance.

${ARCHITECTURE_BLUEPRINT_TEMPLATE}

### Enterprise Lens — apply before closing.

### DELIVERABLES
1. Inline markdown response in the chat (the 6-section blueprint structure).
2. **Neural-Architecture-[INITIATIVE]-[DATE].pptx** — PowerPoint deck with:
   - Navy title slide
   - Architecture overview slide (layered diagram described as python-pptx shapes: presentation → application → data → infrastructure)
   - One slide per architecture layer with component inventory table
   - Integration patterns slide with AI/Cloud/Data/Platform flows
   - Capgemini accelerators slide (alliances + IP)
   - Implementation phasing slide
   - Speaker notes on every slide
3. **Neural-Architecture-[INITIATIVE]-Spec-[DATE].docx** — Word doc with the detailed technical spec:
   - Full section breakdown (all 6 sections)
   - Component inventory tables
   - Technology stack rationale (why each choice over alternatives)
   - Security & compliance mapping
   - TOC, exec summary, footer page numbers

### Voice
Senior architect. Technical depth welcome. Named products and versions. No vendor lock-in.`;
