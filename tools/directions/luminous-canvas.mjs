// C2 · Chroma Luminous — the pieces of the canvas a flat palette can't express: chrome hairlines, glass tiers,
// the prism fill that slides on interaction, sparks, ambient prism light, and the fallbacks that switch them off.
// Imported by build-canvas.mjs. Values come from palettes.mjs, where every rule here is contrast-checked.
import { directions as PAL, luminous as LUM, evaluateLuminous, prismRamp, ambientGlows } from './palettes.mjs';
import { oklch, contrast } from './contrast.mjs';

const raw = ([L, C, h], a) => `oklch(${+L.toFixed(3)} ${+C.toFixed(3)} ${+(+h).toFixed(1)}${a == null ? '' : ` / ${a}`})`;
const mapped = (v, a) => { const c = oklch(...v); return raw([c.L, c.C, c.h], a); };

// ---------------------------------------------------------------- per-scheme custom properties
export function lxVars(s) {
  const X = LUM[s];
  const P = PAL.luminous[s];
  const dark = s === 'dark';
  const [c0, c1, c2, c3, c4] = X.chrome.map((v) => mapped(v));
  const acc = X.accent.rest.map((v) => mapped(v));
  const act = X.accent.active.map((v) => mapped(v));
  const strip = (a) => [a[0], a[1], a[2], a[3], a[2], a[1], a[0]].join(', ');
  const g = X.glass;
  const glows = ambientGlows(s);
  const amb = Object.fromEntries(Object.keys(LUM.prism).map((n, i) => [`--amb-${n}`, mapped(glows[i], X.ambient.alpha)]));
  const tone = (L, C, h, a) => raw([L, C, h], a);
  return {
    '--chrome-stops': `${c0} 0deg, ${c3} 38deg, ${c1} 64deg, ${c0} 104deg, ${c2} 150deg, ${c4} 196deg, ${c3} 236deg, ${c0} 282deg, ${c1} 318deg, ${c0} 360deg`,
    '--chrome-solid': c1,
    '--chrome-line': dark ? c4 : c1,
    '--chrome-text': dark
      ? `${c0} 0%, ${c3} 34%, ${c2} 50%, ${c1} 60%, ${c0} 100%`
      : `${c0} 0%, ${c2} 34%, ${c3} 50%, ${c1} 60%, ${c4} 100%`,
    '--accent-strip': strip(acc),
    '--accent-strip-active': strip(act),
    '--accent-stops': acc.join(', '),
    '--prism-ring': `${acc[0]}, ${acc[1]}, ${acc[2]}, ${acc[3]}, ${acc[0]}`,
    '--neutral-top': mapped(X.neutral[0]),
    '--neutral-bottom': mapped(X.neutral[1]),
    '--field-bg': dark ? 'var(--bg-surface-subtle)' : 'var(--bg-surface)',
    '--field-inset': dark ? 'oklch(0 0 0 / 0.35)' : 'oklch(0.3 0.03 285 / 0.08)',
    '--glint': dark ? 'oklch(1 0 0 / 0.1)' : 'oklch(1 0 0 / 0.95)',
    '--glint-accent': dark ? 'oklch(1 0 0 / 0.45)' : 'oklch(1 0 0 / 0.3)',
    '--shade-accent': dark ? 'oklch(0 0 0 / 0.1)' : 'oklch(0 0 0 / 0.14)',
    '--shadow-control': dark ? '0 1px 2px oklch(0 0 0 / 0.5)' : '0 1px 2px oklch(0.3 0.03 285 / 0.08), 0 4px 12px -6px oklch(0.4 0.06 285 / 0.18)',
    '--glow-rest': dark ? `0 8px 24px -14px ${tone(0.8, 0.11, 318, 0.5)}` : `0 8px 22px -12px ${tone(0.5, 0.19, 318, 0.45)}`,
    '--glow-hover': dark
      ? `0 0 26px -4px ${tone(0.8, 0.11, 318, 0.5)}, 0 10px 34px -10px ${tone(0.82, 0.1, 205, 0.45)}`
      : `0 12px 30px -10px ${tone(0.5, 0.19, 318, 0.5)}, 0 10px 28px -12px ${tone(0.55, 0.13, 240, 0.45)}`,
    '--glow-soft': dark ? `0 0 22px -6px ${tone(0.8, 0.1, 285, 0.4)}` : `0 10px 26px -12px ${tone(0.5, 0.15, 290, 0.35)}`,
    '--glow-critical': dark ? `0 0 24px -6px ${tone(0.74, 0.14, 18, 0.5)}` : `0 10px 26px -12px ${tone(0.52, 0.19, 18, 0.45)}`,
    '--focus-glow': raw(P['focus-ring'], dark ? 0.24 : 0.18),
    '--spark': 'oklch(1 0 0 / 0.95)',
    '--glass-overlay': mapped(g.tint, g.overlay),
    '--glass-modal': mapped(g.tint, g.modal),
    '--glass-filter': `blur(22px) saturate(1.6) contrast(${g.filter.contrast}) brightness(${g.filter.brightness})`,
    '--glass-sheen': g.sheen ? `radial-gradient(120% 90% at 18% 0%, oklch(1 0 0 / ${g.sheen}), transparent 62%)` : 'none',
    '--scrim': mapped(X.scrim.col, X.scrim.alpha),
    '--fringe': dark
      ? `inset 1px 1px 0 ${tone(0.86, 0.1, 205, 0.26)}, inset -1px -1px 0 ${tone(0.8, 0.12, 355, 0.22)}`
      : `inset 1px 1px 0 ${tone(0.78, 0.1, 205, 0.45)}, inset -1px -1px 0 ${tone(0.74, 0.13, 355, 0.32)}`,
    // Switch thumb: a chrome bead off, a pearl (light) or black-pearl (dark) bead on.
    '--bead': dark
      ? 'radial-gradient(circle at 34% 30%, oklch(0.99 0.004 270), oklch(0.84 0.01 270) 42%, oklch(0.62 0.014 280))'
      : 'radial-gradient(circle at 34% 30%, oklch(1 0 0), oklch(0.78 0.008 270) 46%, oklch(0.52 0.012 280))',
    '--bead-rim': dark ? 'oklch(0.64 0.016 285)' : 'oklch(0.38 0.012 285)',
    '--bead-on': dark
      ? 'radial-gradient(circle at 34% 30%, oklch(0.62 0.03 290), oklch(0.24 0.03 290) 48%, oklch(0.15 0.03 290))'
      : 'radial-gradient(circle at 34% 30%, oklch(1 0 0), oklch(0.98 0.006 300) 50%, oklch(0.9 0.02 300))',
    '--bead-on-rim': dark ? 'oklch(0.12 0.03 290)' : 'oklch(1 0 0 / 0.7)',
    ...amb,
  };
}

export const lxShadows = {
  light: {
    raised: '0 1px 1px oklch(0.3 0.03 285 / 0.05), 0 16px 40px -18px oklch(0.4 0.12 318 / 0.3), 0 10px 30px -16px oklch(0.55 0.1 230 / 0.24)',
    overlay: '0 2px 4px oklch(0.3 0.03 285 / 0.06), 0 30px 70px -24px oklch(0.4 0.14 318 / 0.4), 0 18px 50px -22px oklch(0.55 0.12 220 / 0.32)',
  },
  dark: {
    raised: '0 18px 44px -20px oklch(0 0 0 / 0.7), 0 12px 36px -18px oklch(0.6 0.14 318 / 0.26)',
    overlay: '0 30px 80px -24px oklch(0 0 0 / 0.75), 0 16px 50px -20px oklch(0.62 0.14 318 / 0.32), 0 10px 40px -22px oklch(0.7 0.12 205 / 0.28)',
  },
};

// ---------------------------------------------------------------- CSS
// Elements that carry the chrome hairline ring (a masked conic gradient on ::before).
const RINGED = '.ns-button, .ns-card, .ns-dialog, .ns-menu, .ns-tag, .ns-alert, .ns-toast, .lx-ring, .lx-glass';
const GLASS = '.ns-card, .ns-menu, .ns-tag, .lx-glass';
const FIELDS = '.ns-input, .ns-select, .ns-check, .ns-radio, .ns-switch';
// The opaque fallback, shared by the user-setting media queries and the .lx-opaque demo panel.
const opaque = (scope) => `
${scope} :is(${GLASS}, .ns-dialog) { background-color: var(--bg-surface); background-image: none; backdrop-filter: none; -webkit-backdrop-filter: none; }
${scope} :is(${RINGED})::before { background: var(--border-strong); }
${scope} :is(${FIELDS}) { background: var(--field-bg); border-color: var(--border-strong); }
${scope} :is(.lx-ambient, .lx-dust) { display: none; }`;

export const LX_CSS = `
@property --lx-angle { syntax: '<angle>'; inherits: true; initial-value: 0deg; }
.dir-luminous { --dur-dance: 320ms; --ease-dance: cubic-bezier(0.22, 1, 0.36, 1); }
@media (prefers-reduced-motion: reduce) { .dir-luminous { --dur-fast: 0s; --dur-moderate: 0s; --dur-dance: 0s; } }

/* Ambient prism light: refracted bands and two soft orbs, behind content only. */
.lx-stage { position: relative; isolation: isolate; overflow: hidden; }
.lx-ambient { position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(38% 52% at 92% 6%, var(--amb-orchid), transparent 70%),
    radial-gradient(34% 46% at 4% 96%, var(--amb-aqua), transparent 70%),
    linear-gradient(116deg, transparent 30%, var(--amb-rose) 37%, var(--amb-amber) 40.5%, var(--amb-citron) 43.5%, var(--amb-mint) 46.5%, var(--amb-azure) 50%, var(--amb-iris) 53.5%, transparent 60%); }
.lx-dust { pointer-events: none; background-image: radial-gradient(circle 0.9px, var(--spark) 0 60%, transparent), radial-gradient(circle 0.7px, var(--spark) 0 60%, transparent); background-size: 97px 89px, 61px 73px; background-position: 11px 7px, 37px 41px; opacity: 0.5; }

/* Chrome hairline ring */
.dir-luminous :is(${RINGED}) { position: relative; border: 1px solid transparent; }
.dir-luminous :is(${RINGED})::before { content: ""; position: absolute; inset: -1px; border-radius: inherit; padding: 1px; pointer-events: none;
  background: conic-gradient(from var(--lx-angle), var(--chrome-stops));
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0); }
.lx-chrome-text { background: linear-gradient(180deg, var(--chrome-text)); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; }

/* Glass */
.dir-luminous :is(${GLASS}) { background-color: var(--glass-overlay); background-image: var(--glass-sheen); backdrop-filter: var(--glass-filter); -webkit-backdrop-filter: var(--glass-filter); }
.dir-luminous :is(.ns-dialog, .lx-glass[data-tier=modal]) { background-color: var(--glass-modal); background-image: var(--glass-sheen); backdrop-filter: var(--glass-filter); -webkit-backdrop-filter: var(--glass-filter); }
.dir-luminous .ns-card { box-shadow: var(--shadow-raised), var(--fringe); }
.dir-luminous :is(.ns-menu, .ns-dialog, .lx-glass) { box-shadow: var(--shadow-overlay), var(--fringe); }
.dir-luminous .ns-dialog { position: relative; }
@supports (corner-shape: squircle) { .dir-luminous :is(.ns-card, .ns-dialog, .lx-glass) { corner-shape: squircle; border-radius: calc(var(--radius-l) * 1.7); } }

/* Buttons: neutral sheen, prism fill that slides, chrome glint, glow, sparks */
.dir-luminous .ns-button { border-color: transparent; background: linear-gradient(180deg, var(--neutral-top), var(--neutral-bottom)); box-shadow: inset 0 1px 0 var(--glint), var(--shadow-control);
  transition: --lx-angle var(--dur-dance) var(--ease-dance), background-position var(--dur-dance) var(--ease-dance), box-shadow var(--dur-dance) var(--ease-dance), scale var(--dur-fast) var(--ease); }
.dir-luminous .ns-button:where([data-variant=primary]) { color: var(--fg-on-accent); background: linear-gradient(100deg, var(--accent-strip)) 0% 50% / 300% 100%; box-shadow: inset 0 1px 0 var(--glint-accent), inset 0 -1px 0 var(--shade-accent), var(--glow-rest); }
.dir-luminous .ns-button:where([data-variant=danger]) { background: var(--bg-critical); color: var(--fg-on-critical); box-shadow: inset 0 1px 0 var(--glint-accent), var(--shadow-control); }
.dir-luminous .ns-button:where([data-variant=quiet]) { background: transparent; box-shadow: none; }
.dir-luminous .ns-button:where([data-variant=quiet])::before { opacity: 0; transition: opacity var(--dur-dance) var(--ease-dance); }
.dir-luminous .ns-button:where([data-variant=primary])::after { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0; translate: -8% 0;
  background: radial-gradient(circle 1.3px at 20% 17%, var(--spark) 0 55%, transparent), radial-gradient(circle 1px at 44% 86%, var(--spark) 0 55%, transparent), radial-gradient(circle 1.5px at 69% 14%, var(--spark) 0 55%, transparent), radial-gradient(circle 1px at 86% 80%, var(--spark) 0 55%, transparent);
  transition: opacity var(--dur-dance) var(--ease-dance), translate var(--dur-dance) var(--ease-dance); }
.dir-luminous .ns-button[data-demo=hover], .dir-luminous .ns-button[data-demo=active] { --lx-angle: 150deg; }
.dir-luminous .ns-button[data-demo=hover] { box-shadow: inset 0 1px 0 var(--glint), var(--glow-soft); }
.dir-luminous .ns-button:where([data-variant=primary])[data-demo=hover] { background-position: 62% 50%; box-shadow: inset 0 1px 0 var(--glint-accent), inset 0 -1px 0 var(--shade-accent), var(--glow-hover); }
.dir-luminous .ns-button:where([data-variant=primary])[data-demo=hover]::after { opacity: 1; translate: 8% 0; }
.dir-luminous .ns-button:where([data-variant=primary])[data-demo=active] { background-image: linear-gradient(100deg, var(--accent-strip-active)); background-position: 100% 50%; scale: 0.985; }
@media (hover: hover) {
  .dir-luminous .ns-button:hover { --lx-angle: 150deg; box-shadow: inset 0 1px 0 var(--glint), var(--glow-soft); background: linear-gradient(180deg, var(--neutral-top), var(--neutral-bottom)); }
  .dir-luminous .ns-button:where([data-variant=primary]):hover { background: linear-gradient(100deg, var(--accent-strip)) 62% 50% / 300% 100%; box-shadow: inset 0 1px 0 var(--glint-accent), inset 0 -1px 0 var(--shade-accent), var(--glow-hover); }
  .dir-luminous .ns-button:where([data-variant=primary]):hover::after { opacity: 1; translate: 8% 0; }
  .dir-luminous .ns-button:where([data-variant=danger]):hover { background: var(--bg-critical); box-shadow: inset 0 1px 0 var(--glint-accent), var(--glow-critical); }
  .dir-luminous .ns-button:where([data-variant=quiet]):hover { background: var(--bg-accent-subtle); box-shadow: none; }
  .dir-luminous .ns-button:where([data-variant=quiet]):hover::before { opacity: 1; }
}
.dir-luminous .ns-button:where([data-variant=primary]):active { background-image: linear-gradient(100deg, var(--accent-strip-active)); background-position: 100% 50%; scale: 0.985; }
.dir-luminous .ns-button:is(:focus-visible, [data-demo=focus]) { --lx-angle: 220deg; outline: var(--focus-w) solid var(--focus-ring); outline-offset: var(--focus-offset); box-shadow: inset 0 1px 0 var(--glint), 0 0 0 7px var(--focus-glow), 0 0 26px 2px var(--focus-glow); }
.dir-luminous .ns-button[aria-pressed=true] { background: var(--bg-accent-subtle); color: var(--fg-default); box-shadow: inset 0 1px 0 var(--glint), var(--glow-soft); }
.dir-luminous .ns-button[aria-pressed=true]::before { padding: 1.5px; background: conic-gradient(from var(--lx-angle), var(--prism-ring)); }
.dir-luminous .ns-button:disabled { background: var(--bg-surface-subtle); color: var(--fg-muted); box-shadow: none; scale: 1; cursor: not-allowed; }
.dir-luminous .ns-button:disabled::before { opacity: 0.45; }
.dir-luminous .ns-button:disabled::after { content: none; }
.dir-luminous .ns-toast { box-shadow: var(--shadow-overlay); }
.dir-luminous .ns-toast .ns-button { background: transparent; box-shadow: none; }
.dir-luminous .ns-toast .ns-button::before { content: none; }

/* Fields: opaque wells inside a chrome hairline (padding-box fill over a border-box conic) */
.dir-luminous :is(${FIELDS}) { border: 1px solid transparent; background: linear-gradient(var(--field-bg), var(--field-bg)) padding-box, conic-gradient(from var(--lx-angle), var(--chrome-stops)) border-box; box-shadow: inset 0 1px 2px var(--field-inset); transition: --lx-angle var(--dur-dance) var(--ease-dance), box-shadow var(--dur-dance) var(--ease-dance), background-position var(--dur-dance) var(--ease-dance); }
@media (hover: hover) { .dir-luminous :is(${FIELDS}):hover { --lx-angle: 120deg; } }
.dir-luminous :is(.ns-input, .ns-select):is(:focus-visible, [data-demo=focus]) { --lx-angle: 220deg; outline: var(--focus-w) solid var(--focus-ring); outline-offset: var(--focus-offset-field); box-shadow: inset 0 1px 2px var(--field-inset), 0 0 0 7px var(--focus-glow); }
.dir-luminous :is(.ns-input, .ns-check, .ns-radio)[aria-invalid=true] { background: linear-gradient(var(--field-bg), var(--field-bg)) padding-box, linear-gradient(var(--fg-critical), var(--fg-critical)) border-box; box-shadow: inset 0 0 0 1px var(--fg-critical); }
.dir-luminous .ns-check:checked { background: linear-gradient(135deg, var(--accent-stops)) padding-box, conic-gradient(from var(--lx-angle), var(--prism-ring)) border-box; box-shadow: var(--glow-rest); }
.dir-luminous .ns-radio:checked { background: radial-gradient(circle, var(--bg-accent) 0 5px, var(--field-bg) 5.5px) padding-box, conic-gradient(from var(--lx-angle), var(--prism-ring)) border-box; box-shadow: var(--glow-rest); }
.dir-luminous :is(.ns-check, .ns-radio, .ns-switch)[data-demo=focus] { outline: var(--focus-w) solid var(--focus-ring); outline-offset: 3px; box-shadow: 0 0 0 7px var(--focus-glow); }
.dir-luminous .ns-switch::before { inset-block-start: 4px; inset-inline-start: 4px; background: var(--bead); box-shadow: 0 0 0 1px var(--bead-rim), 0 1px 3px oklch(0 0 0 / 0.3); }
.dir-luminous .ns-switch:checked { background: linear-gradient(100deg, var(--accent-stops)) padding-box, conic-gradient(from var(--lx-angle), var(--prism-ring)) border-box; box-shadow: var(--glow-rest); }
.dir-luminous .ns-switch:checked::before { background: var(--bead-on); box-shadow: 0 0 0 1px var(--bead-on-rim), 0 1px 3px oklch(0 0 0 / 0.3); }

/* Menus, tags, alerts, dividers, steps */
.dir-luminous .ns-menu__item[data-demo=focus] { background: var(--bg-accent-subtle); box-shadow: 0 0 18px -6px var(--focus-glow); }
@media (hover: hover) { .dir-luminous .ns-menu__item:hover { background: var(--bg-accent-subtle); } }
.dir-luminous .ns-tag { font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; }
.dir-luminous .ns-disclosure, .dir-luminous .section-head { border-block-end: 1px solid transparent; border-image: linear-gradient(90deg, var(--chrome-line), transparent) 1; }
.dir-luminous .ns-menu__sep { background: linear-gradient(90deg, transparent, var(--chrome-line), transparent); }
.dir-luminous .ns-steps li[aria-current=step] .num { background: linear-gradient(135deg, var(--accent-stops)); border-color: transparent; box-shadow: var(--glow-rest); }
.dir-luminous .ns-error-summary { border-width: 1px; box-shadow: inset 0 0 0 1px var(--fg-critical); }

/* User settings win: reduced transparency, more contrast, no backdrop-filter → opaque surfaces and solid steel rings */
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {${opaque('.dir-luminous')}
}
@supports not (backdrop-filter: blur(1px)) {${opaque('.dir-luminous')}
}
${opaque('.dir-luminous .lx-opaque')}
@media (forced-colors: active) {
  .dir-luminous :is(${RINGED})::before, .dir-luminous .ns-button::after, .dir-luminous :is(.lx-ambient, .lx-dust) { content: none; display: none; }
  .dir-luminous :is(${RINGED}) { border-color: CanvasText; background-image: none; backdrop-filter: none; }
  .dir-luminous :is(${FIELDS}) { background: Field; border-color: FieldText; }
  .dir-luminous .ns-button { background: ButtonFace; color: ButtonText; border-color: ButtonText; }
  .lx-chrome-text { background: none; color: CanvasText; -webkit-text-fill-color: CanvasText; }
}
`;

// ---------------------------------------------------------------- foundations sections
export function lxFoundations({ icon }) {
  const rules = { light: evaluateLuminous('light').rows, dark: evaluateLuminous('dark').rows };
  const r = (s, what) => rules[s].find((x) => x.what.startsWith(what)).ratio.toFixed(1);
  const ramp = prismRamp();
  const cols = LUM.prismSteps.length;
  const chromeRatios = (s) => LUM[s].chrome.map((v) => contrast(oklch(...v), oklch(...PAL.luminous[s]['bg-canvas'])).toFixed(1));
  const panel = (s, inner, extra = '') => `<div class="scheme lx-stage" data-scheme="${s}" style="display: grid; gap: 20px; align-content: start; padding: 28px; border-radius: 24px; border: 1px solid var(--border-subtle)${extra}"><div class="lx-ambient" aria-hidden="true"></div>${inner}</div>`;
  const label = (s) => (s === 'light' ? 'Pearl · light' : 'Obsidian · dark');

  const prism = `
  <section style="display: grid; gap: 20px">
    <div class="section-head"><h2 class="t-h2">Prism</h2><p class="t-micro">8 hues · subdued neon · oklch</p></div>
    <div style="display: grid; grid-template-columns: 84px repeat(${cols}, minmax(0, 1fr)); gap: 6px; align-items: center">
      <span></span>${LUM.prismSteps.map((L) => `<span class="t-micro" style="text-align: center">L ${L}</span>`).join('')}
      ${Object.entries(ramp).map(([name, steps]) => `<span class="t-micro">${name}</span>${steps.map((v) => `<span title="${raw(v)}" style="block-size: 40px; border-radius: var(--radius-s); background: ${raw(v)}"></span>`).join('')}`).join('\n      ')}
    </div>
    <p class="t-small t-muted" style="max-inline-size: 72ch">Decorative light comes from the whole prism; filled accents use one iso-lightness slice of it (rose → orchid → iris → azure or aqua), so a fill can shift hue without changing its contrast.</p>
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px">
      ${['light', 'dark'].map((s) => panel(s, `
        <p class="t-micro">${label(s)} · prism fills</p>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
          <button type="button" class="ns-button" data-variant="primary">Rest</button>
          <button type="button" class="ns-button" data-variant="primary" data-demo="hover">Hover</button>
          <button type="button" class="ns-button" data-variant="primary" data-demo="active">Pressed</button>
        </div>
        <p class="t-small t-muted">Text on every stop: ≥ ${r(s, 'fg-on-accent on prism fill (rest')}:1 at rest and hover, ≥ ${r(s, 'fg-on-accent on prism fill (active')}:1 pressed.</p>`)).join('\n      ')}
    </div>
  </section>`;

  const chrome = `
  <section style="display: grid; gap: 20px">
    <div class="section-head"><h2 class="t-h2">Chrome</h2><p class="t-micro">1 px · conic reflection · a real 3:1 boundary</p></div>
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px">
      ${['light', 'dark'].map((s) => panel(s, `
        <p class="t-micro">${label(s)} · ${s === 'light' ? 'gunmetal' : 'silver'}</p>
        <div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px">
          ${LUM[s].chrome.map((v, i) => `<div style="display: grid; gap: 4px"><span style="block-size: 30px; border-radius: var(--radius-xs); background: ${mapped(v)}"></span><span class="t-micro" style="letter-spacing: 0.04em">${chromeRatios(s)[i]}:1</span></div>`).join('')}
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <button type="button" class="ns-button">Neutral</button>
          <input class="ns-input" style="inline-size: 150px" value="Field" aria-label="Chrome field, ${s}" />
          <input class="ns-check" type="checkbox" checked="checked" aria-label="Checked, ${s}" />
          <input class="ns-check" type="checkbox" aria-label="Unchecked, ${s}" />
          <input class="ns-switch" type="checkbox" role="switch" aria-label="Switch off, ${s}" />
          <input class="ns-switch" type="checkbox" role="switch" checked="checked" aria-label="Switch on, ${s}" />
        </div>
        <div style="display: flex; gap: 14px; align-items: center">
          ${[0, 120, 240].map((a) => `<span class="lx-ring" aria-hidden="true" style="--lx-angle: ${a}deg; display: inline-block; inline-size: 88px; block-size: 40px; border-radius: 999px"></span>`).join('')}
          <p class="t-small t-muted">The reflection travels round the rim on hover and focus.</p>
        </div>
        <p class="t-small t-muted">Every stop clears 3:1 against canvas and surfaces (lowest ${r(s, 'chrome boundary on canvas')}:1) and against worst-case glass (${r(s, 'chrome boundary on overlay')}:1). Selected and on states trade chrome for prism.</p>`)).join('\n      ')}
    </div>
  </section>`;

  const glass = `
  <section style="display: grid; gap: 20px">
    <div class="section-head"><h2 class="t-h2">Glass</h2><p class="t-micro">two tiers · checked against the worst backdrop</p></div>
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px">
      ${['light', 'dark'].map((s) => panel(s, `
        <div aria-hidden="true" style="position: absolute; inset-block-start: 64px; inset-inline-start: 150px; inline-size: 120px; block-size: 150px; border-radius: 18px; background: oklch(1 0 0)"></div>
        <div aria-hidden="true" style="position: absolute; inset-block-start: 150px; inset-inline-start: 250px; inline-size: 130px; block-size: 140px; border-radius: 18px; background: oklch(0 0 0)"></div>
        <div aria-hidden="true" style="position: absolute; inset-block-start: 230px; inset-inline-start: 60px; inline-size: 170px; block-size: 46px; border-radius: 999px; background: linear-gradient(100deg, var(--accent-strip)) 0% 50% / 300% 100%"></div>
        <p class="t-micro">${label(s)}</p>
        <div class="lx-glass" style="display: grid; gap: 6px; inline-size: 300px; padding: 20px 22px; border-radius: var(--radius-l); margin-block-start: 34px">
          <p class="t-label">Overlay glass</p>
          <p class="t-small">Menus, popovers, cards, sticky bars. Body text ≥ ${r(s, 'fg-default on overlay')}:1 over white, black or prism.</p>
          <p class="t-small t-muted">Muted ≥ ${r(s, 'fg-muted on overlay')}:1 · accent ≥ ${r(s, 'fg-accent on overlay')}:1</p>
        </div>
        <div class="lx-glass" data-tier="modal" style="display: grid; gap: 6px; inline-size: 300px; padding: 20px 22px; border-radius: var(--radius-l); justify-self: end; margin-block-start: -40px">
          <p class="t-label">Modal glass</p>
          <p class="t-small">Dialogs, over the scrim. Body text ≥ ${r(s, 'fg-default on modal')}:1; muted ≥ ${r(s, 'fg-muted on modal')}:1.</p>
        </div>`, '; min-block-size: 440px')).join('\n      ')}
    </div>
    <p class="t-small t-muted" style="max-inline-size: 76ch">Glass is a tint over a blurred, range-compressed backdrop (<code class="t-code">contrast()</code> and <code class="t-code">brightness()</code> in the backdrop filter), plus a faint sheen and a prism fringe at the edge. The checker composites it over white, black and every fill in the palette, reading the filter both ways engines apply it, and keeps the worst result.</p>
  </section>`;

  const motion = `
  <section style="display: grid; gap: 20px">
    <div class="section-head"><h2 class="t-h2">Light that moves</h2><p class="t-micro">≤ 320 ms · on interaction only · press Play to try</p></div>
    <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px">
      ${[
        ['Prism slide', '<button type="button" class="ns-button" data-variant="primary">Continue</button>', 'Hover slides the fill along the prism. Contrast is the same at every point.'],
        ['Chrome glint', '<button type="button" class="ns-button">Save for later</button>', 'The rim’s reflection turns as the pointer arrives, and again on focus.'],
        ['Glow', '<button type="button" class="ns-button" data-variant="primary" data-demo="hover">Hovered</button>', 'A diffuse prism glow rises beneath. It never carries meaning on its own.'],
        ['Sparks', '<button type="button" class="ns-button" data-variant="primary" data-demo="hover" data-size="lg">Place order</button>', 'A few specks of light drift across the edge of a filled button. Never over text, never looping.'],
      ].map(([t, demo, txt]) => `<div class="lx-glass" style="display: grid; gap: 14px; align-content: start; padding: 22px; border-radius: var(--radius-l)"><p class="t-label">${t}</p><div style="display: flex; min-block-size: 64px; align-items: center">${demo}</div><p class="t-small t-muted">${txt}</p></div>`).join('')}
    </div>
    <div class="scheme lx-stage" data-scheme="dark" style="display: flex; flex-wrap: wrap; gap: 14px; align-items: center; padding: 26px 28px; border-radius: 24px">
      <div class="lx-ambient" aria-hidden="true"></div>
      <p class="t-micro" style="margin-inline-end: 8px">Try it</p>
      <button type="button" class="ns-button" data-variant="primary">Continue</button>
      <button type="button" class="ns-button">Save for later</button>
      <button type="button" class="ns-button" aria-pressed="true">${icon('check')}<span>Gift wrap on</span></button>
      <button type="button" class="ns-button" data-variant="quiet">Edit details</button>
      <input class="ns-input" style="inline-size: 180px" value="Hover or focus me" aria-label="Try the field" />
      <label class="ns-choice"><input class="ns-check" type="checkbox" checked="checked" /><span>Check</span></label>
      <label class="ns-choice"><input class="ns-switch" type="checkbox" role="switch" checked="checked" /><span>Switch</span></label>
    </div>
  </section>`;

  const fallbacks = `
  <section style="display: grid; gap: 20px">
    <div class="section-head"><h2 class="t-h2">When the light steps aside</h2><p class="t-micro">the user’s settings win</p></div>
    <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; align-items: start">
      <div class="scheme lx-opaque" data-scheme="dark" style="display: grid; gap: 14px; padding: 22px; border-radius: 22px; border: 1px solid var(--border-subtle)">
        <p class="t-micro">Reduced transparency · more contrast</p>
        <div class="ns-card" style="display: grid; gap: 12px; padding: 18px"><p class="t-label">Opaque surface</p><input class="ns-input" value="Solid steel boundary" aria-label="Opaque field" /><button type="button" class="ns-button" data-variant="primary" style="justify-self: start">Continue</button></div>
        <p class="t-small t-muted">Glass turns opaque, the chrome becomes one solid steel line, ambient light switches off. Also the fallback where <code class="t-code">backdrop-filter</code> is missing.</p>
      </div>
      <div style="display: grid; gap: 14px; padding: 22px; border-radius: 22px; background: #000; color: #fff; border: 1px solid #fff">
        <p style="margin: 0; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; font-family: var(--font-mono)">Forced colours (sketch)</p>
        <div style="display: grid; gap: 12px; padding: 18px; border: 1px solid #fff; border-radius: 20px"><p style="margin: 0; font-weight: 600">System colours</p><span style="display: block; padding: 12px 16px; border: 1px solid #fff; border-radius: 16px">Field</span><span style="justify-self: start; padding: 10px 22px; border: 1px solid #fff; border-radius: 999px; outline: 2px solid #1aebff; outline-offset: 3px">Focused button</span></div>
        <p style="margin: 0; font-size: 15px; line-height: 1.5">Palette, chrome, glow and sparks drop out; transparent borders appear and the focus outline uses Highlight.</p>
      </div>
      <div class="scheme" data-scheme="light" style="display: grid; gap: 14px; padding: 22px; border-radius: 22px; border: 1px solid var(--border-subtle)">
        <p class="t-micro">Reduced motion</p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap"><button type="button" class="ns-button" data-variant="primary">Continue</button><button type="button" class="ns-button">Cancel</button></div>
        <p class="t-small t-muted">No slide, glint or drift: every duration is 0 s, so states change instantly and ambient light stays still. Nothing animates on its own, ever.</p>
      </div>
    </div>
  </section>`;

  return { afterColour: prism + chrome + glass, beforeSignature: motion + fallbacks };
}
