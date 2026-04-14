export const SKILL = `## WORKFLOW: MORNING WAR ROOM
Trigger: "hi cto" / "morning" / "brief me"

### Execution Protocol
1. Web search: overnight enterprise AI / cloud / security news (3+ searches). Focus on the last 12-18 hours.
2. Web search: "Capgemini news announcements" — last 24 hours.
3. Web search: any follow-ups on material stories.
4. If Capgemini announcements surface, also generate LinkedIn POV posts (see the embedded section below).

### Deliverable Structure
Title: **Morning War Room — [DATE]**

### 📡 Overnight Signals (top 5 developments)
Each item:
- **Headline** (bolded)
- What happened → 1-2 sentences
- Why it matters → 1-2 sentences
- Capgemini angle → threat / opportunity / client advisory

### 🔴 Items requiring decision today
Specific, actionable items. If there are none, say so — don't invent.

### 🟡 Items requiring awareness this week
Lighter treatment.

### 📰 Capgemini Signal (if announcements found)
Render 3 COMPLETE LinkedIn posts following the rules in the "LinkedIn POV" workflow. Do not give outlines — give ready-to-paste posts.

### ✅ Completion
End with:
\`\`\`
✅ DONE — Morning War Room
📁 Deliverable: Morning War Room — [DATE]
🔴 #1 Priority: [the single most important action for the user today]
\`\`\`

### DELIVERABLES
1. Inline markdown response in the chat (overnight signals + decisions + awareness + optional LinkedIn posts).
2. **Morning-Brief-[DATE].docx** — Word brief for today:
   - Navy title "Morning War Room — [DATE]"
   - The 3 tiers (📡 Signals / 🔴 Decisions / 🟡 Awareness) as sub-headings
   - If LinkedIn posts were generated, include them as a dedicated section
   - Completion report at the bottom
3. **Morning-Dashboard-Week-[WEEK]-[YEAR].xlsx** — cumulative weekly dashboard:
   - On Monday (first run of the week), create with 5 day tabs (Mon-Fri)
   - On subsequent days, append today's tab with columns: Signal | Tier | So What | Capgemini Angle | Action Taken
   - **Metrics** tab tracking week-over-week signal counts and decision follow-through
4. **Morning-Brief-Week-[WEEK]-[YEAR].pptx** — cumulative weekly deck:
   - One navy title slide for the week
   - Append one slide per day with the top 3 signals + the #1 priority
   - Used at the Friday retrospective

### Voice
CTO's chief of staff at 7am. Terse. Useful. Already read the news so the principal doesn't have to.`;
