// Checkbox (apps/docs/contracts/checkbox.json): parity, keyboard and pointer, indeterminate, targets, validation on both
// paths, axe in every theme, forced colours. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { installValidate } from '@lue-ui/elements';
import { Checkbox, ChoiceGroup, ErrorSummary, useValidation } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, focusDocument, frame, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const MESSAGE = 'Agree to the terms to continue';
const group = (error = '') => `
<fieldset class="lue-fieldset" id="extras" aria-describedby="extras-hint extras-error">
  <legend>Extras</legend>
  <p class="lue-field__hint" id="extras-hint">Choose any.</p>
  <p class="lue-field__error" id="extras-error"${error ? '' : ' hidden=""'}><span class="lue-visually-hidden">Error: </span><span class="lue-field__message">${error}</span></p>
  <label class="lue-choice"><input id="gift" type="checkbox" class="lue-checkbox" name="extras" value="gift"${error ? ' aria-invalid="true"' : ''}>Gift wrap</label>
  <label class="lue-choice"><input id="note" type="checkbox" class="lue-checkbox" name="extras" value="note"${error ? ' aria-invalid="true"' : ''}>Add a note</label>
</fieldset>`;
const terms = `
<form data-lue-validate="" id="form">
  <div class="lue-error-summary" data-lue-error-summary="" id="summary" tabindex="-1" hidden=""><div role="alert"><h2 class="lue-error-summary__title" id="summary-title">There is a problem</h2><ul class="lue-error-summary__list" aria-labelledby="summary-title"></ul></div></div>
  <fieldset class="lue-fieldset" aria-describedby="terms-error">
    <legend>Terms</legend>
    <p class="lue-field__error" id="terms-error" hidden=""><span class="lue-visually-hidden">Error: </span><span class="lue-field__message"></span></p>
    <label class="lue-choice"><input id="agree" type="checkbox" class="lue-checkbox" required="" data-lue-message-value-missing="${MESSAGE}">I agree to the terms</label>
  </fieldset>
  <button type="submit" class="lue-button" id="submit">Continue</button>
</form>`;

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Checkbox', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(
      <ChoiceGroup id="extras" legend="Extras" hint="Choose any." error="Choose one">
        <Checkbox id="gift" name="extras" value="gift" label="Gift wrap" />
        <Checkbox id="note" name="extras" value="note" label="Add a note" />
      </ChoiceGroup>,
    );
    expect(outline(react)).toEqual(outline(group('Choose one')));
  });

  it('toggles with Space and with a click on its label, and is at least 24 px tall', async () => {
    document.body.innerHTML = group();
    $('#gift').focus();
    await userEvent.keyboard(' ');
    expect($<HTMLInputElement>('#gift').checked).toBe(true);
    await userEvent.click($('label:has(#note)'));
    expect($<HTMLInputElement>('#note').checked).toBe(true);
    expect($('label:has(#note)').getBoundingClientRect().height).toBeGreaterThanOrEqual(24);
  });

  it('draws a dash when indeterminate', () => {
    document.body.innerHTML = group();
    $<HTMLInputElement>('#gift').indeterminate = true;
    expect(getComputedStyle($('#gift'), '::after').width).toBe('10px');
  });

  it('reports a required checkbox through data-lue-validate and clears it when ticked', async () => {
    document.body.innerHTML = terms;
    const uninstall = installValidate(document);
    try {
      await userEvent.click($('#submit'));
      await frame();
      expect($('#agree').getAttribute('aria-invalid')).toBe('true');
      expect($('#terms-error').textContent).toBe(`Error: ${MESSAGE}`);
      expect(document.activeElement).toBe($('#summary'));
      await userEvent.click($('#agree'));
      expect($('#agree').hasAttribute('aria-invalid')).toBe(false);
      expect($('#terms-error').hidden).toBe(true);
    } finally {
      uninstall();
    }
  });

  it('works with useValidation', async () => {
    function Terms() {
      const { formProps, summaryProps, errorFor } = useValidation();
      return (
        <form {...formProps}>
          <ErrorSummary id="summary" {...summaryProps} />
          <ChoiceGroup legend="Terms" error={errorFor('agree')}>
            <Checkbox id="agree" required data-lue-message-value-missing={MESSAGE} label="I agree to the terms" />
          </ChoiceGroup>
          <button type="submit" className="lue-button" id="submit">Continue</button>
        </form>
      );
    }
    const root = createRoot(document.body.appendChild(document.createElement('main')));
    await act(async () => root.render(<Terms />));
    await userEvent.click($('#submit'));
    await frame();
    expect($('#agree').getAttribute('aria-invalid')).toBe('true');
    await userEvent.click($('#agree'));
    await frame();
    expect($('#agree').hasAttribute('aria-invalid')).toBe(false);
    await act(async () => root.unmount());
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}, unchecked, checked and invalid`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${group()}${group(MESSAGE).replaceAll('extras', 'extras-2').replace('id="gift"', 'id="gift-2" checked=""').replace('id="note"', 'id="note-2"')}</main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('keeps the tick visible on SelectedItem in forced colours', async () => {
    document.body.innerHTML = group();
    $<HTMLInputElement>('#gift').checked = true;
    await emulate({ forcedColors: 'active', reducedMotion: 'reduce' });
    expect(getComputedStyle($('#gift')).backgroundColor).toBe(resolveColor('SelectedItem'));
    expect(getComputedStyle($('#gift'), '::after').borderBlockEndColor).toBe(resolveColor('SelectedItemText'));
  });
});

// Every key in the contract's keyboard map, with real input (tools/check-contracts.mjs checks each is pressed here).
describe('Checkbox keyboard map', () => {
  it('Tab reaches each checkbox in turn', async () => {
    document.body.innerHTML = group();
    focusDocument();
    await tab();
    expect(document.activeElement).toBe($('#gift'));
    await tab();
    expect(document.activeElement).toBe($('#note'));
  });
});
