# Claude Design brief

> **Status:** v0.1 · Phase 1 · 2026-10-05
> **For:** Claude Design sessions — first three visual directions, then the chosen direction codified as a Design System.
> **Art direction:** Sean Kinread. **Working name:** `never-ui` (placeholder; see [naming](../foundations/naming.md)).

## How to use this brief

- Every direction must meet the **non-negotiables** (§4). Everything else is open to exploration.
- Directions are explored on one Claude Design canvas. Comments on the canvas drive revisions; blends are welcome
  ("Loom's type with Instrument's density").
- The chosen direction is codified in Pass 2 as a Claude Design **Design System** (brand-book README, themed tokens,
  component guidelines and previews) and mirrored into the DTCG token source in this repo.

## 1. What we're designing

An **open-source design system** whose mission is to *make accessible, standards-based interfaces the path of least
resistance — by building with the web platform, not on top of it*
([mission and principles](../foundations/mission-and-principles.md)).

- **The default theme is the system's identity**, and the system is **multi-brand**: other brands are token files.
  So identity must live in **structure** — type, shape, rhythm, motion, the focus ring — not only in colour. It
  should still feel like itself after a hue swap.
- **Who builds with it:** product teams making websites and apps (commerce, content, services, tools) in any
  framework, or none.
- **Who uses what they build:** everyone — including people using screen readers, magnification, high-contrast
  modes, keyboards, switches, touch and voice.

## 2. Creative mandate

- **Original.** Not derived from, or reminiscent of, any existing design system.
- **Distinctive at a glance, calm in use.** Personality in type, shape, rhythm and one signature detail; restraint in
  everyday UI.
- **Honest materials.** The web's own materials — text, borders, outlines, flat colour, real focus rings. No fake
  depth, no glass behind text.
- **Accessibility is visible.** Focus rings, error states and target sizes are designed with the same care as the
  primary button. They're part of the brand.
- **Avoid:** blue-to-purple gradients · glass effects behind text · emoji as icons · left-border "accent" cards ·
  neon-on-black dashboards · generic SaaS heroes · default-font-plus-indigo looks · faceless stock illustration.

## 3. Personality axes

| Axis | ← | → | Loom | Instrument | Chroma |
| --- | --- | --- | --- | --- | --- |
| Temperature | warm | cool | warm | cool | neutral |
| Energy | calm | lively | calm | steady | lively |
| Shape | soft | crisp | soft | crisp | round |
| Colour | quiet | vivid | quiet | one signal | vivid |
| Type voice | editorial | functional | editorial | functional | expressive |
| Density | airy | compact | airy | compact | balanced |
| Motion | gentle | snappy | gentle | snappy | springy |

## 4. Non-negotiables

### Contrast (WCAG 2.x ratios — the gate; APCA is reported, not enforced)

| What | Minimum |
| --- | --- |
| Body text on any surface | **7:1** |
| Secondary text, links, status text | 4.5:1 |
| Text on filled controls, in every state (rest, hover, active) | 4.5:1 |
| Large text (≥ 24 px, or ≥ 18.66 px bold), UI boundaries, meaningful icons | 3:1 |
| Focus ring against every background it touches | 3:1 |
| Increased-contrast themes (Pass 2) | all text 7:1, boundaries 4.5:1 |

Filled controls either reach 3:1 against the canvas or carry a 3:1 border. Use the lightness bands in
[tokens](./tokens.md#contrast-by-construction); the appendix shows every pair for the seeded palettes.

### Never colour alone

Errors combine an icon, text and a border change. Pressed toggles show a non-colour cue. Links in running text are
underlined. Status chips always carry a word.

### Focus

`:focus-visible` outline at least 2 px with a 2 px offset — designed per direction, because it's a brand moment.
It must survive forced-colours mode (outline, not shadow).

### Targets

At least 24 × 24 CSS px everywhere; 44 × 44 on touch screens; space between small targets.

### Type

Body at least 16 px with line height ≥ 1.5 and a 45–75 character measure. No all-caps running text. Open-licensed
(SIL OFL), self-hostable variable fonts; the default Latin set ≤ 120 KB.

### Motion

Motion explains a change of state; UI transitions ≤ 320 ms; no parallax; every animation has a reduced-motion version
(instant).

### Modes

Light and dark are designed together. Forced-colours behaviour is sketched for each component: borders appear,
system colours take over.

### Buildable on the platform

The core look uses Baseline CSS only: flat colour, borders, outlines, radii, shadows, gradients, OKLCH. Extras —
`corner-shape` squircles, `text-box` trimming, Display P3 colour, scroll-driven effects — are allowed only with a
defined fallback. No visual state may need JavaScript.

### Icons

Open licence (MIT or ISC); 24 px grid; stroke weight matched to the text beside it; `currentColor`; icons that imply
direction mirror in right-to-left layouts.

## 5. What to design for each direction

1. **Foundations:** palette in light and dark with contrast labels · type specimen (display, headings 1–4, body,
   small, label, code) · spacing scale · radii · elevation · the focus ring · motion notes.
2. **Component sheet:**
   - Buttons — primary, neutral, danger, quiet; small/medium/large; rest, hover, active, focus, disabled; a pressed
     toggle; an icon-only button.
   - Field — label, hint, error message, and the error summary.
   - Checkbox, radio, switch — unchecked, checked, focus, invalid.
   - Select — closed (the open picker is an enhancement).
   - Dialog — title, body, actions.
   - Menu — open, with focus on an item.
   - Disclosure / accordion, toast, alert.
3. **One composed screen: "Checkout details".** A delivery-details form with an error summary listing two problems,
   an order-summary card with item rows, and a "Remove this item?" dialog open over it. Generic content only.

## 6. Tokens to fill

Names follow [tokens](./tokens.md). Each direction proposes values for:

- **Colour** — `bg-canvas`, `bg-surface`, `bg-surface-subtle`, `fg-default`, `fg-muted`, `border-subtle`,
  `border-strong`, `bg-accent` (+ hover, active, subtle), `fg-accent`, `fg-on-accent`, `focus-ring`, critical /
  warning / success / info (fill or text + subtle), `bg-inverse`, `fg-inverse`.
- **Type** — families; scale steps −2 … 5 with sizes at 360 px and 1280 px widths; line heights; weights.
- **Space** — `3xs … 3xl`. **Radius** — `none, xs, s, m, l, full`. **Border** — thin, thick.
- **Elevation** — `raised`, `overlay`, per scheme. **Motion** — durations and easings.
- **Focus** — width, offset, colour. **Size** — control heights (sm/md/lg), target minimum.

## 7. The three directions

Seeded palettes below are **verified**: all 36 declared pairs pass in light and dark for every direction (216 checks;
see the appendix). They are starting points, not final values.

### A. Loom — calm · tactile · warm

> Interfaces with the quiet confidence of good cloth.

- **Colour:** warm parchment neutrals (hue 80, low chroma) and a deep **spruce** accent `oklch(0.45 0.075 200)` with
  near-white text; warm charcoal in dark mode with a lighter spruce fill and dark text.
- **Type:** *Besley* for display (a sturdy, letterpress-warm Clarendon), *Atkinson Hyperlegible Next* for body,
  *Atkinson Hyperlegible Mono* for code — a body face designed for low-vision readers.
- **Shape:** radii around 6 / 10 / 16 px; 1 px warm borders; soft, warm-tinted shadows.
- **Space and density:** airy by default.
- **Motion:** gentle ease-out, 200–280 ms; short fades and small rises.
- **Signature:** a *selvedge* — a finished-edge detail on surfaces and section headers, and a fine twill texture in
  brand areas only, never behind text. The focus ring is spruce with a soft halo.
- **Icons:** Phosphor (MIT), regular weight.

### B. Instrument — precise · technical · cool

> The clarity of a well-made instrument panel.

- **Colour:** cool graphite ink on paper (hue 250) and one **signal orange** `oklch(0.70 0.19 45)` carrying near-black
  text. The orange fill sits at 2.75:1 against the canvas, so filled buttons carry a hairline ink border (the 3:1
  boundary). Hover and active states get *lighter*, raising text contrast. The focus ring is ink in light mode and
  paper in dark mode.
- **Type:** *Instrument Sans* (variable width and weight) for everything; *Martian Mono* for labels and data.
  Tabular numerals wherever numbers appear.
- **Shape:** radii 2 / 4 / 6 px; hairline borders; no shadows — edges instead, which also survive forced colours.
- **Space and density:** compact by default.
- **Motion:** snappy, 100–160 ms; no bounce.
- **Signature:** measurement ticks — fine tick-mark rules on dividers and progress — and short mono micro-labels.
- **Icons:** Tabler (MIT), 1.5 px stroke.

### C. Chroma — expressive · vivid · playful

> Colour as a material.

- **Colour:** plum-tinted neutrals (hue 320–340) and a vivid **fuchsia** accent `oklch(0.55 0.22 350)` with
  near-white text; in dark mode a lighter fuchsia with dark text, and a **lime** focus ring. Lime also appears as a
  decorative highlight (never as text).
- **Type:** *Bricolage Grotesque* for display (optical size, width and weight axes), *Figtree* for body, *Spline Sans
  Mono* for code.
- **Shape:** pill buttons; 20–24 px radius cards; squircle corners via `corner-shape` as an enhancement.
- **Space and density:** balanced.
- **Motion:** springy `linear()` easing, 240–360 ms with a small overshoot; instant under reduced motion.
- **Signature:** large flat colour fields behind section content, and display type that uses its width axis.
- **Icons:** Phosphor (MIT), bold weight.

## 8. How we'll judge

Score each direction 1–5:

1. **Principles fit** — access first, buildable on the platform.
2. **Distinctiveness** — recognisable at thumbnail size; unrelated to existing systems.
3. **Coherence** — one voice across components and modes.
4. **Re-brandability** — does the identity survive a hue swap?
5. **Legibility and comfort** — long forms, dense data.
6. **Visible accessibility** — focus, errors and targets as designed features.
7. **Dark-mode quality.**
8. **Performance** — font weight, no heavy effects.
9. **The composed screen** — does "Checkout details" feel calm, clear and trustworthy?

## 9. Process and deliverables

1. **Now:** one canvas with three direction boards — foundations, component sheet, composed screen — in light and
   dark.
2. **Art direction:** comments on the canvas; revise or blend.
3. **Pass 2:** the chosen direction becomes a Claude Design **Design System**: brand-book README, `tokens.json` with
   `light`, `dark`, `light-more` and `dark-more` themes, type, spacing, radius, shadow, component guidelines, and
   static HTML + CSS previews. Values are then mirrored into the DTCG source, and the contrast matrix must stay green.

## Appendix — seeded palettes and contrast matrices

Generated 2026-10-05 by a dependency-free script (OKLCH → sRGB → WCAG 2.x ratio; APCA Lc in brackets, advisory).
Values shown are after sRGB gamut mapping. All 216 pairs pass.

<details>
<summary><strong>A. Loom</strong> — values and contrast (light · dark)</summary>

| Token | Light | Dark |
| --- | --- | --- |
| `bg-canvas` | `oklch(0.972 0.01 80)` #f9f5ee | `oklch(0.19 0.012 70)` #17130e |
| `bg-surface` | `oklch(0.992 0.004 80)` #fefcf9 | `oklch(0.23 0.014 70)` #211c16 |
| `bg-surface-subtle` | `oklch(0.945 0.014 80)` #f2ece3 | `oklch(0.27 0.014 70)` #2b251f |
| `fg-default` | `oklch(0.26 0.018 60)` #2b221b | `oklch(0.93 0.01 80)` #ebe7e1 |
| `fg-muted` | `oklch(0.46 0.02 65)` #60564d | `oklch(0.74 0.015 75)` #b0aaa1 |
| `border-subtle` | `oklch(0.89 0.014 75)` #e0dad1 | `oklch(0.32 0.012 70)` #37322c |
| `border-strong` | `oklch(0.58 0.02 70)` #82796e | `oklch(0.58 0.015 70)` #807971 |
| `bg-accent` | `oklch(0.45 0.075 200)` #066166 | `oklch(0.74 0.09 195)` #5ebdbc |
| `bg-accent-hover` | `oklch(0.4 0.068 200)` #005256 | `oklch(0.79 0.085 195)` #74cccb |
| `bg-accent-active` | `oklch(0.36 0.061 200)` #00474a | `oklch(0.84 0.075 195)` #8fdada |
| `bg-accent-subtle` | `oklch(0.93 0.03 195)` #d2efee | `oklch(0.3 0.045 200)` #0a3537 |
| `fg-accent` | `oklch(0.45 0.075 200)` #066166 | `oklch(0.78 0.09 195)` #6bcac9 |
| `fg-on-accent` | `oklch(0.99 0.005 80)` #fefbf8 | `oklch(0.2 0.02 200)` #0a191a |
| `focus-ring` | `oklch(0.45 0.075 200)` #066166 | `oklch(0.78 0.09 195)` #6bcac9 |
| `bg-critical` | `oklch(0.5 0.165 28)` #ae2e27 | `oklch(0.7 0.15 25)` #ed756e |
| `fg-on-critical` | `oklch(0.99 0.005 80)` #fefbf8 | `oklch(0.18 0.02 25)` #1a0e0d |
| `fg-critical` | `oklch(0.48 0.16 28)` #a52a24 | `oklch(0.75 0.13 25)` #f58b84 |
| `bg-critical-subtle` | `oklch(0.95 0.025 28)` #ffe9e5 | `oklch(0.29 0.06 25)` #451e1c |
| `fg-warning` | `oklch(0.5 0.108 70)` #8a5600 | `oklch(0.82 0.12 80)` #edbb64 |
| `bg-warning-subtle` | `oklch(0.95 0.045 85)` #fcedcd | `oklch(0.3 0.05 80)` #3b2b0d |
| `fg-success` | `oklch(0.47 0.1 150)` #296a3b | `oklch(0.78 0.12 150)` #7ccd8e |
| `bg-success-subtle` | `oklch(0.95 0.035 150)` #dff6e2 | `oklch(0.29 0.05 150)` #17321e |
| `fg-info` | `oklch(0.47 0.11 250)` #215d96 | `oklch(0.78 0.09 245)` #86beee |
| `bg-info-subtle` | `oklch(0.95 0.025 250)` #e2f0ff | `oklch(0.29 0.05 245)` #142e43 |
| `bg-inverse` | `oklch(0.26 0.018 60)` #2b221b | `oklch(0.93 0.01 80)` #ebe7e1 |
| `fg-inverse` | `oklch(0.97 0.008 80)` #f8f5ef | `oklch(0.22 0.015 70)` #1f1913 |

| Pair | Min | Light | Dark |
| --- | --- | --- | --- |
| `fg-default` on `bg-canvas` | 7:1 | 14.37 (Lc 97) | 15.03 (Lc 92) |
| `fg-default` on `bg-surface` | 7:1 | 15.23 (Lc 101) | 13.76 (Lc 91) |
| `fg-default` on `bg-surface-subtle` | 7:1 | 13.26 (Lc 92) | 12.28 (Lc 90) |
| `fg-default` on `bg-accent-subtle` | 7:1 | 12.82 (Lc 89) | 10.90 (Lc 88) |
| `fg-default` on `bg-critical-subtle` | 7:1 | 13.36 (Lc 92) | 11.75 (Lc 89) |
| `fg-default` on `bg-warning-subtle` | 7:1 | 13.46 (Lc 93) | 11.15 (Lc 88) |
| `fg-default` on `bg-success-subtle` | 7:1 | 13.63 (Lc 93) | 11.27 (Lc 88) |
| `fg-default` on `bg-info-subtle` | 7:1 | 13.50 (Lc 93) | 11.43 (Lc 88) |
| `fg-muted` on `bg-canvas` | 4.5:1 | 6.60 (Lc 79) | 8.00 (Lc 56) |
| `fg-muted` on `bg-surface` | 4.5:1 | 6.99 (Lc 83) | 7.32 (Lc 55) |
| `fg-muted` on `bg-surface-subtle` | 4.5:1 | 6.09 (Lc 74) | 6.54 (Lc 53) |
| `fg-accent` on `bg-canvas` | 4.5:1 | 6.62 (Lc 79) | 9.58 (Lc 65) |
| `fg-accent` on `bg-surface` | 4.5:1 | 7.01 (Lc 83) | 8.76 (Lc 64) |
| `fg-accent` on `bg-accent-subtle` | 4.5:1 | 5.90 (Lc 71) | 6.94 (Lc 61) |
| `fg-on-accent` on `bg-accent` | 4.5:1 | 6.97 (Lc 87) | 8.11 (Lc 59) |
| `fg-on-accent` on `bg-accent-hover` | 4.5:1 | 8.67 (Lc 92) | 9.64 (Lc 67) |
| `fg-on-accent` on `bg-accent-active` | 4.5:1 | 10.27 (Lc 96) | 11.35 (Lc 76) |
| `border-strong` on `bg-canvas` | 3:1 | 3.96 (Lc 64) | 4.31 (Lc 31) |
| `border-strong` on `bg-surface` | 3:1 | 4.20 (Lc 68) | 3.94 (Lc 30) |
| `focus-ring` on `bg-canvas` | 3:1 | 6.62 (Lc 79) | 9.58 (Lc 65) |
| `focus-ring` on `bg-surface` | 3:1 | 7.01 (Lc 83) | 8.76 (Lc 64) |
| `focus-ring` on `bg-surface-subtle` | 3:1 | 6.11 (Lc 74) | 7.82 (Lc 63) |
| `fg-on-critical` on `bg-critical` | 4.5:1 | 6.34 (Lc 84) | 6.61 (Lc 49) |
| `fg-critical` on `bg-canvas` | 4.5:1 | 6.54 (Lc 78) | 7.87 (Lc 55) |
| `fg-critical` on `bg-surface` | 4.5:1 | 6.93 (Lc 82) | 7.20 (Lc 54) |
| `fg-critical` on `bg-critical-subtle` | 4.5:1 | 6.08 (Lc 73) | 6.15 (Lc 52) |
| `fg-warning` on `bg-canvas` | 4.5:1 | 5.67 (Lc 75) | 10.48 (Lc 70) |
| `fg-warning` on `bg-surface` | 4.5:1 | 6.01 (Lc 79) | 9.59 (Lc 69) |
| `fg-warning` on `bg-warning-subtle` | 4.5:1 | 5.31 (Lc 70) | 7.77 (Lc 66) |
| `fg-success` on `bg-canvas` | 4.5:1 | 6.00 (Lc 76) | 9.67 (Lc 65) |
| `fg-success` on `bg-surface` | 4.5:1 | 6.36 (Lc 80) | 8.85 (Lc 64) |
| `fg-success` on `bg-success-subtle` | 4.5:1 | 5.69 (Lc 73) | 7.25 (Lc 62) |
| `fg-info` on `bg-canvas` | 4.5:1 | 6.28 (Lc 78) | 9.32 (Lc 63) |
| `fg-info` on `bg-surface` | 4.5:1 | 6.66 (Lc 82) | 8.53 (Lc 62) |
| `fg-info` on `bg-info-subtle` | 4.5:1 | 5.90 (Lc 73) | 7.09 (Lc 60) |
| `fg-inverse` on `bg-inverse` | 7:1 | 14.29 (Lc 99) | 14.10 (Lc 90) |

</details>

<details>
<summary><strong>B. Instrument</strong> — values and contrast (light · dark)</summary>

| Token | Light | Dark |
| --- | --- | --- |
| `bg-canvas` | `oklch(0.985 0.002 250)` #f9fafb | `oklch(0.15 0.006 255)` #090b0e |
| `bg-surface` | `oklch(1 0 0)` #ffffff | `oklch(0.19 0.007 255)` #121417 |
| `bg-surface-subtle` | `oklch(0.955 0.004 250)` #eef0f3 | `oklch(0.23 0.008 255)` #1a1d21 |
| `fg-default` | `oklch(0.2 0.008 255)` #14161a | `oklch(0.94 0.004 250)` #e9ebee |
| `fg-muted` | `oklch(0.45 0.01 255)` #52565b | `oklch(0.72 0.008 250)` #a1a5a9 |
| `border-subtle` | `oklch(0.9 0.004 250)` #dcdee0 | `oklch(0.3 0.008 255)` #2b2e32 |
| `border-strong` | `oklch(0.5 0.01 255)` #5f6469 | `oklch(0.62 0.008 250)` #83878b |
| `bg-accent` | `oklch(0.7 0.19 45)` #fa6e1d | `oklch(0.72 0.18 48)` #fb7b28 |
| `bg-accent-hover` | `oklch(0.745 0.17 50)` #ff8739 | `oklch(0.77 0.15 50)` #ff9555 |
| `bg-accent-active` | `oklch(0.79 0.141 55)` #ffa05c | `oklch(0.81 0.125 55)` #ffaa6f |
| `bg-accent-subtle` | `oklch(0.95 0.029 55)` #ffeadc | `oklch(0.28 0.06 45)` #411e0d |
| `fg-accent` | `oklch(0.52 0.157 42)` #af4000 | `oklch(0.76 0.158 50)` #ff8f4b |
| `fg-on-accent` | `oklch(0.18 0.01 45)` #16100e | `oklch(0.16 0.01 45)` #110c0a |
| `focus-ring` | `oklch(0.2 0.008 255)` #14161a | `oklch(0.94 0.004 250)` #e9ebee |
| `bg-critical` | `oklch(0.5 0.19 25)` #b71824 | `oklch(0.68 0.17 25)` #ef6661 |
| `fg-on-critical` | `oklch(0.99 0 0)` #fcfcfc | `oklch(0.16 0.01 25)` #110c0b |
| `fg-critical` | `oklch(0.5 0.19 25)` #b71824 | `oklch(0.74 0.15 25)` #fb817a |
| `bg-critical-subtle` | `oklch(0.955 0.02 25)` #feebe9 | `oklch(0.27 0.06 25)` #3f1917 |
| `fg-warning` | `oklch(0.5 0.1 75)` #845a0f | `oklch(0.84 0.13 85)` #f1c45e |
| `bg-warning-subtle` | `oklch(0.955 0.05 90)` #fdefcb | `oklch(0.28 0.05 85)` #342707 |
| `fg-success` | `oklch(0.48 0.11 155)` #156f41 | `oklch(0.78 0.13 155)` #6cd092 |
| `bg-success-subtle` | `oklch(0.955 0.03 155)` #e1f7e7 | `oklch(0.27 0.05 155)` #0f2e1b |
| `fg-info` | `oklch(0.48 0.13 255)` #215da5 | `oklch(0.76 0.11 250)` #79b6f4 |
| `bg-info-subtle` | `oklch(0.955 0.02 255)` #e7f1fe | `oklch(0.27 0.05 250)` #12283e |
| `bg-inverse` | `oklch(0.2 0.008 255)` #14161a | `oklch(0.94 0.004 250)` #e9ebee |
| `fg-inverse` | `oklch(0.985 0.002 250)` #f9fafb | `oklch(0.18 0.006 255)` #101214 |

| Pair | Min | Light | Dark |
| --- | --- | --- | --- |
| `fg-default` on `bg-canvas` | 7:1 | 17.34 (Lc 102) | 16.50 (Lc 95) |
| `fg-default` on `bg-surface` | 7:1 | 18.10 (Lc 105) | 15.49 (Lc 94) |
| `fg-default` on `bg-surface-subtle` | 7:1 | 15.88 (Lc 96) | 14.17 (Lc 93) |
| `fg-default` on `bg-accent-subtle` | 7:1 | 15.55 (Lc 95) | 12.47 (Lc 91) |
| `fg-default` on `bg-critical-subtle` | 7:1 | 15.77 (Lc 95) | 12.92 (Lc 92) |
| `fg-default` on `bg-warning-subtle` | 7:1 | 15.89 (Lc 96) | 12.28 (Lc 91) |
| `fg-default` on `bg-success-subtle` | 7:1 | 16.04 (Lc 97) | 12.41 (Lc 91) |
| `fg-default` on `bg-info-subtle` | 7:1 | 15.89 (Lc 96) | 12.62 (Lc 92) |
| `fg-muted` on `bg-canvas` | 4.5:1 | 7.12 (Lc 83) | 7.94 (Lc 53) |
| `fg-muted` on `bg-surface` | 4.5:1 | 7.43 (Lc 86) | 7.45 (Lc 53) |
| `fg-muted` on `bg-surface-subtle` | 4.5:1 | 6.52 (Lc 77) | 6.81 (Lc 52) |
| `fg-accent` on `bg-canvas` | 4.5:1 | 5.66 (Lc 76) | 8.72 (Lc 58) |
| `fg-accent` on `bg-surface` | 4.5:1 | 5.91 (Lc 79) | 8.19 (Lc 57) |
| `fg-accent` on `bg-accent-subtle` | 4.5:1 | 5.07 (Lc 68) | 6.59 (Lc 55) |
| `fg-on-accent` on `bg-accent` | 4.5:1 | 6.57 (Lc 49) | 7.36 (Lc 53) |
| `fg-on-accent` on `bg-accent-hover` | 4.5:1 | 7.87 (Lc 57) | 8.96 (Lc 61) |
| `fg-on-accent` on `bg-accent-active` | 4.5:1 | 9.38 (Lc 65) | 10.42 (Lc 69) |
| `border-strong` on `bg-canvas` | 3:1 | 5.74 (Lc 77) | 5.41 (Lc 37) |
| `border-strong` on `bg-surface` | 3:1 | 6.00 (Lc 80) | 5.07 (Lc 37) |
| `focus-ring` on `bg-canvas` | 3:1 | 17.34 (Lc 102) | 16.50 (Lc 95) |
| `focus-ring` on `bg-surface` | 3:1 | 18.10 (Lc 105) | 15.49 (Lc 94) |
| `focus-ring` on `bg-surface-subtle` | 3:1 | 15.88 (Lc 96) | 14.17 (Lc 93) |
| `fg-on-critical` on `bg-critical` | 4.5:1 | 6.44 (Lc 84) | 6.25 (Lc 46) |
| `fg-critical` on `bg-canvas` | 4.5:1 | 6.35 (Lc 78) | 8.00 (Lc 54) |
| `fg-critical` on `bg-surface` | 4.5:1 | 6.63 (Lc 81) | 7.51 (Lc 53) |
| `fg-critical` on `bg-critical-subtle` | 4.5:1 | 5.78 (Lc 71) | 6.27 (Lc 51) |
| `fg-warning` on `bg-canvas` | 4.5:1 | 5.85 (Lc 77) | 11.96 (Lc 74) |
| `fg-warning` on `bg-surface` | 4.5:1 | 6.11 (Lc 80) | 11.23 (Lc 74) |
| `fg-warning` on `bg-warning-subtle` | 4.5:1 | 5.36 (Lc 71) | 8.90 (Lc 71) |
| `fg-success` on `bg-canvas` | 4.5:1 | 5.93 (Lc 77) | 10.35 (Lc 66) |
| `fg-success` on `bg-surface` | 4.5:1 | 6.19 (Lc 80) | 9.72 (Lc 66) |
| `fg-success` on `bg-success-subtle` | 4.5:1 | 5.49 (Lc 72) | 7.79 (Lc 63) |
| `fg-info` on `bg-canvas` | 4.5:1 | 6.31 (Lc 79) | 9.21 (Lc 60) |
| `fg-info` on `bg-surface` | 4.5:1 | 6.59 (Lc 82) | 8.65 (Lc 60) |
| `fg-info` on `bg-info-subtle` | 4.5:1 | 5.78 (Lc 73) | 7.05 (Lc 57) |
| `fg-inverse` on `bg-inverse` | 7:1 | 17.34 (Lc 104) | 15.78 (Lc 93) |

</details>

<details>
<summary><strong>C. Chroma</strong> — values and contrast (light · dark)</summary>

| Token | Light | Dark |
| --- | --- | --- |
| `bg-canvas` | `oklch(0.985 0.006 340)` #fdf9fb | `oklch(0.17 0.02 320)` #130d15 |
| `bg-surface` | `oklch(1 0 0)` #ffffff | `oklch(0.21 0.025 320)` #1d151f |
| `bg-surface-subtle` | `oklch(0.955 0.012 340)` #f6edf3 | `oklch(0.25 0.03 320)` #281d2b |
| `fg-default` | `oklch(0.22 0.03 320)` #211623 | `oklch(0.95 0.01 340)` #f3ecf0 |
| `fg-muted` | `oklch(0.45 0.04 320)` #5f4e63 | `oklch(0.76 0.03 330)` #bdabba |
| `border-subtle` | `oklch(0.9 0.012 340)` #e4dbe0 | `oklch(0.32 0.03 320)` #3a2e3c |
| `border-strong` | `oklch(0.55 0.03 330)` #7c6b7a | `oklch(0.62 0.03 330)` #91808f |
| `bg-accent` | `oklch(0.55 0.22 350)` #c61583 | `oklch(0.72 0.19 350)` #f86ab5 |
| `bg-accent-hover` | `oklch(0.5 0.209 350)` #b00074 | `oklch(0.77 0.162 350)` #ff85c3 |
| `bg-accent-active` | `oklch(0.46 0.19 350)` #9d0367 | `oklch(0.81 0.128 350)` #ff9ecd |
| `bg-accent-subtle` | `oklch(0.94 0.036 350)` #ffe2ee | `oklch(0.3 0.08 350)` #4a1a33 |
| `fg-accent` | `oklch(0.52 0.21 350)` #b80f79 | `oklch(0.78 0.154 350)` #ff8bc5 |
| `fg-on-accent` | `oklch(0.99 0.005 340)` #fefafd | `oklch(0.18 0.03 350)` #1b0c13 |
| `focus-ring` | `oklch(0.52 0.21 350)` #b80f79 | `oklch(0.88 0.19 125)` #bbec4c |
| `bg-critical` | `oklch(0.52 0.19 28)` #be241f | `oklch(0.7 0.17 28)` #f66e60 |
| `fg-on-critical` | `oklch(0.99 0.005 340)` #fefafd | `oklch(0.17 0.02 28)` #170c0a |
| `fg-critical` | `oklch(0.5 0.18 28)` #b3241f | `oklch(0.76 0.14 28)` #fd8c7e |
| `bg-critical-subtle` | `oklch(0.955 0.022 30)` #ffebe7 | `oklch(0.29 0.07 28)` #481b17 |
| `fg-warning` | `oklch(0.52 0.11 70)` #915c08 | `oklch(0.85 0.13 85)` #f5c761 |
| `bg-warning-subtle` | `oklch(0.955 0.057 90)` #ffefc5 | `oklch(0.29 0.05 85)` #37290a |
| `fg-success` | `oklch(0.48 0.109 160)` #007048 | `oklch(0.8 0.14 160)` #5ed99e |
| `bg-success-subtle` | `oklch(0.955 0.04 160)` #daf9e7 | `oklch(0.28 0.05 160)` #0e3020 |
| `fg-info` | `oklch(0.48 0.14 255)` #195daa | `oklch(0.78 0.11 250)` #80bdfb |
| `bg-info-subtle` | `oklch(0.955 0.022 255)` #e7f1ff | `oklch(0.28 0.05 250)` #142a41 |
| `bg-inverse` | `oklch(0.22 0.03 320)` #211623 | `oklch(0.95 0.01 340)` #f3ecf0 |
| `fg-inverse` | `oklch(0.985 0.006 340)` #fdf9fb | `oklch(0.2 0.025 320)` #1b121d |

| Pair | Min | Light | Dark |
| --- | --- | --- | --- |
| `fg-default` on `bg-canvas` | 7:1 | 16.68 (Lc 101) | 16.52 (Lc 96) |
| `fg-default` on `bg-surface` | 7:1 | 17.45 (Lc 104) | 15.35 (Lc 96) |
| `fg-default` on `bg-surface-subtle` | 7:1 | 15.24 (Lc 95) | 13.91 (Lc 94) |
| `fg-default` on `bg-accent-subtle` | 7:1 | 14.44 (Lc 92) | 12.17 (Lc 92) |
| `fg-default` on `bg-critical-subtle` | 7:1 | 15.20 (Lc 95) | 12.48 (Lc 93) |
| `fg-default` on `bg-warning-subtle` | 7:1 | 15.32 (Lc 95) | 12.19 (Lc 93) |
| `fg-default` on `bg-success-subtle` | 7:1 | 15.53 (Lc 96) | 12.32 (Lc 93) |
| `fg-default` on `bg-info-subtle` | 7:1 | 15.33 (Lc 95) | 12.54 (Lc 93) |
| `fg-muted` on `bg-canvas` | 4.5:1 | 7.25 (Lc 83) | 8.82 (Lc 59) |
| `fg-muted` on `bg-surface` | 4.5:1 | 7.58 (Lc 86) | 8.20 (Lc 58) |
| `fg-muted` on `bg-surface-subtle` | 4.5:1 | 6.62 (Lc 77) | 7.43 (Lc 57) |
| `fg-accent` on `bg-canvas` | 4.5:1 | 5.93 (Lc 76) | 8.94 (Lc 60) |
| `fg-accent` on `bg-surface` | 4.5:1 | 6.21 (Lc 79) | 8.30 (Lc 59) |
| `fg-accent` on `bg-accent-subtle` | 4.5:1 | 5.14 (Lc 66) | 6.58 (Lc 56) |
| `fg-on-accent` on `bg-accent` | 4.5:1 | 5.33 (Lc 78) | 6.96 (Lc 51) |
| `fg-on-accent` on `bg-accent-hover` | 4.5:1 | 6.56 (Lc 84) | 8.47 (Lc 60) |
| `fg-on-accent` on `bg-accent-active` | 4.5:1 | 7.71 (Lc 88) | 9.90 (Lc 67) |
| `border-strong` on `bg-canvas` | 3:1 | 4.71 (Lc 71) | 5.19 (Lc 37) |
| `border-strong` on `bg-surface` | 3:1 | 4.93 (Lc 74) | 4.83 (Lc 36) |
| `focus-ring` on `bg-canvas` | 3:1 | 5.93 (Lc 76) | 13.92 (Lc 85) |
| `focus-ring` on `bg-surface` | 3:1 | 6.21 (Lc 79) | 12.94 (Lc 84) |
| `focus-ring` on `bg-surface-subtle` | 3:1 | 5.42 (Lc 70) | 11.72 (Lc 83) |
| `fg-on-critical` on `bg-critical` | 4.5:1 | 5.89 (Lc 81) | 6.67 (Lc 49) |
| `fg-critical` on `bg-canvas` | 4.5:1 | 6.29 (Lc 78) | 8.44 (Lc 57) |
| `fg-critical` on `bg-surface` | 4.5:1 | 6.58 (Lc 81) | 7.85 (Lc 57) |
| `fg-critical` on `bg-critical-subtle` | 4.5:1 | 5.73 (Lc 72) | 6.38 (Lc 54) |
| `fg-warning` on `bg-canvas` | 4.5:1 | 5.40 (Lc 75) | 12.06 (Lc 76) |
| `fg-warning` on `bg-surface` | 4.5:1 | 5.65 (Lc 78) | 11.20 (Lc 75) |
| `fg-warning` on `bg-warning-subtle` | 4.5:1 | 4.96 (Lc 69) | 8.90 (Lc 72) |
| `fg-success` on `bg-canvas` | 4.5:1 | 5.91 (Lc 77) | 10.87 (Lc 70) |
| `fg-success` on `bg-surface` | 4.5:1 | 6.18 (Lc 80) | 10.10 (Lc 70) |
| `fg-success` on `bg-success-subtle` | 4.5:1 | 5.50 (Lc 72) | 8.11 (Lc 67) |
| `fg-info` on `bg-canvas` | 4.5:1 | 6.31 (Lc 79) | 9.64 (Lc 64) |
| `fg-info` on `bg-surface` | 4.5:1 | 6.60 (Lc 82) | 8.96 (Lc 63) |
| `fg-info` on `bg-info-subtle` | 4.5:1 | 5.80 (Lc 73) | 7.32 (Lc 60) |
| `fg-inverse` on `bg-inverse` | 7:1 | 16.68 (Lc 103) | 15.68 (Lc 95) |

</details>
