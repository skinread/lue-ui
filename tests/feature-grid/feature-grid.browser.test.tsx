// Feature grid (apps/docs/contracts/feature-grid.json): parity, a list of features, nothing takes focus, columns that
// stack when narrow, axe in every theme and reflow. Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Feature, FeatureGrid, IconTile } from '@lue-ui/react';
import { $, frame, tab } from '../support/browser.js';
import { blockGates, cleanUp, focusBefore } from '../support/blocks.js';

const html = `<ul class="lue-feature-grid" style="--lue-feature-min:13rem">
  <li class="lue-feature"><span class="lue-tile" aria-hidden="true"><svg class="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M8 2 14 13H2Z"></path></svg></span><h3 class="lue-h3">Design systems</h3><p>Tokens and components.</p></li>
  <li class="lue-feature"><h3 class="lue-h3">Accessibility</h3><p>Audits and fixes.</p></li>
</ul>`;
const underHeading = (h: string) => `<main><h2>Services</h2>${h}</main>`;
cleanUp();

describe('Feature grid', () => {
  blockGates({
    html,
    page: underHeading,
    react: (
      <FeatureGrid min="13rem">
        <Feature icon={<IconTile><svg className="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M8 2 14 13H2Z" /></svg></IconTile>} title="Design systems">Tokens and components.</Feature>
        <Feature title="Accessibility">Audits and fixes.</Feature>
      </FeatureGrid>
    ),
  });

  it('takes no focus: Tab passes over it', async () => {
    focusBefore(html);
    await tab();
    expect(document.activeElement?.id).toBe('after');
  });

  it('is a list of features, side by side when wide and stacked when narrow', async () => {
    const [width, height] = [window.innerWidth, window.innerHeight];
    document.body.innerHTML = html;
    const [a, b] = [...document.querySelectorAll('.lue-feature')];
    expect(getComputedStyle($('.lue-feature-grid')).listStyleType).toBe('none');
    try {
      await page.viewport(1024, 768);
      await frame();
      expect(b!.getBoundingClientRect().top).toBe(a!.getBoundingClientRect().top);
      await page.viewport(320, 640);
      await frame();
      expect(b!.getBoundingClientRect().top).toBeGreaterThanOrEqual(a!.getBoundingClientRect().bottom);
    } finally {
      await page.viewport(width, height);
    }
  });
});
