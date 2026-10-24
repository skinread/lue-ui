# Lue UI tokens

DTCG 2025.10 token source for Lue UI, built with Terrazzo ([ADR-0003](../../docs/architecture/adr/0003-dtcg-tokens-with-terrazzo.md),
[token spec](../../docs/design/tokens.md)). The package (`@lue-ui/tokens`) is private for now.

**`src/` is the source of truth and is edited by hand** (since 2026-10-24). It was generated in Pass 2 by
`tools/directions/tokens.mjs`, which is now retired.

```bash
pnpm --filter @lue-ui/tokens build   # or: pnpm check-tokens (adds the Pass 2 material rules)
```

## Outputs (`dist/`, not committed)

| File | Contents |
| --- | --- |
| `tokens.css` | `@layer lue.tokens`, minified by Lightning CSS with no targets. Dark on `:root`; light, `dark-more` and `light-more` follow the OS (`prefers-color-scheme`, `prefers-contrast`) unless an element sets `data-theme`; `data-contrast="more"` raises contrast within a set theme; `data-density` sets density. Durations are `0s` under reduced motion, and the target minimum is 44 px under a coarse pointer. Budget: 6 KB Brotli (fails the build) |
| `tailwind.css` | The Tailwind v4 bridge: `@theme inline` names that point at our variables (`bg-surface`, `text-fg`, `text-fg-muted`, `border-border-strong`, `rounded-l`, `p-m`, `shadow-raised`, `font-display`, `text-heading-1`), so utilities follow `data-theme` |
| `tokens.js`, `tokens.d.ts` | `tokens` (every public token as `var(--lue-…)`, typed by `TokenName`), `themes`, and `values` (literals per theme context; fluid sizes at 1280 px, rem as px) |
| `figma/<context>.tokens.json` | One DTCG file per theme context, aliases resolved, to import as Figma variable modes (colour, dimension, number, font family and weight, duration) |
| `claude-design/tokens.json` | The list shape the Claude Design System reads ([outputs](../../docs/design/tokens.md#outputs)): literal values only, per theme where they vary, fluid sizes at 1280 px |

`tokens.css` starts with the layer order for everything Lue ships
(`@layer lue.reset, lue.tokens, lue.base, lue.layout, lue.components, lue.blocks, lue.materials, lue.contrast, lue.utilities;`)
and ends with `src/theme.css`: the CSS compositions of material tokens (glass and button filters, chrome and prism
gradients, layered button depth, beads) that components use, declared on every themed element so a subtree recomputes
them.

## The build fails when

- a declared contrast pair (`$extensions.lue.pairs`) misses its minimum in any of the four theme contexts — raised to
  7:1 for text and 4.5:1 for boundaries in the `-more` contexts (`plugins/lue.js`, `lue-contrast`);
- a token has no `$description`, or body text drops below 16 px (`lue-schema`);
- `tokens.css` passes its size budget (`scripts/finish.js`);
- a material rule fails (`plugins/materials.js`, `lue-materials`, 78 rules): text and boundaries on overlay and modal
  glass over white, black and every fill (through the scrim, reading the backdrop filter both ways), on neutral,
  prism (up to three overlapping tones), danger and pressed glass buttons, on ambient light (single and overlapping),
  satin and metal; the chrome ring, its dispersion band and the multi-tone ring as boundaries; marks on the
  multi-tone fills, with gradient midpoints. In the `-more` contexts glass and buttons are opaque (CSS), so only the
  fills are checked there, at 7:1.

The `-more` contexts layer `material.<context>.tokens.json` (deeper multi-tone fills and the switch bead) over their
scheme's materials.

## Extensions

`$extensions.lue` carries what DTCG can't express yet; `terrazzo.config.js` turns it into CSS:

| Key | Meaning | CSS |
| --- | --- | --- |
| `fluid` | The minimum size and viewport range of a fluid dimension | `clamp(min, rem + vi, max)` |
| `unit` | `em` or `ch` for a number | `-0.035em`, `66ch` |
| `css` | An easing the `cubicBezier` type can't hold | `linear(…)` as written |
| `letterSpacingEm`, `textTransform` | On text styles | The style's `letter-spacing` and `text-transform` |
| `coarse` | The target minimum under `(any-pointer: coarse)` | Added by `scripts/finish.js` |
| `pairs` | Contrast pairs `{ on, min }` | Checked, not emitted |

## Source

| Path | Contents |
| --- | --- |
| `lue.resolver.json` | Sets and modifiers: `theme` (`dark` · `light` · `dark-more` · `light-more`, dark is primary) and `density` |
| `primitive/color.tokens.json` | Neutral ramp and the eight-hue prism (never public CSS) |
| `semantic/color.<context>.tokens.json` | Semantic colour per theme context, literal values, with contrast pairs |
| `semantic/material.<scheme>-more.tokens.json` | The `-more` overrides: multi-tone fills and the switch bead |
| `semantic/material.<scheme>.tokens.json` | C2 materials (glass, buttons and their rims, chrome, dispersion, prism fills and ring, iridescence, metal and tile rims, satin, ambient light, field, focus glow, beads, the glass prism) and shadows |
| `theme.css` | CSS compositions of the material tokens, appended to `tokens.css` |
| `semantic/type.tokens.json` | Families, weights, the fluid scale (steps −2 … 5), leading, tracking, text styles |
| `semantic/dimension.tokens.json` | Space (fluid), size, radius, border, focus, layer |
| `semantic/motion.tokens.json` | Durations and easings |
| `component/components.tokens.json` | A few documented component knobs |
