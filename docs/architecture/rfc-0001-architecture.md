# RFC-0001: System architecture

> **Status:** Proposed · Phase 1 · 2026-10-05
> **Decisions recorded in:** [ADR-0001](./adr/0001-component-model.md) ·
> [0002](./adr/0002-native-css-core-tailwind-bridge.md) · [0003](./adr/0003-dtcg-tokens-with-terrazzo.md) ·
> [0004](./adr/0004-support-floors.md) · [0005](./adr/0005-three-engine-testing-and-a11y-gates.md) ·
> [0006](./adr/0006-licence-and-governance.md) · [0007](./adr/0007-package-layout-and-ownership.md) ·
> [0008](./adr/0008-name-lue-ui.md) · [0009](./adr/0009-visual-direction-chroma-luminous.md)
> **Name:** Lue UI — CSS prefix `lue`, npm scope `@lue-ui/*` (provisional), global `LueUI`.

## Summary

An **HTML-and-CSS core** that works with no framework, **small light-DOM custom elements** only where the platform
lacks a behaviour, and **thin React 19 adapters** that render the same markup. Tokens are **DTCG 2025.10** files
built by **Terrazzo** into literal, contrast-tested CSS for every theming context. Everything is checked in
**Chromium, Firefox and WebKit**, and accessibility checks fail the build.

## Goals

- Meet every [principle](../foundations/mission-and-principles.md) with an automated gate or a named review.
- Make the no-JavaScript path the default path; make the React path render the same thing.
- Make a theme a token file; make every theme contrast-tested before it ships.
- Publish the system so people, AI agents and Claude Design all read the same source.

## Non-goals

Shadow DOM for core components · legacy-browser support · runtime CSS-in-JS · application-scale widgets (data grid,
rich text) in the first releases.

## Overview

```
                ┌──────────────────────────────────────────────────────────────┐
  DTCG tokens ──►  @lue-ui/tokens  (Terrazzo: resolver → literal values per context)  │
                └──┬───────────────┬──────────────────┬───────────────┬────────┘
                   │ tokens.css    │ Tailwind @theme   │ Claude Design │ TS consts / Figma DTCG
                   ▼               ▼                   ▼ tokens.json   ▼
                ┌───────────┐  (optional bridge)   ┌──────────────────────────┐
                │  @lue-ui/css  │◄─────────────────────┤ Claude Design system      │
                │  layers   │   previews = real    │ README · tokens · cards   │
                └─────┬─────┘   HTML + this CSS    └──────────▲───────────────┘
                      │                                        │ /design-sync
   HTML (any stack) ──┤                                        │
                      ▼                                        │
                ┌──────────────┐  shared pure     ┌───────────┴──┐
                │ @lue-ui/elements │◄── controllers ──┤  @lue-ui/react    │ RSC-safe adapters,
                │ light DOM,   │                  │  same markup  │ identical HTML
                │ ≤ 2 KB each  │                  └──────┬────────┘
                └──────────────┘                         │
                                                  apps/docs (Storybook 10, html decorator,
                                                  llms.txt, MCP, contracts → tests)
```

## 1. Packages

| Package | Role | Ships |
| --- | --- | --- |
| `@lue-ui/tokens` | DTCG source + resolver → Terrazzo | `tokens.css`, `tokens.js` + `.d.ts`, `tailwind.css` (`@theme` bridge), `claude-design/tokens.json`, `figma/*.tokens.json` |
| `@lue-ui/css` | All component CSS | `lue.css` (everything), `reset.css`, `base.css`, `components/*.css` |
| `@lue-ui/elements` | Light-DOM custom elements + delegated behaviours | ESM per element, `define` entry points, `lue.iife.js` (`window.LueUI`) |
| `@lue-ui/react` | React 19 adapters | ESM per component, `types` first |
| `apps/docs` | Storybook 10 (react-vite) | Docs site, static previews, `llms.txt`, contracts, MCP |

Layout, versioning and ownership rules: [ADR-0007](./adr/0007-package-layout-and-ownership.md).

## 2. CSS architecture

### Layers

```css
@layer lue {
  @layer reset, tokens, base, layout, components, utilities;
}
```

- Everything the system ships is inside `@layer lue`, so **any unlayered CSS a consumer writes wins** without
  specificity games.
- `reset.css` and `base.css` are **opt-in** files; `components/*.css` assume only tokens.
- Tailwind users import into Tailwind's components layer so utilities still win:
  `@import "@lue-ui/css" layer(components);`

### Naming

| Thing | Pattern | Example |
| --- | --- | --- |
| Component | `.lue-{component}` | `.lue-button` |
| Part | `.lue-{component}__{part}` | `.lue-button__icon` |
| Custom element | `<lue-{name}>` | `<lue-menu>` |
| Public token | `--lue-{category}-{property}-{role}[-{emphasis}][-{state}]` | `--lue-color-bg-accent-strong-hover` |
| Private knob | `--_{name}` (registered, `inherits: false`) | `--_bg` |
| Variant | `data-{variant}` on the component element, unprefixed (scoped by the class) | `data-variant="danger"`, `data-size="sm"` |
| Behaviour opt-in | `data-lue-{behaviour}` | `data-lue-toggle`, `data-lue-validate` |

### Specificity and order

- **Maximum specificity is one class (0,1,0).** Qualifiers go inside `:where()`:
  `.lue-button:where([data-variant="danger"])`.
- **Rule order inside a component file:** base → variants → states → increased contrast → forced colours.
- **One `!important` in the whole system:** `[hidden] { display: none !important; }` in `reset`.

### Variants and state

- **Enumerated variants** are attributes; the default is the attribute's absence (`data-variant` missing =
  default). **Booleans** are attribute presence (`data-icon-only`).
- **State comes from the platform only:** `:disabled`, `:checked`, `:user-invalid`, `[aria-invalid="true"]`,
  `[aria-pressed="true"]`, `[aria-expanded="true"]`, `:popover-open`, `[open]`, `:open`, `:state()`.
  `data-state` is allowed only where no native or ARIA hook exists, and needs a contract note.
- **Continuous knobs** (a component's accent, a gap) are custom properties. Private knobs are `@property`-registered
  with `inherits: false`, so an invalid value falls back to `initial-value` instead of unsetting the property.

### Scoping

`@scope` is used only for **donut boundaries** (a component that hosts arbitrary content) and **tag-styled prose**.
Class names already prevent leaks; scoping every component would add reasoning cost for nothing.

### Internationalisation

Logical properties only. Anchored UI positions with `position-area` and `flip-inline`. Icons that imply direction
carry `data-mirror` and flip under `:dir(rtl)`. Custom elements never generate user-visible text — all strings come
from markup or adapter props.

### Banned in component CSS (lint-enforced)

Physical properties · `!important` (except `[hidden]`) · selectors above (0,1,0) · non-Baseline functions outside
`@supports` · non-Baseline functions inside custom properties · `light-dark()` in custom properties · registered
themeable colours · `outline: none` without a forced-colours-visible replacement · viewport media queries inside
components.

## 3. Tokens and theming

Specified in [tokens](../design/tokens.md); decision in [ADR-0003](./adr/0003-dtcg-tokens-with-terrazzo.md).

- **Tiers:** primitive (JSON/TS only, never public CSS) → **semantic (the public CSS API)** → component (a few
  documented knobs).
- **Theming axes,** each settable on any subtree:

| Axis | Expressed as |
| --- | --- |
| Brand | `[data-brand="…"]` blocks containing only that brand's differences |
| Scheme | `[data-scheme="light/dark"]` + `@media (prefers-color-scheme)` + `color-scheme`, **literal values** |
| Contrast | `[data-contrast="more"]` + `@media (prefers-contrast: more)` |
| Forced colours | Per component, system colours, transparent borders that become visible |
| Density | `[data-density="compact/comfortable"]` → `--lue-density` multiplier used in `calc()` |
| Motion | Duration tokens drop to `0s` and transforms are removed under `prefers-reduced-motion: reduce` |

- **State colours** (hover, active, disabled) are **precomputed per context** so CI can contrast-test them and design
  tools (which reject `var()`/`color-mix()`) can read them. Runtime relative-colour derivation is reserved for
  ad-hoc brand colours supplied at runtime, checked in the browser.

## 4. Behaviour: platform first

Every interactive component follows the [platform ladder](../foundations/mission-and-principles.md#2-the-platform-ladder).

| Need | Platform primitive | Gap filled by |
| --- | --- | --- |
| Open/close dialogs | `<dialog>` + `command="show-modal"`, `<form method="dialog">` to close | — (Safari < 26.2: no polyfill, ADR-0004) |
| Light dismiss for modal dialogs | `closedby="any"` | — (where `closedby` is missing, Esc and buttons close it) |
| Menus, popovers | `popover` + `popovertarget` / `command`, anchor positioning | `<lue-menu>` keyboard model (arrows, Home/End, typeahead, Tab closes) |
| Disclosure, accordion | `<details>`, `<details name>` | — |
| Select | `<select>`, `appearance: base-select` as PE | — |
| Validation | Constraint validation, `:user-invalid` | `data-lue-validate`: custom messages, `aria-invalid`, error summary, focus |
| Toggle buttons | `<button aria-pressed>` | `data-lue-toggle` (HTML-only path) |
| Roving focus (toolbar, tabs, radio-like groups) | `focusgroup` (Chromium only) | `<lue-roving>`, deleted when `focusgroup` is Baseline |
| Tabs | — | `<lue-tabs>` (APG tabs) |
| Toasts / announcements | `popover="manual"`, `ariaNotify()` | `<lue-toast-region>` (queue, pause on hover/focus, live-region fallback) |
| Combobox (later) | — | `<lue-combobox>` (APG combobox), Tier 3 |

### Light-DOM element rules

1. Elements **enhance markup that already works**; they never insert, move or remove nodes inside a
   framework-rendered subtree.
2. **No DOM writes in the constructor or `connectedCallback`** — only listeners and ElementInternals (`:state()`,
   default ARIA on the host). Upgrade can happen before hydration.
3. **Every attribute an element owns is declared in its contract;** frameworks render only its initial value and
   never change it.
4. **Behaviours that change the DOM act only on opt-in `data-lue-*` markup.** Adapters never emit those attributes —
   they implement the same behaviour with state, reusing the element's **pure controller** code.
5. **Inputs are string attributes; outputs are native events.** Works with server rendering and any framework.
6. **Connect/disconnect is idempotent** (one `AbortController` per connection).
7. **Registered once**, guarded with `customElements.get`; React apps mount `<LueElements/>` at the root.
8. **Each element names its deletion trigger** — the platform feature that will make it unnecessary.

## 5. React adapters

- **Same markup as the HTML core,** proven by markup-parity tests.
- **Server-component-safe by default.** Components without client state use no hooks except `useId`, and no context.
  Client components (`ToggleButton`, `Form`, controlled `Dialog`) are separate entry points with `'use client'`.
- **Invoker commands:** React 19.3 and `@types/react` don't support `command`/`commandfor` yet, and camelCase
  `commandFor` triggers a dev warning. One helper renders the lowercase attributes, with a JSX type augmentation:
  `<Button {...invoker("confirm", "show-modal")}>`. A codemod switches casing when React adds support.
- **Dialogs** are uncontrolled by default (opened by invokers); controlled mode calls `showModal()`/`close()` through
  a ref. **React's `open` prop is never passed to a modal dialog** (it opens non-modal, without inertness).
- **Popovers stay as DOM children of their trigger's container — never portalled.** Inside a modal dialog, a portal
  lands in the inert background.
- **Menus that open a dialog** call `hidePopover()` and return focus to their trigger before the command runs
  (`showModal()` hides open popovers, which would otherwise drop focus to `<body>`).
- **Forms:** ids from `useId` (never derived from `name`); server and client share one `errors` shape; submit through
  `onSubmit` + `startTransition` (React 19 resets uncontrolled fields after an action, even when it returns errors).
- **v1 exclusions:** `<selectedcontent>` (likely hydration mismatch), `interestfor`.

## 6. Accessibility contracts

Each component has a machine-readable contract: **anatomy** (parts and their elements), **roles and names**,
**keyboard map**, **states and how they're exposed**, **owned attributes**, **tokens used**, **platform rung** and
**fallbacks**. The format is drafted in [components](../design/components.md) and finalised from the hand-written
tests of the first five components in Pass 3 — we extract the schema from working tests rather than designing it in
the abstract.

One contract feeds: generated keyboard and ARIA tests · docs pages · `llms.txt` and MCP answers · the component
guideline READMEs in the Claude Design system.

## 7. Quality gates

Decision and detail: [ADR-0005](./adr/0005-three-engine-testing-and-a11y-gates.md).

| Gate | Tool | Fails the build? |
| --- | --- | --- |
| axe on every story | Storybook a11y addon, `test: 'error'` | Yes |
| Keyboard specs with real input (APG) | Vitest browser mode + Playwright, Chromium/Firefox/WebKit | Yes |
| Emulation: forced colours, contrast, scheme, reduced motion, 320 px, RTL | Vitest browser (Chromium + Firefox; computed-style assertions) | Yes |
| Hydration (SSR → define before/after `hydrateRoot`) | Vitest browser | Yes |
| Static markup validity + Baseline | html-validate, html-eslint `use-baseline` | Yes |
| CSS rules (layers, specificity, logical props, Baseline) | `@eslint/css` | Yes |
| Contrast matrix (every declared pair × every context) | Terrazzo `a11y/min-contrast` + our pair list | Yes |
| Consumer fixtures (Vite 8, Next, Tailwind v4) | Fixture builds | Yes |
| Visual regression | Three engines | Yes (reviewed diffs) |
| Size budgets | size-limit | Yes |
| Manual screen-reader pass, real-Safari smoke test | NVDA, JAWS, VoiceOver (macOS, iOS), TalkBack | Release blocker for Stable |

## 8. Docs, AI surfaces and Claude Design

- **One Storybook 10 (react-vite).** An `html` decorator renders each React story with `renderToStaticMarkup`,
  inserts it as `innerHTML` with the elements defined, and shows that HTML as the canonical source — proving the
  no-React path on every story.
- **The same static markup** feeds Claude Design previews, html-validate and html-eslint.
- **AI surfaces:** `llms.txt`, a Markdown page per component, contracts as JSON, the Storybook MCP addon (manifests),
  and an MCP endpoint for tokens and contracts.
- **Claude Design:** the Design System artifact holds the brand-book README, list-shaped `tokens.json`, component
  guidelines (generated from contracts) and previews. Previews are **static HTML + `bundle.css` (= `@lue-ui/css`) +
  `bundle.js` (= the elements IIFE, `window.LueUI`)**, with `libraries: []` — no React needed, so Claude Design renders
  production CSS. `/design-sync` appears React-centric, so this path is spiked first in Pass 3.
- **Round trip:** tokens flow DTCG → Claude Design `tokens.json`; edits made in Claude Design come back through an
  import script as a reviewed DTCG diff, never a silent overwrite.

## 9. Build and distribution

- **CSS:** Lightning CSS for bundling (`@import … layer()`) and minification with **no targets** — nothing is
  lowered. We ship a browserslist config and document `exclude: Features.LightDark` for consumers whose pipelines
  run Lightning CSS.
- **JS:** ESM only; `types` first in every export condition; per-file builds so `'use client'` survives;
  `sideEffects` declared.
- **Versioning:** Changesets with all packages `fixed` (lockstep) — CSS and markup are coupled.
- **Initial budgets** (Brotli; revisited after Pass 3):

| Artefact | Budget |
| --- | --- |
| `tokens.css` (one brand, all contexts) | ≤ 6 KB |
| `reset.css` + `base.css` | ≤ 3 KB |
| One component's CSS | ≤ 1.5 KB (median ≤ 1 KB) |
| Tier 1 CSS in total | ≤ 30 KB |
| One element | ≤ 2 KB; all elements ≤ 8 KB |
| One React adapter (excluding React) | ≤ 1 KB |
| Default fonts (Latin subset, variable) | ≤ 130 KB in total (raised from 120 KB by the user on 2026-10-10 to keep the mono micro-labels) |

## 10. Risks

| Risk | Likelihood / impact | Mitigation |
| --- | --- | --- |
| Dead invoker buttons on Safari < 26.2 (e.g. iOS 18) | High / High | Accepted (ADR-0004): documented; React adapters call `showModal()`; real-Safari smoke test |
| Elements and React fight over the DOM | Medium / High | Element rules §4; hydration harness in both script orders |
| Consumer pipelines rewrite our CSS | High / High | No `light-dark()` in custom properties; consumer fixtures; documented `layer()` import |
| React's invoker gaps, then a casing change | High / Medium | `invoker()` helper + type augmentation + codemod |
| Anchor positioning differs between engines | Medium / Medium | Explicit `anchor-scope`; no transformed anchors; bounding-box tests incl. RTL and viewport flip |
| Tests blind to real behaviour | High / Medium | Real-input tests; Chromium accessibility tree; manual AT |
| Terrazzo bugs or permutation blow-up | Medium / Medium | Pin; golden-file tests; emit per-axis differences only |
| Claude Design sync path | Medium / Medium | Static HTML previews; spike first |
| `showModal()` hides an open menu and drops focus | High / Medium | Menu hides itself and restores focus before running a command |

## 11. Sequencing (Pass 3)

1. **Step 0:** pnpm workspace, Changesets, CI.
2. **Spike A — riskiest first:** a dialog containing a menu, in raw HTML and in React with SSR + hydration, in all
   three engines (commands, anchoring, Esc stacking, focus hand-off and the element rules together).
3. **Spike B:** Terrazzo → `tokens.css` + Claude Design JSON + contrast lint → Lightning CSS → consumer fixtures.
4. **Spike C:** one Claude Design preview with the IIFE bundle via `/design-sync`.
5. **Components in order of increasing JavaScript:** Button → Field + TextInput + error summary → Select → Dialog →
   Menu.

## 12. Traceability

| Decision | Serves principles |
| --- | --- |
| HTML+CSS core, light-DOM elements, React adapters (ADR-0001) | 2 platform ladder · 7 lean · 9 one core |
| Native CSS core, Tailwind as a generated bridge (ADR-0002) | 3 standards · 4 CSS is the API |
| DTCG + Terrazzo, literal per-context values (ADR-0003) | 3 standards · 1 accessible (contrast-tested) · 10 legible |
| Baseline fidelity floor, no polyfills (ADR-0004) | 8 Baseline-anchored · 1 accessible · people first |
| Three-engine tests, failing a11y gates (ADR-0005) | 1 accessible · 8 Baseline · evidence over opinion |
| MIT + public RFC/ADR process (ADR-0006) | Open by default |
| Lockstep packages + element ownership rules (ADR-0007) | 9 one core · 7 lean |
| `@layer lue` + one-class specificity | 4 CSS is the API |
| State from native pseudo-classes and ARIA only | 3 standards · 4 CSS is the API |
| Logical properties, container queries, no viewport queries in components | 6 intrinsic and resilient |
| Per-component forced-colours and contrast styles | 5 respect settings · 1 accessible |
| Contracts → tests, docs, MCP, Claude Design | 10 legible · 1 accessible |
| Static HTML previews in Claude Design | 10 legible · 11 distinctive (design = production) |
| Size budgets | 7 lean |

## Open questions

1. ~~**Final name and prefix**~~ — Lue UI, prefix `lue` ([ADR-0008](./adr/0008-name-lue-ui.md)); the npm scope is still to confirm.
2. ~~**When to retire the inclusion exception**~~ — moot: the exception was declined (ADR-0004, 2026-10-11) and kept
   as a possible future enhancement.
3. **Copy-paste components** — *future consideration* (2026-10-11): if Lue UI ever offers copy-paste React
   components, it will use the shadcn registry tooling rather than a registry of its own. Not now; copied code drifts.
4. ~~**Storybook long-term**~~ — Storybook 10 for now (2026-10-11); revisit a lighter docs site once contracts generate
   most pages.
5. **`/design-sync` constraints** — confirmed by spike C.

## Sources

Gathered in the architecture review of 2026-10-03; browser status is in
[platform capabilities](../foundations/platform-capabilities.md#sources).

- **React and invoker commands:** [`command`/`commandfor` typings (DefinitelyTyped #74664)](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/74664) ·
  [React support PR #36257](https://github.com/react/react/pull/36257) · [React PR #36493](https://github.com/react/react/pull/36493) ·
  [form reset after actions (#29034)](https://github.com/react/react/issues/29034) · [React #33038](https://github.com/facebook/react/issues/33038)
- **Lightning CSS and `light-dark()` in custom properties:** [svelte #18902](https://github.com/sveltejs/svelte/issues/18902) ·
  [lowdefy #2459](https://github.com/lowdefy/lowdefy/pull/2459) · [Lightning CSS transpilation](https://lightningcss.dev/transpilation.html) ·
  [guidance on registered colour tokens](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/ui-atoms/component-specific-light-dark-theme.md)
- **Dialogs and popovers:** [`closedby` support and Safari](https://www.oidaisdes.org/blog/dialog-closedby-attribute/) ·
  [popover accessibility mappings](https://hidde.blog/popover-accessibility/) · [`position-anchor` support](https://caniuse.com/mdn-css_properties_position-anchor) ·
  [`anchor-scope`](https://caniuse.com/mdn-css_properties_anchor-scope) · [OddBird on `position-area`](https://www.oddbird.net/2025/10/13/anchor-position-area-update/)
- **Testing:** [Vitest Playwright provider](https://vitest.dev/config/browser/playwright) · [Vitest interactivity API](https://vitest.dev/api/browser/interactivity) ·
  [Vitest ARIA snapshots](https://main.vitest.dev/guide/browser/aria-snapshots) · [Playwright forced-colours (#33765)](https://github.com/microsoft/playwright/issues/33765) ·
  [Storybook real-events RFC](https://github.com/storybookjs/storybook/discussions/30815) · [Storybook Vitest addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)
- **Linting:** [@eslint/css](https://github.com/eslint/css) · [html-eslint `use-baseline`](https://html-eslint.org/docs/rules/use-baseline)
- **Tokens:** [Terrazzo CSS integration](https://terrazzo.app/docs/integrations/css/) · [Terrazzo plugin API](https://terrazzo.app/docs/reference/plugin-api/) ·
  [Style Dictionary DTCG status](https://styledictionary.com/info/dtcg/)
- **Claude Design sync:** [syncing a design system with Claude Design](https://nitayneeman.com/blog/how-to-sync-a-design-system-with-claude-design/) ·
  [design-sync notes](https://wmedia.es/en/tips/claude-code-design-sync-your-components)
