export interface ToastAction {
  label: string;
  onAction: () => void;
}
export interface ToastOptions {
  /** A button in the toast. A toast with an action stays until it's used or dismissed (WCAG 2.2.1). */
  action?: ToastAction | undefined;
  /** Milliseconds before it leaves; 6000 by default. `null` keeps it until dismissed. */
  duration?: number | null | undefined;
}
export interface Toast {
  dismiss(): void;
}

const MAX_VISIBLE = 3;
const close = '<svg class="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5"></path></svg>';

interface Entry {
  message: string;
  options: ToastOptions;
  node?: HTMLElement;
  timer?: ReturnType<typeof setTimeout>;
  remaining: number;
  startedAt: number;
}

/**
 * `<lue-toast-region>` - short status messages (WCAG 4.1.3). `region.show(message, options)` announces the message
 * and shows it at the viewport's block-end corner; it leaves after its duration, paused while the pointer is over the
 * toasts or focus is inside them. Escape dismisses the focused toast; focus then goes back where it came from. At most
 * three show at once; the rest wait.
 *
 * Announcements use `ariaNotify()` where it exists and an always-rendered `role="status"` region otherwise.
 *
 * Element rules (ADR-0007): it owns all its children (render it empty) and nothing else. `dismiss-label` sets the
 * dismiss button's name ("Dismiss" by default).
 */
export class LueToastRegion extends HTMLElement {
  #live: HTMLElement | undefined;
  #list: HTMLElement | undefined;
  #shown: Entry[] = [];
  #queue: Entry[] = [];
  #paused = false;
  #returnTo: HTMLElement | null = null;
  #connection: AbortController | undefined;

  connectedCallback(): void {
    if (!this.#list) {
      this.#live = Object.assign(document.createElement('div'), { className: 'lue-visually-hidden' });
      this.#live.setAttribute('role', 'status');
      this.#list = Object.assign(document.createElement('div'), { className: 'lue-toast-region__list' });
      this.#list.popover = 'manual';
      this.#list.setAttribute('role', 'region');
      this.#list.setAttribute('aria-label', this.getAttribute('aria-label') ?? 'Notifications');
      this.replaceChildren(this.#live, this.#list);
    }
    this.#connection?.abort();
    this.#connection = new AbortController();
    const options = { signal: this.#connection.signal };
    const list = this.#list;
    list.addEventListener('pointerenter', () => this.#pause(true), options);
    list.addEventListener('pointerleave', () => this.#pause(list.contains(document.activeElement)), options);
    list.addEventListener('focusin', (event) => {
      const from = (event as FocusEvent).relatedTarget;
      if (from instanceof HTMLElement && !list.contains(from)) this.#returnTo = from;
      this.#pause(true);
    }, options);
    list.addEventListener('focusout', (event) => {
      if (!list.contains((event as FocusEvent).relatedTarget as Node | null)) this.#pause(list.matches(':hover'));
    }, options);
    list.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const entry = this.#shown.find((e) => e.node?.contains(event.target as Node));
      if (entry) this.#dismiss(entry);
    }, options);
  }

  disconnectedCallback(): void {
    this.#connection?.abort();
    for (const entry of this.#shown) clearTimeout(entry.timer);
  }

  /** Announces and shows a toast. */
  show(message: string, options: ToastOptions = {}): Toast {
    const entry: Entry = { message, options, remaining: 0, startedAt: 0 };
    this.#announce(message);
    if (this.#shown.length < MAX_VISIBLE) this.#render(entry);
    else this.#queue.push(entry);
    return { dismiss: () => this.#dismiss(entry) };
  }

  #announce(message: string): void {
    const notify = (this as HTMLElement & { ariaNotify?: (text: string) => void }).ariaNotify;
    if (notify) return notify.call(this, message);
    // A changed text node in a live region that's already in the tree is what screen readers reliably announce.
    this.#live!.textContent = '';
    requestAnimationFrame(() => (this.#live!.textContent = message));
  }

  #render(entry: Entry): void {
    const node = document.createElement('div');
    node.className = 'lue-toast';
    const text = node.appendChild(document.createElement('p'));
    text.className = 'lue-toast__message';
    text.textContent = entry.message;
    const { action } = entry.options;
    if (action) {
      const button = node.appendChild(this.#button(action.label));
      button.addEventListener('click', () => {
        action.onAction();
        this.#dismiss(entry);
      });
    }
    const dismiss = node.appendChild(this.#button(''));
    dismiss.dataset.iconOnly = '';
    dismiss.setAttribute('aria-label', this.getAttribute('dismiss-label') ?? 'Dismiss');
    dismiss.innerHTML = close;
    dismiss.addEventListener('click', () => this.#dismiss(entry));
    entry.node = node;
    this.#list!.append(node);
    this.#shown.push(entry);
    if (!this.#list!.matches(':popover-open')) this.#list!.showPopover();
    const duration = action ? null : entry.options.duration === undefined ? 6000 : entry.options.duration;
    if (duration !== null) {
      entry.remaining = duration;
      if (!this.#paused) this.#start(entry);
    }
  }

  #button(label: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lue-button';
    button.dataset.size = 'sm';
    button.textContent = label;
    return button;
  }

  #start(entry: Entry): void {
    if (!entry.remaining) return;
    entry.startedAt = performance.now();
    entry.timer = setTimeout(() => this.#dismiss(entry), entry.remaining);
  }

  #pause(paused: boolean): void {
    if (paused === this.#paused) return;
    this.#paused = paused;
    for (const entry of this.#shown) {
      if (!entry.remaining) continue;
      if (paused) {
        clearTimeout(entry.timer);
        entry.remaining = Math.max(1, entry.remaining - (performance.now() - entry.startedAt));
      } else this.#start(entry);
    }
  }

  #dismiss(entry: Entry): void {
    const queued = this.#queue.indexOf(entry);
    if (queued >= 0) return void this.#queue.splice(queued, 1);
    const index = this.#shown.indexOf(entry);
    if (index < 0) return;
    clearTimeout(entry.timer);
    this.#shown.splice(index, 1);
    const hadFocus = entry.node!.contains(document.activeElement);
    entry.node!.remove();
    if (hadFocus) {
      this.#returnTo?.focus();
      this.#pause(this.#list!.matches(':hover'));
    }
    const next = this.#queue.shift();
    if (next) this.#render(next);
    else if (!this.#shown.length) this.#list!.hidePopover();
  }
}
