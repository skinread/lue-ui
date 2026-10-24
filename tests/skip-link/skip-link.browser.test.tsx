// Skip link (apps/docs/contracts/skip-link.json): parity, hidden until focused, the first Tab stop and visible in the
// viewport then, and Enter moves the next Tab into main. Axe in every theme, forced colours. Chromium, Firefox and
// WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { SkipLink } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, frame, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const html = '<a class="lue-skip-link" href="#main">Skip to main content</a>';
const page = `${html}
<header><nav aria-label="Site"><a href="#one" id="nav">Work</a></nav></header>
<main id="main" tabindex="-1"><h1>Title</h1><a href="#two" id="first-in-main">First link in main</a></main>`;
const skip = () => $('.lue-skip-link');
/** The page as it loads: focus on the document, so the first Tab is the page's first stop. */
const load = () => {
  document.body.innerHTML = page;
  document.body.tabIndex = -1;
  document.body.focus();
};

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  document.body.removeAttribute('tabindex');
  history.replaceState(null, '', location.pathname + location.search);
  await resetMedia();
});

describe('Skip link', () => {
  it('renders the same markup from React as the HTML core', () => {
    expect(outline(renderToStaticMarkup(<SkipLink>Skip to main content</SkipLink>))).toEqual(outline(html));
  });

  it('is hidden until it has focus, then shows inside the viewport', async () => {
    load();
    expect(skip().getBoundingClientRect().width).toBeLessThanOrEqual(1);
    await tab();
    expect(document.activeElement).toBe(skip());
    await frame();
    const { top, left, width, height } = skip().getBoundingClientRect();
    expect(width).toBeGreaterThan(100);
    expect(height).toBeGreaterThanOrEqual(24);
    expect(top).toBeGreaterThanOrEqual(0);
    expect(left).toBeGreaterThanOrEqual(0);
  });

  it('moves the next Tab into main', async () => {
    load();
    await tab();
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(location.hash).toBe('#main');
    await tab();
    expect(document.activeElement).toBe($('#first-in-main'));
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}, focused`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = page;
      skip().focus();
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('keeps a visible edge in forced colours', async () => {
    document.body.innerHTML = page;
    skip().focus();
    await emulate({ forcedColors: 'active' });
    expect(getComputedStyle(skip()).borderBlockStartColor).toBe(resolveColor('CanvasText'));
  });
});
