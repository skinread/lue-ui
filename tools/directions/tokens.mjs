// Generates Lue UI's token source as DTCG 2025.10 JSON from the verified C2 · Chroma Luminous palettes.
// Output: packages/tokens/src/ (or a folder passed as the first argument). JSON only — the Terrazzo build arrives in
// Pass 3 (ADR-0003). Run check-tokens.mjs afterwards: every declared pair must pass in every context.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { directions, pairs, luminous as LUM, tones, chromeStops, buttonBlobs, ambientGlows, prismRamp } from './palettes.mjs';
import { oklch, toHex } from './contrast.mjs';
import { lxVars, lxShadows } from './luminous-canvas.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(process.argv[2] ?? path.join(HERE, '..', '..', 'packages', 'tokens', 'src'));
const PAL = directions.luminous;
const CONTEXTS = ['dark', 'light', 'dark-more', 'light-more']; // primary first
const SCHEMES = ['dark', 'light'];

// ---------------------------------------------------------------- value helpers
const r3 = (n) => +(+n).toFixed(3);
// Literal colours, gamut-mapped to sRGB exactly as the contrast checker sees them; hex as a fallback for tools.
const color = (v, alpha) => {
  const c = oklch(...v);
  const value = { colorSpace: 'oklch', components: [r3(c.L), r3(c.C), +(+c.h).toFixed(1)], hex: toHex(c) };
  if (alpha != null && alpha < 1) value.alpha = alpha;
  return value;
};
const px = (n) => ({ value: n, unit: 'px' });
const rem = (n) => ({ value: +(n / 16).toFixed(4), unit: 'rem' });
const ms = (n) => ({ value: n, unit: 'ms' });
const tok = ($type, $value, $description, $extensions) => ({ $type, $value, $description, ...($extensions ? { $extensions: { lue: $extensions } } : {}) });
const gradient = (stops, $description) => tok('gradient', stops.map(([v, position, alpha]) => ({ color: color(v, alpha), position: r3(position) })), $description);

// CSS shadow lists ("0 8px 24px -14px oklch(0.8 0.11 318 / 0.5), inset 1px 1px 0 …") → DTCG shadow arrays.
function shadows(css) {
  const parts = [];
  let depth = 0, cur = '';
  for (const ch of css) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts.map((p) => {
    const inset = /^inset\s/.test(p);
    const m = p.match(/oklch\(([^)]+)\)/);
    const [lch, a] = m[1].split('/').map((x) => x.trim());
    const [L, C, h] = lch.split(/\s+/).map(Number);
    const lengths = p.replace(m[0], '').replace('inset', '').trim().split(/\s+/).map((x) => parseFloat(x));
    const [offsetX, offsetY, blur = 0, spread = 0] = lengths;
    return { color: color([L, C, h], a == null ? undefined : +a), offsetX: px(offsetX), offsetY: px(offsetY), blur: px(blur), spread: px(spread), ...(inset ? { inset: true } : {}) };
  });
}

// ---------------------------------------------------------------- semantic colour
const COLOR_USE = {
  'bg-canvas': 'Page background.',
  'bg-surface': 'Opaque cards, menus, dialogs and popovers — and the fallback for every glass surface.',
  'bg-surface-subtle': 'Wells, input fills and table stripes.',
  'fg-default': 'Body text and icons on canvas, surfaces, glass and satin.',
  'fg-muted': 'Secondary text and hints.',
  'border-subtle': 'Decorative dividers. Carries no contrast requirement.',
  'border-strong': 'Boundaries that identify a control, and the solid fallback for chrome.',
  'bg-accent': 'Solid fallback for prism fills: selected states and small controls.',
  'bg-accent-hover': 'Solid prism fallback, hovered.',
  'bg-accent-active': 'Solid prism fallback, pressed.',
  'bg-accent-subtle': 'Accent tint behind text; pressed toggles; the opaque primary button.',
  'fg-accent': 'Links and accent text.',
  'fg-on-accent': 'Marks and text on prism fills (check marks, radio dots, step numbers).',
  'focus-ring': 'The :focus-visible outline, on every background it can meet.',
  'bg-critical': 'Solid destructive fill.',
  'fg-on-critical': 'Text on the solid destructive fill.',
  'fg-critical': 'Error text and icons, and invalid field boundaries.',
  'bg-critical-subtle': 'Error backgrounds.',
  'fg-warning': 'Warning text and icons.',
  'bg-warning-subtle': 'Warning backgrounds.',
  'fg-success': 'Success text and icons.',
  'bg-success-subtle': 'Success backgrounds.',
  'fg-info': 'Information text and icons.',
  'bg-info-subtle': 'Information backgrounds.',
  'bg-inverse': 'Toasts and tooltips.',
  'fg-inverse': 'Text on inverse surfaces.',
};
const pathOf = (key) => { const i = key.indexOf('-'); return [key.slice(0, i), key.slice(i + 1)]; };
const ref = (key) => `{color.${pathOf(key).join('.')}}`;
const pairsOf = (key) => pairs.filter(([fg]) => fg === key).flatMap(([, bgs, min]) => bgs.map((bg) => ({ on: ref(bg), min })));

function semanticColor(ctx) {
  const base = ctx.replace('-more', '');
  const g = { color: {} };
  for (const [key, v] of Object.entries(PAL[ctx])) {
    const [prop, role] = pathOf(key);
    const p = pairsOf(key);
    g.color[prop] ??= {};
    g.color[prop][role] = tok('color', color(v), COLOR_USE[key], p.length ? { pairs: p } : undefined);
  }
  g.color.overlay = { scrim: tok('color', color(LUM[base].scrim.col, LUM[base].scrim.alpha), 'The modal ::backdrop. Modal glass is checked through it.') };
  return {
    $description: `Semantic colour, ${ctx}. Literal values only (no aliases into another context).`,
    $extensions: { lue: { context: ctx, scheme: base, contrast: ctx.endsWith('-more') ? 'more' : 'standard',
      rule: ctx.endsWith('-more') ? 'Pair minimums rise: text to 7:1, boundaries (border-strong, focus-ring) to 4.5:1.' : 'Pair minimums as declared.' } },
    ...g,
  };
}

// ---------------------------------------------------------------- materials (C2) and shadows, per scheme
function materials(s) {
  const X = LUM[s];
  const V = lxVars(s);
  const even = (list, alpha) => list.map((v, i) => [v, list.length === 1 ? 0 : i / (list.length - 1), alpha]);
  const glassTier = (alpha, use) => tok('color', color(X.glass.tint, alpha), use);
  const glass = {
    overlay: glassTier(X.glass.overlay, 'Overlay glass tint: menus, popovers, cards, sticky bars. Checked worst-case over white, black and every fill.'),
    modal: glassTier(X.glass.modal, 'Modal glass tint: dialogs, over the scrim.'),
    blur: tok('dimension', px(22), 'Backdrop blur for overlay and modal glass.'),
    saturate: tok('number', 1.6, 'Backdrop saturate() for glass.'),
    contrast: tok('number', X.glass.filter.contrast, 'Backdrop contrast() that compresses the range behind glass, so text stays legible.'),
    brightness: tok('number', X.glass.filter.brightness, 'Backdrop brightness() for glass.'),
    sheen: tok('number', X.glass.sheen, 'Alpha of the white sheen on glass (0 = none).'),
  };
  const B = X.buttons;
  const button = {
    tint: tok('color', color(B.neutral.tint, B.neutral.alpha), 'Clear glass button.'),
    'prism-base': tok('color', color(B.neutral.tint, B.prism.base), 'Base pane of a prism (primary) button.'),
    'prism-base-active': tok('color', color(B.neutral.tint, B.prism.baseActive), 'Base pane of a pressed primary button.'),
    danger: tok('color', color(B.danger.tint, B.danger.alpha), 'Destructive glass button.'),
    pressed: tok('color', color(B.pressed.tint, B.pressed.alpha), 'Pressed toggle button.'),
    blur: tok('dimension', px(10), 'Backdrop blur for buttons outside a glass parent.'),
    saturate: tok('number', 1.8, 'Backdrop saturate() for buttons.'),
    contrast: tok('number', B.filter.contrast, 'Backdrop contrast() for buttons.'),
    brightness: tok('number', B.filter.brightness, 'Backdrop brightness() for buttons.'),
    sheen: tok('number', B.sheen, 'Alpha of the white sheen at the top of a button.'),
  };
  const iridescence = Object.fromEntries(buttonBlobs(s).map((v, i) => [String(i + 1),
    tok('color', color(v, B.prism.alpha), `Prism tone ${i + 1} of a primary button (${B.prism.hues[i]}). Tones share one lightness, so they can drift without changing contrast.`)]));
  const ambient = Object.fromEntries(Object.keys(LUM.prism).map((n, i) => [n, tok('color', color(ambientGlows(s)[i], X.ambient.alpha), `Ambient ${n} light behind content (checked where text can sit on it, also doubled).`)]));
  const satin = Object.fromEntries(X.satin.map((v, i) => [String(i), tok('color', color(v), i === X.satin.length - 1 ? 'Satin highlight ridge.' : `Satin fold ${i}. Hero text is checked against every fold.`)]));
  return {
    $description: `C2 · Chroma Luminous materials, ${s}. Decoration: every piece has an opaque fallback (prefers-reduced-transparency, prefers-contrast: more, no backdrop-filter) and is removed in forced colours.`,
    $extensions: { lue: { scheme: s } },
    material: {
      glass, button, iridescence, ambient, satin,
      chrome: gradient(chromeStops(s).map(([v, deg]) => [v, deg / 360]), 'The chrome hairline as conic stops (position = turn). Every stop is a 3:1 boundary; the band near 0.5 is the dispersion.'),
      dispersion: gradient(even(X.dispersion), 'Dispersed light at the lower edge of chrome: amber → citron → mint → aqua → azure.'),
      'prism-fill': gradient(even(tones(s, 'accent')), 'Multi-tone fill for small controls (checkbox, radio, switch, steps).'),
      'prism-fill-active': gradient(even(tones(s, 'accent', 'Lactive')), 'Multi-tone fill, pressed.'),
      'prism-ring': gradient(even([...tones(s, 'ring'), tones(s, 'ring')[0]]), 'Multi-tone ring that replaces chrome on selected and on states; a 3:1 boundary.'),
      metal: gradient([[X.metal[0], 0], [X.metal[1], 0.46], [X.metal[2], 0.62], [X.metal[3], 1]], 'Liquid metal for icon tiles and avatars.'),
      'bead-on': tok('color', color(X.beadOn), 'Switch thumb when on (3:1 against the multi-tone track).'),
      spark: tok('color', color([1, 0, 0], 0.95), 'Specks of light that drift along primaries on hover. Never over text.'),
    },
    shadow: {
      raised: tok('shadow', shadows(lxShadows[s].raised), 'Cards and raised surfaces.'),
      overlay: tok('shadow', shadows(lxShadows[s].overlay), 'Menus, dialogs and other overlays.'),
      control: tok('shadow', shadows(V['--shadow-control']), 'Resting depth under buttons.'),
      fringe: tok('shadow', shadows(V['--fringe']), 'Prism fringe inside the edge of glass (inset).'),
      glow: {
        rest: tok('shadow', shadows(V['--glow-rest']), 'Diffuse prism glow under a primary at rest.'),
        hover: tok('shadow', shadows(V['--glow-hover']), 'Glow under a hovered primary.'),
        soft: tok('shadow', shadows(V['--glow-soft']), 'Glow under a hovered neutral button.'),
        critical: tok('shadow', shadows(V['--glow-critical']), 'Glow under a hovered destructive button.'),
      },
    },
  };
}

// ---------------------------------------------------------------- primitives
function primitiveColor() {
  const neutral = Object.fromEntries([98, 95, 90, 80, 70, 60, 50, 40, 30, 23, 19, 15].map((L) =>
    [String(L), tok('color', color([L / 100, L > 50 ? 0.008 : 0.022, 285]), `Neutral at lightness ${L / 100} (hue 285).`)]));
  const prism = Object.fromEntries(Object.entries(prismRamp()).map(([name, steps]) => [name, Object.fromEntries(steps.map((v) =>
    [String(Math.round(v[0] * 100)), tok('color', color(v), `${name} at lightness ${v[0]}, subdued-neon chroma.`)]))]));
  return { $description: 'Primitive colour: the neutral ramp and the eight-hue prism. Step names are lightness × 100. Never public CSS.', color: { neutral, prism } };
}

// Fluid sizes: $value is the 1280 px size; $extensions.lue.fluid gives the 360 px size for the clamp() the build emits.
const fluid = (min, max, use) => tok('dimension', rem(max), use, { fluid: { min: rem(min), minViewport: 360, maxViewport: 1280 } });
const STEPS = [['minus-2', 12, 12], ['minus-1', 14, 15], ['0', 16, 17], ['1', 17.5, 19], ['2', 20, 24], ['3', 24, 32], ['4', 30, 46], ['5', 44, 84]];

function typography() {
  const family = {
    display: tok('fontFamily', ['Bricolage Grotesque', 'system-ui', 'sans-serif'], 'Display and headings (SIL OFL; light 300, full optical size).'),
    body: tok('fontFamily', ['Figtree', 'system-ui', 'sans-serif'], 'Body text, labels and controls (SIL OFL).'),
    mono: tok('fontFamily', ['Spline Sans Mono', 'ui-monospace', 'monospace'], 'Code, and uppercase micro-labels (SIL OFL).'),
  };
  const weight = {
    light: tok('fontWeight', 300, 'Display.'), regular: tok('fontWeight', 400, 'Body.'),
    heading: tok('fontWeight', 480, 'Headings 1–4.'), label: tok('fontWeight', 600, 'Labels, buttons, micro-labels.'),
  };
  const size = Object.fromEntries(STEPS.map(([n, min, max]) => [`step-${n}`, fluid(min, max, `Type step ${n.replace('minus-', '−')}: ${min} px at 360, ${max} px at 1280.${n === '0' ? ' Body; never below 16 px.' : ''}`)]));
  const leading = {
    display: tok('number', 0.98, 'Line height for display.'), 'heading-1': tok('number', 1.04, 'Heading 1.'), 'heading-2': tok('number', 1.1, 'Heading 2.'),
    'heading-3': tok('number', 1.2, 'Heading 3.'), 'heading-4': tok('number', 1.3, 'Heading 4 and labels.'),
    body: tok('number', 1.6, 'Body text (≥ 1.5).'), small: tok('number', 1.5, 'Small text.'),
  };
  const tracking = {
    display: tok('number', -0.035, 'Letter spacing for display, in em.', { unit: 'em' }),
    heading: tok('number', -0.02, 'Letter spacing for headings, in em.', { unit: 'em' }),
    micro: tok('number', 0.16, 'Letter spacing for uppercase micro-labels, in em.', { unit: 'em' }),
  };
  const style = (fam, step, w, lh, em, use, extra = {}) => tok('typography', {
    fontFamily: `{font.family.${fam}}`, fontSize: `{font.size.step-${step}}`, fontWeight: `{font.weight.${w}}`, lineHeight: lh,
    letterSpacing: px(0),
  }, use, { letterSpacingEm: em, ...extra });
  const text = {
    display: style('display', '5', 'light', '{font.leading.display}', -0.035, 'Hero and page display.', { fontVariationSettings: "'opsz' 96" }),
    'heading-1': style('display', '4', 'heading', '{font.leading.heading-1}', -0.02, 'Page title.'),
    'heading-2': style('display', '3', 'heading', '{font.leading.heading-2}', -0.02, 'Section heading.'),
    'heading-3': style('display', '2', 'heading', '{font.leading.heading-3}', -0.02, 'Subsection heading.'),
    'heading-4': style('display', '1', 'heading', '{font.leading.heading-4}', -0.02, 'Minor heading.'),
    body: style('body', '0', 'regular', '{font.leading.body}', 0, 'Running text, 45–75 characters per line.'),
    'body-sm': style('body', 'minus-1', 'regular', '{font.leading.small}', 0, 'Hints and secondary detail.'),
    label: style('body', '0', 'label', '{font.leading.heading-4}', 0, 'Form labels and buttons.'),
    caption: style('mono', 'minus-2', 'label', '{font.leading.small}', 0.16, 'Uppercase micro-labels (never running text).', { textTransform: 'uppercase' }),
    code: style('mono', 'minus-1', 'regular', '{font.leading.body}', 0, 'Code.'),
  };
  return { $description: 'Type: families, weights, the fluid scale (steps −2 … 5), leading, tracking and text styles.', font: { family, weight, size, leading, tracking }, text };
}

function dimensions() {
  const space = Object.fromEntries([['3xs', 0.25], ['2xs', 0.5], ['xs', 0.75], ['s', 1], ['m', 1.5], ['l', 2], ['xl', 3], ['2xl', 4], ['3xl', 6]]
    .map(([n, k]) => [n, fluid(16 * k, 18 * k, `Space ${n}: ${16 * k} px at 360, ${18 * k} px at 1280.`)]));
  return {
    $description: 'Space, size, radius, border, focus and layering.',
    space,
    size: {
      'target-min': tok('dimension', px(24), 'Minimum interactive target; 44 px under (any-pointer: coarse).', { coarse: px(44) }),
      control: { sm: tok('dimension', rem(40), 'Small control height.'), md: tok('dimension', rem(50), 'Default control height.'), lg: tok('dimension', rem(60), 'Large control height.') },
      icon: { sm: tok('dimension', rem(16), 'Small icon (scales with text in CSS).'), md: tok('dimension', rem(20), 'Default icon.'), lg: tok('dimension', rem(24), 'Large icon.') },
      measure: tok('number', 66, 'Measure for running text, in ch.', { unit: 'ch' }),
    },
    radius: {
      none: tok('dimension', px(0), 'Square.'), xs: tok('dimension', px(8), 'Checkboxes, chips.'), s: tok('dimension', px(12), 'Small surfaces.'),
      m: tok('dimension', px(20), 'Menus, alerts, media.'), l: tok('dimension', px(28), 'Cards, dialogs (squircle as an enhancement).'), full: tok('dimension', px(9999), 'Pills: buttons, tags, toasts.'),
    },
    border: { width: { thin: tok('dimension', px(1), 'Hairlines: chrome, fields, dividers.'), thick: tok('dimension', px(2), 'Emphasis: error summary, selected outlines in more contrast.') } },
    focus: { width: tok('dimension', px(2), 'Focus outline width (minimum).'), offset: tok('dimension', px(3), 'Focus outline offset.') },
    layer: { sticky: tok('number', 10, 'z-index for sticky page furniture. Overlays use the top layer instead.') },
  };
}

function motion() {
  return {
    $description: 'Motion. Every duration becomes 0s under prefers-reduced-motion: reduce; nothing animates on its own.',
    motion: {
      duration: { fast: tok('duration', ms(160), 'Small state changes.'), moderate: tok('duration', ms(240), 'Disclosures, switches.'), slow: tok('duration', ms(320), 'The dance: tone drift, chrome glint, glow. The ceiling for UI transitions.') },
      ease: {
        standard: tok('cubicBezier', [0.22, 1, 0.36, 1], 'Ease-out for the dance and most transitions.'),
        enter: tok('cubicBezier', [0, 0, 0.2, 1], 'Elements entering.'),
        exit: tok('cubicBezier', [0.4, 0, 1, 1], 'Elements leaving.'),
        spring: tok('cubicBezier', [0.34, 1.56, 0.64, 1], 'Small overshoot for scale. Builds prefer the linear() curve in $extensions.',
          { css: 'linear(0, 0.4 12%, 0.84 28%, 1.03 45%, 1.04 55%, 1.01 75%, 1)' }),
      },
    },
  };
}

const component = () => ({
  $description: 'A few documented component knobs, defaulting to semantic tokens.',
  button: { radius: tok('dimension', '{radius.full}', 'Button corner radius.'), height: tok('dimension', '{size.control.md}', 'Default button height.') },
  field: { radius: tok('dimension', px(16), 'Text input and select radius.') },
  dialog: { radius: tok('dimension', '{radius.l}', 'Dialog radius.'), 'max-inline-size': tok('dimension', rem(460), 'Dialog maximum width.') },
  card: { radius: tok('dimension', '{radius.l}', 'Card radius.') },
});

// ---------------------------------------------------------------- write
const files = {
  'primitive/color.tokens.json': primitiveColor(),
  'semantic/type.tokens.json': typography(),
  'semantic/dimension.tokens.json': dimensions(),
  'semantic/motion.tokens.json': motion(),
  'component/components.tokens.json': component(),
  ...Object.fromEntries(CONTEXTS.map((c) => [`semantic/color.${c}.tokens.json`, semanticColor(c)])),
  ...Object.fromEntries(SCHEMES.map((s) => [`semantic/material.${s}.tokens.json`, materials(s)])),
};
const density = (n) => ({ density: tok('number', n, 'Multiplier for a component\'s internal padding and gaps; never scales type or targets.') });
const resolver = {
  $schema: 'https://www.designtokens.org/schemas/2025.10/resolver.json',
  version: '2025.10',
  name: 'Lue UI',
  description: 'Lue UI tokens. One theme modifier with four contexts (scheme × contrast; dark is primary) and a density modifier.',
  sets: {
    foundation: { description: 'Primitives and context-free semantic tokens.', sources: ['primitive/color', 'semantic/type', 'semantic/dimension', 'semantic/motion', 'component/components'].map((f) => ({ $ref: `${f}.tokens.json` })) },
  },
  modifiers: {
    theme: {
      description: 'Colour scheme and contrast. -more contexts reuse their scheme\'s materials, which turn opaque in CSS.',
      contexts: Object.fromEntries(CONTEXTS.map((c) => [c, [{ $ref: `semantic/material.${c.replace('-more', '')}.tokens.json` }, { $ref: `semantic/color.${c}.tokens.json` }]])),
      default: 'dark',
    },
    density: { description: 'Component density.', contexts: { compact: [density(0.75)], default: [density(1)], comfortable: [density(1.25)] }, default: 'default' },
  },
  resolutionOrder: [{ $ref: '#/sets/foundation' }, { $ref: '#/modifiers/theme' }, { $ref: '#/modifiers/density' }],
};
fs.rmSync(OUT, { recursive: true, force: true });
for (const [f, data] of Object.entries({ ...files, 'lue.resolver.json': resolver })) {
  fs.mkdirSync(path.dirname(path.join(OUT, f)), { recursive: true });
  fs.writeFileSync(path.join(OUT, f), JSON.stringify(data, null, 2) + '\n');
}
console.log(`${Object.keys(files).length + 1} files → ${path.relative(process.cwd(), OUT) || OUT}`);
