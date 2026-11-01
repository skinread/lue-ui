// Spinner and Skeleton (apps/docs/contracts/spinner.json): parity, a status with words, slower (not stopped) under
// reduced motion, skeletons hidden from assistive technology and still under reduced motion, never a Tab stop, axe in
// every theme, forced colours. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Skeleton, Spinner } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const spinner = '<span role="status" class="lue-spinner"><span class="lue-visually-hidden">Loading projects</span></span>';
const skeleton = '<span aria-hidden="true" data-shape="circle" class="lue-skeleton"></span>';

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Spinner and Skeleton', () => {
  it('render the same markup from React as the HTML core', () => {
    expect(outline(renderToStaticMarkup(<Spinner label="Loading projects" />))).toEqual(outline(spinner));
    expect(outline(renderToStaticMarkup(<Skeleton shape="circle" />))).toEqual(outline(skeleton));
    expect(outline(renderToStaticMarkup(<Skeleton width="60%" />))).toEqual(outline('<span aria-hidden="true" style="inline-size:60%" class="lue-skeleton"></span>'));
  });

  it('spin, more slowly under reduced motion; skeletons stop', async () => {
    document.body.innerHTML = spinner + skeleton;
    expect(getComputedStyle($('.lue-spinner')).animationDuration).toBe('0.8s');
    expect(getComputedStyle($('.lue-skeleton')).animationName).toBe('lue-shimmer');
    await emulate({ reducedMotion: 'reduce' });
    expect(getComputedStyle($('.lue-spinner')).animationDuration).toBe('2.4s');
    expect(getComputedStyle($('.lue-skeleton')).animationName).toBe('none');
  });

  it('are never a Tab stop', async () => {
    document.body.innerHTML = `<button type="button" class="lue-button" id="a">A</button>${spinner}${skeleton}<button type="button" class="lue-button" id="b">B</button>`;
    $('#a').focus();
    await tab();
    expect(document.activeElement).toBe($('#b'));
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`pass axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main><section aria-busy="true" aria-label="Projects">${spinner}${skeleton}<span class="lue-skeleton" aria-hidden="true"></span></section></main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('keeps a CanvasText arc on a GrayText ring in forced colours', async () => {
    document.body.innerHTML = spinner;
    await emulate({ forcedColors: 'active' });
    const style = getComputedStyle($('.lue-spinner'));
    expect(style.borderBlockStartColor).toBe(resolveColor('CanvasText'));
    expect(style.borderBlockEndColor).toBe(resolveColor('GrayText'));
  });
});
