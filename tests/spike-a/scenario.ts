// The behaviours Spike A must prove in every engine and on every path (HTML, React define-before, React define-after).
import { expect } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import axe from 'axe-core';
import { items } from './fixture-html.js';

const $ = <T extends Element = HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing ${selector}`);
  return element;
};
export const parts = () => ({
  opener: $<HTMLButtonElement>('#open-dialog'),
  dialog: $<HTMLDialogElement>('#project'),
  trigger: $<HTMLButtonElement>('#actions-button'),
  menu: $('#actions'),
  item: (name: string) => [...document.querySelectorAll<HTMLElement>('#actions [role="menuitem"]')].find((i) => i.textContent === name)!,
});
const isOpen = (popover: Element) => popover.matches(':popover-open');
const focused = () => document.activeElement;
const label = () => document.activeElement?.textContent ?? '';

/**
 * Tab as a keyboard user would press it. WebKit follows macOS's default, where Tab skips buttons and links and
 * Option+Tab reaches them.
 */
export const tab = () => (server.browser === 'webkit' ? userEvent.keyboard('{Alt>}{Tab}{/Alt}') : userEvent.tab());

/** Waits for the browser's async work (toggle events, focus steps) to settle. */
export const settle = () => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));

/**
 * Opens the dialog, then the menu, by pointer (clicks) or by keyboard (focus each button, press Enter). Focus-return
 * checks use the keyboard: WebKit doesn't focus a button on click, so a pointer-opened dialog has no button to return
 * focus to.
 */
export async function openDialogAndMenu(via: 'pointer' | 'keyboard' = 'keyboard'): Promise<void> {
  const { opener, dialog, trigger, menu } = parts();
  if (via === 'pointer') {
    await userEvent.click(opener);
  } else {
    opener.focus();
    await userEvent.keyboard('{Enter}');
  }
  await settle();
  expect(dialog.matches(':modal'), 'dialog opens modally from command="show-modal"').toBe(true);
  expect(dialog.contains(focused()) || focused() === dialog, 'focus moves into the dialog').toBe(true);
  if (via === 'pointer') {
    await userEvent.click(trigger);
  } else {
    trigger.focus();
    await userEvent.keyboard('{Enter}');
  }
  await settle();
  expect(isOpen(menu), 'menu opens from command="toggle-popover"').toBe(true);
}

/** The keyboard model: first item on open, arrows wrap, Home/End, typeahead. */
export async function keyboardModel(): Promise<void> {
  expect(label(), 'opening focuses the first item').toBe(items[0]);
  await userEvent.keyboard('{ArrowDown}');
  expect(label()).toBe(items[1]);
  await userEvent.keyboard('{End}');
  expect(label()).toBe(items.at(-1));
  await userEvent.keyboard('{ArrowDown}');
  expect(label(), 'ArrowDown wraps to the first item').toBe(items[0]);
  await userEvent.keyboard('{ArrowUp}');
  expect(label(), 'ArrowUp wraps to the last item').toBe(items.at(-1));
  await userEvent.keyboard('{Home}');
  expect(label()).toBe(items[0]);
  await userEvent.keyboard('d');
  expect(label(), 'typeahead finds the next item starting with d').toBe('Duplicate');
  await userEvent.keyboard('d');
  expect(label(), 'repeating the character cycles').toBe('Download');
  await userEvent.keyboard('a');
  await new Promise((resolve) => setTimeout(resolve, 600));
  await userEvent.keyboard('a');
  expect(label(), 'a fresh search after the timeout').toBe('Archive');
}

/** The menu sits below its trigger, anchored by the implicit popover anchor. */
export function anchoring(): void {
  const { trigger, menu } = parts();
  const t = trigger.getBoundingClientRect();
  const m = menu.getBoundingClientRect();
  expect(m.top, 'menu is below the trigger').toBeGreaterThanOrEqual(t.bottom - 1);
  expect(m.top - t.bottom, 'and close to it').toBeLessThan(24);
  expect(Math.abs(m.left - t.left), 'aligned to the trigger’s inline start').toBeLessThan(2);
}

/** Esc closes only the topmost layer, and focus goes back one step each time. */
export async function escapeStacking(): Promise<void> {
  const { opener, dialog, trigger, menu } = parts();
  await openDialogAndMenu();
  await userEvent.keyboard('{Escape}');
  await settle();
  expect(isOpen(menu), 'first Esc closes the menu').toBe(false);
  expect(dialog.open, 'and leaves the dialog open').toBe(true);
  expect(focused(), 'focus returns to the menu trigger').toBe(trigger);
  await userEvent.keyboard('{Escape}');
  await settle();
  expect(dialog.open, 'second Esc closes the dialog').toBe(false);
  expect(focused(), 'focus returns to the dialog opener').toBe(opener);
}

/** Choosing an item runs it, closes the menu and returns focus to the trigger. */
export async function activation(chosen: string[]): Promise<void> {
  const { dialog, trigger, menu } = parts();
  await userEvent.keyboard('{ArrowDown}{Enter}');
  await settle();
  expect(chosen.at(-1), 'Enter activates the item').toBe(items[1]);
  expect(isOpen(menu), 'the menu closes').toBe(false);
  expect(dialog.open, 'the dialog stays open').toBe(true);
  expect(focused(), 'focus returns to the trigger').toBe(trigger);
}

/** Tab closes the menu and moves on through the dialog. */
export async function tabOut(): Promise<void> {
  const { dialog, trigger, menu } = parts();
  await openDialogAndMenu();
  await tab();
  await settle();
  expect(isOpen(menu), 'Tab closes the menu').toBe(false);
  expect(dialog.contains(focused()), 'focus stays inside the modal dialog').toBe(true);
  expect(focused(), 'and moves past the trigger').not.toBe(trigger);
}

/** axe finds nothing wrong in the open dialog with its open menu. */
export async function noAxeViolations(): Promise<void> {
  const result = await axe.run(document.body, { resultTypes: ['violations'] });
  expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
}

export async function closeAll(): Promise<void> {
  const { dialog, menu } = parts();
  if (isOpen(menu)) menu.hidePopover();
  if (dialog.open) dialog.close();
  await settle();
}
