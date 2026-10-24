# Handover — Lue UI, Pass 4 done (Spike C still waiting on you), Pass 5 next

> Written 2026-10-05 when Phase 1 closed; updated through Pass 2 (complete 2026-10-10) and Pass 3 (2026-10-11 to
> 2026-10-24) and Pass 4 (2026-10-24). A fresh session should read this file, then [AGENTS.md](AGENTS.md), then
> [mission and principles](docs/foundations/mission-and-principles.md).

## Where things stand

- **Phase 1 (foundations and design kickoff) is complete.**
- **Pass 2 is complete (2026-10-10).** The user chose **Chroma** and evolved it into **C2 · Chroma Luminous** (chrome
  hairlines, liquid-glass depth, a subdued prismatic-neon palette, light that moves on interaction), locked in
  [ADR-0009](docs/architecture/adr/0009-visual-direction-chroma-luminous.md). Token source in `packages/tokens/src`;
  the private Claude Design System is built.
- **Pass 3 (tracer bullet, 2026-10-11 to 2026-10-24) is done but for Spike C,** which you start. Step 0, Spikes A and B,
  the package builds and the first five components with Storybook 10 and every ADR-0005 gate are in place — see
  [Pass 3](#pass-3--tracer-bullet-done-but-for-spike-c). **Pass 4 is done (2026-10-24):** every Tier 1 component, keyboard
  coverage driven by the contracts, `llms.txt` with a Markdown page per component, and an MCP server. **Pass 5 (Tier 2
  and a first public release) is next.** Every package is private.
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
- **No escaped dashes (user's rule, 2026-10-24):** write a normal dash, never a Unicode escape; `pnpm lint` checks.
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
| `packages/` | `tokens` (hand-edited DTCG source, Terrazzo build), `css` (per-component CSS and fonts, Lightning CSS build), `elements` (`<lue-menu>`, `<lue-toast-region>`, `data-lue-validate`, `data-lue-toggle`, the IIFE), `react` (every component's adapter), `mcp` (the MCP server) — all `"private": true`, each with a README |
| `tests/` | Browser tests (Vitest browser mode, Chromium · Firefox · WebKit): Spike A, emulation, one folder per component, visual regression baselines (`visual/`), the static markup gate (`markup/`, Node), the MCP server (`tools/`, Node), shared helpers in `support/` |
| `apps/docs/` | Storybook 10 (stories are tests, axe set to `error`), the component contracts, and `public/` (generated, ignored): `llms.txt`, a page per component, tokens |
| `fixtures/` | Consumer fixtures (Vite, Next, Tailwind v4) and the checker that fails if our CSS is lowered |
| `tools/` | `build-js.mjs` (JS package builds), `check-contracts.mjs` (schema, tokens, classes, tests, stories, keyboard coverage), `build-ai-docs.mjs` (`llms.txt` and the Markdown pages), `check-text.mjs` (escaped dashes) |
| [docs/design/](docs/design/) | [Token spec](docs/design/tokens.md) · [component inventory and contract format](docs/design/components.md) · [Claude Design brief](docs/design/claude-design-brief.md) (with verified palettes in its appendix) |
| [tools/directions/](tools/directions/README.md) | The Pass 2 design tools: seeded palettes, the canvas and Design System generators, with how to republish |

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

## Pass 3 — tracer bullet (done, but for Spike C)

Following [RFC-0001 §11](docs/architecture/rfc-0001-architecture.md#11-sequencing-pass-3), riskiest first:

1. ~~**Step 0**~~ — pnpm workspace, Changesets (`fixed` group, `baseBranch: main`), CI. Done 2026-10-11.
2. ~~**Spike A**~~ — a menu inside a modal dialog, HTML and React with SSR and hydration
   ([report](docs/architecture/spikes/spike-a-dialog-menu.md)). Done 2026-10-11; Firefox confirmed in CI 2026-10-24.
3. ~~**Spike B**~~ — tokens → CSS → consumers ([report](docs/architecture/spikes/spike-b-token-and-css-pipeline.md)).
   Done 2026-10-24.
4. **Spike C — next, yours to start:** one Claude Design preview with `@lue-ui/elements/lue.iife.js` through
   `/design-sync`. The IIFE is built (2.3 KB) and checked to define `<lue-menu>`.
5. ~~**Components**~~ — Button, Field + TextInput + error summary, Select, Dialog, Menu. Done 2026-10-24.

What exists now (all private, all on `develop`):

- **Tokens** (`packages/tokens`): `src` is hand-edited (`tools/directions/tokens.mjs` is retired). Terrazzo 2.10 builds
  `tokens.css` (4 KB Brotli, budget 6), `tokens.js` + types, `tailwind.css`, `figma/<context>.tokens.json` and the
  Claude Design `tokens.json`. The build fails on a contrast pair (144), a material rule (78: glass, glass buttons,
  ambient light, satin, metal, rings, multi-tone fills — ported from `palettes.mjs`), a missing description, a name
  collision, an incomplete theme block or the budget. The `-more` contexts have their own multi-tone fills.
- **CSS** (`packages/css`): one file per component, each owning its increased-contrast and forced-colours rules; blocks,
  materials, utilities (`[hidden]`, `.lue-visually-hidden`), and opt-in `fonts.css` (Epilogue, Figtree, Spline Sans
  Mono from the repo's OFL files, 111 KB, with metric-matched fallback faces). Lightning CSS, no lowering; every file
  starts with the full layer order.
- **Elements and React** (`packages/elements`, `packages/react`): per-file ESM with types (`tools/build-js.mjs`),
  `'use client'` kept, the IIFE, and size budgets. Controllers have server-safe subpaths
  (`@lue-ui/elements/validate`, `…/menu`).
- **Docs** (`apps/docs`): Storybook 10; contracts with schema v1 (`pnpm check` validates them against tokens, CSS,
  tests and stories).
- **Gates:** `pnpm check` (lint, escaped-dash check, types, token build, contracts, static markup of every story);
  `pnpm test` (unit, emulation, component, visual and story tests in Chromium, Firefox and WebKit: 1,066 tests, 15
  skipped by design; `pnpm test:engines` runs one engine at a time, as CI does); `pnpm fixtures` (Vite, Next with the built React adapters, Tailwind v4). CI runs all three.

## Next steps

1. **Spike C** (you start `/design-sync`).
2. **Pass 4 — Tier 1 components** ([inventory](docs/design/components.md#tier-1--the-first-release)), in order of
   increasing JavaScript, each with a contract, adapter, stories and the same gates:
   - ~~Form controls: Textarea, Checkbox, Radio group, Switch~~ — done 2026-10-24. A required radio group is one error
     on its first radio, with `aria-invalid` on every radio; the React adapters are `ChoiceGroup`, `Checkbox`, `Radio`,
     `Switch` and `Textarea`. Building them found that text controls were content-box and overflowed their field by
     38 px (fixed; the reflow test now checks each control against its field).
   - ~~CSS only: Link, Disclosure, Accordion, Alert, Icon, Visually hidden and Skip link, layout primitives~~ — done
     2026-10-24. Alert is a `<div>`, not an `<aside>` (a landmark per callout inside `<main>`), and says its tone in
     words. The skip link moved out of `blocks.css` into its own component; `.lue-grid` moved into `layout.css` with
     Stack, Cluster, Sidebar, Switcher and Center, all intrinsic (no media or container queries).
   - ~~Overlays, Toggle button and Toast~~ — done 2026-10-24. Popover and Toggletip are `popover="auto"` (Toggletip
     not `hint`, which falls back to `manual` where unsupported; its tip is a `<span>` so it fits in a paragraph).
     Drawer is a Dialog with `data-side`. `data-lue-toggle` flips `aria-pressed` and fires `lue-toggle`; React has
     `ToggleButton`. `<lue-toast-region>` owns its children: an always-rendered live region (`ariaNotify()` where it
     exists) and a manual-popover list; 6 s, paused on hover and focus, actions never time out, three at a time.
     Found on the way: `.lue-dialog` was content-box too, so its padding pushed it past its size (fixed).
3. ~~**Pass 4 tooling**~~ — done 2026-10-24.
   - **Contracts → tests:** `check-contracts.mjs` fails unless every key a contract's keyboard map names is pressed,
     with real input, in that component's tests. A contract's actions are prose, so the gate checks that the
     hand-written tests cover the map rather than generating assertions. It found 34 untested keys, and the new tests
     found two bugs: Firefox made an open popover a Tab stop (fixed: `overflow: visible`), and WebKit doesn't open a
     customisable select with Alt+ArrowDown (contract narrowed to Chromium).
   - **AI docs:** `pnpm docs-ai` (`tools/build-ai-docs.mjs`) renders every story on the server and writes `llms.txt`,
     `llms-full.txt`, a Markdown page per component, `tokens.md`/`tokens.json` and the contracts to `apps/docs/public`,
     which Storybook serves. Contracts gained a required one-line `summary`.
   - **MCP:** `packages/mcp/server.js`, dependency-free MCP over stdio: `list_components`, `get_component`,
     `find_tokens`, and every page as a resource. `claude mcp add lue-ui -- node packages/mcp/server.js`.
4. **Pass 5 — Tier 2 and a first public 0.x release** ([inventory](docs/design/components.md#tier-2)), in progress:
   - ~~Breadcrumb, Pagination, Tag, Card, Avatar, Divider, Kbd~~ — done 2026-10-24. The breadcrumb separator now has
     empty alt text (`content: "/" / ""`), so it isn't read; Card's link stretches over the card and the card shows
     its focus (`:has()`); Pagination reads "Page n" for each number.
   - Next without script: Progress and meter, Spinner and skeleton, Table, Search, Segmented control, Rating, Swatch
     picker. Then with script: Tabs (`<lue-tabs>`), Toolbar (`<lue-roving>`), Tooltip (`data-lue-tooltip`),
     Carousel, Quantity stepper.

   - **Published Storybook (user's request, 2026-10-24):** `.github/workflows/storybook-pages.yml` builds Storybook
     and deploys it to GitHub Pages when run by hand (Actions → Storybook to GitHub Pages → Run workflow). One-time
     setup is yours: Settings → Pages → Source "GitHub Actions"; if the `github-pages` environment only allows the
     default branch, add `develop`. The repo is private, so Pages needs a paid plan, and the site is public unless
     the organisation has Enterprise Cloud private Pages. Later it becomes a step of package publishing.

   Before
   publishing: confirm the npm scope, make the repo public, publish — all yours to decide. Also outstanding from
   RFC-0001 §8: Storybook's `html` decorator (show each story's server-rendered HTML as its source), the Storybook MCP
   addon's manifests, contract-generated component guidelines for the Claude Design System (after Spike C), and the
   manual screen-reader pass (NVDA, JAWS, VoiceOver, TalkBack) that gates Stable.

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
