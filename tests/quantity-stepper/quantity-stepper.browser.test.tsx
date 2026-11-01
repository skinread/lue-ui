// Quantity stepper (apps/docs/contracts/quantity-stepper.json): parity, buttons hidden without the element, − and +
// stepping within min and max (Enter and Space too) and firing input and change, aria-disabled at the limits, the
// input's own arrow keys, axe in every theme. Chromium, Firefox and WebKit.
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import '@lue-ui/elements/define';
import { QuantityStepper } from '@lue-ui/react';
import { $, expectNoAxeViolations, frame, outline, withoutElements } from '../support/browser.js';

const html = (id: string) => `
<div class="lue-field">
  <label class="lue-field__label" for="${id}">Quantity</label>
  <p class="lue-field__error" id="${id}-error" hidden=""><span class="lue-visually-hidden">Error: </span><span class="lue-field__message"></span></p>
  <lue-stepper class="lue-stepper">
    <button type="button" aria-label="Decrease Quantity" data-lue-step="down" class="lue-button" data-size="sm" data-icon-only=""><svg class="lue-button__icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M3 8h10" stroke="currentColor" stroke-width="1.5"></path></svg></button>
    <input name="qty" type="number" inputmode="numeric" min="1" max="3" step="1" value="2" id="${id}" aria-describedby="${id}-error" class="lue-input">
    <button type="button" aria-label="Increase Quantity" data-lue-step="up" class="lue-button" data-size="sm" data-icon-only=""><svg class="lue-button__icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M3 8h10M8 3v10" stroke="currentColor" stroke-width="1.5"></path></svg></button>
  </lue-stepper>
</div>`;
const input = () => $<HTMLInputElement>('input');
const down = () => $('[data-lue-step="down"]');
const up = () => $('[data-lue-step="up"]');

beforeAll(async () => {
  await customElements.whenDefined('lue-stepper');
});
afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
});

describe('Quantity stepper', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(<QuantityStepper label="Quantity" name="qty" min={1} max={3} step={1} defaultValue={2} />);
    expect(outline(react)).toEqual(outline(html(react.match(/ for="([^"]+)"/)![1]!)));
  });

  it('hides its buttons without the element; the number input works alone', async () => {
    const doc = await withoutElements(html('qty'));
    expect(getComputedStyle(doc.querySelector('[data-lue-step="down"]')!).display).toBe('none');
    const plain = doc.querySelector<HTMLInputElement>('input')!;
    plain.stepUp();
    expect(plain.value).toBe('3');
  });

  it('steps within min and max, fires input and change, and marks the limits', async () => {
    document.body.innerHTML = html('qty');
    await frame();
    const events: string[] = [];
    input().addEventListener('input', () => events.push('input'));
    input().addEventListener('change', () => events.push('change'));
    expect([down().getAttribute('aria-disabled'), up().getAttribute('aria-disabled')]).toEqual(['false', 'false']);
    await userEvent.click(up());
    expect(input().value).toBe('3');
    expect(events).toEqual(['input', 'change']);
    expect(up().getAttribute('aria-disabled')).toBe('true');
    up().focus();
    await userEvent.keyboard('{Enter}');
    expect(input().value).toBe('3');
    down().focus();
    await userEvent.keyboard(' ');
    await userEvent.keyboard('{Enter}');
    expect(input().value).toBe('1');
    expect(down().getAttribute('aria-disabled')).toBe('true');
    expect(document.activeElement).toBe(down());
  });

  it('keeps the input\'s own ArrowUp and ArrowDown, and follows them', async () => {
    document.body.innerHTML = html('qty');
    await frame();
    input().focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(input().value).toBe('1');
    expect(down().getAttribute('aria-disabled')).toBe('true');
    await userEvent.keyboard('{ArrowUp}');
    expect(down().getAttribute('aria-disabled')).toBe('false');
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${html('qty')}</main>`;
      await frame();
      await expectNoAxeViolations(document.body);
    });
  }
});
