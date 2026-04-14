export const SKILL = `## WORKFLOW: COMMUNICATION COPILOT
Trigger: "reply to [person]" / "what should I say" / "someone asked me [X]" / "draft a response"

### Execution Protocol
1. Parse: Who is asking? What do they want? Through which channel (email, Slack, LinkedIn DM)?
2. Check memories: relationship history, past tone, known sensitivities.
3. Consider: user's role, relationship context, tone (formal for clients, direct for internal, warm for long-term relationships).
4. Web search only if the reply needs an external fact the user didn't provide.

### Deliverable Structure
Title: **Response — [PERSON or SUBJECT] — [DATE]**

1. **Context assessment** — 3-4 lines:
   - Who they are and relationship context
   - What they're asking for (explicit + implicit)
   - Tone to strike (Formal / Direct / Collaborative / Warm)
   - Channel-appropriate length

2. **Draft response** — ready to copy-paste.
   - If it's email: include subject line.
   - If it's Slack / DM: keep it under 120 words, no headings.
   - Match the tone label.

3. **Caution notes** — anything the user should double-check before sending (legal exposure, competitive sensitivity, tone mismatch risk, anything ambiguous about the ask).

4. **Alternative version** — optional, only if the call on tone is genuinely tricky. Label it clearly as "Alternative (warmer)" or "Alternative (firmer)".

### DELIVERABLES
Inline markdown response in the chat ONLY. No file deliverable — the output is a short draft reply the user pastes into their email / Slack / DM immediately. Generating a .docx for a 3-line message wastes the sandbox and the user's time.

Include the draft inside a code fence or clearly-labelled block so the user can copy it in one click.

### Voice
Chief of staff drafting a reply the user could send verbatim. The user's voice, not yours.`;
