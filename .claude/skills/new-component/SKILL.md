---
name: new-component
description: Add a Lue UI component end to end - inventory entry, contract, CSS, element or behaviour if needed, React adapter, stories and tests - in the order that keeps `pnpm check` passing. Use when adding a component or a new part of one (a subcomponent, a behaviour), or when `pnpm check` fails on a contract.
---

# Add a component

Work in this order. Each step names the file to copy from; Button is the simplest complete example, Menu the most
complete one with an element.

1. **Inventory first.** Add a row to [docs/design/components.md](docs/design/components.md) with its primitive,
   pattern, JS need (`none`, `opt-in`, `element`), Baseline dependencies and fallback. Check the
   [platform capabilities](docs/foundations/platform-capabilities.md) for anything newer than Baseline newly available.
2. **Pick the rung.** Native element, then native attribute, then CSS, then ARIA, then a light-DOM script, then the
   adapter. Use the lowest that meets the accessibility contract, and say why in the contract's `rungReason`.
3. **Contract:** `apps/docs/contracts/<id>.json` (copy `button.json`). Needs `summary`, `guidance` (`useFor`,
   `insteadUse`, `content`), anatomy, variants as `data-*`, states from native pseudo-classes or ARIA, the keyboard map
   and focus. Owned attributes go in the contract (ADR-0007).
4. **CSS:** `packages/css/src/components/<id>.css`. Everything in `@layer lue`, one class of specificity (qualifiers in
   `:where()`), logical properties only, tokens not literals, its own increased-contrast and forced-colours rules, focus
   with `outline`. Import it in `packages/css/src/lue.css` beside the others.
5. **Behaviour, only if the platform lacks it:** a `data-lue-*` behaviour or a light-DOM element in
   `packages/elements/src/<id>/`, registered in `define.ts`, never restructuring framework-rendered DOM.
6. **React adapter:** `packages/react/src/<id>/index.tsx`, rendering the same markup as the HTML path, with JSDoc on
   every prop (react-docgen shows it on the docs page and the Markdown page). No portals; no `open` prop on a modal
   dialog; `invoker()` for `command`/`commandfor`.
7. **Stories:** `apps/docs/stories/<id>.stories.tsx`. Stories are tests and axe runs at `error`.
8. **Tests:** `tests/<id>/<id>.browser.test.tsx`. Press every key the contract's keyboard map names, with real input,
   or `check-contracts` fails. Cover reflow, forced colours and reduced motion where they apply.
9. **Run** `pnpm check`, then `pnpm test` in the background (`pnpm test:engines` on a busy machine). Visual baselines are
   Linux-only: leave them to CI or a Linux session (`pnpm vitest run tests/visual --update`, then review the PNGs).
10. **Review** with the `a11y-reviewer` agent, then commit (`feat: <Component>`) and run `/handover`.
