import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Neutral without it. */
  variant?: 'primary' | 'danger' | 'quiet' | undefined;
  /** Medium without it. */
  size?: 'sm' | 'lg' | undefined;
  /** A square button holding only an icon. Give it an `aria-label` (or `aria-labelledby`). */
  iconOnly?: boolean | undefined;
  /** Makes it a toggle button (`aria-pressed`). Leave it out for an ordinary button. */
  pressed?: boolean | undefined;
}

/**
 * `<button class="lue-button">` - the same markup as the HTML core. `type` defaults to `"button"`; pass
 * `type="submit"` for a form's submit button. Contract: apps/docs/contracts/button.json.
 */
export function Button({ variant, size, iconOnly, pressed, className, type = 'button', ...props }: ButtonProps): ReactNode {
  return (
    <button
      type={type}
      {...props}
      className={cx('lue-button', className)}
      data-variant={variant}
      data-size={size}
      data-icon-only={iconOnly ? '' : undefined}
      aria-pressed={pressed}
    />
  );
}
