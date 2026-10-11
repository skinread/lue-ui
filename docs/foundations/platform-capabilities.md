# Platform capabilities

> **Status:** Capability matrix · data as of **2026-10-03** · review quarterly
> **Engines at the time of writing:** Chrome/Edge 154 (22 Sep) · Firefox 157 (29 Sep) · Safari 27.0 (14 Sep).
> Chrome and Firefox now ship every two weeks, so re-check anything marked *Limited* before relying on it.

Status comes from the webstatus.dev API (web-features / BCD), cross-checked against browser release notes. Where the
trackers lag the release notes, that is flagged.

**Key:** **W** widely available · **N** newly available (month it reached Baseline) · **L** limited ·
Cr Chrome/Edge · Fx Firefox · Sf Safari · TP Safari Technology Preview · PE progressive enhancement.

## Support policy

- **Fidelity floor: Baseline newly available.** The full design — look, behaviour, accessibility — uses only features
  available in all three engines.
- **Progressive enhancement above the floor.** Anything newer sits behind `@supports` or feature detection and
  degrades to an accessible equivalent. The base experience must be complete without it.
- **No polyfills (2026-10-11):** on Safari older than 26.2 (e.g. iOS 18), HTML-path `command` buttons that open
  dialogs do nothing. A conditional fix was declined and kept as a possible future enhancement in
  [ADR-0004](../architecture/adr/0004-support-floors.md).
- **Enforced** by Baseline lint for CSS (`@eslint/css` `use-baseline`) and HTML (html-eslint `use-baseline`), and by
  tests in Chromium, Firefox and WebKit.

## CSS traps we design around

1. **Never put a non-Baseline function inside a custom property.** `--w: if(…)` parses everywhere, but
   `width: var(--w)` becomes *invalid at computed-value time* in engines without `if()` and resets to `unset` instead
   of falling back. Use the function directly on the property after a static declaration, or wrap in `@supports`.
2. **Never put `light-dark()` in token custom properties.** Lightning CSS (Vite 8's default minifier) lowers it into
   `--lightningcss-light/dark` variables, which are invalid inside a custom-property value — colours vanish in
   production builds. Tokens emit literal values per scheme; `light-dark()` is allowed only on real properties.
3. **Never `@property`-register themeable colours.** Registered `<color>` properties inherit the *resolved* colour,
   which breaks nested light/dark "scheme islands". Register only private, non-inheriting knobs.
4. **Focus rings use `outline`**, not `box-shadow` — forced-colours mode removes box-shadows.
5. **Fluid type mixes `rem` with container units.** Pure viewport units break text zoom (WCAG 1.4.4).
6. **Forced colours keeps `backdrop-filter` and background alpha** (Chromium and Firefox; checked 2026-10-05). Glass
   becomes see-through Canvas over a blurred page unless forced-colours styles set `backdrop-filter: none` and an
   opaque `background-color: Canvas`.
7. **Never build gradient text with `color: transparent`.** Firefox's forced colours overrides
   `-webkit-text-fill-color` but leaves `color: transparent` alone, so the text vanishes. Keep `color` solid and
   clear only `-webkit-text-fill-color`, inside `@supports`.

## CSS architecture

| Feature | Status | Use in a component library |
| --- | --- | --- |
| `@layer` | W | Overridable library CSS; app CSS outside layers always wins |
| Nesting, `:has()` | W (Jun 2026) | Variants kept together; parent/state styling such as `:has(:user-invalid)` |
| `@scope` | N Mar 2026 | Scoped styles without Shadow DOM; `to (.slot)` "donut" limits protect slotted content |
| `@property` | N Jul 2024 | Typed, animatable private knobs (`inherits: false`) |
| Container size queries · style queries · name-only | W · N May 2026 (Fx 151) · N May 2026 | Components that adapt to where they're placed |
| Style-query ranges · scroll-state · anchored container queries | L: Cr 142 · Cr 133 (TP) · Cr 143 | PE only (stuck-header shadow, tooltip arrow flip) |
| `if()`, `@function` | L: Cr 137 / 139; TP | PE only — see trap 1 |
| `@mixin` / `@apply`, `@custom-media` | No engine | Avoid; Lightning CSS `drafts.customMedia` if ever needed at build time |
| `sibling-index()` / `sibling-count()` | N Aug 2026 (Fx 154) | Staggered motion; fall back to inline `--i` |
| Typed `attr()` | L: Cr 133, Fx 155; TP | PE; Interop 2026 area |
| `revert-rule` | Shipped Cr 148, Fx 150, Sf 27 (trackers lag) | Clean overrides inside layers |
| `@supports at-rule()` · `named-feature()` | Cr 148, Fx 157, TP · Cr 150 | Newer feature detection |

## Colour

| Feature | Status | Note |
| --- | --- | --- |
| `oklch()` / `oklab()`, `color(display-p3 …)`, `color-mix()` | W | Ramps in OKLCH; wide gamut behind `@media (color-gamut: p3)` |
| Relative colour syntax | N Sep 2024 | Runtime derivation for ad-hoc brand colours only (tokens precompute states) |
| `alpha()` | N 14 Sep 2026 | Very new; relative colour is the fallback |
| `light-dark()` · with images | N May 2024 · N Sep 2026 | Real properties only — see trap 2; needs `color-scheme`, set it on popovers and dialogs too |
| `contrast-color()` | N Apr 2026 | Black or white only; mid-tones can miss 4.5:1, so on-colours stay precomputed and tested |
| `forced-colors`, `prefers-contrast`, system colours | W | Per-component forced-colours styles |
| `prefers-reduced-transparency` | L: Cr | Honour where present; `prefers-contrast: more` covers the rest |

## Typography and sizing

| Feature | Status | Note |
| --- | --- | --- |
| `clamp()` fluid type | W | `rem` + `cqi`, never pure `vw` |
| `text-box` (trim/edge) | Shipped Cr 133, Sf 18.2, Fx 154 (webstatus still says L) | Optical centring in buttons and badges, as PE |
| `text-wrap: balance` · `pretty` | N May 2024 · L (no Fx) | Headings · harmless PE |
| `field-sizing: content` | N Jun 2026 | Auto-growing inputs and textareas; set min/max |
| `interpolate-size`, `calc-size()` | L: Cr 129 | PE: animating disclosures to `height: auto` |
| `round()` / `mod()` / `rem()` | N May 2024 | Snap to the spacing grid |
| `cap`, `lh`, `rlh`, `ic` · `rcap`, `rch`, `rex`, `ric` | W · N Jan 2026 | Icons sized `1cap`; rhythm in `rlh` |
| `font-size-adjust` | N Jul 2024 | Match fallback-font metrics |
| `hanging-punctuation` | L: Sf | PE |
| `<meta name="text-scale">` | L: Cr 146 | Root size follows OS text size — PE, real accessibility gain |

## Layout

| Feature | Status | Note |
| --- | --- | --- |
| Subgrid | W | Aligning cards and form rows |
| Anchor positioning (`position-area`, `position-try-fallbacks`, `anchor-size()`, implicit anchor from popover invoker) | Core in Cr 125, Sf 26, Fx 147. Trackers say L because newer pieces (transformed anchors, `position-anchor: normal`, `anchor-visible`) are complete only in Sf 27 | Core, with explicit `anchor-scope`/`position-anchor` and **no transformed anchors** (weak in Fx) |
| `display: grid-lanes` (masonry) | L: Sf 26.4; Cr/Fx flags | PE over grid |
| `reading-flow` | L: Cr 137 | Never rely on it — keep DOM order logical (WCAG 1.3.2, 2.4.3) |
| `shape()` | N Feb 2026 | Responsive clip paths |
| `corner-shape` | L: Cr 139; TP (on by default in WebKit main since 14 Aug 2026, not in Safari 27.0 notes); Fx Nightly | PE over `border-radius` |
| Gap decorations · `border-shape` · `flex-wrap: balance` | L: Cr | Decorative PE |

## Motion

| Feature | Status | Note |
| --- | --- | --- |
| Same-document view transitions, `view-transition-class`, `match-element` | N Oct 2025 | Inside `prefers-reduced-motion: no-preference` |
| `:active-view-transition` | N Jan 2026 | |
| Cross-document `@view-transition` | L: Cr 126, Sf 18.2 (Fx: Interop 2026) | Harmless opt-in |
| Nested groups · `element.startViewTransition()` | L: Cr 140 · Cr 147 | Component-scoped transitions, PE |
| Scroll-driven animations | L: Cr 115, Sf 26 (Fx behind pref) | `@supports (animation-timeline: view())` |
| Scroll-triggered animations | L: Cr 146 | PE |
| `@starting-style`, `transition-behavior: allow-discrete` | N Aug 2024 | Popover/dialog entry and exit |
| `linear()` easing, `prefers-reduced-motion` | W | Spring-like easings as tokens |

## Glass, chrome and light

Checked 2026-10-05 for C2 · Chroma Luminous: Chrome 154 and Playwright's WebKit 26.6 probed live with forced colours
emulated; Firefox from its source and BCD (it wouldn't launch under Playwright).

| Feature | Status | Note |
| --- | --- | --- |
| `backdrop-filter` | N Sep 2024 (Safari 18 last) | Unprefixed. If a `-webkit-` line is kept, give it a literal value (some Safari 18.x builds rejected `var()` there). SVG `url()` filters — real refraction — are Chromium-only. An ancestor with opacity < 1, `filter`, `mask`, `clip-path` or `will-change` is a backdrop root, so glass inside glass shows nothing behind the outer pane |
| Masks, `mask-composite: exclude` | W (Jun 2026) | Unprefixed: Cr 120, Fx 53, Sf 15.4. The chrome ring (`mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)`) works in WebKit 26.6 although BCD says Safari lacks `content-box` in masks — keep a WebKit visual test. `background-clip: border-area` (Cr 150, Sf 18.2) is a simpler PE |
| `@property <angle>` animating a `conic-gradient` | N Jul 2024 | Animates in all three. Firefox steps when a keyframe value is `var()` — use literal angles. Repaints on the main thread, so keep it to short interaction transitions; prefer `inherits: false` and animate on the pseudo-element itself |
| `background-clip: text` | L (Fx partial: breaks with multi-layer backgrounds and `fixed` attachment) | PE inside `@supports`, one background layer, with `-webkit-text-fill-color: transparent` and a solid `color` (trap 7) |
| `prefers-reduced-transparency` | L: Cr 118 (Fx behind a pref; Sf no, privacy concerns) | Honour it, but also turn glass opaque under `prefers-contrast: more` and `[data-contrast="more"]` |
| Out-of-gamut OKLCH | W, but every engine clips per channel | Clipping shifts hue and contrast, worst for light tints. Gamut-map tokens at build time; put P3 values only inside `@media (color-gamut: p3)` |
| Forced colours and decoration | — | Gradients and `box-shadow` become `none`; `background-color` is forced but keeps its alpha; `backdrop-filter` stays on in Cr and Fx (trap 6); WebKit changes nothing |
| `backdrop-filter` on `<dialog>` / `::backdrop` | W | `::backdrop` reads its dialog's custom properties in all three. Blur the dialog *or* the backdrop, not both. `overlay` is Cr-only, so exit blur can't animate in Fx and Sf. On iOS 26, `::backdrop` doesn't reach under the address bar ([WebKit 303167](https://bugs.webkit.org/show_bug.cgi?id=303167)) |
| Performance | — | No engine publishes a budget; each `backdrop-filter` is an extra rendering pass, Firefox lags without GPU rendering, and large fixed blurred layers are slow to first paint on iOS. Keep few glass surfaces live; fade with opacity, never animate the blur radius |

## Interactive HTML

| Feature | Status | Note |
| --- | --- | --- |
| `popover` (auto/manual), `:popover-open` | N Jan 2025 | Top layer, light dismiss, Esc, focus return — by the browser |
| `popover="hint"` | L: Cr, Fx 153; TP | Unknown values fall back to `manual`; detect via the property value; no polyfill |
| Invoker commands (`command`/`commandfor`, custom `--commands`) | N Dec 2025 (Sf 26.2 last) | No-JS dialogs and popovers; custom commands fire a `command` event |
| `interestfor` | L: Cr 142 | Excluded — WebKit opposed, not in Interop 2026 |
| `dialog.requestClose()` · `closedby` | N May 2025 · L: Cr 134, Fx 141; TP | `closedby` is an enhancement: in Safari, Esc and the dialog's buttons close it (no light dismiss) |
| `:open`, `ToggleEvent.source` | N May 2026 | |
| `<details name>` · `::details-content` | N Sep 2024 · N Sep 2025 | Exclusive accordions without JS |
| `hidden="until-found"` | L: no Sf | Accept weaker find-in-page in Safari |
| Customizable `<select>` (`appearance: base-select`, `::picker(select)`, `<selectedcontent>`, `::picker-icon`, `::checkmark`) | L: Cr 135, Sf 27; Fx prototyping | Gate with `@supports`; the native select is a perfect fallback; text-only options in v1 |
| CSS carousels (`::scroll-marker`, `::scroll-button()`) | L: Cr 135 (`scroll-marker-group` modes Cr 154) | PE over scroll-snap |
| `:user-valid` / `:user-invalid`, `inert`, `<search>`, `:focus-visible` | W | |
| `focusgroup` | L: Cr/Edge 150 | Feature-detect; otherwise one roving-tabindex code path — never handle arrows twice |
| `<input type="checkbox" switch>` | L: Sf 17.4 | Use `role="switch"` |
| `accent-color` | All desktop engines | |
| Navigation API | N Jan 2026 | Focus management on route changes (docs site, examples) |

## Web components

| Feature | Status | Note |
| --- | --- | --- |
| Form-associated custom elements, ElementInternals (default ARIA), `::part`/`::slotted`, `adoptedStyleSheets` | W | |
| Declarative Shadow DOM | W (Aug 2026) | Not used for core components ([ADR-0001](../architecture/adr/0001-component-model.md)) |
| `:state()` | N May 2024 | Custom pseudo-states for elements |
| ARIA element reflection (`ariaLabelledByElements`) | N Apr 2025 | Can't point into shadow roots |
| CSS module scripts (`with { type: 'css' }`) | L: Cr 123, Fx 147; no Sf | Bundle instead |
| Scoped custom element registries | L: Cr 146, Sf 26; Fx Nightly | Not needed for light DOM |
| Reference Target (cross-root ARIA) | L: Cr 152 | Why we keep labels and controls in the same (light) tree |

## Accessibility standards

- **WCAG 2.2 numbering:** 2.4.11 is *Focus Not Obscured (Minimum)*, AA — not focus appearance. Use `scroll-padding` /
  `scroll-margin` so sticky UI never hides the focused element.
- **2.4.13 Focus Appearance (AAA)** — we adopt it: outline ≥ 2 px with ≥ 3:1 change of contrast, via `:focus-visible`.
- **2.5.8 Target Size (Minimum), AA** — ≥ 24 × 24 CSS px (spacing exception applies). We use 44 × 44 under coarse
  pointers.
- **2.5.7 Dragging Movements, AA** — single-pointer alternative for every drag.
- **3.3.7 Redundant Entry (A)** — `autocomplete`; `formStateRestoreCallback` in any form-associated element.
- **3.3.8 Accessible Authentication (Minimum), AA** — never block paste or password managers; support passkeys.
- **WCAG 3.0** — Working Draft of 10 Sep 2026; contrast method "yet to be determined", so **APCA is not normative**.
- **ARIA 1.3** — Working Draft (4 Jun 2026): `aria-description`, braille labels, suggestion/comment/mark roles.
  Chrome 151 shipped `aria-actions`.
- **`ariaNotify()`** — Baseline newly available 14 Sep 2026 (Cr 141, Fx 150, Sf 27). Detect it, keep a live-region
  fallback, and verify with screen readers before relying on it.
- **European Accessibility Act** — in force since 28 Jun 2025. ETSI published **EN 301 549 v4.1.1** (Sep 2026),
  referencing WCAG 2.2 AA; until it's cited in the EU Official Journal the legal reference remains v3.2.1
  (WCAG 2.1 AA). Build to 2.2 AA now.

## The 15 highest-leverage features

1. **Popover + invoker commands** — disclosure, menus and dialogs; the browser manages top layer, dismissal, focus
   return.
2. **Anchor positioning** — no Floating UI for tooltips, menus, listboxes.
3. **`<dialog>` + `requestClose()` + `closedby` + `:open`** — correct modal semantics and inertness for free.
4. **`@layer` + `@scope` + nesting** — a predictable override contract.
5. **Container size and style queries + `:has()`** — components adapt to placement.
6. **The colour stack** — OKLCH, relative colour, `color-mix()`, `light-dark()`, `contrast-color()`.
7. **`forced-colors`, `prefers-*` and system colours** — robust under user settings.
8. **`:focus-visible` + `:user-invalid` + `field-sizing`** — WCAG 2.2 focus and error handling without JS.
9. **`<details name>` + `::details-content`** — accordions.
10. **Customizable `<select>`** — the hardest widget, made native, with a perfect fallback.
11. **`@starting-style` + same-document view transitions** — motion without libraries.
12. **ElementInternals + `:state()`** — when a light-DOM element needs semantics or custom states.
13. **`ariaNotify()`** — announcements without live-region plumbing (with fallback).
14. **Navigation API** — focus management on route changes.
15. **`focusgroup`** (enhancement) — deletes roving-tabindex code when it lands everywhere.

## Trail-blazing vs table stakes (Oct 2026)

- **Trail-blazing** (one or two engines, rarely used by design systems): `focusgroup`, Reference Target,
  `popover="hint"`, customizable select, CSS carousels, anchored container queries, `if()` / `@function` / typed
  `attr()`, element-scoped view transitions, scroll-state queries, scroll-triggered animations, `text-scale` meta,
  `aria-actions`, `corner-shape`, `grid-lanes`.
- **Baseline but barely adopted:** `contrast-color()`, `ariaNotify()`, `sibling-index()`, `alpha()`, style queries,
  `:open`, `field-sizing`.
- **Table stakes:** layers, nesting, `:has()`, size queries, `@property`; OKLCH, `color-mix()`, relative colour,
  `light-dark()`; `:focus-visible`, popover, dialog, `inert`, `<details name>`, invoker commands, `:user-invalid`;
  `@starting-style`; subgrid, `clamp()`, `text-wrap: balance`; forced-colours and reduced-motion support.

## Progressive-enhancement table

| Feature | Where it works | Strategy |
| --- | --- | --- |
| `if()`, `@function`, typed `attr()` | Cr (Fx `attr()`); TP | Static declaration first, then `@supports`; never inside custom properties |
| Customizable select | Cr, Sf 27 | `@supports (appearance: base-select)`; rich option content stays optional |
| `popover="hint"` | Cr, Fx | Falls back to `manual`; content also reachable by click and keyboard |
| `focusgroup` | Cr/Edge 150 | Feature-detect; else the roving-focus element |
| `closedby` | Cr, Fx | Enhancement only: elsewhere Esc and the dialog's buttons close it |
| Invoker commands on old Safari (< 26.2) | — | None: HTML-path buttons are inert. A conditional polyfill is a possible future enhancement (ADR-0004) |
| Cross-document / nested / element view transitions; scroll-driven and scroll-triggered animations; carousels; `grid-lanes`; `corner-shape`; gap decorations | One or two engines | Pure PE inside `@supports` (`selector(::scroll-marker)` for carousels) |
| `hidden="until-found"` · `reading-flow` | No Sf · Cr only | Accept weaker find-in-page · fix source order |

## What's coming

Interop 2025 closed at 97%. Interop 2026 focus areas include anchor positioning, `attr()`, style queries,
`contrast-color()`, dialog/popover additions (`closedby`, `hint`), scroll-driven animations, view transitions
(including cross-document) and scoped registries — most Firefox and Safari gaps should close by early 2027. Safari TP
already has `if()`, `@function`, `attr()`, `closedby`, `popover="hint"` and `corner-shape`. Open UI's menu elements
(`<menubar>`, `<menulist>`) are at Chromium intent-to-prototype.

## Uncertain points

- webstatus.dev lags real releases (`text-box`, `revert-rule` show as more limited than they are).
- "Limited" on anchor positioning reflects how web-features now scopes the feature, not missing core support.
- The live Interop 2026 dashboard couldn't be read; the last snapshot seen is stale.
- The EU Official Journal date for EN 301 549 v4.1.1 is unconfirmed.
- Playwright's WebKit build reports `corner-shape` as supported though shipping Safari doesn't, so three-engine tests
  ([ADR-0005](../architecture/adr/0005-three-engine-testing-and-a11y-gates.md)) can pass features Safari lacks.
  Real Safari 27.0.1 wasn't tested for the glass checks.
- Whether `@supports` still reports `backdrop-filter` when Firefox disables it without GPU rendering is unchecked.
- The WebKit blog dates Safari 27.0 to 17 Sep; this page says 14 Sep.

## Sources

- Status: [webstatus.dev API](https://api.webstatus.dev/v1/features) · [Baseline 2026](https://web.dev/baseline/2026) ·
  Baseline digests [May](https://web.dev/blog/baseline-digest-may-2026), [Jun](https://web.dev/blog/baseline-digest-jun-2026),
  [Aug](https://web.dev/blog/baseline-digest-aug-2026) · [web platform Jan 2026](https://web.dev/blog/web-platform-01-2026) ·
  [web platform Jun 2026](https://web.dev/blog/web-platform-06-2026)
- Safari: [27.0](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/) ·
  [TP 249](https://webkit.org/blog/18182/release-notes-for-safari-technology-preview-249/) ·
  [TP 251](https://webkit.org/blog/18194/release-notes-for-safari-technology-preview-251/)
- Chrome release notes: [146](https://developer.chrome.com/release-notes/146) · [147](https://developer.chrome.com/release-notes/147) ·
  [148](https://developer.chrome.com/release-notes/148) · [149](https://developer.chrome.com/release-notes/149) ·
  [150](https://developer.chrome.com/release-notes/150) · [151](https://developer.chrome.com/release-notes/151) ·
  [152](https://developer.chrome.com/release-notes/152) · [153](https://developer.chrome.com/release-notes/153) ·
  [154](https://developer.chrome.com/release-notes/154)
- Firefox for developers: [147](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/147) ·
  [150](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/150) · [151](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/151) ·
  [153](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/153) · [154](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/154) ·
  [155](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/155) · [156](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/156) ·
  [157](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/157)
- Interop: [Interop 2026](https://webkit.org/blog/17818/announcing-interop-2026/) ·
  [Interop 2025 review](https://webkit.org/blog/17808/interop-2025-review/) ·
  [focus areas](https://github.com/web-platform-tests/interop/blob/main/2026/README.md)
- Glass, chrome and light (2026-10-05): [backdrop-filter](https://api.webstatus.dev/v1/features/backdrop-filter) ·
  [BCD #25914](https://github.com/mdn/browser-compat-data/issues/25914) · [masks](https://api.webstatus.dev/v1/features/masks) ·
  [registered custom properties](https://api.webstatus.dev/v1/features/registered-custom-properties) ·
  [Firefox 1899531](https://bugzil.la/1899531) · [background-clip: text](https://api.webstatus.dev/v1/features/background-clip-text) ·
  [prefers-reduced-transparency](https://api.webstatus.dev/v1/features/prefers-reduced-transparency) ·
  [gamut mapping (Interop #1394)](https://github.com/web-platform-tests/interop/issues/1394) ·
  [forced colours properties](https://drafts.csswg.org/css-color-adjust-1/#forced-colors-properties) ·
  [corner-shape](https://api.webstatus.dev/v1/features/corner-shape) · [overlay](https://api.webstatus.dev/v1/features/overlay) ·
  [backdrop root](https://drafts.csswg.org/filter-effects-2/#BackdropRoot) · [Firefox 1888024](https://bugzil.la/1888024)
- Specific features: [invoker commands in Safari 26.2](https://www.infoq.com/news/2026/01/html-invoker-commands/) ·
  [interest invokers intent](https://groups.google.com/a/chromium.org/g/blink-dev/c/bX1G_yDt6W4) ·
  [anchor positioning (caniuse)](https://caniuse.com/css-anchor-positioning) ·
  [ariaLabelledByElements (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaLabelledByElements) ·
  [CSS mixins draft](https://drafts.csswg.org/css-mixins-1/) · [Open UI menu](https://open-ui.org/components/menu.explainer/) ·
  [popover accessibility](https://hidde.blog/popover-accessibility/)
- Polyfills: [OddBird anchor positioning](https://github.com/oddbird/css-anchor-positioning/releases) ·
  [invokers-polyfill](https://github.com/keithamus/invokers-polyfill)
- Accessibility: [WCAG 3.0 draft](https://www.w3.org/TR/wcag-3.0/) · [ARIA 1.3](https://www.w3.org/standards/history/wai-aria-1.3/) ·
  [EN 301 549 update](https://accessible-eu-centre.ec.europa.eu/content-corner/news/european-accessibility-standard-en-301-549-has-been-updated-2026-09-07_en) ·
  [EAA ICT standards update](https://www.dwt.com/insights/2026/09/european-accessibility-act-ict-standards-update)
- Tooling: [Lightning CSS transpilation](https://lightningcss.dev/transpilation.html) · [@eslint/css](https://github.com/eslint/css) ·
  [html-eslint use-baseline](https://html-eslint.org/docs/rules/use-baseline)
