# AGENTS guide for Lue UI

Lue UI is an open-source, platform-native, accessibility-first design system. This file is the
primary reference for agents working in this repo.

> **Starting a new session?** If a `HANDOVER.md` exists at the root, read it first: a maintainer's local working notes
> (gitignored, never committed). The public status is the [README roadmap](README.md#roadmap).

## Current state

- **Pass 3 (tracer bullet) is done but for Spike C** (a maintainer starts `/design-sync`; `pnpm design-kit` builds its
  input); **Pass 4 (all of Tier 1, contract-driven keyboard coverage, `llms.txt` and an MCP server) is done; Pass 5
  (Tier 2, docs pages, the Storybook MCP addon, contract-generated guidelines, first public release) is in progress -
  only the release, Spike C and the manual screen-reader pass are left.** `packages/tokens/src` is the hand-edited DTCG source, built by Terrazzo with contrast and material gates;
  `packages/css/src` holds one file per component; elements and React build per file with size budgets. Every Tier 0, 1 and 2
  component is built: one contract per component (Layout covers the six primitives) lives in `apps/docs/contracts`
  (schema v1), each with a React adapter (every prop has JSDoc, which react-docgen shows on its Storybook docs page and
  in its Markdown page), Storybook 10 stories and keyboard, axe, emulation, static-markup and visual tests in
  three engines. Follow [RFC-0001 §11](docs/architecture/rfc-0001-architecture.md#11-sequencing-pass-3); progress is in
  the [README roadmap](README.md#roadmap).
- **pnpm workspace** (`packages/*`, `apps/*`, `fixtures/*`). Run `pnpm check` (lint, types, token build with its
  contrast and material gates, contracts and their keyboard coverage, the AI docs, static markup, the MCP server) and `pnpm test` (builds, then three engines; `pnpm test:engines` runs them one at a time, steadier on a
  4-core machine) before committing; `pnpm fixtures` after `pnpm build` checks the consumer recipes. A new component needs a contract (with a
  `summary` and `guidance`), an adapter with JSDoc on every prop, stories and `tests/<component>/` that press every key its keyboard map names, or `pnpm check`
  fails. Visual baselines are Linux-only: update them with
  `pnpm vitest run tests/visual --update` on Linux and review the PNGs. Every
  package is `"private": true` - **nothing is published to npm yet**.
- `tools/directions/` holds dependency-free design scripts (contrast checks, the Claude Design canvas and Design System
  generators) - see its [README](tools/directions/README.md).
- **The Claude Design files stay private.** The canvas and the Claude Design System are never
  shared within the organisation or made public. The library itself is open source and will be published to npm and
  GitHub - but creating orgs, pushing and publishing are outward-facing, so ask first.
- **Git:** work directly on `develop`, no feature branches. Commit as you go, in logical units with conventional
  messages (`docs:`, `feat(tools):`, `chore:`). `develop` is the default branch (2026-10-24); `main` holds only the initial commit. The remote is `origin`
  (`skinread/lue-ui` on GitHub, public); push `develop` only when asked.

- **No em dashes, escaped or not.** Write a normal dash (`-`): never the em
  dash character, and never a dash as a Unicode escape (backslash, `u`, `2014`). When a script writes JSON, keep
  characters unescaped (Python: `ensure_ascii=False`). `pnpm lint` fails on either (`tools/check-text.mjs`).

## Read first

1. [Mission, values and principles](docs/foundations/mission-and-principles.md) - every decision must trace back to a
   principle. If it can't, flag it.
2. [RFC-0001: System architecture](docs/architecture/rfc-0001-architecture.md) and the ADRs in
   [docs/architecture/adr/](docs/architecture/adr/).
3. [Token specification](docs/design/tokens.md) and [component inventory](docs/design/components.md).

Full map: [docs/README.md](docs/README.md).

## Quick decisions

- **Changing a decision?** Write or update an ADR (context, decision, consequences, alternatives, principles
  served). Significant new work starts as an RFC.
- **Adding a platform claim?** Link a source and say when it was checked; update
  [platform capabilities](docs/foundations/platform-capabilities.md) if the status changed.
- **New component idea?** Add it to the [inventory](docs/design/components.md) with its primitive, pattern,
  JavaScript need, Baseline dependencies and fallback before anything else.
- **Principles conflict?** Access → correctness → resilience → performance → expressiveness → convenience.

## Non-negotiables for future code

- **Platform ladder:** native element → native attribute → CSS → ARIA → light-DOM script → framework adapter. Use the
  lowest rung that meets the accessibility contract.
- **Core = Baseline newly available** (Chrome, Firefox, Safari). Newer features only behind `@supports` or feature
  detection, with an accessible fallback. Never put non-Baseline functions or `light-dark()` inside custom properties.
- **CSS:** everything in `@layer lue`; specificity capped at one class (qualifiers in `:where()`); variants as
  `data-*` attributes; state only from native pseudo-classes and ARIA; logical properties only; no `!important`
  except `[hidden]`.
- **No Shadow DOM for core components, no portals, no runtime CSS-in-JS, no Tailwind/DaisyUI in the core.**
- **Elements ↔ React:** elements never restructure framework-rendered DOM; owned attributes are declared in the
  contract ([ADR-0007](docs/architecture/adr/0007-package-layout-and-ownership.md)).
- **Accessibility gates fail the build** in Chromium, Firefox and WebKit
  ([ADR-0005](docs/architecture/adr/0005-three-engine-testing-and-a11y-gates.md)).
- **Fonts and icons** must be open-licensed (OFL, MIT, ISC) and self-hostable.

## Name and identifiers

**Lue UI** ([ADR-0008](docs/architecture/adr/0008-name-lue-ui.md)): CSS prefix `lue`, slug `lue-ui`, npm scope `@lue-ui/*`
(provisional - fallback `@lueui/*`), global `LueUI`. The canvas mockups' internal classes still use `ns-`, the
working title's prefix; that's fine.

## Tooling (from Pass 3)

pnpm workspace · Terrazzo (tokens) · Lightning CSS (bundling, no lowering) · Storybook 10 · Vitest browser mode +
Playwright (Chromium, Firefox, WebKit) · `@eslint/css` and html-eslint (`use-baseline`) · Changesets (lockstep).
