# ADR-0004: Support floors - Baseline fidelity

- **Status:** Accepted (2026-10-11) - the inclusion exception was **declined** and is recorded below as a possible
  future enhancement
- **Date:** 2026-10-05
- **Principles:** 8 Baseline-anchored · 1 accessible by construction · value: people first

## Context

We target current evergreen engines only. Some of the features our core relies on became Baseline recently:
invoker commands in December 2025 (Safari 26.2 was last), anchor positioning in January 2026 (Firefox 147). On older
Safari - including iPhones that can't update past iOS 18 - a `command="show-modal"` button does nothing at all; it
doesn't degrade. People on older devices are disproportionately people with less money, which makes this an
inclusion question, not just a compatibility one.

## Decision

1. **Fidelity floor: Baseline newly available.** The full design, behaviour and accessibility rely only on features
   available in Chrome, Firefox and Safari. Everything newer is progressive enhancement with an accessible fallback.
2. **No inclusion exception (user's decision, 2026-10-11).** Lue UI ships no polyfills. On Safari older than 26.2 a
   `command="show-modal"` button does nothing, and `closedby` light dismiss is absent (Esc and the dialog's own
   buttons still close it). React's `<Dialog open>` opens with `showModal()` from state, so React apps that open
   dialogs from state are not affected (proved in [Spike A](../spikes/spike-a-dialog-menu.md)); HTML-only consumers
   who must support older Safari can load an invokers polyfill themselves.
   *Possible future enhancement:* a small, conditional fix loaded only when the feature is absent - the invokers
   polyfill (`command`/`commandfor`) and a delegated `closedby` fallback (backdrop click → `requestClose()`), about
   2 KB.
3. **Prefer older equivalents when they're just as good:** close dialogs with `<form method="dialog">` (widely
   available) rather than `command="close"`.
4. **No other polyfills.** In particular none for `popover="hint"` (an unknown value falls back to `manual`), and
   none for `focusgroup` (our roving-focus element is the single code path).
5. **If the enhancement is ever added,** retire it when public browser-share data shows Safari < 26.2 below 1%, or
   at 1.0 - whichever comes first.
6. **Deletion roadmap:** every element and fallback names the feature that will let us delete it.

## Consequences

- **Positive:** modern code with no legacy pile and one code path to test.
- **Negative:** on iPhones that can't update past iOS 18 (and older Safari), HTML-path buttons that open dialogs are
  dead rather than plainer. Documentation must say so, and point HTML consumers to a polyfill.
- **Follow-ups:** Baseline lint configuration; a note in the Dialog contract and docs.

## Alternatives considered

- **The inclusion exception** (a conditional invokers polyfill and `closedby` fallback). Proposed in Phase 1;
  declined on 2026-10-11 and kept above as a possible future enhancement.
- **Analytics-driven browserslist.** Right for a product, but an open-source library has no analytics of its own;
  public share data is the proxy.
- **Widely-available floor.** Would exclude invoker commands and anchor positioning - the heart of the platform-native
  interaction layer - until 2028.
