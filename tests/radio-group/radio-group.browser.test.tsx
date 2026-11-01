// Radio group (apps/docs/contracts/radio-group.json): parity, the native keyboard model (Tab enters at the checked
// radio, arrows move and select), one error per group on both validation paths, axe in every theme, forced colours.
// Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { installValidate } from '@lue-ui/elements';
import { ChoiceGroup, ErrorSummary, Radio, useValidation } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, frame, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const MESSAGE = 'Choose a delivery option';
const radios = ['standard', 'express', 'collect'];
const labels: Record<string, string> = { standard: 'Standard', express: 'Express', collect: 'Collect' };
const group = (error = '', required = true) => `
<fieldset class="lue-fieldset" id="delivery" aria-describedby="delivery-error">
  <legend>Delivery</legend>
  <p class="lue-field__error" id="delivery-error"${error ? '' : ' hidden=""'}><span class="lue-visually-hidden">Error: </span><span class="lue-field__message">${error}</span></p>
  ${radios.map((r) => `<label class="lue-choice"><input id="delivery-${r}" type="radio" class="lue-radio" name="delivery" value="${r}"${required ? ` required="" data-lue-message-value-missing="${MESSAGE}"` : ''}${error ? ' aria-invalid="true"' : ''}>${labels[r]}</label>`).join('\n  ')}
</fieldset>`;
const form = `
<form data-lue-validate="" id="form">
  <div class="lue-error-summary" data-lue-error-summary="" id="summary" tabindex="-1" hidden=""><div role="alert"><h2 class="lue-error-summary__title" id="summary-title">There is a problem</h2><ul class="lue-error-summary__list" aria-labelledby="summary-title"></ul></div></div>
  ${group()}
  <button type="submit" class="lue-button" id="submit">Continue</button>
</form>`;
const radio = (r: string) => $<HTMLInputElement>(`#delivery-${r}`);
const links = () => [...document.querySelectorAll('#summary a')].map((a) => [a.getAttribute('href'), a.textContent]);

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Radio group', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(
      <ChoiceGroup id="delivery" legend="Delivery" error={MESSAGE}>
        {radios.map((r) => (
          <Radio key={r} id={`delivery-${r}`} name="delivery" value={r} required data-lue-message-value-missing={MESSAGE} label={labels[r]} />
        ))}
      </ChoiceGroup>,
    );
    expect(outline(react)).toEqual(outline(group(MESSAGE)));
  });

  it('enters at the checked radio and moves the selection with arrow keys', async () => {
    document.body.innerHTML = `<button type="button" id="before">Before</button>${group('', false)}`;
    radio('express').checked = true;
    $('#before').focus();
    await tab();
    expect(document.activeElement).toBe(radio('express'));
    await userEvent.keyboard('{ArrowDown}');
    expect(radio('collect').checked).toBe(true);
    expect(document.activeElement).toBe(radio('collect'));
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(radio('standard').checked).toBe(true);
  });

  it('is one error, on its first radio, through data-lue-validate, and choosing any radio clears it', async () => {
    document.body.innerHTML = form;
    const uninstall = installValidate(document);
    try {
      await userEvent.click($('#submit'));
      await frame();
      expect(links()).toEqual([['#delivery-standard', MESSAGE]]);
      expect(radios.map((r) => radio(r).getAttribute('aria-invalid'))).toEqual(['true', 'true', 'true']);
      expect($('#delivery-error').textContent).toBe(`Error: ${MESSAGE}`);
      await userEvent.click($('label:has(#delivery-collect)'));
      expect(radios.map((r) => radio(r).hasAttribute('aria-invalid'))).toEqual([false, false, false]);
      expect($('#delivery-error').hidden).toBe(true);
    } finally {
      uninstall();
    }
  });

  it('is one error with useValidation, cleared by choosing any radio', async () => {
    function Delivery() {
      const { formProps, summaryProps, errorFor } = useValidation();
      return (
        <form {...formProps}>
          <ErrorSummary id="summary" {...summaryProps} />
          <ChoiceGroup id="delivery" legend="Delivery" error={errorFor('delivery-standard')}>
            {radios.map((r) => (
              <Radio key={r} id={`delivery-${r}`} name="delivery" value={r} required data-lue-message-value-missing={MESSAGE} label={labels[r]} />
            ))}
          </ChoiceGroup>
          <button type="submit" className="lue-button" id="submit">Continue</button>
        </form>
      );
    }
    const root = createRoot(document.body.appendChild(document.createElement('main')));
    await act(async () => root.render(<Delivery />));
    await userEvent.click($('#submit'));
    await frame();
    expect(links()).toEqual([['#delivery-standard', MESSAGE]]);
    await userEvent.click($('label:has(#delivery-express)'));
    await frame();
    expect(links()).toEqual([]);
    expect(radio('standard').hasAttribute('aria-invalid')).toBe(false);
    await act(async () => root.unmount());
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}, valid and invalid`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${group()}${group(MESSAGE).replaceAll('delivery', 'delivery-2')}</main>`;
      radio('express').checked = true;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('shows the checked radio as a SelectedItemText dot in forced colours', async () => {
    document.body.innerHTML = group('', false);
    radio('express').checked = true;
    await emulate({ forcedColors: 'active', reducedMotion: 'reduce' });
    expect(getComputedStyle(radio('express')).backgroundColor).toBe(resolveColor('SelectedItem'));
    expect(getComputedStyle(radio('express'), '::after').backgroundColor).toBe(resolveColor('SelectedItemText'));
    expect(getComputedStyle(radio('express'), '::after').width).toBe('8px');
  });
});

// Every key in the contract's keyboard map, with real input (tools/check-contracts.mjs checks each is pressed here).
describe('Radio group keyboard map', () => {
  it('Space checks the focused radio; ArrowRight and ArrowLeft move the selection', async () => {
    document.body.innerHTML = group('', false);
    radio('standard').focus();
    await userEvent.keyboard(' ');
    expect(radio('standard').checked).toBe(true);
    await userEvent.keyboard('{ArrowRight}');
    expect(radio('express').checked).toBe(true);
    await userEvent.keyboard('{ArrowLeft}');
    expect(radio('standard').checked).toBe(true);
    expect(document.activeElement).toBe(radio('standard'));
  });
});
