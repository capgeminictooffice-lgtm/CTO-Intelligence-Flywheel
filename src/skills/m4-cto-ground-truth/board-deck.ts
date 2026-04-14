export const SKILL = `## WORKFLOW: BOARD DECK GENERATOR
Trigger: "board deck" / "quarterly update"

### Execution Protocol
1. Web search: industry trends, competitor moves, AI adoption metrics (3+ searches)
2. Pull past memories for project history, incidents, AI initiatives, talent moves.

### Deliverable Structure — 10-slide narrative (render as H2 per slide)
Title: **Board Update — Q[X] [YEAR] — [DATE]**

### Slide 1 — Executive Summary
- 3 wins
- 2 risks
- 1 board ask

### Slide 2 — Tech Investment vs Budget
- Actual vs plan
- Variance commentary

### Slide 3 — Project Delivery Scorecard
- Top 5-10 projects, RAG status, key milestone

### Slide 4 — Operational Resilience Metrics
- Uptime, incident count, MTTR, security incidents

### Slide 5 — AI & Innovation Portfolio
- Active initiatives, pilot-to-prod rate, headline outcomes

### Slide 6 — Cybersecurity Posture
- Threat landscape, posture score, notable incidents, remediation

### Slide 7 — Talent Pipeline
- Open roles, attrition, skills gaps, hiring velocity

### Slide 8 — Industry Landscape
- What's changed in the market since last board
- Competitor moves affecting us

### Slide 9 — Board Decisions Needed
- Each decision: Options → Recommendation → Implications

### Slide 10 — Next Steps
- Immediate actions, next review

### Enterprise Lens — apply before closing.

### DELIVERABLES
1. Inline markdown response in the chat (10-slide narrative).
2. **Board-Update-Q[X]-[YEAR].pptx** — 10-slide board deck matching the structure exactly:
   - Slide 1: Navy title "Q[X] Board Update — [Date]" with Capgemini branding feel
   - Slide 2: Executive summary (3 wins / 2 risks / 1 ask as large callout boxes)
   - Slide 3: Tech investment vs budget (stacked bar or table, variance commentary)
   - Slide 4: Project delivery scorecard (RAG table)
   - Slide 5: Operational resilience (stat callouts for uptime, MTTR, incidents)
   - Slide 6: AI & innovation portfolio
   - Slide 7: Cybersecurity posture
   - Slide 8: Talent pipeline
   - Slide 9: Industry landscape (competitor moves as a compact table)
   - Slide 10: Board decisions needed (each with Options → Recommendation → Implications)
   - Speaker notes on every slide — these are what the CTO actually says
3. **Board-Update-Q[X]-Appendix-[DATE].docx** — Word appendix with supporting data:
   - Detailed project status (all projects, not just top 10)
   - Full incident log
   - Investment breakdown
   - Source data and methodology notes

### Voice
Board-ready. Executive brevity. Numbers dominate narrative.`;
