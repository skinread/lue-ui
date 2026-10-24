# Spike B: tokens → CSS → consumers

> **Status:** Done · Pass 3 · 2026-10-24 · confirms [ADR-0003](../adr/0003-dtcg-tokens-with-terrazzo.md) (Terrazzo)
> and [ADR-0002](../adr/0002-native-css-core-tailwind-bridge.md) (Lightning CSS with no targets)

[RFC-0001 §11](../rfc-0001-architecture.md#11-sequencing-pass-3) step 3: Terrazzo → `tokens.css` + Claude Design JSON
+ contrast lint → Lightning CSS → consumer fixtures. Then the [ADR-0005](../adr/0005-three-engine-testing-and-a11y-gates.md)
emulation rows, which needed CSS built from tokens.

## What was built

| Piece | Where |
| --- | --- |
| Terrazzo 2.10 config: one `@layer lue.tokens` block per theme context, fluid `clamp()`, `$extensions.lue` transforms | `packages/tokens/terrazzo.config.js` |
| Plugins: per-context contrast gate, schema checks, Claude Design `tokens.json`, Tailwind v4 `@theme` bridge | `packages/tokens/plugins/lue.js` |
| Finishing: drop gamut copies, reduced-motion and coarse-pointer rules, theme compositions, Lightning CSS, budget | `packages/tokens/scripts/finish.js`, `src/theme.css` |
| Component CSS moved from the Claude Design System seed, split per component, built with Lightning CSS | `packages/css/src`, `packages/css/scripts/build.js` |
| Consumer fixtures and their checker | `fixtures/{vite,next,tailwind}`, `fixtures/check.js` |
| Emulation tests | `tests/emulation/` |

## What it proved

- **Terrazzo handles our resolver.** One `theme` modifier with four contexts plus `density` builds with permutations;
  `include` globs keep the non-default blocks to themed tokens. Output: 3.6 KB Brotli for all four themes (budget 6 KB).
- **The contrast gate runs in the build.** 144 checks (36 pairs × 4 contexts, raised minimums in `-more`); a failure
  fails `tz build`. Terrazzo's own `a11y/min-contrast` checks one resolved set at fixed AA/AAA levels, so we wrote a
  small plugin instead.
- **Theme selection without specificity games.** Dark on `:where(:root)`; the OS's light and increased-contrast
  preferences at zero specificity where no `data-theme` is set; `data-theme` and `data-contrast="more"` win and work on
  any subtree. Materials composed in CSS (filters, gradients) are re-declared on every themed element so a dark island
  in a light page computes its own.
- **Lightning CSS with no targets lowers nothing,** but its minifier drops layer names a file doesn't use. Every file
  we ship re-adds the full layer order after minifying.
- **Consumers:** Vite 8 and Tailwind 4 keep our CSS intact (they add `-webkit-` prefixes). **Next 16 rewrites every
  `oklch()` token to hex plus a `lab()` copy unless the consumer sets a Baseline browserslist** — now in the recipe.
  TypeScript rejected `import '@lue-ui/css'`; the package now has a `types` condition.
- **Emulation (computed styles, not `matchMedia`):** colour scheme and subtree themes, increased contrast (OS and
  `data-contrast`), forced colours (Chromium, Firefox), reduced motion, 320 px reflow with fluid space at 16 → 18 px,
  and RTL — 10 tests × 3 engines. Breaking the forced-colours block or widening a card makes them fail.

## What surprised us

1. **A glob that matched too little.** `color.*` covers one segment, so the light and `-more` blocks lost most
   colours, and the size budget hid it. Globs are now `**`, and the build fails unless every colour, material and
   shadow token appears in all seven theme blocks.
2. **Seventeen material values were never tokens.** The canvas computed button rims, beads, field insets and the tile
   shadow in JavaScript. They're now material tokens, so colour has one source.
3. **Playwright's Firefox doesn't re-evaluate stylesheets for `contrast` emulation.** `matchMedia` changes, existing
   sheets don't; a new sheet does. The tests re-insert `<style>` elements in Firefox. A harness gap, not a browser one.
4. **WebKit needed system libraries** in the Linux cloud container (`playwright install-deps webkit`).

## Follow-ups

- ~~Port the glass, chrome and prism worst-case rules into a plugin~~ — done 2026-10-24 (`lue-materials`, 78 rules from
  the token source). The port found that the `-more` contexts had the standard dark fills (marks at 5.5:1, not 7:1);
  the Pass 2 `-more` fills are now tokens.
- ~~Per-component forced-colours and contrast styles instead of one `contrast.css`~~ — done 2026-10-24; `contrast.css` is gone.
- `--lue-angle` on the pseudo-element with `inherits: false` (the handover's CSS trap), with the Button work.
- `tokens.js` + `.d.ts` and `figma/*.tokens.json` outputs (RFC-0001 §1) — not needed for the tracer bullet.
- Ship a browserslist config package if the Next finding repeats in other pipelines.
