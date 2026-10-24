// Icon (apps/docs/contracts/icon.json): parity, hidden from assistive technology by default, an image with a name when
// labelled, sized to the text, mirrored in right-to-left text only when asked, and the text colour in forced colours.
// Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Icon } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, frame, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const path = '<path d="M2 8h12"></path>';
const decorative = `<svg class="lue-icon" viewBox="0 0 16 16" aria-hidden="true">${path}</svg>`;
const labelled = `<svg class="lue-icon" viewBox="0 0 16 16" role="img" aria-label="Warning">${path}</svg>`;
const mirrored = `<svg class="lue-icon" viewBox="0 0 16 16" aria-hidden="true" data-mirror="">${path}</svg>`;

afterEach(async () => {
  document.documentElement.removeAttribute('dir');
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Icon', () => {
  it('renders the same markup from React as the HTML core', () => {
    const d = <path d="M2 8h12" />;
    expect(outline(renderToStaticMarkup(<Icon>{d}</Icon>))).toEqual(outline(decorative));
    expect(outline(renderToStaticMarkup(<Icon label="Warning">{d}</Icon>))).toEqual(outline(labelled));
    expect(outline(renderToStaticMarkup(<Icon mirror>{d}</Icon>))).toEqual(outline(mirrored));
  });

  it('is 1.25em square and drawn in the text colour', () => {
    document.body.innerHTML = `<p style="font-size:16px;color:rgb(10, 20, 30)">${decorative}</p>`;
    const { width, height } = $('svg').getBoundingClientRect();
    expect([width, height]).toEqual([20, 20]);
    expect(getComputedStyle($('svg')).fill).toBe('rgb(10, 20, 30)');
  });

  it('flips in right-to-left text only when marked', async () => {
    document.body.innerHTML = `${decorative}${mirrored}`;
    document.documentElement.dir = 'rtl';
    await frame();
    const [plain, flipped] = document.querySelectorAll('svg');
    expect(getComputedStyle(plain!).scale).toBe('none');
    expect(getComputedStyle(flipped!).scale).toBe('-1 1');
    document.documentElement.dir = 'ltr';
    await frame();
    expect(getComputedStyle(flipped!).scale).toBe('none');
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main><p>${decorative} Ready</p><p>${labelled}</p></main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('is drawn in the text colour in forced colours', async () => {
    document.body.innerHTML = `<p>${decorative}</p>`;
    await emulate({ forcedColors: 'active' });
    expect(getComputedStyle($('svg')).fill).toBe(resolveColor('CanvasText'));
  });
});

// Every key in the contract's keyboard map, with real input (tools/check-contracts.mjs checks each is pressed here).
describe('Icon keyboard map', () => {
  it('is never a Tab stop, decorative or labelled', async () => {
    document.body.innerHTML = `<button type="button" class="lue-button" id="a">A</button>${decorative}${labelled}<button type="button" class="lue-button" id="b">B</button>`;
    $('#a').focus();
    await tab();
    expect(document.activeElement).toBe($('#b'));
  });
});
