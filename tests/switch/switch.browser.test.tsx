// Switch (apps/docs/contracts/switch.json): parity, role and state, Space and label click, the thumb in both
// directions, axe in every theme, forced colours. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Switch } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, frame, outline, resetMedia, resolveColor } from '../support/browser.js';

const html = '<label class="lue-choice"><input id="alerts" type="checkbox" role="switch" class="lue-switch" name="alerts">Email me about new work</label>';
const input = () => $<HTMLInputElement>('#alerts');

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('dir');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Switch', () => {
  it('renders the same markup from React as the HTML core', () => {
    expect(outline(renderToStaticMarkup(<Switch id="alerts" name="alerts" label="Email me about new work" />))).toEqual(outline(html));
  });

  it('is a switch that Space and its label turn on and off', async () => {
    document.body.innerHTML = html;
    expect(input().getAttribute('role')).toBe('switch');
    input().focus();
    await userEvent.keyboard(' ');
    expect(input().checked).toBe(true);
    await userEvent.click($('label'));
    expect(input().checked).toBe(false);
  });

  it('moves its thumb to the inline end when on, in both directions', async () => {
    await emulate({ reducedMotion: 'reduce' });
    document.body.innerHTML = html;
    input().checked = true;
    await frame();
    expect(getComputedStyle(input(), '::before').translate).toBe('20px');
    document.documentElement.dir = 'rtl';
    await frame();
    expect(getComputedStyle(input(), '::before').translate).toBe('-20px');
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}, off and on`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${html}${html.replaceAll('alerts', 'alerts-2').replace('name=', 'checked="" name=')}</main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('keeps the thumb visible in forced colours, off and on', async () => {
    document.body.innerHTML = html;
    await emulate({ forcedColors: 'active', reducedMotion: 'reduce' });
    expect(getComputedStyle(input(), '::before').backgroundColor).toBe(resolveColor('FieldText'));
    input().checked = true;
    await frame();
    expect(getComputedStyle(input()).backgroundColor).toBe(resolveColor('SelectedItem'));
    expect(getComputedStyle(input(), '::before').backgroundColor).toBe(resolveColor('SelectedItemText'));
  });
});
