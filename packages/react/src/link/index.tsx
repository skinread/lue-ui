import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export type LinkProps = ComponentPropsWithRef<'a'>;

/**
 * `<a class="lue-link">` - underlined, always. For a router's own link component, give it `className="lue-link"`
 * instead. Contract: apps/docs/contracts/link.json.
 */
export function Link({ className, ...props }: LinkProps): ReactNode {
  return <a {...props} className={cx('lue-link', className)} />;
}
