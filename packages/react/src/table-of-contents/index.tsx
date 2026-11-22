import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';

export interface TableOfContentsProps extends Omit<ComponentPropsWithRef<'nav'>, 'children' | 'title'> {
  /** The article's sections: in-page links to their headings' ids. */
  items: { href: string; label: ReactNode }[];
  /** The href of the section being read: aria-current="true". */
  current?: string | undefined;
  /** The visible title, which names the navigation ("On this page" by default). */
  title?: ReactNode;
}

/**
 * `<nav class="lue-toc" aria-labelledby>` - an article's sections in a glass panel, named by its visible title.
 * Contract: apps/docs/contracts/table-of-contents.json.
 */
export function TableOfContents({ items, current, title = 'On this page', className, ...props }: TableOfContentsProps): ReactNode {
  const generated = useId().replace(/[^\w-]/g, '');
  const id = props.id ? `${props.id}-title` : `toc${generated}`;
  return (
    <nav {...props} className={cx('lue-toc', className)} aria-labelledby={id}>
      <p className="lue-kicker" id={id}>{title}</p>
      <ol>
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} aria-current={item.href === current ? 'true' : undefined}>{item.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
