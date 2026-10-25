# Documentation

Read in this order the first time; every later document traces back to the first one.

## Foundations - why

| Document | What it settles |
| --- | --- |
| [Mission, values and principles](foundations/mission-and-principles.md) | Mission, vision, values, the 11 principles, trade-off order, non-goals, accessibility commitments |
| [Naming](foundations/naming.md) | How the name Lue UI was reached: three rounds, availability and clash checks |
| [Landscape and positioning](foundations/landscape-and-positioning.md) | Library survey, trends, gaps, what we follow and where we lead |
| [Platform capabilities](foundations/platform-capabilities.md) | The browser capability matrix, support policy, CSS traps and progressive enhancement |

## Architecture - how

| Document | What it settles |
| --- | --- |
| [RFC-0001: System architecture](architecture/rfc-0001-architecture.md) | Packages, CSS conventions, tokens and theming, behaviour, React adapters, contracts, quality gates, risks |
| [ADR-0001](architecture/adr/0001-component-model.md) | HTML+CSS core, light-DOM elements, React adapters |
| [ADR-0002](architecture/adr/0002-native-css-core-tailwind-bridge.md) | Native CSS core; Tailwind as a generated bridge |
| [ADR-0003](architecture/adr/0003-dtcg-tokens-with-terrazzo.md) | DTCG 2025.10 tokens built with Terrazzo |
| [ADR-0004](architecture/adr/0004-support-floors.md) | Baseline fidelity floor, no polyfills (the inclusion exception was declined) |
| [ADR-0005](architecture/adr/0005-three-engine-testing-and-a11y-gates.md) | Three-engine testing and failing accessibility gates |
| [ADR-0006](architecture/adr/0006-licence-and-governance.md) | MIT licence and open governance |
| [ADR-0007](architecture/adr/0007-package-layout-and-ownership.md) | Package layout, versioning, element ↔ framework ownership |
| [ADR-0008](architecture/adr/0008-name-lue-ui.md) | The name Lue UI and its identifiers (`lue`, `lue-ui`, `@lue-ui/*`, `LueUI`) |
| [ADR-0009](architecture/adr/0009-visual-direction-chroma-luminous.md) | The visual direction: C2 · Chroma Luminous - chrome, glass, colour as light |
| [Spike A](architecture/spikes/spike-a-dialog-menu.md) | A menu inside a modal dialog, HTML and React, SSR and hydration - what held and what each engine needed |
| [Spike B](architecture/spikes/spike-b-token-and-css-pipeline.md) | Terrazzo tokens → Lightning CSS → Vite, Next and Tailwind fixtures, and the emulation tests |
| [Consumer fixtures](../fixtures/README.md) | The import recipes for Vite, Next and Tailwind v4, and what each pipeline does to our CSS |

## Design - what

| Document | What it settles |
| --- | --- |
| [Token specification](design/tokens.md) | Tiers, naming grammar, colour roles, contrast bands, theming axes, outputs |
| [Component inventory and contracts](design/components.md) | Every component's primitive, pattern, JavaScript need and tier; the contract format |
| AI surfaces | `pnpm docs-ai` writes `llms.txt`, a Markdown page per component, tokens and contracts to `apps/docs/public` (served by Storybook); [`packages/mcp`](../packages/mcp/README.md) serves them over MCP |
| [Component contracts](../apps/docs/contracts/) | The written contracts (one per component: Tier 0, Tier 1 and Tier 2 so far) and schema v1, checked by `pnpm check` |
| [Claude Design brief](design/claude-design-brief.md) | Creative mandate, non-negotiables, the three seeded directions and their contrast matrices |

## Conventions for these docs

- Every document opens with a status line: status, phase, date.
- Every platform claim links a source and states when it was checked.
- Significant changes start as an RFC; accepted decisions become ADRs (context, decision, consequences, alternatives,
  principles served).
- The system is **Lue UI** ([ADR-0008](architecture/adr/0008-name-lue-ui.md)): prefix `lue`, slug `lue-ui`, scope
  `@lue-ui/*` (provisional), global `LueUI`.
