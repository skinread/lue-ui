// Carousel (apps/docs/contracts/carousel.json): parity, buttons hidden without the element, previous and next moving
// one slide (Enter and Space too), aria-disabled at the ends with focus kept, right to left, axe in every theme.
// Chromium, Firefox and WebKit.
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import '@lue-ui/elements/define';
import { Carousel } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, frame, outline, resetMedia, withoutElements } from '../support/browser.js';

const arrow = (d: string) => `<svg class="lue-button__icon" aria-hidden="true" viewBox="0 0 16 16" data-mirror=""><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>`;
const names = ['Loom', 'Kiln', 'Lathe', 'Forge'];
const html = `
<lue-carousel><section aria-label="Projects" aria-roledescription="carousel" class="lue-carousel">
  <div class="lue-carousel__controls">
    <button type="button" aria-label="Previous slide" data-lue-carousel="previous" class="lue-button" data-size="sm" data-icon-only="">${arrow('M10 3L5 8l5 5')}</button>
    <button type="button" aria-label="Next slide" data-lue-carousel="next" class="lue-button" data-size="sm" data-icon-only="">${arrow('M6 3l5 5-5 5')}</button>
  </div>
  <div class="lue-carousel__track">${names.map((n, i) => `<div class="lue-carousel__slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of 4"><a href="#${n}">${n}</a></div>`).join('')}</div>
</section></lue-carousel>`;
const button = (which: string) => $(`[data-lue-carousel="${which}"]`);
const track = () => $('.lue-carousel__track');
const settle = async () => {
  for (let i = 0; i < 5; i++) await frame();
};
const mount = async (markup = html) => {
  await page.viewport(600, 400);
  await emulate({ reducedMotion: 'reduce' });
  document.body.innerHTML = `<main style="inline-size:400px">${markup}</main>`;
  await settle();
};

beforeAll(async () => {
  await customElements.whenDefined('lue-carousel');
});
afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('dir');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Carousel', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(<Carousel aria-label="Projects" slides={names.map((n) => <a key={n} href={`#${n}`}>{n}</a>)} />);
    expect(outline(react)).toEqual(outline(html));
  });

  it('hides its buttons without the element; the track still scrolls', async () => {
    const doc = await withoutElements(`<main style="inline-size:400px">${html}</main>`);
    expect(getComputedStyle(doc.querySelector('.lue-carousel__controls')!).display).toBe('none');
    const plain = doc.querySelector<HTMLElement>('.lue-carousel__track')!;
    expect(plain.scrollWidth).toBeGreaterThan(plain.clientWidth);
  });

  it('moves one slide at a time, and says when it can go no further', async () => {
    await mount();
    expect(button('previous').getAttribute('aria-disabled')).toBe('true');
    await userEvent.click(button('next'));
    await settle();
    const slide = $('.lue-carousel__slide:nth-child(2)').getBoundingClientRect();
    expect(slide.left).toBeCloseTo(track().getBoundingClientRect().left, 0);
    expect(button('previous').getAttribute('aria-disabled')).toBe('false');
    button('next').focus();
    for (let i = 0; i < 4; i++) {
      await userEvent.keyboard('{Enter}');
      await settle();
    }
    expect(button('next').getAttribute('aria-disabled')).toBe('true');
    expect(document.activeElement).toBe(button('next'));
    button('previous').focus();
    await userEvent.keyboard(' ');
    await settle();
    expect(button('next').getAttribute('aria-disabled')).toBe('false');
  });

  it('moves the right way in right-to-left text', async () => {
    document.documentElement.dir = 'rtl';
    await mount();
    await userEvent.click(button('next'));
    await settle();
    expect(track().scrollLeft).toBeLessThan(0);
    expect(getComputedStyle(button('next').querySelector('svg')!).scale).toBe('-1 1');
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      await mount();
      await expectNoAxeViolations(document.body);
    });
  }
});
