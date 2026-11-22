import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';
import type { NavItem } from '../site-header/index.js';

export interface SiteFooterProps extends Omit<ComponentPropsWithRef<'footer'>, 'children'> {
  /** The site's name, linking home: usually a `<Wordmark>`. */
  brand?: ReactNode;
  /** The footer navigation's links. */
  items: NavItem[];
  /** The navigation's name, translated ("Footer" by default). */
  navLabel?: string | undefined;
  /** A line after the links: the copyright. */
  note?: ReactNode;
}

/**
 * `<footer class="lue-site-footer">` - the wordmark, a footer navigation and a note, under a fading chrome line.
 * Contract: apps/docs/contracts/site-footer.json.
 */
export function SiteFooter({ brand, items, navLabel = 'Footer', note, className, ...props }: SiteFooterProps): ReactNode {
  return (
    <footer {...props} className={cx('lue-site-footer', className)}>
      {brand}
      <nav aria-label={navLabel}>
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} aria-current={item.current ? 'page' : undefined}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      {note ? <p className="lue-site-footer__note">{note}</p> : null}
    </footer>
  );
}
