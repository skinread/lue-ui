// Checks a consumer fixture's built CSS (ADR-0002, RFC-0001 §9): our CSS must come out of a consumer's pipeline
// unlowered - the layer order intact, OKLCH colours, logical viewport units, zero-specificity theme selectors and
// the registered angle all still there. Usage: node fixtures/check.js <build folder> [--tailwind] [--fonts]
import fs from 'node:fs';
import path from 'node:path';

const [dir, ...flags] = process.argv.slice(2);
const files = fs.readdirSync(dir, { recursive: true }).filter((f) => f.endsWith('.css')).map((f) => path.join(dir, f));
const css = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
// Pipelines differ in whitespace and quoting; compare without either.
const flat = css.replace(/\s+/g, '').replace(/"/g, "'");

// Layer precedence is the order in which layer names first appear. Minifiers may split our one statement into
// several (Lightning CSS keeps each name in place), so check the sequence, not the statement.
const LAYERS = ['reset', 'tokens', 'base', 'layout', 'components', 'blocks', 'materials', 'contrast', 'utilities'];
const layerOrder = (s) => {
  const seen = [];
  for (const [, prelude] of s.matchAll(/@layer([^{;]+)[{;]/g)) {
    for (const name of prelude.split(',')) {
      const m = name.match(/lue\.(\w+)$/);
      if (m && !seen.includes(m[1])) seen.push(m[1]);
    }
  }
  return seen.join() === LAYERS.join();
};

const checks = [
  ['the layer order', layerOrder],
  ['colours as oklch()', /--lue-color-bg-canvas:oklch\(/],
  ['fluid sizes in vi', /--lue-space-s:clamp\(1rem,[\d.]+rem\+[\d.]+vi,1\.125rem\)/],
  ['the OS-theme selector at zero specificity', /:where\(:root:not\(\[data-theme\]\)\)/],
  ['increased contrast', /@media\(prefers-contrast:more\)/],
  ['@property --lue-angle', /@property--lue-angle\{/],
  ['component CSS', /\.lue-button\{/],
  ['logical properties', /min-block-size:max\(var\(--lue-size-target-min\)/],
  ['no light-dark()', (s) => !s.includes('light-dark(')],
  ['no colours lowered to rgb() or hex', (s) => !/--lue-color-bg-canvas:(rgb|#)/.test(s)],
];
if (flags.includes('--tailwind')) {
  checks.push(
    ['a Tailwind utility on our variables', /\.bg-surface\{background-color:var\(--lue-color-bg-surface\)/],
    ['Lue inside Tailwind\'s components layer', /@layercomponents\{@layerlue\.reset/],
  );
}

if (flags.includes('--fonts')) {
  // Every font URL in the built CSS must resolve to a file the pipeline emitted.
  const urls = [...css.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)].map((m) => m[1]);
  const resolve = (f, u) => (u.startsWith('/') ? path.join(dir, u) : path.resolve(path.dirname(f), u));
  const missing = urls.filter((u) => !files.some((f) => fs.existsSync(resolve(f, u))));
  checks.push(['the self-hosted fonts', () => urls.length >= 4 && missing.length === 0]);
}

let failed = 0;
for (const [name, test] of checks) {
  const ok = typeof test === 'function' ? test(flat) : test.test(flat);
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}`);
}
// Vendor prefixes a pipeline adds aren't failures (they're additions, not rewrites), but they're worth knowing about.
const prefixed = [...new Set(flat.match(/-webkit-backdrop-filter|-webkit-mask/g) ?? [])];
if (prefixed.length) console.log(`note: the pipeline added ${prefixed.join(', ')}`);
console.log(`${path.basename(process.cwd())}: ${files.length} CSS file(s), ${checks.length - failed}/${checks.length} checks pass`);
process.exit(failed ? 1 : 0);
