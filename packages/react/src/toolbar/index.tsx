import { createElement, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../cx.js';

export interface ToolbarProps extends Omit<HTMLAttributes<HTMLElement>, 'role'> {
  /** The toolbar's name, e.g. "Text formatting". */
  'aria-label': string;
  orientation?: 'horizontal' | 'vertical' | undefined;
  /** Buttons, toggle buttons, and `<span role="separator">`. */
  children: ReactNode;
}

/**
 * `<lue-roving class="lue-toolbar" role="toolbar">`: one Tab stop, arrow keys between its controls (mount
 * `<LueElements/>` once; without it every control is a Tab stop). Contract: apps/docs/contracts/toolbar.json.
 */
export function Toolbar({ orientation, className, ...props }: ToolbarProps): ReactNode {
  return createElement('lue-roving', {
    ...props,
    role: 'toolbar',
    'aria-orientation': orientation === 'vertical' ? 'vertical' : undefined,
    className: cx('lue-toolbar', className),
  });
}
