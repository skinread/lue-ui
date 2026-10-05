# Documentation

Read in this order the first time; every later document traces back to the first one.

## Foundations — why

| Document | What it settles |
| --- | --- |
| [Mission, values and principles](foundations/mission-and-principles.md) | Mission, vision, values, the 11 principles, trade-off order, non-goals, accessibility commitments |
| [Naming](foundations/naming.md) | The shortlist to replace the `never-ui` working title, with availability |
| [Landscape and positioning](foundations/landscape-and-positioning.md) | Library survey, trends, gaps, what we follow and where we lead |
| [Platform capabilities](foundations/platform-capabilities.md) | The browser capability matrix, support policy, CSS traps and progressive enhancement |

## Architecture — how

| Document | What it settles |
| --- | --- |
| [RFC-0001: System architecture](architecture/rfc-0001-architecture.md) | Packages, CSS conventions, tokens and theming, behaviour, React adapters, contracts, quality gates, risks |
| [ADR-0001](architecture/adr/0001-component-model.md) | HTML+CSS core, light-DOM elements, React adapters |
| [ADR-0002](architecture/adr/0002-native-css-core-tailwind-bridge.md) | Native CSS core; Tailwind as a generated bridge |
| [ADR-0003](architecture/adr/0003-dtcg-tokens-with-terrazzo.md) | DTCG 2025.10 tokens built with Terrazzo |
| [ADR-0004](architecture/adr/0004-support-floors.md) | Baseline fidelity floor and one inclusion exception |
| [ADR-0005](architecture/adr/0005-three-engine-testing-and-a11y-gates.md) | Three-engine testing and failing accessibility gates |
| [ADR-0006](architecture/adr/0006-licence-and-governance.md) | MIT licence and open governance |
| [ADR-0007](architecture/adr/0007-package-layout-and-ownership.md) | Package layout, versioning, element ↔ framework ownership |

## Design — what

| Document | What it settles |
| --- | --- |
| [Token specification](design/tokens.md) | Tiers, naming grammar, colour roles, contrast bands, theming axes, outputs |
| [Component inventory and contracts](design/components.md) | Every component's primitive, pattern, JavaScript need and tier; the draft contract format |
| [Claude Design brief](design/claude-design-brief.md) | Creative mandate, non-negotiables, the three seeded directions and their contrast matrices |

## Conventions for these docs

- Every document opens with a status line: status, phase, date.
- Every platform claim links a source and states when it was checked.
- Significant changes start as an RFC; accepted decisions become ADRs (context, decision, consequences, alternatives,
  principles served).
- `never-ui`, the `ns` prefix and the `@ns/*` scope are placeholders until a name is chosen.
