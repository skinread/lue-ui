# Landscape and positioning

> **Status:** Research snapshot · data as of **2026-10-03** · written 2026-10-05
> **Scope:** architecture, process and gaps. We study other systems to learn how they are *built* — never to borrow
> their look. Our visual identity is original ([principle 11](./mission-and-principles.md#11-distinctive-not-decorative)).

## Summary

- **React headless has consolidated.** Base UI and React Aria lead; Radix has slowed; Headless UI hasn't released
  since April 2025.
- **Distribution moved to open-code registries** (shadcn-style), shipped with AI tooling: MCP servers, `llms.txt`,
  agent skills.
- **Tokens have a stable standard:** DTCG 2025.10.
- **Most native overlay primitives are Baseline** — popover, invoker commands, anchor positioning, `<dialog>`.
- **The opening:** no mainstream system combines native overlays with full keyboard models, native validation,
  multi-brand OKLCH theming from DTCG, forced-colours rigour, and a light-DOM core that works with any framework.

## Library snapshot

### Headless and React-centric

| Library | Architecture and accessibility | 2025–26 | Weaknesses |
| --- | --- | --- | --- |
| [Base UI](https://base-ui.com/react/overview/releases) | Unstyled React parts; follows APG; publishes [`llms.txt`](https://base-ui.com/llms.txt) | v1.0 on 11 Dec 2025; v1.8 (Sep 2026) adds Drawer, OTPField | React only; positions overlays in JS |
| Radix Primitives / Themes | Unstyled primitives plus a styled layer | Themes repo [quieter in 2026](https://github.com/radix-ui/themes) | No longer shadcn's default |
| [React Aria Components](https://react-aria.adobe.com/releases/v1-21-0) | Hooks + components; tested with VoiceOver, JAWS, NVDA, TalkBack ([quality](https://react-aria.adobe.com/quality)); [native constraint validation by default](https://react-aria.adobe.com/forms) | [MCP server, skills, `.md` docs](https://react-aria.adobe.com/ai) | Heavy; React only |
| [Ark UI / Zag.js](https://github.com/chakra-ui/ark/releases) | State machines with React, Vue, Solid, Svelte adapters | Parity across four frameworks | No vanilla/web-component adapter; JS-heavy |
| [Headless UI](https://github.com/tailwindlabs/headlessui/releases) | React and Vue | Last release April 2025; Tailwind Labs [joined Shopify in Sep 2026](https://www.theregister.com/devops/2026/09/10/shopify-extends-lifeline-to-tailwind-as-vibe-coding-erodes-web-dev-platforms-bottom-line/5295672) | Effectively dormant |
| [Ariakit](https://ariakit.org/updates) | Low-level React primitives | 0.4.x; Solid port in progress | Pre-1.0 |
| [shadcn/ui](https://ui.shadcn.com/docs/changelog) | Open-code registry + CLI; accessibility inherited from the chosen base | Base UI default (Jul 2026); [React Aria base](https://ui.shadcn.com/docs/changelog/2026-07-react-aria); MCP, skills, private registries, RTL | Copied code drifts; [Button](https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/registry/new-york-v4/ui/button.tsx) uses `outline-none` + box-shadow ring (fails in forced colours) |

### CSS-first and methodologies

- **[daisyUI 5](https://daisyui.com/docs/changelog/)** — Tailwind v4 plugin, zero JS, OKLCH theme variables, size and
  radius variables, popover + anchor dropdowns. Accessibility is left to the author
  ([validator docs](https://daisyui.com/components/validator/) don't cover ARIA wiring).
- **Pico CSS** — classless; maintainer gap since March 2025 ([community fork](https://github.com/Yohn/PicoCSS)).
- **[Open Props UI](https://open-props-ui.netlify.app/html/)** — copy-paste components; themes from hue/chroma inputs;
  no stated accessibility method.
- **[Basecoat](https://basecoatui.com/introduction/)** — plain HTML + Tailwind + a little vanilla JS.
- **[Tailwind Plus Elements](https://tailwindcss.com/blog/vanilla-js-support-for-tailwind-plus)** — headless light-DOM
  custom elements on `<dialog>`, popover, invoker commands and ElementInternals. **Closest architecture to ours**, but
  paid, and closed to new customers since Sep 2026.
- **Methodologies:** Every Layout (intrinsic layout primitives), CUBE CSS, and Utopia fluid scales — now with
  [container-unit scales](https://utopia.fyi/space/calculator/).

### Web components

| System | Notes |
| --- | --- |
| Web Awesome 3.x | Shadow DOM + tokens + cascade layers; ["native styles"](https://webawesome.com/docs/utilities/native/) for plain elements; [`llms.txt`](https://webawesome.com/llms.txt) |
| [Polaris web components](https://shopify.dev/changelog/polaris-unified-web-components-are-now-stable) | Stable since Oct 2025, CDN-served, invoker-style API ([`commandFor` + `--show`](https://shopify.dev/docs/api/app-home/polaris-web-components/overlays/modal)) — the commerce peer |
| Spectrum Web Components 2nd gen | [Abstract core classes separated from rendering](https://github.com/adobe/spectrum-web-components/blob/main/CONTRIBUTOR-DOCS/README.md) |
| Material Web | [Maintenance mode](https://github.com/material-components/material-web/discussions/5642) since 2024 |
| Fluent v3 / FAST | [RFC (Sep 2026)](https://github.com/microsoft/fluentui/pull/36807) makes CSS anchor positioning the default |
| Carbon | Lit 3; moving to popover/anchor [is backlogged](https://github.com/carbon-design-system/carbon/issues/22242) because portalled popovers inside dialogs become inert |
| [Lion](https://github.com/ing-bank/lion) | White-label Lit base, WCAG 2.2 AA target |
| Primer | [v38 dropped styled-components for CSS Modules](https://github.com/primer/react/discussions/7086); tokens moving to DTCG |
| [Nord 5](https://nordhealth.design/updates/july-2026-component-updates/) | Light-DOM APIs and `llms.txt` (Jul 2026) |

### Public-sector leaders

- **GOV.UK Frontend [v6](https://github.com/alphagov/govuk-frontend/releases/tag/v6.0.0)** — roadmap covers dark mode
  and more custom properties ([roadmap](https://design-system.service.gov.uk/community/roadmap/)); its validation
  guidance is to [turn off HTML5 validation](https://design-system.service.gov.uk/patterns/validation).
- **USWDS Elements** — [pre-release](https://github.com/uswds/uswds-elements).
- **Australia** — the federal AGDS was
  [discontinued in 2021](https://www.morpht.com/blog/australian-government-design-system-dead-long-live-gold);
  the live reference is [AgDS](https://design-system.agriculture.gov.au/about) (React + runtime CSS-in-JS, independently
  audited to WCAG 2.1 AA with assistive-technology users).
- **NL Design System** — [brand → common → component token tiers](https://nldesignsystem.nl/handboek/huisstijl/design-tokens/),
  a theme per organisation, and a [relay maturity model](https://nldesignsystem.nl/handboek/estafettemodel/) where a
  component must work in at least two brand themes to progress.

## Tokens and colour

- **[DTCG 2025.10 is stable](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/)**
  — Format (types, composites, aliases, `$extends`), Color (CSS Color 4 spaces incl. OKLCH and Display P3) and
  [Resolver](https://www.designtokens.org/tr/2025.10/resolver/) (sets, modifiers, contexts). The resolver is still
  evolving ([Sep 2026 draft](https://www.designtokens.org/tr/drafts/resolver/)).
- **Tooling:** [Style Dictionary](https://styledictionary.com/info/dtcg/) says its 2025.10 support is incomplete;
  [Terrazzo](https://terrazzo.app/docs/integrations/css/) supports resolvers, permutations, OKLCH gamut mapping and a
  [plugin API](https://terrazzo.app/docs/reference/plugin-api/) — our choice
  ([ADR-0003](../architecture/adr/0003-dtcg-tokens-with-terrazzo.md)).
- **[Tailwind v4 `@theme`](https://tailwindcss.com/docs/theme)** turns tokens into utilities but isn't DTCG-aware —
  a generated bridge covers it.
- **Contrast:** APCA is not part of the WCAG 3 draft ([status](https://yatil.net/blog/wcag-3-is-not-ready-yet)), so
  WCAG 2.x ratios stay the legal gate. `contrast-color()` is Baseline but only returns black or white.

## AI-era distribution

- **Open code is overtaking packages** — shadcn supports three bases, private registries and registry validation.
- **Machine-readable surfaces are expected** — `llms.txt` (Base UI, React Aria, Web Awesome, daisyUI, Nord), MCP
  servers (shadcn, React Aria, daisyUI, [Storybook](https://storybook.js.org/docs/ai/mcp/overview) — preview, React/
  Angular/Vue manifests only), agent skills, and design-to-code links such as
  [Code Connect](https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect).
- **Still missing everywhere:** a shared, *checkable* format for accessibility behaviour, token meaning and usage
  rules.

## Trends, 2025–2026

1. **Headless consolidation** — Base UI rising, React Aria as the accessibility-rigour tier.
2. **Open-code registries** with a choice of primitive base replace monolithic kits.
3. **AI-readable surfaces** (llms.txt, MCP, skills, manifests) are baseline expectations.
4. **Web components for multi-surface organisations** — and light DOM is coming back
   ([Progressive Web Components](https://arielsalminen.com/2026/progressive-web-components/), Nord 5, Tailwind Elements).
5. **Exit from runtime CSS-in-JS** — Primer to CSS Modules; MUI's Pigment CSS [on hold](https://mui.com/blog/2026-and-beyond/);
   cascade layers become architecture.
6. **OKLCH and P3 by default;** stable DTCG pulls token pipelines together.
7. **Native primitives displace JS positioning** — Fluent now, Carbon planning.
8. **RTL and logical properties are table stakes.**
9. **CSS-tooling vendors are commercially fragile** — favour standards over vendors.

## Gap assessment

| Candidate gap | Verdict | Evidence |
| --- | --- | --- |
| Zero-JS overlays (popover + anchor + invokers) **with full APG keyboard models** | **Open** | CSS-only kits lack keyboard models; headless libraries still position in JS; Carbon blocked by portalled popovers in dialogs |
| Native validation UX (`:user-invalid` + error summary + server parity) | **Open** | GOV.UK disables native validation; React Aria uses native constraints but renders its own UI |
| Multi-brand theming from DTCG resolvers with literal, contrast-tested values | **Open at library level** | NL Design System does multi-brand via tiers; resolvers exist only in tooling |
| Density as a theming axis | **Mostly open** | daisyUI has size variables; no mainstream system treats density as a first-class, tested axis |
| Forced-colours / high-contrast excellence | **Open in the Tailwind ecosystem** | `outline-none` removes outlines in forced colours; shadcn's button relies on it |
| i18n and RTL via logical properties | Closed | shadcn, daisyUI 5, Base UI, React Aria all do it |
| `reading-flow` | Premature | Chrome only |
| Framework-agnostic core with thin adapters | **Partly open** | Zag/Ark, Spectrum, Polaris do it — but no *open*, light-DOM core on native primitives with React 19 adapters |
| Machine-readable accessibility contracts | **Open** | Docs are machine-readable; behaviour contracts aren't |

## Our position

### Follow — table stakes

DTCG tokens · OKLCH colour · cascade layers · logical properties and RTL · container queries · native `<dialog>`,
popover and `<details>` · `llms.txt`, Markdown docs and MCP · an optional open-code registry for the React adapters.

### Trail-blaze — where we lead

1. **Platform-native interaction layer.** Popover + anchor positioning + invoker commands + `<dialog>` + customizable
   `<select>` + `<details name>`; no portals (the top layer handles stacking); tiny light-DOM elements only for the
   keyboard models the platform lacks. Full APG behaviour, near-zero JS, server-component-safe React.
2. **Native validation done right.** Constraint validation + `:user-invalid` + an accessible error summary + server
   errors in the same shape.
3. **Theme engine.** DTCG resolver over brand × scheme × contrast × density, emitting literal values per context
   that CI contrast-tests and Claude Design and Figma can read; forced colours and increased contrast designed per
   component.
4. **Density as a first-class theming axis,** tested alongside coarse-pointer target sizing.
5. **Machine-readable accessibility contracts** that generate tests, docs, `llms.txt`/MCP context and Claude Design
   guidelines.
6. **Claude Design on production CSS.** HTML-first previews render the real system, not a redrawing of it.

### Deliberately not doing (yet)

Shadow DOM for core components · hover-only "interest" UI (`interestfor` is Chromium-only and WebKit opposes it) ·
complex application widgets (data grid, rich text) · a utility framework.

## Prior art to study

For architecture and process only:

| What | Learn from |
| --- | --- |
| Light-DOM elements on native primitives | Tailwind Plus Elements, Progressive Web Components, Nord 5 |
| Invoker-style API at commerce scale | Polaris web components |
| Multi-brand governance and maturity model | NL Design System |
| Accessibility test rigour | React Aria (pattern testers, AT matrix) |
| Validation and error-summary patterns | GOV.UK Frontend |

## Lower-confidence claims

- Whether Figma's native DTCG import/export has fully rolled out.
- How Web Awesome positions popovers internally.
- `contrast-color()` support data (from secondary sources).
- Forced-colours quality in government and enterprise systems (not re-verified).
