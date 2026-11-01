// Kbd (apps/docs/contracts/kbd.json): parity, a monospaced key cap with a visible edge, never a Tab stop, axe in
// every theme. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Kbd } from '@lue-ui/react';
import { $, expectNoAxeViolations, outline, tab } from '../support/browser.js';

const html = '<kbd class="lue-kbd">Ctrl</kbd>';

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
});

describe('Kbd', () => {
  it('renders the same markup from React as the HTML core', () => {
    expect(outline(renderToStaticMarkup(<Kbd>Ctrl</Kbd>))).toEqual(outline(html));
  });

  it('is a monospaced cap with a thicker lower edge, and never a Tab stop', async () => {
    document.body.innerHTML = `<button type="button" class="lue-button" id="a">A</button><p>Press ${html} K</p><button type="button" class="lue-button" id="b">B</button>`;
    const style = getComputedStyle($('kbd'));
    expect(style.fontFamily).toContain('Spline Sans Mono');
    expect(parseFloat(style.borderBlockEndWidth)).toBeGreaterThan(parseFloat(style.borderBlockStartWidth));
    $('#a').focus();
    await tab();
    expect(document.activeElement).toBe($('#b'));
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main><p>Press <kbd class="lue-kbd"><kbd class="lue-kbd">Ctrl</kbd>+<kbd class="lue-kbd">K</kbd></kbd> to search.</p></main>`;
      await expectNoAxeViolations(document.body);
    });
  }
});
