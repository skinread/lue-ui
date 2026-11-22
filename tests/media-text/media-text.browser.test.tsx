// Media and text (apps/docs/contracts/media-text.json): parity, named by its heading, Tab reaches its action, the
// figure's side follows source order, side by side when wide and stacked when narrow, axe in every theme and reflow.
// Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Figure, Media, MediaText } from '@lue-ui/react';
import { $, focusDocument, frame, tab } from '../support/browser.js';
import { blockGates, cleanUp, labelOf } from '../support/blocks.js';

const html = `<section class="lue-split" id="kiln" aria-labelledby="kiln-title">
  <figure class="lue-figure"><div class="lue-media"></div><figcaption>Kiln on a phone.</figcaption></figure>
  <div class="lue-split__text">
    <h2 class="lue-h2" id="kiln-title">An editorial platform</h2>
    <p>Two sentences on the brief.</p>
    <div class="lue-actions"><a class="lue-button" href="#case">Read the case study</a></div>
  </div>
</section>`;
const media = <Figure caption="Kiln on a phone."><Media /></Figure>;
const action = <a className="lue-button" href="#case">Read the case study</a>;
cleanUp();

describe('Media and text', () => {
  blockGates({ html, react: <MediaText id="kiln" title="An editorial platform" media={media} actions={action}><p>Two sentences on the brief.</p></MediaText> });

  it('is named by its heading, and Tab reaches its action', async () => {
    document.body.innerHTML = html;
    expect(labelOf($('#kiln'))).toBe('An editorial platform');
    focusDocument();
    await tab();
    expect(document.activeElement).toBe($('a[href="#case"]'));
  });

  it('puts the figure last in reading order when asked', () => {
    document.body.innerHTML = renderToStaticMarkup(<MediaText id="kiln" title="An editorial platform" media={media} mediaPosition="end"><p>Text</p></MediaText>);
    expect($('#kiln').lastElementChild!.localName).toBe('figure');
  });

  it('sits side by side when wide and stacks when narrow', async () => {
    const [width, height] = [window.innerWidth, window.innerHeight];
    document.body.innerHTML = html;
    try {
      await page.viewport(1280, 800);
      await frame();
      expect($('.lue-split__text').getBoundingClientRect().left).toBeGreaterThan($('#kiln figure').getBoundingClientRect().right - 1);
      await page.viewport(320, 640);
      await frame();
      expect($('.lue-split__text').getBoundingClientRect().top).toBeGreaterThanOrEqual($('#kiln figure').getBoundingClientRect().bottom);
    } finally {
      await page.viewport(width, height);
    }
  });
});
