import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

type Tone = 'info' | 'warning' | 'success' | 'critical';
const WORDS: Record<Tone, string> = { info: 'Information', warning: 'Warning', success: 'Success', critical: 'Error' };

export interface AlertProps extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'role'> {
  /** Info without it. */
  tone?: Tone | undefined;
  title: ReactNode;
  /** A decorative icon for the tone; the tone word carries the meaning. */
  icon?: ReactNode;
  /** The tone word read before the title (English by default), e.g. "Warning". Translate it here. */
  toneLabel?: string | undefined;
  /** Leave it out for a callout that's there when the page loads. For one added later: "polite" (role="status") or
   *  "assertive" (role="alert", errors only). */
  live?: 'polite' | 'assertive' | undefined;
  children?: ReactNode;
}

/**
 * `<div class="lue-alert">` — an icon, a title and a body on a tinted surface. Not an `<aside>`: inside `<main>`
 * that's a landmark, and it can't take role="status". Contract: apps/docs/contracts/alert.json.
 */
export function Alert({ tone, title, icon, toneLabel, live, className, children, ...props }: AlertProps): ReactNode {
  return (
    <div
      {...props}
      className={cx('lue-alert', className)}
      data-tone={tone}
      role={live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined}
    >
      {icon}
      <p className="lue-alert__title">
        <span className="lue-visually-hidden">{toneLabel ?? WORDS[tone ?? 'info']}: </span>
        {title}
      </p>
      {children ? <div className="lue-alert__body">{children}</div> : null}
    </div>
  );
}
