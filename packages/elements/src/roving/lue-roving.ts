import { rovingIndex } from './controller.js';

const ITEM = 'button, a[href], input, select, textarea, [data-lue-roving-item]';
const TEXT = 'input:not([type="checkbox"], [type="radio"], [type="button"], [type="submit"], [type="reset"]), textarea, select';

/**
 * `<lue-roving role="toolbar">` — one Tab stop for a group of controls: Tab enters at the last one used, arrow keys
 * move between them (Left/Right, or Up/Down with aria-orientation="vertical"; mirrored in right-to-left text), Home and
 * End go to the ends. Arrows inside a text field stay with the field. Deleted when `focusgroup` is Baseline.
 *
 * Element rules (ADR-0007): it writes only `tabindex` on its items (0 on the current one, -1 on the rest). Without it,
 * every control is a Tab stop, which still works.
 */
export class LueRoving extends HTMLElement {
  #connection: AbortController | undefined;
  #current: HTMLElement | null = null;

  connectedCallback(): void {
    this.#connection?.abort();
    this.#connection = new AbortController();
    const options = { signal: this.#connection.signal };
    this.addEventListener('keydown', this.#onKeydown, options);
    this.addEventListener('focusin', (event) => this.#sync(event.target as HTMLElement), options);
    this.#sync();
  }

  disconnectedCallback(): void {
    this.#connection?.abort();
  }

  /** The controls that take part, in DOM order: enabled and not inside a nested group. */
  get items(): HTMLElement[] {
    return [...this.querySelectorAll<HTMLElement>(ITEM)].filter(
      (el) => !(el as HTMLButtonElement).disabled && el.closest('lue-roving') === this,
    );
  }

  /** Makes `current` (or the last one used, or the first) the group's one Tab stop. */
  #sync(current?: HTMLElement): void {
    const items = this.items;
    if (current && items.includes(current)) this.#current = current;
    if (!this.#current || !items.includes(this.#current)) this.#current = items[0] ?? null;
    for (const item of items) {
      const tabindex = item === this.#current ? '0' : '-1';
      if (item.getAttribute('tabindex') !== tabindex) item.setAttribute('tabindex', tabindex);
    }
  }

  #onKeydown = (event: KeyboardEvent): void => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement;
    if (target.matches(TEXT)) return; // a text field keeps its own arrow, Home and End keys
    const items = this.items;
    const index = rovingIndex(event.key, items.indexOf(target), items.length, {
      orientation: this.getAttribute('aria-orientation') === 'vertical' ? 'vertical' : 'horizontal',
      rtl: getComputedStyle(this).direction === 'rtl',
    });
    if (index === null) return;
    event.preventDefault();
    items[index]!.focus();
  };
}
