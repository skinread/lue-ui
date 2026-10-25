// Lue UI - component and block definitions for the Claude Design System: one README (guidelines) and one live preview
// per entry. Previews are plain HTML on the library's markup contract (no React): the platform supplies the behaviour.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// Phosphor (MIT), regular weight: the real SVGs, inlined so they take currentColor.
export const icon = (name, extra = '') => fs.readFileSync(path.join(HERE, 'icons', `${name}.svg`), 'utf8').trim()
  .replace('<svg ', `<svg class="lue-icon" aria-hidden="true" focusable="false"${extra} `);

let uid = 0;
const nid = (p) => `${p}${++uid}`;
const stop = (o, v) => `<stop offset="${o}" style="stop-color: var(${v})"></stop>`;

// ---------------------------------------------------------------- decorative materials (aria-hidden)
export function satin(variant = 0) {
  const id = nid('sat');
  const s = [
    ['M-80 520 C 260 300, 560 640, 900 420 S 1360 160, 1520 240', 'M-80 300 C 300 120, 620 420, 980 260 S 1380 40, 1520 90', 'M-80 650 C 380 520, 700 760, 1100 600 S 1400 480, 1520 520'],
    ['M-80 420 C 220 560, 640 260, 960 380 S 1320 600, 1520 470', 'M-80 180 C 360 320, 720 60, 1080 200 S 1400 260, 1520 160', 'M-80 600 C 300 700, 820 520, 1120 640 S 1420 700, 1520 640'],
  ][variant % 2];
  return `<svg class="lue-satin" viewBox="0 0 1440 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><defs>
<linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="0.6">${stop(0, '--lue-material-satin-0')}${stop(0.42, '--lue-material-satin-1')}${stop(0.7, '--lue-material-satin-3')}${stop(1, '--lue-material-satin-0')}</linearGradient>
<linearGradient id="${id}b" x1="0" y1="1" x2="1" y2="0">${stop(0, '--lue-material-satin-2')}${stop(0.5, '--lue-material-satin-0')}${stop(1, '--lue-material-satin-4')}</linearGradient>
<linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="0">${stop(0, '--lue-material-satin-3')}${stop(0.5, '--lue-material-satin-2')}${stop(1, '--lue-material-satin-1')}</linearGradient>
<filter id="${id}f" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="16"></feGaussianBlur></filter>
<filter id="${id}g" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"></feGaussianBlur></filter></defs>
<rect width="1440" height="720" style="fill: var(--lue-material-satin-0)"></rect>
<g filter="url(#${id}f)"><path d="${s[0]} L 1520 760 L -80 760 Z" fill="url(#${id}a)"></path><path d="${s[1]} L 1520 -40 L -80 -40 Z" fill="url(#${id}b)"></path><path d="${s[2]} L 1520 760 L -80 760 Z" fill="url(#${id}c)"></path></g>
<g filter="url(#${id}g)" fill="none" stroke-width="3" style="stroke: var(--lue-material-satin-5); opacity: 0.7"><path d="${s[0]}"></path><path d="${s[2]}"></path></g></svg>`;
}

const glassDefs = (id, x1, x2) => `<linearGradient id="${id}c" gradientUnits="userSpaceOnUse" x1="${x1}" y1="40" x2="${x2}" y2="300">${stop(0, '--lue-material-chrome-0')}${stop(0.3, '--lue-material-chrome-3')}${stop(0.42, '--lue-material-chrome-1')}${stop(0.6, '--lue-material-chrome-0')}${stop(0.8, '--lue-material-chrome-2')}${stop(1, '--lue-material-chrome-4')}</linearGradient>
<linearGradient id="${id}d" gradientUnits="userSpaceOnUse" x1="${x1}" y1="0" x2="${x2}" y2="0">${stop(0, '--lue-material-dispersion-0')}${stop(0.25, '--lue-material-dispersion-1')}${stop(0.5, '--lue-material-dispersion-2')}${stop(0.75, '--lue-material-dispersion-3')}${stop(1, '--lue-material-dispersion-4')}</linearGradient>
<linearGradient id="${id}f" gradientUnits="userSpaceOnUse" x1="0" y1="160" x2="0" y2="305"><stop offset="0" stop-color="#000"></stop><stop offset="1" stop-color="#fff"></stop></linearGradient>
<mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="360"><rect width="400" height="360" fill="url(#${id}f)"></rect></mask>
<filter id="${id}s" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"></feGaussianBlur></filter>
<filter id="${id}b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"></feGaussianBlur></filter>`;

export function prism() {
  const id = nid('pr');
  const tri = 'M180 74.6 Q 200 40 220 74.6 L 330 265.4 Q 350 300 310 300 L 90 300 Q 50 300 70 265.4 Z';
  return `<svg class="lue-prism" viewBox="0 0 400 360" aria-hidden="true" focusable="false"><defs>
<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1">${stop(0, '--lue-prism-glass-top')}${stop(1, '--lue-prism-glass-bottom')}</linearGradient>${glassDefs(id, 60, 340)}</defs>
<ellipse cx="200" cy="334" rx="150" ry="14" filter="url(#${id}s)" style="fill: var(--lue-prism-shadow)"></ellipse>
<path d="${tri}" fill="url(#${id}g)"></path>
<path d="${tri}" fill="none" stroke="url(#${id}d)" stroke-width="26" stroke-linejoin="round" mask="url(#${id}m)" filter="url(#${id}b)" opacity="0.65"></path>
<path d="${tri}" fill="none" stroke="url(#${id}c)" stroke-width="12" stroke-linejoin="round"></path>
<path d="${tri}" fill="none" stroke="url(#${id}d)" stroke-width="12" stroke-linejoin="round" mask="url(#${id}m)"></path></svg>`;
}

export function orb() {
  const id = nid('orb');
  return `<svg class="lue-prism" viewBox="0 0 400 360" aria-hidden="true" focusable="false"><defs>
<radialGradient id="${id}g" cx="0.38" cy="0.32" r="0.75">${stop(0, '--lue-prism-glass-top')}${stop(1, '--lue-prism-glass-bottom')}</radialGradient>${glassDefs(id, 90, 310)}</defs>
<ellipse cx="200" cy="330" rx="120" ry="12" filter="url(#${id}s)" style="fill: var(--lue-prism-shadow)"></ellipse>
<circle cx="200" cy="172" r="118" fill="url(#${id}g)"></circle>
<circle cx="200" cy="172" r="118" fill="none" stroke="url(#${id}d)" stroke-width="24" mask="url(#${id}m)" filter="url(#${id}b)" opacity="0.6"></circle>
<circle cx="200" cy="172" r="118" fill="none" stroke="url(#${id}c)" stroke-width="10"></circle>
<circle cx="200" cy="172" r="118" fill="none" stroke="url(#${id}d)" stroke-width="10" mask="url(#${id}m)"></circle></svg>`;
}

export const tile = (name, size) => `<span class="lue-tile"${size ? ` data-size="${size}"` : ''} aria-hidden="true">${icon(name)}</span>`;
export const media = (object = 'prism', variant = 0, ratio) => `<div class="lue-media"${ratio ? ` style="aspect-ratio: ${ratio}"` : ''}>${satin(variant)}${object === 'prism' ? prism() : object === 'orb' ? orb() : object === 'tile' ? tile('sparkle', 'lg') : ''}</div>`;
const stage = (inner, style = '') => `<div class="lue-stage" style="padding: 24px; min-block-size: 100%; box-sizing: border-box; ${style}"><div class="lue-ambient" aria-hidden="true"></div>${inner}</div>`;

// ---------------------------------------------------------------- the inventory
// Each: [Name, group, height, README markdown (first sentence = summary), preview body].
const md = (s) => s.trim() + '\n';
export const COMPONENTS = [
  ['Button', 'Actions', 260, md(`
A frosted-glass action inside a chrome hairline. Primary buttons carry five prism tones at one lightness that drift on hover.

**Use it for** actions. Navigation is a link (\`<a class="lue-button">\` when it must look like a button).

**Markup** - \`<button type="button" class="lue-button">\`; variants by attribute: \`data-variant="primary | danger | quiet"\`, \`data-size="sm | lg"\`, \`data-icon-only\` (with \`aria-label\`).

- One primary per view. Danger only for destructive actions, always with a word (never colour alone).
- Labels are verbs in sentence case: “Continue to payment”.
- Inside a glass parent the button doesn't blur again (the parent is a backdrop root).

**States** come from the platform: \`:hover\` (tones drift, chrome glints, glow rises - 320 ms, instant under reduced motion), \`:active\`, \`:focus-visible\` (2 px ring + glow), \`:disabled\`, \`[aria-pressed]\`. Labels hold 4.5:1 over any surface, glass or satin, up to three tones deep.
`), stage(`<div style="display: grid; gap: 18px">
  <div class="lue-actions"><button type="button" class="lue-button" data-variant="primary">Continue</button><button type="button" class="lue-button">Save for later</button><button type="button" class="lue-button" data-variant="danger">Remove</button><button type="button" class="lue-button" data-variant="quiet">Edit details</button></div>
  <div class="lue-actions"><button type="button" class="lue-button" data-variant="primary" data-size="sm">Small</button><button type="button" class="lue-button" data-variant="primary" data-size="lg">Large</button><button type="button" class="lue-button" data-variant="primary" disabled>Disabled</button><button type="button" class="lue-button" data-icon-only aria-label="More actions">${icon('dots-three')}</button></div>
  <p class="lue-kicker">Hover, press and Tab through them</p>
</div>`)],

  ['ToggleButton', 'Actions', 120, md(`
A button that stays on: pressed toggles trade chrome for the multi-tone ring and show a check, so state never rests on colour alone.

**Markup** - \`<button type="button" class="lue-button" aria-pressed="false">\`. Without JavaScript, opt in to \`data-lue-toggle\` to flip \`aria-pressed\` on click; React adapters manage the state themselves.

- Keep the label constant ("Bold"), and let the pressed state carry on/off.
`), stage(`<div class="lue-actions"><button type="button" class="lue-button" aria-pressed="true">${icon('check')}<span>Bold</span></button><button type="button" class="lue-button" aria-pressed="false">Italic</button></div>
<script>document.querySelectorAll('[aria-pressed]').forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); }); });</script>`)],

  ['Link', 'Actions', 90, md(`
Text links are underlined, always - in running text and alone.

**Markup** - \`<a class="lue-link" href="…">\` (base styles cover plain \`<a>\` in prose). \`fg-accent\` holds 4.5:1 on canvas, surfaces, glass and satin.
`), stage(`<p>Read the <a class="lue-link" href="#">accessibility statement</a> or <a class="lue-link" href="#">get in touch</a>.</p>`)],

  ['Field', 'Forms', 260, md(`
A labelled text input with an optional hint and an error message, wired with \`aria-describedby\`.

**Markup**
\`\`\`html
<div class="lue-field">
  <label class="lue-field__label" for="pc">Postcode</label>
  <p class="lue-field__hint" id="pc-hint">4 digits</p>
  <input class="lue-input" id="pc" inputmode="numeric" autocomplete="postal-code" aria-describedby="pc-hint pc-error" aria-invalid="true">
  <p class="lue-field__error" id="pc-error">…icon… Enter a postcode</p>
</div>
\`\`\`

- Wells are opaque, inside a chrome hairline (every stop 3:1). Invalid fields get a 2 px critical boundary, an icon and a message - never colour alone.
- Use the right \`type\`, \`autocomplete\` and \`inputmode\`. \`.lue-textarea\` grows with \`field-sizing: content\`.
`), stage(`<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 20px">
  <div class="lue-field"><label class="lue-field__label" for="em">Email</label><p class="lue-field__hint" id="emh">For your receipt</p><input class="lue-input" id="em" type="email" autocomplete="email" value="sam@example.com" aria-describedby="emh"></div>
  <div class="lue-field"><label class="lue-field__label" for="pc">Postcode</label><p class="lue-field__hint" id="pch">4 digits</p><input class="lue-input" id="pc" inputmode="numeric" aria-invalid="true" aria-describedby="pch pce"><p class="lue-field__error" id="pce">${icon('warning-circle')}<span>Enter a postcode</span></p></div>
</div>`)],

  ['Select', 'Forms', 140, md(`
The native \`<select>\`, styled; the open picker is the platform's own (\`appearance: base-select\` is a later enhancement).

**Markup** - \`<div class="lue-select-wrap"><select class="lue-select">…</select>{caret icon}</div>\` inside a \`.lue-field\` with its label.
`), stage(`<div class="lue-field" style="max-inline-size: 22rem"><label class="lue-field__label" for="st">State or territory</label><div class="lue-select-wrap"><select class="lue-select" id="st"><option>New South Wales</option><option>Victoria</option><option>Queensland</option></select>${icon('caret-down')}</div></div>`)],

  ['Checkbox', 'Forms', 150, md(`
A native checkbox: a chrome-ringed well that fills with the multi-tone prism when checked, with an obsidian (light) or pearl (dark) mark.

**Markup** - \`<label class="lue-choice"><input class="lue-checkbox" type="checkbox"><span>Label</span></label>\`. Group related boxes in a \`.lue-fieldset\` with a \`<legend>\`.

- The mark holds 4.5:1 on every tone; the ring is a 3:1 boundary. Invalid: \`aria-invalid="true"\`.
`), stage(`<fieldset class="lue-fieldset"><legend>Preferences</legend>
<label class="lue-choice"><input class="lue-checkbox" type="checkbox" checked><span>Save these details</span></label>
<label class="lue-choice"><input class="lue-checkbox" type="checkbox"><span>Send me updates</span></label>
<label class="lue-choice"><input class="lue-checkbox" type="checkbox" aria-invalid="true"><span>Accept the terms (required)</span></label></fieldset>`)],

  ['Radio', 'Forms', 150, md(`
Native radios in a fieldset: the chosen one fills with the prism and shows a centre dot.

**Markup** - \`<fieldset class="lue-fieldset"><legend>…</legend><label class="lue-choice"><input class="lue-radio" type="radio" name="…">…</label></fieldset>\`. Arrow keys move between options (native).
`), stage(`<fieldset class="lue-fieldset"><legend>Delivery</legend>
<label class="lue-choice"><input class="lue-radio" type="radio" name="dl" checked><span>Standard, 3–5 days</span></label>
<label class="lue-choice"><input class="lue-radio" type="radio" name="dl"><span>Express, next day</span></label></fieldset>`)],

  ['Switch', 'Forms', 110, md(`
An on/off control: a checkbox with \`role="switch"\`. Off is a chrome bead in a well; on is a pearl (dark) or graphite (light) bead on the prism track - position and bead both carry the state.

**Markup** - \`<label class="lue-choice"><input class="lue-switch" type="checkbox" role="switch"><span>Label</span></label>\`. Use for settings that apply immediately.
`), stage(`<div style="display: grid; gap: 8px"><label class="lue-choice"><input class="lue-switch" type="checkbox" role="switch" checked><span>Leave at door</span></label><label class="lue-choice"><input class="lue-switch" type="checkbox" role="switch"><span>Text me updates</span></label></div>`)],

  ['ErrorSummary', 'Forms', 170, md(`
A list of a form's problems at the top, each linking to its field - shown when submission fails and focused.

**Markup** - \`<div class="lue-error-summary" role="alert" aria-labelledby="t" tabindex="-1"><h2 class="lue-error-summary__title" id="t">…icon… There are 2 problems</h2><ul><li><a href="#field-id">Enter a postcode</a></li></ul></div>\`. \`data-lue-validate\` on the form builds and focuses it; servers can render it too.
`), stage(`<div class="lue-error-summary" role="alert" aria-labelledby="es"><h2 class="lue-error-summary__title" id="es">${icon('warning-circle')}<span>There are 2 problems</span></h2><ul><li><a href="#">Enter a postcode</a></li><li><a href="#">Choose a delivery option</a></li></ul></div>`)],

  ['Dialog', 'Overlays', 260, md(`
A modal \`<dialog>\` in modal glass over the scrim, opened by an invoker button and closed by a \`method="dialog"\` form.

**Markup**
\`\`\`html
<button class="lue-button" commandfor="confirm" command="show-modal">Remove…</button>
<dialog id="confirm" class="lue-dialog" closedby="any" aria-labelledby="confirm-title">
  <h2 class="lue-dialog__title" id="confirm-title">Remove this item?</h2>
  <p class="lue-dialog__body">You can add it again later.</p>
  <form method="dialog" class="lue-dialog__actions"><button class="lue-button" value="cancel">Cancel</button><button class="lue-button" data-variant="danger" value="remove">Remove</button></form>
</dialog>
\`\`\`

- Safari older than 26.2 gets a small conditional invokers polyfill (ADR-0004). Never pass React's \`open\` prop to a modal.
- Glass is checked through the scrim; body text holds 7:1 in the worst case.
`), stage(`<dialog class="lue-dialog" open aria-labelledby="dt" style="position: static"><h2 class="lue-dialog__title" id="dt">Remove this item?</h2><p class="lue-dialog__body">It will be removed from your order. You can add it again later.</p><form method="dialog" class="lue-dialog__actions"><button class="lue-button" value="cancel">Cancel</button><button class="lue-button" data-variant="danger" value="remove">Remove</button></form></dialog>`, 'display: grid; place-items: center')],

  ['Menu', 'Overlays', 230, md(`
An action menu in overlay glass: a popover anchored to its button, with the APG menu keyboard model from \`<lue-menu>\`.

**Markup** - \`<button class="lue-button" popovertarget="m" aria-haspopup="menu">Actions</button><div id="m" popover class="lue-menu" role="menu"><button class="lue-menu__item" role="menuitem">…</button><div class="lue-menu__separator" role="separator"></div>…</div>\`. Destructive items: \`data-tone="critical"\` plus a word.
`), stage(`<div style="display: grid; gap: 8px; justify-items: start"><button type="button" class="lue-button" aria-haspopup="menu" aria-expanded="true">Actions ${icon('caret-down')}</button>
<div class="lue-menu" role="menu" aria-label="Actions"><button type="button" class="lue-menu__item" role="menuitem">${icon('pencil-simple')}<span>Rename</span></button><button type="button" class="lue-menu__item" role="menuitem">${icon('copy')}<span>Duplicate</span></button><div class="lue-menu__separator" role="separator"></div><button type="button" class="lue-menu__item" role="menuitem" data-tone="critical">${icon('trash')}<span>Delete…</span></button></div></div>`)],

  ['Alert', 'Feedback', 230, md(`
A static callout: icon, title and body on a tinted surface. Tone by \`data-tone="info | warning | success | critical"\` - the icon and words carry the meaning, the tint supports it.

**Markup** - \`<aside class="lue-alert" data-tone="warning">{icon}<p class="lue-alert__title">…</p><p class="lue-alert__body">…</p></aside>\`. Injected later? Use \`role="status"\` (or \`role="alert"\` for errors).
`), stage(`<div style="display: grid; gap: 12px"><aside class="lue-alert" data-tone="info">${icon('info')}<p class="lue-alert__title">Delivery times have changed</p><p class="lue-alert__body">Orders placed after 2 pm ship the next business day.</p></aside><aside class="lue-alert" data-tone="warning">${icon('warning')}<p class="lue-alert__title">Only 2 left</p><p class="lue-alert__body">Complete checkout to hold your item.</p></aside><aside class="lue-alert" data-tone="success">${icon('check')}<p class="lue-alert__title">Saved</p><p class="lue-alert__body">Your details will be filled in next time.</p></aside></div>`)],

  ['Toast', 'Feedback', 100, md(`
A brief status message in a pill on the inverse surface, with an optional action and dismiss.

**Markup** - inside \`<lue-toast-region>\` (a \`popover="manual"\` region that queues, pauses on hover and focus, and announces through \`ariaNotify()\` or a live region): \`<div class="lue-toast" role="status">…</div>\`. Never the only way to learn something.
`), stage(`<div class="lue-toast" role="status">${icon('check')}<span>Saved to your list</span><button type="button" class="lue-button">Undo</button><button type="button" class="lue-button" data-icon-only data-size="sm" aria-label="Dismiss">${icon('x')}</button></div>`)],

  ['Tag', 'Feedback', 80, md(`
A short uppercase label in a glass pill: a discipline, a topic, a status word.

**Markup** - \`<span class="lue-tag">Identity</span>\`; a list of tags is a \`<ul class="lue-tags">\`. Removable tags are buttons with a label. Status tags always carry a word.
`), stage(`<ul class="lue-tags"><li><span class="lue-tag">Identity</span></li><li><span class="lue-tag">Product</span></li><li><span class="lue-tag">Accessibility</span></li></ul>`)],

  ['Accordion', 'Disclosure', 170, md(`
Native disclosures; give a group the same \`name\` to make it exclusive.

**Markup** - \`<details class="lue-disclosure" name="faq"><summary>Question {caret icon}</summary><p>Answer</p></details>\`. Dividers are chrome lines that fade out.
`), stage(`<div><details class="lue-disclosure" name="faq" open><summary>When will it arrive? ${icon('caret-down')}</summary><p>Standard delivery takes 3–5 business days.</p></details><details class="lue-disclosure" name="faq"><summary>Can I change my order? ${icon('caret-down')}</summary><p>Yes, until it ships.</p></details></div>`)],

  ['SiteHeader', 'Navigation', 120, md(`
A floating pill of overlay glass that sticks to the top, with the wordmark and the main navigation.

**Markup** - \`<header class="lue-site-header lue-wrap"><div class="lue-site-header__bar"><a class="lue-wordmark" href="/">…</a><nav aria-label="Main"><ul><li><a class="lue-site-header__link" href="…" aria-current="page">Work</a></li>…</ul></nav></div></header>\`, preceded by a skip link. Set \`scroll-padding-top\` so focused targets clear it (WCAG 2.4.11).
`), stage(`<header class="lue-site-header"><div class="lue-site-header__bar"><a class="lue-wordmark" href="#">${tile('triangle')}<span>[Name]</span></a><nav aria-label="Main"><ul><li><a class="lue-site-header__link" href="#" aria-current="page">Work</a></li><li><a class="lue-site-header__link" href="#">About</a></li><li><a class="lue-site-header__link" href="#">Journal</a></li><li><a class="lue-site-header__link" href="#">Contact</a></li></ul></nav></div></header>`)],

  ['Breadcrumb', 'Navigation', 70, md(`
Where a page sits: an ordered list of links with \`aria-current="page"\` on the last.

**Markup** - \`<nav class="lue-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="…">Journal</a></li><li><a href="…" aria-current="page">Craft</a></li></ol></nav>\`.
`), stage(`<nav class="lue-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="#">Journal</a></li><li><a href="#">Craft</a></li><li><a href="#" aria-current="page">Designing with light</a></li></ol></nav>`)],

  ['Pagination', 'Navigation', 90, md(`
Links between pages of a list: newer and older as small buttons, numbers as 44 px targets, the current one pressed glass.

**Markup** - \`<nav class="lue-pagination" aria-label="Pagination"><ul><li><a class="lue-button" data-size="sm" href="…">Newer</a></li><li><a href="…" aria-current="page">1</a></li>…</ul></nav>\`.
`), stage(`<nav class="lue-pagination" aria-label="Pagination"><ul><li><a class="lue-button" data-size="sm" href="#">${icon('arrow-left', ' data-mirror')}<span>Newer</span></a></li><li><a href="#" aria-current="page">1</a></li><li><a href="#">2</a></li><li><a href="#">3</a></li><li><a class="lue-button" data-size="sm" href="#"><span>Older</span>${icon('arrow-right', ' data-mirror')}</a></li></ul></nav>`)],

  ['Steps', 'Navigation', 80, md(`
Progress through a short flow: an ordered list with \`aria-current="step"\`; the current number sits on the prism fill.

**Markup** - \`<ol class="lue-steps" aria-label="Checkout progress"><li><span class="lue-steps__num">1</span>Cart</li><li aria-current="step">…</li></ol>\`.
`), stage(`<ol class="lue-steps" aria-label="Checkout progress"><li><span class="lue-steps__num">1</span>Cart</li><li aria-current="step"><span class="lue-steps__num">2</span>Details</li><li><span class="lue-steps__num">3</span>Payment</li></ol>`)],

  ['TableOfContents', 'Navigation', 230, md(`
An article's sections in a glass panel; the current one gets a prism dot (\`aria-current="true"\`).

**Markup** - \`<nav class="lue-toc" aria-label="On this page"><p class="lue-kicker">On this page</p><ol><li><a href="#colour">…</a></li></ol></nav>\`. Sticky beside the prose on wide screens; stacks above it on narrow ones.
`), stage(`<nav class="lue-toc" aria-label="On this page" style="max-inline-size: 18rem"><p class="lue-kicker">On this page</p><ol><li><a href="#">Colour as light</a></li><li><a href="#" aria-current="true">Contrast that holds</a></li><li><a href="#">A chrome edge</a></li><li><a href="#">Glass that steps aside</a></li></ol></nav>`)],

  ['SiteFooter', 'Navigation', 110, md(`
The wordmark, a footer navigation and a copyright line, under a chrome line that fades at both ends.

**Markup** - \`<footer class="lue-site-footer lue-wrap"><a class="lue-wordmark" href="/">…</a><nav aria-label="Footer"><ul>…</ul></nav><p>© …</p></footer>\`.
`), stage(`<footer class="lue-site-footer"><a class="lue-wordmark" href="#">${tile('triangle')}<span>[Name]</span></a><nav aria-label="Footer"><ul><li><a href="#">Work</a></li><li><a href="#">Journal</a></li><li><a href="#">Contact</a></li><li><a href="#">Accessibility</a></li></ul></nav><p style="color: var(--lue-color-fg-muted); font-size: 0.9375rem">© [Year] [Studio name]</p></footer>`)],

  ['Card', 'Content', 170, md(`
A raised glass surface for grouped content, with a chrome hairline and a prism fringe at its edge.

**Markup** - \`<section class="lue-card" aria-labelledby="…">…</section>\` (or \`<article>\`). For a whole-card link use Project card's stretched-link pattern. Under increased contrast it turns opaque.
`), stage(`<section class="lue-card" aria-labelledby="ct" style="max-inline-size: 24rem; display: grid; gap: 8px"><h3 class="lue-h3" id="ct">Order summary</h3><p style="color: var(--lue-color-fg-muted)">Glass over ambient light. Text holds 7:1 over the worst possible backdrop.</p></section>`)],

  ['Avatar', 'Content', 100, md(`
A person: their photo with alt text, or their initials on liquid metal.

**Markup** - \`<span class="lue-avatar"><img src="…" alt="Sam Taylor"></span>\`, or \`<span class="lue-avatar" aria-hidden="true">ST</span>\` beside the visible name. \`data-size="lg"\` for author cards.
`), stage(`<div class="lue-actions" style="align-items: center"><span class="lue-avatar" aria-hidden="true">ST</span><span class="lue-avatar" data-size="lg" aria-hidden="true">AK</span><span>[Author name]</span></div>`)],

  ['IconTile', 'Content', 140, md(`
A Phosphor icon on a liquid-metal tile: pearl in light, graphite in dark. Decorative - the text beside it carries the meaning.

**Markup** - \`<span class="lue-tile" aria-hidden="true">{icon}</span>\`; \`data-size="lg"\` for heroes and media. Squircle corners where \`corner-shape\` exists.
`), stage(`<div class="lue-actions" style="align-items: center">${tile('stack')}${tile('app-window')}${tile('code')}${tile('person-arms-spread')}${tile('sparkle', 'lg')}</div>`)],

  ['Figure', 'Content', 300, md(`
An image (or media) with a caption.

**Markup** - \`<figure class="lue-figure"><img src="…" alt="What it shows"><figcaption>…</figcaption></figure>\`. Decorative art uses empty \`alt\`; the caption still helps. Media frames are \`.lue-media\` (rounded, inner hairline).
`), stage(`<figure class="lue-figure">${media('prism', 0, '16 / 7')}<figcaption>Light pools where glass meets the surface.</figcaption></figure>`)],

  ['CodeBlock', 'Content', 210, md(`
Code in a glass panel with a mono caption naming the language.

**Markup** - \`<figure class="lue-code"><figcaption><span>CSS</span><span>Title</span></figcaption><pre tabindex="0"><code>…</code></pre></figure>\`. \`tabindex="0"\` lets keyboard users scroll a wide block (WCAG 2.1.1). Highlight with \`<span class="lue-code__token" data-kind="property | comment">\`.
`), stage(`<figure class="lue-code"><figcaption><span>CSS</span><span>Glass button</span></figcaption><pre tabindex="0"><code><span class="lue-code__token" data-kind="comment">/* A pane of glass that keeps its label legible */</span>
.button {
  <span class="lue-code__token" data-kind="property">background-color</span>: var(--glass);
  <span class="lue-code__token" data-kind="property">backdrop-filter</span>: blur(10px) saturate(1.8);
}</code></pre></figure>`)],

  ['Quote', 'Content', 250, md(`
A testimonial or citation: a large light quotation in the display face, with a chrome quotation mark and an attributed caption.

**Markup** - \`<figure class="lue-quote"><span class="lue-quote__mark lue-chrome-text" aria-hidden="true">“</span><blockquote><p>…</p></blockquote><figcaption>{avatar} Name, role</figcaption></figure>\`. Use real quotes only; placeholders until then.
`), stage(`<figure class="lue-quote"><span class="lue-quote__mark lue-chrome-text" aria-hidden="true">“</span><blockquote><p>[A sentence or two from a client about what working together was like.]</p></blockquote><figcaption><span class="lue-avatar" aria-hidden="true">[A]</span><span style="display: grid"><b>[Name]</b><span style="color: var(--lue-color-fg-muted)">[Role], [Company]</span></span></figcaption></figure>`)],

  ['PullQuote', 'Content', 150, md(`
A line lifted from an article, set large between two fading chrome lines.

**Markup** - \`<aside class="lue-pull" aria-hidden="true">…</aside>\`: hidden from assistive technology because the same words are already read in the body.
`), stage(`<aside class="lue-pull" aria-hidden="true">Contrast stays fixed. Only the colour moves.</aside>`)],

  ['Timeline', 'Content', 260, md(`
Experience or history as an ordered list, each entry a \`<time>\` and a short description.

**Markup** - \`<ol class="lue-timeline"><li><time datetime="2024">2024 - now</time><div class="lue-timeline__entry"><p>Role</p><p>Company · what you did</p></div></li></ol>\`.
`), stage(`<ol class="lue-timeline"><li><time class="lue-kicker">[Year] - now</time><div class="lue-timeline__entry"><p style="font-weight: 600">[Role]</p><p style="color: var(--lue-color-fg-muted)">[Studio or company] · [What you did there, in a line.]</p></div></li><li><time class="lue-kicker">[Year] - [Year]</time><div class="lue-timeline__entry"><p style="font-weight: 600">[Role]</p><p style="color: var(--lue-color-fg-muted)">[Company] · [A line on the work and its outcome.]</p></div></li></ol>`)],

  ['AuthorCard', 'Content', 140, md(`
Who wrote this: avatar, name, a line of bio and a link, in a glass panel.

**Markup** - \`<aside class="lue-author" aria-label="About the author">{avatar}<div class="lue-author__text"><p>Name</p><p>Bio</p></div><a class="lue-button" data-size="sm" href="…">More posts</a></aside>\`.
`), stage(`<aside class="lue-author" aria-label="About the author"><span class="lue-avatar" data-size="lg" aria-hidden="true">[A]</span><div class="lue-author__text"><p style="font-weight: 600">[Author name]</p><p style="color: var(--lue-color-fg-muted)">[One or two lines about the author and what they work on.]</p></div><a class="lue-button" data-size="sm" href="#">More posts</a></aside>`)],

  ['Hero', 'Blocks', 520, md(`
The opening statement of a page: kicker, a large light headline, a lede and up to two actions, over satin folds with a glass prism.

**Markup** - \`<section class="lue-hero" aria-labelledby="h">{satin svg}<div class="lue-wrap lue-hero__grid"><div class="lue-hero__text"><p class="lue-kicker">…</p><h1 class="lue-display" id="h">…</h1><p class="lue-lede">…</p><div class="lue-actions">…</div></div><div class="lue-hero__object">{prism svg}</div></div></section>\`. \`data-layout="center"\` for a single message without the object.

- Hero text is checked against every satin fold (body 7:1, muted and accent 4.5:1). Under increased contrast the satin switches off.
- Size the hero to its content; never \`100vh\`.
`), `<section class="lue-hero" aria-labelledby="hh">${satin(0)}<div class="lue-hero__grid" style="padding-inline: 48px"><div class="lue-hero__text"><p class="lue-kicker">Design and engineering studio</p><h1 class="lue-display" id="hh">Interfaces that hold their light.</h1><p class="lue-lede">[Studio name] designs and builds accessible, platform-native products - calm to use, alive to touch.</p><div class="lue-actions"><a class="lue-button" data-variant="primary" data-size="lg" href="#">View selected work</a><a class="lue-button" data-size="lg" href="#">Read the journal</a></div></div><div class="lue-hero__object">${prism()}</div></div></section>`],

  ['HeroSplit', 'Blocks', 460, md(`
A case-study opener: text on one side, a figure on the other; stacks on narrow screens.

**Markup** - \`<section class="lue-section"><div class="lue-split"><div class="lue-hero__text">…</div><figure class="lue-figure">…</figure></div></section>\`.
`), stage(`<div class="lue-split"><div class="lue-hero__text"><p class="lue-kicker">Case study · [Client]</p><h2 class="lue-title">A design system that catches the light</h2><p class="lue-lede">[Two sentences on the brief, the constraint that made it interesting, and what shipped.]</p><div class="lue-actions"><a class="lue-button" data-variant="primary" href="#">Read the case study</a><a class="lue-button" data-variant="quiet" href="#">All work ${icon('arrow-right', ' data-mirror')}</a></div></div><figure class="lue-figure">${media('orb', 1, '5 / 4')}<figcaption>[Caption: what the image shows.]</figcaption></figure></div>`)],

  ['ArticleHeader', 'Blocks', 330, md(`
The top of a journal article: breadcrumb, kicker with reading time, title, dek and byline.

**Markup** - \`<header class="lue-article-header lue-wrap"><nav class="lue-breadcrumb">…</nav><p class="lue-kicker">Craft · 5 min read</p><h1 class="lue-title">…</h1><p class="lue-dek">…</p><div class="lue-byline">{avatar}<p>Name</p><time datetime="2026-10-05">5 October 2026</time></div></header>\`.
`), stage(`<header class="lue-article-header" style="padding-block: 16px"><nav class="lue-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="#">Journal</a></li><li><a href="#" aria-current="page">Craft</a></li></ol></nav><p class="lue-kicker">Craft · 5 min read</p><h1 class="lue-title">Designing with light</h1><p class="lue-dek">How contrast stays fixed while colour moves through glass, chrome and a prism of subdued neon.</p><div class="lue-byline"><span class="lue-avatar" aria-hidden="true">[A]</span><p><b>[Author name]</b></p><p style="color: var(--lue-color-fg-muted)"><time datetime="2026-10-05">5 October 2026</time></p></div></header>`)],

  ['FeatureGrid', 'Blocks', 300, md(`
What you offer, as a grid of metal icon tiles with a heading and a sentence each; reflows by \`auto-fit\`.

**Markup** - \`<ul class="lue-grid" style="--lue-grid-min: 15rem"><li class="lue-feature">{tile}<h3 class="lue-h3">…</h3><p>…</p></li></ul>\`. Tiles are decorative; the heading names the feature.
`), stage(`<ul class="lue-grid" style="--lue-grid-min: 13rem; list-style: none; margin: 0; padding: 0">${[['stack', 'Design systems', 'Tokens, components and guidance your team can build on - accessible by default.'], ['app-window', 'Interface design', 'Product screens that are calm to use and quick to understand.'], ['code', 'Front-end engineering', 'Standards-based HTML and CSS first, with just enough JavaScript.'], ['person-arms-spread', 'Accessibility', 'Audits and fixes against WCAG 2.2, tested with the assistive technology people use.']].map(([g, t, d]) => `<li class="lue-feature">${tile(g)}<h3 class="lue-h3">${t}</h3><p>${d}</p></li>`).join('')}</ul>`)],

  ['ProjectCard', 'Blocks', 470, md(`
A piece of work: media, client and year, a title that links (stretched over the card), a line of description and discipline tags.

**Markup** - \`<article class="lue-project">{media}<div class="lue-project__body"><p class="lue-meta">…</p><h3 class="lue-h3"><a href="…">Title</a></h3><p class="lue-excerpt">…</p><ul class="lue-tags" aria-label="Disciplines">…</ul></div></article>\`. One link per card; the whole card shows focus.
`), stage(`<div class="lue-grid" style="--lue-grid-min: 18rem">${[['A design system for [client]', ['Systems', 'Engineering'], 'prism', 0], ['An editorial platform for [client]', ['Product', 'Content'], 'orb', 1]].map(([t, k, o, v]) => `<article class="lue-project">${media(o, v)}<div class="lue-project__body"><p class="lue-meta"><span class="lue-kicker">[Client]</span><span class="lue-kicker">[Year]</span></p><h3 class="lue-h3"><a href="#">${t}</a></h3><p class="lue-excerpt">[One line on the problem, and what changed.]</p><ul class="lue-tags" aria-label="Disciplines">${k.map((x) => `<li><span class="lue-tag">${x}</span></li>`).join('')}</ul></div></article>`).join('')}</div>`)],

  ['PostItem', 'Blocks', 420, md(`
A journal post in a list: kicker and date, a linked title and an excerpt - as a row between chrome lines, or a glass card with media (\`data-variant="card"\`).

**Markup** - \`<article class="lue-post"><p class="lue-meta"><span class="lue-kicker">Craft</span><time class="lue-kicker" datetime="…">…</time></p><h3 class="lue-h3"><a href="…">Title</a></h3><p class="lue-excerpt">…</p></article>\`.
`), stage(`<div class="lue-grid" style="--lue-grid-min: 18rem; align-items: start"><article class="lue-post" data-variant="card">${media('prism', 0, '16 / 10')}<p class="lue-meta"><span class="lue-kicker">Craft</span><time class="lue-kicker" datetime="2026-10-05">[Date]</time></p><h3 class="lue-h3"><a href="#">Designing with light</a></h3><p class="lue-excerpt">How contrast stays fixed while colour moves through glass, chrome and a prism.</p></article><div>${['Glass that steps aside', 'A chrome edge that is a real boundary'].map((t) => `<article class="lue-post"><p class="lue-meta"><span class="lue-kicker">Craft</span><time class="lue-kicker" datetime="2026-10-05">[Date]</time></p><h3 class="lue-h3"><a href="#">${t}</a></h3><p class="lue-excerpt">[A sentence that says what the post is about.]</p></article>`).join('')}</div></div>`)],

  ['MediaText', 'Blocks', 360, md(`
A figure beside a short passage and a link; stacks on narrow screens.

**Markup** - \`<section class="lue-split">{media}<div>…<h2 class="lue-h2">…</h2><p class="lue-excerpt">…</p><a class="lue-button" href="…">…</a></div></section>\`.
`), stage(`<div class="lue-split">${media('prism', 1)}<div style="display: grid; gap: 16px; justify-items: start"><p class="lue-kicker">Approach</p><h2 class="lue-h2">Colour as light, not paint</h2><p class="lue-excerpt">Surfaces stay neutral - pearl by day, obsidian by night. Colour arrives the way it does through glass: gathered at an edge, pooled where light lands.</p><a class="lue-button" href="#">How we work ${icon('arrow-right', ' data-mirror')}</a></div></div>`)],

  ['NewsletterBand', 'Blocks', 280, md(`
A call to action in a glass band: heading, a sentence and a one-field form.

**Markup** - \`<section class="lue-cta"><h2 class="lue-h2">…</h2><p class="lue-lede">…</p><form><div class="lue-field"><label class="lue-field__label" for="e">Email address</label><input class="lue-input" id="e" type="email" autocomplete="email"></div><button class="lue-button" data-variant="primary">Subscribe</button></form></section>\`. Validate like any field; say what people will get and how to leave.
`), stage(`<section class="lue-cta"><p class="lue-kicker">Journal</p><h2 class="lue-h2">Notes on light, glass and the web</h2><p class="lue-lede">One letter when there's something worth reading. Unsubscribe in one click.</p><form><div class="lue-field"><label class="lue-field__label" for="nl">Email address</label><input class="lue-input" id="nl" type="email" autocomplete="email"></div><button type="submit" class="lue-button" data-variant="primary">Subscribe</button></form></section>`)],

  ['TagFilter', 'Blocks', 90, md(`
Filter a list with a group of toggle buttons; without JavaScript, use links to filtered URLs instead.

**Markup** - \`<div class="lue-actions" role="group" aria-label="Filter projects"><button class="lue-button" data-size="sm" aria-pressed="true">All</button>…</div>\`.
`), stage(`<div class="lue-actions" role="group" aria-label="Filter projects">${['All', 'Identity', 'Product', 'Systems'].map((l, i) => `<button type="button" class="lue-button" data-size="sm" aria-pressed="${i === 0}">${l}</button>`).join('')}</div>
<script>var g = document.querySelectorAll('[role=group] [aria-pressed]'); g.forEach(function (b) { b.addEventListener('click', function () { g.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); }); });</script>`)],

  ['Glass', 'Materials', 300, md(`
Two tiers of frosted glass: overlay (menus, popovers, cards, bars) and modal (dialogs, over the scrim).

**Markup** - \`.lue-glass\` on any surface; \`data-tier="modal"\` for the dialog tier. Components already use it.

- Each tier is checked over white, black and every fill, reading the backdrop filter both ways engines apply it: body text 7:1, muted and accent 4.5:1, chrome 3:1.
- Glass turns opaque under \`prefers-reduced-transparency\`, \`prefers-contrast: more\`, the -more themes, or without \`backdrop-filter\`.
- Don't nest glass: a glass parent is a backdrop root.
`), stage(`<div aria-hidden="true" style="position: absolute; inset-block-start: 40px; inset-inline-start: 120px; inline-size: 120px; block-size: 150px; border-radius: 18px; background: #fff"></div><div aria-hidden="true" style="position: absolute; inset-block-start: 120px; inset-inline-start: 230px; inline-size: 130px; block-size: 140px; border-radius: 18px; background: #000"></div>
<div style="display: grid; gap: 20px; position: relative"><div class="lue-glass" style="padding: 20px 22px; max-inline-size: 300px; display: grid; gap: 6px"><p style="font-weight: 600">Overlay glass</p><p style="font-size: 0.9375rem">Menus, popovers, cards and bars.</p></div><div class="lue-glass" data-tier="modal" style="padding: 20px 22px; max-inline-size: 300px; justify-self: end; display: grid; gap: 6px"><p style="font-weight: 600">Modal glass</p><p style="font-size: 0.9375rem">Dialogs, over the scrim.</p></div></div>`)],

  ['Chrome', 'Materials', 160, md(`
The 1 px chrome hairline: steel stops with a short band of dispersed light at its lower edge. Its reflection turns on hover and focus; selected states trade it for the multi-tone ring.

**Markup** - every Lue UI control and surface draws it; add \`.lue-chrome\` to give any element the ring. Every stop is a 3:1 boundary on canvas, surfaces and glass; under increased contrast it becomes one solid line.
`), stage(`<div class="lue-actions" style="align-items: center"><span class="lue-chrome" aria-hidden="true" style="display: inline-block; inline-size: 120px; block-size: 48px; --lue-angle: 0deg"></span><span class="lue-chrome" aria-hidden="true" style="display: inline-block; inline-size: 120px; block-size: 48px; --lue-angle: 120deg"></span><span class="lue-chrome" aria-hidden="true" style="display: inline-block; inline-size: 120px; block-size: 48px; --lue-angle: 240deg"></span><button type="button" class="lue-button" aria-pressed="true">${icon('check')}<span>Selected</span></button></div>`)],

  ['Satin', 'Materials', 220, md(`
Folds of satin light behind heroes: pearl, champagne and lilac-grey in light; graphite folds in dark. Decorative.

**Markup** - the SVG in this preview, \`class="lue-satin"\`, \`aria-hidden="true"\`, as the first child of a \`.lue-hero\` (or any \`.lue-stage\`). Its colours are the \`material-satin-*\` tokens; hero text is checked against every fold.
`), `<div class="lue-stage" style="block-size: 220px">${satin(1)}</div>`],

  ['AmbientLight', 'Materials', 220, md(`
Diffuse prism light behind content: a warm field, a cool field and a soft refracted band. Never a wash - text over it is checked, even where two glows overlap.

**Markup** - \`<div class="lue-stage">…<div class="lue-ambient" aria-hidden="true"></div>…</div>\`. Off under increased contrast and in forced colours.
`), stage(`<p class="lue-lede" style="position: relative">Text over ambient light keeps 7:1 for body copy.</p>`, 'block-size: 220px')],

  ['PrismObject', 'Materials', 320, md(`
The glass prism and glass orb used as hero objects: chrome-edged glass with dispersed light pooling at the lower edge. Decorative only.

**Markup** - inline SVG with \`class="lue-prism"\`, \`aria-hidden="true"\`, inside \`.lue-hero__object\` or a \`.lue-media\` frame. Colours come from the chrome, dispersion and prism-glass tokens, so both follow the theme.
`), stage(`<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; align-items: center">${prism()}${orb()}</div>`)],
];

// One preview document per component (line 1 is the marker the page reads).
export const previewDoc = ([name, group, height, , body]) => `<!-- @dsCard group="${group}" height=${height} -->
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>${name} - preview</title></head>
<body>
${body}
</body>
</html>
`;
