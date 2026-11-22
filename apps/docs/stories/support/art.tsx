// Decorative art for the block stories: satin folds, a glass prism and a few 16 px glyphs. All aria-hidden; the
// colours are the material tokens, so they follow the theme and switch off under increased contrast.
import type { ReactNode } from 'react';
import { Icon } from '@lue-ui/react';

/** Folds of satin light behind a hero (`.lue-satin`). */
export const Satin = (): ReactNode => (
  <svg className="lue-satin" aria-hidden="true" viewBox="0 0 1440 720" preserveAspectRatio="none" focusable="false">
    <path d="M0 520 C 320 380 620 640 980 470 S 1320 360 1440 420 L1440 720 L0 720 Z" style={{ fill: 'var(--lue-material-satin-1)' }} />
    <path d="M0 260 C 360 120 640 360 1000 220 S 1300 120 1440 180 L1440 0 L0 0 Z" style={{ fill: 'var(--lue-material-satin-2)' }} />
    <path d="M0 600 C 420 470 700 700 1080 560 S 1360 500 1440 540 L1440 720 L0 720 Z" style={{ fill: 'var(--lue-material-satin-3)' }} />
    <path d="M0 520 C 320 380 620 640 980 470 S 1320 360 1440 420" fill="none" strokeWidth="3" style={{ stroke: 'var(--lue-material-satin-5)', opacity: 0.7 }} />
  </svg>
);

/** A glass prism, the hero's object (`.lue-prism`). */
export const Prism = (): ReactNode => (
  <svg className="lue-prism" aria-hidden="true" viewBox="0 0 400 360" focusable="false">
    <ellipse cx="200" cy="334" rx="150" ry="14" style={{ fill: 'var(--lue-prism-shadow)' }} />
    <path d="M200 30 L360 310 L40 310 Z" style={{ fill: 'var(--lue-prism-glass-top)' }} />
    <path d="M200 30 L360 310 L200 250 Z" style={{ fill: 'var(--lue-prism-glass-bottom)' }} />
    <path d="M200 30 L360 310 L40 310 Z" fill="none" strokeWidth="6" strokeLinejoin="round" style={{ stroke: 'var(--lue-prism-ring)' }} />
  </svg>
);

const GLYPHS: Record<string, ReactNode> = {
  triangle: <path d="M8 2.5 14 13H2Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  stack: <path d="M8 2 14 5 8 8 2 5Z M2 8l6 3 6-3 M2 11l6 3 6-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  window: <path d="M2 3h12v10H2Z M2 6h12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  code: <path d="M5 4 1.5 8 5 12 M11 4l3.5 4-3.5 4 M9.5 2.5l-3 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  person: <path d="M8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z M2.5 7.5 8 8.5l5.5-1 M8 8.5v2.5L5.5 14 M8 11l2.5 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  sparkle: <path d="M8 1.5 9.5 6.5 14.5 8 9.5 9.5 8 14.5 6.5 9.5 1.5 8 6.5 6.5Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
};

/** A decorative 16 px glyph, for an icon tile. */
export const Glyph = ({ name }: { name: keyof typeof GLYPHS | string }): ReactNode => <Icon>{GLYPHS[name]}</Icon>;
