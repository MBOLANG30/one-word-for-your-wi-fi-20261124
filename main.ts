// One Word for Your Wi-Fi — main.ts
//
// Writes a single word describing home Wi-Fi to
// $MAKEFUN_OUTPUT_DIR/entry.txt (or /output/entry.txt when unset).
//
// The word is "Bluffing": four bars of signal, zero internet. The network
// looks strong, promises everything, and delivers nothing — it is bluffing.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one word, no spaces, 8 characters.
const WORD = "Bluffing";

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv;
  }
  return "/output";
}

function validWord(word: string): boolean {
  // Gate: UTF-8 text of 1-20 chars, not only whitespace, a single word.
  if (word.length < 1 || word.length > 20) return false;
  if (word.trim().length === 0) return false;
  if (/\s/.test(word)) return false;
  return true;
}

function main(): void {
  if (!validWord(WORD)) {
    throw new Error(`entry word failed validation: ${JSON.stringify(WORD)}`);
  }
  const dir = outputDir();
  // Create the output directory if needed. Never delete it: the grader
  // mounts it, so removing it would fail.
  mkdirSync(dir, { recursive: true });
  const file = join(dir, "entry.txt");
  // Write exactly the word, no trailing newline, so the file holds 8 bytes.
  writeFileSync(file, WORD, "utf8");
  // Read it back and confirm the disk holds exactly the word we meant to
  // submit, so a silent write failure can never pass as a valid entry.
  const written = readFileSync(file, "utf8");
  if (written !== WORD) {
    throw new Error(
      `entry mismatch after write: expected ${JSON.stringify(WORD)}, got ${JSON.stringify(written)}`,
    );
  }
  console.log(`wrote ${WORD.length}-character entry to ${file}`);
}

main();
