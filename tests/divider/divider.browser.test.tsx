// Divider (apps/docs/contracts/divider.json): parity, a separator that's never a Tab stop, a visible line in every
// theme and in forced colours, axe. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Divider } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const html = '<hr class="lue-divider">';

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Divider', () => {
  it('renders the same markup from React as the HTML core', () => {
    expect(outline(renderToStaticMarkup(<Divider />))).toEqual(outline(html));
  });

  it('is one pixel tall and never a Tab stop', async () => {
    document.body.innerHTML = `<button type="button" class="lue-button" id="a">A</button>${html}<button type="button" class="lue-button" id="b">B</button>`;
    expect($('hr').getBoundingClientRect().height).toBe(1);
    $('#a').focus();
    await tab();
    expect(document.activeElement).toBe($('#b'));
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main><p>Before</p>${html}<p>After</p></main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('is a CanvasText line in forced colours', async () => {
    document.body.innerHTML = html;
    await emulate({ forcedColors: 'active' });
    const style = getComputedStyle($('hr'));
    expect(style.borderBlockStartStyle).toBe('solid');
    expect(style.borderBlockStartColor).toBe(resolveColor('CanvasText'));
  });
});
