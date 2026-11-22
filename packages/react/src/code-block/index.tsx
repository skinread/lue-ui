import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface CodeBlockProps extends Omit<ComponentPropsWithRef<'figure'>, 'title'> {
  /** The language, named in the caption ("CSS"). */
  language: ReactNode;
  /** What the code is, at the other end of the caption. */
  title?: ReactNode;
}

/**
 * `<figure class="lue-code">` - code (the children) in a glass panel with a caption naming its language. The
 * `<pre>` is focusable so a wide block scrolls from the keyboard. Contract: apps/docs/contracts/code-block.json.
 */
export function CodeBlock({ language, title, className, children, ...props }: CodeBlockProps): ReactNode {
  return (
    <figure {...props} className={cx('lue-code', className)}>
      <figcaption>
        <span>{language}</span>
        {title ? <span>{title}</span> : null}
      </figcaption>
      <pre tabIndex={0}><code>{children}</code></pre>
    </figure>
  );
}

export interface CodeTokenProps extends ComponentPropsWithRef<'span'> {
  /** What the token is: a property name, or a comment. */
  kind: 'property' | 'comment';
}

/** `<span class="lue-code__token">` - a highlighted token in a `<CodeBlock>`. */
export function CodeToken({ kind, className, ...props }: CodeTokenProps): ReactNode {
  return <span {...props} className={cx('lue-code__token', className)} data-kind={kind} />;
}
