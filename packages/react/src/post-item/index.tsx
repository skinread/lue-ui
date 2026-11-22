import { createElement, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';
import type { DateLabel } from '../article-header/index.js';

export interface PostItemProps extends Omit<ComponentPropsWithRef<'article'>, 'title' | 'children'> {
  /** The post's address; its link covers the whole item. */
  href: string;
  /** The post's title: the heading and the link's text. */
  title: ReactNode;
  /** The category, above the title. */
  category?: ReactNode;
  /** When it was published. */
  published?: DateLabel | undefined;
  /** A sentence saying what the post is about. */
  excerpt?: ReactNode;
  /** "card" for a glass card; a row between chrome lines without it. */
  variant?: 'card' | undefined;
  /** For the card: art or an image first. */
  media?: ReactNode;
  /** The heading's level: h3 without it, under the list's h2. */
  headingLevel?: 'h2' | 'h3' | 'h4' | undefined;
}

/**
 * `<article class="lue-post">` - a journal post in a list: category and date, a linked title and an excerpt.
 * Contract: apps/docs/contracts/post-item.json.
 */
export function PostItem({ href, title, category, published, excerpt, variant, media, headingLevel = 'h3', className, ...props }: PostItemProps): ReactNode {
  return (
    <article {...props} className={cx('lue-post', className)} data-variant={variant}>
      {media}
      {category || published ? (
        <p className="lue-meta">
          {category ? <span className="lue-kicker">{category}</span> : null}
          {published ? <time className="lue-kicker" dateTime={published.dateTime}>{published.label}</time> : null}
        </p>
      ) : null}
      {createElement(headingLevel, { className: 'lue-h3' }, <a href={href}>{title}</a>)}
      {excerpt ? <p className="lue-excerpt">{excerpt}</p> : null}
    </article>
  );
}
