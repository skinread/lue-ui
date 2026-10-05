// C2 · Chroma Luminous — materials (satin folds, glass prism, glass orb, metal icon tiles) and the portfolio and
// editorial boards built from them: a block library, a portfolio home page and a journal article.
// Imported by build-canvas.mjs and luminous-canvas.mjs. All colours come from custom properties, so every piece follows
// the board's scheme.

let uid = 0;
const nid = (p) => `${p}${++uid}`;
const stop = (offset, v, opacity) => `<stop offset="${offset}" style="stop-color: var(${v})${opacity == null ? '' : `; stop-opacity: ${opacity}`}"></stop>`;

// ---------------------------------------------------------------- materials
// Satin folds: three soft ribbons and two highlight ridges, blurred. Decorative only.
export function satin(variant = 0) {
  const id = nid('sat');
  const shapes = [
    ['M-80 520 C 260 300, 560 640, 900 420 S 1360 160, 1520 240 L 1520 760 L -80 760 Z', 'M-80 300 C 300 120, 620 420, 980 260 S 1380 40, 1520 90 L 1520 -40 L -80 -40 Z', 'M-80 650 C 380 520, 700 760, 1100 600 S 1400 480, 1520 520 L 1520 760 L -80 760 Z'],
    ['M-80 420 C 220 560, 640 260, 960 380 S 1320 600, 1520 470 L 1520 760 L -80 760 Z', 'M-80 180 C 360 320, 720 60, 1080 200 S 1400 260, 1520 160 L 1520 -40 L -80 -40 Z', 'M-80 600 C 300 700, 820 520, 1120 640 S 1420 700, 1520 640 L 1520 760 L -80 760 Z'],
  ][variant % 2];
  return `<svg class="lx-satin" viewBox="0 0 1440 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="0.6">${stop(0, '--satin-0')}${stop(0.42, '--satin-1')}${stop(0.7, '--satin-3')}${stop(1, '--satin-0')}</linearGradient>
    <linearGradient id="${id}b" x1="0" y1="1" x2="1" y2="0">${stop(0, '--satin-2')}${stop(0.5, '--satin-0')}${stop(1, '--satin-4')}</linearGradient>
    <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="0">${stop(0, '--satin-3')}${stop(0.5, '--satin-2')}${stop(1, '--satin-1')}</linearGradient>
    <filter id="${id}f" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="16"></feGaussianBlur></filter>
    <filter id="${id}g" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"></feGaussianBlur></filter>
  </defs>
  <rect width="1440" height="720" style="fill: var(--satin-0)"></rect>
  <g filter="url(#${id}f)"><path d="${shapes[0]}" fill="url(#${id}a)"></path><path d="${shapes[1]}" fill="url(#${id}b)"></path><path d="${shapes[2]}" fill="url(#${id}c)"></path></g>
  <g filter="url(#${id}g)" fill="none" stroke-width="3" style="stroke: var(--satin-5); opacity: 0.7"><path d="${shapes[0].split(' L ')[0]}"></path><path d="${shapes[2].split(' L ')[0]}"></path></g>
</svg>`;
}

// A rounded glass prism with a chrome edge; dispersed light pools along its lower edge. Decorative only.
export function prism() {
  const id = nid('pr');
  const tri = 'M180 74.6 Q 200 40 220 74.6 L 330 265.4 Q 350 300 310 300 L 90 300 Q 50 300 70 265.4 Z';
  const inner = 'M182.8 94 Q 200 64.3 217.2 94 L 311.8 258.1 Q 329 287.9 294.6 287.9 L 105.4 287.9 Q 71 287.9 88.2 258.1 Z';
  return `<svg class="lx-prism" viewBox="0 0 400 360" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1">${stop(0, '--prism-glass-top')}${stop(1, '--prism-glass-bottom')}</linearGradient>
    <linearGradient id="${id}c" gradientUnits="userSpaceOnUse" x1="60" y1="40" x2="340" y2="300">${stop(0, '--c0')}${stop(0.3, '--c3')}${stop(0.42, '--c1')}${stop(0.6, '--c0')}${stop(0.8, '--c2')}${stop(1, '--c4')}</linearGradient>
    <linearGradient id="${id}d" gradientUnits="userSpaceOnUse" x1="60" y1="0" x2="340" y2="0">${stop(0, '--disp-1')}${stop(0.25, '--disp-2')}${stop(0.5, '--disp-3')}${stop(0.75, '--disp-4')}${stop(1, '--disp-5')}</linearGradient>
    <linearGradient id="${id}f" gradientUnits="userSpaceOnUse" x1="0" y1="150" x2="0" y2="310"><stop offset="0" stop-color="#000"></stop><stop offset="1" stop-color="#fff"></stop></linearGradient>
    <linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.8"></stop><stop offset="0.7" stop-color="#fff" stop-opacity="0"></stop></linearGradient>
    <mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="360"><rect width="400" height="360" fill="url(#${id}f)"></rect></mask>
    <filter id="${id}s" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"></feGaussianBlur></filter>
    <filter id="${id}b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"></feGaussianBlur></filter>
  </defs>
  <ellipse cx="200" cy="334" rx="150" ry="14" filter="url(#${id}s)" style="fill: var(--prism-shadow)"></ellipse>
  <path d="${tri}" fill="url(#${id}g)"></path>
  <path d="${tri}" fill="none" stroke="url(#${id}d)" stroke-width="26" stroke-linejoin="round" mask="url(#${id}m)" filter="url(#${id}b)" opacity="0.65"></path>
  <path d="${tri}" fill="none" stroke="url(#${id}c)" stroke-width="12" stroke-linejoin="round"></path>
  <path d="${tri}" fill="none" stroke="url(#${id}d)" stroke-width="12" stroke-linejoin="round" mask="url(#${id}m)"></path>
  <path d="${inner}" fill="none" stroke="url(#${id}h)" stroke-width="2"></path>
</svg>`;
}

// A glass orb in a chrome rim, light pooling at its base. Decorative only.
export function orb() {
  const id = nid('orb');
  return `<svg class="lx-prism" viewBox="0 0 400 360" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="${id}g" cx="0.38" cy="0.32" r="0.75">${stop(0, '--prism-glass-top')}${stop(1, '--prism-glass-bottom')}</radialGradient>
    <linearGradient id="${id}c" gradientUnits="userSpaceOnUse" x1="80" y1="40" x2="320" y2="300">${stop(0, '--c0')}${stop(0.35, '--c3')}${stop(0.5, '--c1')}${stop(0.7, '--c0')}${stop(1, '--c4')}</linearGradient>
    <linearGradient id="${id}d" gradientUnits="userSpaceOnUse" x1="90" y1="0" x2="310" y2="0">${stop(0, '--disp-1')}${stop(0.25, '--disp-2')}${stop(0.5, '--disp-3')}${stop(0.75, '--disp-4')}${stop(1, '--disp-5')}</linearGradient>
    <linearGradient id="${id}f" gradientUnits="userSpaceOnUse" x1="0" y1="170" x2="0" y2="300"><stop offset="0" stop-color="#000"></stop><stop offset="1" stop-color="#fff"></stop></linearGradient>
    <mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="360"><rect width="400" height="360" fill="url(#${id}f)"></rect></mask>
    <filter id="${id}s" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"></feGaussianBlur></filter>
    <filter id="${id}b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8"></feGaussianBlur></filter>
  </defs>
  <ellipse cx="200" cy="330" rx="120" ry="12" filter="url(#${id}s)" style="fill: var(--prism-shadow)"></ellipse>
  <circle cx="200" cy="172" r="118" fill="url(#${id}g)"></circle>
  <circle cx="200" cy="172" r="118" fill="none" stroke="url(#${id}d)" stroke-width="24" mask="url(#${id}m)" filter="url(#${id}b)" opacity="0.6"></circle>
  <circle cx="200" cy="172" r="118" fill="none" stroke="url(#${id}c)" stroke-width="10"></circle>
  <circle cx="200" cy="172" r="118" fill="none" stroke="url(#${id}d)" stroke-width="10" mask="url(#${id}m)"></circle>
  <ellipse cx="160" cy="118" rx="46" ry="26" fill="#fff" opacity="0.28" filter="url(#${id}b)"></ellipse>
</svg>`;
}

const GLYPH = {
  layers: '<path d="M12 3.5l8.5 4.5-8.5 4.5-8.5-4.5z"></path><path d="M3.5 12.5l8.5 4.5 8.5-4.5"></path><path d="M3.5 16.5l8.5 4.5 8.5-4.5"></path>',
  window: '<rect x="3" y="4.5" width="18" height="15" rx="3.5"></rect><path d="M3 9.5h18"></path><path d="M9.5 14.5l2 2 3.5-3.5"></path>',
  code: '<path d="M8.5 7.5L4 12l4.5 4.5"></path><path d="M15.5 7.5L20 12l-4.5 4.5"></path><path d="M13.5 5l-3 14"></path>',
  access: '<circle cx="12" cy="4.6" r="1.6"></circle><path d="M5 8.6l7 1.6 7-1.6"></path><path d="M12 10.2v4.3l-3.2 5.5"></path><path d="M12 14.5l3.2 5.5"></path>',
  prism: '<path d="M12 4l8 14H4z"></path><path d="M9.5 18L12 13.5 14.5 18"></path>',
  pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"></path><path d="M14 7l3 3"></path>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="3"></rect><path d="M4 7.5l8 6 8-6"></path>',
  spark: '<path d="M12 3v5M12 16v5M3 12h5M16 12h5"></path><path d="M12 9l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"></path>',
};

// A liquid-metal icon tile: chrome-gradient strokes, dispersed light along their lower half. Decorative only.
export function tile(name, size = 'md') {
  const id = nid('ti');
  return `<span class="lx-tile"${size === 'md' ? '' : ` data-size="${size}"`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
    <defs>
      <linearGradient id="${id}c" gradientUnits="userSpaceOnUse" x1="0" y1="2" x2="0" y2="22">${stop(0, '--c0')}${stop(0.45, '--c3')}${stop(0.6, '--c1')}${stop(1, '--c4')}</linearGradient>
      <linearGradient id="${id}d" gradientUnits="userSpaceOnUse" x1="3" y1="0" x2="21" y2="0">${stop(0, '--disp-1')}${stop(0.25, '--disp-2')}${stop(0.5, '--disp-3')}${stop(0.75, '--disp-4')}${stop(1, '--disp-5')}</linearGradient>
      <linearGradient id="${id}f" gradientUnits="userSpaceOnUse" x1="0" y1="11" x2="0" y2="21"><stop offset="0" stop-color="#000"></stop><stop offset="1" stop-color="#fff"></stop></linearGradient>
      <mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="url(#${id}f)"></rect></mask>
    </defs>
    <g stroke="url(#${id}c)">${GLYPH[name]}</g><g stroke="url(#${id}d)" mask="url(#${id}m)">${GLYPH[name]}</g>
  </svg></span>`;
}

// Media placeholder for cards and figures: satin with an object. Decorative; the card's text carries the meaning.
const OBJECTS = { prism, orb, tile: () => tile('spark', 'lg'), none: () => '' };
export const media = (object = 'prism', variant = 0, extra = '') => `<div class="lx-media"${extra}>${satin(variant)}${OBJECTS[object]()}</div>`;

// ---------------------------------------------------------------- blocks
export function lxBlocks({ icon }) {
  const arrow = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" data-mirror="true"><path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path></svg>`;
  const nav = (current) => `
  <a class="ns-button lx-skip" href="#main">Skip to content</a>
  <header class="lx-nav lx-wrap"><div class="lx-nav__bar lx-glass">
    <a class="lx-wordmark" href="#">${tile('prism')}<span>[Name]</span></a>
    <nav aria-label="Main"><ul>${['Work', 'About', 'Journal', 'Contact'].map((l) => `<li><a class="lx-navlink" href="#"${l === current ? ' aria-current="page"' : ''}>${l}</a></li>`).join('')}</ul></nav>
  </div></header>`;

  const heroStatement = (hid, { center = false, object = 'prism', variant = 0, under = false } = {}) => `
  <section class="lx-hero"${center ? ' data-layout="center"' : ''} aria-labelledby="${hid}"${under ? ' style="margin-block-start: -76px; padding-block-start: calc(clamp(72px, 10vw, 148px) + 76px)"' : ''}>
    ${satin(variant)}
    <div class="lx-wrap lx-hero__grid">
      <div class="lx-hero__text">
        <p class="t-micro">Design and engineering studio</p>
        <h1 class="lx-display" id="${hid}">Interfaces that hold their light.</h1>
        <p class="lx-lede">[Studio name] designs and builds accessible, platform-native products — calm to use, alive to touch.</p>
        <div class="lx-actions"><a class="ns-button" data-variant="primary" data-size="lg" href="#work">View selected work</a><a class="ns-button" data-size="lg" href="#journal">Read the journal</a></div>
      </div>
      ${center ? '' : `<div class="lx-hero__object">${OBJECTS[object]()}</div>`}
    </div>
  </section>`;

  const heroSplit = (hid) => `
  <section class="lx-section lx-wrap" aria-labelledby="${hid}">
    <div class="lx-split">
      <div class="lx-hero__text">
        <p class="t-micro">Case study · [Client]</p>
        <h2 class="lx-display" id="${hid}" style="font-size: clamp(2.6rem, 1.5rem + 3.4vw, 4.75rem)">A design system that catches the light</h2>
        <p class="lx-lede">[Two sentences on the brief, the constraint that made it interesting, and what shipped.]</p>
        <div class="lx-actions"><a class="ns-button" data-variant="primary" href="#">Read the case study</a><a class="ns-button" data-variant="quiet" href="#">All work ${arrow}</a></div>
      </div>
      <figure class="lx-figure">${media('orb', 1, ' style="aspect-ratio: 5 / 4"')}<figcaption>[Caption: what the image shows.]</figcaption></figure>
    </div>
  </section>`;

  const project = (title, kind, object, variant) => `
      <article class="lx-project lx-glass">
        ${media(object, variant)}
        <div class="lx-project__body">
          <p class="lx-meta"><span class="t-micro">[Client]</span><span class="t-micro">[Year]</span></p>
          <h3 class="lx-h3"><a href="#">${title}</a></h3>
          <p class="lx-excerpt">[One line on the problem, and what changed.]</p>
          <ul class="lx-tags" aria-label="Disciplines">${kind.map((k) => `<li><span class="ns-tag">${k}</span></li>`).join('')}</ul>
        </div>
      </article>`;
  const projects = (n = 4) => [
    ['A design system for [client]', ['Systems', 'Engineering'], 'prism', 0],
    ['An editorial platform for [client]', ['Product', 'Content'], 'orb', 1],
    ['A brand in light for [client]', ['Identity'], 'tile', 1],
    ['Accessible checkout for [client]', ['Product', 'Accessibility'], 'none', 0],
  ].slice(0, n).map((p) => project(...p)).join('');

  const filter = (gid) => `<div class="lx-actions" role="group" aria-label="Filter projects">${['All', 'Identity', 'Product', 'Systems'].map((l, i) => `<button type="button" class="ns-button" data-size="sm" aria-pressed="${i === 0}">${l}</button>`).join('')}</div>`;

  const features = () => `
    <ul class="lx-grid" style="--min: 240px; list-style: none; margin: 0; padding: 0">
      ${[
        ['layers', 'Design systems', 'Tokens, components and guidance your team can build on — accessible by default.'],
        ['window', 'Interface design', 'Product screens that are calm to use and quick to understand, in light and dark.'],
        ['code', 'Front-end engineering', 'Standards-based HTML and CSS first, with just enough JavaScript to make it sing.'],
        ['access', 'Accessibility', 'Audits and fixes against WCAG 2.2, tested with the assistive technology people use.'],
      ].map(([g, t, d]) => `<li class="lx-feature">${tile(g)}<h3 class="lx-h3">${t}</h3><p>${d}</p></li>`).join('')}
    </ul>`;

  const POSTS = [
    ['Designing with light', 'How contrast stays fixed while colour moves through glass, chrome and a prism of subdued neon.', 'prism', 0],
    ['Glass that steps aside', 'Translucency checked against its worst backdrop, and what happens when someone asks for less of it.', 'orb', 1],
    ['A chrome edge that is a real boundary', 'Reflection you can see, and a 3:1 boundary you can rely on.', 'tile', 0],
  ];
  const postCard = ([t, x, o, v]) => `
      <article class="lx-post lx-glass" data-variant="card">
        ${media(o, v, ' style="aspect-ratio: 16 / 10"')}
        <p class="lx-meta"><span class="t-micro">Craft</span><time class="t-micro" datetime="2026-10-05">[Date]</time></p>
        <h3 class="lx-h3"><a href="#">${t}</a></h3>
        <p class="lx-excerpt">${x}</p>
      </article>`;
  const postRow = ([t, x]) => `
      <article class="lx-post">
        <p class="lx-meta"><span class="t-micro">Craft</span><time class="t-micro" datetime="2026-10-05">[Date]</time></p>
        <h3 class="lx-h3"><a href="#">${t}</a></h3>
        <p class="lx-excerpt">${x}</p>
      </article>`;

  const quote = () => `
    <figure class="lx-quote">
      <span class="lx-quote__mark lx-chrome-text" aria-hidden="true">“</span>
      <blockquote><p style="margin: 0">[A sentence or two from a client about what working together was like.]</p></blockquote>
      <figcaption><span class="lx-avatar" aria-hidden="true">[A]</span><span style="display: grid"><b>[Name]</b><span class="t-small t-muted">[Role], [Company]</span></span></figcaption>
    </figure>`;

  const split = () => `
    <div class="lx-split">
      ${media('prism', 1, ' style="aspect-ratio: 4 / 3"')}
      <div style="display: grid; gap: 18px; justify-items: start">
        <p class="t-micro">Approach</p>
        <h2 class="lx-h2">Colour as light, not paint</h2>
        <p class="lx-excerpt" style="font-size: 1.125rem">Surfaces stay neutral — pearl by day, obsidian by night. Colour arrives the way it does through glass: gathered at an edge, pooled where light lands, never spread evenly across everything.</p>
        <a class="ns-button" href="#">How we work ${arrow}</a>
      </div>
    </div>`;

  const timeline = () => `
    <ol class="lx-timeline">
      ${[['[Year] — now', '[Role]', '[Studio or company] · [What you did there, in a line.]'], ['[Year] — [Year]', '[Role]', '[Company] · [A line on the work and its outcome.]'], ['[Year] — [Year]', '[Role]', '[Company] · [A line on the work and its outcome.]']]
        .map(([y, r, d]) => `<li><time class="t-micro">${y}</time><div><p class="t-label">${r}</p><p class="t-small t-muted">${d}</p></div></li>`).join('')}
    </ol>`;

  const cta = (fid) => `
    <div class="lx-cta lx-glass">
      <p class="t-micro">Contact</p>
      <h2 class="lx-h2" style="max-inline-size: 18ch">Have something that should shine?</h2>
      <p class="lx-lede">Tell us what you're making. We reply within [response time].</p>
      <form>
        <div class="ns-field"><label class="ns-field__label" for="${fid}">Email address</label><input class="ns-input" id="${fid}" type="email" autocomplete="email" /></div>
        <button type="submit" class="ns-button" data-variant="primary">Start a conversation</button>
      </form>
    </div>`;

  const newsletter = (fid) => `
    <div class="lx-cta lx-glass" style="justify-items: stretch">
      <div class="lx-split" style="align-items: end">
        <div style="display: grid; gap: 12px"><p class="t-micro">Journal</p><h2 class="lx-h2">Notes on light, glass and the web</h2><p class="lx-excerpt">One letter when there's something worth reading. No tracking, unsubscribe in one click.</p></div>
        <form style="max-inline-size: none">
          <div class="ns-field"><label class="ns-field__label" for="${fid}">Email address</label><input class="ns-input" id="${fid}" type="email" autocomplete="email" /></div>
          <button type="submit" class="ns-button" data-variant="primary">Subscribe</button>
        </form>
      </div>
    </div>`;

  const footer = () => `
  <footer class="lx-wrap lx-footer">
    <a class="lx-wordmark" href="#">${tile('prism')}<span>[Name]</span></a>
    <nav aria-label="Footer"><ul>${['Work', 'About', 'Journal', 'Contact', 'Accessibility'].map((l) => `<li><a href="#">${l}</a></li>`).join('')}</ul></nav>
    <p class="t-small t-muted" style="margin: 0">© [Year] [Studio name]</p>
  </footer>`;

  const pagination = () => `
    <nav aria-label="Pagination"><ul class="lx-pages">
      <li><a class="ns-button" data-size="sm" href="#"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true" data-mirror="true"><path d="M19 12H5"></path><path d="M11 6l-6 6 6 6"></path></svg><span>Newer</span></a></li>
      <li><a href="#" aria-current="page">1</a></li><li><a href="#">2</a></li><li><a href="#">3</a></li>
      <li><a class="ns-button" data-size="sm" href="#"><span>Older</span>${arrow}</a></li>
    </ul></nav>`;

  const articleHead = (hid) => `
      <header class="lx-wrap lx-article__head">
        <nav class="lx-crumbs" aria-label="Breadcrumb"><ol><li><a href="#">Journal</a></li><li><a href="#" aria-current="page">Craft</a></li></ol></nav>
        <p class="t-micro">Craft · 5 min read</p>
        <h1 class="lx-title" id="${hid}">Designing with light</h1>
        <p class="lx-dek">How the system keeps contrast fixed while colour moves through glass, chrome and a prism of subdued neon.</p>
        <div class="lx-byline"><span class="lx-avatar" aria-hidden="true">[A]</span><p><b>[Author name]</b></p><p class="t-small t-muted"><time datetime="2026-10-05">5 October 2026</time></p></div>
      </header>`;

  return { nav, heroStatement, heroSplit, projects, filter, features, POSTS, postCard, postRow, quote, split, timeline, cta, newsletter, footer, pagination, articleHead, arrow };
}

// ---------------------------------------------------------------- boards
const shell = (inner) => `
<div class="board dir-luminous lx-stage" data-scheme="{{scheme}}" style="display: grid; align-content: start">
  <div class="lx-ambient" aria-hidden="true"></div>
${inner}
</div>`;

export function blocksBoard(ctx) {
  const B = lxBlocks(ctx);
  const label = (name, note) => `<div class="lx-wrap lx-block-label"><p class="t-micro">${name}</p><p class="t-micro">${note}</p></div>`;
  return shell(`${B.nav('Work')}
  <main id="main" style="display: grid; gap: 72px; padding-block: 56px 24px">
    <div class="lx-wrap" style="display: grid; gap: 14px">
      <p class="t-micro">Lue UI · block library</p>
      <h1 class="lx-display" style="font-size: clamp(2.8rem, 1.6rem + 3.6vw, 5rem)"><span class="lx-chrome-text">Blocks</span> for portfolios and journals</h1>
      <p class="lx-lede">Heroes, content and editorial blocks built from the same glass, chrome and light. Every block reflows to a single column on a phone. Tweak <b>dark</b> to see obsidian.</p>
    </div>
    <section style="display: grid; gap: 18px" aria-label="Hero, statement">${label('Hero · statement', 'satin folds · glass prism · two actions')}${B.heroStatement('bl-h1')}</section>
    <section style="display: grid; gap: 18px" aria-label="Hero, centred">${label('Hero · centred', 'for a single message')}${B.heroStatement('bl-h2', { center: true, variant: 1 })}</section>
    <section style="display: grid; gap: 18px" aria-label="Hero, split">${label('Hero · split', 'text and a figure · case-study opener')}${B.heroSplit('bl-h3')}</section>
    <section style="display: grid; gap: 18px" aria-label="Hero, article">${label('Hero · article', 'breadcrumb · kicker · title · dek · byline')}${B.articleHead('bl-h4')}</section>
    <section style="display: grid; gap: 18px" aria-label="Feature grid">${label('Feature grid', 'liquid-metal icon tiles')}<div class="lx-wrap">${B.features()}</div></section>
    <section style="display: grid; gap: 18px" aria-label="Project cards">${label('Project cards', 'whole-card link · tag list · filter')}<div class="lx-wrap" style="display: grid; gap: 24px"><div class="lx-section__head"><h2 class="lx-h2">Selected work</h2>${B.filter()}</div><div class="lx-grid" style="--min: 340px">${B.projects(3)}</div></div></section>
    <section style="display: grid; gap: 18px" aria-label="Posts">${label('Posts', 'card · list row · pagination')}<div class="lx-wrap lx-grid" style="--min: 420px; align-items: start">${B.postCard(B.POSTS[0])}<div>${B.POSTS.map(B.postRow).join('')}<div style="padding-block-start: 24px">${B.pagination()}</div></div></div></section>
    <section style="display: grid; gap: 18px" aria-label="Quote">${label('Quote', 'figure · blockquote · caption')}<div class="lx-wrap">${B.quote()}</div></section>
    <section style="display: grid; gap: 18px" aria-label="Media and text">${label('Media + text', 'stacks on narrow screens')}<div class="lx-wrap">${B.split()}</div></section>
    <section style="display: grid; gap: 18px" aria-label="Timeline">${label('Timeline', 'ordered list · time elements')}<div class="lx-wrap">${B.timeline()}</div></section>
    <section style="display: grid; gap: 18px" aria-label="Newsletter">${label('Newsletter band', 'labelled field · one action')}<div class="lx-wrap">${B.newsletter('bl-nl')}</div></section>
    <section style="display: grid; gap: 18px" aria-label="Footer">${label('Site footer', 'wordmark · footer navigation')}${B.footer()}</section>
  </main>`);
}

export function portfolioBoard(ctx) {
  const B = lxBlocks(ctx);
  return shell(`${B.nav('Work')}
  <main id="main">
    ${B.heroStatement('pf-h', { under: true })}
    <section class="lx-section lx-wrap" id="work" aria-labelledby="pf-work">
      <div class="lx-section__head"><div style="display: grid; gap: 12px"><p class="t-micro">Selected work</p><h2 class="lx-h2" id="pf-work">Recent projects</h2></div>${B.filter()}</div>
      <div class="lx-grid" style="--min: 440px">${B.projects(4)}</div>
    </section>
    <section class="lx-section lx-wrap" aria-labelledby="pf-svc">
      <div class="lx-section__head"><div style="display: grid; gap: 12px"><p class="t-micro">What we do</p><h2 class="lx-h2" id="pf-svc">Craft, all the way down</h2></div></div>
      ${B.features()}
    </section>
    <section class="lx-section lx-wrap" aria-label="What clients say">${B.quote()}</section>
    <section class="lx-section lx-wrap" id="journal" aria-labelledby="pf-j">
      <div class="lx-section__head"><div style="display: grid; gap: 12px"><p class="t-micro">Journal</p><h2 class="lx-h2" id="pf-j">Notes on light and the web</h2></div><a class="ns-button" data-variant="quiet" href="#">All posts ${B.arrow}</a></div>
      <div class="lx-grid" style="--min: 300px">${B.POSTS.map(B.postCard).join('')}</div>
    </section>
    <section class="lx-section lx-wrap" aria-label="Contact">${B.cta('pf-em')}</section>
  </main>
  ${B.footer()}`);
}

export function articleBoard(ctx) {
  const B = lxBlocks(ctx);
  const { icon } = ctx;
  const toc = [['colour', 'Colour as light'], ['contrast', 'Contrast that holds'], ['chrome', 'A chrome edge'], ['glass', 'Glass that steps aside']];
  return shell(`${B.nav('Journal')}
  <main id="main">
    <article aria-labelledby="ar-h">
      ${B.articleHead('ar-h')}
      <figure class="lx-wrap lx-figure">${media('prism', 0)}<figcaption>Light pools where glass meets the surface — the idea behind every edge in the system.</figcaption></figure>
      <div class="lx-wrap lx-article__body">
        <nav class="lx-toc lx-glass" aria-label="On this page"><p class="t-micro">On this page</p><ol>${toc.map(([id, t], i) => `<li><a href="#ar-${id}"${i === 1 ? ' aria-current="true"' : ''}>${t}</a></li>`).join('')}</ol></nav>
        <div class="lx-prose">
          <h2 id="ar-colour">Colour as light</h2>
          <p>In this system colour behaves like light rather than paint. Surfaces stay neutral — pearl by day, obsidian by night — and colour arrives the way it does through a glass prism: concentrated at an edge, gathered in a pool, never spread evenly across everything.</p>
          <p>Eight hues make up the prism: rose, orchid, iris, azure, aqua, mint, citron and amber. They're ramped at a subdued chroma — bright enough to glow, quiet enough to sit beside long-form reading like this.</p>
          <h2 id="ar-contrast">Contrast that holds while colour moves</h2>
          <p>Hover a primary button and its tones drift. Every tone sits at the same perceptual lightness, so the label's contrast doesn't change while the colours do. The checker tests the label against up to three tones overlapping, over every surface a button can sit on.</p>
          <aside class="lx-pull" aria-hidden="true">Contrast stays fixed. Only the colour moves.</aside>
          <p>The button itself is a pane of frosted glass. Outside a glass panel it blurs its own backdrop; inside one it doesn't, because the panel already has.</p>
          <figure class="lx-code lx-glass"><figcaption><span>CSS</span><span>Glass button</span></figcaption><pre tabindex="0"><code><span class="tk-c">/* A pane of glass that keeps its label legible */</span>
.button {
  <span class="tk-p">background-color</span>: var(--glass);
  <span class="tk-p">backdrop-filter</span>: blur(10px) saturate(1.8);
  <span class="tk-p">transition</span>: background-position 320ms ease-out;
}</code></pre></figure>
          <h2 id="ar-chrome">A chrome edge that's a real boundary</h2>
          <p>The hairline around a control is a gradient of steel with a short band of dispersed colour at its lower edge. It reads as reflection, but every stop reaches 3:1 against what surrounds it, so it still tells you exactly where the control is.</p>
          <ul>
            <li>Body text holds 7:1 on every surface, glass and satin included.</li>
            <li>Labels on buttons hold 4.5:1 in every state.</li>
            <li>Boundaries that identify a control hold 3:1 — chrome, dispersion and all.</li>
          </ul>
          <h2 id="ar-glass">Glass that steps aside</h2>
          <p>Glass is checked against its worst backdrop — pure white, pure black and every fill in the palette. When someone asks their device for less transparency or more contrast, it turns opaque; in forced colours it gives way to system colours entirely.</p>
          <div class="ns-alert" data-tone="info">${icon('info')}<p class="ns-alert__title">Nothing moves on its own</p><p class="ns-alert__body">Light shifts only in answer to hover, focus and press, and every movement is instant under reduced motion.</p></div>
        </div>
      </div>
      <footer class="lx-wrap" style="display: grid; gap: 28px; padding-block: 24px 56px; max-inline-size: 64rem">
        <ul class="lx-tags" aria-label="Topics"><li><span class="ns-tag">Colour</span></li><li><span class="ns-tag">Accessibility</span></li><li><span class="ns-tag">CSS</span></li></ul>
        <aside class="lx-author lx-glass" aria-label="About the author"><span class="lx-avatar" data-size="lg" aria-hidden="true">[A]</span><div><p class="t-label">[Author name]</p><p class="t-small t-muted">[One or two lines about the author and what they work on.]</p></div><a class="ns-button" data-size="sm" href="#">More posts</a></aside>
      </footer>
    </article>
    <section class="lx-section lx-wrap" aria-labelledby="ar-more">
      <div class="lx-section__head"><h2 class="lx-h2" id="ar-more">More from the journal</h2>${B.pagination()}</div>
      <div class="lx-grid" style="--min: 300px">${B.POSTS.slice(1).map(B.postCard).join('')}${B.postCard(['Motion that answers', 'Why every transition here waits for you to move first, and stops at 320 ms.', 'none', 1])}</div>
    </section>
    <section class="lx-section lx-wrap" aria-label="Newsletter">${B.newsletter('ar-nl')}</section>
  </main>
  ${B.footer()}`);
}

// ---------------------------------------------------------------- Foundations: materials section
export function materialsSection() {
  const panel = (s) => `<div class="scheme lx-stage" data-scheme="${s}" style="display: grid; gap: 22px; align-content: start; padding: 28px; border-radius: 24px; border: 1px solid var(--border-subtle)">
        <div class="lx-ambient" aria-hidden="true"></div>
        <p class="t-micro">${s === 'light' ? 'Pearl · light' : 'Obsidian · dark'}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">${tile('layers', 'lg')}${tile('prism')}${tile('access')}<span class="lx-avatar" data-size="lg" aria-hidden="true">[A]</span></div>
        <div style="position: relative; isolation: isolate; overflow: clip; border-radius: 20px; block-size: 220px; display: grid; place-items: center">${satin(s === 'light' ? 0 : 1)}${prism().replace('class="lx-prism"', 'class="lx-prism" style="inline-size: 200px"')}</div>
        <div style="display: flex; gap: 18px; align-items: center"><span class="lx-ring" aria-hidden="true" style="display: inline-block; inline-size: 140px; block-size: 56px; border-radius: 999px"></span><p class="t-small t-muted">Chrome with its dispersion band: steel stops, then amber → azure at the lower edge.</p></div>
      </div>`;
  return `
  <section style="display: grid; gap: 20px">
    <div class="section-head"><h2 class="t-h2">Metal and light</h2><p class="t-micro">liquid metal · satin · dispersion</p></div>
    <p class="t-small t-muted" style="max-inline-size: 76ch">Inspired by the qualities of polished metal and thick glass: forms with volume, light that disperses into a short spectrum where it meets an edge, and satin folds behind heroes. Colour appears as light, never as paint. Hero text on satin is checked against its lightest and darkest folds; tiles and the prism are decorative.</p>
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px">
      ${panel('light')}
      ${panel('dark')}
    </div>
  </section>`;
}
