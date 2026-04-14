// Text chunker — splits PDF text into ~800 token chunks with 150 token overlap.
// Respects paragraph and heading boundaries when possible.

const TARGET_TOKENS = 800;
const OVERLAP_TOKENS = 150;
const CHARS_PER_TOKEN = 4; // rough approximation

const TARGET_CHARS = TARGET_TOKENS * CHARS_PER_TOKEN;
const OVERLAP_CHARS = OVERLAP_TOKENS * CHARS_PER_TOKEN;

export type Chunk = {
  index: number;
  section: string | null;
  text: string;
};

export function chunkText(raw: string): Chunk[] {
  // Normalise whitespace, preserve paragraph breaks.
  const normalized = raw
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  const chunks: Chunk[] = [];
  let idx = 0;
  let currentSection: string | null = null;
  let cursor = 0;

  while (cursor < normalized.length) {
    const end = Math.min(cursor + TARGET_CHARS, normalized.length);
    let sliceEnd = end;

    // Try to cut at a paragraph boundary near the target.
    if (end < normalized.length) {
      const para = normalized.lastIndexOf("\n\n", end);
      if (para > cursor + TARGET_CHARS * 0.5) sliceEnd = para;
      else {
        const sentence = normalized.lastIndexOf(". ", end);
        if (sentence > cursor + TARGET_CHARS * 0.5) sliceEnd = sentence + 1;
      }
    }

    const text = normalized.slice(cursor, sliceEnd).trim();
    if (text.length > 0) {
      // Detect a section heading in the first line (very rough).
      const firstLine = text.split("\n")[0];
      if (firstLine.length < 120 && /^[A-Z0-9]/.test(firstLine) && !firstLine.endsWith(".")) {
        currentSection = firstLine;
      }
      chunks.push({ index: idx++, section: currentSection, text });
    }

    if (sliceEnd >= normalized.length) break;
    cursor = Math.max(sliceEnd - OVERLAP_CHARS, cursor + 1);
  }

  return chunks;
}
