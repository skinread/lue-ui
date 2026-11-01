// Alert (apps/docs/contracts/alert.json): parity, no role when static and status or alert when live, the tone word in
// the accessible text, axe for every tone in every theme, and a visible edge in forced colours. Chromium, Firefox and
// WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Alert } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const icon = '<svg class="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M8 4v5M8 11v1"></path></svg>';
const alert = (tone: string, word: string, role = '') => `
<div class="lue-alert" data-tone="${tone}"${role ? ` role="${role}"` : ''}>
  ${icon}
  <p class="lue-alert__title"><span class="lue-visually-hidden">${word}: </span>Delivery is delayed</p>
  <div class="lue-alert__body">Orders placed today go out on Monday.</div>
</div>`;
const tones: [string, string][] = [['info', 'Information'], ['warning', 'Warning'], ['success', 'Success'], ['critical', 'Error']];
const svg = <svg className="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M8 4v5M8 11v1" /></svg>;

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Alert', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(
      <Alert tone="warning" title="Delivery is delayed" icon={svg} live="polite">Orders placed today go out on Monday.</Alert>,
    );
    expect(outline(react)).toEqual(outline(alert('warning', 'Warning', 'status')));
  });

  it('has no role when static, status when polite and alert when assertive', () => {
    const role = (markup: string) => { document.body.innerHTML = markup; return $('.lue-alert').getAttribute('role'); };
    expect(role(renderToStaticMarkup(<Alert title="Saved" />))).toBe(null);
    expect(role(renderToStaticMarkup(<Alert title="Saved" live="polite" />))).toBe('status');
    expect(role(renderToStaticMarkup(<Alert tone="critical" title="Payment failed" live="assertive" />))).toBe('alert');
  });

  it('says its tone in words, translatable', () => {
    document.body.innerHTML = renderToStaticMarkup(<Alert tone="critical" title="Payment failed" toneLabel="Erreur" />);
    expect($('.lue-alert__title').textContent).toBe('Erreur: Payment failed');
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe for every tone in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${tones.map(([tone, word]) => alert(tone, word)).join('')}</main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('keeps a CanvasText edge on Canvas in forced colours', async () => {
    document.body.innerHTML = alert('warning', 'Warning');
    await emulate({ forcedColors: 'active' });
    const style = getComputedStyle($('.lue-alert'));
    expect(style.borderBlockStartColor).toBe(resolveColor('CanvasText'));
    expect(style.borderBlockStartStyle).toBe('solid');
    expect(style.backgroundColor).toBe(resolveColor('Canvas'));
  });
});

// Every key in the contract's keyboard map, with real input (tools/check-contracts.mjs checks each is pressed here).
describe('Alert keyboard map', () => {
  it('takes no focus itself: Tab goes straight to a link inside it', async () => {
    document.body.innerHTML = `<button type="button" class="lue-button" id="before">Before</button>${alert('warning', 'Warning').replace('Orders placed today go out on Monday.', '<a href="#delivery" id="inside">Delivery times</a>')}`;
    $('#before').focus();
    await tab();
    expect(document.activeElement).toBe($('#inside'));
  });
});
