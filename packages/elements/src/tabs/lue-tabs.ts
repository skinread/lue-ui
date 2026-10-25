import { rovingIndex } from '../roving/controller.js';

/**
 * `<lue-tabs>` - turns a named `<nav>` of in-page links (`.lue-tabs__list`) and the sections they point to into tabs (WAI-ARIA
 * APG, automatic activation): arrow keys move between tabs and show their panel (mirrored in right-to-left text, and
 * wrapping), Home and End go to the ends, Tab moves from the tab into its panel. A link to a panel in the page's URL
 * (#id) opens that tab first.
 *
 * Without it the markup is a list of links to sections that are all shown, which works on its own.
 *
 * Element rules (ADR-0007): it writes only `role`, `aria-selected`, `aria-controls` and `tabindex` on the links,
 * `role` on the list, and `role`, `aria-labelledby`, `tabindex` and `hidden` on the panels. Links and panels need
 * ids in the markup. A `lue-tab-change` event (detail.panel) says which panel was shown.
 */
export class LueTabs extends HTMLElement {
  #connection: AbortController | undefined;

  connectedCallback(): void {
    this.#connection?.abort();
    this.#connection = new AbortController();
    const options = { signal: this.#connection.signal };
    this.addEventListener('click', this.#onClick, options);
    this.addEventListener('keydown', this.#onKeydown, options);
    const fromUrl = this.tabs.findIndex((tab) => tab.hash && tab.hash === location.hash);
    const selected = this.tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    this.select(fromUrl >= 0 ? fromUrl : Math.max(selected, 0), false);
  }

  disconnectedCallback(): void {
    this.#connection?.abort();
  }

  get list(): HTMLElement | null {
    return this.querySelector<HTMLElement>('.lue-tabs__list');
  }

  /** The tab links, in order: each `a[href="#panel"]` in the list. */
  get tabs(): HTMLAnchorElement[] {
    return [...(this.list?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]') ?? [])];
  }

  #panel(tab: HTMLAnchorElement): HTMLElement | null {
    const id = decodeURIComponent(tab.hash.slice(1));
    const panel = id ? this.ownerDocument.getElementById(id) : null;
    return panel && this.contains(panel) ? panel : null;
  }

  /** Shows the tab at `index` and hides the others; `notify` fires lue-tab-change. */
  select(index: number, notify = true): void {
    const tabs = this.tabs;
    if (!tabs[index]) return;
    const list = this.list!;
    if (list.getAttribute('role') !== 'tablist') list.setAttribute('role', 'tablist');
    tabs.forEach((tab, i) => {
      const on = i === index;
      const panel = this.#panel(tab);
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(on));
      tab.setAttribute('tabindex', on ? '0' : '-1');
      if (panel) {
        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
        if (tab.id) panel.setAttribute('aria-labelledby', tab.id);
        panel.setAttribute('tabindex', '0');
        panel.hidden = !on;
      }
    });
    if (notify) this.dispatchEvent(new CustomEvent('lue-tab-change', { bubbles: true, detail: { panel: this.#panel(tabs[index]!) } }));
  }

  #onClick = (event: MouseEvent): void => {
    const tab = (event.target as Element).closest?.('a');
    const index = tab ? this.tabs.indexOf(tab as HTMLAnchorElement) : -1;
    if (index < 0) return;
    event.preventDefault(); // stay put: no jump to the panel
    this.select(index);
  };

  #onKeydown = (event: KeyboardEvent): void => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const tabs = this.tabs;
    const current = tabs.indexOf(event.target as HTMLAnchorElement);
    if (current < 0) return;
    const index = rovingIndex(event.key, current, tabs.length, { rtl: getComputedStyle(this).direction === 'rtl', wrap: true });
    if (index === null) return;
    event.preventDefault();
    this.select(index);
    tabs[index]!.focus();
  };
}
