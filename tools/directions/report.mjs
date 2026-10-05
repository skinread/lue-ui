import { directions, evaluate, evaluateLuminous, evaluateLuminousMore } from './palettes.mjs';
import { toHex } from './contrast.mjs';
const fmt = (c) => `oklch(${+c.L.toFixed(3)} ${+c.C.toFixed(3)} ${c.h})`;
const NAMES = { loom: 'A. Loom', instrument: 'B. Instrument', chroma: 'C. Chroma', luminous: 'C2. Chroma Luminous' };
const out = { values: {}, md: [] };
for (const [dir, schemes] of Object.entries(directions)) {
  out.values[dir] = {};
  const names = Object.keys(schemes);
  const label = (n) => n.replace('-more', ' (more contrast)').replace(/^./, (c) => c.toUpperCase());
  const ev = Object.fromEntries(names.map((n) => [n, evaluate(schemes[n], n.endsWith('-more'))]));
  const md = ['<details>', `<summary><strong>${NAMES[dir] ?? dir}</strong> — values and contrast (${names.join(' · ')})</summary>`, '',
    `| Token | ${names.map(label).join(' | ')} |`, `| --- |${names.map(() => ' --- |').join('')}`];
  for (const k of Object.keys(schemes.light)) {
    md.push(`| \`${k}\` | ${names.map((n) => `\`${fmt(ev[n].col[k])}\` ${toHex(ev[n].col[k])}`).join(' | ')} |`);
    out.values[dir][k] = Object.fromEntries(names.flatMap((n) => [[n, fmt(ev[n].col[k])], [`${n}Hex`, toHex(ev[n].col[k])]]));
  }
  md.push('', `| Pair | Min | ${names.map(label).join(' | ')} |`, `| --- | --- |${names.map(() => ' --- |').join('')}`);
  ev[names[0]].rows.forEach((r, i) => {
    const mins = [...new Set(names.map((n) => ev[n].rows[i].min))].join(' · ');
    md.push(`| \`${r.fg}\` on \`${r.bg}\` | ${mins}:1 | ${names.map((n) => `${ev[n].rows[i].ratio.toFixed(2)} (Lc ${Math.abs(ev[n].rows[i].lc).toFixed(0)})`).join(' | ')} |`);
  });
  md.push('', '</details>');
  out.md.push(md.join('\n'));
}
{
  const L = evaluateLuminous('light').rows, D = evaluateLuminous('dark').rows;
  const md = ['<details>', '<summary><strong>C2. Chroma Luminous</strong> — prism, chrome and glass rules (light · dark)</summary>', '', 'Worst case over every backdrop (white, black, canvas, surface, inverse, text, prism fills, ambient light), with both readings of the backdrop filter.', '', '| Rule | Min | Light | Dark |', '| --- | --- | --- | --- |'];
  L.forEach((r, i) => md.push(`| ${r.what} | ${r.min}:1 | ${r.ratio.toFixed(2)} | ${D[i].ratio.toFixed(2)} |`));
  md.push('', '</details>');
  out.md.push(md.join('\n'));
}
{
  const L = evaluateLuminousMore('light-more').rows, D = evaluateLuminousMore('dark-more').rows;
  const md = ['<details>', '<summary><strong>C2. Chroma Luminous</strong> — increased-contrast rules (light-more · dark-more)</summary>', '', 'Glass is opaque and chrome is one solid line in these contexts, so only the flat pairs above and these rules apply.', '', '| Rule | Min | Light (more) | Dark (more) |', '| --- | --- | --- | --- |'];
  L.forEach((r, i) => md.push(`| ${r.what} | ${r.min}:1 | ${r.ratio.toFixed(2)} | ${D[i].ratio.toFixed(2)} |`));
  md.push('', '</details>');
  out.md.push(md.join('\n'));
}
import('node:fs').then(fs => {
  const dir = new URL('./out/', import.meta.url);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(new URL('palette-values.json', dir), JSON.stringify(out.values, null, 2));
  fs.writeFileSync(new URL('palette-report.md', dir), out.md.join('\n\n'));
  console.log('written');
});
