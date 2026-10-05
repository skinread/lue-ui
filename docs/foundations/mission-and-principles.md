# Mission, values and principles

> **Status:** Draft v0.1 · Phase 1 (foundations) · 2026-10-05
> **Name:** Lue UI, from the French *lueur* — a glimmer of light ([ADR-0008](../architecture/adr/0008-name-lue-ui.md)).
> The CSS prefix is `lue`.

Every later decision in this project — tokens, components, APIs, tooling, visual design — must trace back to
something on this page. If a decision can't, either the decision is wrong or this page is incomplete, and we fix
whichever it is in the open.

---

## Why this exists

1. **Most UI libraries rebuild the browser in JavaScript.** Popovers, dialogs, focus traps, positioning, disclosure
   and validation are re-implemented in every framework. That costs bytes and hydration time, and — worst — it
   costs accessibility, because every re-implementation can drift from the platform behaviour that assistive
   technology expects.
2. **The platform has caught up.** As of October 2026, popover, invoker commands, anchor positioning, `<dialog>`,
   exclusive `<details>`, `:user-invalid`, container and style queries, OKLCH colour and cascade layers work in
   Chrome, Firefox and Safari. A component library can now lean on the browser for almost everything it used to
   fake ([platform capabilities](./platform-capabilities.md)).
3. **Design tokens have a standard.** The W3C Design Tokens Community Group format reached its first stable
   version (2025.10), including colour spaces and theming resolvers.
4. **Accessibility is a legal floor, not a feature.** The European Accessibility Act has been in force since
   June 2025; Australia's Disability Discrimination Act, the ADA and Section 508 point at WCAG too.
5. **Agents now write a lot of UI.** They reproduce whatever a system makes easy. A system that encodes
   accessibility and standards as *data* makes the agents' default output accessible too.

## Mission

**Make accessible, standards-based interfaces the path of least resistance — by building _with_ the web platform,
not on top of it.**

## Vision

Within three years:

- A team adopts the system with **one stylesheet and plain HTML**, or with React, and gets the same accessible
  behaviour either way.
- Every component works with **keyboard, screen readers, 400% zoom, forced colours, reduced motion, right-to-left
  scripts and touch**, and proves it in CI across three browser engines.
- **A new brand is a token file, not a fork.**
- **Humans and AI agents read the same contracts**, so generated UI is on-system and accessible by default.
- **The system gets smaller as the web gets better.** We keep a deletion roadmap: every script we ship names the
  platform feature that will let us delete it.

## Values

What we care about. Values explain _why_; principles (below) say _how_.

| Value | In one line |
| --- | --- |
| **People first** | The measure of a component is whether every person can use it. |
| **The platform is the framework** | Browsers are the most tested UI runtime there is; we build on them, not around them. |
| **Open by default** | Open source (MIT), open standards, open decisions — RFCs and ADRs are public. |
| **Less, but better** | Fewer components, fewer variants, fewer bytes — each one excellent. |
| **Evidence over opinion** | Tests, research and real assistive-technology use settle debates. |
| **Craft and delight** | Accessible never means austere. Beauty and personality are part of usability. |

---

## Principles

Each principle has three parts: **we do**, **we don't**, and **how we check** — an automated gate or a named
review step. A principle without a check is a wish.

### 1. Accessible by construction

Accessibility is a property of the component, not homework for the consumer. The accessible use is the default
use; the inaccessible use is hard or impossible.

- **We do**
  - Treat WCAG 2.2 AA as the floor, and adopt selected AAA criteria (see
    [accessibility commitments](#accessibility-commitments)).
  - Follow the WAI-ARIA Authoring Practices keyboard model for every interactive pattern.
  - Make accessible names part of the API — an icon-only button can't be built without a label, at the type level
    and in the HTML contract.
  - Write an **accessibility contract** per component: roles, names, states, keyboard map, focus behaviour.
  - Test with real assistive technology before a component is called stable.
- **We don't**
  - Ship a component "with accessibility to follow".
  - Rely on colour alone, remove focus indicators, or use ARIA to fake what a native element already provides.
  - Hide from assistive technology what sighted users can see.
- **How we check**
  - axe runs on every story and **fails the build**.
  - Keyboard specs run with real input in Chromium, Firefox and WebKit.
  - A contrast matrix covers every declared foreground/background pair in every theme.
  - A manual screen-reader pass (NVDA, JAWS, VoiceOver on macOS and iOS, TalkBack) is part of each stable release.

### 2. The platform ladder

Use the lowest rung that meets the accessibility contract:

```
native element → native attribute → CSS → ARIA → small light-DOM script → framework adapter
```

- **We do**
  - Start every component by asking what HTML already does: `<dialog>`, `popover`, `command`/`commandfor`,
    `<details name>`, `<select>`, constraint validation.
  - Record the chosen rung, and why, in the component's contract.
  - Write scripts as progressive enhancement of markup that already works.
- **We don't**
  - Re-implement focus trapping, light dismiss, top-layer stacking, positioning or validation the browser provides.
  - Portal overlays to `<body>` — the top layer already solves stacking.
  - Add a JavaScript dependency for something CSS can do.
- **How we check**
  - Each component spec names its rung, with a justification, and review checks it.
  - Per-component JavaScript budget: most components ship **0 bytes**.

### 3. Standards over invention

When a standard exists, we use it — and where it falls short, we say so to the people who write it.

- **We do**
  - Emit valid HTML; follow WAI-ARIA 1.2 and the Authoring Practices; store tokens in the DTCG 2025.10 format;
    publish standard CSS (no preprocessor-only syntax); use Custom Elements; borrow Open UI anatomy and naming where
    it exists.
  - Report gaps to standards groups and browser vendors, and link those reports from our docs.
- **We don't**
  - Invent proprietary formats, or attribute names that could collide with future HTML.
  - Depend on a vendor where a standard will do.
- **How we check**
  - html-validate on all rendered markup; DTCG schema validation on token files.
  - Lint rules ban non-standard syntax; deviating from a standard requires an ADR.

### 4. CSS is the API

The styling contract is plain CSS: tokens as custom properties, cascade layers for predictable overrides, a small set
of class and attribute hooks — and **state comes from the platform**.

- **We do**
  - Ship everything inside `@layer`, so ordinary unlayered CSS always wins.
  - Cap specificity at a single class; put qualifiers in `:where()`.
  - Express variants as attributes (`data-variant`, `data-size`) and state as native pseudo-classes and ARIA:
    `:disabled`, `:user-invalid`, `[aria-pressed="true"]`, `:popover-open`, `[open]`.
  - Document every public token and hook.
- **We don't**
  - Mirror DOM state in classes (`.is-open`, `.is-invalid`).
  - Use runtime CSS-in-JS, deep selectors, or `!important` (one exception: `[hidden]`).
  - Make utility-class soup the public API.
- **How we check**
  - Lint rules: layers required, specificity limit, no `!important`.
  - Consumer fixtures prove overrides work from plain unlayered CSS and from Tailwind utilities.

### 5. Respect personal settings

People configure their devices for a reason. We honour every preference the platform exposes.

- **We do**
  - Support light and dark schemes, an increased-contrast theme (`prefers-contrast: more`), and per-component
    `forced-colors` styles using system colours.
  - Remove non-essential motion under `prefers-reduced-motion`, and reduce transparency where the browser exposes
    that preference.
  - Survive user text-size and text-spacing overrides (WCAG 1.4.4 and 1.4.12); respect language and direction.
- **We don't**
  - Force a colour scheme, disable zoom, set text in pure viewport units, or animate without a reduced-motion
    alternative.
- **How we check**
  - An emulation test project (forced colours, contrast, scheme, reduced motion) covers every component.
  - Visual regression includes text-spacing overrides and 200%/400% zoom.

### 6. Intrinsic and resilient

Components adapt to their container, their content, their language and their input — not to device breakpoints.

- **We do**
  - Use container queries, intrinsic sizing (`min()`, `clamp()`, `fit-content`, `field-sizing`) and logical
    properties everywhere, so right-to-left works by default.
  - Design for 320 CSS px wide at 400% zoom, +40% translation growth, long unbroken words, and coarse pointers.
- **We don't**
  - Put viewport breakpoints inside components, fix the height of text containers, use physical properties
    (`left`, `margin-right`) in component CSS, or truncate meaningful text with no way to read it in full.
- **How we check**
  - Lint for logical properties.
  - RTL and pseudo-localised stories; reflow tests at 320 px.

### 7. Lean by default

Every byte and every script earns its place. The fastest component is HTML the browser already understands.

- **We do**
  - Ship zero JavaScript for static and most interactive components; any script is ≤ 2 KB compressed and loads only
    when used.
  - Keep React adapters server-component-safe wherever no client state is needed.
  - Split CSS per component and enforce budgets in CI.
- **We don't**
  - Bundle runtime dependencies, require hydration before a component is usable, or send polyfills to browsers that
    don't need them.
- **How we check**
  - size-limit budgets per package and per component.
  - A hydration harness; core components work before (or without) JavaScript wherever the platform allows.

### 8. Baseline-anchored, future-leaning

The core relies only on features that are Baseline across Chrome, Firefox and Safari. Newer features make the
experience better but are never required.

- **We do**
  - Use **Baseline "newly available"** as the fidelity floor (one narrow inclusion exception — see
    [ADR-0004](../architecture/adr/0004-support-floors.md)).
  - Gate enhancements with `@supports` and feature detection, each with an accessible fallback.
  - Track Baseline and Interop, promote features into the core when they land, and keep the
    **deletion roadmap** current.
- **We don't**
  - Carry polyfill piles for legacy browsers.
  - Treat a single-engine feature as core.
  - Hide non-Baseline CSS functions inside custom properties (they fail as "invalid at computed-value time"
    instead of falling back).
- **How we check**
  - Baseline lint for CSS and HTML; a three-engine test matrix; the capability matrix is reviewed every quarter.

### 9. One core, many frameworks

Behaviour and styling are implemented once — in HTML, CSS and small standard custom elements. Framework adapters
wrap the core; they never fork it.

- **We do**
  - Make the core usable with no framework at all.
  - Have the React adapter render **identical markup**, sharing pure controller code with the custom elements.
  - Follow explicit ownership rules between custom elements and frameworks
    ([ADR-0007](../architecture/adr/0007-package-layout-and-ownership.md)).
- **We don't**
  - Build React-only behaviour, let adapters drift from the HTML contract, or use Shadow DOM for core components
    (ARIA can't cross shadow roots reliably yet, and styling gets harder).
- **How we check**
  - Markup-parity tests (adapter output equals the canonical HTML); hydration tests; every React example in the docs
    shows its HTML.

### 10. Legible to humans and agents

Everything the system knows — tokens, contracts, usage rules — is published as data, so people and AI agents build
on-system and accessible by default.

- **We do**
  - Describe every token's usage in the token file.
  - Publish per-component contracts (anatomy, roles, keyboard map, states, tokens) as data.
  - Publish `llms.txt` and Markdown docs, offer MCP access, and keep the Claude Design system in sync with
    production CSS.
  - Lead every example with correct, accessible usage.
- **We don't**
  - Document behaviour only in prose or only in screenshots, or let design files drift from code.
- **How we check**
  - Contracts drive tests and docs from a single source; the docs build fails if a component has no contract.
  - The design-sync diff is reviewed every release.

### 11. Distinctive, not decorative

The system has its own visual voice — expressive in type, colour, shape and motion — and every expressive choice
passes the same accessibility and performance bars as everything else.

- **We do**
  - Build an original identity, derived from no existing design system.
  - Carry expression in tokens (type, colour, shape, motion), so it stays themeable.
  - Use only open-licensed fonts and icons, and motion that explains rather than decorates.
- **We don't**
  - Chase trends or AI clichés, trade legibility or contrast for style, or make the core look depend on JavaScript
    or non-Baseline CSS.
- **How we check**
  - Design review against the rubric in the [Claude Design brief](../design/claude-design-brief.md).
  - The contrast matrix; performance budgets include fonts.

---

## When principles conflict

Resolve in this order:

**Access → Correctness (standards) → Resilience → Performance → Expressiveness → Convenience**

- An expressive animation that harms reduced-motion users loses to access.
- A nicer API that needs non-standard markup loses to correctness.
- A smaller bundle that breaks at 400% zoom loses to resilience.
- Developer convenience is real, but it is last: we pay complexity once, inside the system, so consumers don't.

## Non-goals

- **Legacy browsers.** Only current evergreen engines (with the narrow inclusion exception in ADR-0004).
- **Pixel-identical progressive enhancements** across engines. Fallbacks must be accessible and good, not identical.
- **A utility-CSS framework.** We generate a Tailwind theme bridge; we don't compete with Tailwind.
- **Runtime CSS-in-JS.**
- **Re-implementing platform behaviour** for consistency's sake.
- **Everything for everyone.** Fewer, excellent components. Complex application widgets (data grids, rich-text
  editors) are out of scope for the first releases.

## Accessibility commitments

| Commitment | Level | Notes |
| --- | --- | --- |
| WCAG 2.2, all criteria | AA | The floor for every component and theme. |
| 2.4.13 Focus Appearance | AAA | `:focus-visible` outline ≥ 2 px with ≥ 3:1 change of contrast, on every interactive element. |
| 2.5.5 Target Size (Enhanced) | AAA, on coarse pointers | 24 × 24 CSS px minimum everywhere (2.5.8); 44 × 44 under `(any-pointer: coarse)`. |
| 1.4.6 Contrast (Enhanced) for body text | AAA | Primary body text ≥ 7:1 in default themes; secondary text ≥ 4.5:1; the increased-contrast theme lifts all text to ≥ 7:1. |
| 2.4.11 Focus Not Obscured (Minimum) | AA | `scroll-padding` and `scroll-margin` keep focused items clear of sticky UI. |
| 2.5.7 Dragging Movements | AA | Every drag interaction has a single-pointer alternative. |
| 3.3.7 Redundant Entry · 3.3.8 Accessible Authentication | A · AA | Correct `autocomplete`; never block paste or password managers. |
| Forced colours, reduced motion, increased contrast | — | Designed and tested per component, not left to defaults. |
| APCA | Advisory | Reported for information. WCAG 2.x ratios are the gate — WCAG 3's contrast method is still undecided. |

## Open source

- **Licence:** MIT for code and documentation ([LICENSE](../../LICENSE),
  [ADR-0006](../architecture/adr/0006-licence-and-governance.md)).
- **Decisions in the open:** significant changes start as an RFC; accepted decisions are recorded as ADRs.
- **Component maturity:** **Proposal → Experimental → Candidate → Stable.** Stable requires a contract, tests in
  three engines, a manual assistive-technology pass, docs, and a Claude Design preview rendered from production CSS.
- **Versioning:** semver, all packages released together. Before 1.0, minors may break, always with a migration
  note.
- **Coming with the first code:** `CONTRIBUTING.md`, a code of conduct, an accessibility statement and a security
  policy.

## Glossary

| Term | Meaning here |
| --- | --- |
| **Baseline** | A web feature available in all major engines (Chrome/Edge, Firefox, Safari). "Newly available" = in all of them; "widely available" = 30 months later. |
| **Platform ladder** | The order in which we reach for tools (principle 2). |
| **Contract** | Machine-readable description of a component: anatomy, roles, keyboard map, states, owned attributes, tokens. |
| **Light-DOM element** | A custom element that enhances its children in place, without Shadow DOM. |
| **Adapter** | A framework wrapper (React first) that renders the same markup as the HTML core. |
| **Fidelity floor** | The feature set the full design depends on (Baseline newly available). |
| **Theming axis** | An independent dimension of theming: brand, scheme, contrast, density, motion. |
| **DTCG** | The W3C Design Tokens Community Group format. |
| **APG** | The WAI-ARIA Authoring Practices Guide. |
