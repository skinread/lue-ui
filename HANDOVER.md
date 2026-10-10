# Handover — Lue UI, Pass 2 in progress

> Written 2026-10-05 when Phase 1 closed; updated the same day as Pass 2 began. A fresh session should read this file,
> then [AGENTS.md](AGENTS.md), then [mission and principles](docs/foundations/mission-and-principles.md).

## Where things stand

- **Phase 1 (foundations and design kickoff) is complete.** There is no library code, by design.
- **Pass 2 has started.** The user chose **Chroma** and asked for a more luminous, luxurious evolution: **C2 · Chroma
  Luminous** (chrome hairlines, liquid-glass depth, a subdued prismatic-neon palette, light that moves on
  interaction). It's the first row on the canvas and recorded in the
  [brief](docs/design/claude-design-brief.md#c2-chroma-luminous--luminous--luxurious--prismatic). It is still
  being explored — not yet locked, so no ADR yet.
- **Repo:** `/Volumes/Code/never-ui` (the git root). `main` holds only the initial commit (MIT `LICENSE`,
  `.gitignore`, `.gitattributes`); all work happens on **`develop`**, where Phase 1 was committed on 2026-10-05. No
  remote.
- **Name: Lue UI** (2026-10-05, [ADR-0008](docs/architecture/adr/0008-name-lue-ui.md)) — from the French *lueur*, a
  glimmer. Prefix `lue`, slug `lue-ui`, global `LueUI`, npm scope `@lue-ui/*` (provisional). The docs no longer use
  `never-ui`/`ns`; the local folder keeps its old name.
- **The Claude Design files stay private (user's rule, 2026-10-05):** the canvas and the Claude Design System are never
  shared within the organisation or made public. The library itself is open source (MIT) and will be published to npm
  and GitHub; design files may be published later, but never through the Claude Design System.
- **Git workflow (user's decision, 2026-10-05):** commit as you go on `develop`, in logical units. No feature branches.
  Don't push unless asked.
- **The Claude Design canvas** has two pages: **C2 · Chroma Luminous** (opens first) and **Phase 1 · three
  directions**. The user likes C2's direction and its prism hues (2026-10-05). Round 2 made buttons frosted glass
  with multi-tone primaries and the ambient light more diffuse. Round 3 added metal-and-light materials (dispersion
  at chrome's lower edge, thicker glass, metal tiles, satin, a glass prism and orb) and moved the composed screens
  from commerce to portfolio and editorial: a block library, a portfolio home and a journal article.

## What exists

| Path | Contents |
| --- | --- |
| [README.md](README.md), [AGENTS.md](AGENTS.md) | Front door and agent guide |
| [docs/foundations/](docs/foundations/) | [Mission and principles](docs/foundations/mission-and-principles.md) (11 principles, each with "how we check") · [naming shortlist](docs/foundations/naming.md) · [landscape and positioning](docs/foundations/landscape-and-positioning.md) · [platform capabilities](docs/foundations/platform-capabilities.md) |
| [docs/architecture/](docs/architecture/) | [RFC-0001](docs/architecture/rfc-0001-architecture.md) and ADRs 0001–0007 |
| [docs/design/](docs/design/) | [Token spec](docs/design/tokens.md) · [component inventory and draft contracts](docs/design/components.md) · [Claude Design brief](docs/design/claude-design-brief.md) (with verified palettes in its appendix) |
| [tools/directions/](tools/directions/README.md) | Contrast checker, seeded palettes and the canvas generator, with how to republish |

## The Claude Design canvas

<https://claude.ai/artifact/9DKJGmK7kPdEt2giN4qDgP> — private until the user shares it.

- **Layout:** a cover board (`Main`, Phase 1's three directions), then one row per direction: `<Name>-Foundations`,
  `<Name>-Components` (light and dark side by side) and `<Name>-Checkout` (a composed "Checkout details" screen with
  Tweaks for `dark` and `dialog`).
- **C2 · Chroma Luminous** (its own page, files `Luminous-*`, interactive — press Play to try hover, press and
  focus). Pearl and obsidian neutrals; an eight-hue prism; frosted glass buttons whose primaries carry five prism
  tones at one lightness that drift on hover; 1 px chrome rings (gunmetal on pearl, silver on obsidian) that glint;
  two glass tiers; sparks; diffuse ambient prism light.
  Selected and on states trade chrome for prism. Foundations adds Prism, Chrome, Glass, Light that moves and fallback
  sections. The checkout opens in dark.
- **A · Loom** — calm, tactile, warm. Spruce accent, Besley with Atkinson Hyperlegible Next, stitched edges.
- **B · Instrument** — precise, technical. Graphite with one signal orange, Instrument Sans with Martian Mono,
  hairlines and tick marks. The orange fill is 2.75:1 against the canvas, so filled buttons carry an ink border.
- **C · Chroma** — expressive. Fuchsia and lime, Bricolage Grotesque with Figtree, pills and colour fields.
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
| C2 details (2026-10-05) | Multi-tone fills on checkboxes, radios, switches and steps · **dark is the primary scheme** · Phosphor icons, regular weight · **Bricolage Grotesque** for headings (wider faces tried and rejected) · wider neon spectrum parked as future exploration. **Locked in [ADR-0009](docs/architecture/adr/0009-visual-direction-chroma-luminous.md).** |
| Approved with the plan | Native CSS core with Tailwind only as a generated bridge · WCAG 2.2 AA + 2.4.13 AAA focus + 44px targets under `(any-pointer: coarse)` · Baseline "newly available" fidelity floor · DTCG 2025.10 tokens via Terrazzo · pnpm workspace from Pass 3 · lockstep versions · open-licensed fonts and icons. |

## Waiting on the user

1. ~~Pick the display face~~ — Bricolage Grotesque; the look is locked in ADR-0009. Further canvas feedback is still
   welcome as refinements.
2. **npm scope** — an empty npm user scope `lue-ui` already exists. Is it the user's? If not, use `@lueui/*`. Then the
   user creates the npm and GitHub organisations (outward-facing; not for an agent to do unasked).
3. **[ADR-0004](docs/architecture/adr/0004-support-floors.md) inclusion exception** — a ~2 KB conditional invokers
   polyfill plus a `closedby` fallback, so buttons still open dialogs on Safari older than 26.2 (e.g. iOS 18).

Lower-priority open questions are listed at the end of [RFC-0001](docs/architecture/rfc-0001-architecture.md#open-questions).

## Next: Pass 2 — codify the chosen direction

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

Remaining:

1. **Create the Claude Design "Design System" artifact** — private, never shared within the organisation, built with
   `lue` names. Run Artifact `quickstart` with intent `other`, then publish with the Design System `type_url` and a
   title, and no files. Follow the instructions in the create result, and read its reference pages (format, craft,
   cover, from-code) before writing anything:
   - files live under `project/`;
   - a brand-book `README.md`;
   - `tokens.json` in its **list** shape, with themes `dark`, `light`, `dark-more`, `light-more` (primary first), and
     literal `oklch()` values (no `var()`, `color-mix()` or named colours) — convert from `packages/tokens/src`, not by
     hand;
   - per component and content block, `components/<Comp>/README.md` and a `preview.html` whose line 1 is a `@dsCard`
     comment;
   - `components/bundle.css` and the fonts — **ask the user before downloading** the Bricolage Grotesque, Figtree and
     Spline Sans Mono files (state source and size). Latin woff2 sizes from Google Fonts (checked 2026-10-05):
     Bricolage with all axes 128 KB, or **75 KB without the unused width axis** (`opsz,wght@12..96,300..600`);
     Figtree 19 KB (+ italic 20 KB, loaded only when used); Spline Sans Mono 35 KB. **Budget raised to 130 KB**
     (user, 2026-10-10), so the mono micro-labels stay. **Heading face still open:** Bricolage's *f* is hard to read;
     the canvas compares Funnel Display (17 KB), Host Grotesk (19 KB), Epilogue (34 KB) and Schibsted Grotesk (45 KB,
     400+ only) — wait for the user's pick before downloading fonts;
   - the `design-system.json` index, written **last**.
2. **Archive the Phase 1 page** on the canvas if the user wants it gone (it's regenerable from the repo).

## Then: Pass 3 — tracer bullet

Follow [RFC-0001 §11](docs/architecture/rfc-0001-architecture.md#11-sequencing-pass-3), riskiest first:

1. pnpm workspace, Changesets and CI.
2. Spike A: a dialog containing a menu, in raw HTML and in React with SSR and hydration, in Chromium, Firefox and
   WebKit.
3. Spike B: Terrazzo → `tokens.css` + Claude Design JSON + contrast lint → Lightning CSS → consumer fixtures.
4. Spike C: one Claude Design preview with the elements IIFE through `/design-sync`.
5. Then Button → Field + error summary → Select → Dialog → Menu.

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
