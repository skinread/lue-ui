import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface TooltipProps extends Omit<ComponentPropsWithRef<'span'>, 'popover' | 'role'> {
  id: string;
  /** A short description of the trigger; nothing anyone must act on (that belongs in a Toggletip). */
  children: ReactNode;
}

/**
 * `<span class="lue-tooltip" popover="manual" role="tooltip">`. Render it right after its trigger, and spread
 * `tooltipTrigger(id)` onto the trigger. Shown by the `data-lue-tooltip` behaviour (mount `<LueElements/>` once).
 * Contract: apps/docs/contracts/tooltip.json.
 */
export function Tooltip({ className, ...props }: TooltipProps): ReactNode {
  return <span {...props} popover="manual" role="tooltip" className={cx('lue-tooltip', className)} />;
}

/** The trigger's attributes: it's described by the tooltip, and the behaviour finds the tooltip through it. */
export function tooltipTrigger(id: string): { 'aria-describedby': string; 'data-lue-tooltip': string } {
  return { 'aria-describedby': id, 'data-lue-tooltip': id };
}
