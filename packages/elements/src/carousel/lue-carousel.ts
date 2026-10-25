/**
 * `<lue-carousel>` - previous and next buttons for a scroll-snap track (`.lue-carousel__track`): each moves one slide
 * (smoothly unless motion is reduced; right-to-left aware through scrollIntoView), and says it can't go further with
 * aria-disabled, so a focused button keeps its focus. The track scrolls, swipes and snaps on its own; the buttons stay
 * hidden (CSS, `:not(:defined)`) until this element is defined. No auto-rotation.
 *
 * Element rules (ADR-0007): it writes only `aria-disabled` on `[data-lue-carousel="previous"]` and `[data-lue-carousel="next"]`.
 */
export class LueCarousel extends HTMLElement {
  #connection: AbortController | undefined;
  #frame = 0;

  connectedCallback(): void {
    this.#connection?.abort();
    this.#connection = new AbortController();
    const options = { signal: this.#connection.signal };
    this.addEventListener('click', this.#onClick, options);
    this.track?.addEventListener('scroll', this.#schedule, { ...options, passive: true });
    addEventListener('resize', this.#schedule, options);
    this.#update();
  }

  disconnectedCallback(): void {
    this.#connection?.abort();
    cancelAnimationFrame(this.#frame);
  }

  get track(): HTMLElement | null {
    return this.querySelector<HTMLElement>('.lue-carousel__track');
  }

  get slides(): HTMLElement[] {
    return [...(this.track?.children ?? [])] as HTMLElement[];
  }

  /** The first slide whose start edge is in view. */
  get current(): number {
    const track = this.track;
    if (!track) return 0;
    const rtl = getComputedStyle(track).direction === 'rtl';
    const edge = track.getBoundingClientRect()[rtl ? 'right' : 'left'];
    const index = this.slides.findIndex((slide) => {
      const start = slide.getBoundingClientRect()[rtl ? 'right' : 'left'];
      return rtl ? start <= edge + 1 : start >= edge - 1;
    });
    return Math.max(index, 0);
  }

  /** Moves by `by` slides from the current one. */
  step(by: number): void {
    const slides = this.slides;
    const target = slides[Math.min(Math.max(this.current + by, 0), slides.length - 1)];
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    target?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'nearest', inline: 'start' });
  }

  #schedule = (): void => {
    cancelAnimationFrame(this.#frame);
    this.#frame = requestAnimationFrame(() => this.#update());
  };

  #update(): void {
    const track = this.track;
    if (!track) return;
    const position = Math.abs(track.scrollLeft);
    const atStart = position <= 1;
    const atEnd = position + track.clientWidth >= track.scrollWidth - 1;
    this.#mark('previous', atStart);
    this.#mark('next', atEnd);
  }

  #mark(which: 'previous' | 'next', blocked: boolean): void {
    const button = this.querySelector(`[data-lue-carousel="${which}"]`);
    if (button && button.getAttribute('aria-disabled') !== String(blocked)) button.setAttribute('aria-disabled', String(blocked));
  }

  #onClick = (event: MouseEvent): void => {
    const button = (event.target as Element).closest?.('[data-lue-carousel]');
    if (!button || !this.contains(button) || button.getAttribute('aria-disabled') === 'true') return;
    this.step(button.getAttribute('data-lue-carousel') === 'next' ? 1 : -1);
  };
}
