import { oklch, contrast, apca, toHex, over, filtered, inGamut, oklabToLinearSrgb, oklchToOklab, WHITE, BLACK } from './contrast.mjs';

// [L, C, h]
export const directions = {
  loom: {
    light: {
      'bg-canvas': [0.972, 0.010, 80], 'bg-surface': [0.992, 0.004, 80], 'bg-surface-subtle': [0.945, 0.014, 80],
      'fg-default': [0.26, 0.018, 60], 'fg-muted': [0.46, 0.020, 65],
      'border-subtle': [0.89, 0.014, 75], 'border-strong': [0.58, 0.020, 70],
      'bg-accent': [0.45, 0.075, 200], 'bg-accent-hover': [0.40, 0.072, 200], 'bg-accent-active': [0.36, 0.068, 200],
      'bg-accent-subtle': [0.93, 0.030, 195], 'fg-accent': [0.45, 0.075, 200], 'fg-on-accent': [0.99, 0.005, 80],
      'focus-ring': [0.45, 0.075, 200],
      'bg-critical': [0.50, 0.165, 28], 'fg-on-critical': [0.99, 0.005, 80], 'fg-critical': [0.48, 0.16, 28], 'bg-critical-subtle': [0.95, 0.025, 28],
      'fg-warning': [0.50, 0.11, 70], 'bg-warning-subtle': [0.95, 0.045, 85],
      'fg-success': [0.47, 0.10, 150], 'bg-success-subtle': [0.95, 0.035, 150],
      'fg-info': [0.47, 0.11, 250], 'bg-info-subtle': [0.95, 0.025, 250],
      'bg-inverse': [0.26, 0.018, 60], 'fg-inverse': [0.97, 0.008, 80],
    },
    dark: {
      'bg-canvas': [0.19, 0.012, 70], 'bg-surface': [0.23, 0.014, 70], 'bg-surface-subtle': [0.27, 0.014, 70],
      'fg-default': [0.93, 0.010, 80], 'fg-muted': [0.74, 0.015, 75],
      'border-subtle': [0.32, 0.012, 70], 'border-strong': [0.58, 0.015, 70],
      'bg-accent': [0.74, 0.09, 195], 'bg-accent-hover': [0.79, 0.085, 195], 'bg-accent-active': [0.84, 0.075, 195],
      'bg-accent-subtle': [0.30, 0.045, 200], 'fg-accent': [0.78, 0.09, 195], 'fg-on-accent': [0.20, 0.02, 200],
      'focus-ring': [0.78, 0.09, 195],
      'bg-critical': [0.70, 0.15, 25], 'fg-on-critical': [0.18, 0.02, 25], 'fg-critical': [0.75, 0.13, 25], 'bg-critical-subtle': [0.29, 0.06, 25],
      'fg-warning': [0.82, 0.12, 80], 'bg-warning-subtle': [0.30, 0.05, 80],
      'fg-success': [0.78, 0.12, 150], 'bg-success-subtle': [0.29, 0.05, 150],
      'fg-info': [0.78, 0.09, 245], 'bg-info-subtle': [0.29, 0.05, 245],
      'bg-inverse': [0.93, 0.010, 80], 'fg-inverse': [0.22, 0.015, 70],
    },
  },
  instrument: {
    light: {
      'bg-canvas': [0.985, 0.002, 250], 'bg-surface': [1, 0, 0], 'bg-surface-subtle': [0.955, 0.004, 250],
      'fg-default': [0.20, 0.008, 255], 'fg-muted': [0.45, 0.010, 255],
      'border-subtle': [0.90, 0.004, 250], 'border-strong': [0.50, 0.010, 255],
      'bg-accent': [0.70, 0.19, 45], 'bg-accent-hover': [0.745, 0.17, 50], 'bg-accent-active': [0.79, 0.15, 55],
      'bg-accent-subtle': [0.95, 0.035, 55], 'fg-accent': [0.52, 0.16, 42], 'fg-on-accent': [0.18, 0.01, 45],
      'focus-ring': [0.20, 0.008, 255],
      'bg-critical': [0.50, 0.19, 25], 'fg-on-critical': [0.99, 0, 0], 'fg-critical': [0.50, 0.19, 25], 'bg-critical-subtle': [0.955, 0.02, 25],
      'fg-warning': [0.50, 0.10, 75], 'bg-warning-subtle': [0.955, 0.05, 90],
      'fg-success': [0.48, 0.11, 155], 'bg-success-subtle': [0.955, 0.03, 155],
      'fg-info': [0.48, 0.13, 255], 'bg-info-subtle': [0.955, 0.02, 255],
      'bg-inverse': [0.20, 0.008, 255], 'fg-inverse': [0.985, 0.002, 250],
    },
    dark: {
      'bg-canvas': [0.15, 0.006, 255], 'bg-surface': [0.19, 0.007, 255], 'bg-surface-subtle': [0.23, 0.008, 255],
      'fg-default': [0.94, 0.004, 250], 'fg-muted': [0.72, 0.008, 250],
      'border-subtle': [0.30, 0.008, 255], 'border-strong': [0.62, 0.008, 250],
      'bg-accent': [0.72, 0.18, 48], 'bg-accent-hover': [0.77, 0.17, 50], 'bg-accent-active': [0.81, 0.15, 55],
      'bg-accent-subtle': [0.28, 0.06, 45], 'fg-accent': [0.76, 0.16, 50], 'fg-on-accent': [0.16, 0.01, 45],
      'focus-ring': [0.94, 0.004, 250],
      'bg-critical': [0.68, 0.17, 25], 'fg-on-critical': [0.16, 0.01, 25], 'fg-critical': [0.74, 0.15, 25], 'bg-critical-subtle': [0.27, 0.06, 25],
      'fg-warning': [0.84, 0.13, 85], 'bg-warning-subtle': [0.28, 0.05, 85],
      'fg-success': [0.78, 0.13, 155], 'bg-success-subtle': [0.27, 0.05, 155],
      'fg-info': [0.76, 0.11, 250], 'bg-info-subtle': [0.27, 0.05, 250],
      'bg-inverse': [0.94, 0.004, 250], 'fg-inverse': [0.18, 0.006, 255],
    },
  },
  chroma: {
    light: {
      'bg-canvas': [0.985, 0.006, 340], 'bg-surface': [1, 0, 0], 'bg-surface-subtle': [0.955, 0.012, 340],
      'fg-default': [0.22, 0.03, 320], 'fg-muted': [0.45, 0.04, 320],
      'border-subtle': [0.90, 0.012, 340], 'border-strong': [0.55, 0.03, 330],
      'bg-accent': [0.55, 0.22, 350], 'bg-accent-hover': [0.50, 0.21, 350], 'bg-accent-active': [0.46, 0.19, 350],
      'bg-accent-subtle': [0.94, 0.04, 350], 'fg-accent': [0.52, 0.21, 350], 'fg-on-accent': [0.99, 0.005, 340],
      'focus-ring': [0.52, 0.21, 350],
      'bg-critical': [0.52, 0.19, 28], 'fg-on-critical': [0.99, 0.005, 340], 'fg-critical': [0.50, 0.18, 28], 'bg-critical-subtle': [0.955, 0.025, 30],
      'fg-warning': [0.52, 0.11, 70], 'bg-warning-subtle': [0.955, 0.06, 90],
      'fg-success': [0.48, 0.12, 160], 'bg-success-subtle': [0.955, 0.04, 160],
      'fg-info': [0.48, 0.14, 255], 'bg-info-subtle': [0.955, 0.03, 255],
      'bg-inverse': [0.22, 0.03, 320], 'fg-inverse': [0.985, 0.006, 340],
    },
    dark: {
      'bg-canvas': [0.17, 0.02, 320], 'bg-surface': [0.21, 0.025, 320], 'bg-surface-subtle': [0.25, 0.03, 320],
      'fg-default': [0.95, 0.01, 340], 'fg-muted': [0.76, 0.03, 330],
      'border-subtle': [0.32, 0.03, 320], 'border-strong': [0.62, 0.03, 330],
      'bg-accent': [0.72, 0.19, 350], 'bg-accent-hover': [0.77, 0.17, 350], 'bg-accent-active': [0.81, 0.15, 350],
      'bg-accent-subtle': [0.30, 0.08, 350], 'fg-accent': [0.78, 0.16, 350], 'fg-on-accent': [0.18, 0.03, 350],
      'focus-ring': [0.88, 0.19, 125],
      'bg-critical': [0.70, 0.17, 28], 'fg-on-critical': [0.17, 0.02, 28], 'fg-critical': [0.76, 0.14, 28], 'bg-critical-subtle': [0.29, 0.07, 28],
      'fg-warning': [0.85, 0.13, 85], 'bg-warning-subtle': [0.29, 0.05, 85],
      'fg-success': [0.80, 0.14, 160], 'bg-success-subtle': [0.28, 0.05, 160],
      'fg-info': [0.78, 0.11, 250], 'bg-info-subtle': [0.28, 0.05, 250],
      'bg-inverse': [0.95, 0.01, 340], 'fg-inverse': [0.20, 0.025, 320],
    },
  },
  // C2 · Chroma Luminous (Pass 2): pearl and obsidian neutrals (hue 285–290), an orchid accent that is the middle of
  // an iso-lightness prism gradient (see `luminous` below), aqua focus in dark, iris focus in light.
  luminous: {
    light: {
      'bg-canvas': [0.978, 0.007, 290], 'bg-surface': [0.993, 0.003, 290], 'bg-surface-subtle': [0.952, 0.012, 290],
      'fg-default': [0.215, 0.03, 285], 'fg-muted': [0.455, 0.03, 285],
      'border-subtle': [0.895, 0.012, 285], 'border-strong': [0.56, 0.016, 275],
      'bg-accent': [0.50, 0.19, 318], 'bg-accent-hover': [0.50, 0.19, 318], 'bg-accent-active': [0.44, 0.18, 318],
      'bg-accent-subtle': [0.94, 0.035, 310], 'fg-accent': [0.48, 0.19, 312], 'fg-on-accent': [0.99, 0.004, 290],
      'focus-ring': [0.46, 0.2, 285],
      'bg-critical': [0.52, 0.19, 18], 'fg-on-critical': [0.99, 0.004, 290], 'fg-critical': [0.50, 0.18, 20], 'bg-critical-subtle': [0.955, 0.025, 15],
      'fg-warning': [0.52, 0.11, 70], 'bg-warning-subtle': [0.958, 0.045, 85],
      'fg-success': [0.48, 0.10, 165], 'bg-success-subtle': [0.955, 0.035, 165],
      'fg-info': [0.48, 0.13, 245], 'bg-info-subtle': [0.955, 0.028, 245],
      'bg-inverse': [0.215, 0.03, 285], 'fg-inverse': [0.978, 0.007, 290],
    },
    dark: {
      'bg-canvas': [0.155, 0.02, 285], 'bg-surface': [0.195, 0.024, 285], 'bg-surface-subtle': [0.235, 0.026, 285],
      'fg-default': [0.955, 0.008, 290], 'fg-muted': [0.78, 0.02, 290],
      'border-subtle': [0.31, 0.022, 285], 'border-strong': [0.64, 0.016, 275],
      'bg-accent': [0.80, 0.115, 312], 'bg-accent-hover': [0.80, 0.115, 312], 'bg-accent-active': [0.86, 0.09, 312],
      'bg-accent-subtle': [0.30, 0.07, 305], 'fg-accent': [0.82, 0.11, 312], 'fg-on-accent': [0.17, 0.03, 290],
      'focus-ring': [0.86, 0.13, 195],
      'bg-critical': [0.74, 0.14, 18], 'fg-on-critical': [0.17, 0.03, 18], 'fg-critical': [0.78, 0.13, 18], 'bg-critical-subtle': [0.29, 0.07, 15],
      'fg-warning': [0.86, 0.12, 80], 'bg-warning-subtle': [0.29, 0.05, 80],
      'fg-success': [0.83, 0.12, 165], 'bg-success-subtle': [0.28, 0.05, 165],
      'fg-info': [0.80, 0.10, 240], 'bg-info-subtle': [0.28, 0.05, 240],
      'bg-inverse': [0.955, 0.008, 290], 'fg-inverse': [0.20, 0.025, 285],
    },
  },
};

// ---------------------------------------------------------------- Chroma Luminous: prism, chrome, glass
// Everything a flat palette can't express. Each piece carries its own contrast rule, checked by evaluateLuminous().
export const luminous = {
  // The expanded palette: eight prism hues, ramped at "subdued neon" chroma (90% of the sRGB maximum, capped).
  prism: { rose: 0, orchid: 318, iris: 285, azure: 250, aqua: 205, mint: 168, citron: 118, amber: 72 },
  prismSteps: [0.92, 0.84, 0.76, 0.66, 0.56, 0.46, 0.36],
  prismChroma: 0.16,
  light: {
    // Filled accents are an iso-lightness gradient: hover slides along it, so text contrast never changes.
    accent: {
      rest: [[0.50, 0.17, 355], [0.50, 0.19, 318], [0.49, 0.18, 288], [0.50, 0.13, 252]],
      active: [[0.44, 0.16, 355], [0.44, 0.18, 318], [0.43, 0.17, 288], [0.44, 0.12, 252]],
    },
    // Gunmetal chrome: on a pearl ground every stop stays dark enough to be a 3:1 control boundary.
    chrome: [[0.56, 0.006, 265], [0.38, 0.012, 285], [0.51, 0.005, 240], [0.29, 0.014, 290], [0.545, 0.008, 270]],
    neutral: [[0.998, 0.002, 290], [0.958, 0.011, 290]],
    glass: { tint: [0.995, 0.004, 290], filter: { contrast: 0.65, brightness: 1.12 }, overlay: 0.84, modal: 0.8, sheen: 0 },
    scrim: { col: [0.22, 0.03, 285], alpha: 0.36 },
    ambient: { L: 0.80, C: 0.12, alpha: 0.28 },
  },
  dark: {
    accent: {
      rest: [[0.80, 0.11, 355], [0.80, 0.115, 318], [0.79, 0.11, 288], [0.81, 0.10, 215]],
      active: [[0.86, 0.085, 355], [0.86, 0.09, 318], [0.85, 0.085, 288], [0.87, 0.08, 215]],
    },
    // Bright silver with a darker horizon band; every stop clears 3:1 against obsidian.
    chrome: [[0.97, 0.004, 270], [0.74, 0.012, 275], [0.64, 0.016, 285], [0.89, 0.008, 250], [0.70, 0.014, 280]],
    neutral: [[0.275, 0.026, 285], [0.215, 0.024, 285]],
    glass: { tint: [0.205, 0.026, 285], filter: { contrast: 0.75, brightness: 0.6 }, overlay: 0.84, modal: 0.72, sheen: 0.04 },
    scrim: { col: [0.08, 0.02, 285], alpha: 0.6 },
    ambient: { L: 0.68, C: 0.14, alpha: 0.2 },
  },
};

const maxChroma = (L, h) => {
  let lo = 0, hi = 0.4;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklabToLinearSrgb(oklchToOklab(L, mid, h)))) lo = mid; else hi = mid;
  }
  return lo;
};
export const prismRamp = () => Object.fromEntries(Object.entries(luminous.prism).map(([name, h]) =>
  [name, luminous.prismSteps.map((L) => [L, +Math.min(luminous.prismChroma, 0.9 * maxChroma(L, h)).toFixed(3), h])]));
export const ambientGlows = (s) => Object.values(luminous.prism).map((h) =>
  [luminous[s].ambient.L, +Math.min(luminous[s].ambient.C, 0.9 * maxChroma(luminous[s].ambient.L, h)).toFixed(3), h]);

// Glass over a backdrop: (scrim) → backdrop-filter (both readings) → tint at alpha → sheen. Returns both readings.
function glassOver(s, tier, backdrop) {
  const g = luminous[s].glass;
  const scrim = luminous[s].scrim;
  const b = tier === 'modal' ? over(oklch(...scrim.col), scrim.alpha, backdrop) : backdrop;
  return filtered(b, g.filter).map((fb) => {
    const tinted = over(oklch(...g.tint), g[tier], fb);
    return g.sheen ? over(WHITE, g.sheen, tinted) : tinted;
  });
}

export function evaluateLuminous(s) {
  const P = directions.luminous[s];
  const X = luminous[s];
  const col = Object.fromEntries(Object.entries(P).map(([k, v]) => [k, oklch(...v)]));
  const rows = [];
  const check = (what, fg, bg, min) => { const r = contrast(fg, bg); rows.push({ what, ratio: r, min, pass: r >= min }); };
  const worst = (what, fgs, bgs, min) => {
    let lo = Infinity;
    for (const f of fgs) for (const b of bgs) lo = Math.min(lo, contrast(f, b));
    rows.push({ what, ratio: lo, min, pass: lo >= min });
  };
  const chrome = X.chrome.map((c) => oklch(...c));
  const accentRest = X.accent.rest.map((c) => oklch(...c));
  const accentActive = X.accent.active.map((c) => oklch(...c));
  const glows = ambientGlows(s).map((c) => over(oklch(...c), X.ambient.alpha, col['bg-canvas']));
  // Ambient layers can overlap (an orb over the refracted band), so text may sit on two glows at once.
  const doubled = ambientGlows(s).flatMap((a) => ambientGlows(s).map((b) =>
    over(oklch(...a), X.ambient.alpha, over(oklch(...b), X.ambient.alpha, col['bg-canvas']))));

  worst('fg-on-accent on prism fill (rest + hover)', [col['fg-on-accent']], accentRest, 4.5);
  worst('fg-on-accent on prism fill (active)', [col['fg-on-accent']], accentActive, 4.5);
  worst('chrome boundary on canvas/surfaces', chrome, [col['bg-canvas'], col['bg-surface'], col['bg-surface-subtle']], 3);
  worst('fg-default on neutral button sheen', [col['fg-default']], X.neutral.map((c) => oklch(...c)), 7);
  worst('chrome boundary vs neutral button outside (canvas)', chrome, [col['bg-canvas']], 3);
  worst('fg-default on ambient prism light', [col['fg-default']], glows, 7);
  worst('fg-muted on ambient prism light', [col['fg-muted']], glows, 4.5);
  worst('fg-accent on ambient prism light', [col['fg-accent']], glows, 4.5);
  worst('fg-default on overlapping ambient light', [col['fg-default']], doubled, 7);
  worst('fg-muted on overlapping ambient light', [col['fg-muted']], doubled, 4.5);
  worst('fg-accent on overlapping ambient light', [col['fg-accent']], doubled, 4.5);

  const backdrops = [WHITE, BLACK, col['bg-canvas'], col['bg-surface'], col['bg-inverse'], col['fg-default'], ...accentRest, ...glows];
  for (const tier of ['overlay', 'modal']) {
    const glass = backdrops.flatMap((b) => glassOver(s, tier, b));
    worst(`fg-default on ${tier} glass (worst backdrop)`, [col['fg-default']], glass, 7);
    worst(`fg-muted on ${tier} glass`, [col['fg-muted']], glass, 4.5);
    worst(`fg-accent on ${tier} glass`, [col['fg-accent']], glass, 4.5);
    worst(`fg-critical on ${tier} glass`, [col['fg-critical']], glass, 4.5);
    worst(`focus-ring on ${tier} glass`, [col['focus-ring']], glass, 3);
    worst(`chrome boundary on ${tier} glass`, chrome, glass, 3);
  }
  return { rows, chrome, accentRest, accentActive };
}

export const pairs = [
  ['fg-default', ['bg-canvas', 'bg-surface', 'bg-surface-subtle', 'bg-accent-subtle', 'bg-critical-subtle', 'bg-warning-subtle', 'bg-success-subtle', 'bg-info-subtle'], 7],
  ['fg-muted', ['bg-canvas', 'bg-surface', 'bg-surface-subtle'], 4.5],
  ['fg-accent', ['bg-canvas', 'bg-surface', 'bg-accent-subtle'], 4.5],
  ['fg-on-accent', ['bg-accent', 'bg-accent-hover', 'bg-accent-active'], 4.5],
  ['border-strong', ['bg-canvas', 'bg-surface'], 3],
  ['focus-ring', ['bg-canvas', 'bg-surface', 'bg-surface-subtle'], 3],
  ['fg-on-critical', ['bg-critical'], 4.5],
  ['fg-critical', ['bg-canvas', 'bg-surface', 'bg-critical-subtle'], 4.5],
  ['fg-warning', ['bg-canvas', 'bg-surface', 'bg-warning-subtle'], 4.5],
  ['fg-success', ['bg-canvas', 'bg-surface', 'bg-success-subtle'], 4.5],
  ['fg-info', ['bg-canvas', 'bg-surface', 'bg-info-subtle'], 4.5],
  ['fg-inverse', ['bg-inverse'], 7],
];

export function evaluate(palette) {
  const col = Object.fromEntries(Object.entries(palette).map(([k, v]) => [k, oklch(...v)]));
  const rows = [];
  for (const [fg, bgs, min] of pairs) {
    for (const bg of bgs) {
      const r = contrast(col[fg], col[bg]);
      rows.push({ fg, bg, min, ratio: r, pass: r >= min, lc: apca(col[fg], col[bg]) });
    }
  }
  const advisory = { 'bg-accent vs bg-canvas': contrast(col['bg-accent'], col['bg-canvas']) };
  const mapped = Object.entries(col).filter(([, c]) => c.mapped).map(([k]) => k);
  return { rows, advisory, mapped, col };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const [dir, schemes] of Object.entries(directions)) {
    for (const [scheme, palette] of Object.entries(schemes)) {
      const { rows, advisory, mapped } = evaluate(palette);
      const fails = rows.filter((r) => !r.pass);
      const minMargin = Math.min(...rows.map((r) => r.ratio / r.min));
      console.log(`${dir}/${scheme}: ${rows.length} pairs, ${fails.length} fail, tightest margin ×${minMargin.toFixed(2)}, accent-vs-canvas ${advisory['bg-accent vs bg-canvas'].toFixed(2)}${mapped.length ? ', gamut-mapped: ' + mapped.join(',') : ''}`);
      for (const f of fails) console.log(`   FAIL ${f.fg} on ${f.bg}: ${f.ratio.toFixed(2)} < ${f.min}`);
    }
  }
  for (const s of ['light', 'dark']) {
    const { rows } = evaluateLuminous(s);
    const fails = rows.filter((r) => !r.pass);
    const minMargin = Math.min(...rows.map((r) => r.ratio / r.min));
    console.log(`luminous/${s} prism · chrome · glass: ${rows.length} rules, ${fails.length} fail, tightest margin ×${minMargin.toFixed(2)}`);
    for (const r of rows) if (!r.pass || process.argv.includes('--all')) console.log(`   ${r.pass ? 'ok  ' : 'FAIL'} ${r.what}: ${r.ratio.toFixed(2)} (min ${r.min})`);
  }
}
