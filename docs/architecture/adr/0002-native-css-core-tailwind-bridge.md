# ADR-0002: Native CSS core, Tailwind as a generated bridge

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** 3 standards over invention · 4 CSS is the API · 7 lean by default

## Context

In the predecessor, DaisyUI class names became the public API and Tailwind ran in a compatibility mode that produced
silently invalid CSS (`border-radius: --rounded-field`). Modern CSS now covers what preprocessors and utility
frameworks were used for: nesting, cascade layers, custom properties, container queries, OKLCH colour. CSS-tooling
vendors have proven commercially fragile (Tailwind Labs joined Shopify in September 2026; Tailwind Plus closed to new
customers). Many consumers will still use Tailwind.

## Decision

1. **Component CSS is authored as standard CSS** — nesting, `@layer`, custom properties — and published without
   proprietary syntax.
2. **Lightning CSS bundles and minifies with no targets**, so nothing is lowered or rewritten.
3. **Tailwind support is a generated bridge:** `@lue-ui/tokens` emits a Tailwind v4 `@theme` file so utilities use the
   same tokens. Tailwind users import our CSS into their components layer:
   `@import "@lue-ui/css" layer(components);`
4. **No DaisyUI and no tailwind-variants.** React adapters map props to `data-*` attributes directly.

## Consequences

- **Positive:** no vendor in the core; the CSS a consumer reads is the CSS that runs; works in any pipeline; Tailwind
  users keep their utilities, on our tokens.
- **Negative:** no utility shorthand while authoring components; we maintain the bridge output; we must test that
  consumer pipelines (Vite 8's Lightning CSS in particular) don't rewrite our CSS.
- **Follow-ups:** consumer fixtures (Vite 8, Next, Tailwind v4); documented import recipes; lint rules from
  [RFC-0001 §2](../rfc-0001-architecture.md#2-css-architecture).

## Alternatives considered

- **Tailwind as the authoring layer.** Fast to write, but couples the core to one vendor, tends to make class soup
  the API, and caused the predecessor's silent breakages.
- **Sass or PostCSS-only syntax.** No longer needed; adds non-standard syntax to the source.
- **Runtime CSS-in-JS.** Conflicts with server rendering, performance budgets and the framework-agnostic core.
