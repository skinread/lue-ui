import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface AuthorCardProps extends Omit<ComponentPropsWithRef<'section'>, 'children'> {
  /** The author's name. */
  name: ReactNode;
  /** One or two lines about them. */
  bio?: ReactNode;
  /** A decorative `<Avatar>`, since the name is written beside it. */
  avatar?: ReactNode;
  /** A link to more of their posts: a small button link. */
  action?: ReactNode;
  /** The region's name, translated ("About the author" by default). */
  'aria-label'?: string | undefined;
}

/**
 * `<section class="lue-author" aria-label="About the author">` - avatar, name, bio and a link, in a glass panel.
 * Contract: apps/docs/contracts/author-card.json.
 */
export function AuthorCard({ name, bio, avatar, action, 'aria-label': label = 'About the author', className, ...props }: AuthorCardProps): ReactNode {
  return (
    <section {...props} className={cx('lue-author', className)} aria-label={label}>
      {avatar}
      <div className="lue-author__text">
        <p className="lue-author__name">{name}</p>
        {bio ? <p className="lue-author__bio">{bio}</p> : null}
      </div>
      {action}
    </section>
  );
}
