# ADR-0007: Package layout, versioning and element ↔ framework ownership

- **Status:** Proposed — implemented in Pass 3, step 0
- **Date:** 2026-10-05
- **Principles:** 9 one core, many frameworks · 7 lean by default · 4 CSS is the API

## Context

The core (CSS + markup), the custom elements and the React adapters are tightly coupled: a markup change is a CSS
change is an adapter change. Custom elements and React can also fight over the same DOM: React 19 warns about
attribute mismatches during hydration and regenerates the client tree when it finds unexpected children, and a
custom element may upgrade before React hydrates.

## Decision

### Layout

```
lue-ui/
├── packages/
│   ├── tokens/      @lue-ui/tokens    DTCG source + Terrazzo build
│   ├── css/         @lue-ui/css       component CSS
│   ├── elements/    @lue-ui/elements  light-DOM elements, controllers, IIFE
│   └── react/       @lue-ui/react     React 19 adapters
├── apps/
│   └── docs/        Storybook 10, llms.txt, static previews, contracts
└── docs/            foundations, architecture, design
```

- **pnpm workspace; all packages versioned in lockstep** (Changesets `fixed`).
- **ESM only.** `types` first in every export condition; per-file builds so `'use client'` directives survive;
  `sideEffects` declared (`["*.css"]` for `@lue-ui/css`, `false` for `@lue-ui/react`).

```jsonc
// @lue-ui/react
{ ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
  "./*": { "types": "./dist/*/index.d.ts", "default": "./dist/*/index.js" } }
// @lue-ui/css
{ ".": { "style": "./dist/lue.css", "default": "./dist/lue.css" },
  "./reset.css": "./dist/reset.css", "./base.css": "./dist/base.css",
  "./components/*.css": "./dist/components/*.css" }
// @lue-ui/elements
{ ".": "./dist/index.js", "./define": "./dist/define.js",
  "./define/*": "./dist/define/*.js", "./lue.iife.js": "./dist/lue.iife.js" }
```

### Ownership rules (elements ↔ frameworks)

1. Elements **never insert, move or remove nodes** inside framework-rendered subtrees.
2. **No DOM writes in the constructor or `connectedCallback`** — listeners and ElementInternals only.
3. **Every attribute an element owns is declared in its contract;** frameworks render its initial value only.
4. **DOM-changing behaviours act only on opt-in `data-lue-*` markup.** Adapters never emit those attributes; they
   implement the behaviour with state, reusing the element's pure controller.
5. **Inputs are string attributes; outputs are native events.**
6. **Connect/disconnect is idempotent** (`AbortController` per connection).
7. **Registered once,** guarded with `customElements.get`; React apps mount `<NsElements/>` once at the root.

## Consequences

- **Positive:** one version number to reason about; no React/element conflicts by construction; adapters stay thin;
  HTML-only users get the same behaviour.
- **Negative:** lockstep releases bump packages that didn't change; the opt-in rule means some behaviours exist twice
  (element path and adapter path) around one shared controller.
- **Follow-ups:** hydration harness in both script orders; markup-parity tests; Changesets config.

## Alternatives considered

- **Independent versions per package.** Flexible, but lets CSS and markup drift between packages.
- **Elements that re-render their own children.** Simpler to write, but guaranteed to fight React hydration.
- **Separate repositories.** Cleaner boundaries, but coupled changes would need coordinated releases across repos.
