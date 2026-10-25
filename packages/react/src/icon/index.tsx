import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface IconProps extends Omit<ComponentPropsWithRef<'svg'>, 'aria-label'> {
  /** Leave it out for a decorative icon (hidden from assistive technology). Give it for an icon that means something
   *  on its own; it then has role="img". */
  label?: string | undefined;
  /** Flip the icon in right-to-left text (arrows, chevrons that point along the line). */
  mirror?: boolean | undefined;
}

/**
 * `<svg class="lue-icon">` - sized to the text (1.25em) and drawn in `currentColor`. Pass the paths as children.
 * Contract: apps/docs/contracts/icon.json.
 */
export function Icon({ label, mirror, className, viewBox = '0 0 16 16', ...props }: IconProps): ReactNode {
  return (
    <svg
      {...props}
      className={cx('lue-icon', className)}
      viewBox={viewBox}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      data-mirror={mirror ? '' : undefined}
    />
  );
}
