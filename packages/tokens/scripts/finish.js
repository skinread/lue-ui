// Finishes Terrazzo's dist/tokens.css (run after `tz build`):
//   1. drops the `@media (color-gamut: …)` copies Terrazzo adds for wide-gamut displays. Our colours are gamut-mapped
//      to sRGB at the source and contrast-checked there, so the copies only restate them with rounding noise;
//   2. adds the two context rules tokens can't express as a theme: zero durations under reduced motion, and the 44 px
//      target minimum under a coarse pointer ($extensions.lue.coarse);
//   3. bundles and minifies with Lightning CSS and no targets, so nothing is lowered (ADR-0002);
//   4. fails if the Brotli size passes the RFC-0001 §9 budget (6 KB).
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { transform } from 'lightningcss';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'dist', 'tokens.css');
const BUDGET = 6 * 1024;
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'src', f), 'utf8'));

// Remove every top-level `@media (color-gamut: …) { … }` block, matching braces.
function dropGamutBlocks(css) {
  let out = '';
  let i = 0;
  for (;;) {
    const at = css.indexOf('@media (color-gamut:', i);
    if (at === -1) return out + css.slice(i);
    out += css.slice(i, at);
    let depth = 0;
    let j = css.indexOf('{', at);
    for (; j < css.length; j++) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}' && --depth === 0) break;
    }
    i = j + 1;
  }
}

const motion = read('semantic/motion.tokens.json').motion;
const target = read('semantic/dimension.tokens.json').size['target-min'];
const coarse = target.$extensions.lue.coarse;
const extra = `
@layer lue.tokens {
  @media (prefers-reduced-motion: reduce) {
    :root { ${Object.keys(motion.duration).map((k) => `--lue-motion-duration-${k}: 0s;`).join(' ')} }
  }
  @media (any-pointer: coarse) {
    :root { --lue-size-target-min: ${coarse.value}${coarse.unit}; }
  }
}
`;

const source = `@layer lue {\n  @layer reset, tokens, base, layout, components, blocks, materials, contrast, utilities;\n}\n`
  + dropGamutBlocks(fs.readFileSync(FILE, 'utf8')) + extra;
const { code, warnings } = transform({ filename: 'tokens.css', code: Buffer.from(source), minify: true });
for (const w of warnings) console.warn(`tokens.css: ${w.message}`);
fs.writeFileSync(FILE, code);

const size = zlib.brotliCompressSync(code).length;
console.log(`tokens.css: ${(code.length / 1024).toFixed(1)} KB, ${(size / 1024).toFixed(2)} KB Brotli (budget ${BUDGET / 1024} KB)`);
if (size > BUDGET) process.exit(1);
