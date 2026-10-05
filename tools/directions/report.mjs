import { directions, evaluate, evaluateLuminous } from './palettes.mjs';
import { toHex } from './contrast.mjs';
const fmt = (c) => `oklch(${+c.L.toFixed(3)} ${+c.C.toFixed(3)} ${c.h})`;
const NAMES = { loom: 'A. Loom', instrument: 'B. Instrument', chroma: 'C. Chroma', luminous: 'C2. Chroma Luminous' };
const out = { values: {}, md: [] };
for (const [dir, schemes] of Object.entries(directions)) {
  out.values[dir] = {};
  const md = ['<details>', `<summary><strong>${NAMES[dir] ?? dir}</strong> — values and contrast (light · dark)</summary>`, '', '| Token | Light | Dark |', '| --- | --- | --- |'];
  const L = evaluate(schemes.light), D = evaluate(schemes.dark);
  for (const k of Object.keys(schemes.light)) {
    md.push(`| \`${k}\` | \`${fmt(L.col[k])}\` ${toHex(L.col[k])} | \`${fmt(D.col[k])}\` ${toHex(D.col[k])} |`);
    out.values[dir][k] = { light: fmt(L.col[k]), dark: fmt(D.col[k]), lightHex: toHex(L.col[k]), darkHex: toHex(D.col[k]) };
  }
  md.push('', '| Pair | Min | Light | Dark |', '| --- | --- | --- | --- |');
  L.rows.forEach((r, i) => {
    const d = D.rows[i];
    md.push(`| \`${r.fg}\` on \`${r.bg}\` | ${r.min}:1 | ${r.ratio.toFixed(2)} (Lc ${Math.abs(r.lc).toFixed(0)}) | ${d.ratio.toFixed(2)} (Lc ${Math.abs(d.lc).toFixed(0)}) |`);
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
import('node:fs').then(fs => {
  const dir = new URL('./out/', import.meta.url);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(new URL('palette-values.json', dir), JSON.stringify(out.values, null, 2));
  fs.writeFileSync(new URL('palette-report.md', dir), out.md.join('\n\n'));
  console.log('written');
});
