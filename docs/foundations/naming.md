# Naming

> **Status:** Shortlist for decision · 2026-10-05
> `never-ui` is a working title. This page proposes replacements and records what is free to claim.

## What the name has to do

- Say something true about the mission — access, the platform, craft — without being a generic word.
- Be **original**: not borrowed from, or confusable with, an existing design system.
- Be **claimable**: an unscoped npm package, an npm scope (`@name/css`, `@name/react`, …) and a GitHub organisation.
- Be easy to say and spell, and give a short CSS prefix (2–3 letters) that doesn't collide with legacy `--vui-*`
  variables or read as "Tailwind" (`tw-`).

## Shortlist

| Name | The story | Prefix |
| --- | --- | --- |
| **Evenweave** | Evenweave cloth has the same number of threads in both directions, so every square is equal. Equal access, a regular structure — and the web is a weave. | `ev` |
| **Kerbcut** | The kerb-cut effect: a ramp built for wheelchair users also helps prams, bikes and suitcases. Design for disability and everyone benefits. The Australian spelling marks where it started. | `kc` |
| **Plainweave** | The simplest and strongest of all weaves — one thread over, one under. A system woven from plain HTML. | `pw` |
| **Withgrain** | Work *with* the grain of the web: use each material the way it wants to be used. | `wg` |
| **Grainwise** | The same idea, said more softly. | `gw` |
| **Stepfree** | "Step-free access" means no barriers — and the system needs no build step. | `sf` |

**Favourites: Evenweave and Kerbcut.** Evenweave carries both equity and structure, and suggests a visual language
(grids, even rhythm, woven texture) for the Claude Design directions. Kerbcut tells the accessibility story most
directly.

## Availability

Checked 2026-10-05 against `registry.npmjs.org` (package, and the org endpoint `/-/org/<name>/package`) and
`api.github.com/users/<name>` (covers users and organisations).

| Name | npm package | npm scope | GitHub |
| --- | --- | --- | --- |
| evenweave | free | free | free |
| kerbcut | free | free | free |
| plainweave | free | free | free |
| withgrain | free | free | free |
| grainwise | free | free | free |
| stepfree | free | free | **taken** (use `stepfree-ui`) |

Also checked and ruled out (npm package or GitHub name taken): selvedge, kerb, curbcut, vernacular, lintel, rung,
loam, plumb, weft, tenon, handrail, tactile, groundwork, grain, linen, footing, heddle, twill, stile, cairn, kerf,
waymark, plumbline, handhold, openweave, warpweft, weftwise.

**Not yet checked:** domains and trademarks.

## Once a name is chosen

1. Create the npm organisation and the GitHub organisation; publish placeholder packages so they're held.
2. Search trademarks (IP Australia, USPTO, EUIPO) and register a domain.
3. Replace `never-ui` and the `ns` prefix across the docs and the Claude Design system.
4. Record the decision as an ADR.
