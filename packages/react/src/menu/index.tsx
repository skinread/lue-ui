import { createElement, type ComponentPropsWithRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../cx.js';
import { invoker } from '../invoker.js';

export interface MenuProps extends Omit<HTMLAttributes<HTMLElement>, 'popover' | 'role'> {
  /** The menu's id, which its `<MenuTrigger menu>` points at. */
  id: string;
  /** The menu's accessible name, usually the trigger's text. */
  'aria-label'?: string | undefined;
  /** Or the id of the element that names it, usually the trigger. */
  'aria-labelledby'?: string | undefined;
}

/**
 * `<lue-menu popover role="menu">`. The `<lue-menu>` element adds the keyboard model; mount `<LueElements/>` once to
 * register it. Without it, the menu still opens and closes.
 */
export function Menu({ className, ...props }: MenuProps): ReactNode {
  // createElement rather than JSX, so consumers' JSX types aren't augmented with <lue-menu>.
  return createElement('lue-menu', { ...props, popover: '', role: 'menu', className: cx('lue-menu', className) });
}

export interface MenuTriggerProps extends ComponentPropsWithRef<'button'> {
  /** The menu's id. */
  menu: string;
}

/** The button that opens a menu (`command="toggle-popover"`); it also anchors the menu. */
export function MenuTrigger({ menu, className, ...props }: MenuTriggerProps): ReactNode {
  return (
    <button type="button" aria-haspopup="menu" {...props} {...invoker('toggle-popover', menu)} className={cx('lue-button', className)} />
  );
}

export interface MenuItemProps extends Omit<ComponentPropsWithRef<'button'>, 'role' | 'tabIndex'> {
  /** "critical" for a destructive action (Delete); neutral without it. */
  tone?: 'critical' | undefined;
}

/** A menu item: a button with `role="menuitem"`, reached by arrow keys rather than Tab. */
export function MenuItem({ className, tone, ...props }: MenuItemProps): ReactNode {
  return <button type="button" {...props} role="menuitem" tabIndex={-1} data-tone={tone} className={cx('lue-menu__item', className)} />;
}
