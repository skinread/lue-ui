# ADR-0008: The name is Lue UI

- **Status:** Accepted
- **Date:** 2026-10-05
- **Principles:** 11 distinctive, not decorative · value: open by default · 3 standards over invention

## Context

The project used `never-ui` as a working title, with the CSS prefix `ns`, the npm scope `@ns/*` and the global `NS`
as placeholders. Three naming rounds ([naming](../../foundations/naming.md)) — weaving and kerb words, then light and
prism words, then riffs on *prismatic*, *chroma* and *lumination* — didn't produce a name the user connected with.
The chosen visual direction is C2 · Chroma Luminous: chrome hairlines, liquid glass and colour that appears as
light.

## Decision

1. **Name: Lue UI**, shortened from the French ***lueur*** — a glimmer, a faint gleam of light. It names the visual
   direction (light caught at an edge) without describing it literally. *Lue* is also the French past participle of
   *lire*, "read" — a quiet nod to legibility.
2. **Identifiers:**

   | Use | Value |
   | --- | --- |
   | Display name | Lue UI |
   | Slug (repository, unscoped npm package, GitHub organisation) | `lue-ui` |
   | CSS prefix | `lue` — `--lue-*` tokens, `.lue-*` classes, `data-lue-*` behaviours, `@layer lue`, `<lue-*>` elements |
   | npm scope | `@lue-ui/*` — `@lue-ui/tokens`, `@lue-ui/css`, `@lue-ui/elements`, `@lue-ui/react` (provisional, see below) |
   | JavaScript global (elements IIFE) | `LueUI` |

3. **Availability (checked 2026-10-05):** the unscoped package `lue-ui` and the GitHub name `lue-ui` are free. An npm
   *user* named `lue-ui` already exists with an empty scope, so `@lue-ui/*` is claimable only if that account is ours
   — otherwise the scope falls back to **`@lueui/*`** (free). No product called "Lue UI" turned up in a web search;
   trademarks and domains aren't checked yet.
4. **The repository folder** may stay `never-ui` locally; the published repository is `lue-ui`.

## Consequences

- **Positive:** a short, ownable name with a story that fits both the look and the mission; a three-letter prefix
  that reads well in CSS (`--lue-color-fg-default`) and doesn't collide with legacy `--vui-*` variables or read as
  Tailwind.
- **Negative:** French spelling and pronunciation ("lü-ur", shortened to "lü") may need a pronunciation note in the
  README; *lue* alone is a common French word, so search results will be noisy until the project is known.
- **Follow-ups (need the user, as they publish things):** confirm or replace the `@lue-ui` npm scope; create the npm
  and GitHub organisations and hold placeholder packages; search trademarks (IP Australia, USPTO, EUIPO) and register
  a domain.
- The Claude Design artifacts stay private and are never shared within the organisation, whatever the library's
  publication status (user's rule, 2026-10-05).

## Alternatives considered

- **Round 1–3 candidates** (Evenweave, Kerbcut, Prismway, Clearprism, Isochroma, Lumiris, Chromalume and others) —
  rejected by the user; see [naming](../../foundations/naming.md).
- **`lueur` in full** — taken on npm and GitHub, and harder to say for English speakers.
- **`lu` as the prefix** — shorter, but ambiguous in code and too close to common abbreviations.
