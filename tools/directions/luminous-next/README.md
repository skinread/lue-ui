# Lue, next materials (proposal)

A specimen page for a more luminous take on C2 · Chroma Luminous
([ADR-0009](../../../docs/architecture/adr/0009-visual-direction-chroma-luminous.md)): clearer glass, refraction at the
edge, polished metal, and wide-gamut light. **Nothing here is in the library yet.** It lives on the
`design/luminous-next` branch until the user approves the direction; then the rules move into `packages/tokens/src`
and `packages/css/src`, and an ADR records the change.

## Run it

```bash
pnpm design-kit                                # builds the current bundle into tools/directions/out/claude-design-kit
python3 -m http.server 8123 -d tools/directions
```

Open <http://localhost:8123/luminous-next/>. The "Light theme" button switches schemes. `.claude/launch.json` has the
same server as `directions`.

## How it's built

`index.html` loads the current bundle, then `luminous-next.css`, which overrides **inside the same layers**
(`lue.tokens`, `lue.components`, `lue.materials`, `lue.contrast`). So it shows real Lue components, the increased
contrast, reduced transparency and forced-colour rules still win, and porting it means moving rules, not rewriting
them. `tokens.css` and `base.css` are the page's own scale and base (from Hallmark's scaffold), in a `page` layer below
Lue's.

## What changes

| Area | Now | Proposed |
| --- | --- | --- |
| Glass | One frosted tint everywhere; reads as grey boxes on a dark canvas | Text surfaces keep their tested tint and backdrop filter (contrast 0.75, brightness 0.6 in dark), with a specular top rim, cool and warm split colour at the sides, a dome highlight and a thin streak. A new `data-tier="clear"` for frames and objects with nothing to read: thin, saturated, thick at the edge |
| Caustic | None | Opt-in with `data-caustic`: light pooled along a glass object's lower lip (`::after`), in the padding, under no text. Kept for hero objects, so it stays light rather than a stamp on every panel |
| Chrome ring | An even grey conic gradient | Polished metal: two specular spikes, dark horizons beside them, cool sky above, warm floor below, the short spectrum at the lower edge. Every stop clears 3:1 on canvas and surface |
| Primary button | Iridescence mostly below the button; hover adds four sparks | Iridescence pooled visibly at the base; on hover one specular glint sweeps across (`background-position`, instant under reduced motion). **No sparks** |
| Switch, checkbox, radio | Flat bead | A polished metal bead with a highlight; a specular lip on the track |
| Progress | Flat prism fill | Prism light in a glass tube with a specular line |
| Light | Two soft orbs and a band behind content | One pale beam that enters a glass object and leaves as a spectrum (rose, amber, citron, mint, aqua, azure: no purple-to-blue) |
| Wide gamut | Parked | **Light only:** the rays, pools and fringes take Display P3 chroma inside `@media (color-gamut: p3)`. Never text or a boundary, so no contrast pair moves |
| Chrome text | A grey ramp | Sky above, a dark horizon, a warm floor below; every stop 3:1 on canvas (large text) |
| Tags | Mono, uppercase, tracked | The body face, sentence case, untracked |
| Refraction | None | Real displacement on clear glass: `lens-map.svg` through an SVG filter in `backdrop-filter` bends the backdrop at the rim and leaves the middle alone. Renders in Chromium only, so `lens.js` sets `data-lens` there; everywhere else clear glass keeps its CSS rim and fringes |
| Pearl | Light added to pearl paper, so it barely showed | Coloured light multiplies on pearl (light through stained glass on a white wall) at more chroma; a cool beam; a defined lower lip and edge on glass; stronger side fringes |
| Panels | 20 px corners, thin glass | 40 px corners (80 px where `corner-shape: squircle` applies, since a squircle needs more to look as soft) and thick glass: a bright bevel inside the top edge, a darker one inside the bottom, the slab's lit side showing below it, a contact shadow and a long soft one |
| Chrome set | Checkbox, radio and switch filled with prism tones; tabs underlined; segmented options as glass | One liquid-chrome material for all five. Off is a recessed dark well in a 2 px chrome bezel with a lit lip; on is polished chrome reflecting a horizon (sky, a dark band, a warm floor). Checkbox: a chrome cushion with the tick engraved. Radio: a chrome ball bearing in the well. Switch: the same ball rolling along the well, lit with prism light when on. Tabs and the segmented control: a recessed well, the selected option a raised chrome key with its name engraved. Sized up a step (24 px boxes, a 52 by 30 switch) |
| Squircles | The chrome ring stays round when the surface is a squircle, so they separate at the corners (a current bug) | `corner-shape: inherit` on the ring and caustic |

## Checked

- Contrast, the way `packages/tokens/plugins/materials.js` models it (worst backdrop, both readings of the backdrop
  filter): dark fg-default on overlay glass with the new sheen 8.63 (min 7), fg-muted 4.90 (4.5); light 16.20 and
  6.75; dark primary text on its strongest iridescence over surfaces and glass 6.09 (4.5); weakest chrome stop 3.61
  dark, 3.41 light (3); chrome text 3.25 dark, 4.03 light (3, large text); light primary text 10.73 (4.5). Not yet wired into the token build's gate: that happens when it's ported.
- Increased contrast, reduced transparency and forced colours drop the caustic, the glint and the light.
- The chrome set: engraved marks on the darkest chrome stop 5.07 dark, 4.31 light (3); tab text on the chrome key
  9.91 and 11.34 (4.5); the switch ball against its lit track 4.14 and 5.16 (3).
- Not checked: Firefox and Safari rendering (Chromium only so far), and the modal glass tier's new sheen over the
  scrim.

## Porting notes

- **The lens is the one open question.** No engine can be feature-detected for rendering SVG filters in
  `backdrop-filter`, and one that parses but doesn't render would lose the whole filter. The specimen checks for
  Chromium (`navigator.userAgentData`, in `lens.js`); the library would need an ADR for that, or keep the lens out.


Found on the way, in the current library (worth fixing whatever happens to this proposal):

- The chrome ring ignores `corner-shape` (above).
- `.lue-button` and the field controls transition `box-shadow`, which `:focus-visible` also sets, so the focus glow
  fades in (the outline itself is instant).
- The primary's iridescence and `.lue-ambient` include an orchid-into-azure step; Hallmark reads it as a
  purple-to-blue gradient.
- Disabled choices (`.lue-checkbox`, `.lue-radio`, `.lue-switch`) are signalled by opacity alone.
- `.lue-tag`, `.lue-kicker` and the code caption use tracked mono capitals.
