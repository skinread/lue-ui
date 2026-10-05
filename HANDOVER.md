# Handover — never-ui, Pass 2 in progress

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
- **Private, never published (user's rule, 2026-10-05):** the design system is always kept private. Artifacts stay
  private and unshared; nothing is pushed publicly or published to npm. Whether this replaces the open-source plan in
  the docs (README, [ADR-0006](docs/architecture/adr/0006-licence-and-governance.md)) is waiting on the user.
- **Git workflow (user's decision, 2026-10-05):** commit as you go on `develop`, in logical units. No feature branches.
  Don't push unless asked.
- **The Claude Design canvas** has two pages: **C2 · Chroma Luminous** (opens first) and **Phase 1 · three
  directions**. The user likes C2's direction and its prism hues (2026-10-05); the second round made buttons frosted
  glass with multi-tone primaries and the ambient light more diffuse.

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
- **Contrast:** all 288 declared pairs (36 × 4 palettes × light/dark) pass WCAG 2.x, and all 62 Luminous prism,
  chrome, glass, glass-button and ambient-light rules pass. Glass is checked worst-case — over white, black and every fill, through
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
| Approved with the plan | Native CSS core with Tailwind only as a generated bridge · WCAG 2.2 AA + 2.4.13 AAA focus + 44px targets under `(any-pointer: coarse)` · Baseline "newly available" fidelity floor · DTCG 2025.10 tokens via Terrazzo · pnpm workspace from Pass 3 · lockstep versions · open-licensed fonts and icons. |

## Waiting on the user

1. **Reaction to C2 · Chroma Luminous** — what to push, pull back or change. Open questions in the brief: a more
   extended display face, whether dark is the default scheme, how far to push Display P3, the icon weight.
2. **Name** — round 1 didn't land. [Round 2](docs/foundations/naming.md#round-2--light-prism-and-glass) follows the
   luminous look: Prismway and Clearprism lead, then Everyhue, Plainlight and Fullhue — all free on npm (package and
   scope) and GitHub; trademarks and domains aren't checked yet.
3. **[ADR-0004](docs/architecture/adr/0004-support-floors.md) inclusion exception** — a ~2 KB conditional invokers
   polyfill plus a `closedby` fallback, so buttons still open dialogs on Safari older than 26.2 (e.g. iOS 18).

Lower-priority open questions are listed at the end of [RFC-0001](docs/architecture/rfc-0001-architecture.md#open-questions).

## Next: Pass 2 — codify the chosen direction

1. ~~Read the canvas and its comments; summarise the art direction.~~ Done 2026-10-05: the direction came in chat
   (C2 · Chroma Luminous). Keep reading comments on the canvas each session — the user may art-direct there.
2. **Iterate C2 with the user:** edit `tools/directions/` (`palettes.mjs`, `luminous-canvas.mjs`, `DIRS.luminous` in
   `build-canvas.mjs`) and republish only changed boards, following its README. When the user is happy, **lock it in
   ADR-0008 (visual direction)** — and, once settled, archive or remove the Phase 1 rows if the user wants.
3. **Design the increased-contrast themes** (`light-more`, `dark-more`): every text pair ≥ 7:1 and every boundary
   ≥ 4.5:1. Add them to `palettes.mjs` and keep 0 fails. For C2, glass is opaque and chrome is a solid line in these
   themes.
4. **Fill the full token set** from [tokens.md](docs/design/tokens.md): type steps −2…5 at 360 px and 1280 px, space
   `3xs`–`3xl`, radius, border, elevation per scheme, motion, focus, sizes.
5. **Create the Claude Design "Design System" artifact.** Run Artifact `quickstart` with intent `other`, then publish
   with the Design System `type_url` and a title, and no files. Follow the instructions in the create result, and read
   its reference pages (format, craft, cover, from-code) before writing anything:
   - files live under `project/`;
   - a brand-book `README.md`;
   - `tokens.json` in its **list** shape, with themes `light`, `dark`, `light-more` and `dark-more`, and literal
     `oklch()` values (no `var()`, `color-mix()` or named colours);
   - per component, `components/<Comp>/README.md` and a `preview.html` whose line 1 is a `@dsCard` comment;
   - `components/bundle.css` and the fonts;
   - the `design-system.json` index, written **last**.
6. **Mirror the values into the repo** as DTCG 2025.10 JSON under `packages/tokens/src/`, using the layout in
   tokens.md. This is JSON only; the Terrazzo build arrives in Pass 3. The contrast matrix must stay green.
7. **If a name is chosen:** write ADR-0008, replace the `never-ui` / `ns` / `@ns/*` / `NS` placeholders across the docs,
   and follow "Once a name is chosen" in [naming.md](docs/foundations/naming.md).

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
