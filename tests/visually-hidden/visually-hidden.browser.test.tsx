// Visually hidden (apps/docs/contracts/visually-hidden.json): parity, clipped to nothing yet still in the accessible
// name, and shown while something inside it has focus. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { VisuallyHidden } from '@lue-ui/react';
import { $, expectNoAxeViolations, frame, outline, tab } from '../support/browser.js';

const html = '<span class="lue-visually-hidden">, opens in a new tab</span>';

afterEach(() => {
  document.body.replaceChildren();
});

describe('Visually hidden', () => {
  it('renders the same markup from React as the HTML core', () => {
    expect(outline(renderToStaticMarkup(<VisuallyHidden>, opens in a new tab</VisuallyHidden>))).toEqual(outline(html));
  });

  it('takes no space but stays in the accessible name', async () => {
    document.body.innerHTML = `<main><p><a href="#x" id="link">Pricing${html}</a></p></main>`;
    const hidden = $('.lue-visually-hidden');
    const { width, height } = hidden.getBoundingClientRect();
    expect(width).toBeLessThanOrEqual(1);
    expect(height).toBeLessThanOrEqual(1);
    expect(getComputedStyle(hidden).clipPath).toBe('inset(50%)');
    expect($('#link').textContent).toBe('Pricing, opens in a new tab');
    await expectNoAxeViolations(document.body);
  });

  it('shows while something inside it has focus', async () => {
    document.body.innerHTML = '<span class="lue-visually-hidden"><a href="#x" id="inner">Back to top</a></span>';
    await tab();
    await frame();
    expect(document.activeElement).toBe($('#inner'));
    expect(getComputedStyle($('.lue-visually-hidden')).clipPath).toBe('none');
    expect($('#inner').getBoundingClientRect().width).toBeGreaterThan(20);
  });
});
