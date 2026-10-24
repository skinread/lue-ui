'use client';
import { useLayoutEffect, useRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import { Button, type ButtonProps } from '../button/index.js';
import { cx } from '../cx.js';
import { invoker } from '../invoker.js';

// Bundlers replace `process.env.NODE_ENV`, as they must for React itself; the warning is stripped from production builds.
declare const process: { env: { NODE_ENV?: string } };
let warnedUncontrolledClose = false;

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

/**
 * `<dialog class="lue-dialog">` — modal dialog. Markup matches the HTML core exactly. Contract:
 * apps/docs/contracts/dialog.json. Controlled use needs `onOpenChange` as well as `open`.
 */
export function Dialog({ className, closedby = 'any', open, onOpenChange, onClose, ref, ...props }: DialogProps): ReactNode {
  const local = useRef<HTMLDialogElement>(null);
  if (process.env.NODE_ENV !== 'production' && open !== undefined && !onOpenChange && !warnedUncontrolledClose) {
    warnedUncontrolledClose = true;
    console.warn(
      'Lue UI Dialog: `open` is set without `onOpenChange`. The dialog closes itself on Esc, light dismiss and ' +
        '`<form method="dialog">`; without onOpenChange your state stays `true` and the next `open` does nothing.',
    );
  }
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

export interface DialogTriggerProps extends ButtonProps {
  /** The dialog's id. */
  dialog: string;
}

/** A Button that opens a dialog with `command="show-modal"` — no script. Takes every Button prop. */
export function DialogTrigger({ dialog, ...props }: DialogTriggerProps): ReactNode {
  return <Button {...props} {...invoker('show-modal', dialog)} />;
}

export interface DrawerProps extends DialogProps {
  /** The edge it docks to; the inline end by default. */
  side?: 'inline-end' | 'inline-start' | 'block-end' | undefined;
}

/**
 * A Dialog docked to an edge (`data-side`), sliding in from it. Everything else is Dialog's: open it with a
 * `<DialogTrigger>` or `open`. Contract: apps/docs/contracts/drawer.json.
 */
export function Drawer({ side = 'inline-end', ...props }: DrawerProps): ReactNode {
  return <Dialog {...props} data-side={side} />;
}
