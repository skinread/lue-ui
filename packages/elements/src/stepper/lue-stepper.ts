/**
 * `<lue-stepper>` - − and + buttons (`[data-lue-step="down"]`, `[data-lue-step="up"]`) for the number input inside
 * it: they call stepDown() and stepUp(), so min, max and step are the input's own, then fire input and change as
 * typing would. At a limit a button says so with aria-disabled (keeping its focus). The input keeps its native arrow
 * keys; the buttons stay hidden (CSS, `:not(:defined)`) until this element is defined.
 *
 * Element rules (ADR-0007): it writes the input's value (as the user would) and only `aria-disabled` on the buttons.
 */
export class LueStepper extends HTMLElement {
  #connection: AbortController | undefined;

  connectedCallback(): void {
    this.#connection?.abort();
    this.#connection = new AbortController();
    const options = { signal: this.#connection.signal };
    this.addEventListener('click', this.#onClick, options);
    this.addEventListener('input', () => this.#update(), options);
    this.addEventListener('change', () => this.#update(), options);
    this.#update();
  }

  disconnectedCallback(): void {
    this.#connection?.abort();
  }

  get input(): HTMLInputElement | null {
    return this.querySelector<HTMLInputElement>('input[type="number"]');
  }

  #update(): void {
    const input = this.input;
    if (!input) return;
    const value = input.valueAsNumber;
    const min = input.min === '' ? -Infinity : Number(input.min);
    const max = input.max === '' ? Infinity : Number(input.max);
    this.#mark('down', input.disabled || (!Number.isNaN(value) && value <= min));
    this.#mark('up', input.disabled || (!Number.isNaN(value) && value >= max));
  }

  #mark(which: 'down' | 'up', blocked: boolean): void {
    const button = this.querySelector(`[data-lue-step="${which}"]`);
    if (button && button.getAttribute('aria-disabled') !== String(blocked)) button.setAttribute('aria-disabled', String(blocked));
  }

  #onClick = (event: MouseEvent): void => {
    const button = (event.target as Element).closest?.('[data-lue-step]');
    const input = this.input;
    if (!button || !input || !this.contains(button) || button.getAttribute('aria-disabled') === 'true') return;
    try {
      if (button.getAttribute('data-lue-step') === 'up') input.stepUp();
      else input.stepDown();
    } catch {
      return; // not a steppable value
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };
}
