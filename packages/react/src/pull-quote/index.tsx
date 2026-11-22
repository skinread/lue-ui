import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export type PullQuoteProps = Omit<ComponentPropsWithRef<'aside'>, 'aria-hidden'>;

/**
 * `<aside class="lue-pull" aria-hidden="true">` - a line from the body, repeated large. Hidden from assistive
 * technology, so repeat the body's words exactly. Contract: apps/docs/contracts/pull-quote.json.
 */
export function PullQuote({ className, ...props }: PullQuoteProps): ReactNode {
  return <aside {...props} className={cx('lue-pull', className)} aria-hidden="true" />;
}
