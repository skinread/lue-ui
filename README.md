# Lue UI

> An open-source, platform-native, accessibility-first design system. *Lueur* is French for a glimmer of light.
> **Status:** Pass 2 — codifying the visual direction, C2 · Chroma Luminous. There is no library code yet.

**Mission:** make accessible, standards-based interfaces the path of least resistance — by building _with_ the web
platform, not on top of it.

## What's different

- **Platform-native interaction.** Dialogs, menus, popovers, disclosures and selects built on `<dialog>`, `popover`,
  invoker commands, anchor positioning and `<details>`. No portals, near-zero JavaScript, full keyboard models.
- **One core, many frameworks.** Components are semantic HTML plus CSS. Small light-DOM custom elements fill the gaps
  the platform leaves, and thin React 19 adapters render the same markup.
- **Accessible by construction.** WCAG 2.2 AA is the floor, plus AAA focus appearance and touch target sizes. Every
  colour pair is contrast-tested in every theme, and accessibility checks fail the build in Chromium, Firefox and
  WebKit.
- **A theme is a file, not a fork.** DTCG 2025.10 tokens resolve across brand × scheme × contrast × density into plain
  CSS.
- **Legible to humans and agents.** Contracts, tokens and docs are published as data for people, AI tools and Claude
  Design alike.

## Read the foundations

| Start here | |
| --- | --- |
| [Mission, values and principles](docs/foundations/mission-and-principles.md) | Why the system exists and the 11 principles every decision traces to |
| [Landscape and positioning](docs/foundations/landscape-and-positioning.md) | What others do, where the gaps are, where we lead |
| [Platform capabilities](docs/foundations/platform-capabilities.md) | What evergreen browsers support today, and our support policy |
| [Architecture (RFC-0001)](docs/architecture/rfc-0001-architecture.md) | Packages, CSS conventions, tokens, behaviour, adapters, quality gates |
| [Token specification](docs/design/tokens.md) | Tiers, naming, theming axes, contrast by construction |
| [Component inventory](docs/design/components.md) | Every component's platform primitive, pattern and JavaScript need |
| [Claude Design brief](docs/design/claude-design-brief.md) | The creative brief, the Phase 1 directions and the chosen one, C2 · Chroma Luminous |

Full index: [docs/](docs/README.md).

## Roadmap

1. **Phase 1 — foundations and design kickoff** _(done)_: principles, research, architecture, token and component
   specs, and three visual directions in Claude Design.
2. **Pass 2 — codify the chosen direction** _(now)_ as a Claude Design system and DTCG token source.
3. **Pass 3 — tracer bullet:** workspace, token pipeline, and Button, Field, Select, Dialog and Menu, tested in three
   engines.
4. **Pass 4 — Tier 1 components,** contracts-driven tests, `llms.txt` and MCP.
5. **Pass 5 — Tier 2 and a first public 0.x release.**

## Licence

[MIT](LICENSE) © 2026 Sean Kinread
