# Lue UI elements

Light-DOM custom elements and opt-in behaviours for the HTML path ([ADR-0001](../../docs/architecture/adr/0001-component-model.md),
[ADR-0007](../../docs/architecture/adr/0007-package-layout-and-ownership.md)). Private for now.

| Import | What it is |
| --- | --- |
| `@lue-ui/elements/define` | Registers every element and installs every behaviour, once (side effect) |
| `@lue-ui/elements/define/<name>` (`menu`, `toast`, `validate`, `toggle`, `tabs`, `roving`, `tooltip`, `carousel`, `stepper`) | One at a time |
| `@lue-ui/elements` | The classes and controllers (browser only: it declares `HTMLElement` subclasses) |
| `@lue-ui/elements/validate`, `…/menu` | The pure controllers alone, safe to import on a server (React uses these) |
| `@lue-ui/elements/lue.iife.js` | A script-tag build: everything defined on load, controllers on `window.LueUI` |

| Element or behaviour | Owns |
| --- | --- |
| `<lue-menu>` — the APG menu keyboard model on a popover menu | Nothing: it listens and moves focus |
| `form[data-lue-validate]` — messages in the page instead of browser bubbles, and the error summary | `aria-invalid`, error `hidden` and text, summary `hidden` and list items |
| `<lue-toast-region>` — announced, timed, queued status messages (`region.show(message, options)`) | All its children (render it empty) |
| `button[data-lue-toggle]` — flips `aria-pressed` on click and fires `lue-toggle` | `aria-pressed` |
| `<lue-tabs>` — a `<nav>` of in-page links becomes tabs (APG, automatic activation) | `role`, `aria-selected`, `aria-controls`, `tabindex` on links; `role` on the list; `role`, `aria-labelledby`, `tabindex`, `hidden` on panels |
| `<lue-roving>` — one Tab stop and arrow keys for a toolbar | `tabindex` on its controls |
| `[data-lue-tooltip]` — shows a `popover="manual"` tooltip on hover and keyboard focus; Escape hides it | Nothing |
| `<lue-carousel>` — previous and next for a scroll-snap track | `aria-disabled` on its buttons |
| `<lue-stepper>` — − and + for a number input | the input's value (as the user would); `aria-disabled` on its buttons |

Build: `pnpm --filter @lue-ui/elements build` (`tools/build-js.mjs`): `tsc` per file with declarations, esbuild for
the IIFE, and budgets of 2 KB per element and 8 KB in total (Brotli).
