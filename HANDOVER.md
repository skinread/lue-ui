# Handover — never-ui, end of Phase 1

> Written 2026-10-05 when the Phase 1 session closed. A fresh session should read this file, then
> [AGENTS.md](AGENTS.md), then [mission and principles](docs/foundations/mission-and-principles.md).

## Where things stand

- **Phase 1 (foundations and design kickoff) is complete and paused for the user's review.** There is no library code,
  by design.
- **Repo:** `/Volumes/Code/never-ui/never-ui` — the git root is the *nested* folder. Branch `main`, one initial commit
  (MIT `LICENSE`, `.gitignore`, `.gitattributes`), no remote.
- **Everything from Phase 1 is uncommitted.** The user hasn't asked for a commit — don't commit or push unless asked.
- **A Claude Design canvas with three visual directions** is published and waiting for the user's art direction.

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

- **Layout:** a cover board (`Main`), then one row per direction: `<Name>-Foundations`, `<Name>-Components` (light and
  dark side by side) and `<Name>-Checkout` (a composed "Checkout details" screen with Tweaks for `dark` and `dialog`).
- **A · Loom** — calm, tactile, warm. Spruce accent, Besley with Atkinson Hyperlegible Next, stitched edges.
- **B · Instrument** — precise, technical. Graphite with one signal orange, Instrument Sans with Martian Mono,
  hairlines and tick marks. The orange fill is 2.75:1 against the canvas, so filled buttons carry an ink border.
- **C · Chroma** — expressive. Fuchsia and lime, Bricolage Grotesque with Figtree, pills and colour fields.
- **Contrast:** all 216 declared pairs (36 × 3 directions × light/dark) pass WCAG 2.x.
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
| Approved with the plan | Native CSS core with Tailwind only as a generated bridge · WCAG 2.2 AA + 2.4.13 AAA focus + 44px targets under `(any-pointer: coarse)` · Baseline "newly available" fidelity floor · DTCG 2025.10 tokens via Terrazzo · pnpm workspace from Pass 3 · lockstep versions · open-licensed fonts and icons. |

## Waiting on the user

1. **Direction** — pick one, or a blend, through comments on the canvas.
2. **Name** — [shortlist](docs/foundations/naming.md); favourites Evenweave and Kerbcut. Both are free on npm (package
   and scope) and GitHub; trademarks and domains aren't checked yet.
3. **[ADR-0004](docs/architecture/adr/0004-support-floors.md) inclusion exception** — a ~2 KB conditional invokers
   polyfill plus a `closedby` fallback, so buttons still open dialogs on Safari older than 26.2 (e.g. iOS 18).

Lower-priority open questions are listed at the end of [RFC-0001](docs/architecture/rfc-0001-architecture.md#open-questions).

## Next: Pass 2 — codify the chosen direction

1. **Read the canvas and its comments** (Artifact `read`; ArtifactComments `read`). Summarise the art direction back
   to the user and confirm before building on it.
2. **Revise the directions if asked:** edit `tools/directions/` and republish, following its README.
3. **Design the increased-contrast themes** (`light-more`, `dark-more`): every text pair ≥ 7:1 and every boundary
   ≥ 4.5:1. Add them to `palettes.mjs` and keep 0 fails.
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
