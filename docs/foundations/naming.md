# Naming

> **Status:** Round 3 riff for reaction · 2026-10-05 · rounds 1 and 2 didn't land
> **The project is private and never published** (user's rule, 2026-10-05), so registry availability below is
> information, not a requirement — unless the user says otherwise. Clashes with well-known names still matter.
> `never-ui` is a working title. This page proposes replacements and records what is free to claim.

## What the name has to do

- Say something true about the mission — access, the platform, craft — without being a generic word.
- Be **original**: not borrowed from, or confusable with, an existing design system.
- Be **claimable**: an unscoped npm package, an npm scope (`@name/css`, `@name/react`, …) and a GitHub organisation.
- Be easy to say and spell, and give a short CSS prefix (2–3 letters) that doesn't collide with legacy `--vui-*`
  variables or read as "Tailwind" (`tw-`).

## Round 3 — prismatic, chroma, lumination

The user asked to riff on three themes: *prismatic*, *chroma* and *lumination*.

| Theme | Name | The story | Clash |
| --- | --- | --- | --- |
| Chroma | **Isochroma** | "Equal colour." The button tones share one lightness, so contrast never moves — and everyone gets the same access. It names the system's actual technique. | None found |
| Chroma | **Chromalume** | Colour and light; reads like a luxury lighting atelier. | Mild — Chromalume steel alloys; close to Sondheim's *Chromolume* |
| Chroma | **Chromalis** | Chroma as a constellation or species name. | Mild — a Wolf-Gordon wallcovering collection, a moth |
| Chroma | **Aurachrome** | An aura of light around a chrome rim. | Mild — a French theatre company, a nail-art trend |
| Light | **Lumiris** | Light plus Iris — goddess of the rainbow, and the part of the eye that lets light in. Light, rainbow and sight. | Mild — several small companies |
| Light | **Lumachroma** | Luma and chroma, the two halves of every colour signal: hold luma steady for legibility, let chroma dance. | Mild — a Swiss projection group, a music project |
| Light | **Lucentia** | From *lucent*: glowing, translucent. | Mild — a research group, a cardiac-imaging company |
| Light | **Luminelle** | Light, made soft and luxurious. | Mild — small skincare brands, a game creature |
| Prismatic | **Prismara** | A made-up word with a jewel-like sound, like "tiara". | Mild — a jewellery brand, a studio; echoes Prisma |
| Prismatic | **Dichro** | Dichroic glass shifts colour with the viewing angle, like the drifting button tones. | Mild — glass-art slang, a band |
| Prismatic | **Prismel** | A small prism. | Mild — an OCaml graphics framework |
| Prismatic | **Iridesce** | The verb for shimmering with rainbow colour. | None, but too ordinary a word |

**Leading:** Isochroma (no clash found at all, and the strongest story), Lumiris, Chromalume. The *chroma* names keep
the earlier caveat: they sit near chroma.js and Chroma DB, and "Chrom-" can read as Chromium-only.

**Ruled out for serious clashes:** Panchroma (Polymaker's Panchroma filament line), Lumachrome (META's LumaChrome
banknote film, Lumachrome photo prints), Prismalux (an Italian LED lighting company, Thorlux's Prismalux fitting),
Prismalume (Holophane's Prismalume fittings), Prismatica (a live npm product and Prismatica AI, near Lady Gaga's
*Chromatica*), Chromara (Chromara Beauty), Kromalux (sounds like ChromaLuxe and Chromalux), Opalume (Fagerhult street
lights, Kokomo art glass).

### Round 3 availability

Checked 2026-10-05 (npm package and scope; GitHub through the authenticated API after the anonymous limit ran out).
The web checks were quick searches, not trademark searches.

| Name | npm package | npm scope | GitHub |
| --- | --- | --- | --- |
| isochroma, chromalume, chromalis, aurachrome | free | free | free |
| lumiris, lumachroma, prismara, dichro, luminelle, prismel | free | free | taken |
| lucentia | free | taken (publishes a package) | taken |
| iridesce | free | taken (empty user scope) | taken |

## Round 2 — light, prism and glass (not chosen)

Round 1's weaving and kerb names didn't connect. Round 2 follows the chosen look, **C2 · Chroma Luminous** (chrome,
glass, a prism of subdued neon), and keeps the mission in the story. The thread: white light holds every colour, and
a prism shows them all — nothing added, nobody left out.

| Name | The story | Prefix |
| --- | --- | --- |
| **Prismway** | Light through a prism takes the path of least time (Fermat's principle). The system makes accessible, standard markup the path of least resistance — the mission, almost word for word. | `pw` |
| **Clearprism** | A clear prism adds no colour of its own; it reveals what's already in the light. The system adds little, shows what the platform already gives, and includes everyone. | `cp` |
| **Everyhue** | Every hue is already in white light. A system that leaves no one out, named for the palette it wears. | `evh` |
| **Plainlight** | Plain HTML in plain daylight, nothing hidden — and daylight already holds every colour. | `pl` |
| **Fullhue** | The full range of hue and of people; a shorter cousin of Everyhue. | `fh` |

**Leading candidates: Prismway** (the strongest mission story) **and Clearprism** (the strongest platform story).
Everyhue tells the inclusion story most directly.

### Round 2 availability

Checked 2026-10-05 the same way as round 1. An npm scope that answers 200 with `{}` is an existing (empty) user
scope, so it counts as taken. Prismway, Clearprism and Everyhue were re-checked by hand.

| Name | npm package | npm scope | GitHub |
| --- | --- | --- | --- |
| prismway | free | free | free |
| clearprism | free | free | free |
| everyhue | free | free | free |
| plainlight | free | free | free |
| fullhue | free | free | free |
| huewise, clearhue, allspectra, lucentry, prismset, hueway, spectrawise | free | free | free |
| prismkit | free | free | free — but close to PrismJS and Prisma, and "kit" is generic |
| chromawork | free | free | free — but clashes with chroma.js and the Chroma vector database, and "Chrom-" reads as Chromium-only |
| lightwell | free | free | **taken** (an organisation since 2012) |
| everhue, prismline | free | free | **taken** by near-empty 2026 accounts (`-ui` organisation free) |
| prismwork, lumenwork, dichroic, allhue, clearsight | free | free | **taken** |

Also ruled out in round 2 (npm or GitHub taken): plainsight, whitelight, silverpoint, clearcoat, halation, nacre,
opaline, sightline, fullspectrum (also too close to Adobe Spectrum), glasswork, specular, refract, lightfast,
brightline, allcolour, prismwise, clearpane, whiteprism, openprism, prismlight, truehue, opalith, prismfold,
chromaline, everylight, prismpath, lightwise, glassway, huekit, lumenkit.

## Round 1 — weave and kerb (not chosen)

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

### Round 1 availability

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
