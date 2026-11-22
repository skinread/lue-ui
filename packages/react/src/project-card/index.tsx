import { createElement, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';

export interface ProjectCardProps extends Omit<ComponentPropsWithRef<'article'>, 'title' | 'children'> {
  /** The case study's address; its link covers the whole card. */
  href: string;
  /** The project's name: the heading and the link's text. */
  title: ReactNode;
  /** Art or an image first: a `<Media>` frame, or an `<img>` with alt text. */
  media?: ReactNode;
  /** Short facts above the title, such as the client and the year. */
  meta?: ReactNode[] | undefined;
  /** One line on the problem and what changed. */
  excerpt?: ReactNode;
  /** The disciplines, as tags. */
  tags?: ReactNode[] | undefined;
  /** The tag list's name, translated ("Disciplines" by default). */
  tagsLabel?: string | undefined;
  /** The heading's level: h3 without it, under the section's h2. */
  headingLevel?: 'h2' | 'h3' | 'h4' | undefined;
}

/**
 * `<article class="lue-project">` - a piece of work whose title links to it, over the whole card. One link per card.
 * Contract: apps/docs/contracts/project-card.json.
 */
export function ProjectCard({ href, title, media, meta, excerpt, tags, tagsLabel = 'Disciplines', headingLevel = 'h3', className, ...props }: ProjectCardProps): ReactNode {
  return (
    <article {...props} className={cx('lue-project', className)}>
      {media}
      <div className="lue-project__body">
        {meta?.length ? <p className="lue-meta">{meta.map((m, i) => <span key={i} className="lue-kicker">{m}</span>)}</p> : null}
        {createElement(headingLevel, { className: 'lue-h3' }, <a href={href}>{title}</a>)}
        {excerpt ? <p className="lue-excerpt">{excerpt}</p> : null}
        {tags?.length ? (
          <ul className="lue-tags" aria-label={tagsLabel}>
            {tags.map((t, i) => <li key={i}><span className="lue-tag">{t}</span></li>)}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
