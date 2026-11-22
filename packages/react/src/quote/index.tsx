import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface QuoteProps extends Omit<ComponentPropsWithRef<'figure'>, 'role'> {
  /** Who said it. */
  name: ReactNode;
  /** Their role and organisation. */
  role?: ReactNode;
  /** A decorative `<Avatar>`, since the name is written beside it. */
  avatar?: ReactNode;
  /** Where the quote comes from, as a URL (the blockquote's `cite`). */
  cite?: string | undefined;
}

/**
 * `<figure class="lue-quote">` - a quotation (the children: inline content, which becomes one paragraph) with a decorative chrome mark and its
 * source in the caption. Real quotes only. Contract: apps/docs/contracts/quote.json.
 */
export function Quote({ name, role, avatar, cite, className, children, ...props }: QuoteProps): ReactNode {
  return (
    <figure {...props} className={cx('lue-quote', className)}>
      <span className="lue-quote__mark lue-chrome-text" aria-hidden="true">{'\u201C'}</span>
      <blockquote cite={cite}><p>{children}</p></blockquote>
      <figcaption>
        {avatar}
        <span className="lue-quote__source">
          <span className="lue-quote__name">{name}</span>
          {role ? <span className="lue-quote__role">{role}</span> : null}
        </span>
      </figcaption>
    </figure>
  );
}
