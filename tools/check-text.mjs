// Fails when a tracked file contains an escaped dash (the six characters backslash, u, 2, 0, 1, 4 or 2, 0, 1, 3) or an
// em dash character. Tools like Python's json.dumps write the escapes instead of the character; write a normal dash (-)
// instead of either (user's rules, 2026-10-24 and 2026-10-25). Run by `pnpm lint`.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const escaped = new RegExp(String.raw`\\u201[34]`, 'i');
// Built from its code point, so this file doesn't contain one.
const emDash = String.fromCodePoint(0x2014);
const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const found = [];
for (const file of files) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    continue; // deleted in the working tree
  }
  text.split('\n').forEach((line, i) => {
    if (escaped.test(line)) found.push(`${file}:${i + 1}: escaped dash`);
    if (line.includes(emDash)) found.push(`${file}:${i + 1}: em dash`);
  });
}
for (const f of found) console.error(`${f}; write a normal dash (-)`);
process.exit(found.length ? 1 : 0);
