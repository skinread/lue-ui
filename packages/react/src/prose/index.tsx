import { createElement, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';

export interface ProseProps extends ComponentPropsWithRef<'div'> {
  /** The element: a div without it, or the article or section the text belongs to. */
  as?: 'div' | 'article' | 'section' | undefined;
}

/**
 * `<div class="lue-prose">` - an article's body: a readable measure, spacing between paragraphs, headings and lists.
 * The text styles (`lue-display`, `lue-title`, `lue-h2`, `lue-h3`, `lue-lede`, `lue-dek`, `lue-kicker`, `lue-meta`,
 * `lue-excerpt`) are classes on native elements. Contract: apps/docs/contracts/prose.json.
 */
export function Prose({ as = 'div', className, ...props }: ProseProps): ReactNode {
  return createElement(as, { ...props, className: cx('lue-prose', className) });
}
