// Colour math for the material contrast rules: OKLCH → sRGB (chroma reduced into gamut), WCAG 2.x contrast, and
// compositing as browsers do it (in gamma-encoded sRGB). Copied from tools/directions/contrast.mjs, which seeded the
// palettes in Pass 2, so the build checks the same thing the palettes were tuned against.

const toRad = (d) => (d * Math.PI) / 180;
const oklchToOklab = (L, C, h) => [L, C * Math.cos(toRad(h)), C * Math.sin(toRad(h))];
function oklabToLinearSrgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const inGamut = (rgb, eps = 1e-4) => rgb.every((v) => v >= -eps && v <= 1 + eps);
const gammaEncode = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
const gammaDecode = (x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);

/** An OKLCH colour as linear sRGB, with chroma reduced until it's in gamut (keeping L and h). */
export function oklch(L, C, h) {
  let c = C;
  if (!inGamut(oklabToLinearSrgb(oklchToOklab(L, C, h)))) {
    let lo = 0;
    let hi = C;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklabToLinearSrgb(oklchToOklab(L, mid, h)))) lo = mid;
      else hi = mid;
    }
    c = lo;
  }
  return { lin: oklabToLinearSrgb(oklchToOklab(L, c, h)).map((v) => Math.min(1, Math.max(0, v))) };
}

/** A DTCG colour value ({ colorSpace: 'oklch', components, alpha }) → { col, alpha }. */
export function fromToken(value) {
  const [L, C, h] = value.components;
  return { col: oklch(L, C, h), alpha: value.alpha ?? 1 };
}

const luminance = (col) => 0.2126 * col.lin[0] + 0.7152 * col.lin[1] + 0.0722 * col.lin[2];
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export const WHITE = { lin: [1, 1, 1] };
export const BLACK = { lin: [0, 0, 0] };
const encoded = (col) => col.lin.map(gammaEncode);
const fromEncoded = (enc) => ({ lin: enc.map((v) => gammaDecode(Math.min(1, Math.max(0, v)))) });

/** `top` at `alpha` over `bottom` (source-over, in encoded sRGB as browsers composite). */
export function over(top, alpha, bottom) {
  const t = encoded(top);
  const b = encoded(bottom);
  return fromEncoded(t.map((v, i) => alpha * v + (1 - alpha) * b[i]));
}

/**
 * backdrop-filter contrast() then brightness(). Engines differ on whether filters run on linear or encoded values, so
 * both readings are returned; callers keep the worse.
 */
export function filtered(col, { contrast: c = 1, brightness: br = 1 } = {}) {
  const f = (v) => Math.min(1, Math.max(0, (c * v + (1 - c) / 2) * br));
  return [{ lin: col.lin.map(f) }, fromEncoded(encoded(col).map(f))];
}
