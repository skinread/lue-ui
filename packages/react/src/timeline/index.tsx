import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

/** An entry in a timeline. */
export interface TimelineEntry {
  /** When, as people read it: "2024 - now". */
  when: ReactNode;
  /** When it is a single date or year, its machine-readable form ("2024"); it becomes a `<time datetime>`. */
  dateTime?: string | undefined;
  /** The role or event. */
  title: ReactNode;
  /** A line about it. */
  detail?: ReactNode;
}

export interface TimelineProps extends Omit<ComponentPropsWithRef<'ol'>, 'children'> {
  /** The entries, newest first or oldest first, as the page tells its story. */
  items: TimelineEntry[];
}

/**
 * `<ol class="lue-timeline">` - experience or history, each entry a date, a title and a line of detail. Contract:
 * apps/docs/contracts/timeline.json.
 */
export function Timeline({ items, className, ...props }: TimelineProps): ReactNode {
  return (
    <ol {...props} className={cx('lue-timeline', className)}>
      {items.map((item, i) => (
        <li key={i}>
          {item.dateTime
            ? <time className="lue-kicker lue-timeline__when" dateTime={item.dateTime}>{item.when}</time>
            : <span className="lue-kicker lue-timeline__when">{item.when}</span>}
          <div className="lue-timeline__entry">
            <p className="lue-timeline__title">{item.title}</p>
            {item.detail ? <p className="lue-timeline__detail">{item.detail}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
