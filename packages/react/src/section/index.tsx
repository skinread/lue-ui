import { createElement, useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';

export interface SectionProps extends Omit<ComponentPropsWithRef<'section'>, 'title'> {
  /** The section's heading, which also names it. Leave it out for a section without a head. */
  title?: ReactNode;
  /** The heading's level: h2 without it. */
  headingLevel?: 'h2' | 'h3' | undefined;
  /** At the end of the head, beside the heading: a link to everything in the section, for example. */
  action?: ReactNode;
}

/**
 * `<section class="lue-section">` - a part of a page with vertical space around it, and a head (`.lue-section__head`)
 * holding its heading and an action. Named by its heading. Contract: apps/docs/contracts/section.json.
 */
export function Section({ title, headingLevel = 'h2', action, className, children, ...props }: SectionProps): ReactNode {
  const generated = useId().replace(/[^\w-]/g, '');
  const id = props.id ? `${props.id}-title` : `section${generated}`;
  return (
    <section {...props} className={cx('lue-section', className)} aria-labelledby={title ? id : undefined}>
      {title || action ? (
        <div className="lue-section__head">
          {title ? createElement(headingLevel, { className: 'lue-h2', id }, title) : null}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export interface WrapProps extends ComponentPropsWithRef<'div'> {
  /** The element: a div without it, or main, header or footer. */
  as?: 'div' | 'main' | 'header' | 'footer' | undefined;
}

/** `.lue-wrap` - the page's column: at most 75rem wide, centred, with the gutter at each side. */
export function Wrap({ as = 'div', className, ...props }: WrapProps): ReactNode {
  return createElement(as, { ...props, className: cx('lue-wrap', className) });
}

export type ActionsProps = ComponentPropsWithRef<'div'>;

/** `<div class="lue-actions">` - a row of buttons or links that wraps. */
export function Actions({ className, ...props }: ActionsProps): ReactNode {
  return <div {...props} className={cx('lue-actions', className)} />;
}
