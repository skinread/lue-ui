// Progress and Meter (apps/docs/contracts/progress.json): parity, labelled by their <label>, values and the
// indeterminate state, the indeterminate band at rest under reduced motion, never a Tab stop, axe in every theme,
// forced colours. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Meter, Progress } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, frame, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const progress = (value = ' value="3"') => `
<div class="lue-field">
  <div class="lue-progress-label"><label class="lue-field__label" for="upload">Uploading</label><span class="lue-field__hint">3 of 5 files</span></div>
  <progress id="upload" class="lue-progress" max="5"${value}></progress>
</div>`;
const meter = `
<div class="lue-field">
  <div class="lue-progress-label"><label class="lue-field__label" for="storage">Storage used</label></div>
  <meter id="storage" class="lue-meter" min="0" max="100" low="70" high="90" optimum="20" value="80"></meter>
</div>`;

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Progress and Meter', () => {
  it('render the same markup from React as the HTML core', () => {
    expect(outline(renderToStaticMarkup(<Progress id="upload" label="Uploading" valueText="3 of 5 files" max={5} value={3} />))).toEqual(outline(progress()));
    expect(outline(renderToStaticMarkup(<Meter id="storage" label="Storage used" min={0} max={100} low={70} high={90} optimum={20} value={80} />))).toEqual(outline(meter));
  });

  it('are labelled by their label, and report their values', () => {
    document.body.innerHTML = progress() + progress('').replaceAll('upload', 'working') + meter;
    const bar = $<HTMLProgressElement>('#upload');
    expect([...bar.labels].map((l) => l.textContent)).toEqual(['Uploading']);
    expect(bar.position).toBeCloseTo(0.6);
    expect($('#working').matches(':indeterminate')).toBe(true);
    expect($<HTMLMeterElement>('#storage').value).toBe(80);
  });

  it('moves the indeterminate band, and holds it still under reduced motion', async () => {
    document.body.innerHTML = progress('');
    expect(getComputedStyle($('progress')).animationName).toBe('lue-progress-slide');
    await emulate({ reducedMotion: 'reduce' });
    expect(getComputedStyle($('progress')).animationName).toBe('none');
  });

  it('are never a Tab stop', async () => {
    document.body.innerHTML = `<button type="button" class="lue-button" id="a">A</button>${progress()}${meter}<button type="button" class="lue-button" id="b">B</button>`;
    $('#a').focus();
    await tab();
    expect(document.activeElement).toBe($('#b'));
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`pass axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${progress()}${progress('').replaceAll('upload', 'working')}${meter}</main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('draw a Canvas track with a CanvasText edge in forced colours', async () => {
    document.body.innerHTML = progress();
    await emulate({ forcedColors: 'active' });
    await frame();
    const style = getComputedStyle($('progress'));
    expect(style.backgroundColor).toBe(resolveColor('Canvas'));
    expect(style.outlineColor).toBe(resolveColor('CanvasText'));
  });
});
