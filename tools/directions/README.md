# Direction tools (Phase 1)

Dependency-free Node scripts (Node ≥ 22; last run on 26.10) that seed and verify the three Claude Design directions.
They are design tooling, not library code, and the Terrazzo token pipeline replaces the contrast checks in Pass 3.
Output goes to `out/` (gitignored).

| Script | What it does | Run |
| --- | --- | --- |
| `contrast.mjs` | OKLCH → sRGB (gamut-mapped) → WCAG 2.x ratio, plus APCA Lc (advisory). Run directly, it prints the lightness bands used in [tokens.md](../../docs/design/tokens.md#contrast-by-construction) | `node contrast.mjs` |
| `palettes.mjs` | The seeded palettes (3 directions × light/dark) and the 12 pair rules (36 checks per scheme). Prints pass/fail and the tightest margin | `node palettes.mjs` |
| `report.mjs` | Writes `out/palette-values.json` and `out/palette-report.md` — the tables in the brief's appendix | `node report.mjs` |
| `build-canvas.mjs` | Generates the 10 artboards and `canvas.json` into `out/canvas/project/` | `node build-canvas.mjs` |

## Changing a direction

1. Edit colours in `palettes.mjs`, or fonts, type, radii, spacing, motion and signature CSS in `DIRS` in
   `build-canvas.mjs`.
2. `node palettes.mjs` must print **0 fail** for every direction and scheme.
3. `node report.mjs`, then replace the appendix of [the brief](../../docs/design/claude-design-brief.md) with
   `out/palette-report.md` (each direction inside its own `<details>` block).
4. `node build-canvas.mjs`, then republish (below).

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
   (`2026-10-04T22:01:56Z`) is hardcoded and must not change.

## Canvas format rules learned in Phase 1

- Every artboard keeps the head line `<script src="./support.js"></script>` exactly.
- Close every non-void element and quote every attribute. Boolean attributes are written as `attr="attr"`, because the
  runtime is React-based and may drop empty boolean values (not verified; defensive).
- Inputs show text through `value="…"` (rendered read-only); booleans like `checked="checked"`.
- No `{{` or `}}` inside CSS: those are template holes. Holes are dotted lookups only, never expressions.
- Fonts load only through one Google Fonts `css2` `<link>` in `<helmet>`; no `data:` URIs; icons are inline SVG
  styled by the `.icon` class.
- Board heights are fixed per type (Foundations 3150, Components 2400, Checkout 1240, Main 1060). If a board looks
  clipped, raise its `H` and republish both the board and `canvas.json`.
- The Design type asks agents not to screenshot or re-verify a canvas unless the user asks.
