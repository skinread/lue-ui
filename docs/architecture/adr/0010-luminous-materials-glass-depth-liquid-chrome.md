# ADR-0010: Luminous materials - thick glass, liquid chrome and wide-gamut light

- **Status:** Accepted
- **Date:** 2026-11-01
- **Revises:** [ADR-0009](0009-visual-direction-chroma-luminous.md) (glass, chrome, buttons, small controls, tags,
  motion); the direction itself stands
- **Principles:** 11 distinctive, not decorative · 1 accessible by construction · 5 respect personal settings ·
  8 Baseline-anchored (enhancements behind `@supports` or a media query)

## Context

C2 · Chroma Luminous was right in spirit but quiet in practice: on a dark canvas the glass read as grey boxes with
nothing behind them to bend, the primary button looked almost like the neutral one, the chrome ring was an even grey,
and the light lived only in the progress bar. The user asked for the glass and prismatic, reflective surfaces to be
made more luminous, and art-directed four rounds on a specimen (`tools/directions/luminous-next/`, branch
`design/luminous-next`, 2026-11-01):

1. More luminous light, with wide-gamut colour for light only; drop the sparks on the primary's hover.
2. Real refraction at the edge of glass; light that follows the pointer (later removed); a richer pearl theme.
3. Softer, thicker panels; the tabs, switch, checkbox and radio as one skeuomorphic set of reflective chrome; no
   pointer light and no panel motion on hover. Then the segmented control joined the set.
4. The fields joined the set; chrome toned toward a mid grey; chrome that moves like liquid metal, and only when a
   state changes (never on hover, and never on a field); tabs whose selected key flows; dispersion in the lens.

## Decision

| Element | Decision |
| --- | --- |
| Glass | A thick slab: a bright bevel inside the top edge, a darker one inside the bottom, its lit side showing below it, a contact shadow and a long soft one (`shadow.glass`). Its rims carry a specular top line and cool and warm split colour at the sides (`shadow.fringe`). The sheen is a dome of light plus a thin streak (`material.glass.dome`, `.streak`). Text surfaces keep their tested tint and backdrop filter. |
| Clear glass | `data-tier="clear"` on `.lue-glass`: thin and saturated, for frames and objects with nothing to read. |
| Caustic | Opt-in `data-caustic` on `.lue-glass`: the light the glass gathered, pooled along its lower lip, in the padding, under no text. Kept for hero objects, so it reads as light rather than as a stamp. |
| Corners | `radius.l` from 28 to 40 px; doubled where `corner-shape: squircle` applies, since a squircle needs more to look as soft. The chrome ring and the caustic inherit `corner-shape`, which fixes a ring that separated from squircle surfaces at the corners. |
| Chrome ring | Toned toward a mid grey: two specular highlights with dark horizons beside them, cool above, warm below, the dispersion band kept. Its floor stays at about 66% lightness in dark, so it clears 3:1 on glass over any backdrop. |
| Liquid chrome set | Checkbox, radio, switch, tabs, segmented control and fields share one material (`material.liquid.*`): chrome reflecting a horizon (sky, a dark band, a warm floor), recessed wells (`material.well.*`) in a 2 px chrome bezel, and raised keys with their names engraved (`material.engrave`). Checkbox: a chrome cushion with the tick engraved. Radio: a chrome ball bearing. Switch: the ball rolling along the well, lit with prism light when on. Tabs and segmented control: the selected option is a raised chrome key. Fields: a well in the bezel. Boxes 24 px, the switch 52 by 30. |
| Motion | Like liquid metal, only when a state changes: a checkbox's chrome rises to fill it, then the tick is engraved; a radio's ball wells up; a switch's ball rolls while the light pours in; the bezel turns half a revolution. Tabs and the segmented control pass one chrome key between options, which stretches toward the new one and settles (the liquid behaviour, below). Nothing moves on hover; a field's ring never moves; focus appears at once (the focus glow no longer fades in). Reduced motion makes every change instant. The switch drops its springy overshoot. |
| Buttons | No sparks. A primary's prism light pools visibly at its base, without orchid next to azure (no purple-into-blue step), and on hover one specular glint sweeps across it. Every button has a specular top line. |
| Light | `material.light.*` (rose, amber, citron, mint, aqua, azure, two pools): caustics, pools and glows. On a P3 display they take wider-gamut values (`$extensions.lue.p3`, emitted by `scripts/finish.js` inside `@media (color-gamut: p3)`). Light is never text or a boundary, so no contrast pair moves. |
| Tags | The body face, sentence case, untracked: the tracked mono capitals read as costume. |

**The liquid behaviour.** `@lue-ui/elements` gains a delegated behaviour, loaded by `define` and the IIFE, that sets
`data-lue-liquid` and `--lue-key-x/y/w/h` on `.lue-tabs__list` (inside a defined `<lue-tabs>`) and
`.lue-segmented__options`, and animates the container's `::before` with translate and scale only. It is a narrow
exception to [ADR-0007](0007-package-layout-and-ownership.md) rule 4 (DOM-changing behaviours act only on opt-in
`data-lue-*` markup): it applies without opt-in because it is decoration only - no ARIA, no nodes, nothing a framework
renders - and the contracts declare what it writes. Without it, each selected option draws its own static key.

**Not adopted.** Real refraction and dispersion through an SVG filter in `backdrop-filter` render only in Chromium, and
no engine can be feature-detected for rendering it; an engine that parses but doesn't render it would lose the whole
filter. The specimen detects Chromium by name. The library doesn't sniff engines, so the lens stays in the specimen
until it can be detected or is Baseline. Light that follows the pointer was tried and removed at the user's request.

## Consequences

- **Positive:** the materials read as glass, metal and light at a glance, in both schemes, and the small controls read
  as one set. The material gate now covers the new surfaces: 88 rules (from 78), including engraved marks (3:1) and
  key text (4.5:1) on the darkest chrome, the chrome ball's rim against every lit track tone, text and placeholders in
  field wells, and glass with its new sheen over every backdrop, reading the filter both ways.
- **Negative:** more layered shadows per glass surface; `tokens.css` grows from 4.05 to about 5.05 KB Brotli (budget 6 KB).
  Visual baselines change and must be regenerated on Linux. The liquid key is one more script, though nothing depends
  on it.
- **Next:** regenerate the visual baselines; republish Storybook; refresh the Claude Design kit (`pnpm design-kit`)
  before Spike C.

## Alternatives considered

- **Keep C2 as it was** and only brighten the ambient light: the glass would still have nothing to bend.
- **Chrome near white:** tried first; the user toned it toward a mid grey.
- **Pointer-following light:** tried and removed.
- **Ship the SVG lens with engine detection by name:** rejected for the library (above).
