// C2 · Chroma Luminous — the pieces of the canvas a flat palette can't express: chrome hairlines, glass tiers,
// the prism fill that slides on interaction, sparks, ambient prism light, and the fallbacks that switch them off.
// Imported by build-canvas.mjs. Values come from palettes.mjs, where every rule here is contrast-checked.
import { directions as PAL, luminous as LUM, evaluateLuminous, prismRamp, ambientGlows, buttonBlobs, tones, chromeStops } from './palettes.mjs';
import { oklch, contrast } from './contrast.mjs';
import { materialsSection } from './luminous-pages.mjs';

const raw = ([L, C, h], a) => `oklch(${+L.toFixed(3)} ${+C.toFixed(3)} ${+(+h).toFixed(1)}${a == null ? '' : ` / ${a}`})`;
const mapped = (v, a) => { const c = oklch(...v); return raw([c.L, c.C, c.h], a); };

// ---------------------------------------------------------------- type
// Epilogue for display and headings (chosen 2026-10-10: Bricolage Grotesque had the personality but a hard-to-read 'f';
// Funnel Display, Host Grotesk and Schibsted Grotesk were also compared). Figtree for body, Spline Sans Mono for
// micro-labels and code. All SIL OFL.
export const LX_FONTS = 'family=Epilogue:ital,wght@0,100..900;1,100..900&family=Figtree:ital,wght@0,300..900;1,300..900&family=Spline+Sans+Mono:ital,wght@0,300..700;1,300..700&display=swap';

// ---------------------------------------------------------------- per-scheme custom properties
export function lxVars(s) {
  const X = LUM[s];
  const P = PAL.luminous[s];
  const dark = s.startsWith('dark');
  const [c0, c1, c2, c3, c4] = X.chrome.map((v) => mapped(v));
  const disp = X.dispersion.map((v) => mapped(v));
  const metal = X.metal.map((v) => mapped(v));
  const satin = X.satin.map((v) => mapped(v));
  const acc = tones(s, 'accent').map((v) => mapped(v));
  const act = tones(s, 'accent', 'Lactive').map((v) => mapped(v));
  const ring = tones(s, 'ring').map((v) => mapped(v));
  const strip = (a) => [...a, ...a.slice(0, -1).reverse()].join(', ');
  const g = X.glass;
  const glows = ambientGlows(s);
  const amb = Object.fromEntries(Object.keys(LUM.prism).map((n, i) => [`--amb-${n}`, mapped(glows[i], X.ambient.alpha)]));
  const tone = (L, C, h, a) => raw([L, C, h], a);
  const B = X.buttons;
  const irid = Object.fromEntries(buttonBlobs(s).map((c, i) => [`--irid-${i + 1}`, mapped(c, B.prism.alpha)]));
  return {
    '--btn-glass': mapped(B.neutral.tint, B.neutral.alpha),
    '--btn-filter': `blur(10px) saturate(1.8) contrast(${B.filter.contrast}) brightness(${B.filter.brightness})`,
    '--btn-prism-base': mapped(B.neutral.tint, B.prism.base),
    '--btn-prism-base-active': mapped(B.neutral.tint, B.prism.baseActive),
    '--btn-danger-glass': mapped(B.danger.tint, B.danger.alpha),
    '--btn-pressed-glass': mapped(B.pressed.tint, B.pressed.alpha),
    '--btn-sheen': `oklch(1 0 0 / ${B.sheen})`,
    '--btn-rim-top': dark ? 'oklch(1 0 0 / 0.16)' : 'oklch(1 0 0 / 0.9)',
    '--btn-rim-bottom': dark ? 'oklch(1 0 0 / 0.05)' : 'oklch(1 0 0 / 0.45)',
    ...irid,
    // Chrome with a short band of dispersed light at its lower edge (around 180°), like light through thick glass.
    '--chrome-stops': chromeStops(s).map(([v, deg]) => `${mapped(v)} ${deg}deg`).join(', '),
    ...Object.fromEntries([c0, c1, c2, c3, c4].map((c, i) => [`--c${i}`, c])),
    ...Object.fromEntries(disp.map((c, i) => [`--disp-${i + 1}`, c])),
    ...Object.fromEntries(satin.map((c, i) => [`--satin-${i}`, c])),
    '--metal': `linear-gradient(165deg, ${metal[0]} 0%, ${metal[1]} 46%, ${metal[2]} 62%, ${metal[3]} 100%)`,
    '--metal-rim-top': dark ? 'oklch(1 0 0 / 0.16)' : 'oklch(1 0 0)',
    '--metal-rim-bottom': dark ? 'oklch(0 0 0 / 0.5)' : 'oklch(0.82 0.01 285 / 0.6)',
    '--tile-shadow': dark ? '0 16px 34px -14px oklch(0 0 0 / 0.8), 0 0 0 1px oklch(1 0 0 / 0.04)' : '0 1px 1px oklch(0.3 0.03 285 / 0.08), 0 14px 30px -14px oklch(0.35 0.06 285 / 0.35), 0 6px 14px -8px oklch(0.4 0.05 285 / 0.22)',
    '--prism-glass-top': dark ? 'oklch(0.46 0.02 285 / 0.55)' : 'oklch(1 0 0 / 0.92)',
    '--prism-glass-bottom': dark ? 'oklch(0.17 0.02 285 / 0.85)' : 'oklch(0.92 0.012 285 / 0.8)',
    '--prism-shadow': dark ? 'oklch(0 0 0 / 0.7)' : 'oklch(0.35 0.05 285 / 0.35)',
    '--btn-refract': dark ? 'oklch(0.75 0.12 205 / 0.35)' : 'oklch(0.75 0.12 205 / 0.55)',
    '--btn-depth': `inset 0 1px 0.5px var(--btn-rim-top), inset 0 -1px 0 var(--btn-rim-bottom), inset 0 -7px 10px -8px var(--btn-refract)`,
    '--chrome-solid': c1,
    '--chrome-line': dark ? c4 : c1,
    '--chrome-text': dark
      ? `${c0} 0%, ${c3} 34%, ${c2} 50%, ${c1} 60%, ${c0} 100%`
      : `${c0} 0%, ${c2} 34%, ${c3} 50%, ${c1} 60%, ${c4} 100%`,
    '--accent-strip': strip(acc),
    '--accent-strip-active': strip(act),
    '--accent-stops': acc.join(', '),
    '--accent-stops-active': act.join(', '),
    '--prism-ring': [...ring, ring[0]].join(', '),
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
    // On: a pearl bead on the jewel track (dark), a graphite bead on the pastel track (light) — 3:1 either way.
    '--bead-on': dark
      ? 'radial-gradient(circle at 34% 30%, oklch(1 0 0), oklch(0.96 0.006 285) 50%, oklch(0.86 0.012 285))'
      : 'radial-gradient(circle at 34% 30%, oklch(0.6 0.02 285), oklch(0.3 0.015 285) 48%, oklch(0.2 0.02 285))',
    '--bead-on-rim': dark ? 'oklch(1 0 0 / 0.6)' : 'oklch(0.15 0.02 285)',
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
${scope} :is(${GLASS}, .ns-dialog) { background-color: var(--bg-surface); background-image: none; backdrop-filter: none; }
${scope} :is(${RINGED})::before { background: var(--border-strong); }
${scope} :is(${FIELDS}) { background: var(--field-bg); border-color: var(--border-strong); }
${scope} .ns-check:checked, ${scope} .ns-switch:checked { background: linear-gradient(135deg, var(--accent-stops)) padding-box, linear-gradient(var(--fg-default), var(--fg-default)) border-box; }
${scope} .ns-radio:checked { background: radial-gradient(circle, var(--fg-on-accent) 0 3.5px, transparent 4px) padding-box, linear-gradient(135deg, var(--accent-stops)) padding-box, linear-gradient(var(--fg-default), var(--fg-default)) border-box; }
${scope} :is(.ns-input, .ns-check, .ns-radio)[aria-invalid=true] { border-color: var(--fg-critical); box-shadow: inset 0 0 0 1px var(--fg-critical); }
${scope} .ns-button { backdrop-filter: none; background-color: var(--bg-surface); background-image: none; }
${scope} .ns-button[aria-pressed=true]::before { padding: 2px; background: var(--fg-default); }
${scope} .ns-button:where([data-variant=primary]) { background-color: var(--bg-accent-subtle); background-image: none; }
${scope} .ns-button:where([data-variant=danger]) { background-color: var(--bg-critical-subtle); }
${scope} .ns-button:where([data-variant=quiet]) { background-color: transparent; }
${scope} :is(.lx-ambient, .lx-dust, .lx-satin) { display: none; }`;

export const LX_CSS = `
@property --lx-angle { syntax: '<angle>'; inherits: true; initial-value: 0deg; }
.dir-luminous { --dur-dance: 320ms; --ease-dance: cubic-bezier(0.22, 1, 0.36, 1); }
@media (prefers-reduced-motion: reduce) { .dir-luminous { --dur-fast: 0s; --dur-moderate: 0s; --dur-dance: 0s; } }

/* Ambient prism light: refracted bands and two soft orbs, behind content only. */
.lx-stage { position: relative; isolation: isolate; overflow: clip; }
.lx-ambient { position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(62% 80% at 0% 72%, var(--amb-amber), transparent 76%),
    radial-gradient(58% 78% at 100% 64%, var(--amb-azure), transparent 76%),
    radial-gradient(40% 50% at 92% 0%, var(--amb-orchid), transparent 74%); }
/* The refracted band: wide, soft hue steps, feathered out at both ends by an elliptical mask. */
.lx-ambient::before { content: ""; position: absolute; inset: -12%; opacity: 0.55;
  background: linear-gradient(116deg, transparent 4%, var(--amb-rose) 19%, var(--amb-amber) 30%, var(--amb-citron) 41%, var(--amb-mint) 52%, var(--amb-aqua) 63%, var(--amb-azure) 74%, var(--amb-iris) 85%, transparent 97%);
  mask-image: radial-gradient(closest-side, #000 18%, transparent 100%); }
.lx-dust { pointer-events: none; background-image: radial-gradient(circle 0.9px, var(--spark) 0 60%, transparent), radial-gradient(circle 0.7px, var(--spark) 0 60%, transparent); background-size: 97px 89px, 61px 73px; background-position: 11px 7px, 37px 41px; opacity: 0.5; }

/* Headings follow the display face's width axis and tracking */
.dir-luminous :is(.t-h1, .t-h2, .t-h3, .t-h4, .ns-dialog__title, .ns-error-summary__title, .lx-quote__mark) { font-variation-settings: var(--fvs-display); letter-spacing: var(--ls-heading); }

/* Chrome hairline ring */
.dir-luminous :is(${RINGED}) { position: relative; border: 1px solid transparent; }
.dir-luminous :is(${RINGED})::before { content: ""; position: absolute; inset: -1px; border-radius: inherit; padding: 1px; pointer-events: none;
  background: conic-gradient(from var(--lx-angle), var(--chrome-stops));
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0); }
/* Chrome lettering: colour stays solid (Firefox's forced colours leaves color: transparent alone); only the fill is cleared. */
.lx-chrome-text { color: var(--fg-default); }
@supports (background-clip: text) or (-webkit-background-clip: text) {
  .lx-chrome-text { background: linear-gradient(180deg, var(--chrome-text)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
}

/* Glass */
.dir-luminous :is(${GLASS}) { background-color: var(--glass-overlay); background-image: var(--glass-sheen); backdrop-filter: var(--glass-filter); }
.dir-luminous :is(.ns-dialog, .lx-glass[data-tier=modal]) { background-color: var(--glass-modal); background-image: var(--glass-sheen); backdrop-filter: var(--glass-filter); }
.dir-luminous .ns-card { box-shadow: var(--shadow-raised), var(--fringe); }
.dir-luminous :is(.ns-menu, .ns-dialog, .lx-glass) { box-shadow: var(--shadow-overlay), var(--fringe); }
.dir-luminous .ns-dialog { position: relative; }
@supports (corner-shape: squircle) { .dir-luminous :is(.ns-card, .ns-dialog, .lx-glass) { corner-shape: squircle; border-radius: calc(var(--radius-l) * 1.7); } }

/* Buttons: frosted glass panes inside the chrome ring. Neutral is clear glass; primary carries several prism tones at
   one lightness, which drift on hover. Inside a glass parent (a backdrop root) buttons don't blur again. */
.dir-luminous .ns-button { border-color: transparent; color: var(--fg-default); background-color: var(--btn-glass); background-image: linear-gradient(180deg, var(--btn-sheen) 0%, transparent 52%); backdrop-filter: var(--btn-filter);
  box-shadow: var(--btn-depth), var(--shadow-control);
  transition: --lx-angle var(--dur-dance) var(--ease-dance), background-position var(--dur-dance) var(--ease-dance), background-color var(--dur-dance) var(--ease-dance), box-shadow var(--dur-dance) var(--ease-dance), scale var(--dur-fast) var(--ease); }
.dir-luminous :is(.ns-card, .ns-dialog, .ns-menu, .lx-glass) :is(.ns-button, .ns-tag) { backdrop-filter: none; }
.dir-luminous a.ns-button { text-decoration: none; }
.dir-luminous .ns-button:where([data-variant=primary]) { background-color: var(--btn-prism-base);
  background-image: linear-gradient(180deg, var(--btn-sheen) 0%, transparent 52%), radial-gradient(closest-side, var(--irid-1), transparent), radial-gradient(closest-side, var(--irid-2), transparent), radial-gradient(closest-side, var(--irid-3), transparent), radial-gradient(closest-side, var(--irid-4), transparent), radial-gradient(closest-side, var(--irid-5), transparent);
  background-size: 100% 100%, 64% 190%, 56% 170%, 66% 190%, 58% 180%, 52% 170%;
  background-position: 0 0, -6% 120%, 104% 110%, 70% 145%, 26% 150%, 50% 130%;
  background-repeat: no-repeat;
  box-shadow: var(--btn-depth), var(--glow-rest); }
.dir-luminous .ns-button:where([data-variant=danger]) { background-color: var(--btn-danger-glass); }
.dir-luminous .ns-button:where([data-variant=danger])::before { background: linear-gradient(var(--fg-critical), var(--fg-critical)); }
.dir-luminous .ns-button:where([data-variant=quiet]) { color: var(--fg-accent); background-color: transparent; background-image: none; backdrop-filter: none; box-shadow: none; }
.dir-luminous .ns-button:where([data-variant=quiet])::before { opacity: 0; transition: opacity var(--dur-dance) var(--ease-dance); }
.dir-luminous .ns-button:where([data-variant=primary])::after { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0; translate: -8% 0;
  background: radial-gradient(circle 1.3px at 20% 17%, var(--spark) 0 55%, transparent), radial-gradient(circle 1px at 44% 86%, var(--spark) 0 55%, transparent), radial-gradient(circle 1.5px at 69% 14%, var(--spark) 0 55%, transparent), radial-gradient(circle 1px at 86% 80%, var(--spark) 0 55%, transparent);
  transition: opacity var(--dur-dance) var(--ease-dance), translate var(--dur-dance) var(--ease-dance); }
.dir-luminous .ns-button[data-demo=hover], .dir-luminous .ns-button[data-demo=active] { --lx-angle: 150deg; }
.dir-luminous .ns-button[data-demo=hover] { box-shadow: var(--btn-depth), var(--glow-soft); }
.dir-luminous .ns-button:where([data-variant=primary])[data-demo=hover] { background-position: 0 0, 30% 130%, 76% 118%, 102% 150%, -4% 140%, 60% 112%; box-shadow: var(--btn-depth), var(--glow-hover); }
.dir-luminous .ns-button:where([data-variant=primary])[data-demo=hover]::after { opacity: 1; translate: 8% 0; }
.dir-luminous .ns-button:where([data-variant=primary])[data-demo=active] { background-color: var(--btn-prism-base-active); background-position: 0 0, 50% 100%, 18% 118%, 82% 120%, 40% 140%, 92% 100%; scale: 0.985; }
@media (hover: hover) {
  .dir-luminous .ns-button:hover { --lx-angle: 150deg; box-shadow: var(--btn-depth), var(--glow-soft); }
  .dir-luminous .ns-button:where([data-variant=primary]):hover { background-position: 0 0, 30% 130%, 76% 118%, 102% 150%, -4% 140%, 60% 112%; box-shadow: var(--btn-depth), var(--glow-hover); }
  .dir-luminous .ns-button:where([data-variant=primary]):hover::after { opacity: 1; translate: 8% 0; }
  .dir-luminous .ns-button:where([data-variant=danger]):hover { box-shadow: var(--btn-depth), var(--glow-critical); }
  .dir-luminous .ns-button:where([data-variant=quiet]):hover { background-color: var(--btn-glass); box-shadow: none; }
  .dir-luminous .ns-button:where([data-variant=quiet]):hover::before { opacity: 1; }
}
.dir-luminous .ns-button:where([data-variant=primary]):active { background-color: var(--btn-prism-base-active); background-position: 0 0, 50% 100%, 18% 118%, 82% 120%, 40% 140%, 92% 100%; scale: 0.985; }
.dir-luminous .ns-button:is(:focus-visible, [data-demo=focus]) { --lx-angle: 220deg; outline: var(--focus-w) solid var(--focus-ring); outline-offset: var(--focus-offset); box-shadow: inset 0 1px 0 var(--btn-rim-top), 0 0 0 7px var(--focus-glow), 0 0 26px 2px var(--focus-glow); }
.dir-luminous .ns-button[aria-pressed=true] { background-color: var(--btn-pressed-glass); box-shadow: inset 0 1px 0 var(--btn-rim-top), var(--glow-soft); }
.dir-luminous .ns-button[aria-pressed=true]::before { padding: 1.5px; background: conic-gradient(from var(--lx-angle), var(--prism-ring)); }
.dir-luminous .ns-button:disabled { background-color: var(--btn-glass); background-image: none; color: var(--fg-muted); box-shadow: none; scale: 1; cursor: not-allowed; }
.dir-luminous .ns-button:disabled::before { opacity: 0.45; }
.dir-luminous .ns-button:disabled::after { content: none; }
.dir-luminous .ns-toast { box-shadow: var(--shadow-overlay); }
.dir-luminous .ns-toast .ns-button { color: var(--fg-inverse); background: transparent; box-shadow: none; backdrop-filter: none; }
.dir-luminous .ns-toast .ns-button::before { content: none; }

/* Fields: opaque wells inside a chrome hairline (padding-box fill over a border-box conic) */
.dir-luminous :is(${FIELDS}) { border: 1px solid transparent; background: linear-gradient(var(--field-bg), var(--field-bg)) padding-box, conic-gradient(from var(--lx-angle), var(--chrome-stops)) border-box; box-shadow: inset 0 1px 2px var(--field-inset); transition: --lx-angle var(--dur-dance) var(--ease-dance), box-shadow var(--dur-dance) var(--ease-dance), background-position var(--dur-dance) var(--ease-dance); }
@media (hover: hover) { .dir-luminous :is(${FIELDS}):hover { --lx-angle: 120deg; } }
.dir-luminous :is(.ns-input, .ns-select):is(:focus-visible, [data-demo=focus]) { --lx-angle: 220deg; outline: var(--focus-w) solid var(--focus-ring); outline-offset: var(--focus-offset-field); box-shadow: inset 0 1px 2px var(--field-inset), 0 0 0 7px var(--focus-glow); }
.dir-luminous :is(.ns-input, .ns-check, .ns-radio)[aria-invalid=true] { background: linear-gradient(var(--field-bg), var(--field-bg)) padding-box, linear-gradient(var(--fg-critical), var(--fg-critical)) border-box; box-shadow: inset 0 0 0 1px var(--fg-critical); }
.dir-luminous .ns-check:checked { background: linear-gradient(135deg, var(--accent-stops)) padding-box, conic-gradient(from var(--lx-angle), var(--prism-ring)) border-box; box-shadow: var(--glow-rest); }
.dir-luminous .ns-radio:checked { background: radial-gradient(circle, var(--fg-on-accent) 0 3.5px, transparent 4px) padding-box, linear-gradient(135deg, var(--accent-stops)) padding-box, conic-gradient(from var(--lx-angle), var(--prism-ring)) border-box; box-shadow: var(--glow-rest); }
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

/* Materials: liquid metal tiles and avatars, satin folds, the glass prism */
.lx-tile { inline-size: 64px; block-size: 64px; border-radius: 30%; display: inline-grid; place-items: center; flex: none; background: var(--metal); box-shadow: inset 0 1px 0 var(--metal-rim-top), inset 0 -1px 0 var(--metal-rim-bottom), var(--tile-shadow); }
.lx-tile[data-size=lg] { inline-size: 112px; block-size: 112px; }
.lx-tile svg { inline-size: 54%; block-size: 54%; overflow: visible; }
@supports (corner-shape: squircle) { .lx-tile { corner-shape: squircle; border-radius: 44%; } }
.lx-avatar { inline-size: 44px; block-size: 44px; border-radius: 50%; display: inline-grid; place-items: center; flex: none; background: var(--metal); box-shadow: inset 0 1px 0 var(--metal-rim-top), inset 0 -1px 0 var(--metal-rim-bottom), var(--tile-shadow); font-family: var(--font-display); font-weight: 500; font-size: 15px; color: var(--fg-default); }
.lx-avatar[data-size=lg] { inline-size: 72px; block-size: 72px; font-size: 22px; }
.lx-satin { position: absolute; inset: 0; inline-size: 100%; block-size: 100%; z-index: -1; display: block; }
.lx-prism { inline-size: min(100%, 440px); block-size: auto; display: block; overflow: visible; }
.lx-media { position: relative; isolation: isolate; overflow: clip; display: grid; place-items: center; border-radius: calc(var(--radius-l) - 8px); box-shadow: inset 0 0 0 1px var(--border-subtle); aspect-ratio: 4 / 3; }
.lx-media > svg:not(.lx-satin) { inline-size: 54%; block-size: auto; max-block-size: 82%; }

/* Page shell (fluid boards) */
.dir-luminous { --gutter: clamp(16px, 4vw, 56px); }
.lx-wrap { inline-size: min(100% - 2 * var(--gutter), 1200px); margin-inline: auto; }
.lx-skip { position: absolute; inset-inline-start: 16px; inset-block-start: 12px; z-index: 20; translate: 0 -200%; }
.lx-skip:focus-visible { translate: 0 0; }
.lx-nav { position: sticky; inset-block-start: 16px; z-index: 10; margin-block-start: 16px; }
.lx-nav__bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px 24px; padding: 8px 8px 8px 24px; border-radius: 999px; }
.lx-nav ul { display: flex; flex-wrap: wrap; gap: 2px; list-style: none; margin: 0; padding: 0; }
.lx-navlink { display: inline-flex; align-items: center; min-block-size: 44px; padding-inline: 16px; border-radius: 999px; color: var(--fg-default); text-decoration: none; font-weight: 500; transition: background-color var(--dur-dance) var(--ease-dance); }
.lx-navlink[aria-current=page] { background-color: var(--btn-glass); box-shadow: var(--btn-depth); }
@media (hover: hover) { .lx-navlink:hover { background-color: var(--btn-glass); } }
.lx-navlink:focus-visible, .lx-wordmark:focus-visible, .lx-footer a:focus-visible, .lx-toc a:focus-visible, .lx-pages a:focus-visible { outline: var(--focus-w) solid var(--focus-ring); outline-offset: 2px; }
.lx-wordmark { font-family: var(--font-display); font-weight: 400; font-size: calc(22px * var(--heading-scale, 1)); letter-spacing: var(--ls-heading); font-variation-settings: var(--fvs-display); color: var(--fg-default); text-decoration: none; display: inline-flex; align-items: center; gap: 10px; min-block-size: 44px; }
.lx-wordmark .lx-tile { inline-size: 34px; block-size: 34px; }

/* Heroes */
.lx-hero { position: relative; isolation: isolate; overflow: clip; padding-block: clamp(72px, 10vw, 148px) clamp(64px, 8vw, 124px); }
.lx-hero__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(440px, 100%), 1fr)); gap: clamp(32px, 5vw, 72px); align-items: center; }
.lx-hero__text { display: grid; gap: 24px; justify-items: start; }
.lx-hero[data-layout=center] .lx-hero__grid { grid-template-columns: minmax(0, 1fr); justify-items: center; text-align: center; }
.lx-hero[data-layout=center] .lx-hero__text { justify-items: center; }
.lx-display { font-family: var(--font-display); font-weight: 300; font-size: calc(clamp(3rem, 1.4rem + 4.6vw, 6.25rem) * var(--display-scale, 1)); line-height: 1; letter-spacing: var(--ls-display); margin: 0; text-wrap: balance; font-variation-settings: var(--fvs-display); }
.lx-lede { font-size: clamp(1.125rem, 1rem + 0.5vw, 1.375rem); line-height: 1.55; color: var(--fg-muted); max-inline-size: 46ch; margin: 0; text-wrap: pretty; }
.lx-actions { display: flex; flex-wrap: wrap; gap: 12px; }
.lx-hero__object { display: grid; place-items: center; }

/* Sections and grids */
.lx-section { padding-block: clamp(56px, 8vw, 112px); display: grid; gap: clamp(28px, 4vw, 48px); }
.lx-section__head { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 16px 32px; }
.lx-h2 { font-family: var(--font-display); font-weight: 350; font-size: calc(clamp(2rem, 1.4rem + 2vw, 3.25rem) * var(--heading-scale, 1)); line-height: 1.08; letter-spacing: var(--ls-heading); margin: 0; text-wrap: balance; font-variation-settings: var(--fvs-display); }
.lx-h3 { font-family: var(--font-display); font-weight: 400; font-size: calc(1.5rem * var(--heading-scale, 1)); line-height: 1.18; letter-spacing: var(--ls-heading); margin: 0; font-variation-settings: var(--fvs-display); }
.lx-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(var(--min, 300px), 100%), 1fr)); gap: clamp(18px, 2.4vw, 28px); }
.lx-block-label { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px; padding-block: 0 4px; }

/* Cards and lists */
.lx-project { display: grid; gap: 18px; align-content: start; padding: 12px 12px 26px; border-radius: var(--radius-l); }
.lx-project__body { display: grid; gap: 10px; padding-inline: 14px; }
.lx-project :is(h3, .lx-h3) a, .lx-post :is(h3, .lx-h3) a { color: var(--fg-default); text-decoration: none; }
.lx-project :is(h3, .lx-h3) a::after, .lx-post :is(h3, .lx-h3) a::after { content: ""; position: absolute; inset: 0; border-radius: inherit; z-index: 1; }
.lx-project:has(a:focus-visible), .lx-post:has(a:focus-visible) { outline: var(--focus-w) solid var(--focus-ring); outline-offset: 4px; }
.lx-project :is(h3, .lx-h3) a:focus-visible, .lx-post :is(h3, .lx-h3) a:focus-visible { outline: none; }
@media (hover: hover) { .lx-project:hover, .lx-post:hover { --lx-angle: 120deg; } }
.dir-luminous .lx-project, .dir-luminous .lx-post[data-variant=card] { transition: --lx-angle var(--dur-dance) var(--ease-dance); }
.lx-tags { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; margin: 0; padding: 0; position: relative; z-index: 2; }
.lx-post { position: relative; display: grid; gap: 10px; align-content: start; padding-block: 26px; border-block-start: 1px solid transparent; border-image: linear-gradient(90deg, var(--chrome-line), transparent) 1; }
.lx-post[data-variant=card] { padding: 12px 12px 26px; border: 1px solid transparent; border-image: none; border-radius: var(--radius-l); gap: 16px; }
.lx-post[data-variant=card] > :not(.lx-media) { margin-inline: 14px; }
.lx-meta { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; margin: 0; }
.lx-excerpt { color: var(--fg-muted); margin: 0; max-inline-size: 60ch; text-wrap: pretty; }
.lx-feature { display: grid; gap: 16px; align-content: start; }
.lx-feature p { margin: 0; color: var(--fg-muted); text-wrap: pretty; }

/* Quote, split, timeline, CTA, footer */
.lx-quote { margin: 0; display: grid; gap: 28px; justify-items: start; max-inline-size: 64rem; }
.lx-quote blockquote { margin: 0; font-family: var(--font-display); font-weight: 300; font-size: calc(clamp(1.75rem, 1.2rem + 1.9vw, 2.9rem) * var(--heading-scale, 1)); line-height: 1.2; letter-spacing: var(--ls-heading); text-wrap: balance; font-variation-settings: var(--fvs-display); }
.lx-quote figcaption { display: flex; align-items: center; gap: 14px; }
.lx-quote__mark { font-family: var(--font-display); font-weight: 300; font-size: 96px; line-height: 0.6; block-size: 0.5em; }
.lx-split { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(420px, 100%), 1fr)); gap: clamp(28px, 4vw, 64px); align-items: center; }
.lx-timeline { list-style: none; margin: 0; padding: 0; display: grid; }
.lx-timeline li { display: flex; flex-wrap: wrap; gap: 6px 32px; padding-block: 22px; border-block-start: 1px solid transparent; border-image: linear-gradient(90deg, var(--chrome-line), transparent) 1; }
.lx-timeline time { flex: 0 0 11rem; }
.lx-timeline div { flex: 1 1 22rem; display: grid; gap: 4px; }
.lx-timeline p { margin: 0; }
.lx-cta { position: relative; isolation: isolate; overflow: clip; border-radius: calc(var(--radius-l) * 1.4); padding: clamp(32px, 6vw, 72px); display: grid; gap: 24px; justify-items: start; }
.lx-cta form { display: flex; flex-wrap: wrap; gap: 12px; align-items: end; inline-size: 100%; max-inline-size: 640px; }
.lx-cta .ns-field { flex: 1 1 260px; }
.lx-footer { padding-block: 40px 64px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px 32px; border-block-start: 1px solid transparent; border-image: linear-gradient(90deg, transparent, var(--chrome-line), transparent) 1; }
.lx-footer ul { display: flex; flex-wrap: wrap; gap: 4px 20px; list-style: none; padding: 0; margin: 0; }
.lx-footer a { color: var(--fg-muted); text-decoration: none; display: inline-flex; min-block-size: 44px; align-items: center; }
@media (hover: hover) { .lx-footer a:hover { color: var(--fg-default); text-decoration: underline; } }
.lx-pages { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; list-style: none; margin: 0; padding: 0; }
.lx-pages a { display: inline-grid; place-items: center; min-inline-size: 44px; min-block-size: 44px; border-radius: 999px; color: var(--fg-default); text-decoration: none; }
.lx-pages a[aria-current=page] { background-color: var(--btn-pressed-glass); box-shadow: var(--btn-depth); font-weight: 600; }

/* Article */
.lx-article__head { display: grid; gap: 22px; justify-items: start; padding-block: clamp(56px, 8vw, 112px) 44px; }
.lx-title { font-family: var(--font-display); font-weight: 300; font-size: calc(clamp(2.6rem, 1.5rem + 3.6vw, 5rem) * var(--display-scale, 1)); line-height: 1.02; letter-spacing: var(--ls-display); margin: 0; max-inline-size: 18ch; text-wrap: balance; font-variation-settings: var(--fvs-display); }
.lx-dek { font-size: clamp(1.2rem, 1.05rem + 0.6vw, 1.5rem); line-height: 1.5; color: var(--fg-muted); margin: 0; max-inline-size: 44ch; text-wrap: pretty; }
.lx-byline { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; }
.lx-byline p { margin: 0; }
.lx-crumbs ol { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; margin: 0; padding: 0; }
.lx-crumbs li + li::before { content: "/"; margin-inline-end: 8px; color: var(--fg-muted); }
.lx-crumbs a { color: var(--fg-muted); text-underline-offset: 0.2em; }
.lx-figure { margin: 0; display: grid; gap: 14px; }
.lx-figure .lx-media { aspect-ratio: 16 / 7; border-radius: var(--radius-l); box-shadow: var(--shadow-raised); }
.lx-figure figcaption { font-size: var(--fs-small); color: var(--fg-muted); }
.lx-article__body { display: flex; flex-wrap: wrap; gap: 32px 64px; align-items: start; padding-block: 56px 32px; }
.lx-toc { flex: 1 1 14rem; max-inline-size: 18rem; position: sticky; inset-block-start: 104px; display: grid; gap: 12px; padding: 20px; border-radius: var(--radius-l); }
.lx-toc ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
.lx-toc a { display: flex; align-items: center; gap: 10px; min-block-size: 44px; padding-inline: 12px; border-radius: 14px; color: var(--fg-muted); text-decoration: none; }
.lx-toc a::before { content: ""; inline-size: 6px; block-size: 6px; border-radius: 50%; background: var(--border-strong); flex: none; }
.lx-toc a[aria-current=true] { color: var(--fg-default); background-color: var(--btn-glass); }
.lx-toc a[aria-current=true]::before { background: linear-gradient(135deg, var(--accent-stops)); }
.lx-prose { flex: 999 1 34rem; min-inline-size: 0; max-inline-size: 42rem; font-size: 1.1875rem; line-height: 1.7; }
.lx-prose :where(p, ul, ol, figure, blockquote, aside) { margin: 0; }
.lx-prose > * + * { margin-block-start: 1.15em; }
.lx-prose > h2 { font-family: var(--font-display); font-weight: 400; font-size: calc(clamp(1.6rem, 1.3rem + 1vw, 2.15rem) * var(--heading-scale, 1)); line-height: 1.18; letter-spacing: var(--ls-heading); font-variation-settings: var(--fvs-display); margin-block: 2.1em 0; scroll-margin-block-start: 104px; }
.lx-prose p { text-wrap: pretty; }
.lx-prose a { color: var(--fg-accent); text-decoration: underline; text-underline-offset: 0.2em; text-decoration-thickness: 1px; }
.lx-prose ul { padding-inline-start: 1.2em; display: grid; gap: 0.35em; }
.lx-prose > .lx-pull { margin-block: 1.6em; }
.lx-pull { font-family: var(--font-display); font-weight: 300; font-size: calc(clamp(1.7rem, 1.2rem + 1.5vw, 2.5rem) * var(--heading-scale, 1)); line-height: 1.2; letter-spacing: var(--ls-heading); font-variation-settings: var(--fvs-display); text-align: center; text-wrap: balance; padding-block: 0.7em; border-block: 1px solid transparent; border-image: linear-gradient(90deg, transparent, var(--chrome-line), transparent) 1; }
.lx-code { border-radius: var(--radius-m); overflow: clip; font-size: 1rem; }
.lx-code figcaption { display: flex; justify-content: space-between; gap: 12px; padding: 10px 18px; font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-muted); border-block-end: 1px solid var(--border-subtle); }
.lx-code pre { margin: 0; padding: 18px 20px; overflow-x: auto; font-family: var(--font-mono); font-size: 14px; line-height: 1.7; }
.lx-code pre:focus-visible { outline: var(--focus-w) solid var(--focus-ring); outline-offset: -4px; }
.lx-code .tk-p { color: var(--fg-accent); }
.lx-code .tk-c { color: var(--fg-muted); }
.lx-author { display: flex; flex-wrap: wrap; gap: 18px 22px; align-items: center; padding: 24px 28px; border-radius: var(--radius-l); }
.lx-author div { flex: 1 1 18rem; display: grid; gap: 4px; }
.lx-author p { margin: 0; }

/* User settings win: reduced transparency, more contrast, no backdrop-filter → opaque surfaces and solid steel rings */
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {${opaque('.dir-luminous')}
}
@supports not (backdrop-filter: blur(1px)) {${opaque('.dir-luminous')}
}
${opaque('.dir-luminous .lx-opaque')}
/* Increased-contrast contexts are opaque too */
${opaque('.dir-luminous [data-contrast=more]')}
@media (forced-colors: active) {
  .dir-luminous :is(${RINGED})::before, .dir-luminous .ns-button::after, .dir-luminous :is(.lx-ambient, .lx-dust) { content: none; display: none; }
  .dir-luminous :is(${RINGED}) { border-color: CanvasText; background-color: Canvas; background-image: none; backdrop-filter: none; }
  .dir-luminous :is(${FIELDS}) { background: Field; border-color: FieldText; }
  .dir-luminous .ns-button { background: ButtonFace; color: ButtonText; border-color: ButtonText; backdrop-filter: none; }
  .lx-chrome-text { background: none; color: CanvasText; -webkit-text-fill-color: currentColor; }
}
`;

// ---------------------------------------------------------------- foundations sections
// The increased-contrast themes, side by side (dark-more first, as dark is primary).
function moreContrastSection(icon) {
  const keys = ['bg-canvas', 'fg-default', 'fg-muted', 'fg-accent', 'border-strong', 'focus-ring'];
  const r = (s, fg, bg) => contrast(oklch(...PAL.luminous[s][fg]), oklch(...PAL.luminous[s][bg])).toFixed(1);
  const panel = (s) => {
    const base = s.replace('-more', '');
    return `<div class="scheme" data-scheme="${base}" data-contrast="more" style="display: grid; gap: 18px; align-content: start; padding: 28px; border-radius: 24px; border: 1px solid var(--border-strong)">
        <p class="t-micro">${base === 'dark' ? 'Obsidian' : 'Pearl'} · more contrast</p>
        <div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px">
          ${keys.map((k) => `<div style="display: grid; gap: 4px"><span style="block-size: 34px; border-radius: var(--radius-xs); background: var(--${k}); border: 1px solid var(--border-strong)"></span><span class="t-micro" style="letter-spacing: 0.02em; text-transform: none">${k.replace('bg-', '').replace('fg-', '')}${k === 'bg-canvas' ? '' : ` ${r(s, k, 'bg-canvas')}:1`}</span></div>`).join('')}
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center">
          <button type="button" class="ns-button" data-variant="primary">Continue</button>
          <button type="button" class="ns-button">Cancel</button>
          <button type="button" class="ns-button" aria-pressed="true">${icon('check')}<span>On</span></button>
          <a class="ns-link" href="#">A link in running text</a>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <input class="ns-input" style="inline-size: 170px" value="Opaque field" aria-label="Field, ${s}" />
          <label class="ns-choice"><input class="ns-check" type="checkbox" checked="checked" /><span>Checked</span></label>
          <label class="ns-choice"><input class="ns-radio" type="radio" name="mc-${s}" checked="checked" /><span>Chosen</span></label>
          <label class="ns-choice"><input class="ns-switch" type="checkbox" role="switch" checked="checked" /><span>On</span></label>
        </div>
        <p class="t-small t-muted">Muted text ${r(s, 'fg-muted', 'bg-canvas')}:1 · boundary ${r(s, 'border-strong', 'bg-canvas')}:1 · focus ${r(s, 'focus-ring', 'bg-canvas')}:1. Glass is opaque, chrome is one solid line, satin and ambient light are off.</p>
      </div>`;
  };
  return `
  <section style="display: grid; gap: 20px">
    <div class="section-head"><h2 class="t-h2">Increased contrast</h2><p class="t-micro">prefers-contrast: more · data-contrast="more"</p></div>
    <p class="t-small t-muted" style="max-inline-size: 76ch">Every text pair reaches 7:1 and every boundary 4.5:1 (all 72 pairs pass, plus the multi-tone fills at 7:1). The look keeps its type, shape and prism tones; the glass, chrome reflection, satin and ambient light step aside.</p>
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px">${panel('dark-more')}${panel('light-more')}</div>
  </section>`;
}

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
    <p class="t-small t-muted" style="max-inline-size: 72ch">Ambient light comes from the whole prism. Glass buttons carry several of its tones at once — ${LUM.light.buttons.prism.hues.join(', ')} in light; ${LUM.dark.buttons.prism.hues.join(', ')} in dark — all at one lightness, so they can drift without changing contrast. Small solid fills (checkboxes, switches, steps) keep an iso-lightness slice.</p>
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px">
      ${['dark', 'light'].map((s) => panel(s, `
        <p class="t-micro">${label(s)} · glass buttons</p>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
          <button type="button" class="ns-button">Clear glass</button>
          <button type="button" class="ns-button" data-variant="primary">Prism glass</button>
          <button type="button" class="ns-button" data-variant="primary" data-demo="hover">Hover</button>
          <button type="button" class="ns-button" data-variant="primary" data-demo="active">Pressed</button>
        </div>
        <p class="t-small t-muted">Label on prism glass ≥ ${r(s, 'fg-default on prism glass button (up')}:1 with up to three tones overlapping, over any surface, ambient light or glass; clear glass ≥ ${r(s, 'fg-default on neutral glass button')}:1.</p>`)).join('\n      ')}
    </div>
  </section>`;

  const chrome = `
  <section style="display: grid; gap: 20px">
    <div class="section-head"><h2 class="t-h2">Chrome</h2><p class="t-micro">1 px · conic reflection · a real 3:1 boundary</p></div>
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px">
      ${['dark', 'light'].map((s) => panel(s, `
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
      ${['dark', 'light'].map((s) => panel(s, `
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
    <p class="t-small t-muted" style="max-inline-size: 76ch">Glass is a tint over a blurred, range-compressed backdrop (<code class="t-code">contrast()</code> and <code class="t-code">brightness()</code> in the backdrop filter), plus a faint sheen and a prism fringe at the edge. The checker composites it over white, black and every fill in the palette, reading the filter both ways engines apply it, and keeps the worst result. Buttons are a lighter, clearer pane: verified over surfaces, ambient light and glass — on photography they sit on a glass panel.</p>
  </section>`;

  const motion = `
  <section style="display: grid; gap: 20px">
    <div class="section-head"><h2 class="t-h2">Light that moves</h2><p class="t-micro">≤ 320 ms · on interaction only · press Play to try</p></div>
    <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px">
      ${[
        ['Colour drift', '<button type="button" class="ns-button" data-variant="primary">Continue</button>', 'Hover drifts the tones inside the glass. They share one lightness, so the label’s contrast holds throughout.'],
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

  return { afterColour: moreContrastSection(icon) + prism + chrome + glass + materialsSection(), beforeSignature: motion + fallbacks };
}
