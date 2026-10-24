// Avatar (apps/docs/contracts/avatar.json): initials, parity for a photo, initials and the decorative form, names in
// the accessibility tree, never a Tab stop, axe in every theme, forced colours. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Avatar, initials } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const photo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%23888'/%3E%3C/svg%3E";

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Avatar', () => {
  it('makes initials from the first and last words', () => {
    expect([initials('Ada Lovelace'), initials('grace brewster murray hopper'), initials('Plato'), initials('  ')]).toEqual(['AL', 'GH', 'P', '']);
  });

  it('renders the same markup from React as the HTML core', () => {
    expect(outline(renderToStaticMarkup(<Avatar name="Ada Lovelace" src={photo} />))).toEqual(outline(`<span class="lue-avatar"><img src="${photo}" alt="Ada Lovelace"></span>`));
    expect(outline(renderToStaticMarkup(<Avatar name="Ada Lovelace" />))).toEqual(outline('<span class="lue-avatar" role="img" aria-label="Ada Lovelace">AL</span>'));
    expect(outline(renderToStaticMarkup(<Avatar name="Ada Lovelace" decorative size="lg" />))).toEqual(outline('<span class="lue-avatar" data-size="lg" aria-hidden="true">AL</span>'));
  });

  it('is never a Tab stop', async () => {
    document.body.innerHTML = `<button type="button" class="lue-button" id="a">A</button><span class="lue-avatar" role="img" aria-label="Ada Lovelace">AL</span><button type="button" class="lue-button" id="b">B</button>`;
    $('#a').focus();
    await tab();
    expect(document.activeElement).toBe($('#b'));
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${renderToStaticMarkup(<><Avatar name="Ada Lovelace" src={photo} /><Avatar name="Grace Hopper" /><p><Avatar name="Alan Turing" decorative /> Alan Turing</p></>)}</main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('keeps a CanvasText border in forced colours', async () => {
    document.body.innerHTML = '<span class="lue-avatar" role="img" aria-label="Ada Lovelace">AL</span>';
    await emulate({ forcedColors: 'active' });
    expect(getComputedStyle($('.lue-avatar')).borderBlockStartColor).toBe(resolveColor('CanvasText'));
  });
});
