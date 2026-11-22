import { createElement, useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';

export interface CtaBandProps extends Omit<ComponentPropsWithRef<'section'>, 'title'> {
  /** What you're asking people to do, as a heading; it names the band. */
  title: ReactNode;
  /** A short line above the heading. */
  kicker?: ReactNode;
  /** What they'll get, and how to stop: "One letter a month. Unsubscribe in one click." */
  lede?: ReactNode;
  /** The heading's level: h2 without it. */
  headingLevel?: 'h2' | 'h3' | undefined;
}

/**
 * `<section class="lue-cta" aria-labelledby>` - a heading, a sentence and a short form or actions (the children) in a
 * glass band. Contract: apps/docs/contracts/cta-band.json.
 */
export function CtaBand({ title, kicker, lede, headingLevel = 'h2', className, children, ...props }: CtaBandProps): ReactNode {
  const generated = useId().replace(/[^\w-]/g, '');
  const id = props.id ? `${props.id}-title` : `cta${generated}`;
  return (
    <section {...props} className={cx('lue-cta', className)} aria-labelledby={id}>
      {kicker ? <p className="lue-kicker">{kicker}</p> : null}
      {createElement(headingLevel, { className: 'lue-h2', id }, title)}
      {lede ? <p className="lue-lede">{lede}</p> : null}
      {children}
    </section>
  );
}
