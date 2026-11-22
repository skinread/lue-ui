import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

/** A link in a site's navigation. */
export interface NavItem {
  /** The link's text. */
  label: ReactNode;
  href: string;
  /** The page being shown: aria-current="page". */
  current?: boolean | undefined;
}

export interface SiteHeaderProps extends Omit<ComponentPropsWithRef<'header'>, 'children'> {
  /** The site's name, linking home: usually a `<Wordmark>`. */
  brand: ReactNode;
  /** The main navigation's links; mark the page being shown with `current`. */
  items: NavItem[];
  /** The navigation's name, translated ("Main" by default). */
  navLabel?: string | undefined;
}

/**
 * `<header class="lue-site-header">` - a floating glass bar with the wordmark and the main navigation. Put a
 * `<SkipLink>` before it. Contract: apps/docs/contracts/site-header.json.
 */
export function SiteHeader({ brand, items, navLabel = 'Main', className, ...props }: SiteHeaderProps): ReactNode {
  return (
    <header {...props} className={cx('lue-site-header', className)}>
      <div className="lue-site-header__bar">
        {brand}
        <nav aria-label={navLabel}>
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <a className="lue-site-header__link" href={item.href} aria-current={item.current ? 'page' : undefined}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export interface WordmarkProps extends ComponentPropsWithRef<'a'> {
  /** A decorative icon tile before the name: an `<IconTile>`. */
  tile?: ReactNode;
}

/** `<a class="lue-wordmark">` - the site's name, linking home, in the header and the footer. */
export function Wordmark({ tile, className, children, ...props }: WordmarkProps): ReactNode {
  return (
    <a {...props} className={cx('lue-wordmark', className)}>
      {tile}
      {children}
    </a>
  );
}
