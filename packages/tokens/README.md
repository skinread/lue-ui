# Lue UI tokens — source

DTCG 2025.10 token source for Lue UI ([ADR-0003](../../docs/architecture/adr/0003-dtcg-tokens-with-terrazzo.md),
[token spec](../../docs/design/tokens.md)). JSON only: there is no package here yet — the workspace, `package.json`
and the Terrazzo build arrive in Pass 3.

**Don't edit these files by hand during Pass 2.** They're generated from the verified C2 · Chroma Luminous palettes:

```bash
node tools/directions/tokens.mjs && node tools/directions/check-tokens.mjs
```

`check-tokens.mjs` fails if a token lacks a `$type` or `$description`, an alias doesn't resolve, a declared contrast
pair misses its minimum in any of the four theme contexts, or body text drops below 16 px. In Pass 3 this JSON becomes
the hand-edited source and the generator retires.

| Path | Contents |
| --- | --- |
| `lue.resolver.json` | Sets and modifiers: `theme` (`dark` · `light` · `dark-more` · `light-more`, dark is primary) and `density` |
| `primitive/color.tokens.json` | Neutral ramp and the eight-hue prism (never public CSS) |
| `semantic/color.<context>.tokens.json` | Semantic colour per theme context, literal values, with contrast pairs |
| `semantic/material.<scheme>.tokens.json` | C2 materials (glass, buttons, chrome, dispersion, prism fills and ring, iridescence, metal, satin, ambient light) and shadows |
| `semantic/type.tokens.json` | Families, weights, the fluid scale (steps −2 … 5), leading, tracking, text styles |
| `semantic/dimension.tokens.json` | Space (fluid), size, radius, border, focus, layer |
| `semantic/motion.tokens.json` | Durations and easings |
| `component/components.tokens.json` | A few documented component knobs |
