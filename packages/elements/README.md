# Lue UI elements

Light-DOM custom elements and opt-in behaviours for the HTML path ([ADR-0001](../../docs/architecture/adr/0001-component-model.md),
[ADR-0007](../../docs/architecture/adr/0007-package-layout-and-ownership.md)). Private for now.

| Import | What it is |
| --- | --- |
| `@lue-ui/elements/define` | Registers every element and installs every behaviour, once (side effect) |
| `@lue-ui/elements/define/<name>` (`menu`, `toast`, `validate`, `toggle`, `tabs`, `roving`, `tooltip`, `carousel`, `stepper`, `liquid`) | One at a time |
| `@lue-ui/elements` | The classes and controllers (browser only: it declares `HTMLElement` subclasses) |
| `@lue-ui/elements/validate`, `…/menu` | The pure controllers alone, safe to import on a server (React uses these) |
| `@lue-ui/elements/lue.iife.js` | A script-tag build: everything defined on load, controllers on `window.LueUI` |

| Element or behaviour | Owns |
| --- | --- |
| `<lue-menu>` - the APG menu keyboard model on a popover menu | Nothing: it listens and moves focus |
| `form[data-lue-validate]` - messages in the page instead of browser bubbles, and the error summary | `aria-invalid`, error `hidden` and text, summary `hidden` and list items |
| `<lue-toast-region>` - announced, timed, queued status messages (`region.show(message, options)`) | All its children (render it empty) |
| `button[data-lue-toggle]` - flips `aria-pressed` on click and fires `lue-toggle` | `aria-pressed` |
| `<lue-tabs>` - a `<nav>` of in-page links becomes tabs (APG, automatic activation) | `role`, `aria-selected`, `aria-controls`, `tabindex` on links; `role` on the list; `role`, `aria-labelledby`, `tabindex`, `hidden` on panels |
| `<lue-roving>` - one Tab stop and arrow keys for a toolbar | `tabindex` on its controls |
| `[data-lue-tooltip]` - shows a `popover="manual"` tooltip on hover and keyboard focus; Escape hides it | Nothing |
| `<lue-carousel>` - previous and next for a scroll-snap track | `aria-disabled` on its buttons |
| `<lue-stepper>` - − and + for a number input | the input's value (as the user would); `aria-disabled` on its buttons |
| The liquid key - on every `.lue-segmented__options` and every `.lue-tabs__list` in a defined `<lue-tabs>`, including ones added later: places the shared selected key (the container's `::before`) and makes it flow to a new selection with Web Animations (translate and scale only; never under reduced motion; a resize re-places it without animating) | `data-lue-liquid` and the inline `--lue-key-x`, `--lue-key-y`, `--lue-key-w`, `--lue-key-h` (px) on the container |

The liquid key needs no opt-in: it only decorates, writing one attribute and four custom properties on the container
and never touching nodes, so React's markup is unchanged and React never renders those. Without it (or before it
loads) each selected option draws its own static key. x is the selected option's inline-start offset from the
container's padding edge (from the right in right-to-left text), y its offset from the top padding edge; the CSS rests
`::before` at `translate: calc(var(--lue-key-x) * var(--lue-key-dir, 1)) 0`, which is where the animation ends.
`installLiquid(root)` (from `@lue-ui/elements`) starts it on another root and returns a function that stops it and
removes what it wrote. A radio checked from script fires no event, so a programmatic change places the key on the next
resize or change; a form reset is handled.

Build: `pnpm --filter @lue-ui/elements build` (`tools/build-js.mjs`): `tsc` per file with declarations, esbuild for
the IIFE, and budgets of 2 KB per element and 8 KB in total (Brotli).

`sideEffects` in `package.json` names the `define` files, built and source, so a bundler never tree-shakes the
registrations away. (Until 2026-10-25 it named only `dist/`, and Storybook's static build, which reads the sources,
shipped no element behaviour.)
