// Timeline (apps/docs/contracts/timeline.json): parity, an ordered list with a <time> only for real dates, nothing takes
// focus, the date above the entry when narrow, axe in every theme and reflow. Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Timeline } from '@lue-ui/react';
import { $, frame, tab } from '../support/browser.js';
import { blockGates, cleanUp, focusBefore } from '../support/blocks.js';

const html = `<ol class="lue-timeline">
  <li><span class="lue-kicker lue-timeline__when">2024 - now</span><div class="lue-timeline__entry"><p class="lue-timeline__title">Founder</p><p class="lue-timeline__detail">Lue Studio.</p></div></li>
  <li><time class="lue-kicker lue-timeline__when" datetime="2020">2020</time><div class="lue-timeline__entry"><p class="lue-timeline__title">Speaker</p></div></li>
</ol>`;
cleanUp();

describe('Timeline', () => {
  blockGates({
    html,
    react: <Timeline items={[{ when: '2024 - now', title: 'Founder', detail: 'Lue Studio.' }, { when: '2020', dateTime: '2020', title: 'Speaker' }]} />,
  });

  it('takes no focus: Tab passes over it', async () => {
    focusBefore(html);
    await tab();
    expect(document.activeElement?.id).toBe('after');
  });

  it('uses <time> only for a real date', () => {
    document.body.innerHTML = html;
    expect(document.querySelectorAll('.lue-timeline time')).toHaveLength(1);
    expect($('.lue-timeline time').getAttribute('datetime')).toBe('2020');
  });

  it('puts the date above the entry when narrow', async () => {
    const [width, height] = [window.innerWidth, window.innerHeight];
    document.body.innerHTML = html;
    try {
      await page.viewport(320, 640);
      await frame();
      expect($('.lue-timeline__entry').getBoundingClientRect().top).toBeGreaterThanOrEqual($('.lue-timeline__when').getBoundingClientRect().bottom);
    } finally {
      await page.viewport(width, height);
    }
  });
});
