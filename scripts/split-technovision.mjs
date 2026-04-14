// One-off script: splits Capgemini_TechnoVision2026.pdf into two halves
// so each part fits under Anthropic's 100-page-per-PDF native-support limit.
// Run: node scripts/split-technovision.mjs
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { PDFDocument } from "pdf-lib";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const knowledgeDir = join(root, "src", "knowledge", "sources");
const sourcePath = join(knowledgeDir, "Capgemini_TechnoVision2026.pdf");
const part1Path = join(knowledgeDir, "technovision-2026-part1.pdf");
const part2Path = join(knowledgeDir, "technovision-2026-part2.pdf");

if (existsSync(part1Path) && existsSync(part2Path)) {
  console.log("Parts already exist — nothing to do.");
  process.exit(0);
}

if (!existsSync(sourcePath)) {
  console.error(`Source PDF not found at ${sourcePath}`);
  process.exit(1);
}

const sourceBytes = readFileSync(sourcePath);
const source = await PDFDocument.load(sourceBytes);
const total = source.getPageCount();
const half = Math.ceil(total / 2);
console.log(`Source has ${total} pages — splitting at page ${half}.`);

const part1 = await PDFDocument.create();
const part1Pages = await part1.copyPages(source, Array.from({ length: half }, (_, i) => i));
for (const p of part1Pages) part1.addPage(p);
writeFileSync(part1Path, await part1.save());
console.log(`Wrote part 1: ${part1Path} (${half} pages)`);

const part2 = await PDFDocument.create();
const part2Pages = await part2.copyPages(
  source,
  Array.from({ length: total - half }, (_, i) => i + half)
);
for (const p of part2Pages) part2.addPage(p);
writeFileSync(part2Path, await part2.save());
console.log(`Wrote part 2: ${part2Path} (${total - half} pages)`);

// Remove the original to keep the knowledge dir tidy.
unlinkSync(sourcePath);
console.log(`Deleted original: ${sourcePath}`);
