# Lue UI

> An open-source, platform-native, accessibility-first design system. *Lueur* is French for a glimmer of light.
> **Status:** Pass 3, the tracer bullet, is complete apart from Spike C: tokens, CSS, elements and React adapters build,
> and the first five components are tested in three engines. Every package is private; nothing is on npm yet.

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

## Packages

| Package | What it is |
| --- | --- |
| [`@lue-ui/tokens`](packages/tokens/README.md) | DTCG 2025.10 source, built by Terrazzo into `tokens.css`, `tokens.js`, a Tailwind v4 bridge, Figma and Claude Design files. The build fails on any contrast pair or material rule below its minimum |
| [`@lue-ui/css`](packages/css/README.md) | Component CSS in `@layer lue`, built by Lightning CSS with nothing lowered, and the self-hosted fonts |
| [`@lue-ui/elements`](packages/elements/README.md) | Light-DOM custom elements and opt-in behaviours (`<lue-menu>`, `<lue-toast-region>`, `data-lue-validate`, `data-lue-toggle`), and a script-tag build |
| [`@lue-ui/react`](packages/react/README.md) | React 19 adapters that render the same markup as the HTML core |
| [`@lue-ui/mcp`](packages/mcp/README.md) | An MCP server for AI assistants: components, contracts and tokens |
| [`apps/docs`](apps/docs/README.md) | Storybook 10, the component contracts, and `llms.txt` with a Markdown page per component |

Components: **all of Tier 1 and Tier 0** - Button, Toggle button, Link, Field + TextInput + Textarea + error summary,
Select, Checkbox, Radio group, Switch, Dialog, Drawer, Popover, Toggletip, Menu, Disclosure, Accordion, Alert, Toast,
Icon, Skip link, Visually hidden and the layout primitives (Stack, Cluster, Grid, Sidebar, Switcher, Center) - each with a
[contract](apps/docs/contracts/), stories, and keyboard, axe, emulation and visual tests in Chromium, Firefox and WebKit.

```bash
pnpm install
pnpm build      # tokens, CSS, elements, React
pnpm check      # lint, types, token contrast, contracts and their keyboard coverage, AI docs, static markup, MCP
pnpm docs-ai    # llms.txt, a Markdown page per component, tokens and contracts in apps/docs/public
pnpm test       # build, then every browser test in three engines
pnpm test:engines  # the same, one engine at a time (steadier on a small machine)
pnpm fixtures   # consumer recipes: Vite, Next, Tailwind v4
pnpm --filter @lue-ui/docs dev   # Storybook
```

## Roadmap

1. **Phase 1 — foundations and design kickoff** _(done)_: principles, research, architecture, token and component
   specs, and three visual directions in Claude Design.
2. **Pass 2 — codify the chosen direction** _(done)_: C2 · Chroma Luminous, a private Claude Design system and the DTCG
   token source.
3. **Pass 3 — tracer bullet** _(done, but for Spike C)_: workspace, token and CSS pipelines, package builds, consumer
   fixtures, and Button, Field, Select, Dialog and Menu tested in three engines. Spike C (one Claude Design preview
   from the script-tag build) is next.
4. **Pass 4 — Tier 1 components** _(done)_: every Tier 1 component, keyboard coverage driven by the contracts,
   `llms.txt` and a Markdown page per component, and an MCP server.
5. **Pass 5 — Tier 2 and a first public 0.x release.**

## Licence

[MIT](LICENSE) © 2026 Sean Kinread
