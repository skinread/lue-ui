// Shared helpers for component browser tests (ADR-0005). Every test runs in Chromium, Firefox and WebKit.
import { expect } from 'vitest';
import { commands, server, userEvent } from 'vitest/browser';
import axe from 'axe-core';
import type { MediaEmulation } from '../emulation/commands.js';

declare module 'vitest/browser' {
  interface BrowserCommands {
    emulateMedia: (media: MediaEmulation) => Promise<void>;
  }
}

/** Two animation frames: enough for every engine to restyle and run toggle events. */
export const frame = (): Promise<unknown> => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

/**
 * Emulates media features through Playwright, then waits for a restyle. Playwright's Firefox updates matchMedia for
 * `contrast` but doesn't re-evaluate stylesheets already in the page (a freshly inserted sheet does see it), so there
 * every <style> is re-inserted — a harness gap, not a browser one (checked 2026-10-24, Playwright 1.64).
 */
export async function emulate(media: MediaEmulation): Promise<void> {
  await commands.emulateMedia(media);
  if (server.browser === 'firefox') for (const el of document.querySelectorAll('style')) el.parentNode!.append(el);
  await frame();
}
export const resetMedia = (): Promise<void> =>
  emulate({ colorScheme: 'dark', contrast: 'no-preference', forcedColors: 'none', reducedMotion: 'no-preference' });

/**
 * Focus on the document itself, as on a page that has just loaded, so the next Tab is the page's first stop. Without
 * it, Firefox can begin Tab outside the test's frame when the machine is busy.
 */
export function focusDocument(): void {
  document.body.tabIndex = -1;
  document.body.focus();
}

/** Tab as a keyboard user presses it. WebKit follows macOS, where Tab skips buttons unless Option is held. */
export const tab = (): Promise<void> => (server.browser === 'webkit' ? userEvent.keyboard('{Alt>}{Tab}{/Alt}') : userEvent.tab());
/** Shift+Tab, likewise. */
export const shiftTab = (): Promise<void> =>
  userEvent.keyboard(server.browser === 'webkit' ? '{Shift>}{Alt>}{Tab}{/Alt}{/Shift}' : '{Shift>}{Tab}{/Shift}');

export function $<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing ${selector}`);
  return element;
}

/** axe finds no violations inside `root`. */
export async function expectNoAxeViolations(root: Element = document.body): Promise<void> {
  const result = await axe.run(root, { resultTypes: ['violations'] });
  expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
}

/** The used value of a colour (a token or a system colour), resolved by the browser. */
export function resolveColor(value: string): string {
  const probe = document.createElement('div');
  probe.style.color = value;
  document.body.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

/** A comparable outline of a DOM tree: tags, sorted attributes and trimmed text (for HTML ↔ React parity). */
export function outline(markup: string): unknown {
  const template = document.createElement('template');
  template.innerHTML = markup.trim();
  const walk = (node: Node): unknown => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent!.trim() || null;
    if (!(node instanceof Element)) return null;
    const attributes = [...node.attributes].map((a) => `${a.name}=${a.value}`).sort();
    return { tag: node.localName, attributes, children: [...node.childNodes].map(walk).filter((c) => c !== null) };
  };
  return [...template.content.childNodes].map(walk).filter((c) => c !== null);
}
