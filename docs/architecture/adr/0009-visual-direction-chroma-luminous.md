# ADR-0009: Visual direction - C2 · Chroma Luminous

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** 1 accessible by construction · 11 distinctive, not decorative · 5 respect personal settings ·
  8 Baseline-anchored (enhancements behind `@supports`)

## Context

Phase 1 seeded three directions on the Claude Design canvas: A · Loom, B · Instrument and C · Chroma. The user chose
Chroma and art-directed four rounds on 2026-10-05:

1. **Luminous and luxurious:** chrome-silver hairline outlines, liquid-glass depth, colour that dances on
   interaction, subtle glow, and a subdued prismatic-neon palette.
2. **Glass buttons and softer light:** buttons frosted and more transparent, primaries multi-tone rather than a
   rose → azure gradient, and the ambient rainbow more diffuse.
3. **Metal and light:** the material qualities of polished metal and thick glass from reference images, and a shift of
   the composed screens from commerce to portfolio and editorial sites.
4. **Details:** multi-tone small controls, dark as the default, Phosphor regular, the wider neon spectrum parked, and -
   after a trial of wider faces (Anybody, Archivo, Unbounded) that lacked personality - Bricolage Grotesque for
   headings. On 2026-10-10 the user found Bricolage's *f* hard to read, compared four similar faces on the canvas and
   chose **Epilogue**.

The brief's earlier mandate ("no fake depth, no glass behind text") conflicted with round 1, so it was revised to allow
glass only where it's verified.

## Decision

Lue UI's visual identity is **C2 · Chroma Luminous** - *light, caught in chrome and glass*. Colour appears as light,
never as paint. The full description is in the [brief](../../design/claude-design-brief.md#c2-chroma-luminous--luminous--luxurious--prismatic);
the values live in `tools/directions/palettes.mjs` until the token pipeline exists.

| Element | Decision |
| --- | --- |
| Schemes | **Dark (obsidian) is primary**, light (pearl) second; neutrals at hue 285–290. OS preference still wins. |
| Palette | An eight-hue **prism** - rose, orchid, iris, azure, aqua, mint, citron, amber - at subdued-neon chroma. |
| Chrome | A 1 px conic-gradient hairline on controls and surfaces (gunmetal on pearl, silver on obsidian) with a short dispersion band at its lower edge; its reflection turns on hover and focus. Selected and on states trade chrome for a **multi-tone ring**. |
| Glass | Two tiers - overlay (menus, popovers, cards, bars) and modal (dialogs) - plus glass buttons: tint over a blurred, range-compressed backdrop, a faint sheen, a prism fringe. |
| Buttons | Frosted glass. Primaries carry five prism tones at one lightness that drift on hover; light pools at the lower edge. |
| Small controls | Multi-tone fills at one lightness: pastel with obsidian marks in light, jewel with pearl marks in dark. |
| Materials | Liquid-metal icon tiles and avatars, satin folds behind heroes, a glass prism and orb as hero objects, diffuse warm-to-cool ambient light. |
| Type | **Epilogue** (light 300 for display, set at 0.95 of the scale) for display and headings · **Figtree** for body · **Spline Sans Mono** for uppercase micro-labels and code. All SIL OFL. |
| Icons | **Phosphor**, regular weight (MIT). |
| Shape | Pills for buttons, tags and toasts; radii 8 / 12 / 20 / 28 px; squircle corners via `corner-shape` as an enhancement. |
| Motion | 320 ms ease-out, on interaction only: tones drift, chrome glints, glow rises, sparks drift along primaries. Nothing loops; reduced motion is instant. |
| Accessibility | Every glass, chrome, prism, satin and metal rule is contrast-checked against its worst case (76 rules, all passing on 2026-10-05). Glass turns opaque under reduced transparency, more contrast or no `backdrop-filter`; forced colours removes the decoration. |

**Future exploration** (not decided): a wider neon spectrum in Display P3, behind `@media (color-gamut: p3)` with sRGB
fallbacks.

## Consequences

- **Positive:** a distinctive identity that lives in structure and light (chrome, glass, dispersion), not only in
  hue - so it should survive a brand's hue swap. The worst-case contrast model makes translucency safe to ship.
- **Negative:** `backdrop-filter` costs a rendering pass per glass surface, so glass is limited to overlays, cards,
  bars and buttons. Several effects (`corner-shape`, `background-clip: text` in Firefox) are enhancement-only. The
  look depends on its three families being self-hosted within the Latin budget, **raised to 130 KB on 2026-10-10** to
  keep the mono micro-labels. With Epilogue the default Latin set measures about **88 KB** (Epilogue 34 KB, Figtree
  19 KB, Spline Sans Mono 35 KB; Google Fonts, 2026-10-10), well inside it.
- **Next:** increased-contrast themes (`dark-more`, `light-more`), the full token set, the private Claude Design
  System, and the DTCG token source.

## Alternatives considered

- **A · Loom** (calm, tactile, warm) and **B · Instrument** (precise, technical) - not chosen; kept on the canvas's
  Phase 1 page for reference.
- **C · Chroma as first drawn** (vivid fuchsia and lime, flat colour fields) - evolved rather than kept.
- **Wider display faces** (Anybody expanded, Archivo expanded, Unbounded) - tried on the canvas; not enough
  personality.
- **Bricolage Grotesque** - the right personality, but its *f* was hard to read. **Funnel Display, Host Grotesk and
  Schibsted Grotesk** were compared alongside Epilogue (2026-10-10).
