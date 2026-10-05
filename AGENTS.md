# AGENTS guide for never-ui

`never-ui` (working title) is an open-source, platform-native, accessibility-first design system. This file is the
primary reference for agents working in this repo.

> **Starting a new session? Read [HANDOVER.md](HANDOVER.md) first** — current state, decisions, what's waiting on the
> user, and the next steps.

## Current state

- **Phase 1 — foundations and design kickoff. Documentation only; no library code yet.**
- `tools/directions/` holds dependency-free design scripts (contrast checks, the Claude Design canvas generator) —
  see its [README](tools/directions/README.md).
- Don't scaffold packages, add `package.json` files or install tooling until Pass 3 begins
  ([RFC-0001 §11](docs/architecture/rfc-0001-architecture.md#11-sequencing-pass-3)).
- Don't commit or push unless asked.

## Read first

1. [Mission, values and principles](docs/foundations/mission-and-principles.md) — every decision must trace back to a
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
- **CSS:** everything in `@layer ns`; specificity capped at one class (qualifiers in `:where()`); variants as
  `data-*` attributes; state only from native pseudo-classes and ARIA; logical properties only; no `!important`
  except `[hidden]`.
- **No Shadow DOM for core components, no portals, no runtime CSS-in-JS, no Tailwind/DaisyUI in the core.**
- **Elements ↔ React:** elements never restructure framework-rendered DOM; owned attributes are declared in the
  contract ([ADR-0007](docs/architecture/adr/0007-package-layout-and-ownership.md)).
- **Accessibility gates fail the build** in Chromium, Firefox and WebKit
  ([ADR-0005](docs/architecture/adr/0005-three-engine-testing-and-a11y-gates.md)).
- **Fonts and icons** must be open-licensed (OFL, MIT, ISC) and self-hostable.

## Placeholders

`never-ui`, the CSS prefix `ns`, the npm scope `@ns/*` and the global `NS` are placeholders until a name is chosen
([naming](docs/foundations/naming.md)).

## Tooling (from Pass 3)

pnpm workspace · Terrazzo (tokens) · Lightning CSS (bundling, no lowering) · Storybook 10 · Vitest browser mode +
Playwright (Chromium, Firefox, WebKit) · `@eslint/css` and html-eslint (`use-baseline`) · Changesets (lockstep).
