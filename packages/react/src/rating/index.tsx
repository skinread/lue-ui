import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface RatingProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** The score; halves show as half stars. */
  value: number;
  /** The best score (5 by default). */
  max?: number | undefined;
  /** The score in words, which is what's read; "{value} out of {max}" by default. Translate it here. */
  text?: string | undefined;
  /** Hide the words visually (they're still read). */
  hideText?: boolean | undefined;
}

/**
 * `<span class="lue-rating">`: stars (decorative) and the score in words. Read-only; to ask for a rating, use a radio
 * group with words. Contract: apps/docs/contracts/rating.json.
 */
export function Rating({ value, max = 5, text, hideText, className, ...props }: RatingProps): ReactNode {
  const stars = { '--lue-rating-value': value, '--lue-rating-max': max } as CSSProperties;
  return (
    <span {...props} className={cx('lue-rating', className)}>
      <span className="lue-rating__stars" aria-hidden="true" style={stars} />
      <span className={hideText ? 'lue-visually-hidden' : 'lue-rating__text'}>{text ?? `${value} out of ${max}`}</span>
    </span>
  );
}
