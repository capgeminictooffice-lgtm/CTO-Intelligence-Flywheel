// Standalone Opus access test. Reads ANTHROPIC_API_KEY from .env.local.
// Run: node scripts/test-opus.mjs
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");

let apiKey;
try {
  const env = readFileSync(envPath, "utf8");
  const match = env.match(/^ANTHROPIC_API_KEY=(.+)$/m);
  if (!match) throw new Error("ANTHROPIC_API_KEY not found in .env.local");
  apiKey = match[1].trim();
} catch (err) {
  console.error("Could not read .env.local:", err.message);
  process.exit(1);
}

console.log("Key loaded — length:", apiKey.length);

async function test(model) {
  console.log(`\n→ Testing ${model}...`);
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 20,
      messages: [{ role: "user", content: "Say hello in 5 words." }],
    }),
  });
  const body = await res.json();
  if (res.ok) {
    const text = body.content?.[0]?.text ?? JSON.stringify(body.content);
    console.log(`  ✅ ${res.status} — "${text}"`);
    console.log(`  usage:`, body.usage);
  } else {
    console.log(`  ❌ ${res.status} —`, JSON.stringify(body.error || body));
  }
  return res.ok;
}

await test("claude-sonnet-4-6");
await test("claude-opus-4-6");
