// Builds the private Claude Design System for Lue UI into out/design-system/project/ (gitignored), from:
//   · the DTCG token source in packages/tokens/src  → project/tokens.json (the list shape the page reads)
//   · design-system/components.css + a generated header (per-theme material values) → components/bundle.css
//   · design-system/components.mjs (guidelines + live previews), README.md, fonts/, icons/
// Icons are uploads: run once with --uploads <file.json> holding {name: {blob, size}} to record them in the index.
// The index (design-system.json) is written last, as the type asks. Never publish this system to anyone.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHROME_ORDER } from './palettes.mjs';
import { lxVars } from './luminous-canvas.mjs';
import { COMPONENTS, previewDoc } from './design-system/components.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, '..', '..', 'packages', 'tokens', 'src');
const DS = path.join(HERE, 'design-system');
const ROOT = path.join(HERE, 'out', 'design-system');
const OUT = path.join(ROOT, 'project');
const arg = (k) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : undefined; };
const NOW = arg('--at') ?? new Date().toISOString();
const read = (f) => JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
const CONTEXTS = ['dark', 'light', 'dark-more', 'light-more'];
const base = (ctx) => ctx.replace('-more', '');

// ---------------------------------------------------------------- DTCG helpers
const css = (v) => `oklch(${v.components.join(' ')}${v.alpha != null && v.alpha < 1 ? ` / ${v.alpha}` : ''})`;
const pxOf = (d) => (d.unit === 'rem' ? +(d.value * 16).toFixed(2) : d.value);
const shadowCss = (list) => list.map((s) => `${s.inset ? 'inset ' : ''}${pxOf(s.offsetX)}px ${pxOf(s.offsetY)}px ${pxOf(s.blur)}px ${pxOf(s.spread)}px ${css(s.color)}`).join(', ');

const color = Object.fromEntries(CONTEXTS.map((c) => [c, read(`semantic/color.${c}.tokens.json`)]));
const material = { dark: read('semantic/material.dark.tokens.json'), light: read('semantic/material.light.tokens.json') };
const type = read('semantic/type.tokens.json');
const dim = read('semantic/dimension.tokens.json');
const motion = read('semantic/motion.tokens.json').motion;
const comp = read('component/components.tokens.json');

// ---------------------------------------------------------------- tokens.json
const colorTokens = [];
const perTheme = (fn) => Object.fromEntries(CONTEXTS.map((c) => [c, fn(c)]));
for (const [prop, roles] of Object.entries(color.dark.color)) {
  for (const [role, t] of Object.entries(roles)) {
    colorTokens.push({ name: `lue-color-${prop}-${role}`, value: perTheme((c) => css(color[c].color[prop][role].$value)), usage: t.$description });
  }
}
const M = (c) => material[base(c)].material;
const addMaterial = (name, pick, usage) => colorTokens.push({ name: `lue-material-${name}`, value: perTheme((c) => css(pick(M(c)))), usage });
addMaterial('glass-overlay', (m) => m.glass.overlay.$value, material.dark.material.glass.overlay.$description);
addMaterial('glass-modal', (m) => m.glass.modal.$value, material.dark.material.glass.modal.$description);
for (const k of ['tint', 'prism-base', 'prism-base-active', 'danger', 'pressed']) addMaterial(`button-${k}`, (m) => m.button[k].$value, material.dark.material.button[k].$description);
for (const k of Object.keys(material.dark.material.iridescence)) addMaterial(`iridescence-${k}`, (m) => m.iridescence[k].$value, material.dark.material.iridescence[k].$description);
// chrome c0–c4: the first stop that uses each, from the conic order
const firstStop = (ref) => CHROME_ORDER.findIndex(([r]) => r === ref);
for (let i = 0; i < 5; i++) addMaterial(`chrome-${i}`, (m) => m.chrome.$value[firstStop(`c${i}`)].color, `Chrome steel stop ${i} of the hairline ring (material.chrome). A 3:1 boundary on canvas, surfaces and glass.`);
for (let i = 0; i < 5; i++) addMaterial(`dispersion-${i}`, (m) => m.dispersion.$value[i].color, `Dispersion stop ${i} (amber → azure) at the lower edge of chrome. A 3:1 boundary.`);
for (let i = 0; i < 5; i++) addMaterial(`prism-fill-${i + 1}`, (m) => m['prism-fill'].$value[i].color, `Multi-tone fill tone ${i + 1} for checkboxes, radios, switches and step numbers; marks in fg-on-accent hold 4.5:1.`);
for (let i = 0; i < 5; i++) addMaterial(`prism-fill-active-${i + 1}`, (m) => m['prism-fill-active'].$value[i].color, `Multi-tone fill tone ${i + 1}, pressed.`);
for (let i = 0; i < 5; i++) addMaterial(`prism-ring-${i + 1}`, (m) => m['prism-ring'].$value[i].color, `Ring tone ${i + 1} for selected and on states (replaces chrome). A 3:1 boundary.`);
for (let i = 0; i < 4; i++) addMaterial(`metal-${i}`, (m) => m.metal.$value[i].color, `Liquid-metal band ${i} for icon tiles and avatars.`);
for (const k of Object.keys(material.dark.material.satin)) addMaterial(`satin-${k}`, (m) => m.satin[k].$value, material.dark.material.satin[k].$description);
for (const k of Object.keys(material.dark.material.ambient)) addMaterial(`ambient-${k}`, (m) => m.ambient[k].$value, material.dark.material.ambient[k].$description);
addMaterial('bead-on', (m) => m['bead-on'].$value, material.dark.material['bead-on'].$description);
addMaterial('spark', (m) => m.spark.$value, material.dark.material.spark.$description);

const shadowTokens = [];
const S = (c) => material[base(c)].shadow;
for (const k of ['raised', 'overlay', 'control', 'fringe']) shadowTokens.push({ name: `lue-shadow-${k}`, value: perTheme((c) => shadowCss(S(c)[k].$value)), usage: S('dark')[k].$description });
for (const k of Object.keys(S('dark').glow)) shadowTokens.push({ name: `lue-shadow-glow-${k}`, value: perTheme((c) => shadowCss(S(c).glow[k].$value)), usage: S('dark').glow[k].$description });

const spacing = Object.entries(dim.space).map(([k, t]) => ({ name: `lue-space-${k}`, value: `${pxOf(t.$value)}px`, usage: `${t.$description} Shown at 1280 px.` }));
const radius = [...Object.entries(dim.radius).map(([k, t]) => ({ name: `lue-radius-${k}`, value: `${pxOf(t.$value)}px`, usage: t.$description })),
  { name: 'lue-field-radius', value: `${pxOf(comp.field.radius.$value)}px`, usage: comp.field.radius.$description }];
const size = [
  { name: 'lue-size-target-min', value: `${pxOf(dim.size['target-min'].$value)}px`, usage: `${dim.size['target-min'].$description} Raise to 44px under (any-pointer: coarse).` },
  ...Object.entries(dim.size.control).map(([k, t]) => ({ name: `lue-size-control-${k}`, value: `${pxOf(t.$value)}px`, usage: t.$description })),
  ...Object.entries(dim.size.icon).map(([k, t]) => ({ name: `lue-size-icon-${k}`, value: `${pxOf(t.$value)}px`, usage: t.$description })),
  { name: 'lue-size-dialog-max', value: `${pxOf(comp.dialog['max-inline-size'].$value)}px`, usage: comp.dialog['max-inline-size'].$description },
];
const border = Object.entries(dim.border.width).map(([k, t]) => ({ name: `lue-border-width-${k}`, value: `${pxOf(t.$value)}px`, usage: t.$description }));
const focus = Object.entries(dim.focus).map(([k, t]) => ({ name: `lue-focus-${k}`, value: `${pxOf(t.$value)}px`, usage: t.$description }));

const sizeOfStep = (ref) => type.font.size[ref.slice(1, -1).split('.').pop()];
const lead = (ref) => type.font.leading[ref.slice(1, -1).split('.').pop()].$value;
const weight = (ref) => type.font.weight[ref.slice(1, -1).split('.').pop()].$value;
const famKey = (ref) => ref.slice(1, -1).split('.').pop();
const SAMPLES = { display: 'Interfaces that hold their light', 'heading-1': 'Designing with light', 'heading-2': 'Selected work', 'heading-3': 'Order summary', 'heading-4': 'Delivery details',
  body: 'Surfaces stay neutral; colour arrives as light, gathered at an edge.', 'body-sm': 'For your receipt', label: 'Email address', caption: 'CRAFT · 5 MIN READ', code: '--lue-color-fg-default' };
const style = (k) => {
  const t = type.text[k], v = t.$value, s = sizeOfStep(v.fontSize), ext = t.$extensions?.lue ?? {};
  return { name: `lue-text-${k}`, family: famKey(v.fontFamily), fontSize: `${pxOf(s.$value)}px`, lineHeight: lead(v.lineHeight), fontWeight: weight(v.fontWeight),
    ...(ext.letterSpacingEm ? { letterSpacing: `${ext.letterSpacingEm}em` } : {}), sample: SAMPLES[k],
    usage: `${t.$description} ${pxOf(s.$extensions.lue.fluid.min)} px at 360 → ${pxOf(s.$value)} px at 1280.${ext.textTransform ? ' Uppercase.' : ''}` };
};
const tokens = {
  name: 'Lue UI',
  version: 1,
  meta: { source: 'Lue UI repository · packages/tokens/src (DTCG 2025.10)', generated: NOW.slice(0, 10) },
  color: {
    note: 'Dark (obsidian) is primary. Literal OKLCH, gamut-mapped to sRGB. Every pair named in a usage note is contrast-checked in all four themes.',
    themes: [{ id: 'dark', name: 'Obsidian' }, { id: 'light', name: 'Pearl' }, { id: 'dark-more', name: 'Obsidian · more contrast' }, { id: 'light-more', name: 'Pearl · more contrast' }],
    tokens: colorTokens,
  },
  type: {
    fonts: [
      { family: 'Epilogue', file: 'fonts/epilogue-latin.woff2', weight: '300 700', style: 'normal' },
      { family: 'Figtree', file: 'fonts/figtree-latin.woff2', weight: '300 700', style: 'normal' },
      { family: 'Figtree', file: 'fonts/figtree-italic-latin.woff2', weight: '300 700', style: 'italic' },
      { family: 'Spline Sans Mono', file: 'fonts/spline-sans-mono-latin.woff2', weight: '400 600', style: 'normal' },
    ],
    families: { display: 'Epilogue, system-ui, sans-serif', body: 'Figtree, system-ui, sans-serif', mono: '"Spline Sans Mono", ui-monospace, monospace' },
    groups: [
      { name: 'Display', family: 'display', note: 'Epilogue. Light for display; headings at 480. Sizes shown at 1280 px.', styles: ['display', 'heading-1', 'heading-2', 'heading-3', 'heading-4'].map(style) },
      { name: 'Text', family: 'body', note: 'Figtree. Body never below 16 px; line height 1.6.', styles: ['body', 'body-sm', 'label'].map(style) },
      { name: 'Utility', family: 'mono', note: 'Spline Sans Mono for code and short uppercase micro-labels.', styles: ['caption', 'code'].map(style) },
    ],
  },
  spacing: { note: 'Multiples 0.25–6 of a fluid base (16 px at 360, 18 px at 1280). Shown at 1280.', tokens: spacing },
  radius: { note: 'Soft and pill-shaped; squircle corners where corner-shape exists.', tokens: radius },
  shadow: { note: 'Coloured, diffuse depth; glows rise on hover. Removed in forced colours.', tokens: shadowTokens },
  size: { note: 'Control heights are always max()-ed with the target minimum.', tokens: size },
  border: { tokens: border },
  focus: { note: 'An outline, never a box-shadow alone, so it survives forced colours.', tokens: focus },
  layer: { tokens: [{ name: 'lue-layer-sticky', value: String(dim.layer.sticky.$value), usage: dim.layer.sticky.$description }] },
  density: { tokens: [{ name: 'lue-density', value: '1', usage: 'Multiplier for a component\'s own padding and gaps: 0.75 compact, 1.25 comfortable. Never scales type or targets.' }] },
};

// ---------------------------------------------------------------- bundle.css header (generated)
const v = (n) => `var(--lue-material-${n})`;
const chromeStops = CHROME_ORDER.map(([ref, deg]) => `${v(`${ref[0] === 'c' ? 'chrome' : 'dispersion'}-${ref.slice(1)}`)} ${deg}deg`).join(', ');
const filter = (f) => `blur(${pxOf(f.blur.$value)}px) saturate(${f.saturate.$value}) contrast(${f.contrast.$value}) brightness(${f.brightness.$value})`;
const themeBlock = (s) => {
  const X = lxVars(s), m = material[s].material, dark = s === 'dark';
  const lines = {
    'color-scheme': s,
    '--lue-chrome-stops': chromeStops,
    '--lue-chrome-line': v(dark ? 'chrome-4' : 'chrome-1'),
    '--lue-chrome-text': dark ? `${v('chrome-0')} 0%, ${v('chrome-3')} 34%, ${v('chrome-2')} 50%, ${v('chrome-1')} 60%, ${v('chrome-0')} 100%` : `${v('chrome-0')} 0%, ${v('chrome-2')} 34%, ${v('chrome-3')} 50%, ${v('chrome-1')} 60%, ${v('chrome-4')} 100%`,
    '--lue-prism-fill': [1, 2, 3, 4, 5].map((i) => v(`prism-fill-${i}`)).join(', '),
    '--lue-prism-fill-active': [1, 2, 3, 4, 5].map((i) => v(`prism-fill-active-${i}`)).join(', '),
    '--lue-prism-ring': [1, 2, 3, 4, 5, 1].map((i) => v(`prism-ring-${i}`)).join(', '),
    '--lue-metal': `linear-gradient(165deg, ${v('metal-0')} 0%, ${v('metal-1')} 46%, ${v('metal-2')} 62%, ${v('metal-3')} 100%)`,
    '--lue-glass-filter': filter(m.glass),
    '--lue-glass-sheen': m.glass.sheen.$value ? `radial-gradient(120% 90% at 18% 0%, oklch(1 0 0 / ${m.glass.sheen.$value}), transparent 62%)` : 'none',
    '--lue-button-filter': filter(m.button),
    '--lue-button-sheen': `oklch(1 0 0 / ${m.button.sheen.$value})`,
    '--lue-button-rim-top': X['--btn-rim-top'], '--lue-button-rim-bottom': X['--btn-rim-bottom'], '--lue-button-refract': X['--btn-refract'],
    '--lue-button-depth': 'inset 0 1px 0.5px var(--lue-button-rim-top), inset 0 -1px 0 var(--lue-button-rim-bottom), inset 0 -7px 10px -8px var(--lue-button-refract)',
    '--lue-field-bg': dark ? 'var(--lue-color-bg-surface-subtle)' : 'var(--lue-color-bg-surface)',
    '--lue-field-inset': X['--field-inset'], '--lue-focus-glow': X['--focus-glow'],
    '--lue-bead': X['--bead'], '--lue-bead-rim': X['--bead-rim'], '--lue-bead-on': X['--bead-on'], '--lue-bead-on-rim': X['--bead-on-rim'],
    '--lue-metal-rim-top': X['--metal-rim-top'], '--lue-metal-rim-bottom': X['--metal-rim-bottom'], '--lue-tile-shadow': X['--tile-shadow'],
    '--lue-prism-glass-top': X['--prism-glass-top'], '--lue-prism-glass-bottom': X['--prism-glass-bottom'], '--lue-prism-shadow': X['--prism-shadow'],
  };
  return Object.entries(lines).map(([k, val]) => `    ${k}: ${val};`).join('\n');
};
const header = `/* Lue UI - generated from packages/tokens/src by tools/directions/design-system.mjs. Do not edit; edit the tokens. */
@layer lue {
  @layer tokens, base, components, blocks, materials, contrast;
}
@property --lue-angle { syntax: '<angle>'; inherits: true; initial-value: 0deg; }

@layer lue.tokens {
  :root {
    --lue-font-family-display: var(--font-display, Epilogue, system-ui, sans-serif);
    --lue-font-family-body: var(--font-body, Figtree, system-ui, sans-serif);
    --lue-font-family-mono: var(--font-mono, "Spline Sans Mono", ui-monospace, monospace);
${Object.entries(motion.duration).map(([k, t]) => `    --lue-motion-duration-${k}: ${t.$value.value}${t.$value.unit};`).join('\n')}
${Object.entries(motion.ease).map(([k, t]) => `    --lue-motion-ease-${k}: ${t.$extensions?.lue?.css ?? `cubic-bezier(${t.$value.join(', ')})`};`).join('\n')}
    --lue-gutter: clamp(16px, 4vw, 56px);
  }
  /* Per-scheme material values. The -more themes share their scheme's values; their opaque rules are in lue.contrast. */
  :where(:root, [data-theme^="dark"], [data-scheme="dark"]) {
${themeBlock('dark')}
  }
  :where([data-theme^="light"], [data-scheme="light"]) {
${themeBlock('light')}
  }
  @media (prefers-reduced-motion: reduce) {
    :root { ${Object.keys(motion.duration).map((k) => `--lue-motion-duration-${k}: 0s;`).join(' ')} }
  }
}
`;

// ---------------------------------------------------------------- cover (written last, from what was built)
const cover = `<!-- @dsCard height=288 -->
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Lue UI</title>
<style>
  html, body { margin: 0; height: 100%; }
  body { background: var(--lue-color-bg-canvas); color: var(--lue-color-fg-default); font-family: var(--lue-font-family-body); overflow: hidden; }
  .cover { position: relative; height: 288px; overflow: hidden; }
  .art { position: absolute; top: 0; left: 480px; width: 480px; height: 288px; overflow: hidden; }
  .art svg { display: block; width: 480px; height: 288px; }
  .ink { fill: var(--lue-color-fg-default); }
  .aqua { fill: var(--lue-material-prism-fill-1); }
  .orchid { fill: var(--lue-material-prism-fill-5); }
  .rose { fill: var(--lue-material-prism-fill-4); }
  .light { fill: var(--lue-material-prism-fill-3); }
  .words { position: absolute; left: 36px; bottom: 36px; max-width: 440px; }
  .name { margin: 0; font-family: var(--lue-font-family-display); font-weight: 300; font-size: 112px; line-height: 0.92; letter-spacing: -0.035em; color: var(--lue-color-fg-default); }
  .tag { margin: 13.5px 0 0 4px; font-size: 14px; line-height: 20px; color: var(--lue-color-fg-muted); }
</style>
</head>
<body>
<div class="cover">
<div class="art" aria-hidden="true">
<svg viewBox="0 0 480 288" width="480" height="288">
<!--
  blocks      fg-default (pearl on obsidian, obsidian on pearl) 72×400 · prism-fill-1 aqua 54×340 · prism-fill-5 orchid 36×300 · prism-fill-4 rose 36×180 - about a third of 960×288
  arrangement a staggered stack of pills bleeding off the right edge, like bands of light leaving a prism; tops on space-s steps
  pattern     pills, from "pills for buttons, tags and toasts" (radius-full) and colour-as-light: a row of fourteen space-2xs light dots in prism-fill-3 at a space-s pitch under the stack
  scales      heights space-2xl / space-xl / space-l; gaps space-s (18); pitch space-s; pills rx = half the short side
-->
<rect class="ink" x="80" y="18" width="420" height="72" rx="36"/>
<rect class="aqua" x="40" y="108" width="460" height="54" rx="27"/>
<rect class="orchid" x="128" y="180" width="372" height="36" rx="18"/>
<rect class="rose" x="300" y="234" width="200" height="36" rx="18"/>
${Array.from({ length: 14 }, (_, i) => `<rect class="light" x="${40 + i * 18}" y="246" width="9" height="9" rx="4.5"/>`).join('\n')}
</svg>
</div>
<div class="words">
<p class="name">Lue UI</p>
<p class="tag">Light, caught in chrome and glass.</p>
</div>
</div>
</body>
</html>
`;

// ---------------------------------------------------------------- write
fs.rmSync(OUT, { recursive: true, force: true });
const write = (p, data) => { const f = path.join(OUT, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };
write('tokens.json', JSON.stringify(tokens, null, 2) + '\n');
write('README.md', fs.readFileSync(path.join(DS, 'README.md'), 'utf8'));
write('components/bundle.css', header + '\n' + fs.readFileSync(path.join(DS, 'components.css'), 'utf8'));
for (const c of COMPONENTS) {
  write(`components/${c[0]}/README.md`, `# ${c[0]}\n\n${c[3]}`);
  write(`components/${c[0]}/preview.html`, previewDoc(c));
}
for (const f of fs.readdirSync(path.join(DS, 'fonts'))) write(`fonts/${f}`, fs.readFileSync(path.join(DS, 'fonts', f)));
const icons = fs.readdirSync(path.join(DS, 'icons')).filter((f) => f.endsWith('.svg')).sort();
write('assets/Icons/README.md', `# Icons\n\nPhosphor (MIT, © 2023 Phosphor Icons - see LICENSE.txt), regular weight, on a 256-unit grid. Each is a single-ink SVG filled with \`currentColor\`: inline it in markup with \`class="lue-icon"\` so it takes the text colour (as an \`<img>\` it renders black). Size with the text (1.25 em); \`aria-hidden="true"\` unless it is the only label, then give the control an \`aria-label\`. Arrows mirror in right-to-left layouts (\`data-mirror\`).\n\n${icons.map((f) => `- \`${f}\``).join('\n')}\n`);
write('assets/Icons/LICENSE.txt', fs.readFileSync(path.join(DS, 'icons', 'LICENSE.txt')));
write('components/Cover/preview.html', cover);

const uploads = arg('--uploads') ? Object.fromEntries(Object.entries(JSON.parse(fs.readFileSync(arg('--uploads'), 'utf8'))).filter(([k]) => !k.startsWith('_'))) : null;
const index = {
  v: 3,
  layout: 'files',
  createdOnFiles: { v: 1, at: arg('--created') ?? NOW },
  title: 'Lue UI',
  namespace: 'LueUI',
  libraries: [],
  sections: {},
  groups: ['Icons'],
  assetGroups: { Icons: { name: 'Icons', tile: 's', order: uploads ? icons.filter((f) => uploads[f]) : [], files: uploads ? Object.fromEntries(icons.filter((f) => uploads[f]).map((f) => [f, { name: f, blob: uploads[f].blob, size: uploads[f].size, type: 'image/svg+xml' }])) : {} } },
  blobs: {},
  docs: { sections: [] },
  lastChange: { by: 'Sean Kinread', at: NOW, via: 'Claude Code', note: arg('--note') ?? 'Built from the Lue UI repository: tokens, brand book, 44 components and blocks, fonts and icons.' },
};
write('design-system.json', JSON.stringify(index, null, 2) + '\n');
const count = (d) => fs.readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? count(path.join(d, e.name)) : 1), 0);
console.log(`${count(OUT)} files → ${path.relative(process.cwd(), OUT)} · ${colorTokens.length} colours × 4 themes · ${COMPONENTS.length} components · ${icons.length} icons${uploads ? ' (recorded)' : ' (not yet uploaded)'}`);
