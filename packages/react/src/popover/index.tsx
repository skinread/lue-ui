import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Button, type ButtonProps } from '../button/index.js';
import { cx } from '../cx.js';
import { invoker } from '../invoker.js';

export interface PopoverProps extends Omit<ComponentPropsWithRef<'div'>, 'popover'> {
  id: string;
}

/**
 * `<div class="lue-popover" popover>` — non-modal content anchored to the button that opens it. Esc and light
 * dismiss close it (the browser's). Render it right after its trigger: popovers are never portalled. Contract:
 * apps/docs/contracts/popover.json.
 */
export function Popover({ className, ...props }: PopoverProps): ReactNode {
  return <div {...props} popover="auto" className={cx('lue-popover', className)} />;
}

export interface PopoverTriggerProps extends Omit<ButtonProps, 'popover'> {
  /** The popover's id. */
  target: string;
}

/** A Button that opens and closes a popover (`command="toggle-popover"`), and anchors it. */
export function PopoverTrigger({ target, ...props }: PopoverTriggerProps): ReactNode {
  return <Button {...props} {...invoker('toggle-popover', target)} />;
}

export interface ToggletipProps extends Omit<ComponentPropsWithRef<'span'>, 'popover'> {
  id: string;
  /** The button's accessible name, e.g. "More about delivery". */
  label: string;
  /** The help text. */
  children: ReactNode;
}

/**
 * A small "?" button and the help it shows on click (`<span class="lue-popover" data-variant="tip" popover>`, a span so
 * it can sit inside a paragraph or label). Not a hover tooltip: it works by touch and keyboard. Contract: apps/docs/contracts/toggletip.json.
 */
export function Toggletip({ id, label, className, children, ...props }: ToggletipProps): ReactNode {
  return (
    <>
      <Button size="sm" iconOnly aria-label={label} {...invoker('toggle-popover', id)}>
        <svg className="lue-button__icon" aria-hidden="true" viewBox="0 0 16 16">
          <path d="M6 6a2 2 0 1 1 2.5 1.94c-.3.08-.5.35-.5.66V9.5M8 11.5v.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </Button>
      <span {...props} id={id} popover="auto" data-variant="tip" className={cx('lue-popover', className)}>
        {children}
      </span>
    </>
  );
}
