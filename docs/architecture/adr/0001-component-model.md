# ADR-0001: HTML+CSS core, light-DOM elements, React adapters

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** 2 platform ladder · 7 lean by default · 9 one core, many frameworks

## Context

The predecessor (`tw-variants-ui`) was React-only, with DaisyUI classes as its effective API; an earlier Lit /
Shadow DOM layer was abandoned. In 2026 the platform provides most overlay and form behaviour natively (popover,
invoker commands, anchor positioning, `<dialog>`, `<details name>`, `:user-invalid`). Headless React libraries still
re-implement much of it in JavaScript. We want one implementation that works in any stack, and Claude Design
previews that render production CSS.

## Decision

1. **The core is semantic HTML plus our CSS.** Every component is defined first as markup that works without
   JavaScript wherever the platform allows.
2. **Light-DOM custom elements** fill only the gaps the platform leaves (menu keyboard model, roving focus, tabs,
   toast queue, validation messages, later combobox). No Shadow DOM for core components.
3. **React 19 adapters** render identical markup, sharing pure controller code with the elements. Other framework
   adapters can follow without re-implementing behaviour.

## Consequences

- **Positive:** works in any framework or none; near-zero JavaScript; server-component-safe React; labels and
  controls stay in one tree, so ARIA references always resolve; Claude Design previews are the real thing; consumer
  styling is ordinary CSS.
- **Negative:** we must define and police ownership between elements and frameworks
  ([ADR-0007](./0007-package-layout-and-ownership.md)); no style encapsulation (mitigated by layers and prefixes);
  some React ergonomics wait on React supporting `command`/`commandfor`.
- **Follow-ups:** markup-parity tests; hydration harness; `invoker()` helper with type augmentation.

## Alternatives considered

- **Shadow DOM web components (Lit and similar).** Strong isolation, but ARIA references can't cross shadow roots
  without Reference Target (Chromium only), consumer styling is limited to `::part` and tokens, and form association
  adds complexity. This team already abandoned a Lit layer once.
- **React-only components on native elements.** Simplest for React apps, but excludes every other stack, makes
  Claude Design previews depend on a React bundle, and invites React-only behaviour.
- **Wrapping a headless React library (Base UI, React Aria).** Excellent accessibility, but JavaScript-first,
  React-only, and it duplicates behaviour the platform now provides.
