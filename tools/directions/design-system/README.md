Lue UI is an open-source, platform-native, accessibility-first design system. Its look is **light, caught in chrome and glass**: neutral surfaces, colour that arrives as light — gathered at an edge, pooled where it lands — and motion only when someone touches the interface. *Lueur* is French for a glimmer of light.

Build with HTML and CSS first. Components are semantic elements with `lue-` classes; variants are `data-*` attributes; state comes from the platform (`:hover`, `:checked`, `[aria-pressed]`, `[open]`). Nothing here needs React.

## Content fundamentals

- Write plainly and calmly. Short sentences, active voice, sentence case everywhere — headings, buttons, labels.
- Address people as "you"; the studio or product speaks as "we" only when it has to.
- Buttons are verbs that say what happens: "Continue to payment", "Remove", "Subscribe". Links say where they go.
- Errors say what went wrong and how to fix it: "Enter a postcode", never "Invalid input".
- No exclamation marks, no emoji, no hype. Let the light do the expressing.
- When a fact is missing, write a visible placeholder in brackets — `[Client]`, `[Year]`, `[Studio name]` — never invent one.

## Colour as light

- **Dark (obsidian) is the primary theme**, light (pearl) the second; `dark-more` and `light-more` are the increased-contrast themes. Every token has a value in all four.
- Set pages on `lue-color-bg-canvas` with `lue-color-fg-default` (7:1 or more everywhere, glass and satin included). Use `lue-color-bg-surface` for opaque cards and as the fallback for glass; `lue-color-bg-surface-subtle` for wells and input fills.
- Secondary text is `lue-color-fg-muted` (4.5:1). Links and accent text are `lue-color-fg-accent`, always underlined in running text.
- Status colours come in pairs — `lue-color-fg-critical` / `lue-color-bg-critical-subtle`, and the same for warning, success and info — and always travel with an icon and a word.
- Boundaries that identify a control are `lue-color-border-strong` (3:1); decorative dividers are `lue-color-border-subtle`. The focus ring is `lue-color-focus-ring`: aqua on obsidian, iris on pearl.
- The **prism** — rose, orchid, iris, azure, aqua, mint, citron, amber — never paints a surface. It appears as light: in primary buttons (`material-iridescence-1…5`), in the multi-tone fills of small controls (`material-prism-fill-1…5`), in the ring of selected states (`material-prism-ring-1…5`), in the dispersion band of chrome (`material-dispersion-0…4`) and as ambient light (`material-ambient-*`).
- Text on a prism fill is `lue-color-fg-on-accent`: obsidian on pearl's pastel tones, pearl on obsidian's jewel tones.

## Materials

- **Chrome.** Every control and surface has a 1 px chrome hairline: steel stops (`material-chrome-0…4`) with a short dispersion band at its lower edge. It is a real 3:1 boundary. Its reflection turns on hover and focus. Selected and on states trade chrome for the multi-tone ring.
- **Glass.** Two tiers: `material-glass-overlay` for menus, popovers, cards, tags and bars; `material-glass-modal` for dialogs, over `lue-color-overlay-scrim`. Text on glass is checked against the worst backdrop — white, black and every fill. Don't nest glass, and don't put buttons on raw photography — put them on a glass panel.
- **Glass buttons.** Neutral buttons are clear glass (`material-button-tint`); primaries carry five prism tones at one lightness that drift on hover (`material-button-prism-base` + `material-iridescence-*`); destructive buttons are rose glass in a solid `lue-color-fg-critical` ring.
- **Liquid metal** (`material-metal-0…3`) for icon tiles and avatars; **satin folds** (`material-satin-0…5`) behind heroes; the **glass prism** and **orb** as hero objects; **ambient light** behind content in brand areas. All decorative.
- Everything above steps aside when asked: under `prefers-reduced-transparency`, `prefers-contrast: more`, the `-more` themes, or without `backdrop-filter`, glass turns opaque, chrome becomes one solid `lue-color-border-strong` line, and satin and ambient light switch off. In forced colours the system colours take over.

## Type

- **Epilogue** for display and headings (light 300 for display), **Figtree** for body and controls, **Spline Sans Mono** for code and for short uppercase micro-labels tracked wide (`lue-text-caption`, the `.lue-kicker` class). All three are self-hosted (SIL OFL), about 88 KB for Latin.
- Use the text styles: `lue-text-display` for heroes only, `lue-text-heading-1` to `-4` for structure, `lue-text-body` for running text (16 px at the smallest, line height 1.6, 45–75 characters), `lue-text-body-sm` for hints, `lue-text-label` for labels and buttons, `lue-text-code` for code.
- Sizes are fluid between 360 px and 1280 px wide; the values shown here are at 1280. Headings take `text-wrap: balance`; display tracking is −0.035 em, headings −0.02 em.
- Never set running text in capitals; micro-labels stay to a few words.

## Space, shape and depth

- Space steps `lue-space-3xs` to `lue-space-3xl` (multiples 0.25–6 of a 16→18 px base). Gaps between sibling groups use `gap`, never margins. Density (`lue-density`) scales only a component's own padding.
- Radii: `lue-radius-xs` (checkboxes), `-s`, `-m` (menus, alerts, media), `-l` (cards, dialogs), `-full` (buttons, tags, toasts — pills). Fields use `lue-field-radius`. Squircle corners where `corner-shape` exists.
- Depth is light, not blackness: `lue-shadow-raised` and `lue-shadow-overlay` add a soft coloured diffusion; `lue-shadow-fringe` is the prism fringe inside glass edges; `lue-shadow-glow-*` are the glows that rise on hover.

## Motion and states

- Light moves only when the person does: on hover the tones drift, the chrome glints and a glow rises; sparks drift along primaries. Everything lasts 320 ms or less (`--lue-motion-duration-slow`) with an ease-out curve. Nothing loops or plays on its own.
- Under `prefers-reduced-motion: reduce` every duration is 0 s.
- Focus is always visible: a 2 px `lue-color-focus-ring` outline, offset 3 px, plus a soft glow. Targets are at least 24 px (44 px on coarse pointers).
- Never rely on colour alone: errors have an icon, words and a thicker boundary; pressed toggles show a check and the multi-tone ring; status tags carry a word.

## Iconography

- **Phosphor**, regular weight (MIT): the real SVGs in the Icons group, inlined so they take `currentColor`. Size them with the text (`.lue-icon`, 1.25 em).
- Icons that imply direction (arrows) mirror in right-to-left layouts (`data-mirror`).
- Icon-only buttons need an `aria-label`; decorative icons and icon tiles are `aria-hidden="true"` with the meaning in nearby text. No emoji, ever.

## Using this system

- `components/bundle.css` is the stylesheet: everything inside `@layer lue` (base, components, blocks, materials, contrast), one class of specificity, logical properties. It reads the tokens as CSS custom properties.
- Themes: here, `data-theme="dark | light | dark-more | light-more"` on any element. In the library, `data-scheme="dark | light"` with `data-contrast="more"`, and the OS preference when neither is set.
- Each component's guidelines give its markup contract — the elements and attributes the consumer provides. Previews are live HTML: hover, focus and the native controls work.
- Behaviour that HTML can't do yet comes later as small light-DOM elements (`<lue-menu>`, `<lue-toast-region>`) under the global `LueUI`.
