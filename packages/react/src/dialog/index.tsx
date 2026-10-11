'use client';
import { useLayoutEffect, useRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';
import { invoker } from '../invoker.js';

export interface DialogProps extends Omit<ComponentPropsWithRef<'dialog'>, 'open'> {
  /** Light dismiss. `any` closes on a backdrop click as well as Esc (an enhancement: Safari has Esc only). */
  closedby?: 'any' | 'closerequest' | 'none' | undefined;
  /**
   * Controlled open state. Opens with `showModal()` — never React's `open` prop, which opens a dialog non-modally.
   * Leave it out to open the dialog with a `<DialogTrigger>` instead.
   */
  open?: boolean | undefined;
  /** Called when the dialog closes itself (Esc, light dismiss or a `method="dialog"` form). */
  onOpenChange?: ((open: boolean) => void) | undefined;
}

/** `<dialog class="lue-dialog">` — modal dialog. Markup matches the HTML core exactly. */
export function Dialog({ className, closedby = 'any', open, onOpenChange, onClose, ref, ...props }: DialogProps): ReactNode {
  const local = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const dialog = local.current;
    if (open === undefined || !dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      {...props}
      {...{ closedby }}
      ref={(node) => {
        local.current = node;
        if (typeof ref === 'function') return ref(node);
        if (ref) ref.current = node;
      }}
      className={cx('lue-dialog', className)}
      onClose={(event) => {
        onClose?.(event);
        onOpenChange?.(false);
      }}
    />
  );
}

export interface DialogTriggerProps extends ComponentPropsWithRef<'button'> {
  /** The dialog's id. */
  dialog: string;
}

/** A button that opens a dialog with `command="show-modal"` — no script. */
export function DialogTrigger({ dialog, className, ...props }: DialogTriggerProps): ReactNode {
  return <button type="button" {...props} {...invoker('show-modal', dialog)} className={cx('lue-button', className)} />;
}
