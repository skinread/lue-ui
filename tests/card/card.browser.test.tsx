// Card (apps/docs/contracts/card.json): parity, the whole card is its link while other controls stay usable, the card
// shows the link's focus, Tab and Enter, axe in every theme, forced colours. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Button, Card, CardLink } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, focusDocument, frame, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const html = `
<article class="lue-card" id="card" style="inline-size:320px">
  <h3><a class="lue-card__link" href="#loom">Loom</a></h3>
  <p>A weaving journal, built with the platform.</p>
  <button type="button" class="lue-button" id="save">Save</button>
</article>`;
const card = () => $('#card');
const at = (x: number, y: number) => document.elementFromPoint(x, y);

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  history.replaceState(null, '', location.pathname + location.search);
  await resetMedia();
});

describe('Card', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(
      <Card id="card" style={{ inlineSize: '320px' }}>
        <h3><CardLink href="#loom">Loom</CardLink></h3>
        <p>A weaving journal, built with the platform.</p>
        <Button id="save">Save</Button>
      </Card>,
    );
    expect(outline(react)).toEqual(outline(html));
  });

  it('is its link all over, but its other buttons stay on top', () => {
    document.body.innerHTML = html;
    const box = card().getBoundingClientRect();
    expect(at(box.left + 8, box.bottom - 8)).toBe($('.lue-card__link'));
    const save = $('#save').getBoundingClientRect();
    expect(at(save.left + save.width / 2, save.top + save.height / 2)).toBe($('#save'));
  });

  it('shows the focus ring on the card, and Enter follows the link', async () => {
    document.body.innerHTML = html;
    focusDocument();
    await tab();
    expect(document.activeElement).toBe($('.lue-card__link'));
    expect(getComputedStyle(card()).outlineStyle).toBe('solid');
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(location.hash).toBe('#loom');
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${html}</main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('is Canvas with a CanvasText border in forced colours', async () => {
    document.body.innerHTML = html;
    await emulate({ forcedColors: 'active' });
    expect(getComputedStyle(card()).backgroundColor).toBe(resolveColor('Canvas'));
    expect(getComputedStyle(card()).borderBlockStartColor).toBe(resolveColor('CanvasText'));
  });
});
