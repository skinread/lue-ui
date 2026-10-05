# Direction tools (Phase 1)

Dependency-free Node scripts (Node ≥ 22; last run on 26.10) that seed and verify the Claude Design directions: the
three Phase 1 directions and **C2 · Chroma Luminous**, the Chroma evolution chosen in Pass 2.
They are design tooling, not library code, and the Terrazzo token pipeline replaces the contrast checks in Pass 3.
Output goes to `out/` (gitignored).

| Script | What it does | Run |
| --- | --- | --- |
| `contrast.mjs` | OKLCH → sRGB (gamut-mapped) → WCAG 2.x ratio, plus APCA Lc (advisory). Run directly, it prints the lightness bands used in [tokens.md](../../docs/design/tokens.md#contrast-by-construction) | `node contrast.mjs` |
| `palettes.mjs` | The seeded palettes (4 directions × light/dark), the 12 pair rules (36 checks per scheme, raised minimums in C2's `-more` contexts), and Luminous's prism, chrome, glass, glass-button, ambient-light, satin and metal rules (36 per scheme). Prints pass/fail and the tightest margin; `--all` lists every Luminous rule | `node palettes.mjs` |
| `report.mjs` | Writes `out/palette-values.json` and `out/palette-report.md` — the brief's appendix, already in `<details>` blocks | `node report.mjs` |
| `luminous-canvas.mjs` | Luminous's per-scheme custom properties, its CSS (chrome ring, glass, prism slide, sparks, fallbacks) and its extra Foundations sections. Imported by `build-canvas.mjs` | — |
| `luminous-pages.mjs` | Luminous's materials (satin folds, glass prism and orb, metal icon tiles, media art) and its fluid boards: block library, portfolio home, journal article | — |
| `build-canvas.mjs` | Generates the 16 artboards and `canvas.json` into `out/canvas/project/` | `node build-canvas.mjs` |
| `tokens.mjs` | Writes the DTCG 2025.10 token source for C2 into `packages/tokens/src/` (12 files: colour per theme context, materials per scheme, type, dimension, motion, components, resolver) | `node tokens.mjs` |
| `check-tokens.mjs` | Checks that source: `$type` and `$description` on every token, aliases resolve, every declared pair passes in all four contexts, body ≥ 16 px. Exits non-zero on failure | `node check-tokens.mjs` |

## Changing a direction

1. Edit colours in `palettes.mjs` (Luminous's prism, chrome, glass and ambient values live in its `luminous`
   export), or fonts, type, radii, spacing, motion and signature CSS in `DIRS` in `build-canvas.mjs` (Luminous's CSS
   is in `luminous-canvas.mjs`).
2. `node palettes.mjs` must print **0 fail** for every direction, scheme and Luminous rule set.
3. `node report.mjs`, then replace everything after the appendix intro of
   [the brief](../../docs/design/claude-design-brief.md) with `out/palette-report.md`.
4. `node build-canvas.mjs`, then republish (below).
5. For C2: `node tokens.mjs && node check-tokens.mjs` to refresh the token source, and commit it with the change.

## Republishing the canvas

Canvas: <https://claude.ai/artifact/9DKJGmK7kPdEt2giN4qDgP> — a Claude Design "Design" artifact, private until its owner
shares it.

1. **Read it first** (Artifact `read` with the url). A publish to an artifact the conversation hasn't read is refused,
   and the owner may have edited boards or left comments (read comments with the ArtifactComments tool).
2. **Never overwrite someone's edits blindly.** If a board was edited on the canvas, fold the edit into the generator
   or edit that board's file directly.
3. **Publish only changed files:** Artifact `publish` with `url`, `root` = the absolute path of `out/canvas`,
   `file_path` = one changed file's absolute path, `files` = the other changed files by their `project/…` paths.
4. **Send `project/canvas.json` only when artboards are added, removed, moved or resized.** Its `createdOnFiles` marker
   (`2026-10-04T22:01:56Z`) is hardcoded and must not change. The editor adds keys of its own (`attachments`, a `w` on
   title notes); the generator writes them too, so a republish doesn't fight it. Re-read the live index first and fold
   in anything new.
5. **Check the untouched boards are byte-identical** to the live copies (read them with Artifact `read` and `paths`,
   then `cmp`), so only changed files go up.

## Canvas format rules learned in Phase 1

- Every artboard keeps the head line `<script src="./support.js"></script>` exactly.
- Close every non-void element and quote every attribute. Boolean attributes are written as `attr="attr"`, because the
  runtime is React-based and may drop empty boolean values (not verified; defensive).
- Inputs show text through `value="…"` (rendered read-only); booleans like `checked="checked"`.
- No `{{` or `}}` inside CSS: those are template holes. Holes are dotted lookups only, never expressions.
- Fonts load only through one Google Fonts `css2` `<link>` in `<helmet>`; no `data:` URIs; icons are inline SVG
  styled by the `.icon` class.
- Board heights are fixed per type (Foundations 3150, Components 2400, Checkout 1240, Main 1060); Luminous overrides
  them in `DIRS.luminous.H` (6000 · 2560 · 1240). If a board looks clipped, raise its `H` and republish both the board
  and `canvas.json`.
- Boards with live hover and focus states carry `is_interactive: true` (the Luminous row), which gives them a Play
  button.
- The canvas has two pages: `luminous` (C2, the launch page: a system row — foundations, components, blocks — and an
  in-use row — portfolio, article, checkout) and `phase-1` (the cover and the three Phase 1 rows). Every board and
  title note carries its `page`.
- Portfolio, journal and block boards are **fluid** (`expand: "fill"`, no root width, `$preview` 1440 wide) and reflow
  to one column. Their heights are estimates (Blocks 8000 — set on the canvas by the user, Portfolio 5400, Article 6600) — raise them if clipped.
- SVG gradients, masks and filters use IDs from one counter per build, so they stay unique across boards. Use
  `gradientUnits="userSpaceOnUse"` on stroked icons — a straight line has a zero-height bounding box and an
  object-bounding-box gradient won't paint it.
- A registered `@property` that a `::before` must read needs `inherits: true` — pseudo-elements don't inherit
  non-inherited properties from their host.
- The Design type asks agents not to screenshot or re-verify a canvas unless the user asks.
