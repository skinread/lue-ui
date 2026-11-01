// Checks the DTCG token source in packages/tokens/src (or a folder passed as the first argument):
//   1. every token has a $type and a $description (a token without a usage note doesn't ship);
//   2. every alias resolves in every theme context;
//   3. every declared pair ($extensions.lue.pairs) meets its minimum in every context - raised to 7:1 for text and
//      4.5:1 for boundaries in the -more contexts;
//   4. body text (type step 0) is never below 16 px.
// Exits non-zero on any failure. The glass, chrome and prism worst-case rules stay in palettes.mjs until Pass 3.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { oklch, contrast } from './contrast.mjs';
import { minFor } from './palettes.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(process.argv[2] ?? path.join(HERE, '..', '..', 'packages', 'tokens', 'src'));
const read = (f) => JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
const resolver = read('lue.resolver.json');
const problems = [];

// Flatten a token document into { 'a.b.c': token }.
function flatten(node, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$') || typeof v !== 'object' || v === null) continue;
    const p = prefix ? `${prefix}.${k}` : k;
    if ('$value' in v) out[p] = v; else flatten(v, p, out);
  }
  return out;
}
const load = (sources) => Object.assign({}, ...sources.map((s) => flatten(s.$ref ? read(s.$ref) : s)));

const foundation = load(resolver.sets.foundation.sources);
const named = new Set();
for (const [ctx, sources] of Object.entries(resolver.modifiers.theme.contexts)) {
  const all = { ...foundation, ...load(sources), ...load(resolver.modifiers.density.contexts.default) };
  const resolve = (v, seen = new Set()) => {
    if (typeof v === 'string' && /^\{[^}]+\}$/.test(v)) {
      const key = v.slice(1, -1);
      if (seen.has(key) || !all[key]) { problems.push(`${ctx}: alias ${v} does not resolve`); return undefined; }
      return resolve(all[key].$value, new Set([...seen, key]));
    }
    if (Array.isArray(v)) return v.map((x) => resolve(x, seen));
    if (v && typeof v === 'object' && !('colorSpace' in v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolve(x, seen)]));
    return v;
  };
  const toColor = (v) => oklch(...v.components);
  for (const [name, t] of Object.entries(all)) {
    named.add(name);
    if (!t.$type) problems.push(`${ctx}: ${name} has no $type`);
    if (!t.$description) problems.push(`${ctx}: ${name} has no $description`);
    resolve(t.$value);
    const pairs = t.$extensions?.lue?.pairs;
    if (!pairs) continue;
    for (const { on, min } of pairs) {
      const bg = resolve(on);
      if (!bg) continue;
      const m = minFor(name.replace(/^color\./, '').replace('.', '-'), min, ctx.endsWith('-more'));
      const ratio = contrast(toColor(t.$value), toColor(bg));
      if (ratio < m) problems.push(`${ctx}: ${name} on ${on} is ${ratio.toFixed(2)}:1, needs ${m}:1`);
    }
  }
}
const body = foundation['font.size.step-0'];
const minBody = body.$extensions.lue.fluid.min;
if ((minBody.unit === 'rem' ? minBody.value * 16 : minBody.value) < 16) problems.push('font.size.step-0 is below 16 px at its minimum');

const pairCount = Object.values(load(resolver.modifiers.theme.contexts.dark)).reduce((n, t) => n + (t.$extensions?.lue?.pairs?.length ?? 0), 0);
console.log(`${named.size} tokens · ${pairCount} pairs × ${Object.keys(resolver.modifiers.theme.contexts).length} contexts · ${problems.length} problems`);
for (const p of problems) console.log('  FAIL', p);
process.exit(problems.length ? 1 : 0);
