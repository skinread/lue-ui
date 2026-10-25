# Token specification

> **Status:** v0.2 · Pass 2 · 2026-10-05 - values filled for C2 · Chroma Luminous in [`packages/tokens/src`](../../packages/tokens/README.md)
> **Decision:** [ADR-0003](../architecture/adr/0003-dtcg-tokens-with-terrazzo.md) · **Architecture:**
> [RFC-0001 §3](../architecture/rfc-0001-architecture.md#3-tokens-and-theming)
> Names use the prefix `lue` ([ADR-0008](../architecture/adr/0008-name-lue-ui.md)). Values are chosen in Claude Design (Pass 2); this page fixes the *structure*.

## Rules that shape everything below

1. **The DTCG 2025.10 JSON is the source of truth.** CSS, TypeScript, the Tailwind bridge, Claude Design's
   `tokens.json` and Figma files are generated from it.
2. **Every token has a `$description`** that says when to use it. A token without a usage note doesn't ship.
3. **Every theming context gets literal values.** No `light-dark()`, `color-mix()` or `var()` chains inside colour
   tokens; no `@property` registration of themeable colours.
4. **Every foreground/background pair is declared** and contrast-tested in every context.
5. **Primitives are private.** Only semantic tokens (and a few component knobs) become public CSS.

## Source layout

```
packages/tokens/src/
├── primitive/
│   └── color.tokens.json              # neutral ramp + eight-hue prism - never public CSS
├── semantic/                          # the public CSS API
│   ├── color.dark.tokens.json         # one file per theme context, literal values, contrast pairs
│   ├── color.light.tokens.json
│   ├── color.dark-more.tokens.json
│   ├── color.light-more.tokens.json
│   ├── material.dark.tokens.json      # C2 materials and shadows, per scheme
│   ├── material.light.tokens.json
│   ├── type.tokens.json  dimension.tokens.json  motion.tokens.json
├── component/
│   └── components.tokens.json         # a few documented knobs
└── lue.resolver.json                  # DTCG resolver: theme (4 contexts) × density
```

Generated in Pass 2 by `tools/directions/tokens.mjs`; hand-edited from Pass 3 (2026-10-24) and built by Terrazzo, whose
build fails on any contrast pair below its minimum (see the [package README](../../packages/tokens/README.md)). Raw scales for type and space live directly in the semantic files,
because they're fluid and have no separate primitive step.

**Resolver.** DTCG 2025.10 modifiers are independent, but colour depends on scheme *and* contrast together, so one
`theme` modifier carries four contexts - `dark` (default), `light`, `dark-more`, `light-more` - each pulling its scheme's
material file and its own colour file. `density` is a second modifier. A `brand` modifier will join them when there's a
second brand.

**Extensions.** `$extensions.lue` carries what DTCG can't express yet: `pairs` (contrast pairs, below), `fluid` (the
360 px size of a fluid dimension, for the `clamp()` the build emits), `unit: "em"` / `"ch"` for numbers that are
relative lengths, `letterSpacingEm` and `fontVariationSettings` on text styles, `coarse` (the 44 px target), and `css`
(a preferred CSS value such as a `linear()` easing).

A token in the source:

```json
{
  "color": {
    "fg": {
      "default": {
        "$type": "color",
        "$value": { "colorSpace": "oklch", "components": [0.24, 0.012, 250] },
        "$description": "Body text and icons on canvas and surface.",
        "$extensions": {
          "lue": { "pairs": [{ "on": "{color.bg.canvas}", "min": 7 }, { "on": "{color.bg.surface}", "min": 7 }] }
        }
      }
    }
  }
}
```

## Tiers

| Tier | Example | Public? | Purpose |
| --- | --- | --- | --- |
| Primitive | `color.neutral.24`, `dimension.4` | No (JSON/TS only) | The palette and raw scales a theme draws from |
| Semantic | `--lue-color-fg-default` | **Yes - the CSS API** | Meaning: what a value is *for* |
| Component | `--lue-button-radius` | Yes, few | Documented knobs for one component, defaulting to semantic tokens |

## Naming

```
--lue-{category}-{property}-{role}[-{emphasis}][-{state}]
```

| Slot | Values |
| --- | --- |
| category | `color`, `space`, `size`, `radius`, `border`, `shadow`, `font`, `text`, `motion`, `focus`, `material` |
| property (colour) | `bg`, `fg`, `border`, `focus`, `overlay` |
| role | `canvas`, `surface`, `default`, `muted`, `accent`, `critical`, `warning`, `success`, `info`, `neutral`, `inverse`, `on-{role}` |
| emphasis | `subtle`, *(default)*, `strong` |
| state | `hover`, `active`, `selected`, `disabled` |

Component knobs: `--lue-{component}-{property}[-{variant}]`, e.g. `--lue-button-radius`, `--lue-dialog-max-inline-size`.

## Colour

### Model

- **Primitives are OKLCH ramps** whose step names are their perceptual lightness × 100 (`neutral.98`, `neutral.24`,
  `accent.56`). The name tells you, approximately, what it will contrast with.
- **Hue-matched neutrals:** neutrals carry a little chroma from the brand hue so surfaces feel related to the accent.
- **Gamut:** values are authored in OKLCH and gamut-mapped to sRGB for the default output; a Display P3 variant is
  emitted inside `@media (color-gamut: p3)` when chroma would otherwise be clipped.

### Contrast by construction

For neutral colours, WCAG 2.x contrast is fixed by OKLab lightness alone (relative luminance = L³). That gives
designers lightness **bands** that guarantee a ratio before any checking:

| Background | 7:1 (body text) | 4.5:1 (secondary text) | 3:1 (UI, large text, focus) |
| --- | --- | --- | --- |
| Light canvas, L 0.99 | text L ≤ 0.457 | ≤ 0.561 | ≤ 0.662 |
| Light surface, L 0.97 | ≤ 0.444 | ≤ 0.547 | ≤ 0.647 |
| Dark canvas, L 0.16 | text L ≥ 0.690 | ≥ 0.578 | ≥ 0.482 |
| Dark surface, L 0.21 | ≥ 0.715 | ≥ 0.601 | ≥ 0.504 |

Saturated hues drift from these bands (an OKLCH blue at L 0.55 reaches 5.0:1 on white, where a neutral at L 0.561
reaches exactly 4.5:1), so **the bands guide design; the contrast matrix is the gate.**

### Semantic colour roles

| Token | Use | Must contrast with | Minimum |
| --- | --- | --- | --- |
| `bg-canvas` | Page background | - | - |
| `bg-surface` | Cards, menus, dialogs, popovers | - | - |
| `bg-surface-subtle` | Wells, input fills, table stripes | - | - |
| `bg-accent` (+ `-hover`, `-active`) | Primary actions, selected states | `fg-on-accent` | 4.5:1 |
| `bg-accent-subtle` | Accent tints behind text | `fg-default`, `fg-accent` | 7:1 · 4.5:1 |
| `bg-critical` · `bg-critical-subtle` | Destructive actions · error backgrounds | `fg-on-critical` · `fg-critical` | 4.5:1 |
| `bg-warning-subtle`, `bg-success-subtle`, `bg-info-subtle` | Status backgrounds | `fg-default` and the matching `fg-{role}` | 7:1 · 4.5:1 |
| `bg-inverse` | Toasts, tooltips | `fg-inverse` | 7:1 |
| `overlay-scrim` | Dialog `::backdrop` | - | - |
| `fg-default` | Body text, icons | `bg-canvas`, `bg-surface`, `bg-surface-subtle` | **7:1** |
| `fg-muted` | Secondary text, hints | `bg-canvas`, `bg-surface` | 4.5:1 |
| `fg-accent` | Links, accent text | `bg-canvas`, `bg-surface` | 4.5:1 |
| `fg-critical`, `fg-warning`, `fg-success`, `fg-info` | Status text and icons | `bg-canvas`, `bg-surface`, matching `-subtle` | 4.5:1 |
| `fg-on-accent`, `fg-on-critical` | Text on filled backgrounds | the filled background in every state | 4.5:1 |
| `fg-disabled` | Disabled labels | `bg-canvas`, `bg-surface` | 3:1 (advisory - WCAG exempts inactive controls, we don't hide them) |
| `border-subtle` | Decorative dividers | - | - (decorative) |
| `border-strong` | Boundaries that identify a control (inputs, checkboxes) | `bg-canvas`, `bg-surface` | 3:1 |
| `border-critical` | Invalid field boundary | `bg-canvas`, `bg-surface` | 3:1 |
| `focus-ring` | `:focus-visible` outline | every background it can sit on | 3:1 |

Increased-contrast contexts (`light-more`, `dark-more`) lift every text pair to ≥ 7:1 and every boundary to ≥ 4.5:1.

### Forced colours

Components switch to system colours under `@media (forced-colors: active)`; the mapping is fixed so behaviour is
predictable:

| Role | System colour |
| --- | --- |
| `bg-canvas`, `bg-surface` | `Canvas` |
| `fg-default`, `fg-muted` | `CanvasText` |
| Links | `LinkText` |
| Buttons | `ButtonFace` / `ButtonText` / `ButtonBorder` |
| Selected, checked, pressed | `SelectedItem` / `SelectedItemText` |
| Focus ring | `Highlight` (outline, never box-shadow) |
| Disabled | `GrayText` |
| Shadows, tints | Removed - components carry **transparent borders** that become visible |

## Theming axes

| Axis | Values | How it's set | Scope |
| --- | --- | --- | --- |
| Brand | `default` (+ future brands) | `[data-brand="…"]` | Any subtree |
| Scheme | `dark` (primary), `light` | `[data-scheme]`; otherwise `prefers-color-scheme`; always sets `color-scheme` | Any subtree ("scheme islands") |
| Contrast | `standard`, `more` | `[data-contrast]` on the root; otherwise `prefers-contrast: more` | Root |
| Density | `compact`, `default`, `comfortable` | `[data-density]` → `--lue-density` 0.75 / 1 / 1.25 | Any subtree |
| Motion | `standard`, `reduced` | `prefers-reduced-motion` | Root |

The generator emits the cross-product of brand × scheme × contrast for colour (four colour contexts per brand),
**writing only the tokens that differ** in each block. **Dark is Lue UI's primary scheme** (2026-10-05): `:root` carries
dark values and light applies under `prefers-color-scheme: light` or `[data-scheme="light"]`, so the user's OS
preference still wins. Design tools list dark first. (The example below shows the general shape.)

```css
@layer lue.tokens {
  :root, [data-scheme="light"] { color-scheme: light; --lue-color-fg-default: oklch(0.24 0.012 250); /* … */ }
  [data-scheme="dark"] { color-scheme: dark; --lue-color-fg-default: oklch(0.93 0.008 250); /* … */ }
  @media (prefers-color-scheme: dark) {
    :root:not([data-scheme]) { color-scheme: dark; /* dark values */ }
  }
  :root[data-contrast="more"] { /* light-more values */ }
  :root[data-contrast="more"] [data-scheme="dark"], :root[data-contrast="more"][data-scheme="dark"] { /* dark-more */ }
  @media (prefers-contrast: more) { :root:not([data-contrast]) { /* light-more values */ } /* … */ }
  [data-density="compact"] { --lue-density: 0.75; }
  [data-density="comfortable"] { --lue-density: 1.25; }
}
```

## Materials (C2 · Chroma Luminous)

Lue UI's look needs tokens a flat palette can't express. They're **decoration with an opaque fallback** - glass turns
opaque, chrome becomes `border-strong`, satin and ambient light switch off under `prefers-reduced-transparency`,
`prefers-contrast: more`, `[data-contrast="more"]` or without `backdrop-filter`, and forced colours removes them.

| Token group | Type | What it is |
| --- | --- | --- |
| `material.glass.{overlay, modal}` · `.blur` `.saturate` `.contrast` `.brightness` `.sheen` | color (alpha), dimension, number | Glass tints and the backdrop filter that compresses the range behind them |
| `material.button.{tint, prism-base, prism-base-active, danger, pressed}` + filter numbers | color, dimension, number | Glass buttons |
| `material.iridescence.1…5` | color (alpha) | The five prism tones that drift inside a primary button |
| `material.chrome` · `material.dispersion` | gradient | The 1 px chrome ring as conic stops (position = turn), with the dispersion band at its lower edge |
| `material.prism-fill` · `-active` · `material.prism-ring` | gradient | Multi-tone fills for small controls, and the ring for selected and on states |
| `material.metal` · `material.satin.0…5` · `material.ambient.<hue>` | gradient, color | Liquid-metal tiles, satin folds, ambient prism light |
| `material.bead-on` · `material.spark` | color | Switch thumb when on; specks of light on primaries |
| `shadow.{raised, overlay, control, fringe}` · `shadow.glow.{rest, hover, soft, critical}` | shadow | Depth, the prism fringe (inset) and diffuse glows |

Every material that text or a boundary depends on has a worst-case rule in `tools/directions/palettes.mjs` (glass over
white, black and every fill; tones up to three deep; satin folds; ambient light doubled) - 86 rules, all passing on
2026-10-05. They move into the Pass 3 contrast gate.

## Space and density

- **Fluid space scale** in `rem` with a small viewport-relative term (never pure viewport units):
  `3xs · 2xs · xs · s · m · l · xl · 2xl · 3xl` - multiples 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6 of the base step, which
  is **16 px at 360 and 18 px at 1280** (so `m` runs 24 → 27 px, `3xl` 96 → 108 px).
- **One-up pairs** (`s-m`, `m-l`, …) interpolate between neighbouring steps for gaps that should grow with space.
- **Density** multiplies a component's *internal* padding and gaps only:
  `padding-block: calc(var(--lue-space-xs) * var(--lue-density));`. It never scales type and never shrinks a target
  below the minimum.
- `--lue-density` is registered as `<number>` (inherits, initial `1`) so a bad value falls back safely.

## Size and targets

| Token | Value | Rule |
| --- | --- | --- |
| `--lue-size-target-min` | `24px`; `44px` under `(any-pointer: coarse)` | Every interactive element: `min-block-size` and `min-inline-size` ≥ this |
| `--lue-size-control-sm/md/lg` | chosen in Claude Design | Control heights, always `max()`-ed with the target minimum |
| `--lue-size-icon-sm/md/lg` | in `cap`/`em` units | Icons scale with the text they sit beside |

## Typography

- **Fonts:** open-licensed (SIL OFL) variable fonts, self-hosted as subset `woff2`. Fallback stacks use metric
  overrides (`size-adjust`, `ascent-override`) and `font-size-adjust` to avoid layout shift.
- **Families:** `--lue-font-family-body`, `--lue-font-family-display`, `--lue-font-family-mono`.
- **Fluid type scale:** steps `-2 … 5`, body at step `0` with a **minimum of 1rem (16px)**; sizes are
  `clamp(min-rem, rem + viewport term, max-rem)` at page level and may use `cqi` inside components. C2 values (px at
  360 → 1280):

  | Step | −2 | −1 | 0 | 1 | 2 | 3 | 4 | 5 |
  | --- | --- | --- | --- | --- | --- | --- | --- | --- |
  | Size | 12 → 12 | 14 → 15 | 16 → 17 | 17 → 18 | 19 → 23 | 23 → 30 | 28 → 44 | 42 → 80 |
  | Use | micro-label | small | body | heading 4 | heading 3 | heading 2 | heading 1 | display |

  Steps 1–5 are set for Epilogue (×0.95 of the first proposal).

- **C2 families:** Epilogue (display and headings, light 300 for display), Figtree (body), Spline Sans Mono
  (code and uppercase micro-labels tracked 0.16 em). Display tracking −0.035 em, headings −0.02 em.
- **Line height:** body ≥ 1.5; headings 1.1–1.25; expressed unitless.
- **Measure:** `--lue-measure: 66ch` for running text.
- **Text styles** are DTCG composite `typography` tokens: `display`, `heading-1…4`, `body`, `body-sm`, `label`,
  `caption`, `code`. `base.css` applies them to elements; `.lue-text-{style}` classes live in the utilities layer.
- `text-wrap: balance` on headings; `text-wrap: pretty` and `text-box` trim as progressive enhancement.

## Radius, border and elevation

- **Radius:** `--lue-radius-{none, xs, s, m, l, full}` plus component knobs (`--lue-button-radius`).
- **Border width:** `--lue-border-width-thin` (1px), `--lue-border-width-thick` (2px).
- **Elevation:** `--lue-shadow-{raised, overlay}`, defined per scheme (dark schemes lean on surface lightness rather
  than shadow). Every elevated component also has a **transparent border** so it keeps an edge in forced colours.
- **No z-index scale.** Overlays use the top layer; the only stacking token is `--lue-layer-sticky` for sticky page
  furniture.

## Motion

| Token | Default | Under `prefers-reduced-motion: reduce` |
| --- | --- | --- |
| `--lue-motion-duration-fast` | ~120 ms | `0s` |
| `--lue-motion-duration-moderate` | ~200 ms | `0s` |
| `--lue-motion-duration-slow` | ~320 ms | `0s` |
| `--lue-motion-ease-standard`, `-enter`, `-exit` | cubic-bezier curves | unchanged |
| `--lue-motion-ease-spring` | `linear()` spring | unchanged |

Transforms used for motion are removed under reduced motion. Exact values are chosen with the visual direction.

## Focus

| Token | Value |
| --- | --- |
| `--lue-focus-width` | `2px` (minimum; may be larger) |
| `--lue-focus-offset` | `2px` |
| `--lue-color-focus-ring` | per context, ≥ 3:1 against every background it can sit on |

Rendered as `outline` on `:focus-visible` (an optional halo uses `box-shadow` and is dropped in forced colours).

## Outputs

| Output | Shape | Consumer |
| --- | --- | --- |
| `tokens.css` | `@layer lue.tokens` blocks per context, literal values | Everyone |
| `tokens.js` + `.d.ts` | Token names → `var(--lue-…)` strings, plus resolved values per context | TypeScript, React adapters, tests |
| `tailwind.css` | `@theme inline { --color-surface: var(--lue-color-bg-surface); … }` | Tailwind v4 users (utilities follow subtree theming because they reference our variables) |
| `claude-design/tokens.json` | **List shape**: `color.themes` = `dark`, `light`, `dark-more`, `light-more` (primary first); each token `{ name, value: { light, dark, … }, usage }` with literal `oklch()` values; `type.groups` with px/rem sizes at a reference width (fluid range noted in usage); `spacing`, `radius`, `shadow` as `{ tokens: [...] }` | The Claude Design system |
| `figma/*.tokens.json` | DTCG, one mode per context | Figma variables |

Claude Design token names flatten our names (`color-bg-canvas`), stay within `[A-Za-z0-9][A-Za-z0-9_.-]{0,63}` and
are unique across families. Values it can't read (`clamp()`, `var()`, `color-mix()`) are resolved before export.

## Contrast matrix (CI gate)

For **every brand × scheme × contrast context**, for **every declared pair**, the WCAG 2.x ratio must meet the pair's
`min`. APCA Lc is computed and reported, not enforced. The build fails on any miss and prints the failing pair, the
context and both values. Pairs also cover the focus ring against each surface, and filled backgrounds in each state
(`bg-accent-hover` with `fg-on-accent`).
