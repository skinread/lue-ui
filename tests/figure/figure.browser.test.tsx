// Figure (apps/docs/contracts/figure.json): parity for Figure and Media, the caption, an image never wider than its
// column, nothing takes focus, axe in every theme and reflow. Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Figure, Media } from '@lue-ui/react';
import { $, outline, tab } from '../support/browser.js';
import { blockGates, cleanUp, focusBefore } from '../support/blocks.js';

const src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'/%3E";
const html = `<figure class="lue-figure" id="figure" style="inline-size:300px"><img src="${src}" width="1200" height="600" alt="Light pooling under glass"><figcaption>Light pools where glass meets the surface.</figcaption></figure>`;
cleanUp();

describe('Figure', () => {
  blockGates({
    html,
    react: (
      <Figure id="figure" style={{ inlineSize: '300px' }} caption="Light pools where glass meets the surface.">
        <img src={src} width={1200} height={600} alt="Light pooling under glass" />
      </Figure>
    ),
  });

  it('renders Media as the HTML core does', () => {
    expect(outline(renderToStaticMarkup(<Media ratio="16 / 7" />))).toEqual(outline('<div class="lue-media" style="aspect-ratio:16 / 7"></div>'));
  });

  it('takes no focus: Tab passes over it', async () => {
    focusBefore(html);
    await tab();
    expect(document.activeElement?.id).toBe('after');
  });

  it('keeps the image inside its column', () => {
    document.body.innerHTML = html;
    expect($('#figure img').getBoundingClientRect().width).toBeLessThanOrEqual(300);
    expect($('#figure figcaption').textContent).toBe('Light pools where glass meets the surface.');
  });
});
