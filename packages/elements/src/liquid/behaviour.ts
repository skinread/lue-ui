/**
 * The liquid key - tabs (`.lue-tabs__list` in a defined `<lue-tabs>`) and the segmented control
 * (`.lue-segmented__options`) draw their selected option as one chrome key, the container's `::before`. This behaviour
 * measures the selected option and places the key on it through custom properties; when the selection changes, the
 * key flows to the new option like liquid metal (the leading edge reaches out first, the trailing edge follows, a
 * slight vertical squash, then it settles). Only `translate` and `scale` animate, with WAAPI on `::before`; never under
 * `prefers-reduced-motion: reduce`. A resize places the key again without animating.
 *
 * Without this script each selected option draws its own static key, so nothing depends on it.
 *
 * Owned (ADR-0007), on the container only: `data-lue-liquid` (empty, set once the key is placed) and the inline custom
 * properties `--lue-key-x`, `--lue-key-y`, `--lue-key-w` and `--lue-key-h` (px). x is the selected option's inline-start
 * offset from the container's padding edge (from the right in right-to-left text), y its offset from the top padding
 * edge. It never adds, moves or removes nodes. React never renders these, nor a `style` on either container.
 */

/** A key's place in its container, in px: logical inline-start offset, top offset, width and height. */
export interface LiquidKey {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The containers the key flows in, and how each finds its selected option. */
const GROUPS = [
  { container: '.lue-tabs__list', item: '.lue-tabs__tab', selected: (el: Element) => el.getAttribute('aria-selected') === 'true' },
  { container: '.lue-segmented__options', item: '.lue-segmented__option', selected: (el: Element) => !!el.querySelector<HTMLInputElement>('input')?.checked },
];
const CONTAINERS = GROUPS.map((g) => g.container).join(',');
const PROPERTIES = ['--lue-key-x', '--lue-key-y', '--lue-key-w', '--lue-key-h'] as const;
/** Milliseconds the key takes to flow to a new option. */
export const LIQUID_DURATION = 460;
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * The keyframes for the key flowing from one place to another, ending exactly at the CSS resting place
 * (`translate: calc(var(--lue-key-x) * var(--lue-key-dir)) 0`, scale 1). `dir` is 1, or -1 in right-to-left text.
 */
export function liquidKeyframes(from: LiquidKey, to: LiquidKey, dir: 1 | -1 = 1): Keyframe[] {
  const ahead = to.x > from.x;
  const fromEnd = from.x + from.w;
  const toEnd = to.x + to.w;
  // Halfway: the leading edge has nearly arrived, the trailing edge has barely left.
  const midStart = ahead ? from.x + (to.x - from.x) * 0.2 : to.x + (from.x - to.x) * 0.1;
  const midEnd = ahead ? fromEnd + (toEnd - fromEnd) * 0.9 : fromEnd - (fromEnd - toEnd) * 0.2;
  const width = to.w || 1;
  const frame = (x: number, w: number, sy: number): Keyframe => ({ translate: `${x * dir}px 0`, scale: `${w / width} ${sy}` });
  return [frame(from.x, from.w, 1), { ...frame(midStart, midEnd - midStart, 0.86), offset: 0.45 }, { translate: `${to.x * dir}px 0`, scale: '1 1' }];
}

/** Starts the liquid key for every tab list and segmented control inside `root`, now and later; returns a function that stops it. */
export function installLiquid(root: Document | HTMLElement = document): () => void {
  const doc = root instanceof Document ? root : root.ownerDocument;
  const view = doc.defaultView ?? window;
  const still = view.matchMedia('(prefers-reduced-motion: reduce)');
  const keys = new Map<HTMLElement, LiquidKey | null>();
  const running = new WeakMap<HTMLElement, Animation>();
  const connection = new AbortController();
  const resize = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const container = entry.target.closest<HTMLElement>(CONTAINERS);
      if (container && keys.has(container)) update(container, false);
    }
  });

  const groupOf = (container: Element) => GROUPS.find((g) => container.matches(g.container));
  const eligible = (container: Element) =>
    container.matches(GROUPS[0]!.container) ? !!container.closest('lue-tabs')?.matches(':defined') : container.matches(GROUPS[1]!.container);

  function measure(container: HTMLElement, item: Element): LiquidKey {
    const box = container.getBoundingClientRect();
    const r = item.getBoundingClientRect();
    const style = view.getComputedStyle(container);
    const rtl = style.direction === 'rtl';
    const start = parseFloat(rtl ? style.borderRightWidth : style.borderLeftWidth) || 0;
    return { x: (rtl ? box.right - r.right : r.left - box.left) - start, y: r.top - box.top - container.clientTop, w: r.width, h: r.height };
  }

  function update(container: HTMLElement, animate: boolean): void {
    const group = groupOf(container);
    if (!group || !container.isConnected || !eligible(container)) return;
    if (!keys.has(container)) attach(container);
    const chosen = [...container.querySelectorAll(group.item)].find(group.selected);
    if (!chosen) return;
    const next = measure(container, chosen);
    const current = keys.get(container);
    if (animate && current && !still.matches && (Math.abs(next.x - current.x) > 0.5 || Math.abs(next.w - current.w) > 0.5)) {
      running.get(container)?.cancel();
      const dir = view.getComputedStyle(container).direction === 'rtl' ? -1 : 1;
      running.set(container, container.animate(liquidKeyframes(current, next, dir), { duration: LIQUID_DURATION, easing: EASING, pseudoElement: '::before' }));
    }
    const values = [next.x, next.y, next.w, next.h];
    PROPERTIES.forEach((p, i) => container.style.setProperty(p, `${values[i]}px`));
    if (!container.hasAttribute('data-lue-liquid')) container.setAttribute('data-lue-liquid', '');
    keys.set(container, next);
  }

  function attach(container: HTMLElement): void {
    keys.set(container, null);
    resize.observe(container);
    for (const item of container.querySelectorAll(groupOf(container)!.item)) resize.observe(item);
  }

  function detach(container: HTMLElement): void {
    keys.delete(container);
    resize.unobserve(container);
    for (const item of container.querySelectorAll(groupOf(container)!.item)) resize.unobserve(item);
    running.get(container)?.cancel();
    container.removeAttribute('data-lue-liquid');
    for (const p of PROPERTIES) container.style.removeProperty(p);
  }

  const scan = (node: ParentNode, animate = false) => {
    if (node instanceof HTMLElement && node.matches(CONTAINERS)) update(node, animate);
    for (const container of node.querySelectorAll<HTMLElement>(CONTAINERS)) update(container, animate);
  };

  const mutations = new MutationObserver((records) => {
    const changed = new Set<HTMLElement>();
    for (const record of records) {
      if (record.type === 'attributes') {
        const container = (record.target as Element).closest<HTMLElement>(CONTAINERS);
        if (container) changed.add(container);
      } else for (const node of record.addedNodes) if (node instanceof Element) scan(node);
    }
    for (const container of keys.keys()) if (!container.isConnected) detach(container);
    for (const container of changed) update(container, true);
  });
  mutations.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-selected'] });

  root.addEventListener('change', (event) => {
    const container = (event.target as Element).closest?.<HTMLElement>(CONTAINERS);
    if (container) update(container, true);
  }, { signal: connection.signal });
  // A form reset unchecks radios without a change event, after the reset event.
  root.addEventListener('reset', (event) => {
    view.requestAnimationFrame(() => scan(event.target as Element, true));
  }, { signal: connection.signal });
  // Tab lists only take part once <lue-tabs> is defined (its upgrade writes aria-selected, which the observer sees too).
  void view.customElements.whenDefined('lue-tabs').then(() => {
    if (!connection.signal.aborted) scan(root);
  });
  scan(root);

  return () => {
    connection.abort();
    mutations.disconnect();
    resize.disconnect();
    for (const container of [...keys.keys()]) detach(container);
  };
}
