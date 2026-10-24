// Link (apps/docs/contracts/link.json): parity, an underline at rest and a thicker one on hover, a focus outline, axe
// in every theme, and the system link colour in forced colours. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Link } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, frame, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const html = '<a class="lue-link" href="#statement" id="link">Accessibility statement</a>';
const link = () => $('#link');

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Link', () => {
  it('renders the same markup from React as the HTML core', () => {
    expect(outline(renderToStaticMarkup(<Link href="#statement" id="link">Accessibility statement</Link>))).toEqual(outline(html));
  });

  it('is underlined at rest, thicker on hover', async () => {
    document.body.innerHTML = `<p>${html}</p>`;
    expect(getComputedStyle(link()).textDecorationLine).toBe('underline');
    expect(getComputedStyle(link()).textDecorationThickness).toBe('1px');
    await userEvent.hover(link());
    await frame();
    expect(getComputedStyle(link()).textDecorationThickness).toBe('2px');
  });

  it('shows the focus ring from the keyboard', async () => {
    document.body.innerHTML = `<p>${html}</p>`;
    await tab();
    expect(document.activeElement).toBe(link());
    expect(getComputedStyle(link()).outlineStyle).toBe('solid');
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main><p>Read the ${html}.</p></main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('takes the system link colour in forced colours', async () => {
    document.body.innerHTML = `<p>${html}</p>`;
    await emulate({ forcedColors: 'active' });
    expect(getComputedStyle(link()).color).toBe(resolveColor('LinkText'));
  });
});
