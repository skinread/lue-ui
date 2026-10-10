// Generates the Claude Design canvas (three directions) from the verified palettes.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { directions as PAL, evaluate } from './palettes.mjs';
import { contrast } from './contrast.mjs';
import { lxVars, lxShadows, LX_CSS, lxFoundations, LX_FONTS } from './luminous-canvas.mjs';
import { blocksBoard, portfolioBoard, articleBoard } from './luminous-pages.mjs';

// Output: <this folder>/out/canvas (gitignored), or a folder passed as the first argument.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(process.argv[2] ?? path.join(HERE, 'out', 'canvas'));
const OUT = path.join(ROOT, 'project');
fs.rmSync(ROOT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const fmt = (c) => `oklch(${+c.L.toFixed(3)} ${+c.C.toFixed(3)} ${+(+c.h).toFixed(1)})`;
const resolved = {};
for (const [d, schemes] of Object.entries(PAL)) {
  resolved[d] = {};
  for (const [s, p] of Object.entries(schemes)) resolved[d][s] = evaluate(p).col;
}
const ratio = (d, s, a, b) => contrast(resolved[d][s][a], resolved[d][s][b]).toFixed(1);

// ---------------------------------------------------------------- direction tokens (non-colour)
const FONT_HOST = 'https://fonts.googleapis.com/css2?';
const DIRS = {
  loom: {
    letter: 'A', name: 'Loom', tagline: 'Calm · tactile · warm',
    motto: 'Interfaces with the quiet confidence of good cloth.',
    tags: ['Warm paper neutrals', 'Spruce accent', 'Stitched edges'],
    fonts: 'family=Besley:ital,wght@0,400..900;1,400..900&family=Atkinson+Hyperlegible+Next:ital,wght@0,200..800;1,200..800&family=Atkinson+Hyperlegible+Mono:wght@200..800&display=swap',
    fontNames: ['Besley — display', 'Atkinson Hyperlegible Next — body', 'Atkinson Hyperlegible Mono — code'],
    vars: {
      '--font-display': "'Besley', 'Iowan Old Style', Georgia, serif",
      '--font-body': "'Atkinson Hyperlegible Next', system-ui, sans-serif",
      '--font-mono': "'Atkinson Hyperlegible Mono', ui-monospace, monospace",
      '--fs-display': '60px', '--lh-display': '1.04', '--fw-display': '800', '--ls-display': '-0.015em',
      '--fs-h1': '40px', '--lh-h1': '1.1', '--fs-h2': '30px', '--lh-h2': '1.15', '--fs-h3': '23px', '--lh-h3': '1.25',
      '--fs-h4': '19px', '--lh-h4': '1.3', '--fw-heading': '700',
      '--fs-body': '17px', '--lh-body': '1.6', '--fs-small': '15px', '--fs-label': '16px', '--fw-label': '600',
      '--fs-code': '15px', '--fs-micro': '13px', '--ls-micro': '0.04em', '--tt-micro': 'none', '--micro-font': 'var(--font-body)',
      '--radius-xs': '4px', '--radius-s': '6px', '--radius-m': '10px', '--radius-l': '16px', '--radius-full': '999px',
      '--radius-button': '10px', '--radius-field': '8px', '--radius-tag': '999px', '--radius-switch': '999px', '--radius-toast': '12px',
      '--size-control-sm': '36px', '--size-control-md': '46px', '--size-control-lg': '54px',
      '--btn-pad': '22px', '--btn-border-w': '1px', '--field-pad': '14px', '--field-border-w': '1.5px',
      '--space-3xs': '4px', '--space-2xs': '8px', '--space-xs': '12px', '--space-s': '16px', '--space-m': '24px',
      '--space-l': '32px', '--space-xl': '48px', '--space-2xl': '64px', '--space-3xl': '96px',
      '--focus-w': '2px', '--focus-offset': '3px', '--focus-offset-field': '2px',
      '--focus-halo': '0 0 0 7px var(--bg-accent-subtle)',
      '--dur-fast': '160ms', '--dur-moderate': '240ms', '--ease': 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      '--btn-primary-border': 'var(--bg-accent)', '--btn-danger-border': 'var(--bg-critical)',
    },
    shadows: {
      light: { raised: '0 1px 2px oklch(0.3 0.03 60 / 0.08), 0 6px 18px oklch(0.3 0.03 60 / 0.07)', overlay: '0 22px 56px oklch(0.25 0.03 60 / 0.22)' },
      dark: { raised: '0 1px 2px oklch(0 0 0 / 0.45)', overlay: '0 22px 56px oklch(0 0 0 / 0.6)' },
    },
    extra: { light: { '--scrim': 'oklch(0.22 0.02 60 / 0.5)', '--stitch': 'oklch(0.58 0.02 70 / 0.55)', '--twill-a': 'oklch(0.93 0.016 80)', '--twill-b': 'oklch(0.955 0.012 80)' },
             dark: { '--scrim': 'oklch(0 0 0 / 0.6)', '--stitch': 'oklch(0.58 0.015 70 / 0.5)', '--twill-a': 'oklch(0.25 0.014 70)', '--twill-b': 'oklch(0.22 0.013 70)' } },
    motion: ['Gentle — 160 / 240 / 320 ms', 'Ease-out cubic-bezier(0.2, 0.7, 0.2, 1)', 'Short fades and small rises; instant under reduced motion'],
    signature: 'A selvedge: surfaces carry a stitched inner edge, and brand bands use a fine twill weave — never behind text.',
    sig: `
.dir-loom .ns-card, .dir-loom .ns-dialog { outline: 1px dashed var(--stitch); outline-offset: -8px; }
.dir-loom .band { background: repeating-linear-gradient(135deg, var(--twill-a) 0 5px, var(--twill-b) 5px 10px); }
.dir-loom .t-display { font-style: italic; }
`,
  },
  instrument: {
    letter: 'B', name: 'Instrument', tagline: 'Precise · technical · cool',
    motto: 'The clarity of a well-made instrument panel.',
    tags: ['Graphite ink on paper', 'One signal orange', 'Hairlines, ticks, tabular numbers'],
    fonts: 'family=Instrument+Sans:ital,wdth,wght@0,75..100,400..700;1,75..100,400..700&family=Martian+Mono:wdth,wght@75..112.5,100..800&display=swap',
    fontNames: ['Instrument Sans — display and body', 'Martian Mono — labels and data'],
    vars: {
      '--font-display': "'Instrument Sans', system-ui, sans-serif",
      '--font-body': "'Instrument Sans', system-ui, sans-serif",
      '--font-mono': "'Martian Mono', ui-monospace, monospace",
      '--fs-display': '58px', '--lh-display': '1.0', '--fw-display': '600', '--ls-display': '-0.025em',
      '--fvs-display': "'wdth' 80",
      '--fs-h1': '36px', '--lh-h1': '1.1', '--fs-h2': '27px', '--lh-h2': '1.15', '--fs-h3': '21px', '--lh-h3': '1.25',
      '--fs-h4': '17px', '--lh-h4': '1.3', '--fw-heading': '600',
      '--fs-body': '16px', '--lh-body': '1.5', '--fs-small': '14px', '--fs-label': '15px', '--fw-label': '600',
      '--fs-code': '13px', '--fs-micro': '12px', '--ls-micro': '0.08em', '--tt-micro': 'uppercase', '--micro-font': 'var(--font-mono)',
      '--radius-xs': '2px', '--radius-s': '3px', '--radius-m': '4px', '--radius-l': '6px', '--radius-full': '999px',
      '--radius-button': '3px', '--radius-field': '3px', '--radius-tag': '2px', '--radius-switch': '3px', '--radius-toast': '4px',
      '--size-control-sm': '30px', '--size-control-md': '38px', '--size-control-lg': '46px',
      '--btn-pad': '16px', '--btn-border-w': '1px', '--field-pad': '12px', '--field-border-w': '1px',
      '--space-3xs': '4px', '--space-2xs': '6px', '--space-xs': '10px', '--space-s': '14px', '--space-m': '20px',
      '--space-l': '28px', '--space-xl': '40px', '--space-2xl': '56px', '--space-3xl': '80px',
      '--focus-w': '2px', '--focus-offset': '2px', '--focus-offset-field': '2px',
      '--focus-halo': 'none',
      '--dur-fast': '100ms', '--dur-moderate': '140ms', '--ease': 'cubic-bezier(0.3, 0, 0.2, 1)',
      '--btn-primary-border': 'var(--fg-default)', '--btn-danger-border': 'var(--bg-critical)',
    },
    shadows: {
      light: { raised: 'none', overlay: '0 0 0 1px var(--border-strong)' },
      dark: { raised: 'none', overlay: '0 0 0 1px var(--border-strong)' },
    },
    extra: { light: { '--scrim': 'oklch(0.2 0.008 255 / 0.55)' }, dark: { '--scrim': 'oklch(0 0 0 / 0.65)' } },
    motion: ['Snappy — 100 / 140 / 180 ms', 'Standard cubic-bezier(0.3, 0, 0.2, 1); no bounce', 'Instant under reduced motion'],
    signature: 'Measurement ticks on rules and progress, short mono micro-labels, tabular numerals, and filled buttons outlined in ink.',
    sig: `
.dir-instrument .board, .dir-instrument.board { font-variant-numeric: tabular-nums; }
.dir-instrument .ticks { block-size: 10px; background: repeating-linear-gradient(90deg, var(--border-strong) 0 1px, transparent 1px 10px); mask-image: linear-gradient(to bottom, black 55%, transparent 55%); }
.dir-instrument .ns-card { border-color: var(--border-strong); }
.dir-instrument .ns-menu { border-color: var(--border-strong); }
.dir-instrument .ns-dialog { border-color: var(--border-strong); }
.dir-instrument .ns-tag { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; }
`,
  },
  chroma: {
    letter: 'C', name: 'Chroma', tagline: 'Expressive · vivid · playful',
    motto: 'Colour as a material.',
    tags: ['Vivid fuchsia', 'Lime highlights', 'Pills and colour fields'],
    fonts: 'family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=Figtree:ital,wght@0,300..900;1,300..900&family=Spline+Sans+Mono:ital,wght@0,300..700;1,300..700&display=swap',
    fontNames: ['Bricolage Grotesque — display', 'Figtree — body', 'Spline Sans Mono — code'],
    vars: {
      '--font-display': "'Bricolage Grotesque', system-ui, sans-serif",
      '--font-body': "'Figtree', system-ui, sans-serif",
      '--font-mono': "'Spline Sans Mono', ui-monospace, monospace",
      '--fs-display': '72px', '--lh-display': '0.95', '--fw-display': '800', '--ls-display': '-0.03em',
      '--fvs-display': "'wdth' 78, 'opsz' 96",
      '--fs-h1': '44px', '--lh-h1': '1.02', '--fs-h2': '32px', '--lh-h2': '1.08', '--fs-h3': '24px', '--lh-h3': '1.2',
      '--fs-h4': '19px', '--lh-h4': '1.3', '--fw-heading': '750',
      '--fs-body': '17px', '--lh-body': '1.55', '--fs-small': '15px', '--fs-label': '16px', '--fw-label': '650',
      '--fs-code': '14px', '--fs-micro': '13px', '--ls-micro': '0.02em', '--tt-micro': 'none', '--micro-font': 'var(--font-body)',
      '--radius-xs': '6px', '--radius-s': '10px', '--radius-m': '18px', '--radius-l': '26px', '--radius-full': '999px',
      '--radius-button': '999px', '--radius-field': '14px', '--radius-tag': '999px', '--radius-switch': '999px', '--radius-toast': '999px',
      '--size-control-sm': '38px', '--size-control-md': '50px', '--size-control-lg': '58px',
      '--btn-pad': '24px', '--btn-border-w': '2px', '--field-pad': '18px', '--field-border-w': '2px',
      '--space-3xs': '4px', '--space-2xs': '8px', '--space-xs': '12px', '--space-s': '18px', '--space-m': '26px',
      '--space-l': '36px', '--space-xl': '52px', '--space-2xl': '72px', '--space-3xl': '104px',
      '--focus-w': '3px', '--focus-offset': '3px', '--focus-offset-field': '3px',
      '--focus-halo': 'none',
      '--dur-fast': '180ms', '--dur-moderate': '300ms', '--ease': 'linear(0, 0.38 12%, 0.82 28%, 1.04 45%, 1.06 55%, 1.01 75%, 1)',
      '--btn-primary-border': 'var(--bg-accent)', '--btn-danger-border': 'var(--bg-critical)',
    },
    shadows: {
      light: { raised: '0 8px 24px oklch(0.55 0.22 350 / 0.12)', overlay: '0 24px 64px oklch(0.4 0.18 350 / 0.28)' },
      dark: { raised: '0 8px 24px oklch(0 0 0 / 0.4)', overlay: '0 24px 64px oklch(0 0 0 / 0.6)' },
    },
    extra: { light: { '--scrim': 'oklch(0.22 0.03 320 / 0.5)', '--highlight': 'oklch(0.9 0.19 125)', '--hl-bg': 'oklch(0.9 0.19 125)' }, dark: { '--scrim': 'oklch(0 0 0 / 0.62)', '--highlight': 'oklch(0.88 0.19 125)', '--hl-bg': 'oklch(0.42 0.13 130)' } },
    motion: ['Springy — 180 / 300 / 360 ms', 'linear() spring with a small overshoot', 'Instant under reduced motion'],
    signature: 'Big flat colour fields behind content, a lime highlight that never carries text, and a display face that stretches its width axis.',
    sig: `
.dir-chroma .field { background: var(--bg-accent-subtle); border-radius: var(--radius-l); }
.dir-chroma .hl { background: linear-gradient(transparent 58%, var(--hl-bg) 58% 92%, transparent 92%); padding-inline: 0.06em; }
.dir-chroma .ns-card { border-width: 2px; }
.dir-chroma .ns-button { font-family: var(--font-display); font-variation-settings: 'wdth' 90; letter-spacing: -0.005em; }
`,
  },
  luminous: {
    letter: 'C2', name: 'Chroma Luminous', file: 'Luminous', tagline: 'Luminous · luxurious · prismatic',
    motto: 'Light, caught in chrome and glass.',
    tags: ['Chrome hairlines', 'Liquid glass', 'Prismatic neon', 'Light that moves'],
    fonts: LX_FONTS,
    fontNames: ['Epilogue — display and headings, light', 'Figtree — body', 'Spline Sans Mono — micro-labels and code'],
    H: { foundations: 7700, components: 2560, checkout: 1240 },
    interactive: true,
    vars: {
      '--font-display': "'Epilogue', system-ui, sans-serif", '--display-scale': '0.95', '--heading-scale': '0.95',
      '--font-body': "'Figtree', system-ui, sans-serif",
      '--font-mono': "'Spline Sans Mono', ui-monospace, monospace",
      '--fs-display': 'calc(78px * var(--display-scale, 1))', '--lh-display': '0.98', '--fw-display': '300', '--ls-display': '-0.035em', '--ls-heading': '-0.02em',
      '--fvs-display': 'normal',
      '--fs-h1': 'calc(46px * var(--heading-scale, 1))', '--lh-h1': '1.04', '--fs-h2': 'calc(32px * var(--heading-scale, 1))', '--lh-h2': '1.1', '--fs-h3': 'calc(24px * var(--heading-scale, 1))', '--lh-h3': '1.2',
      '--fs-h4': 'calc(19px * var(--heading-scale, 1))', '--lh-h4': '1.3', '--fw-heading': '480',
      '--fs-body': '17px', '--lh-body': '1.6', '--fs-small': '15px', '--fs-label': '16px', '--fw-label': '600',
      '--fs-code': '14px', '--fs-micro': '12px', '--ls-micro': '0.16em', '--tt-micro': 'uppercase', '--micro-font': 'var(--font-mono)',
      '--radius-xs': '8px', '--radius-s': '12px', '--radius-m': '20px', '--radius-l': '28px', '--radius-full': '999px',
      '--radius-button': '999px', '--radius-field': '16px', '--radius-tag': '999px', '--radius-switch': '999px', '--radius-toast': '999px',
      '--size-control-sm': '40px', '--size-control-md': '50px', '--size-control-lg': '60px',
      '--btn-pad': '26px', '--btn-border-w': '1px', '--field-pad': '18px', '--field-border-w': '1px',
      '--space-3xs': '4px', '--space-2xs': '8px', '--space-xs': '12px', '--space-s': '18px', '--space-m': '28px',
      '--space-l': '40px', '--space-xl': '56px', '--space-2xl': '80px', '--space-3xl': '112px',
      '--focus-w': '2px', '--focus-offset': '3px', '--focus-offset-field': '3px',
      '--focus-halo': 'none',
      '--dur-fast': '160ms', '--dur-moderate': '240ms', '--ease': 'linear(0, 0.4 12%, 0.84 28%, 1.03 45%, 1.04 55%, 1.01 75%, 1)',
      '--btn-primary-border': 'transparent', '--btn-danger-border': 'transparent',
    },
    shadows: lxShadows,
    extra: { light: lxVars('light'), dark: lxVars('dark'), 'light-more': lxVars('light-more'), 'dark-more': lxVars('dark-more') },
    motion: ['Dance — 320 ms ease-out, on interaction only', 'Fills slide along an iso-lightness prism; chrome glints round the rim; glow rises', 'Instant and still under reduced motion; opaque under reduced transparency'],
    signature: 'A chrome hairline that catches the light as you move, over glass that refracts a quiet prism. Selected and on states trade chrome for prism. Light moves only when you do.',
    sig: LX_CSS,
  },
};
const fileOf = (t) => t.file ?? t.name;
const sizeOf = (t, k, dflt) => t.H?.[k] ?? dflt;

// ---------------------------------------------------------------- CSS
const COLOR_KEYS = Object.keys(PAL.loom.light);
function tokenCss(d) {
  const t = DIRS[d];
  const base = Object.entries(t.vars).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  const scheme = (s) => {
    const cols = COLOR_KEYS.map((k) => `  --${k}: ${fmt(resolved[d][s][k])};`).join('\n');
    const ex = Object.entries(t.extra[s] || {}).map(([k, v]) => `  ${k}: ${v};`).join('\n');
    return `.dir-${d}[data-scheme=${s}], .dir-${d} [data-scheme=${s}] {\n  color-scheme: ${s};\n${cols}\n${ex}\n  --shadow-raised: ${t.shadows[s].raised};\n  --shadow-overlay: ${t.shadows[s].overlay};\n}`;
  };
  // Increased-contrast contexts (C2): the -more palette on an element that carries both attributes.
  const more = (s) => {
    const b = s.replace('-more', '');
    const cols = COLOR_KEYS.map((k) => `  --${k}: ${fmt(resolved[d][s][k])};`).join('\n');
    const ex = Object.entries(t.extra[s] || {}).map(([k, v]) => `  ${k}: ${v};`).join('\n');
    return `.dir-${d}[data-scheme=${b}][data-contrast=more], .dir-${d} [data-scheme=${b}][data-contrast=more] {\n  color-scheme: ${b};\n${cols}\n${ex}\n  --shadow-raised: ${t.shadows[b].raised};\n  --shadow-overlay: ${t.shadows[b].overlay};\n}`;
  };
  const moreBlocks = PAL[d]['dark-more'] ? `\n${more('dark-more')}\n${more('light-more')}` : '';
  return `.dir-${d} {\n${base}\n}\n${scheme('light')}\n${scheme('dark')}${moreBlocks}\n${t.sig}`;
}

const COMPONENT_CSS = `
body { margin: 0; }
* { box-sizing: border-box; }
.board { font-family: var(--font-body); font-size: var(--fs-body); line-height: var(--lh-body); color: var(--fg-default); background: var(--bg-canvas); -webkit-font-smoothing: antialiased; }
.scheme { background: var(--bg-canvas); color: var(--fg-default); }
.icon { inline-size: 1.25em; block-size: 1.25em; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex: none; }
.t-display { font-family: var(--font-display); font-size: var(--fs-display); line-height: var(--lh-display); font-weight: var(--fw-display); letter-spacing: var(--ls-display); font-variation-settings: var(--fvs-display, normal); margin: 0; text-wrap: balance; }
.t-h1 { font-family: var(--font-display); font-size: var(--fs-h1); line-height: var(--lh-h1); font-weight: var(--fw-heading); margin: 0; text-wrap: balance; }
.t-h2 { font-family: var(--font-display); font-size: var(--fs-h2); line-height: var(--lh-h2); font-weight: var(--fw-heading); margin: 0; text-wrap: balance; }
.t-h3 { font-family: var(--font-display); font-size: var(--fs-h3); line-height: var(--lh-h3); font-weight: var(--fw-heading); margin: 0; }
.t-h4 { font-family: var(--font-display); font-size: var(--fs-h4); line-height: var(--lh-h4); font-weight: var(--fw-heading); margin: 0; }
.t-body { font-size: var(--fs-body); line-height: var(--lh-body); margin: 0; text-wrap: pretty; }
.t-small { font-size: var(--fs-small); line-height: 1.5; margin: 0; }
.t-muted { color: var(--fg-muted); }
.t-label { font-size: var(--fs-label); font-weight: var(--fw-label); line-height: 1.3; margin: 0; }
.t-code { font-family: var(--font-mono); font-size: var(--fs-code); }
.t-micro { font-family: var(--micro-font); font-size: var(--fs-micro); font-weight: var(--fw-label); letter-spacing: var(--ls-micro); text-transform: var(--tt-micro); color: var(--fg-muted); margin: 0; }
.ns-link { color: var(--fg-accent); text-decoration: underline; text-underline-offset: 0.18em; text-decoration-thickness: 1px; }

.ns-button { display: inline-flex; align-items: center; justify-content: center; gap: 0.5em; min-block-size: var(--size-control-md); min-inline-size: var(--size-control-md); padding-block: 0; padding-inline: var(--btn-pad); border-radius: var(--radius-button); border: var(--btn-border-w) solid var(--border-strong); background: var(--bg-surface); color: var(--fg-default); font-family: var(--font-body); font-size: var(--fs-label); font-weight: var(--fw-label); line-height: 1.2; cursor: pointer; white-space: nowrap; transition: background-color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), translate var(--dur-fast) var(--ease); }
.ns-button:where([data-variant=primary]) { background: var(--bg-accent); color: var(--fg-on-accent); border-color: var(--btn-primary-border); }
.ns-button:where([data-variant=danger]) { background: var(--bg-critical); color: var(--fg-on-critical); border-color: var(--btn-danger-border); }
.ns-button:where([data-variant=quiet]) { background: transparent; color: var(--fg-accent); border-color: transparent; }
.ns-button:where([data-size=sm]) { min-block-size: var(--size-control-sm); min-inline-size: var(--size-control-sm); padding-inline: calc(var(--btn-pad) * 0.7); font-size: var(--fs-small); }
.ns-button:where([data-size=lg]) { min-block-size: var(--size-control-lg); padding-inline: calc(var(--btn-pad) * 1.3); }
.ns-button:where([data-icon-only]) { padding-inline: 0; inline-size: var(--size-control-md); }
.ns-button:where([data-icon-only][data-size=sm]) { inline-size: var(--size-control-sm); }
.ns-button[data-demo=hover] { background: var(--bg-surface-subtle); }
.ns-button:where([data-variant=primary])[data-demo=hover] { background: var(--bg-accent-hover); }
.ns-button:where([data-variant=primary])[data-demo=active] { background: var(--bg-accent-active); }
.ns-button:where([data-variant=quiet])[data-demo=hover] { background: var(--bg-accent-subtle); }
@media (hover: hover) {
  .ns-button:hover { background: var(--bg-surface-subtle); }
  .ns-button:where([data-variant=primary]):hover { background: var(--bg-accent-hover); }
  .ns-button:where([data-variant=danger]):hover { background: var(--bg-critical); }
  .ns-button:where([data-variant=quiet]):hover { background: var(--bg-accent-subtle); }
}
.ns-button:where([data-variant=primary]):active { background: var(--bg-accent-active); }
.ns-button:focus-visible, .ns-button[data-demo=focus] { outline: var(--focus-w) solid var(--focus-ring); outline-offset: var(--focus-offset); box-shadow: var(--focus-halo); }
.ns-button:disabled { background: var(--bg-surface-subtle); color: var(--fg-muted); border-color: var(--border-subtle); cursor: not-allowed; }
.ns-button[aria-pressed=true] { background: var(--bg-accent-subtle); border-color: var(--fg-accent); box-shadow: inset 0 0 0 1px var(--fg-accent); color: var(--fg-default); }

.ns-field { display: grid; gap: var(--space-2xs); }
.ns-field__label { font-size: var(--fs-label); font-weight: var(--fw-label); }
.ns-field__hint { margin: 0; font-size: var(--fs-small); color: var(--fg-muted); }
.ns-input, .ns-select { inline-size: 100%; min-block-size: var(--size-control-md); padding-inline: var(--field-pad); border: var(--field-border-w) solid var(--border-strong); border-radius: var(--radius-field); background: var(--bg-surface); color: var(--fg-default); font-family: var(--font-body); font-size: var(--fs-body); }
.ns-input[aria-invalid=true] { border-color: var(--fg-critical); box-shadow: inset 0 0 0 1px var(--fg-critical); }
.ns-input:focus-visible, .ns-input[data-demo=focus], .ns-select:focus-visible { outline: var(--focus-w) solid var(--focus-ring); outline-offset: var(--focus-offset-field); }
.ns-field__error { margin: 0; display: flex; gap: 0.4em; align-items: center; color: var(--fg-critical); font-size: var(--fs-small); font-weight: var(--fw-label); }
.ns-select-wrap { position: relative; display: grid; }
.ns-select { appearance: none; padding-inline-end: calc(var(--field-pad) + 1.75em); }
.ns-select-wrap .icon { position: absolute; inset-inline-end: var(--field-pad); inset-block-start: 50%; translate: 0 -50%; pointer-events: none; }

.ns-error-summary { border: 2px solid var(--fg-critical); border-radius: var(--radius-m); background: var(--bg-surface); padding: var(--space-m); display: grid; gap: var(--space-xs); }
.ns-error-summary__title { display: flex; gap: 0.5em; align-items: center; color: var(--fg-critical); font-family: var(--font-display); font-size: var(--fs-h4); font-weight: var(--fw-heading); margin: 0; }
.ns-error-summary ul { margin: 0; padding-inline-start: 1.25em; display: grid; gap: var(--space-3xs); }
.ns-error-summary a { color: var(--fg-critical); font-weight: var(--fw-label); text-underline-offset: 0.18em; }

.ns-fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: var(--space-2xs); min-inline-size: 0; }
.ns-fieldset legend { font-size: var(--fs-label); font-weight: var(--fw-label); padding: 0; margin-block-end: var(--space-2xs); }
.ns-choice { display: flex; gap: var(--space-xs); align-items: center; min-block-size: 32px; font-size: var(--fs-body); }
.ns-check, .ns-radio { appearance: none; margin: 0; inline-size: 22px; block-size: 22px; border: 2px solid var(--border-strong); background: var(--bg-surface); display: inline-grid; place-content: center; flex: none; }
.ns-check { border-radius: var(--radius-xs); }
.ns-radio { border-radius: 50%; }
.ns-check:checked, .ns-radio:checked { background: var(--bg-accent); border-color: var(--bg-accent); }
.ns-check:checked::after { content: ""; inline-size: 11px; block-size: 6px; border-inline-start: 2.5px solid var(--fg-on-accent); border-block-end: 2.5px solid var(--fg-on-accent); rotate: -45deg; translate: 0 -1px; }
.ns-radio:checked { box-shadow: inset 0 0 0 4px var(--bg-surface); }
.ns-check[aria-invalid=true], .ns-radio[aria-invalid=true] { border-color: var(--fg-critical); }
.ns-check[data-demo=focus], .ns-radio[data-demo=focus], .ns-switch[data-demo=focus] { outline: var(--focus-w) solid var(--focus-ring); outline-offset: 2px; }
.ns-switch { appearance: none; margin: 0; inline-size: 48px; block-size: 28px; border-radius: var(--radius-switch); border: 2px solid var(--border-strong); background: var(--bg-surface-subtle); position: relative; flex: none; }
.ns-switch::before { content: ""; position: absolute; inset-block-start: 3px; inset-inline-start: 3px; inline-size: 18px; block-size: 18px; border-radius: var(--radius-switch); background: var(--border-strong); transition: translate var(--dur-moderate) var(--ease); }
.ns-switch:checked { background: var(--bg-accent); border-color: var(--bg-accent); }
.ns-switch:checked::before { translate: 20px 0; background: var(--fg-on-accent); }

.ns-menu { display: grid; gap: 2px; padding: var(--space-3xs); inline-size: 240px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-m); box-shadow: var(--shadow-overlay); }
.ns-menu__item { display: flex; align-items: center; gap: var(--space-xs); min-block-size: var(--size-control-sm); padding-inline: var(--space-xs); border: 0; border-radius: var(--radius-s); background: transparent; color: var(--fg-default); font-family: var(--font-body); font-size: var(--fs-body); text-align: start; cursor: pointer; }
.ns-menu__item[data-demo=focus] { background: var(--bg-accent-subtle); outline: var(--focus-w) solid var(--focus-ring); outline-offset: -2px; }
.ns-menu__item:where([data-tone=critical]) { color: var(--fg-critical); }
.ns-menu__sep { block-size: 1px; background: var(--border-subtle); margin-block: var(--space-3xs); }

.ns-disclosure { border-block-end: 1px solid var(--border-subtle); }
.ns-disclosure summary { display: flex; justify-content: space-between; align-items: center; gap: var(--space-s); min-block-size: var(--size-control-md); cursor: pointer; font-weight: var(--fw-label); list-style: none; }
.ns-disclosure summary::-webkit-details-marker { display: none; }
.ns-disclosure summary .icon { transition: rotate var(--dur-moderate) var(--ease); }
.ns-disclosure[open] summary .icon { rotate: 180deg; }
.ns-disclosure p { margin: 0; padding-block-end: var(--space-s); color: var(--fg-muted); }

.ns-alert { display: grid; grid-template-columns: auto 1fr; gap: var(--space-3xs) var(--space-s); padding: var(--space-s) var(--space-m); border-radius: var(--radius-m); border: 1px solid var(--border-subtle); background: var(--bg-info-subtle); }
.ns-alert > .icon { grid-row: span 2; color: var(--fg-info); margin-block-start: 3px; }
.ns-alert:where([data-tone=warning]) { background: var(--bg-warning-subtle); }
.ns-alert:where([data-tone=warning]) > .icon { color: var(--fg-warning); }
.ns-alert__title { margin: 0; font-weight: var(--fw-label); }
.ns-alert__body { margin: 0; font-size: var(--fs-small); }

.ns-toast { display: flex; align-items: center; gap: var(--space-s); padding-block: var(--space-2xs); padding-inline: var(--space-s) var(--space-2xs); border-radius: var(--radius-toast); background: var(--bg-inverse); color: var(--fg-inverse); box-shadow: var(--shadow-overlay); inline-size: fit-content; max-inline-size: 100%; }
.ns-toast .ns-button { min-block-size: var(--size-control-sm); background: transparent; color: var(--fg-inverse); border-color: transparent; text-decoration: underline; text-underline-offset: 0.18em; }

.ns-dialog { position: static; margin: 0; display: grid; gap: var(--space-s); inline-size: 100%; max-inline-size: 460px; padding: var(--space-l); border: 1px solid var(--border-subtle); border-radius: var(--radius-l); background: var(--bg-surface); color: var(--fg-default); box-shadow: var(--shadow-overlay); }
.ns-dialog__title { font-family: var(--font-display); font-size: var(--fs-h3); font-weight: var(--fw-heading); line-height: 1.25; margin: 0; }
.ns-dialog__actions { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: var(--space-xs); margin: var(--space-2xs) 0 0; }

.ns-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-l); padding: var(--space-l); box-shadow: var(--shadow-raised); }
.ns-tag { display: inline-flex; align-items: center; min-block-size: 30px; padding-inline: var(--space-xs); border-radius: var(--radius-tag); background: var(--bg-surface-subtle); color: var(--fg-default); font-size: var(--fs-small); font-weight: var(--fw-label); border: 1px solid var(--border-subtle); }
.ns-steps { display: flex; flex-wrap: wrap; gap: var(--space-m); list-style: none; margin: 0; padding: 0; font-size: var(--fs-small); }
.ns-steps li { display: flex; align-items: center; gap: var(--space-2xs); color: var(--fg-muted); }
.ns-steps li[aria-current=step] { color: var(--fg-default); font-weight: var(--fw-label); }
.ns-steps .num { inline-size: 26px; block-size: 26px; border-radius: var(--radius-full); display: inline-grid; place-items: center; border: 1.5px solid currentColor; font-size: 13px; font-weight: 700; }
.ns-steps li[aria-current=step] .num { background: var(--bg-accent); color: var(--fg-on-accent); border-color: var(--bg-accent); }

.swatch { display: grid; grid-template-rows: 72px auto; border: 1px solid var(--border-subtle); border-radius: var(--radius-s); overflow: hidden; background: var(--bg-surface); }
.swatch__chip { display: grid; place-items: center; font-family: var(--font-display); font-weight: 700; font-size: 22px; }
.swatch__meta { padding: 8px 10px 10px; display: grid; gap: 2px; font-family: var(--font-mono); font-size: 12px; line-height: 1.35; color: var(--fg-muted); }
.swatch__meta b { color: var(--fg-default); font-weight: 600; }
.section-head { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-s); border-block-end: 1px solid var(--border-subtle); padding-block-end: var(--space-2xs); }
`;

// ---------------------------------------------------------------- icons
const I = {
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"></path>',
  x: '<path d="M6 6l12 12M18 6L6 18"></path>',
  chevron: '<path d="M6 9l6 6 6-6"></path>',
  alert: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7.5v5.5M12 16.5v.5"></path>',
  info: '<circle cx="12" cy="12" r="9"></circle><path d="M12 11v5.5M12 7.5v.5"></path>',
  warn: '<path d="M12 4l9 16H3z"></path><path d="M12 10v4.5M12 17.5v.5"></path>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"></path>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"></path>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"></path>',
  bold: '<path d="M7 5h6a3.5 3.5 0 010 7H7zM7 12h7a3.5 3.5 0 010 7H7z"></path>',
  plus: '<path d="M12 5v14M5 12h14"></path>',
  more: '<circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle>',
};
const icon = (n) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;

// ---------------------------------------------------------------- partials
const componentSheet = (d, s) => {
  const id = `${d}-${s}`;
  return `
<div class="scheme${d === 'luminous' ? ' lx-stage' : ''}" data-scheme="${s}" style="display: grid; gap: 44px; padding: 44px 48px 56px; border-radius: 20px; border: 1px solid var(--border-subtle)">${d === 'luminous' ? '<div class="lx-ambient" aria-hidden="true"></div>' : ''}
  <div style="display: flex; justify-content: space-between; align-items: baseline"><p class="t-micro">${s === 'light' ? 'Light' : 'Dark'}</p><p class="t-micro">color-scheme: ${s}</p></div>

  <section style="display: grid; gap: 16px">
    <p class="t-micro">Buttons</p>
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
      <button type="button" class="ns-button" data-variant="primary">Continue</button>
      <button type="button" class="ns-button">Save for later</button>
      <button type="button" class="ns-button" data-variant="danger">Remove</button>
      <button type="button" class="ns-button" data-variant="quiet">Edit details</button>
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
      <button type="button" class="ns-button" data-variant="primary" data-demo="hover">Hover</button>
      <button type="button" class="ns-button" data-variant="primary" data-demo="active">Active</button>
      <button type="button" class="ns-button" data-variant="primary" data-demo="focus">Focus</button>
      <button type="button" class="ns-button" data-variant="primary" disabled="disabled">Disabled</button>
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
      <button type="button" class="ns-button" data-variant="primary" data-size="sm">Small</button>
      <button type="button" class="ns-button" data-variant="primary" data-size="lg">Large</button>
      <button type="button" class="ns-button" aria-pressed="true">${icon('check')}<span>Bold on</span></button>
      <button type="button" class="ns-button" aria-pressed="false">Italic off</button>
      <button type="button" class="ns-button" data-icon-only="true" aria-label="More actions">${icon('more')}</button>
    </div>
  </section>

  <section style="display: grid; gap: 16px">
    <p class="t-micro">Field and validation</p>
    <div class="ns-error-summary" role="alert" aria-labelledby="es-${id}">
      <h3 class="ns-error-summary__title" id="es-${id}">${icon('alert')}<span>There are 2 problems</span></h3>
      <ul>
        <li><a href="#pc-${id}">Enter a postcode</a></li>
        <li><a href="#dl-${id}">Choose a delivery option</a></li>
      </ul>
    </div>
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px">
      <div class="ns-field">
        <label class="ns-field__label" for="em-${id}">Email</label>
        <p class="ns-field__hint" id="emh-${id}">For your receipt</p>
        <input class="ns-input" id="em-${id}" type="email" value="sam@example.com" aria-describedby="emh-${id}" data-demo="focus" />
      </div>
      <div class="ns-field">
        <label class="ns-field__label" for="pc-${id}">Postcode</label>
        <p class="ns-field__hint" id="pch-${id}">4 digits</p>
        <input class="ns-input" id="pc-${id}" inputmode="numeric" aria-invalid="true" aria-describedby="pch-${id} pce-${id}" />
        <p class="ns-field__error" id="pce-${id}">${icon('alert')}<span>Enter a postcode</span></p>
      </div>
    </div>
    <div class="ns-field">
      <label class="ns-field__label" for="st-${id}">State or territory</label>
      <div class="ns-select-wrap">
        <select class="ns-select" id="st-${id}">
          <option>New South Wales</option>
          <option>Victoria</option>
          <option>Queensland</option>
        </select>
        ${icon('chevron')}
      </div>
    </div>
  </section>

  <section style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px">
    <fieldset class="ns-fieldset">
      <legend>Delivery</legend>
      <label class="ns-choice"><input class="ns-radio" type="radio" name="dl-${id}" checked="checked" /><span>Standard, 3–5 days</span></label>
      <label class="ns-choice"><input class="ns-radio" type="radio" name="dl-${id}" data-demo="focus" /><span>Express, next day</span></label>
    </fieldset>
    <div style="display: grid; gap: 8px; align-content: start">
      <p class="t-label">Preferences</p>
      <label class="ns-choice"><input class="ns-check" type="checkbox" checked="checked" /><span>Save these details</span></label>
      <label class="ns-choice"><input class="ns-check" type="checkbox" /><span>Send me updates</span></label>
      <label class="ns-choice"><input class="ns-switch" type="checkbox" role="switch" checked="checked" /><span>Leave at door — on</span></label>
    </div>
  </section>

  <section style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; align-items: start">
    <div style="display: grid; gap: 8px; justify-items: start">
      <p class="t-micro">Menu</p>
      <button type="button" class="ns-button" aria-haspopup="menu" aria-expanded="true">Actions ${icon('chevron')}</button>
      <div class="ns-menu" role="menu" aria-label="Actions">
        <button type="button" class="ns-menu__item" role="menuitem">${icon('pen')}<span>Rename</span></button>
        <button type="button" class="ns-menu__item" role="menuitem" data-demo="focus">${icon('copy')}<span>Duplicate</span></button>
        <div class="ns-menu__sep" role="separator"></div>
        <button type="button" class="ns-menu__item" role="menuitem" data-tone="critical">${icon('trash')}<span>Delete…</span></button>
      </div>
    </div>
    <div style="display: grid; gap: 8px">
      <p class="t-micro">Disclosure</p>
      <details class="ns-disclosure" name="faq-${id}" open="open">
        <summary>When will it arrive? ${icon('chevron')}</summary>
        <p>Standard delivery takes 3–5 business days.</p>
      </details>
      <details class="ns-disclosure" name="faq-${id}">
        <summary>Can I change my order? ${icon('chevron')}</summary>
        <p>Yes, until it ships.</p>
      </details>
    </div>
  </section>

  <section style="display: grid; gap: 14px">
    <p class="t-micro">Feedback</p>
    <div class="ns-alert" data-tone="info">${icon('info')}<p class="ns-alert__title">Delivery times have changed</p><p class="ns-alert__body">Orders placed after 2 pm ship the next business day.</p></div>
    <div class="ns-alert" data-tone="warning">${icon('warn')}<p class="ns-alert__title">Only 2 left</p><p class="ns-alert__body">Complete checkout to hold your item.</p></div>
    <div class="ns-toast" role="status">${icon('check')}<span>Saved to your list</span><button type="button" class="ns-button">Undo</button><button type="button" class="ns-button" data-icon-only="true" data-size="sm" aria-label="Dismiss">${icon('x')}</button></div>
  </section>

  <section style="display: grid; gap: 14px">
    <p class="t-micro">Dialog</p>
    <dialog class="ns-dialog" open="open" aria-labelledby="dt-${id}">
      <h3 class="ns-dialog__title" id="dt-${id}">Remove this item?</h3>
      <p class="t-body t-muted">It will be removed from your order. You can add it again later.</p>
      <form method="dialog" class="ns-dialog__actions">
        <button class="ns-button" value="cancel">Cancel</button>
        <button class="ns-button" data-variant="danger" value="remove">Remove</button>
      </form>
    </dialog>
  </section>
</div>`;
};

const SWATCHES = [
  ['bg-canvas', 'bg', 'fg-default'], ['bg-surface', 'bg', 'fg-default'], ['bg-surface-subtle', 'bg', 'fg-default'],
  ['fg-default', 'fg'], ['fg-muted', 'fg'],
  ['bg-accent', 'bg', 'fg-on-accent'], ['bg-accent-subtle', 'bg', 'fg-accent'], ['fg-accent', 'fg'],
  ['border-strong', 'line'], ['focus-ring', 'line'],
  ['bg-critical', 'bg', 'fg-on-critical'], ['fg-warning', 'fg'], ['fg-success', 'fg'], ['fg-info', 'fg'],
  ['bg-inverse', 'bg', 'fg-inverse'],
];
const swatchGrid = (d, s) => SWATCHES.map(([tok, kind, on]) => {
  const v = fmt(resolved[d][s][tok]);
  let chipStyle, label, note;
  if (kind === 'bg') {
    chipStyle = `background: var(--${tok}); color: var(--${on})`;
    label = 'Aa';
    note = `${on.replace('fg-', '')} ${ratio(d, s, on, tok)}:1`;
  } else if (kind === 'fg') {
    chipStyle = `background: var(--bg-canvas); color: var(--${tok})`;
    label = 'Aa';
    note = `on canvas ${ratio(d, s, tok, 'bg-canvas')}:1`;
  } else {
    chipStyle = `background: var(--bg-canvas); color: var(--fg-muted)`;
    label = `<span style="display: block; inline-size: 56%; block-size: 34px; border: ${tok === 'focus-ring' ? '3px' : '2px'} solid var(--${tok}); border-radius: var(--radius-s)"></span>`;
    note = `on canvas ${ratio(d, s, tok, 'bg-canvas')}:1`;
  }
  return `<div class="swatch"><div class="swatch__chip" style="${chipStyle}">${label}</div><div class="swatch__meta"><b>${tok}</b><span>${v}</span><span>${note}</span></div></div>`;
}).join('\n');

const head = (title, fonts) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="${(FONT_HOST + fonts).replace(/&/g, '&amp;')}">
<style>
${COMPONENT_CSS}
STYLE_EXTRA
</style>
</helmet>
`;
const tail = (props, logic = 'return {};') => `
</x-dc>
<script type="text/x-dc" data-dc-script data-props='${JSON.stringify(props).replace(/&/g, '&amp;').replace(/'/g, '&#39;')}'>
class Component extends DCLogic {
  renderVals() {
    ${logic}
  }
}
</script>
</body>
</html>
`;
const page = (title, fontsList, cssDirs, body, props, logic) =>
  head(title, fontsList).replace('STYLE_EXTRA', cssDirs.map(tokenCss).join('\n')) + body + tail(props, logic);

// ---------------------------------------------------------------- boards
const files = {};

// Foundations
for (const d of Object.keys(DIRS)) {
  const t = DIRS[d];
  const W = 1200, H = sizeOf(t, 'foundations', 3150);
  const lx = d === 'luminous' ? lxFoundations({ icon }) : { afterColour: '', beforeSignature: '' };
  const scale = [['3xs', '--space-3xs'], ['2xs', '--space-2xs'], ['xs', '--space-xs'], ['s', '--space-s'], ['m', '--space-m'], ['l', '--space-l'], ['xl', '--space-xl'], ['2xl', '--space-2xl'], ['3xl', '--space-3xl']];
  const body = `
<div class="board dir-${d}" data-scheme="${d === 'luminous' ? 'dark' : 'light'}" style="width: ${W}px; min-height: ${H}px; display: grid; align-content: start; gap: 56px; padding: 64px 72px 80px">
  ${d === 'luminous' ? `<header class="scheme lx-stage" data-scheme="dark" style="display: grid; gap: 20px; margin: -64px -72px 0; padding: 72px 72px 64px">
    <div class="lx-ambient" aria-hidden="true"></div>
    <div class="lx-dust" aria-hidden="true" style="position: absolute; inset-block: 0; inset-inline-end: 0; inline-size: 34%; z-index: -1"></div>
    <p class="t-micro">Lue UI · direction ${t.letter} · foundations</p>
    <h1 class="t-display"><span class="lx-chrome-text">${t.name}</span></h1>
    <p class="t-h3" style="font-weight: 300; max-inline-size: 30ch">${t.motto}</p>
    <div style="display: flex; flex-wrap: wrap; gap: 8px">${t.tags.map((x) => `<span class="ns-tag">${x}</span>`).join('')}</div>
  </header>` : `<header style="display: grid; gap: 18px">
    ${d === 'loom' ? '<div class="band" style="block-size: 14px; border-radius: 999px"></div>' : ''}${d === 'instrument' ? '<div class="ticks"></div>' : ''}
    <p class="t-micro">Direction ${t.letter} · foundations</p>
    <h1 class="t-display">${d === 'chroma' ? `<span class="hl">${t.name}</span>` : t.name}</h1>
    <p class="t-h3" style="font-weight: 400; max-inline-size: 30ch">${t.motto}</p>
    <div style="display: flex; flex-wrap: wrap; gap: 8px">${t.tags.map((x) => `<span class="ns-tag">${x}</span>`).join('')}<span class="ns-tag">${t.tagline}</span></div>
  </header>`}

  <section style="display: grid; gap: 20px">
    <div class="section-head"><h2 class="t-h2">Colour</h2><p class="t-micro">WCAG 2.x ratios · all 72 declared pairs pass${d === 'luminous' ? ' · plus 46 glass, chrome and prism rules' : ''}</p></div>
    ${(d === 'luminous' ? ['dark', 'light'] : ['light', 'dark']).map((s) => `
    <div class="scheme" data-scheme="${s}" style="display: grid; gap: 14px; padding: 28px; border-radius: 18px; border: 1px solid var(--border-subtle)">
      <p class="t-micro">${s === 'light' ? 'Light' : 'Dark'}</p>
      <div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px">
${swatchGrid(d, s)}
      </div>
    </div>`).join('')}
  </section>
${lx.afterColour}
  <section style="display: grid; gap: 20px">
    <div class="section-head"><h2 class="t-h2">Type</h2><p class="t-micro">${t.fontNames.join(' · ')}</p></div>
    <div style="display: grid; gap: 18px">
      <p class="t-display">Made for everyone</p>
      <p class="t-h1">Heading one — clear, calm checkout</p>
      <p class="t-h2">Heading two — delivery details</p>
      <p class="t-h3">Heading three — order summary</p>
      <p class="t-h4">Heading four — payment</p>
      <p class="t-body" style="max-inline-size: 66ch">Make accessible, standards-based interfaces the path of least resistance — by building with the web platform, not on top of it. Body text holds 7:1 contrast on every surface and a comfortable measure.</p>
      <p class="t-small t-muted">Small text for hints and secondary detail, at 4.5:1 or better.</p>
      <div style="display: flex; flex-wrap: wrap; gap: 28px; align-items: baseline">
        <p class="t-label">Label text</p>
        <p class="t-micro">Micro label</p>
        <code class="t-code">--${d === 'luminous' ? 'lue' : 'ns'}-color-fg-default</code>
        <p class="t-body">0123456789 · $1,249.00</p>
      </div>
    </div>
  </section>

  <section style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 40px">
    <div style="display: grid; gap: 16px; align-content: start">
      <div class="section-head"><h2 class="t-h2">Shape</h2><p class="t-micro">radius</p></div>
      <div style="display: flex; flex-wrap: wrap; gap: 14px; align-items: end">
        ${['xs', 's', 'm', 'l', 'full'].map((r) => `<div style="display: grid; gap: 6px; justify-items: center"><div style="inline-size: 64px; block-size: 64px; background: var(--bg-accent-subtle); border: 2px solid var(--fg-accent); border-radius: var(--radius-${r})"></div><span class="t-micro">${r}</span></div>`).join('')}
      </div>
      <div class="section-head" style="margin-block-start: 12px"><h2 class="t-h2">Elevation</h2><p class="t-micro">raised · overlay</p></div>
      <div style="display: flex; gap: 20px">
        <div class="ns-card" style="flex: 1; padding: 20px"><p class="t-label">Raised</p><p class="t-small t-muted">Cards, summaries</p></div>
        <div class="ns-card" style="flex: 1; padding: 20px; box-shadow: var(--shadow-overlay)"><p class="t-label">Overlay</p><p class="t-small t-muted">Menus, dialogs</p></div>
      </div>
    </div>
    <div style="display: grid; gap: 16px; align-content: start">
      <div class="section-head"><h2 class="t-h2">Space</h2><p class="t-micro">3xs → 3xl</p></div>
      <div style="display: grid; gap: 7px">
        ${scale.map(([n, v]) => `<div style="display: grid; grid-template-columns: 44px 1fr; align-items: center; gap: 10px"><span class="t-micro">${n}</span><span style="block-size: 12px; inline-size: var(${v}); background: var(--fg-accent); border-radius: 2px"></span></div>`).join('')}
      </div>
    </div>
  </section>

  <section style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px">
    <div style="display: grid; gap: 14px; align-content: start">
      <div class="section-head"><h2 class="t-h3">Focus</h2><p class="t-micro">2.4.13 AAA</p></div>
      <div style="display: flex; gap: 16px; align-items: center; padding: 10px"><button type="button" class="ns-button" data-variant="primary" data-demo="focus">Focused</button><input class="ns-input" style="inline-size: 140px" aria-label="Focused field" data-demo="focus" value="Field" /></div>
      <p class="t-small t-muted">Outline ≥ 2 px, offset, ≥ 3:1 against every surface; survives forced colours.</p>
    </div>
    <div style="display: grid; gap: 14px; align-content: start">
      <div class="section-head"><h2 class="t-h3">Targets</h2><p class="t-micro">2.5.8 · 2.5.5</p></div>
      <div style="display: flex; gap: 18px; align-items: end">
        <div style="display: grid; gap: 6px; justify-items: center"><div style="inline-size: 24px; block-size: 24px; border: 2px dashed var(--fg-accent); border-radius: 4px"></div><span class="t-micro">24 min</span></div>
        <div style="display: grid; gap: 6px; justify-items: center"><div style="inline-size: 44px; block-size: 44px; border: 2px dashed var(--fg-accent); border-radius: 6px"></div><span class="t-micro">44 touch</span></div>
        <div style="display: grid; gap: 6px; justify-items: center"><div style="inline-size: var(--size-control-md); block-size: var(--size-control-md); background: var(--bg-accent-subtle); border-radius: var(--radius-button)"></div><span class="t-micro">control</span></div>
      </div>
    </div>
    <div style="display: grid; gap: 14px; align-content: start">
      <div class="section-head"><h2 class="t-h3">Motion</h2><p class="t-micro">reduced = instant</p></div>
      ${t.motion.map((m) => `<p class="t-small">${m}</p>`).join('')}
    </div>
  </section>

${lx.beforeSignature ? `${lx.beforeSignature}
` : ''}  <section style="display: grid; gap: 10px">
    <div class="section-head"><h2 class="t-h3">Signature</h2><p class="t-micro">what makes it ownable</p></div>
    <p class="t-body" style="max-inline-size: 70ch">${t.signature}</p>
  </section>
</div>`;
  files[`${fileOf(t)}-Foundations.dc.html`] = { w: W, h: H, title: `${t.letter} · ${t.name} — foundations`, interactive: !!t.interactive,
    html: page(`${t.name} — foundations`, t.fonts, [d], body, { $preview: { width: W, height: H } }) };
}

// Components
for (const d of Object.keys(DIRS)) {
  const t = DIRS[d];
  const W = 1440, H = sizeOf(t, 'components', 2400);
  const body = `
<div class="board dir-${d}" data-scheme="${d === 'luminous' ? 'dark' : 'light'}" style="width: ${W}px; min-height: ${H}px; display: grid; align-content: start; gap: 32px; padding: 56px 56px 72px">
  <header style="display: flex; justify-content: space-between; align-items: end; gap: 24px">
    <div style="display: grid; gap: 8px"><p class="t-micro">${d === 'luminous' ? 'Lue UI · direction' : 'Direction'} ${t.letter} · components</p><h1 class="t-h1">${t.name} — Tier 1 sheet</h1></div>
    <p class="t-small t-muted" style="max-inline-size: 46ch">Real elements: buttons, inputs with labels, fieldsets, a dialog with a method="dialog" form. States drawn: hover, active, focus, disabled, pressed, invalid.</p>
  </header>
  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; align-items: start">
${(d === 'luminous' ? ['dark', 'light'] : ['light', 'dark']).map((s) => componentSheet(d, s)).join('\n')}
  </div>
</div>`;
  files[`${fileOf(t)}-Components.dc.html`] = { w: W, h: H, title: `${t.letter} · ${t.name} — components`, interactive: !!t.interactive,
    html: page(`${t.name} — components`, t.fonts, [d], body, { $preview: { width: W, height: H } }) };
}

// Checkout (composed screen), with dark + dialog tweaks
for (const d of Object.keys(DIRS)) {
  const t = DIRS[d];
  const W = 1280, H = sizeOf(t, 'checkout', 1240);
  const lum = d === 'luminous';
  const body = `
<div class="board dir-${d}${lum ? ' lx-stage' : ''}" data-scheme="{{scheme}}" style="width: ${W}px; min-height: ${H}px; position: relative; display: grid; align-content: start">${lum ? '\n  <div class="lx-ambient" aria-hidden="true"></div>' : ''}
  <header${lum ? ' class="lx-glass"' : ''} style="display: flex; justify-content: space-between; align-items: center; padding: 22px 56px; ${lum ? 'border-radius: 0; box-shadow: none' : 'border-block-end: 1px solid var(--border-subtle); background: var(--bg-surface)'}">
    <p class="t-h4" style="font-family: var(--font-display)">[Store name]</p>
    <ol class="ns-steps" aria-label="Checkout progress">
      <li><span class="num">1</span>Cart</li>
      <li aria-current="step"><span class="num">2</span>Details</li>
      <li><span class="num">3</span>Payment</li>
    </ol>
  </header>
  ${d === 'loom' ? '<div class="band" style="block-size: 10px"></div>' : ''}${d === 'instrument' ? '<div class="ticks" style="margin-inline: 56px"></div>' : ''}
  <main style="display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 48px; padding: 44px 56px 64px; align-items: start">
    <form style="display: grid; gap: 26px">
      <h1 class="t-h1">${d === 'chroma' ? '<span class="hl">Delivery</span> details' : 'Delivery details'}</h1>
      <div class="ns-error-summary" role="alert" aria-labelledby="co-es">
        <h2 class="ns-error-summary__title" id="co-es">${icon('alert')}<span>There are 2 problems</span></h2>
        <ul>
          <li><a href="#co-pc">Enter a postcode</a></li>
          <li><a href="#co-dl">Choose a delivery option</a></li>
        </ul>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px">
        <div class="ns-field"><label class="ns-field__label" for="co-fn">Full name</label><input class="ns-input" id="co-fn" autocomplete="name" value="Sam Taylor" /></div>
        <div class="ns-field"><label class="ns-field__label" for="co-em">Email</label><input class="ns-input" id="co-em" type="email" autocomplete="email" value="sam@example.com" /></div>
      </div>
      <div class="ns-field"><label class="ns-field__label" for="co-ad">Street address</label><input class="ns-input" id="co-ad" autocomplete="street-address" value="12 Example Street" /></div>
      <div style="display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1.3fr); gap: 20px; align-items: start">
        <div class="ns-field"><label class="ns-field__label" for="co-sb">Suburb</label><input class="ns-input" id="co-sb" autocomplete="address-level2" value="Newtown" /></div>
        <div class="ns-field"><label class="ns-field__label" for="co-pc">Postcode</label><input class="ns-input" id="co-pc" inputmode="numeric" autocomplete="postal-code" aria-invalid="true" aria-describedby="co-pce" /><p class="ns-field__error" id="co-pce">${icon('alert')}<span>Enter a postcode</span></p></div>
        <div class="ns-field"><label class="ns-field__label" for="co-st">State</label><div class="ns-select-wrap"><select class="ns-select" id="co-st" autocomplete="address-level1"><option>NSW</option><option>VIC</option><option>QLD</option></select>${icon('chevron')}</div></div>
      </div>
      <fieldset class="ns-fieldset" id="co-dl" aria-describedby="co-dle">
        <legend>Delivery option</legend>
        <p class="ns-field__error" id="co-dle">${icon('alert')}<span>Choose a delivery option</span></p>
        <label class="ns-choice"><input class="ns-radio" type="radio" name="co-dl" aria-invalid="true" /><span>Standard — 3 to 5 business days</span></label>
        <label class="ns-choice"><input class="ns-radio" type="radio" name="co-dl" aria-invalid="true" /><span>Express — next business day</span></label>
      </fieldset>
      <label class="ns-choice"><input class="ns-check" type="checkbox" checked="checked" /><span>Save these details for next time</span></label>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
        <button type="submit" class="ns-button" data-variant="primary" data-size="lg">Continue to payment</button>
        <a class="ns-link" href="#">Back to cart</a>
      </div>
    </form>
    <aside class="ns-card" aria-labelledby="co-sum" style="display: grid; gap: 18px">
      <h2 class="t-h3" id="co-sum">Order summary</h2>
      <ul style="list-style: none; margin: 0; padding: 0; display: grid; gap: 14px">
        <li style="display: grid; grid-template-columns: 64px 1fr auto; gap: 14px; align-items: center"><div aria-hidden="true" style="inline-size: 64px; block-size: 64px; border-radius: var(--radius-m); background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle)"></div><div><p class="t-label">[Item one]</p><p class="t-small t-muted">Qty 1</p></div><p class="t-label">[PRICE]</p></li>
        <li style="display: grid; grid-template-columns: 64px 1fr auto; gap: 14px; align-items: center"><div aria-hidden="true" style="inline-size: 64px; block-size: 64px; border-radius: var(--radius-m); background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle)"></div><div><p class="t-label">[Item two]</p><p class="t-small t-muted">Qty 2</p></div><p class="t-label">[PRICE]</p></li>
      </ul>
      <div style="display: grid; gap: 8px; border-block-start: 1px solid var(--border-subtle); padding-block-start: 16px">
        <div style="display: flex; justify-content: space-between"><span class="t-small t-muted">Subtotal</span><span class="t-small">[PRICE]</span></div>
        <div style="display: flex; justify-content: space-between"><span class="t-small t-muted">Delivery</span><span class="t-small">Calculated next</span></div>
        <div style="display: flex; justify-content: space-between; align-items: baseline"><span class="t-label">Total</span><span class="t-h3">[PRICE]</span></div>
      </div>
      <button type="button" class="ns-button" data-variant="quiet" style="justify-self: start">${icon('trash')}<span>Remove item two</span></button>
    </aside>
  </main>
  <sc-if value="{{showDialog}}" hint-placeholder-val="{{ false }}">
    <div style="position: absolute; inset: 0; background: var(--scrim); display: grid; place-items: center; padding: 40px">
      <dialog class="ns-dialog" open="open" aria-labelledby="co-dt">
        <h2 class="ns-dialog__title" id="co-dt">Remove this item?</h2>
        <p class="t-body t-muted">[Item two] will be removed from your order. You can add it again later.</p>
        <form method="dialog" class="ns-dialog__actions">
          <button class="ns-button" value="cancel">Cancel</button>
          <button class="ns-button" data-variant="danger" value="remove">Remove</button>
        </form>
      </dialog>
    </div>
  </sc-if>
</div>`;
  const darkDefault = lum;
  files[`${fileOf(t)}-Checkout.dc.html`] = { w: W, h: H, title: `${t.letter} · ${t.name} — checkout`, interactive: !!t.interactive,
    html: page(`${t.name} — checkout details`, t.fonts, [d], body,
      { dark: { editor: 'boolean', default: darkDefault }, dialog: { editor: 'boolean', default: false }, $preview: { width: W, height: H } },
      `return { scheme: ${darkDefault ? '(this.props.dark ?? true)' : 'this.props.dark'} ? 'dark' : 'light', showDialog: !!this.props.dialog };`) };
}

// C2 pages: fluid boards (expand: fill) for portfolio and editorial sites, each with a dark tweak
{
  const t = DIRS.luminous;
  for (const [f, label, build, H, dark] of [
    ['Blocks', 'block library', blocksBoard, 8000, true],
    ['Portfolio', 'portfolio home', portfolioBoard, 5400, true],
    ['Article', 'journal article', articleBoard, 6600, true],
  ]) {
    files[`Luminous-${f}.dc.html`] = { w: 1440, h: H, title: `${t.letter} · ${t.name} — ${label}`, interactive: true, expand: 'fill',
      html: page(`${t.name} — ${label}`, t.fonts, ['luminous'], build({ icon }),
        { dark: { editor: 'boolean', default: dark }, $preview: { width: 1440, height: H } },
        `return { scheme: ${dark ? '(this.props.dark ?? true)' : 'this.props.dark'} ? 'dark' : 'light' };`) };
  }
}

// Main — the three directions side by side
{
  const W = 1500, H = 1060;
  const allFonts = ['loom', 'instrument', 'chroma'].map((d) => DIRS[d].fonts.replace('&display=swap', '')).join('&') + '&display=swap';
  const col = (d) => {
    const t = DIRS[d];
    const chips = ['bg-canvas', 'bg-surface-subtle', 'fg-default', 'bg-accent', 'bg-accent-subtle', 'bg-critical'];
    return `
  <section class="dir-${d} scheme" data-scheme="light" aria-labelledby="m-${d}" style="display: grid; align-content: start; gap: 22px; padding: 36px 32px 40px; border-radius: 24px; border: 1px solid var(--border-subtle); font-family: var(--font-body)">
    ${d === 'loom' ? '<div class="band" style="block-size: 12px; border-radius: 999px"></div>' : ''}${d === 'instrument' ? '<div class="ticks"></div>' : ''}${d === 'chroma' ? '<div class="field" style="block-size: 12px; background: var(--highlight)"></div>' : ''}
    <p class="t-micro">Direction ${t.letter}</p>
    <h2 class="t-display" id="m-${d}" style="font-size: calc(var(--fs-display) * 0.86)">${d === 'chroma' ? `<span class="hl">${t.name}</span>` : t.name}</h2>
    <p class="t-h4" style="font-weight: 400">${t.motto}</p>
    <p class="t-micro">${t.tagline}</p>
    <div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px">
      ${chips.map((c) => `<span title="${c}" style="block-size: 34px; border-radius: var(--radius-s); background: var(--${c}); border: 1px solid var(--border-subtle)"></span>`).join('')}
    </div>
    <div class="scheme" data-scheme="dark" style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; padding: 8px; border-radius: var(--radius-m)">
      ${chips.map((c) => `<span title="${c} (dark)" style="block-size: 26px; border-radius: var(--radius-s); background: var(--${c}); border: 1px solid var(--border-subtle)"></span>`).join('')}
    </div>
    <div class="ns-field">
      <label class="ns-field__label" for="m-${d}-pc">Postcode</label>
      <input class="ns-input" id="m-${d}-pc" aria-invalid="true" aria-describedby="m-${d}-pce" />
      <p class="ns-field__error" id="m-${d}-pce">${icon('alert')}<span>Enter a postcode</span></p>
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 10px">
      <button type="button" class="ns-button" data-variant="primary">Continue</button>
      <button type="button" class="ns-button" data-demo="focus">Focus</button>
      <button type="button" class="ns-button" aria-pressed="true">${icon('check')}<span>On</span></button>
    </div>
    <p class="t-small t-muted">${t.fontNames.map((f) => f.split(' — ')[0]).join(' + ')}</p>
  </section>`;
  };
  const body = `
<div class="board" style="width: ${W}px; min-height: ${H}px; background: oklch(0.975 0.003 90); color: oklch(0.22 0.01 90); font-family: system-ui, sans-serif; display: grid; align-content: start; gap: 36px; padding: 56px 56px 64px">
  <header style="display: flex; justify-content: space-between; align-items: end; gap: 24px">
    <div style="display: grid; gap: 6px">
      <p style="margin: 0; font-size: 14px; letter-spacing: 0.06em; text-transform: uppercase; color: oklch(0.45 0.01 90)">never-ui · Phase 1 · design kickoff</p>
      <h1 style="margin: 0; font-size: 44px; line-height: 1.05; font-weight: 700">Three directions</h1>
    </div>
    <p style="margin: 0; max-inline-size: 52ch; font-size: 16px; line-height: 1.5; color: oklch(0.42 0.01 90)">Same components, same contrast rules, three personalities. Every text pair below meets WCAG 2.x in light and dark.</p>
  </header>
  <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; align-items: start">
${['loom', 'instrument', 'chroma'].map(col).join('\n')}
  </div>
</div>`;
  files['Main.dc.html'] = { w: W, h: H, title: 'Three directions',
    html: page('never-ui — three directions', allFonts, ['loom', 'instrument', 'chroma'], body, { $preview: { width: W, height: H } }) };
}

// ---------------------------------------------------------------- canvas.json
// Two pages: the direction in progress on its own, and the Phase 1 set (cover + three rows) for reference.
const rowGap = 120, titleSpace = 300;
const pages = [{ id: 'luminous', name: 'C2 · Chroma Luminous' }, { id: 'phase-1', name: 'Phase 1 · three directions' }];
const boards = {};
const order = [];
const notes = {};
const placeRow = (key, row, text, y, page) => {
  let x = 0, maxH = 0;
  for (const f of row) {
    boards[f] = { x, y, w: files[f].w, h: files[f].h, title: files[f].title, page,
      ...(files[f].interactive ? { is_interactive: true } : {}), ...(files[f].expand ? { expand: files[f].expand } : {}) };
    order.push(f);
    x += files[f].w + 80;
    maxH = Math.max(maxH, files[f].h);
  }
  notes[`row-${key}`] = { x: 0, y: y - 260, text, kind: 'title1', w: 240, maxW: x - 80, page };
  return y + maxH + rowGap + titleSpace;
};
const dirRow = (d, y, page) => {
  const t = DIRS[d], f = fileOf(t);
  return placeRow(d, [`${f}-Foundations.dc.html`, `${f}-Components.dc.html`, `${f}-Checkout.dc.html`], `${t.letter} · ${t.name} — ${t.tagline.toLowerCase()}`, y, page);
};
{
  const t = DIRS.luminous;
  const y2 = placeRow('luminous', ['Luminous-Foundations.dc.html', 'Luminous-Components.dc.html', 'Luminous-Blocks.dc.html'],
    `${t.letter} · ${t.name} — the system: foundations, components, blocks`, titleSpace, 'luminous');
  placeRow('luminous-pages', ['Luminous-Portfolio.dc.html', 'Luminous-Article.dc.html', 'Luminous-Checkout.dc.html'],
    `${t.letter} · ${t.name} — in use: portfolio, journal, a form`, y2, 'luminous');
  // Parked ideas, as stickies beside the system row.
  notes['future-neon'] = { x: 4320, y: titleSpace, w: 380, fill: 'purple', page: 'luminous',
    text: 'Future exploration · neon spectrum — push the prism further into wide-gamut neon (Display P3) inside @media (color-gamut: p3), keeping sRGB fallbacks and checking contrast in both. Parked 2026-10-05: not needed yet.' };
}
boards['Main.dc.html'] = { x: 0, y: 0, w: files['Main.dc.html'].w, h: files['Main.dc.html'].h, title: files['Main.dc.html'].title, page: 'phase-1' };
order.push('Main.dc.html');
let y = files['Main.dc.html'].h + rowGap + titleSpace;
for (const d of ['loom', 'instrument', 'chroma']) y = dirRow(d, y, 'phase-1');
const canvas = {
  v: 3,
  attachments: {}, // added by the canvas editor; kept so republishing doesn't fight it
  createdOnFiles: { v: 1, at: '2026-10-04T22:01:56Z' }, // the published canvas's marker — never change it
  title: 'Lue UI — design directions',
  launch: { view: 'canvas', page: 'luminous' },
  pages,
  boards, order, notes,
  designSystems: [],
};
fs.writeFileSync(path.join(OUT, 'canvas.json'), JSON.stringify(canvas, null, 2));
for (const [f, v] of Object.entries(files)) fs.writeFileSync(path.join(OUT, f), v.html);
console.log(Object.keys(files).length, 'artboards;', Object.entries(files).map(([f, v]) => `${f} ${(v.html.length / 1024).toFixed(1)}KB`).join(', '));
