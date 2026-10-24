# Component inventory and contracts

> **Status:** Draft v0.1 · Phase 1 · 2026-10-05
> Prefix `lue` ([ADR-0008](../architecture/adr/0008-name-lue-ui.md)). Visual design comes from Claude Design; this page fixes **semantics, behaviour and
> platform strategy** for every component.

## How to read the inventory

- **Primitive** — the native element or attribute the component is built on.
- **Pattern** — the WAI-ARIA Authoring Practices pattern it follows ("—" when native semantics are the whole story).
- **JS** — `none` (works with HTML + CSS alone), `opt-in` (a delegated `data-lue-*` behaviour for the HTML path; React
  uses state), `element` (a light-DOM custom element). No polyfills ship ([ADR-0004](../architecture/adr/0004-support-floors.md)).
- **Depends on / fallback** — the Baseline features it relies on, and what happens without anything newer.

Of the 22 Tier 1 components, **18 need no JavaScript in current engines** (on Safari older than 26.2, HTML-path buttons
that open a Dialog or Drawer do nothing — ADR-0004), 2 use an opt-in behaviour, and 2 use a custom element.

## Tier 0 — Foundations

| Item | Notes |
| --- | --- |
| Tokens | [Token specification](./tokens.md) |
| Reset and base | Opt-in `reset.css` / `base.css`: element typography, links, `:focus-visible`, `::selection`, `[hidden]`, `scroll-padding` for sticky UI (WCAG 2.4.11) |
| Visually hidden | `.lue-visually-hidden` (and a focusable variant for skip links) |
| Skip link | `<a class="lue-skip-link" href="#main">` — first focusable element |
| Icon | Inline SVG, `aria-hidden="true"` by default, `currentColor`, sized in `cap`/`em`; direction-implying icons carry `data-mirror` |
| Layout primitives | CSS-only, container-query aware: Stack, Cluster, Grid, Sidebar, Switcher, Center |

## Tier 1 — the first release

| Component | Primitive | Pattern | JS | Depends on / fallback |
| --- | --- | --- | --- | --- |
| Button | `<button type="button">` | Button | none | — |
| Toggle button | `<button aria-pressed>` | Button (toggle) | opt-in `data-lue-toggle` | — |
| Link | `<a href>` | — | none | — |
| Field | `<label>`, hint `<p>`, error `<p>`, `aria-describedby`, `aria-invalid` | — | none | Errors rendered by the server work without JS |
| Text input | `<input>` (correct `type`, `autocomplete`, `inputmode`) | — | none | `:user-invalid`; `field-sizing` where useful |
| Textarea | `<textarea>` | — | none | `field-sizing: content` with min/max rows |
| Checkbox | `<input type="checkbox">` | Checkbox | none | Custom drawing via `appearance: none`, keeps native semantics |
| Radio group | `<fieldset>` + `<legend>` + `<input type="radio">` | Radio group (native arrow keys) | none | — |
| Switch | `<input type="checkbox" role="switch">` | Switch | none | Safari's `switch` attribute as PE |
| Select | `<select>` | — (native) | none | `appearance: base-select` as PE → styled native select |
| Form validation + error summary | Constraint validation, `<form data-lue-validate>` | — | opt-in `data-lue-validate` | Without JS: browser messages + server-rendered summary |
| Dialog | `<dialog>` + `command="show-modal"` + `closedby="any"`; close with `<form method="dialog">` | Dialog (modal) | none | `closedby` is an enhancement (Safari: Esc and buttons close it). Safari < 26.2: `command` buttons are inert in the HTML path |
| Drawer | `<dialog>` positioned to an inline/block edge | Dialog (modal) | none | As Dialog |
| Popover | `[popover]` + `popovertarget`, anchor positioning | Disclosure (non-modal) | none | Without anchoring: browser-centred popover |
| Menu button | `[popover]` with `role="menu"`, anchored | Menu button | element `<lue-menu>` | Keyboard model needs the element; opening works without it |
| Toggletip | `[popover]` (`hint` as PE) | — (click-to-show help) | none | `popover="hint"` → `manual`/`auto` |
| Disclosure | `<details>` / `<summary>` | Disclosure | none | `::details-content` animation as PE |
| Accordion | `<details name>` group | Accordion | none | Exclusive open state is native |
| Alert / callout | Static `<aside>`, or `role="status"`/`role="alert"` when injected | — | none | — |
| Toast | `popover="manual"` region | — (status messages, WCAG 4.1.3) | element `<lue-toast-region>` | `ariaNotify()` → live-region fallback |
| Icon | Inline SVG | — | none | — |
| Layout primitives | CSS | — | none | Container queries |

## Tier 2

| Component | Primitive | Pattern | JS |
| --- | --- | --- | --- |
| Tabs | `<lue-tabs>` enhancing buttons + panels | Tabs | element |
| Toolbar | `role="toolbar"` + `<lue-roving>` | Toolbar | element (deleted when `focusgroup` is Baseline) |
| Tooltip (hover/focus) | `[popover]` + `data-lue-tooltip` | Tooltip | opt-in (Esc to dismiss, hover persistence — WCAG 1.4.13) |
| Segmented control | Radio group, styled | Radio group | none |
| Breadcrumb | `<nav aria-label>` + `<ol>` + `aria-current="page"` | Breadcrumb | none |
| Pagination | `<nav>` + links + `aria-current="page"` | — | none |
| Badge / tag | `<span>`; removable tag = button with a label | — | none |
| Card | `<article>` / `<section>`; whole-card link via a stretched pseudo-element | — | none |
| Progress / meter | `<progress>` / `<meter>` | — | none |
| Spinner / skeleton | `aria-busy` on the region + status text | — | none |
| Avatar | `<img alt>` with initials fallback | — | none |
| Table | `<table>` + `<caption>`, container-aware overflow | — | none |
| Carousel | scroll-snap list + previous/next buttons + pause; `::scroll-marker` as PE | Carousel | opt-in |
| Search | `<search>` + `<input type="search">` | — | none |
| Rating | display: text equivalent ("4.5 out of 5"); input: radio group | Radio group | none |
| Swatch picker | Radio group with visible names — never colour alone | Radio group | none |
| Quantity stepper | `<input type="number">` + − / + buttons calling `stepUp()`/`stepDown()` | Spinbutton (native) | opt-in |
| Divider · kbd | `<hr>` · `<kbd>` | — | none |

## Tier 3 — later

| Component | Plan |
| --- | --- |
| Combobox / autocomplete | `<lue-combobox>` (APG combobox + listbox). Document `<input list>` + `<datalist>` as the simplest option where its limits are acceptable |
| Date input | Native `<input type="date">` first; a custom picker only with evidence |
| Slider | `<input type="range">` styled; single-pointer alternative is inherent (WCAG 2.5.7) |
| File upload | `<input type="file">` + a drop zone that keeps a keyboard-accessible button |
| Data table | Sorting and selection on top of the Table component |
| Navigation menu | Disclosure-navigation pattern (not `role="menu"`) |
| Tree | `<lue-tree>` (APG tree view) |
| Steps | `<ol>` + `aria-current="step"` |

## Content blocks — portfolio and editorial (Pass 2)

Added 2026-10-05, when the user moved the focus from commerce to portfolio and blog sites. Blocks are **compositions**
of the components above, shipped as documented HTML recipes first (React adapters render the same markup). Each is
drawn on the C2 canvas.

| Block | Structure | Pattern | JS | Depends on / fallback |
| --- | --- | --- | --- | --- |
| Site header | `<header>` + `<nav aria-label="Main">` + list of links, `aria-current="page"` | Disclosure navigation on small screens | none | Sticky glass bar; `scroll-padding-top` keeps focused targets clear of it (WCAG 2.4.11); opaque without `backdrop-filter` |
| Hero — statement | `<section aria-labelledby>`: kicker, `<h1>`, lede, up to two actions | — | none | Satin background is decorative (`aria-hidden` SVG); text contrast is checked against its lightest and darkest folds; flat canvas fallback |
| Hero — split | Statement hero + `<figure>` (`<img alt>`, or decorative media with empty `alt`) | — | none | Stacks through a container query |
| Hero — article | `<header>` inside `<article>`: kicker, `<h1>`, dek, byline with `<time datetime>` | — | none | — |
| Feature grid | `<ul>` of items: icon tile (decorative), `<h3>`, `<p>` | — | none | `repeat(auto-fit, minmax(min(…, 100%), 1fr))` |
| Project card | `<article>`: `<h3><a>` stretched over the card, media, tag list | Card (Tier 2) | none | One link per card; tags stay outside the stretched link's text |
| Post list item | `<article>`: kicker, `<h3><a>`, excerpt, `<time datetime>` | — | none | — |
| Quote | `<figure>` + `<blockquote>` + `<figcaption>` | — | none | — |
| Pull quote | `<aside aria-hidden="true">` repeating a line from the body | — | none | Hidden from assistive tech because the line is already read in the body |
| Media + text | `<section>` + `<figure>` + text column | — | none | Container query stacks it |
| Timeline | `<ol>` of `<li>` with `<time datetime>` | — | none | — |
| Table of contents | `<nav aria-label="On this page">` + `<ol>` of in-page links | — | none | Current-section highlight via scroll-state queries as PE |
| Code block | `<figure>` + `<pre tabindex="0"><code>` + caption naming the language | — | none (copy button opt-in) | `tabindex="0"` so a scrolling block is reachable by keyboard (WCAG 2.1.1) |
| Figure | `<figure>` + `<img alt>` + `<figcaption>` | — | none | — |
| Author card | `<aside aria-label="About the author">`: avatar, name, short bio, links | — | none | Avatar from Tier 2 |
| Newsletter / CTA band | `<section>` + `<form>`: label, email input, button | — | none | Field + validation from Tier 1 |
| Tag filter | Group of toggle buttons (`aria-pressed`), or links when filtering is a navigation | Button (toggle) | opt-in | Without JS: links to filtered URLs |
| Site footer | `<footer>` + `<nav aria-label="Footer">` | — | none | — |
| Icon tile | Decorative `<span>` with inline SVG, `aria-hidden="true"`; meaning lives in the adjacent text | — | none | Forced colours: the tile drops its material and keeps a border |

## Contract format (draft)

Every component ships a machine-readable contract. **This format is a draft:** Pass 3 hand-writes the keyboard tests
for the first five components, and the final schema is extracted from what those tests actually need. The written
contracts live in [`apps/docs/contracts/`](../../apps/docs/contracts/) (Button, Field and Select so far); they extend this draft
where a component needed it (`react`, `contrast`, `messages`, `withoutJavaScript`).

| Field | Meaning |
| --- | --- |
| `name`, `status` | Component name; maturity (`proposal`, `experimental`, `candidate`, `stable`) |
| `rung`, `rungReason` | Lowest platform-ladder rung used, and why |
| `anatomy` | Parts: element, class, required/optional, fixed attributes |
| `variants` | Attribute-based variants: attribute, values, default (absence) |
| `a11y.role`, `a11y.name` | Role (implicit or explicit) and where the accessible name comes from |
| `a11y.states` | Each state and how it's exposed (pseudo-class or ARIA attribute) |
| `a11y.keyboard` | Keys → actions, per APG |
| `a11y.focus` | Initial focus, focus return, visible indicator |
| `ownedAttributes` | Attributes an element or behaviour writes (frameworks render initial values only) |
| `tokens` | Public tokens and component knobs it uses |
| `platform` | Baseline features relied on; enhancements and their fallbacks |
| `forcedColors` | System-colour mapping |
| `deletionTrigger` | The platform feature that will let us delete its script (or `null`) |

### Example: Button

```html
<button type="button" class="lue-button" data-variant="primary">Save</button>
<button type="button" class="lue-button" aria-pressed="false" data-lue-toggle>Bold</button>
<button type="button" class="lue-button" data-icon-only aria-label="Close">
  <svg class="lue-button__icon" aria-hidden="true">…</svg>
</button>
```

```json
{
  "name": "Button",
  "status": "proposal",
  "rung": "native-element",
  "rungReason": "<button> provides the role, focusability, Enter/Space activation and form participation.",
  "anatomy": {
    "root": { "element": "button", "class": "lue-button", "attributes": { "type": "button" } },
    "icon": { "element": "svg", "class": "lue-button__icon", "required": false, "attributes": { "aria-hidden": "true" } }
  },
  "variants": {
    "variant": { "attribute": "data-variant", "values": ["primary", "danger", "quiet"], "default": "neutral (no attribute)" },
    "size": { "attribute": "data-size", "values": ["sm", "lg"], "default": "md (no attribute)" },
    "iconOnly": { "attribute": "data-icon-only", "type": "boolean", "requires": "aria-label or aria-labelledby" }
  },
  "a11y": {
    "role": "button (implicit)",
    "name": "Text content; aria-label when data-icon-only",
    "states": [
      { "state": "disabled", "via": ":disabled", "note": "Use aria-disabled=\"true\" when the button must stay focusable to explain why it is unavailable" },
      { "state": "pressed", "via": "[aria-pressed]", "appliesTo": "toggle buttons only" }
    ],
    "keyboard": [
      { "keys": ["Enter"], "action": "Activate" },
      { "keys": ["Space"], "action": "Activate on release" }
    ],
    "focus": { "indicator": ":focus-visible outline (--lue-focus-width, --lue-color-focus-ring)" },
    "targetSize": "max(--lue-size-target-min, --lue-size-control-md)"
  },
  "ownedAttributes": { "data-lue-toggle": ["aria-pressed"] },
  "tokens": ["--lue-color-bg-accent", "--lue-color-fg-on-accent", "--lue-button-radius", "--lue-focus-width"],
  "platform": {
    "baseline": ["button", ":focus-visible", ":where()", "@layer"],
    "enhancements": [{ "feature": "text-box", "fallback": "Padding-based optical centring" }]
  },
  "forcedColors": "ButtonFace / ButtonText / ButtonBorder; pressed → SelectedItem / SelectedItemText",
  "deletionTrigger": null
}
```

### Example: Dialog

```html
<button type="button" class="lue-button" commandfor="confirm" command="show-modal">Delete…</button>

<dialog id="confirm" class="lue-dialog" closedby="any" aria-labelledby="confirm-title">
  <h2 id="confirm-title" class="lue-dialog__title">Delete this item?</h2>
  <p class="lue-dialog__body">You can't undo this.</p>
  <form method="dialog" class="lue-dialog__actions">
    <button class="lue-button" value="cancel" autofocus>Cancel</button>
    <button class="lue-button" data-variant="danger" value="delete">Delete</button>
  </form>
</dialog>
```

```json
{
  "name": "Dialog",
  "status": "proposal",
  "rung": "native-attribute",
  "rungReason": "<dialog> gives modality, inertness, top layer and Esc; invoker commands open it without script; <form method=\"dialog\"> closes it with a return value.",
  "anatomy": {
    "root": { "element": "dialog", "class": "lue-dialog", "attributes": { "closedby": "any", "aria-labelledby": "{title id}" } },
    "title": { "element": "h2", "class": "lue-dialog__title", "required": true },
    "body": { "element": "div|p", "class": "lue-dialog__body" },
    "actions": { "element": "form", "class": "lue-dialog__actions", "attributes": { "method": "dialog" } }
  },
  "a11y": {
    "role": "dialog (implicit, modal via showModal)",
    "name": "aria-labelledby → title",
    "keyboard": [
      { "keys": ["Escape"], "action": "Close (cancel event; may be prevented once to confirm discarding changes)" },
      { "keys": ["Tab", "Shift+Tab"], "action": "Move focus within the dialog; the page behind is inert" }
    ],
    "focus": {
      "initial": "Element with autofocus, else the first focusable element",
      "return": "Browser returns focus to the invoker on close",
      "indicator": ":focus-visible outline"
    }
  },
  "ownedAttributes": {},
  "platform": {
    "baseline": ["dialog", "showModal", "invoker commands", "@starting-style", "transition-behavior: allow-discrete"],
    "enhancements": [{ "feature": "closedby", "fallback": "No light dismiss; Esc and the dialog's buttons close it (Safari)" }],
    "knownGaps": [{ "where": "Safari < 26.2, HTML path", "gap": "command buttons do nothing", "policy": "ADR-0004 — no polyfill" }]
  },
  "forcedColors": "Canvas / CanvasText with a visible border; ::backdrop stays transparent-dark",
  "rules": [
    "Never pass React's open prop (opens non-modal without inertness)",
    "Popovers inside the dialog stay DOM children of the dialog (never portalled)",
    "Scroll lock: html:has(dialog:modal) { overflow: hidden } with scrollbar-gutter: stable"
  ],
  "deletionTrigger": null
}
```
