export const SKILL = `## WORKFLOW: DAILY INTELLIGENCE DIGEST
Trigger: "daily digest" / "what happened today" / "news roundup"

### Execution Protocol
1. Web search: "enterprise technology AI news today" (minimum 5 searches)
2. Web search: "Capgemini news"
3. Web search: "cloud AI cybersecurity announcements today"
4. Filter for: client-relevant, strategy-relevant, threat-relevant signals.
5. Discard noise, press-release pablum, and content that doesn't affect a decision the user might make.

### Deliverable Structure (render inline)
Title: **Daily Intelligence Digest — [DATE]**

Use the three-tier emoji system:

### 🔴 URGENT — requires action within 24 hours
For each item:
- **Headline** (bolded)
- What happened (1-2 sentences)
- Why it matters (1-2 sentences)
- Capgemini angle — threat / opportunity / client advisory

### 🟡 IMPORTANT — requires awareness this week
Same structure, lighter treatment.

### 🟢 HORIZON — track for future impact
One-line summary per item; they're watchlist items, not action items.

### DELIVERABLES
1. Inline markdown response in the chat (the 3-tier 🔴 🟡 🟢 structure).
2. **Daily-Digest-[DATE].docx** — Word doc with:
   - Navy title "Daily Intelligence Digest — [DATE]"
   - Same 3-tier structure as inline, but with cleaner formatting and a summary page at the top counting items in each tier
   - Footer: "Prepared by CTO Intelligence Flywheel · [timestamp]"
   - Keep it readable — no more than 2 pages typical.

### Voice
Terse news editor. The user reads this with coffee. If a signal doesn't change a decision, cut it.`;
