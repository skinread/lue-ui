import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export type DividerProps = ComponentPropsWithRef<'hr'>;

/** `<hr class="lue-divider">`, a thematic break drawn as a fading chrome line. Contract: apps/docs/contracts/divider.json. */
export function Divider({ className, ...props }: DividerProps): ReactNode {
  return <hr {...props} className={cx('lue-divider', className)} />;
}
