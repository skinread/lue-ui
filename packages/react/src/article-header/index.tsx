import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

/** A date: machine-readable for `<time datetime>`, and as people read it. */
export interface DateLabel {
  /** An ISO date, such as "2026-10-05". */
  dateTime: string;
  /** The date as written on the page, such as "5 October 2026". */
  label: ReactNode;
}

export interface ArticleHeaderProps extends Omit<ComponentPropsWithRef<'header'>, 'title' | 'children'> {
  /** The article's title: the h1. */
  title: ReactNode;
  /** Above the title: the category, and the reading time. */
  kicker?: ReactNode;
  /** A sentence under the title saying what the article is about. */
  dek?: ReactNode;
  /** Where the article sits: a `<Breadcrumb>`. */
  breadcrumb?: ReactNode;
  /** Who wrote it: a decorative `<Avatar>` and the name. */
  author?: ReactNode;
  /** When it was published. */
  published?: DateLabel | undefined;
}

/**
 * `<header class="lue-article-header">` - the top of an `<article>`: breadcrumb, kicker, title, dek and byline.
 * Contract: apps/docs/contracts/article-header.json.
 */
export function ArticleHeader({ title, kicker, dek, breadcrumb, author, published, className, ...props }: ArticleHeaderProps): ReactNode {
  return (
    <header {...props} className={cx('lue-article-header', className)}>
      {breadcrumb}
      {kicker ? <p className="lue-kicker">{kicker}</p> : null}
      <h1 className="lue-title">{title}</h1>
      {dek ? <p className="lue-dek">{dek}</p> : null}
      {author || published ? (
        <div className="lue-byline">
          {author}
          {published ? <time dateTime={published.dateTime}>{published.label}</time> : null}
        </div>
      ) : null}
    </header>
  );
}
