// Quote (apps/docs/contracts/quote.json): parity, a blockquote with its source in the caption, the decorative mark,
// nothing takes focus, axe in every theme, reflow and the mark in forced colours. Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { server } from 'vitest/browser';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Quote } from '@lue-ui/react';
import { $, emulate, resolveColor, tab } from '../support/browser.js';
import { blockGates, cleanUp, focusBefore } from '../support/blocks.js';

const html = `<figure class="lue-quote">
  <span class="lue-quote__mark lue-chrome-text" aria-hidden="true">“</span>
  <blockquote cite="#kiln"><p>Faster and easier to use.</p></blockquote>
  <figcaption><span class="lue-quote__source"><span class="lue-quote__name">Alex Morgan</span><span class="lue-quote__role">Editor, Kiln</span></span></figcaption>
</figure>`;
cleanUp();

describe('Quote', () => {
  blockGates({ html, react: <Quote name="Alex Morgan" role="Editor, Kiln" cite="#kiln">Faster and easier to use.</Quote> });

  it('takes no focus, and hides its mark from assistive technology', async () => {
    focusBefore(html);
    await tab();
    expect(document.activeElement?.id).toBe('after');
    expect($('.lue-quote__mark').getAttribute('aria-hidden')).toBe('true');
    expect($('blockquote').textContent).toBe('Faster and easier to use.');
  });

  it.skipIf(server.browser === 'webkit')('draws the mark in CanvasText in forced colours', async () => {
    document.body.innerHTML = html;
    await emulate({ forcedColors: 'active' });
    expect(getComputedStyle($('.lue-quote__mark')).color).toBe(resolveColor('CanvasText'));
  });
});
