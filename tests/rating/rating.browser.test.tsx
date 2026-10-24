// Rating (apps/docs/contracts/rating.json): parity, the score in words with the stars hidden from assistive
// technology, the stars' size, never a Tab stop, axe in every theme, forced colours. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Rating } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const html = '<span class="lue-rating"><span class="lue-rating__stars" aria-hidden="true" style="--lue-rating-value:4.5;--lue-rating-max:5"></span><span class="lue-rating__text">4.5 out of 5</span></span>';

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Rating', () => {
  it('renders the same markup from React as the HTML core', () => {
    expect(outline(renderToStaticMarkup(<Rating value={4.5} />))).toEqual(outline(html));
    expect(renderToStaticMarkup(<Rating value={3} max={10} text="3 sur 10" hideText />)).toContain('<span class="lue-visually-hidden">3 sur 10</span>');
  });

  it('says the score in words; the stars are decoration, 1.2em each', () => {
    document.body.innerHTML = `<p style="font-size:20px">${html}</p>`;
    expect($('.lue-rating').textContent).toBe('4.5 out of 5');
    const stars = $('.lue-rating__stars');
    expect(stars.getAttribute('aria-hidden')).toBe('true');
    expect(stars.getBoundingClientRect().width).toBeCloseTo(5 * 24, 0);
  });

  it('is never a Tab stop', async () => {
    document.body.innerHTML = `<button type="button" class="lue-button" id="a">A</button>${html}<button type="button" class="lue-button" id="b">B</button>`;
    $('#a').focus();
    await tab();
    expect(document.activeElement).toBe($('#b'));
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main><p>Loom ${html}</p></main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('draws the stars in system colours in forced colours', async () => {
    document.body.innerHTML = html;
    await emulate({ forcedColors: 'active' });
    const image = getComputedStyle($('.lue-rating__stars')).backgroundImage;
    expect(image).toContain(resolveColor('CanvasText'));
    expect(image).toContain(resolveColor('GrayText'));
  });
});
