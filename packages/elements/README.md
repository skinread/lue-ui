# Lue UI elements

Light-DOM custom elements and opt-in behaviours for the HTML path ([ADR-0001](../../docs/architecture/adr/0001-component-model.md),
[ADR-0007](../../docs/architecture/adr/0007-package-layout-and-ownership.md)). Private for now.

| Import | What it is |
| --- | --- |
| `@lue-ui/elements/define` | Registers every element and installs every behaviour, once (side effect) |
| `@lue-ui/elements/define/menu`, `…/define/toast`, `…/define/validate`, `…/define/toggle` | One at a time |
| `@lue-ui/elements` | The classes and controllers (browser only: it declares `HTMLElement` subclasses) |
| `@lue-ui/elements/validate`, `…/menu` | The pure controllers alone, safe to import on a server (React uses these) |
| `@lue-ui/elements/lue.iife.js` | A script-tag build: everything defined on load, controllers on `window.LueUI` |

| Element or behaviour | Owns |
| --- | --- |
| `<lue-menu>` — the APG menu keyboard model on a popover menu | Nothing: it listens and moves focus |
| `form[data-lue-validate]` — messages in the page instead of browser bubbles, and the error summary | `aria-invalid`, error `hidden` and text, summary `hidden` and list items |
| `<lue-toast-region>` — announced, timed, queued status messages (`region.show(message, options)`) | All its children (render it empty) |
| `button[data-lue-toggle]` — flips `aria-pressed` on click and fires `lue-toggle` | `aria-pressed` |

Build: `pnpm --filter @lue-ui/elements build` (`tools/build-js.mjs`): `tsc` per file with declarations, esbuild for
the IIFE, and budgets of 2 KB per element and 8 KB in total (Brotli).
