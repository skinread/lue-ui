import { createElement, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../button/index.js';
import { cx } from '../cx.js';

const MESSAGES = { previous: 'Previous slide', next: 'Next slide', slide: '{n} of {count}' };

export interface CarouselProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The carousel's name, e.g. "Featured projects". */
  'aria-label': string;
  /** Each slide's content; each slide is a group named "n of count". */
  slides: ReactNode[];
  /** Translations; {n} and {count} are filled in. */
  messages?: Partial<typeof MESSAGES> | undefined;
}

const arrow = (d: string) => (
  <svg className="lue-button__icon" aria-hidden="true" viewBox="0 0 16 16" data-mirror="">
    <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

/**
 * `<lue-carousel>` around a named `<section class="lue-carousel">`: a scroll-snap track of slides with previous and next buttons, which the
 * `<lue-carousel>` element wires up (mount `<LueElements/>` once; without it the list still scrolls and swipes). No
 * auto-rotation. Contract: apps/docs/contracts/carousel.json.
 */
export function Carousel({ slides, messages, className, ...props }: CarouselProps): ReactNode {
  const m = { ...MESSAGES, ...messages };
  return createElement(
    'lue-carousel',
    null,
    <section {...props} aria-roledescription="carousel" className={cx('lue-carousel', className)}>
      <div className="lue-carousel__controls">
        <Button size="sm" iconOnly aria-label={m.previous} data-lue-carousel="previous">{arrow('M10 3L5 8l5 5')}</Button>
        <Button size="sm" iconOnly aria-label={m.next} data-lue-carousel="next">{arrow('M6 3l5 5-5 5')}</Button>
      </div>
      <div className="lue-carousel__track">
        {slides.map((slide, i) => (
          <div key={i} className="lue-carousel__slide" role="group" aria-roledescription="slide" aria-label={m.slide.replace('{n}', String(i + 1)).replace('{count}', String(slides.length))}>
            {slide}
          </div>
        ))}
      </div>
    </section>,
  );
}
