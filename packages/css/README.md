# Lue UI CSS

Native component CSS for Lue UI, everything in `@layer lue` ([RFC-0001 §2](../../docs/architecture/rfc-0001-architecture.md#2-css-architecture)).
The package (`@lue-ui/css`) is private for now.

```css
@import "@lue-ui/tokens/tokens.css";
@import "@lue-ui/css";
```

Component files assume only the tokens (`tokens.css` also carries the theme compositions — filters, gradients, layered
shadows — in `@layer lue.tokens`). Every built file starts with the full layer order, so the order you load files in
never changes which rules win:

```css
@layer lue.reset, lue.tokens, lue.base, lue.layout, lue.components, lue.blocks, lue.materials, lue.contrast, lue.utilities;
```

## Build

`pnpm --filter @lue-ui/css build` — Lightning CSS with **no targets**, so nothing is lowered or rewritten
([ADR-0002](../../docs/architecture/adr/0002-native-css-core-tailwind-bridge.md)). It fails when a component passes
1.5 KB Brotli or `lue.css` passes 30 KB.

| `dist/` | Source |
| --- | --- |
| `lue.css` | Everything below, bundled |
| `base.css` | Element defaults (opt-in) |
| `components/*.css` | One file per component: button, field, dialog, menu, alert, toast, tag, disclosure, steps, breadcrumb, pagination, card, and the shared chrome ring |
| `blocks.css` | Portfolio and editorial blocks |
| `materials.css` | Glass, ambient light, satin, metal tiles, chrome text |
| `contrast.css` | Increased contrast, reduced transparency, no `backdrop-filter`, forced colours, reduced motion |

## Where it came from

Moved on 2026-10-24 (Spike B) from the Claude Design System's seed, `tools/directions/design-system/components.css`,
which stays as the private system's copy. Dialog and menu are Spike A's versions. The move fixed the lint findings
(`vw` → `vi`, `overflow-x` → `overflow-inline`) and turned the seed's per-scheme literals into material tokens.

Still to do as each component is built: per-component forced-colours and contrast styles instead of one
`contrast.css`; `--lue-angle` animated on the pseudo-element with `inherits: false`; a `reset.css`.
