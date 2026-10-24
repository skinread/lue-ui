import { createElement, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';

export interface CardProps extends ComponentPropsWithRef<'article'> {
  /** article (default) for something that stands alone, section for a part of the page, div for neither. */
  as?: 'article' | 'section' | 'div' | 'li' | undefined;
}

/** `<article class="lue-card">`, overlay glass. Contract: apps/docs/contracts/card.json. */
export function Card({ as = 'article', className, ...props }: CardProps): ReactNode {
  return createElement(as, { ...props, className: cx('lue-card', className) });
}

export type CardLinkProps = ComponentPropsWithRef<'a'>;

/** The card's one main link, usually inside its heading: it covers the whole card, and the card shows its focus. */
export function CardLink({ className, ...props }: CardLinkProps): ReactNode {
  return <a {...props} className={cx('lue-card__link', className)} />;
}
