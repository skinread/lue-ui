// Dependency-free OKLCH → sRGB → WCAG 2.x contrast tools (plus APCA Lc, advisory).
// Usage as a module: import { oklch, contrast, apca, inGamut, toHex } from './contrast.mjs'

const toRad = (d) => (d * Math.PI) / 180;

export function oklchToOklab(L, C, h) {
  return [L, C * Math.cos(toRad(h)), C * Math.sin(toRad(h))];
}

export function oklabToLinearSrgb([L, a, b]) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

export const inGamut = (rgb, eps = 1e-4) => rgb.every((v) => v >= -eps && v <= 1 + eps);

const gammaEncode = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);

// Reduce chroma until in sRGB gamut (simple binary search, keeps L and h)
export function gamutMap(L, C, h) {
  if (inGamut(oklabToLinearSrgb(oklchToOklab(L, C, h)))) return [L, C, h];
  let lo = 0, hi = C;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklabToLinearSrgb(oklchToOklab(L, mid, h)))) lo = mid; else hi = mid;
  }
  return [L, lo, h];
}

export function oklch(L, C, h) {
  const [l2, c2, h2] = gamutMap(L, C, h);
  const lin = oklabToLinearSrgb(oklchToOklab(l2, c2, h2)).map((v) => Math.min(1, Math.max(0, v)));
  return { L: l2, C: c2, h: h2, lin, mapped: c2 < C - 1e-6 };
}

export const luminance = (col) => 0.2126 * col.lin[0] + 0.7152 * col.lin[1] + 0.0722 * col.lin[2];

export function contrast(a, b) {
  const y1 = luminance(a), y2 = luminance(b);
  const [hi, lo] = y1 > y2 ? [y1, y2] : [y2, y1];
  return (hi + 0.05) / (lo + 0.05);
}

export function toHex(col) {
  return '#' + col.lin.map((v) => Math.round(gammaEncode(v) * 255).toString(16).padStart(2, '0')).join('');
}

// APCA-W3 0.0.98G-4g (advisory only). text = foreground, bg = background.
export function apca(text, bg) {
  const sRGBtoY = (col) => {
    const [r, g, b] = col.lin.map((v) => Math.pow(gammaEncode(v), 2.4));
    return 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  };
  const blkThrs = 0.022, blkClmp = 1.414;
  let Ytxt = sRGBtoY(text), Ybg = sRGBtoY(bg);
  Ytxt = Ytxt > blkThrs ? Ytxt : Ytxt + Math.pow(blkThrs - Ytxt, blkClmp);
  Ybg = Ybg > blkThrs ? Ybg : Ybg + Math.pow(blkThrs - Ybg, blkClmp);
  let SAPC, out;
  if (Ybg > Ytxt) {
    SAPC = (Math.pow(Ybg, 0.56) - Math.pow(Ytxt, 0.57)) * 1.14;
    out = SAPC < 0.1 ? 0 : SAPC - 0.027;
  } else {
    SAPC = (Math.pow(Ybg, 0.65) - Math.pow(Ytxt, 0.62)) * 1.14;
    out = SAPC > -0.1 ? 0 : SAPC + 0.027;
  }
  return out * 100;
}

// ---------------------------------------------------------------- compositing (glass, scrims, glows)
// Browsers composite in gamma-encoded sRGB, so blends are done on encoded channels.
const gammaDecode = (x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
export const fromEncoded = (enc) => ({ lin: enc.map((v) => gammaDecode(Math.min(1, Math.max(0, v)))) });
export const encoded = (col) => col.lin.map(gammaEncode);
export const WHITE = { lin: [1, 1, 1] };
export const BLACK = { lin: [0, 0, 0] };

// `top` at `alpha` over `bottom` (source-over).
export function over(top, alpha, bottom) {
  const t = encoded(top), b = encoded(bottom);
  return fromEncoded(t.map((v, i) => alpha * v + (1 - alpha) * b[i]));
}

// backdrop-filter contrast(c) then brightness(b). Engines differ on whether filter functions run on linear or
// encoded values, so return both readings; callers keep the worse one.
export function filtered(col, { contrast: c = 1, brightness: br = 1 } = {}) {
  const f = (v) => Math.min(1, Math.max(0, (c * v + (1 - c) / 2) * br));
  return [{ lin: col.lin.map(f) }, fromEncoded(encoded(col).map(f))];
}

// For neutral (C=0) colours: OKLab L where WCAG contrast against bgL equals target.
export function neutralLForContrast(bgL, target, darker = true) {
  const Ybg = bgL ** 3;
  const Yt = darker ? (Ybg + 0.05) / target - 0.05 : target * (Ybg + 0.05) - 0.05;
  if (Yt < 0 || Yt > 1) return null;
  return Math.cbrt(Yt);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // Print lightness bands for neutral pairs against typical canvases.
  const canvases = { 'light canvas L=0.99': 0.99, 'light surface L=0.97': 0.97, 'dark canvas L=0.16': 0.16, 'dark surface L=0.21': 0.21 };
  for (const [name, L] of Object.entries(canvases)) {
    const darker = L > 0.5;
    const row = [7, 4.5, 3].map((t) => {
      const l = neutralLForContrast(L, t, darker);
      return `${t}:1 → L ${darker ? '≤' : '≥'} ${l?.toFixed(3)}`;
    });
    console.log(name.padEnd(22), row.join('   '));
  }
}
