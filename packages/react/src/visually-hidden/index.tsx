import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export type VisuallyHiddenProps = ComponentPropsWithRef<'span'>;

/**
 * `<span class="lue-visually-hidden">` - read by assistive technology, not shown. It shows while something inside it
 * has focus. Contract: apps/docs/contracts/visually-hidden.json.
 */
export function VisuallyHidden({ className, ...props }: VisuallyHiddenProps): ReactNode {
  return <span {...props} className={cx('lue-visually-hidden', className)} />;
}
