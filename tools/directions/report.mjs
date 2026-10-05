import { directions, evaluate } from './palettes.mjs';
import { toHex } from './contrast.mjs';
const fmt = (c) => `oklch(${+c.L.toFixed(3)} ${+c.C.toFixed(3)} ${c.h})`;
const out = { values: {}, md: [] };
for (const [dir, schemes] of Object.entries(directions)) {
  out.values[dir] = {};
  const md = [`#### ${dir}`, '', '| Token | Light | Dark |', '| --- | --- | --- |'];
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
  out.md.push(md.join('\n'));
}
import('node:fs').then(fs => {
  const dir = new URL('./out/', import.meta.url);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(new URL('palette-values.json', dir), JSON.stringify(out.values, null, 2));
  fs.writeFileSync(new URL('palette-report.md', dir), out.md.join('\n\n'));
  console.log('written');
});
