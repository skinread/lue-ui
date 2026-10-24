// Textarea (apps/docs/contracts/textarea.json): parity inside a Field, growing with its content where field-sizing
// exists, validation through data-lue-validate, axe in every theme. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { installValidate } from '@lue-ui/elements';
import { Field, Textarea } from '@lue-ui/react';
import { $, expectNoAxeViolations, frame, outline, tab } from '../support/browser.js';

const MESSAGE = 'Tell us about your project';
const field = (error = '') => `
<div class="lue-field">
  <label class="lue-field__label" for="brief">Project brief</label>
  <p class="lue-field__hint" id="brief-hint">A few sentences is plenty.</p>
  <p class="lue-field__error" id="brief-error"${error ? '' : ' hidden=""'}><span class="lue-visually-hidden">Error: </span><span class="lue-field__message">${error}</span></p>
  <textarea name="brief" required="" minlength="20" data-lue-message-value-missing="${MESSAGE}" id="brief" aria-describedby="brief-hint brief-error"${error ? ' aria-invalid="true"' : ''} class="lue-textarea"></textarea>
</div>`;
const textarea = () => $<HTMLTextAreaElement>('#brief');

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
});

describe('Textarea', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(
      <Field label="Project brief" hint="A few sentences is plenty." controlId="brief" error={MESSAGE}>
        <Textarea name="brief" required minLength={20} data-lue-message-value-missing={MESSAGE} />
      </Field>,
    );
    expect(outline(react)).toEqual(outline(field(MESSAGE)));
  });

  it.runIf(CSS.supports('field-sizing', 'content'))('grows with its content', async () => {
    document.body.innerHTML = field();
    const before = textarea().getBoundingClientRect().height;
    // One input event: typing key by key is slow enough under load to time out in Firefox.
    await userEvent.fill(textarea(), 'One line.\nTwo.\nThree.\nFour.\nFive.\nSix.\nSeven.\nEight.');
    await frame();
    expect(textarea().getBoundingClientRect().height).toBeGreaterThan(before);
  });

  it('shows its error through data-lue-validate and clears it once it is long enough', async () => {
    document.body.innerHTML = `<form data-lue-validate="">${field()}<button type="submit" class="lue-button" id="submit">Send</button></form>`;
    const uninstall = installValidate(document);
    try {
      await userEvent.click($('#submit'));
      await frame();
      expect(textarea().getAttribute('aria-invalid')).toBe('true');
      expect($('#brief-error').textContent).toBe(`Error: ${MESSAGE}`);
      await userEvent.type(textarea(), 'A portfolio site for a ceramics studio.');
      expect(textarea().hasAttribute('aria-invalid')).toBe(false);
    } finally {
      uninstall();
    }
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}, valid and invalid`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${field()}${field(MESSAGE).replaceAll('brief', 'brief-2')}</main>`;
      await expectNoAxeViolations(document.body);
    });
  }
});

// Every key in the contract's keyboard map, with real input (tools/check-contracts.mjs checks each is pressed here).
describe('Textarea keyboard map', () => {
  it('Enter adds a line; Tab leaves', async () => {
    document.body.innerHTML = `${field()}<button type="button" class="lue-button" id="after">After</button>`;
    textarea().focus();
    await userEvent.keyboard('Side gate{Enter}Code 1234');
    expect(textarea().value).toBe('Side gate\nCode 1234');
    await tab();
    expect(document.activeElement).toBe($('#after'));
  });
});
