import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface SkipLinkProps extends ComponentPropsWithRef<'a'> {
  /** The main content's id, with its `#`. */
  href?: string | undefined;
}

/**
 * `<a class="lue-skip-link">` — render it first in the page. Hidden until it has focus.
 * Contract: apps/docs/contracts/skip-link.json.
 */
export function SkipLink({ className, href = '#main', ...props }: SkipLinkProps): ReactNode {
  return <a {...props} href={href} className={cx('lue-skip-link', className)} />;
}
