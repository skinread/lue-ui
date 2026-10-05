import { oklch, contrast, apca, toHex } from './contrast.mjs';

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
};

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
}
