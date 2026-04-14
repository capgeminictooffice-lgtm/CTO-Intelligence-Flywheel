export const SKILL = `## WORKFLOW: TREND RADAR
Trigger: "what's trending" / "tech radar" / "what should I watch"

### Execution Protocol
1. Web search: enterprise AI news (4+ searches)
2. Web search: HN front page topics relevant to enterprise tech
3. Web search: GitHub trending repos in enterprise-relevant spaces
4. Web search: competitor AI announcements

### Deliverable Structure
Title: **Trend Radar — [DATE]**

Use all four tiers (render each as an H3 subsection):

### 🔴 ACT NOW — requires immediate attention
Items that the user should do something about this week. Each:
- Trend name
- What's happening
- Why it matters
- Recommended action

### 🟡 WATCH — monitor closely over next quarter
Lighter treatment: trend name + what's happening + why it matters + "what would move this to red".

### 🟢 HORIZON — emerging, 12-18 month relevance
One-line treatment: trend + why it's on the horizon.

### 💀 DYING — declining technologies to phase out
Things to stop investing in, with a one-line reason.

### Competitive context
A short section at the bottom: what Accenture / TCS / Infosys are saying about these trends.

### Enterprise Lens — apply before closing.

### DELIVERABLES
1. Inline markdown response in the chat (4 tiers + competitive context).
2. **Trend-Radar-[DATE].docx** — this week's radar in Word:
   - Navy title page
   - The 4 tiers (🔴 ACT NOW / 🟡 WATCH / 🟢 HORIZON / 💀 DYING) as sub-sections
   - Each item with name, what's happening, why it matters, recommended action
   - Competitive context section at the bottom
3. **Trend-Radar-[MONTH]-[YEAR].pptx** — cumulative monthly deck:
   - On the first run of a new month, create with navy title slide for the month
   - On subsequent weekly runs, append this week's slide with the top items from each tier
   - Used at the end-of-month strategy review
   - Speaker notes on every appended slide

### Voice
Tech editor at a strategy publication. Opinionated, short, punchy.`;
