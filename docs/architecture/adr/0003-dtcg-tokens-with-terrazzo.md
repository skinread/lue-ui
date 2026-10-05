# ADR-0003: DTCG 2025.10 tokens, built with Terrazzo

- **Status:** Proposed — tool choice confirmed by spike B in Pass 3
- **Date:** 2026-10-05
- **Principles:** 1 accessible by construction · 3 standards over invention · 10 legible to humans and agents

## Context

The predecessor stored hex colours in JavaScript objects duplicated in three places, with no tiers and no contrast
checks. The DTCG format reached its first stable version (2025.10) with Format, Color and Resolver modules. We need
one source that produces CSS for every theming context, a Tailwind bridge, the list-shaped `tokens.json` that the
Claude Design system reads, and Figma-ready files — and we need every colour pair contrast-tested.

## Decision

1. **Source of truth: DTCG 2025.10 JSON,** colours in OKLCH, with a **resolver** describing the theming axes: brand ×
   scheme × contrast × density.
2. **Build with Terrazzo, version pinned.** Its resolver and permutation support emits one CSS block per context; its
   plugin API writes the Claude Design list shape; its `a11y/min-contrast` lint checks declared pairs.
3. **Emit literal values per context.** No `light-dark()` and no `color-mix()` inside token custom properties; no
   `@property` registration for themeable colours.
4. **Precompute state tokens** (hover, active, disabled, …) for every context, so they are testable and readable by
   design tools.
5. **Foreground/background pairs** are declared in `$extensions` and feed the contrast matrix.
6. **Claude Design edits come back as a reviewed diff** through an import script; the DTCG files stay the source.

## Consequences

- **Positive:** standard, portable source; contrast guaranteed per context; one pipeline for CSS, TS, Tailwind,
  Claude Design and Figma; themes are files, not forks.
- **Negative:** generated CSS is larger than a runtime-derived approach (mitigated by emitting per-axis differences
  only); we depend on Terrazzo's maturity (mitigated by pinning and golden-file tests); the resolver module is still
  evolving.
- **Follow-ups:** spike B; golden files; the import script for Claude Design edits.

## Alternatives considered

- **Style Dictionary v5.** Large ecosystem, but its own docs say 2025.10 support is incomplete. Revisit if Terrazzo
  falls short.
- **A custom build script.** Full control, but we'd maintain a token compiler instead of a design system.
- **Claude Design `tokens.json` as the source.** A proprietary list shape without aliases or resolver semantics; used
  as an output and an import path instead.
- **Runtime derivation of states with relative colour syntax.** Elegant and small, but can't be contrast-tested in CI
  or read by design tools; kept only for ad-hoc brand colours supplied at runtime.
