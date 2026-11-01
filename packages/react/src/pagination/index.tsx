import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface PaginationProps extends Omit<ComponentPropsWithRef<'nav'>, 'children'> {
  /** The current page, from 1. */
  page: number;
  /** How many pages there are. Long ranges are shortened to the first, last and nearby pages. */
  pages: number;
  /** The URL of a page. */
  href: (page: number) => string;
  /** Translations: the landmark's name, and the words around the numbers. */
  messages?: Partial<typeof MESSAGES> | undefined;
}

const MESSAGES = { label: 'Pagination', previous: 'Previous', next: 'Next', page: 'Page' };

/** The pages to show: the first, the last, and the current one with its neighbours; null marks a gap. */
export function pageRange(page: number, pages: number): (number | null)[] {
  const shown = [...new Set([1, page - 1, page, page + 1, pages])].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  return shown.flatMap((n, i) => (i && n - shown[i - 1]! > 1 ? [null, n] : [n]));
}

/**
 * `<nav class="lue-pagination">`: previous and next links, and numbered links with "Page" read before each number. The
 * current page has `aria-current="page"`. Contract: apps/docs/contracts/pagination.json.
 */
export function Pagination({ page, pages, href, messages, className, ...props }: PaginationProps): ReactNode {
  const m = { ...MESSAGES, ...messages };
  return (
    <nav {...props} aria-label={m.label} className={cx('lue-pagination', className)}>
      <ul>
        {page > 1 ? <li><a className="lue-button" data-variant="quiet" href={href(page - 1)} rel="prev">{m.previous}</a></li> : null}
        {pageRange(page, pages).map((n, i) =>
          n === null ? (
            <li key={`gap${i}`} aria-hidden="true">…</li>
          ) : (
            <li key={n}>
              <a href={href(n)} aria-current={n === page ? 'page' : undefined}>
                <span className="lue-visually-hidden">{m.page} </span>
                {n}
              </a>
            </li>
          ),
        )}
        {page < pages ? <li><a className="lue-button" data-variant="quiet" href={href(page + 1)} rel="next">{m.next}</a></li> : null}
      </ul>
    </nav>
  );
}
