// Icon tile (apps/docs/contracts/icon-tile.json): parity, hidden from assistive technology, its sizes, nothing takes
// focus, axe in every theme, and Canvas with a border in forced colours. Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { server } from 'vitest/browser';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { IconTile } from '@lue-ui/react';
import { $, emulate, resolveColor, tab } from '../support/browser.js';
import { blockGates, cleanUp, focusBefore } from '../support/blocks.js';

const html = '<span class="lue-tile" data-size="lg" aria-hidden="true"><svg class="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M8 2 14 13H2Z"></path></svg></span>';
cleanUp();

describe('Icon tile', () => {
  blockGates({ html, react: <IconTile size="lg"><svg className="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M8 2 14 13H2Z" /></svg></IconTile> });

  it('is hidden from assistive technology, and takes no focus', async () => {
    focusBefore(html);
    await tab();
    expect(document.activeElement?.id).toBe('after');
    expect($('.lue-tile').getAttribute('aria-hidden')).toBe('true');
  });

  it('is 64px, or 112px large', () => {
    document.body.innerHTML = `<span class="lue-tile" aria-hidden="true"><svg class="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M8 2 14 13H2Z"></path></svg></span>${html}`;
    const [small, large] = [...document.querySelectorAll('.lue-tile')];
    expect(small!.getBoundingClientRect().width).toBe(64);
    expect(large!.getBoundingClientRect().width).toBe(112);
  });

  it.skipIf(server.browser === 'webkit')('is Canvas with a CanvasText border in forced colours', async () => {
    document.body.innerHTML = html;
    await emulate({ forcedColors: 'active' });
    expect(getComputedStyle($('.lue-tile')).backgroundColor).toBe(resolveColor('Canvas'));
    expect(getComputedStyle($('.lue-tile')).borderBlockStartColor).toBe(resolveColor('CanvasText'));
  });
});
