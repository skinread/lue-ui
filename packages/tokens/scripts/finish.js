// Finishes Terrazzo's dist/tokens.css (run after `tz build`):
//   1. drops the `@media (color-gamut: …)` copies Terrazzo adds for wide-gamut displays. Our colours are gamut-mapped
//      to sRGB at the source and contrast-checked there, so the copies only restate them with rounding noise;
//   2. adds the two context rules tokens can't express as a theme: zero durations under reduced motion, and the 44 px
//      target minimum under a coarse pointer ($extensions.lue.coarse); then src/theme.css, the CSS compositions of
//      material tokens (filters, gradients, layered shadows) that components use;
//   3. bundles and minifies with Lightning CSS and no targets, so nothing is lowered (ADR-0002), then prepends the
//      layer order;
//   4. fails if a themed token (colour, material, shadow) is missing from any theme block - the default plus six;
//   5. fails if tokens.js references a variable tokens.css doesn't define, or a value didn't serialise;
//   6. fails if the Brotli size passes the RFC-0001 §9 budget (6 KB).
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { transform } from 'lightningcss';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'dist', 'tokens.css');
const BUDGET = 6 * 1024;
// Every Lue file starts with the full layer order. It's added after minifying, which drops layer names a file
// doesn't use and with them the guarantee that load order never changes precedence.
const LAYERS = '@layer lue.reset, lue.tokens, lue.base, lue.layout, lue.components, lue.blocks, lue.materials, lue.contrast, lue.utilities;';
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

const source = dropGamutBlocks(fs.readFileSync(FILE, 'utf8')) + extra + fs.readFileSync(path.join(ROOT, 'src', 'theme.css'), 'utf8');
const { code, warnings } = transform({ filename: 'tokens.css', code: Buffer.from(source), minify: true });
for (const w of warnings) console.warn(`tokens.css: ${w.message}`);
fs.writeFileSync(FILE, `${LAYERS}\n${code}`);

const THEME_BLOCKS = 7;
const counts = new Map();
for (const [, name] of String(code).matchAll(/(--lue-(?:color|material|shadow)-[\w-]+):/g)) counts.set(name, (counts.get(name) ?? 0) + 1);
const incomplete = [...counts].filter(([, n]) => n !== THEME_BLOCKS);
for (const [name, n] of incomplete) console.error(`tokens.css: ${name} is declared in ${n} theme blocks, not ${THEME_BLOCKS}`);
if (incomplete.length) process.exit(1);

// tokens.js must point only at variables tokens.css defines, and every literal must have serialised.
const js = await import(new URL(`../dist/tokens.js?${Date.now()}`, import.meta.url).href);
const badJs = [
  ...Object.values(js.tokens).filter((ref) => !String(code).includes(`${ref.slice(4, -1)}:`)).map((ref) => `${ref} isn't defined in tokens.css`),
  ...Object.entries(js.values).flatMap(([ctx, vals]) => Object.entries(vals).filter(([, v]) => /\[object|undefined|NaN/.test(v)).map(([id]) => `${ctx} ${id} didn't serialise`)),
];
for (const p of badJs) console.error(`tokens.js: ${p}`);
if (badJs.length) process.exit(1);

const size = zlib.brotliCompressSync(code).length;
console.log(`tokens.css: ${(code.length / 1024).toFixed(1)} KB, ${(size / 1024).toFixed(2)} KB Brotli (budget ${BUDGET / 1024} KB)`);
if (size > BUDGET) process.exit(1);
