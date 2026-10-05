# ADR-0005: Three-engine testing and failing accessibility gates

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** 1 accessible by construction · 8 Baseline-anchored · value: evidence over opinion

## Context

The predecessor ran tests only in Chromium, and axe was set to `'todo'`, so it never failed. A platform-first system
depends on engine behaviour — top layer, popover, anchor positioning, `:user-invalid` — which differs between
engines. Several tools are blind to exactly that behaviour: story play functions dispatch synthetic events, ARIA
snapshots are computed from the DOM by an injected script (so they can't prove implicit mappings like popover
invoker → `aria-expanded`), and Playwright's WebKit reports forced colours via `matchMedia` but doesn't apply the
rules. Playwright's WebKit is also not Safari.

## Decision

| Layer | How |
| --- | --- |
| Story tests | Vitest browser mode with **named** Chromium, Firefox and WebKit instances; axe with `a11y.test: 'error'` |
| Keyboard behaviour | `*.browser.test.ts` specs using real input (`vitest/browser` userEvent) for the APG keyboard model of every interactive component; hand-written for the first five components, generated from contracts afterwards |
| Emulation | Forced colours, increased contrast, scheme, reduced motion, 320 px reflow, RTL — Chromium and Firefox, **asserting computed styles**, not `matchMedia` |
| Hydration | SSR → `innerHTML` → elements defined before and after `hydrateRoot`; fail on recoverable errors or console errors |
| Static markup | html-validate and html-eslint `use-baseline` on markup rendered by `renderToStaticMarkup` |
| CSS | `@eslint/css`: `use-baseline`, `use-layers`, `no-important`, `selector-complexity`, `prefer-logical-properties` |
| Tokens | Contrast matrix over every declared pair in every context (WCAG 2.x enforced, APCA reported) |
| Consumers | Fixture builds for Vite 8, Next and Tailwind v4 — no `--lightningcss-` output, utilities still override |
| Visuals and size | Visual regression in three engines; size-limit budgets |
| Per release | Chromium accessibility-tree check; manual NVDA (Firefox, Chrome), JAWS (Chrome), VoiceOver (macOS and iOS Safari), TalkBack; a real-Safari smoke test |

A component cannot reach **Stable** without passing every row.

## Consequences

- **Positive:** engine differences surface in CI, not in production; accessibility regressions block merges;
  evidence replaces opinion in reviews.
- **Negative:** slower CI (three engines); manual assistive-technology passes cost time each release; some flakiness
  to manage in real-input tests.
- **Follow-ups:** CI sharding by engine; an assistive-technology test log template; contract → test generator after
  Pass 3.

## Alternatives considered

- **Chromium only.** Fast, but blind to the engine differences that matter most to a platform-first system.
- **jsdom.** No layout, no top layer, no popover — unusable for this system.
- **Storybook play functions alone.** Synthetic events can't prove real keyboard behaviour.
