// Shared gates for the content blocks (ADR-0011): HTML ↔ React parity, axe in every theme, 320 px reflow, and - for
// glass blocks - the opaque surface under increased contrast and Canvas in forced colours. Each block's own test file
// adds its keyboard map and its behaviour, so check-contracts finds the keys it presses there.
import { afterEach, expect, it } from 'vitest';
import { page, server } from 'vitest/browser';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { $, emulate, expectNoAxeViolations, frame, outline, resetMedia, resolveColor } from './browser.js';

export interface BlockGates {
  /** The HTML core's markup. */
  html: string;
  /** The React adapter rendering the same markup. */
  react: ReactElement;
  /** Where the block sits on a page, for axe (inside <main> by default). */
  page?: (html: string) => string;
  /** The glass surface's selector, for the contrast and forced-colours checks. */
  glass?: string;
}

export const inMain = (html: string): string => `<main>${html}</main>`;

/** Clears the page after each test: theme, markup, hash and media emulation. */
export function cleanUp(): void {
  afterEach(async () => {
    document.documentElement.removeAttribute('data-theme');
    document.body.replaceChildren();
    history.replaceState(null, '', location.pathname + location.search);
    await resetMedia();
  });
}

export function blockGates({ html, react, page: place = inMain, glass }: BlockGates): void {
  it('renders the same markup from React as the HTML core', () => {
    expect(outline(renderToStaticMarkup(react))).toEqual(outline(html));
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = place(html);
      await expectNoAxeViolations(document.body);
    });
  }

  it('reflows at 320 px with no sideways scrolling (WCAG 1.4.10)', async () => {
    const [width, height] = [window.innerWidth, window.innerHeight];
    document.body.innerHTML = place(html);
    await page.viewport(320, 640);
    await frame();
    try {
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
    } finally {
      await page.viewport(width, height);
    }
  });

  if (glass) {
    it('turns opaque in increased contrast', async () => {
      document.documentElement.setAttribute('data-theme', 'dark-more');
      document.body.innerHTML = place(html);
      const style = getComputedStyle($(glass));
      expect(style.backgroundColor).toBe(resolveColor('var(--lue-color-bg-surface)'));
      expect(style.backgroundImage).toBe('none');
    });

    it.skipIf(server.browser === 'webkit')('is Canvas with a CanvasText border in forced colours', async () => {
      document.body.innerHTML = place(html);
      await emulate({ forcedColors: 'active' });
      expect(getComputedStyle($(glass)).backgroundColor).toBe(resolveColor('Canvas'));
      expect(getComputedStyle($(glass)).borderBlockStartColor).toBe(resolveColor('CanvasText'));
    });
  }
}

/** Puts `html` between two links and focuses the first; Tab from there should reach the second when nothing in the
 *  block takes focus (`document.activeElement.id === 'after'`). */
export function focusBefore(html: string): void {
  document.body.innerHTML = `<a href="#before" id="before">Before</a>${html}<a href="#after" id="after">After</a>`;
  $('#before').focus();
}

/** The element an element's aria-labelledby points at, by its text. */
export function labelOf(element: Element): string {
  const ids = element.getAttribute('aria-labelledby')?.split(/\s+/) ?? [];
  return ids.map((id) => document.getElementById(id)?.textContent ?? '').join(' ').trim();
}
