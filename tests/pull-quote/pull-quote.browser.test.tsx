// Pull quote (apps/docs/contracts/pull-quote.json): parity, hidden from assistive technology, nothing takes focus, axe
// in every theme, reflow and its chrome lines in forced colours. Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { server } from 'vitest/browser';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { PullQuote } from '@lue-ui/react';
import { $, emulate, resolveColor, tab } from '../support/browser.js';
import { blockGates, cleanUp, focusBefore } from '../support/blocks.js';

const html = '<aside class="lue-pull" aria-hidden="true">Only the colour moves.</aside>';
const inBody = (h: string) => `<main><p>Contrast stays fixed. Only the colour moves.</p>${h}</main>`;
cleanUp();

describe('Pull quote', () => {
  blockGates({ html, page: inBody, react: <PullQuote>Only the colour moves.</PullQuote> });

  it('is hidden from assistive technology, and takes no focus', async () => {
    focusBefore(html);
    await tab();
    expect(document.activeElement?.id).toBe('after');
    expect($('.lue-pull').getAttribute('aria-hidden')).toBe('true');
  });

  it.skipIf(server.browser === 'webkit')('draws its chrome lines as CanvasText borders in forced colours', async () => {
    document.body.innerHTML = html;
    await emulate({ forcedColors: 'active' });
    expect(getComputedStyle($('.lue-pull')).borderBlockStartColor).toBe(resolveColor('CanvasText'));
  });
});
