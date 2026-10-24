# Handover — Lue UI, Pass 3 in progress

> Written 2026-10-05 when Phase 1 closed; updated through Pass 2 (complete 2026-10-10) and into Pass 3 (started
> 2026-10-11). A fresh session should read this file, then [AGENTS.md](AGENTS.md), then
> [mission and principles](docs/foundations/mission-and-principles.md).

## Where things stand

- **Phase 1 (foundations and design kickoff) is complete.**
- **Pass 2 is complete (2026-10-10).** The user chose **Chroma** and evolved it into **C2 · Chroma Luminous** (chrome
  hairlines, liquid-glass depth, a subdued prismatic-neon palette, light that moves on interaction), locked in
  [ADR-0009](docs/architecture/adr/0009-visual-direction-chroma-luminous.md). Token source in `packages/tokens/src`;
  the private Claude Design System is built.
- **Pass 3 (tracer bullet) started on 2026-10-11.** Step 0 (pnpm workspace, Changesets, CI), **Spike A** (a menu
  inside a modal dialog, HTML and React), **Spike B** (Terrazzo tokens → Lightning CSS → consumer fixtures, plus the
  emulation tests) and the **first five components** with Storybook 10 (both 2026-10-24) are done — see [Pass 3](#pass-3--tracer-bullet-in-progress). Library code
  now exists in `packages/elements`, `packages/react` and `packages/css`; every package is private.
- **Repo:** `/Volumes/Code/never-ui` (the git root). `main` holds only the initial commit (MIT `LICENSE`,
  `.gitignore`, `.gitattributes`); all work happens on **`develop`**, where Phase 1 was committed on 2026-10-05. The
  remote is `origin`, private, `skinread/lue-ui` on GitHub.
- **Name: Lue UI** (2026-10-05, [ADR-0008](docs/architecture/adr/0008-name-lue-ui.md)) — from the French *lueur*, a
  glimmer. Prefix `lue`, slug `lue-ui`, global `LueUI`, npm scope `@lue-ui/*` (provisional). The docs no longer use
  `never-ui`/`ns`; the local folder keeps its old name.
- **The Claude Design files stay private (user's rule, 2026-10-05):** the canvas and the Claude Design System are never
  shared within the organisation or made public. The library itself is open source (MIT) and will be published to npm
  and GitHub; design files may be published later, but never through the Claude Design System.
- **Git workflow (user's decision, 2026-10-05):** commit as you go on `develop`, in logical units. No feature branches.
  Don't push unless asked.
- **The Claude Design canvas** has one page, **C2 · Chroma Luminous**. The Phase 1 page was removed at the user's
  request on 2026-10-11 (commit `18ec453` can regenerate it). Round 2 made buttons frosted glass with multi-tone
  primaries and the ambient light more diffuse. Round 3 added metal-and-light materials (dispersion at chrome's lower
  edge, thicker glass, metal tiles, satin, a glass prism and orb) and moved the composed screens from commerce to
  portfolio and editorial: a block library, a portfolio home and a journal article.

## What exists

| Path | Contents |
| --- | --- |
| [README.md](README.md), [AGENTS.md](AGENTS.md) | Front door and agent guide |
| [docs/foundations/](docs/foundations/) | [Mission and principles](docs/foundations/mission-and-principles.md) (11 principles, each with "how we check") · [naming shortlist](docs/foundations/naming.md) · [landscape and positioning](docs/foundations/landscape-and-positioning.md) · [platform capabilities](docs/foundations/platform-capabilities.md) |
| [docs/architecture/](docs/architecture/) | [RFC-0001](docs/architecture/rfc-0001-architecture.md), ADRs 0001–0009 and [spike reports](docs/architecture/spikes/) |
| `packages/` | `tokens` (hand-edited DTCG source, Terrazzo build), `css` (per-component CSS, Lightning CSS build), `elements` (`<lue-menu>`), `react` (Dialog, Menu, `LueElements`) — all `"private": true` |
| `tests/` | Browser tests (Vitest browser mode, Chromium · Firefox · WebKit): Spike A, the ADR-0005 emulation tests, one folder per component, shared helpers in `support/` |
| `apps/docs/` | Storybook 10 (stories are tests, axe set to `error`) and the component contracts |
| `fixtures/` | Consumer fixtures (Vite, Next, Tailwind v4) and the checker that fails if our CSS is lowered |
| [docs/design/](docs/design/) | [Token spec](docs/design/tokens.md) · [component inventory and draft contracts](docs/design/components.md) · [Claude Design brief](docs/design/claude-design-brief.md) (with verified palettes in its appendix) |
| [tools/directions/](tools/directions/README.md) | Contrast checker, seeded palettes and the canvas generator, with how to republish |

## The Claude Design canvas

<https://claude.ai/artifact/9DKJGmK7kPdEt2giN4qDgP> — private until the user shares it.

- **Layout:** one page, two rows — the system (`Luminous-Foundations`, `-Components`, `-Blocks`) and in use
  (`-Portfolio`, `-Article`, `-Checkout`), plus a "future exploration" sticky for the neon spectrum.
- **C2 · Chroma Luminous** (files `Luminous-*`, interactive — press Play to try hover, press and focus). Pearl and
  obsidian neutrals; an eight-hue prism; frosted glass buttons whose primaries carry five prism tones at one lightness
  that drift on hover; 1 px chrome rings (gunmetal on pearl, silver on obsidian) that glint; two glass tiers; sparks;
  diffuse ambient prism light. Selected and on states trade chrome for prism. Foundations adds Prism, Chrome, Glass, Light that moves and fallback
  sections. The checkout opens in dark.
- **Phase 1's three directions** (A · Loom, B · Instrument, C · Chroma) are no longer on the canvas; their palettes
  and contrast matrices stay in the [brief](docs/design/claude-design-brief.md).
- **Contrast:** all 360 declared pairs pass WCAG 2.x (36 × 4 palettes × light/dark, plus C2's `dark-more` and
  `light-more` at raised minimums), and all 86 Luminous prism, chrome, glass, glass-button, multi-tone, ambient-light,
  satin, metal and increased-contrast rules pass. Glass is checked worst-case — over white, black and every fill, through
  the scrim for modals, reading the backdrop filter both ways.
- **Not visually verified.** The Design type asks agents not to screenshot canvases unless the user asks. If a board
  looks clipped, raise its height in `tools/directions/build-canvas.mjs` and republish.

## Decisions made with the user

| Topic | Decision |
| --- | --- |
| Identity | Open source; new and creative; **unrelated to any existing design system**. Claude Design always runs with no reference design system (`design_systems: false`). |
| Component model | HTML+CSS core → light-DOM custom elements only where the platform lacks behaviour → thin React 19 adapters rendering identical markup. |
| Claude Design flow | Claude seeds directions, the user art-directs, then Claude codifies the pick as a Design System artifact. |
| Repo | A new, empty repo instead of taking over tw-variants-ui. |
| Licence | MIT (already in the repo). |
| Git | Commit as you go on `develop`; no feature branches; no push unless asked (2026-10-05). |
| Direction | Continue with **Chroma**, evolved as C2 · Chroma Luminous (2026-10-05). Glass is allowed only when verified; the brief's creative mandate and non-negotiables were revised to match. |
| C2 details (2026-10-05) | Multi-tone fills on checkboxes, radios, switches and steps · **dark is the primary scheme** · Phosphor icons, regular weight · **Epilogue** for headings (2026-10-10; wider faces and Bricolage Grotesque tried and rejected) · wider neon spectrum parked as future exploration. **Locked in [ADR-0009](docs/architecture/adr/0009-visual-direction-chroma-luminous.md).** |
| Approved with the plan | Native CSS core with Tailwind only as a generated bridge · WCAG 2.2 AA + 2.4.13 AAA focus + 44px targets under `(any-pointer: coarse)` · Baseline "newly available" fidelity floor · DTCG 2025.10 tokens via Terrazzo · pnpm workspace from Pass 3 · lockstep versions · open-licensed fonts and icons. |
| 2026-10-11 | **Start Pass 3.** **No npm publishing yet** (packages stay private; `@lue-ui` scope provisional; no org creation yet). **No polyfills:** the ADR-0004 inclusion exception is declined and kept as a possible future enhancement — on Safari < 26.2, HTML-path `command` buttons do nothing. **No trademark.** **Storybook 10** for docs for now. Copy-paste components, if ever offered, would use the **shadcn registry** tooling — a future consideration. Phase 1 canvas page removed. |

## Waiting on the user

1. **Making the repo public** is yours to decide (private on GitHub as `skinread/lue-ui`; CI is green on `develop` in Chromium,
   Firefox and WebKit as of 2026-10-24).
2. **Spike C** needs you to start `/design-sync` (it's a skill the user runs).

Lower-priority open questions are listed at the end of [RFC-0001](docs/architecture/rfc-0001-architecture.md#open-questions).

## Pass 2 — codify the chosen direction (complete)

Done on 2026-10-05:

- ~~Read the canvas and its comments; summarise the art direction~~ — the direction came in chat. Keep reading
  comments on the canvas each session; the user may art-direct there.
- ~~Iterate C2 and lock it~~ — four rounds, locked in [ADR-0009](docs/architecture/adr/0009-visual-direction-chroma-luminous.md).
  Refinements are still welcome: edit `tools/directions/` and republish only changed boards (its README).
- ~~Increased-contrast themes~~ — `dark-more` and `light-more` in `palettes.mjs`: text 7:1, boundaries 4.5:1; glass
  opaque, chrome solid. Shown on the C2 Foundations board.
- ~~Full token set~~ and ~~mirror into the repo~~ — `tools/directions/tokens.mjs` writes DTCG 2025.10 JSON to
  [`packages/tokens/src/`](packages/tokens/README.md) (224 tokens, four theme contexts, resolver), and
  `check-tokens.mjs` passes. Re-run both after any palette change.
- ~~Name~~ — Lue UI ([ADR-0008](docs/architecture/adr/0008-name-lue-ui.md)).

- ~~Create the Claude Design "Design System" artifact~~ — done 2026-10-10:
  <https://claude.ai/artifact/Er8XMd9VquWgK1q1ZrdCWe> (**private; never share it within the organisation**). Built by
  `tools/directions/design-system.mjs` from the token source: `tokens.json` (84 colours × 4 themes, dark first), a
  brand-book README, `bundle.css` (`@layer lue`, one-class specificity — the seed of `@lue-ui/css`), 44 component and
  block cards with live HTML previews, a cover, the fonts and 23 Phosphor icons. How to rebuild and republish: the
  [tools README](tools/directions/README.md#the-claude-design-system-private). Not render-checked.

- ~~Remove the Phase 1 canvas page~~ — done 2026-10-11, at the user's request.

## Pass 3 — tracer bullet (in progress)

Following [RFC-0001 §11](docs/architecture/rfc-0001-architecture.md#11-sequencing-pass-3), riskiest first:

1. ~~**Step 0** — pnpm workspace, Changesets, CI~~ — done 2026-10-11.
   - The four package skeletons follow ADR-0007's export maps and are all `"private": true`.
   - Changesets uses a `fixed` group; `baseBranch` is `main`.
   - ESLint runs `@eslint/css` (Baseline newly available, `use-layers`, logical properties) and html-eslint.
   - TypeScript 7 runs with isolated declarations for packages.
   - CI: lint, types and token contrast, then browser tests sharded by engine.
   - Run `pnpm check` and `pnpm test`.
2. ~~**Spike A** — a dialog containing a menu~~ — done 2026-10-11:
   [report](docs/architecture/spikes/spike-a-dialog-menu.md). 23 tests pass in Chromium, Firefox and WebKit (Firefox confirmed in
   CI on 2026-10-24). WebKit needed explicit focus return in `<lue-menu>` and Option+Tab.
3. ~~**Spike B**~~ — done 2026-10-24: [report](docs/architecture/spikes/spike-b-token-and-css-pipeline.md).
   - `packages/tokens/src` is now **hand-edited**; Terrazzo 2.10 builds `tokens.css`, `tailwind.css` and
     `claude-design/tokens.json`, with a per-context contrast gate (144 checks) and a 6 KB budget (3.6 KB today).
     `tools/directions/tokens.mjs` is retired and refuses to overwrite the source.
   - Seventeen canvas values that were never tokens (button rims, beads, field inset, tile shadow…) are now material
     tokens; `packages/tokens/src/theme.css` composes them (filters, gradients) per themed element.
   - The component CSS moved to `packages/css/src` (per component, plus base, blocks, materials, contrast), lint-clean,
     built by Lightning CSS with no targets. Dialog and menu are Spike A's.
   - Consumer fixtures (`fixtures/`) for Vite 8, Next 16 and Tailwind 4 run in CI. **Next lowers `oklch()` unless the
     consumer sets a Baseline browserslist** — it's in the recipe.
   - ADR-0005 emulation tests (`tests/emulation/`): scheme, increased contrast, forced colours, reduced motion, 320 px,
     RTL. 98 tests pass across the three engines (one skipped: forced colours in WebKit, per ADR-0005).
   - ADR-0003 is now Accepted.
4. **Spike C:** one Claude Design preview with the elements IIFE through `/design-sync` (the user starts it).
5. ~~**Components**~~ — the first five done 2026-10-24, each with a hand-written contract in
   [`apps/docs/contracts/`](apps/docs/contracts/), a React adapter, stories and three-engine tests in `tests/<component>/`:
   - **Button** — variants, sizes, icon-only, pressed; forced colours (pressed → SelectedItem).
   - **Field + TextInput + error summary** — the opt-in `data-lue-validate` behaviour (through the platform's `invalid`
     event, no `novalidate`) and React's `useValidation`, sharing one controller in `@lue-ui/elements`.
   - **Select** — native, with customisable select behind `@supports (appearance: base-select)` (Chromium, WebKit 27).
   - **Dialog** — `@starting-style` transitions, scroll lock, a development warning for `open` without `onOpenChange`.
   - **Menu** — ArrowDown/ArrowUp on the trigger open at the first/last item; the element still writes nothing.
   - **Storybook 10** is in `apps/docs`; every story is a Vitest test in three engines with axe set to `error`.
   - `--lue-angle` no longer inherits (rings set it on `::before`); each component owns its contrast and forced-colours
     rules; `utilities.css` adds the `[hidden]` rule and `.lue-visually-hidden`.
   - 330 tests pass (6 skipped: forced colours in WebKit, and customisable select in Firefox).

## Next steps

1. **Check CI on `develop`** (pushed 2026-10-24 at `6a8c31f`): it's the first run of the fixtures job, the
   `*(browser)` sharding and the Storybook project.
2. **Spike C** — `/design-sync` with the elements IIFE (you start it). The JS packages have no build yet (tests,
   Storybook and the typecheck use sources), so Spike C needs the per-file ESM build and `lue.iife.js` from RFC-0001 §9.
3. **Pass 3 wrap-up:** extract the contract schema from the five contracts; html-validate on rendered markup; visual
   regression and size-limit (ADR-0005); the remaining `contrast.css` entries move into their components; port the glass
   and chrome worst-case rules out of `tools/directions/palettes.mjs`; `tokens.js` and the Figma output.

## Things to know

- **Glass and chrome platform notes** (checked 2026-10-05) are in
  [platform capabilities](docs/foundations/platform-capabilities.md#glass-chrome-and-light), with two new CSS traps.
  The canvas mockup registers `--lx-angle` with `inherits: true` so `::before` rings can read it; the library should
  instead animate on the pseudo-element with `inherits: false` and literal angles.
- **The research is a snapshot from 2026-10-03** (Chrome 154, Firefox 157, Safari 27). Re-check anything marked
  *Limited* before relying on it.
- **CSS traps:** no non-Baseline function inside a custom property; no `light-dark()` in token custom properties
  (Lightning CSS lowers it to invalid values); never `@property`-register themeable colours; focus rings use
  `outline`, never `box-shadow`.
- **React gaps:**
  - no typings for `command`/`commandfor`, and camelCase `commandFor` triggers a dev warning — use an `invoker()`
    helper;
  - no `<selectedcontent>` in v1;
  - never pass React's `open` prop to a modal dialog;
  - no portals.
- **AI tropes to avoid** (from Claude Design's craft notes): Inter, Roboto, Arial and Fraunces; cream ground with serif
  display and clay; left-border accent cards; gradient washes; emoji. That's why Loom uses Besley.
- **`/design-sync` is a skill the user starts;** the DesignSync tool is only for use inside it, and it appears
  React-centric — Spike C tests that.
- **tw-variants-ui** (`/Volumes/Code/tw-variants-ui`) is the legacy predecessor: leave it alone during never-ui work. A
  separate task was offered for its CI (still `npm ci` after the pnpm switch, so it breaks on push) and its form
  accessibility bugs.
- **The Phase 1 session's scratchpad is gone.** Everything worth keeping is in this repo and on the canvas.
- **Running tests from the Claude app (Mac):** if a browser fails to launch, set `TMPDIR` to a writable folder (the
  session's scratchpad). **In a Linux cloud session**, plain `pnpm test` works once the browsers are installed;
  WebKit may also need `pnpm exec playwright install-deps webkit`. Firefox can't start from the Claude app on macOS; CI covers it.
- **Toolchain as installed on 2026-10-11:** pnpm 12.4, Node 26.10, TypeScript 7.0, Vitest 5.0 with
  `@vitest/browser-playwright`, Playwright 1.64 (Chromium 156, Firefox 157, WebKit 27.2), React 19.3, ESLint 10 with
  `@eslint/css` 2 and html-eslint 0.66, Changesets 3, axe-core 4.14. `pnpm-workspace.yaml` refuses versions under a day
  old and dependency build scripts unless allowed. Added in Spike B (2026-10-24), pinned exactly: Terrazzo 2.10
  (`cli`, `parser`, `plugin-css`, `token-tools`), Lightning CSS 1.33; fixtures use Vite 8.3, Tailwind 4.3, Next 16.4.2
  (16.4.3 was under a day old).
