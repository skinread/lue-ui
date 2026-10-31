// The liquid key - a sketch of a behaviour for @lue-ui/elements.
//
// Tabs and the segmented control draw their selected key as their container's ::before, placed on the selected item
// through --key-x, --key-y, --key-w and --key-h. When the selection changes, the key flows to the new item like a
// drop of liquid metal: its leading edge reaches out first, the trailing edge follows, and it settles. Only translate
// and scale animate. Without this script each selected item draws its own chrome key; under reduced motion the key
// moves without flowing.
const still = matchMedia('(prefers-reduced-motion: reduce)');
const groups = [
  { container: '.lue-tabs__list', item: '.lue-tabs__tab', selected: (el) => el.getAttribute('aria-selected') === 'true' },
  { container: '.lue-segmented__options', item: '.lue-segmented__option', selected: (el) => el.querySelector('input')?.checked },
];

function measure(container, item) {
  const box = container.getBoundingClientRect();
  const r = item.getBoundingClientRect();
  const rtl = getComputedStyle(container).direction === 'rtl';
  return {
    x: rtl ? box.right - r.right - container.clientLeft : r.left - box.left - container.clientLeft,
    y: r.top - box.top - container.clientTop,
    w: r.width,
    h: r.height,
  };
}

function place(container, k) {
  container.style.setProperty('--key-x', `${k.x}px`);
  container.style.setProperty('--key-y', `${k.y}px`);
  container.style.setProperty('--key-w', `${k.w}px`);
  container.style.setProperty('--key-h', `${k.h}px`);
}

function flow(container, from, to) {
  const dir = getComputedStyle(container).direction === 'rtl' ? -1 : 1;
  const right = to.x > from.x;
  // Halfway: the leading edge has nearly arrived, the trailing edge has barely left.
  const fromEnd = from.x + from.w;
  const toEnd = to.x + to.w;
  const midStart = right ? from.x + (to.x - from.x) * 0.2 : to.x + (from.x - to.x) * 0.1;
  const midEnd = right ? fromEnd + (toEnd - fromEnd) * 0.9 : fromEnd - (fromEnd - toEnd) * 0.2;
  const frame = (x, w, sy) => ({ translate: `${x * dir}px 0`, scale: `${w / to.w} ${sy}` });
  container.animate(
    [frame(from.x, from.w, 1), { ...frame(midStart, midEnd - midStart, 0.86), offset: 0.45 }, frame(to.x, to.w, 1)],
    { duration: 460, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::before' },
  );
}

function setUp(container, { item, selected }) {
  let current = null;
  const update = (animate) => {
    const chosen = [...container.querySelectorAll(item)].find(selected);
    if (!chosen) return;
    const next = measure(container, chosen);
    container.dataset.liquid = '';
    if (animate && current && !still.matches && (next.x !== current.x || next.w !== current.w)) flow(container, current, next);
    place(container, next);
    current = next;
  };
  new MutationObserver(() => update(true)).observe(container, { subtree: true, attributes: true, attributeFilter: ['aria-selected'] });
  container.addEventListener('change', () => update(true));
  new ResizeObserver(() => update(false)).observe(container);
  update(false);
}

const start = (group) => {
  for (const container of document.querySelectorAll(group.container)) setUp(container, group);
};
start(groups[1]);
// Tabs only have a selection once <lue-tabs> is defined.
customElements.whenDefined('lue-tabs').then(() => start(groups[0]));
