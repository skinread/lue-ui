import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export type KbdProps = ComponentPropsWithRef<'kbd'>;

/** `<kbd class="lue-kbd">`, a key cap. Contract: apps/docs/contracts/kbd.json. */
export function Kbd({ className, ...props }: KbdProps): ReactNode {
  return <kbd {...props} className={cx('lue-kbd', className)} />;
}
