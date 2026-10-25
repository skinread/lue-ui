import { menuAction, triggerAction, typeaheadMatch, TYPEAHEAD_TIMEOUT } from './controller.js';

const ITEM = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

/**
 * `<lue-menu popover role="menu">` - adds the APG menu keyboard model to a popover menu. Opening, closing, Escape,
 * light dismiss and top layer stay with the browser.
 *
 * Focus return is made explicit: when the menu closes with focus inside it, focus goes back to the button that
 * opened it. Browsers only restore focus to whatever was focused before, and in WebKit that's often not the button
 * (it doesn't focus buttons on click, and `showModal()` focuses the dialog itself).
 *
 * ArrowDown and ArrowUp on its closed button open it at the first or last item (APG, optional keys).
 *
 * Element rules (ADR-0007): no DOM writes at all - it only listens and moves focus - so it never conflicts with
 * framework-rendered markup. Items carry `tabindex="-1"` in the markup; this element doesn't manage it.
 */
export class LueMenu extends HTMLElement {
  #connection: AbortController | undefined;
  #query = '';
  #queryAt = 0;
  #invoker: HTMLElement | null = null;
  #openAt: 'first' | 'last' = 'first';

  connectedCallback(): void {
    this.#connection?.abort();
    this.#connection = new AbortController();
    const options = { signal: this.#connection.signal };
    this.addEventListener('beforetoggle', this.#onBeforeToggle, options);
    this.addEventListener('toggle', this.#onToggle, options);
    this.addEventListener('keydown', this.#onKeydown, options);
    this.addEventListener('click', this.#onClick, options);
    // The button that opens this menu lives outside it, so its arrow keys are heard at the document.
    this.ownerDocument.addEventListener('keydown', this.#onTriggerKeydown, { ...options, capture: true });
  }

  disconnectedCallback(): void {
    this.#connection?.abort();
    this.#connection = undefined;
  }

  /** The menu's items, in DOM order. */
  get items(): HTMLElement[] {
    return [...this.querySelectorAll<HTMLElement>(ITEM)];
  }

  #onBeforeToggle = (event: Event): void => {
    const { newState, source } = event as ToggleEvent & { source?: Element | null };
    if (newState === 'open') {
      // `source` is the invoking button (newer engines); otherwise the button usually has focus.
      const invoker = source ?? document.activeElement;
      this.#invoker = invoker instanceof HTMLElement && !this.contains(invoker) ? invoker : null;
    } else if (this.contains(document.activeElement)) {
      // Still focusable here: the menu hides only after this event.
      this.#invoker?.focus();
    }
  };

  #onToggle = (event: Event): void => {
    if ((event as ToggleEvent).newState !== 'open') return;
    this.#query = '';
    const items = this.items;
    (this.#openAt === 'last' ? items.at(-1) : items[0])?.focus();
    this.#openAt = 'first';
  };

  /** ArrowDown or ArrowUp on a closed menu's button opens it at the first or last item. */
  #onTriggerKeydown = (event: KeyboardEvent): void => {
    const button = event.target instanceof HTMLButtonElement ? event.target : null;
    if (!button || !this.id || event.altKey || event.ctrlKey || event.metaKey) return;
    if (button.getAttribute('commandfor') !== this.id && button.getAttribute('popovertarget') !== this.id) return;
    const at = triggerAction(event.key);
    if (!at || this.matches(':popover-open')) return;
    event.preventDefault();
    this.#openAt = at;
    // Activating the button opens the menu the way Enter would, with the button as its source and anchor.
    button.click();
  };

  #onKeydown = (event: KeyboardEvent): void => {
    // Option+Tab is how Safari users reach buttons when "Press Tab to highlight each item" is off.
    const optionTab = event.key === 'Tab' && event.altKey;
    if ((event.altKey && !optionTab) || event.ctrlKey || event.metaKey) return;
    const items = this.items;
    const current = items.indexOf(document.activeElement as HTMLElement);
    const action = menuAction(event.key, current, items.length);
    if (!action) return;
    if (action.type === 'close') {
      // Let Tab carry on: hiding returns focus to the invoker, then the Tab moves on from there.
      this.hidePopover();
      return;
    }
    event.preventDefault();
    if (action.type === 'focus') {
      items[action.index]?.focus();
      return;
    }
    const now = event.timeStamp;
    this.#query = now - this.#queryAt > TYPEAHEAD_TIMEOUT ? action.char : this.#query + action.char;
    this.#queryAt = now;
    const index = typeaheadMatch(this.#query, items.map((item) => item.textContent ?? ''), current);
    if (index >= 0) items[index]?.focus();
  };

  #onClick = (event: MouseEvent): void => {
    const item = (event.target as Element).closest<HTMLElement>(ITEM);
    if (!item || !this.contains(item) || item.getAttribute('aria-disabled') === 'true') return;
    // Checkbox and radio items stay open so several can be changed in one visit.
    if (item.getAttribute('role') === 'menuitem' && this.matches(':popover-open')) this.hidePopover();
  };
}
