# Spike A: a dialog containing a menu

> **Status:** Done in Chromium, Firefox and WebKit (Firefox confirmed in CI, 2026-10-24) · Pass 3 · 2026-10-11

[RFC-0001 §11](../rfc-0001-architecture.md#11-sequencing-pass-3) asked for the riskiest thing first: a menu inside a
modal dialog, in raw HTML and in React with server rendering and hydration, in three engines. It tests invoker
commands, anchoring, Esc stacking, focus hand-off and the element ownership rules
([ADR-0007](../adr/0007-package-layout-and-ownership.md)) together.

## What was built

| Piece | Where |
| --- | --- |
| Menu keyboard model, as pure functions (arrows, Home/End, typeahead, Tab) | `packages/elements/src/menu/controller.ts` |
| `<lue-menu>` — light DOM, listens and moves focus, writes nothing | `packages/elements/src/menu/lue-menu.ts` |
| Dialog and menu CSS, with anchoring behind `@supports` | `packages/css/src/components/{dialog,menu}.css` |
| React adapters: `Dialog` (controlled via `showModal()`), `DialogTrigger`, `Menu`, `MenuTrigger`, `MenuItem`, `LueElements`, `invoker()` | `packages/react/src/` |
| One fixture as HTML and as React, and the behaviour scenario | `tests/spike-a/` |

## What it proved

Run with `pnpm test` (Vitest browser mode, real input through Playwright). Results on 2026-10-11: **all 23 tests pass in each of
Chromium 156 and WebKit 27.2** (46 runs).

- **No script needed to open anything.** `command="show-modal"` opens the dialog modally; `command="toggle-popover"`
  opens the menu above it in the top layer. Without `<lue-menu>` defined, the menu still opens and Esc still closes it.
- **Anchoring with no anchor names.** A `commandfor` invoker is the menu's implicit anchor, so
  `position-area: block-end span-inline-end` places the menu under its button.
- **Esc closes one layer at a time.** The first Esc closes the menu and focus returns to its button. The second closes
  the dialog and focus returns to the button that opened it.
- **The keyboard model works:**
  - focus on the first item when the menu opens;
  - arrows that wrap; Home and End;
  - typeahead, where repeating a letter cycles through matches;
  - Enter runs an item and closes the menu;
  - Tab closes the menu and moves on, staying inside the modal dialog.
- **The element writes nothing.** A MutationObserver over the whole page records only the browser's own `open`
  attribute on `<dialog>`.
- **React 19.3, server render then hydrate, elements defined before and after hydration:** no hydration errors and no
  console errors.
  - Lowercase `command`, `commandfor` and `closedby` pass through as attributes, with no warnings.
  - `<lue-menu>` is rendered with `createElement`, so consumers' JSX types aren't augmented.
- **Markup parity.** `renderToStaticMarkup` of the React fixture equals the HTML fixture: same elements, attributes
  and text.
- **Dialogs opened from state** (`<Dialog open>`) use `showModal()`, so they work where invoker commands don't
  (Safari < 26.2, [ADR-0004](../adr/0004-support-floors.md)). Esc reports through `onOpenChange`.
- **axe** finds no violations with the dialog and menu open.

## Engine findings

1. **WebKit doesn't focus a button on click, and `showModal()` without `autofocus` focuses the dialog itself.**
   - Browsers restore focus to whatever was focused before a popover opened. In WebKit that was the dialog, not the
     menu's button.
   - **Fix:** `<lue-menu>` remembers its invoker (`ToggleEvent.source`, else the focused element). When it closes with
     focus inside, it moves focus there itself, during `beforetoggle`.
   - The dialog stays script-free. A dialog opened by pointer in Safari returns focus to `<body>` when it closes. That
     is the platform's behaviour, and the keyboard path is correct.
2. **Playwright's WebKit follows macOS's default Tab setting.** Tab skips buttons and links; Option+Tab reaches them.
   - `<lue-menu>` treats Option+Tab as Tab. On other platforms Alt+Tab never reaches the page.
   - WebKit tests press Option+Tab.
3. **Firefox passes in CI.** The Linux job on `develop` is green in Chromium, Firefox and WebKit (confirmed 2026-10-24).
   Playwright's Firefox can't start from the Claude app on macOS (it shares the installed Firefox's profile folder,
   which macOS blocks); that is a local-only limitation.

## Follow-ups

- ~~ArrowDown and ArrowUp on the menu button, opening at the first or last item~~ — done in `<lue-menu>` (2026-10-24).
- ~~A controlled `Dialog` needs `onOpenChange` to stay in sync after Esc~~ — documented, and warned once in development
  (Pass 3 components, 2026-10-24).
- ~~Emulation rows from [ADR-0005](../adr/0005-three-engine-testing-and-a11y-gates.md)~~ — done in
  [Spike B](spike-b-token-and-css-pipeline.md) (`tests/emulation/`), 2026-10-24.
- A Chromium accessibility-tree check that the invoker exposes `aria-expanded` (ARIA snapshots can't prove it).
- ~~Draft the Menu contract~~ — `apps/docs/contracts/menu.json` (2026-10-24).
