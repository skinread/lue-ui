// Select (apps/docs/contracts/select.json): a native <select>, with customisable select as an enhancement where the
// engine has it. Markup parity, choosing, validation on both paths, the enhancement gate, RTL, axe in every theme and
// forced colours. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { installValidate } from '@lue-ui/elements';
import { Field, Select } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, frame, outline, resetMedia, resolveColor } from '../support/browser.js';

const MESSAGE = 'Choose a delivery option';
const chevron = '<svg class="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
const options = '<option value="">Choose…</option><option value="standard">Standard, 3 to 5 days</option><option value="express">Express, next day</option>';
const field = (error = '') => `
<div class="lue-field">
  <label class="lue-field__label" for="delivery">Delivery</label>
  <p class="lue-field__error" id="delivery-error"${error ? '' : ' hidden=""'}><span class="lue-visually-hidden">Error: </span><span class="lue-field__message">${error}</span></p>
  <div class="lue-select-wrap">
    <select class="lue-select" id="delivery" name="delivery" required="" aria-describedby="delivery-error"${error ? ' aria-invalid="true"' : ''} data-lue-message-value-missing="${MESSAGE}">${options}</select>
    ${chevron}
  </div>
</div>`;

const select = () => $<HTMLSelectElement>('#delivery');

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('dir');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Select', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(
      <Field label="Delivery" controlId="delivery" error={MESSAGE}>
        <Select name="delivery" required data-lue-message-value-missing={MESSAGE}>
          <option value="">Choose…</option>
          <option value="standard">Standard, 3 to 5 days</option>
          <option value="express">Express, next day</option>
        </Select>
      </Field>,
    );
    expect(outline(react)).toEqual(outline(field(MESSAGE)));
  });

  it('is labelled by its field and chooses an option', async () => {
    document.body.innerHTML = field();
    expect(select().labels[0]?.textContent).toBe('Delivery');
    const changes: string[] = [];
    select().addEventListener('change', () => changes.push(select().value));
    await userEvent.selectOptions(select(), 'express');
    expect(changes).toEqual(['express']);
  });

  it('shows its error through data-lue-validate', async () => {
    document.body.innerHTML = `<form data-lue-validate="">${field()}<button type="submit" class="lue-button" id="submit">Continue</button></form>`;
    const uninstall = installValidate(document);
    try {
      await userEvent.click($('#submit'));
      await frame();
      expect(select().getAttribute('aria-invalid')).toBe('true');
      expect($('#delivery-error').textContent).toBe(`Error: ${MESSAGE}`);
      await userEvent.selectOptions(select(), 'standard');
      expect(select().hasAttribute('aria-invalid')).toBe(false);
    } finally {
      uninstall();
    }
  });

  it('becomes a customisable select only where the engine supports it', () => {
    document.body.innerHTML = field();
    const expected = CSS.supports('appearance', 'base-select') ? 'base-select' : 'none';
    expect(getComputedStyle(select()).appearance).toBe(expected);
  });

  it.runIf(CSS.supports('appearance', 'base-select'))('opens the customisable picker and chooses by keyboard', async () => {
    document.body.innerHTML = field();
    select().focus();
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(select().matches(':open'), 'Enter opens the picker').toBe(true);
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(select().matches(':open'), 'Enter on an option closes it').toBe(false);
    expect(select().value).toBe('standard');
    expect(document.activeElement, 'focus returns to the select').toBe(select());
  });

  it('keeps the chevron at the inline end in both directions', async () => {
    document.body.innerHTML = field();
    const side = () => {
      const s = select().getBoundingClientRect();
      const icon = $('.lue-select-wrap > .lue-icon').getBoundingClientRect();
      return icon.left > s.left + s.width / 2 ? 'right' : 'left';
    };
    expect(side()).toBe('right');
    document.documentElement.dir = 'rtl';
    await frame();
    expect(side()).toBe('left');
  });

  it('meets the target minimum', () => {
    document.body.innerHTML = field();
    expect(select().getBoundingClientRect().height).toBeGreaterThanOrEqual(24);
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}, valid and invalid`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${field()}${field(MESSAGE).replaceAll('delivery', 'delivery-2')}</main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('uses Field / FieldText in forced colours, invalid with a 2 px boundary', async () => {
    document.body.innerHTML = field(MESSAGE);
    await emulate({ forcedColors: 'active', reducedMotion: 'reduce' });
    const style = getComputedStyle(select());
    expect(style.backgroundColor).toBe(resolveColor('Field'));
    expect(style.borderTopColor).toBe(resolveColor('FieldText'));
    expect(style.borderTopWidth).toBe('2px');
  });
});

// Every key in the contract's keyboard map, with real input (tools/check-contracts.mjs checks each is pressed here).
// The native picker's keys vary by OS and aren't automatable; the customisable picker's are.
describe('Select keyboard map', () => {
  it.runIf(CSS.supports('appearance', 'base-select'))('Space and Alt+ArrowDown (Chromium) open it, ArrowUp moves, Escape closes without choosing', async () => {
    document.body.innerHTML = field();
    select().focus();
    await userEvent.keyboard(' ');
    await frame();
    expect(select().matches(':open')).toBe(true);
    await userEvent.keyboard('{Escape}');
    await frame();
    expect(select().matches(':open')).toBe(false);
    expect(select().value).toBe('');
    // Alt+ArrowDown is Chromium's (Windows and Linux convention); WebKit follows macOS and opens with Space or Enter.
    await userEvent.keyboard(server.browser === 'webkit' ? ' ' : '{Alt>}{ArrowDown}{/Alt}');
    await frame();
    expect(select().matches(':open')).toBe(true);
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}{Enter}');
    await frame();
    expect(select().value).toBe('standard');
  });
});
