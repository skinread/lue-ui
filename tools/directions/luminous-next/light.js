// Light that follows the pointer - a sketch of a `data-lue-light` behaviour for @lue-ui/elements.
//
// While a fine pointer moves over glass, a card, a button or a metal tile, the element (and any of those around it)
// gets data-lit, its pointer position as --lue-light-x / --lue-light-y, and the angle from its centre to the pointer
// as --lue-light-angle. CSS moves the sheen there and turns the chrome ring so a highlight faces the pointer; when the
// pointer leaves, data-lit goes and the ring eases back. Light moves only when the user does (ADR-0009): nothing runs
// without a hover-capable pointer or under reduced motion, and nothing is needed for the page to work.
//
// The lens: SVG displacement through backdrop-filter renders only in Chromium, and an engine that parses url() there
// but can't render it would drop the whole filter, so data-lens is set only where it is known to work.
const SELECTOR = '.lue-glass, .lue-card, .lue-button, .lue-tile';
// The ring's first specular spike sits 12.6deg into its conic gradient; turning by this puts it on the pointer.
const SPIKE = 12.6;

if ('userAgentData' in navigator && navigator.userAgentData.brands.some((b) => b.brand === 'Chromium')) {
  document.documentElement.dataset.lens = '';
}

const fine = matchMedia('(hover: hover) and (pointer: fine)');
const still = matchMedia('(prefers-reduced-motion: reduce)');
let frame = 0;
let last = null;
let lit = [];

const clear = (keep = []) => {
  for (const el of lit) {
    if (keep.includes(el)) continue;
    el.removeAttribute('data-lit');
    for (const p of ['--lue-light-x', '--lue-light-y', '--lue-light-angle']) el.style.removeProperty(p);
  }
  lit = keep;
};

const apply = () => {
  frame = 0;
  const chain = [];
  for (let el = last.target instanceof Element ? last.target.closest(SELECTOR) : null; el; el = el.parentElement?.closest(SELECTOR)) chain.push(el);
  clear(chain);
  for (const el of chain) {
    const r = el.getBoundingClientRect();
    const dx = last.clientX - (r.left + r.width / 2);
    const dy = last.clientY - (r.top + r.height / 2);
    el.dataset.lit = '';
    el.style.setProperty('--lue-light-x', `${(((last.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty('--lue-light-y', `${(((last.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    el.style.setProperty('--lue-light-angle', `${((Math.atan2(dx, -dy) * 180) / Math.PI - SPIKE).toFixed(1)}deg`);
  }
};

document.addEventListener('pointermove', (event) => {
  if (!fine.matches || still.matches || event.pointerType !== 'mouse') return;
  last = event;
  if (!frame) frame = requestAnimationFrame(apply);
}, { passive: true });
document.documentElement.addEventListener('pointerleave', () => clear());
still.addEventListener('change', () => clear());
