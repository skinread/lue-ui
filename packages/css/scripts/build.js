// Builds @lue-ui/css with Lightning CSS and no targets, so nothing is lowered or rewritten (ADR-0002):
//   dist/lue.css            src/lue.css with its @imports bundled
//   dist/<file>.css         every other source file on its own (base.css, components/*.css, blocks, materials, contrast)
// Everything is minified. Prints Brotli sizes against the RFC-0001 §9 budgets and fails when one is passed.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { bundle, transform } from 'lightningcss';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const KB = 1024;
const BUDGET = { component: 1.5 * KB, total: 30 * KB };

// The full layer order, prepended to every file after minifying (the minifier drops names a file doesn't use).
const LAYERS = '@layer lue.reset, lue.tokens, lue.base, lue.layout, lue.components, lue.blocks, lue.materials, lue.contrast, lue.utilities;';

const brotli = (code) => zlib.brotliCompressSync(code).length;
const fmt = (n) => `${(n / KB).toFixed(2)} KB`;
const write = (rel, code) => {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${LAYERS}\n${code}`);
};
const report = (result, file) => {
  for (const w of result.warnings) console.warn(`${file}: ${w.message}`);
  return result.code;
};

fs.rmSync(DIST, { recursive: true, force: true });
const files = fs.readdirSync(SRC, { recursive: true }).filter((f) => f.endsWith('.css') && f !== 'lue.css').sort();
const over = [];
for (const rel of files) {
  const code = report(transform({ filename: rel, code: fs.readFileSync(path.join(SRC, rel)), minify: true }), rel);
  write(rel, code);
  if (rel.startsWith('components/')) {
    const size = brotli(code);
    console.log(`  ${rel.padEnd(28)} ${fmt(size)}`);
    if (size > BUDGET.component) over.push(`${rel} is ${fmt(size)} (budget ${fmt(BUDGET.component)})`);
  }
}
const lue = report(bundle({ filename: path.join(SRC, 'lue.css'), minify: true }), 'lue.css');
write('lue.css', lue);
const total = brotli(lue);
console.log(`lue.css: ${fmt(lue.length)}, ${fmt(total)} Brotli (budget ${fmt(BUDGET.total)})`);
if (total > BUDGET.total) over.push(`lue.css is ${fmt(total)} (budget ${fmt(BUDGET.total)})`);
for (const o of over) console.error(`over budget: ${o}`);
if (over.length) process.exit(1);
