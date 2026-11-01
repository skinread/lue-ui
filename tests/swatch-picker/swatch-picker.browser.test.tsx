// Swatch picker (apps/docs/contracts/swatch-picker.json): parity, a radio group whose options are named in words, the
// native keyboard model, the chip in its colour (kept in forced colours), the checked and focused swatch drawn, axe
// in every theme. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { SwatchPicker } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, focusDocument, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const swatches = [{ value: 'sage', label: 'Sage', color: 'rgb(140, 170, 140)' }, { value: 'clay', label: 'Clay', color: 'rgb(190, 110, 80)' }, { value: 'ink', label: 'Ink', color: 'rgb(30, 40, 70)' }];
const html = `<fieldset class="lue-fieldset"><legend>Colour</legend><div class="lue-swatches">${swatches.map((s) => `<label class="lue-swatch"><input type="radio" name="colour" value="${s.value}"${s.value === 'clay' ? ' checked=""' : ''}><span class="lue-swatch__chip" style="--lue-swatch:${s.color}"></span>${s.label}</label>`).join('')}</div></fieldset>`;
const radio = (v: string) => $<HTMLInputElement>(`input[value="${v}"]`);
const swatch = (v: string) => radio(v).closest('label')!;

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Swatch picker', () => {
  it('renders the same markup from React as the HTML core', () => {
    expect(outline(renderToStaticMarkup(<SwatchPicker legend="Colour" name="colour" defaultValue="clay" swatches={swatches} />))).toEqual(outline(html));
  });

  it('names every colour in words and paints its chip', () => {
    document.body.innerHTML = html;
    expect(radio('sage').labels?.[0]?.textContent).toBe('Sage');
    expect(getComputedStyle($('.lue-swatch__chip')).backgroundColor).toBe('rgb(140, 170, 140)');
  });

  it('enters at the checked swatch; arrows move it; Space checks; the focused one shows a ring', async () => {
    document.body.innerHTML = html;
    focusDocument();
    await tab();
    expect(document.activeElement).toBe(radio('clay'));
    expect(getComputedStyle(swatch('clay')).outlineStyle).toBe('solid');
    await userEvent.keyboard('{ArrowRight}');
    expect(radio('ink').checked).toBe(true);
    await userEvent.keyboard('{ArrowLeft}');
    expect(radio('clay').checked).toBe(true);
    radio('clay').checked = false;
    await userEvent.keyboard(' ');
    expect(radio('clay').checked).toBe(true);
    expect(getComputedStyle(swatch('clay')).fontWeight).toBe('600');
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${html}</main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('keeps each chip\'s colour and marks the checked swatch in forced colours', async () => {
    document.body.innerHTML = html;
    await emulate({ forcedColors: 'active' });
    expect(getComputedStyle($('.lue-swatch__chip')).backgroundColor).toBe('rgb(140, 170, 140)');
    expect(getComputedStyle(swatch('clay')).backgroundColor).toBe(resolveColor('SelectedItem'));
  });
});
