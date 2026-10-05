# ADR-0004: Support floors — Baseline fidelity, with one inclusion exception

- **Status:** Proposed — the inclusion exception needs a decision at the Phase 1 review
- **Date:** 2026-10-05
- **Principles:** 8 Baseline-anchored · 1 accessible by construction · value: people first

## Context

We target current evergreen engines only. Some of the features our core relies on became Baseline recently:
invoker commands in December 2025 (Safari 26.2 was last), anchor positioning in January 2026 (Firefox 147). On older
Safari — including iPhones that can't update past iOS 18 — a `command="show-modal"` button does nothing at all; it
doesn't degrade. People on older devices are disproportionately people with less money, which makes this an
inclusion question, not just a compatibility one.

## Decision

1. **Fidelity floor: Baseline newly available.** The full design, behaviour and accessibility rely only on features
   available in Chrome, Firefox and Safari. Everything newer is progressive enhancement with an accessible fallback.
2. **Inclusion exception (proposed):** where a missing feature would leave a control *dead* rather than merely
   plainer, ship a small, conditional fix loaded only when the feature is absent:
   - the invokers polyfill (`command`/`commandfor`);
   - a delegated `closedby` fallback (backdrop click → `requestClose()`).
3. **Prefer older equivalents when they're just as good:** close dialogs with `<form method="dialog">` (widely
   available) rather than `command="close"`.
4. **No other polyfills.** In particular none for `popover="hint"` (an unknown value falls back to `manual`), and
   none for `focusgroup` (our roving-focus element is the single code path).
5. **Retire the exception** when public browser-share data shows Safari < 26.2 below 1%, or at 1.0 — whichever comes
   first.
6. **Deletion roadmap:** every element and fallback names the feature that will let us delete it.

## Consequences

- **Positive:** modern code with no legacy pile; no dead controls for people on older iPhones; a clear, measurable
  exit.
- **Negative:** about 2 KB of conditional code; two code paths to test (real Safari smoke test, polyfill path in
  WebKit with the feature disabled).
- **Follow-ups:** Baseline lint configuration; a polyfill-path test project.

## Alternatives considered

- **Strict Baseline, no exception.** Simplest, but leaves some people with buttons that do nothing.
- **Analytics-driven browserslist.** Right for a product, but an open-source library has no analytics of its own;
  public share data is the proxy.
- **Widely-available floor.** Would exclude invoker commands and anchor positioning — the heart of the platform-native
  interaction layer — until 2028.
