// Prose (apps/docs/contracts/prose.json): parity, nothing takes focus, kickers are upper case by CSS only, the body's
// spacing, axe in every theme and reflow. Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Prose } from '@lue-ui/react';
import { $, tab } from '../support/browser.js';
import { blockGates, cleanUp, focusBefore } from '../support/blocks.js';

const html = '<article class="lue-prose" id="prose"><p>Body text.</p><h2>Glass that steps aside</h2><ul><li>One</li><li>Two</li></ul></article>';
cleanUp();

describe('Prose', () => {
  blockGates({ html, react: <Prose as="article" id="prose"><p>Body text.</p><h2>Glass that steps aside</h2><ul><li>One</li><li>Two</li></ul></Prose> });

  it('takes no focus: Tab passes over it', async () => {
    focusBefore(html);
    await tab();
    expect(document.activeElement?.id).toBe('after');
  });

  it('sets kickers in capitals by CSS, so the words are read as written', () => {
    document.body.innerHTML = '<p class="lue-kicker" id="k">Case study</p>';
    expect(getComputedStyle($('#k')).textTransform).toBe('uppercase');
    expect($('#k').textContent).toBe('Case study');
  });

  it('spaces the body and keeps a readable measure', () => {
    document.body.innerHTML = html;
    expect(parseFloat(getComputedStyle($('#prose h2')).marginBlockStart)).toBeGreaterThan(parseFloat(getComputedStyle($('#prose ul')).marginBlockStart));
    expect($('#prose').getBoundingClientRect().width).toBeLessThanOrEqual(42 * 16 + 1);
  });
});
