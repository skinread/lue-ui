import { createElement, useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';

export interface MediaTextProps extends Omit<ComponentPropsWithRef<'section'>, 'title'> {
  /** The passage's heading, which also names the section. */
  title: ReactNode;
  /** The figure: a `<Figure>`. */
  media: ReactNode;
  /** A short line above the heading. */
  kicker?: ReactNode;
  /** Buttons or links after the text. */
  actions?: ReactNode;
  /** "end" puts the figure after the text, in reading order too; first without it. */
  mediaPosition?: 'start' | 'end' | undefined;
  /** The heading's level: h2 without it. */
  headingLevel?: 'h2' | 'h3' | undefined;
}

/**
 * `<section class="lue-split" aria-labelledby>` - a figure beside a short passage (the children); they stack when
 * narrow. Contract: apps/docs/contracts/media-text.json.
 */
export function MediaText({ title, media, kicker, actions, mediaPosition = 'start', headingLevel = 'h2', className, children, ...props }: MediaTextProps): ReactNode {
  const generated = useId().replace(/[^\w-]/g, '');
  const id = props.id ? `${props.id}-title` : `split${generated}`;
  return (
    <section {...props} className={cx('lue-split', className)} aria-labelledby={id}>
      {mediaPosition === 'start' ? media : null}
      <div className="lue-split__text">
        {kicker ? <p className="lue-kicker">{kicker}</p> : null}
        {createElement(headingLevel, { className: 'lue-h2', id }, title)}
        {children}
        {actions ? <div className="lue-actions">{actions}</div> : null}
      </div>
      {mediaPosition === 'end' ? media : null}
    </section>
  );
}
