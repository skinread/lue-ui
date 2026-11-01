import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface SpinnerProps extends Omit<ComponentPropsWithRef<'span'>, 'children' | 'role'> {
  /** What's happening, read by assistive technology ("Loading" by default). Translate it here. */
  label?: string | undefined;
}

/**
 * `<span class="lue-spinner" role="status">` with its words visually hidden. Put `aria-busy="true"` on the region that's
 * loading. Contract: apps/docs/contracts/spinner.json.
 */
export function Spinner({ label = 'Loading', className, ...props }: SpinnerProps): ReactNode {
  return (
    <span {...props} role="status" className={cx('lue-spinner', className)}>
      <span className="lue-visually-hidden">{label}</span>
    </span>
  );
}

export interface SkeletonProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** A line of text by default; circle for an avatar. */
  shape?: 'circle' | undefined;
  /** The placeholder's width, e.g. "60%" or "12rem". */
  width?: string | undefined;
}

/** `<span class="lue-skeleton" aria-hidden="true">`, a placeholder while content loads. */
export function Skeleton({ shape, width, className, style, ...props }: SkeletonProps): ReactNode {
  const sized: CSSProperties | undefined = width ? { ...style, inlineSize: width } : style;
  return <span {...props} aria-hidden="true" data-shape={shape} style={sized} className={cx('lue-skeleton', className)} />;
}
