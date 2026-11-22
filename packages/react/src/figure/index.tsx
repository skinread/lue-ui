import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface FigureProps extends ComponentPropsWithRef<'figure'> {
  /** What the image shows, or where it comes from. */
  caption?: ReactNode;
}

/**
 * `<figure class="lue-figure">` - an image (an `<img>` with alt text) or a `<Media>` frame, and its caption.
 * Contract: apps/docs/contracts/figure.json.
 */
export function Figure({ caption, className, children, ...props }: FigureProps): ReactNode {
  return (
    <figure {...props} className={cx('lue-figure', className)}>
      {children}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export interface MediaProps extends ComponentPropsWithRef<'div'> {
  /** The frame's aspect ratio, such as "16 / 9" (4 / 3 by default). */
  ratio?: string | undefined;
}

/** `<div class="lue-media">` - a rounded frame with an inner hairline for art or an image. */
export function Media({ ratio, className, style, ...props }: MediaProps): ReactNode {
  return <div {...props} className={cx('lue-media', className)} style={ratio ? { ...style, aspectRatio: ratio } : style} />;
}
