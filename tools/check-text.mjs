// Fails when a tracked file contains an escaped dash (the six characters backslash, u, 2, 0, 1, 4 or 2, 0, 1, 3).
// Tools like Python's json.dumps write them instead of the character; write a normal dash (-) instead (user's rule,
// 2026-10-24). Run by `pnpm lint`.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const escaped = new RegExp(String.raw`\\u201[34]`, 'i');
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
    if (escaped.test(line)) found.push(`${file}:${i + 1}`);
  });
}
for (const f of found) console.error(`${f}: escaped dash; write a normal dash (-)`);
process.exit(found.length ? 1 : 0);
