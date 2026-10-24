import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface BreadcrumbProps extends Omit<ComponentPropsWithRef<'nav'>, 'children'> {
  /** From the home page to the current one; the last is the current page. */
  items: { label: ReactNode; href: string }[];
  /** The landmark's name, translated ("Breadcrumb" by default). */
  'aria-label'?: string | undefined;
}

/**
 * `<nav class="lue-breadcrumb">` with an ordered list of links; the last has `aria-current="page"`.
 * Contract: apps/docs/contracts/breadcrumb.json.
 */
export function Breadcrumb({ items, className, 'aria-label': label = 'Breadcrumb', ...props }: BreadcrumbProps): ReactNode {
  return (
    <nav {...props} aria-label={label} className={cx('lue-breadcrumb', className)}>
      <ol>
        {items.map((item, i) => (
          <li key={item.href}>
            <a href={item.href} aria-current={i === items.length - 1 ? 'page' : undefined}>{item.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
