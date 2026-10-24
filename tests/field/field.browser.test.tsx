// Field + TextInput + error summary (apps/docs/contracts/field.json), on both paths: the HTML core with the
// data-lue-validate behaviour, and the React adapter with useValidation. Chromium, Firefox and WebKit.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { installValidate } from '@lue-ui/elements';
import { ErrorSummary, Field, TextInput, useValidation } from '@lue-ui/react';
import { $, expectNoAxeViolations, frame, outline, tab } from '../support/browser.js';

const NAME = 'Enter your full name';
const EMAIL_MISSING = 'Enter your email address';
const EMAIL_FORMAT = 'Enter an email address in the right format, like name@example.com';

/** The HTML core. `summary` renders a server-side error state; `validate` adds the opt-in behaviour marker. */
const markup = ({ validate = true, summary = '', nameError = '', marker = true } = {}) => `
<form id="checkout"${validate ? ' data-lue-validate=""' : ''}>
  <div class="lue-error-summary"${marker ? ' data-lue-error-summary=""' : ''} id="summary" tabindex="-1"${summary ? '' : ' hidden=""'}>
    <div role="alert">
      <h2 class="lue-error-summary__title" id="summary-title">There is a problem</h2>
      <ul class="lue-error-summary__list" aria-labelledby="summary-title">${summary}</ul>
    </div>
  </div>
  <div class="lue-field">
    <label class="lue-field__label" for="name">Full name</label>
    <p class="lue-field__error" id="name-error"${nameError ? '' : ' hidden=""'}><span class="lue-visually-hidden">Error: </span><span class="lue-field__message">${nameError}</span></p>
    <input class="lue-input" id="name" name="name" autocomplete="name" required="" aria-describedby="name-error"${nameError ? ' aria-invalid="true"' : ''} data-lue-message-value-missing="${NAME}">
  </div>
  <div class="lue-field">
    <label class="lue-field__label" for="email">Email address</label>
    <p class="lue-field__hint" id="email-hint">For your receipt.</p>
    <p class="lue-field__error" id="email-error" hidden=""><span class="lue-visually-hidden">Error: </span><span class="lue-field__message"></span></p>
    <input class="lue-input" id="email" name="email" type="email" autocomplete="email" required="" aria-describedby="email-hint email-error" data-lue-message-value-missing="${EMAIL_MISSING}" data-lue-message-type-mismatch="${EMAIL_FORMAT}">
  </div>
  <button type="submit" class="lue-button" data-variant="primary" id="submit">Continue</button>
</form>`;

const visible = (el: HTMLElement) => !el.hidden && getComputedStyle(el).display !== 'none';
const links = () => [...document.querySelectorAll<HTMLAnchorElement>('#summary a')].map((a) => [a.getAttribute('href'), a.textContent]);
const submits: Event[] = [];
const recordSubmit = (event: Event) => {
  submits.push(event);
  event.preventDefault(); // stay on the page
};

let uninstall: (() => void) | undefined;
beforeEach(() => {
  submits.length = 0;
  document.addEventListener('submit', recordSubmit);
});
afterEach(() => {
  uninstall?.();
  uninstall = undefined;
  document.removeEventListener('submit', recordSubmit);
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
});

describe('HTML path', () => {
  it('leaves validation to the browser without the behaviour', async () => {
    document.body.innerHTML = markup();
    await userEvent.click($('#submit'));
    expect(submits, 'an invalid form never submits').toHaveLength(0);
    expect(visible($('#summary'))).toBe(false);
    expect($('#name').hasAttribute('aria-invalid')).toBe(false);
    // Firefox's validation popup is browser UI over the page and swallows clicks until its control blurs, which
    // removing the control doesn't do.
    (document.activeElement as HTMLElement | null)?.blur();
    await frame();
  });

  it('shows every error, links the summary and focuses it', async () => {
    document.body.innerHTML = markup();
    uninstall = installValidate(document);
    await userEvent.click($('#submit'));
    await frame();
    expect(submits).toHaveLength(0);
    expect(visible($('#summary'))).toBe(true);
    expect(document.activeElement).toBe($('#summary'));
    expect(links()).toEqual([['#name', NAME], ['#email', EMAIL_MISSING]]);
    expect($('#name').getAttribute('aria-invalid')).toBe('true');
    expect(visible($('#name-error'))).toBe(true);
    expect($('#name-error').textContent).toBe(`Error: ${NAME}`);
  });

  it('moves focus from a summary link to its control', async () => {
    document.body.innerHTML = markup();
    uninstall = installValidate(document);
    await userEvent.click($('#submit'));
    await frame();
    await userEvent.click($('#summary a[href="#email"]'));
    await frame();
    expect(document.activeElement).toBe($('#email'));
  });

  it('clears an error as soon as it is fixed, and uses the message for the failing constraint', async () => {
    document.body.innerHTML = markup();
    uninstall = installValidate(document);
    await userEvent.click($('#submit'));
    await frame();
    await userEvent.type($('#name'), 'Ada Lovelace');
    expect($('#name').hasAttribute('aria-invalid')).toBe(false);
    expect(visible($('#name-error'))).toBe(false);
    expect($('#name-error').querySelector('.lue-field__message')!.textContent).toBe('');
    await userEvent.type($('#email'), 'not-an-email');
    await userEvent.click($('#submit'));
    await frame();
    expect(links()).toEqual([['#email', EMAIL_FORMAT]]);
  });

  it('lets a valid form submit and hides the summary', async () => {
    document.body.innerHTML = markup();
    uninstall = installValidate(document);
    await userEvent.click($('#submit'));
    await frame();
    await userEvent.type($('#name'), 'Ada Lovelace');
    await userEvent.type($('#email'), 'ada@example.com');
    await userEvent.click($('#submit'));
    await frame();
    expect(submits).toHaveLength(1);
    expect(visible($('#summary'))).toBe(false);
  });

  it('writes only the attributes and text it owns (ADR-0007)', async () => {
    document.body.innerHTML = markup();
    uninstall = installValidate(document);
    const records: MutationRecord[] = [];
    const observer = new MutationObserver((r) => records.push(...r));
    observer.observe($('#checkout'), { subtree: true, childList: true, attributes: true, characterData: true });
    await userEvent.click($('#submit'));
    await frame();
    await userEvent.type($('#name'), 'A');
    observer.disconnect();
    const owned = (r: MutationRecord) => {
      const target = r.target instanceof Element ? r.target : r.target.parentElement!;
      if (r.type === 'attributes') {
        if (r.attributeName === 'aria-invalid') return target.matches('.lue-input');
        if (r.attributeName === 'hidden') return target.matches('.lue-field__error, [data-lue-error-summary]');
        return r.attributeName === 'value' && target.matches('.lue-input'); // typing, not the behaviour
      }
      return !!target.closest('.lue-field__message, .lue-error-summary__list');
    };
    expect(records.filter((r) => !owned(r)).map((r) => `${r.type} ${r.attributeName ?? ''} on ${(r.target as Element).id || r.target.nodeName}`)).toEqual([]);
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe with errors showing in ${theme}`, async () => {
      document.body.innerHTML = markup();
      document.documentElement.setAttribute('data-theme', theme);
      uninstall = installValidate(document);
      await userEvent.click($('#submit'));
      await frame();
      await expectNoAxeViolations($('#checkout'));
    });
  }
});

describe('React', () => {
  it('server-renders the same markup as the HTML core, in an error state', () => {
    const react = renderToStaticMarkup(
      <form id="checkout">
        <ErrorSummary id="summary" errors={[{ id: 'name', message: NAME }]} />
        <Field label="Full name" controlId="name" error={NAME}>
          <TextInput name="name" autoComplete="name" required data-lue-message-value-missing={NAME} />
        </Field>
        <Field label="Email address" hint="For your receipt." controlId="email">
          <TextInput name="email" type="email" autoComplete="email" required data-lue-message-value-missing={EMAIL_MISSING} data-lue-message-type-mismatch={EMAIL_FORMAT} />
        </Field>
        <button type="submit" className="lue-button" data-variant="primary" id="submit">Continue</button>
      </form>,
    );
    const html = markup({ validate: false, marker: false, summary: `<li><a href="#name">${NAME}</a></li>`, nameError: NAME });
    expect(outline(react)).toEqual(outline(html));
  });

  describe('useValidation', () => {
    let root: Root;
    const valid: string[] = [];
    function Checkout() {
      const [email, setEmail] = useState('');
      const { formProps, summaryProps, errorFor } = useValidation(() => valid.push(email));
      return (
        <form id="checkout" {...formProps}>
          <ErrorSummary id="summary" {...summaryProps} />
          <Field label="Full name" controlId="name" error={errorFor('name')}>
            <TextInput name="name" autoComplete="name" required data-lue-message-value-missing={NAME} />
          </Field>
          <Field label="Email address" hint="For your receipt." controlId="email" error={errorFor('email')}>
            <TextInput name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} data-lue-message-value-missing={EMAIL_MISSING} data-lue-message-type-mismatch={EMAIL_FORMAT} />
          </Field>
          <button type="submit" className="lue-button" id="submit">Continue</button>
        </form>
      );
    }
    beforeEach(async () => {
      valid.length = 0;
      const host = document.body.appendChild(document.createElement('div'));
      root = createRoot(host);
      await act(async () => root.render(<Checkout />));
    });
    afterEach(() => act(() => root.unmount()));

    it('stops an invalid submission, shows the errors and focuses the summary once', async () => {
      await userEvent.click($('#submit'));
      await frame();
      expect(submits.map((e) => e.defaultPrevented), 'React submits (noValidate) and the hook stops it').toEqual([true]);
      expect(links()).toEqual([['#name', NAME], ['#email', EMAIL_MISSING]]);
      expect(document.activeElement).toBe($('#summary'));
      expect($('#name').getAttribute('aria-invalid')).toBe('true');
      expect($('#name-error').textContent).toBe(`Error: ${NAME}`);
      await userEvent.click($('#summary a[href="#name"]'));
      await userEvent.type($('#name'), 'Ada');
      await frame();
      expect($('#name').hasAttribute('aria-invalid')).toBe(false);
      expect(document.activeElement, 'fixing a field never moves focus back to the summary').toBe($('#name'));
      expect(links()).toEqual([['#email', EMAIL_MISSING]]);
    });

    it('runs onValid for a valid submission', async () => {
      await userEvent.type($('#name'), 'Ada Lovelace');
      await userEvent.type($('#email'), 'ada@example.com');
      await userEvent.click($('#submit'));
      await frame();
      expect(valid).toEqual(['ada@example.com']);
      expect(visible($('#summary'))).toBe(false);
    });
  });
});

// Every key in the contract's keyboard map, with real input (tools/check-contracts.mjs checks each is pressed here).
describe('Field keyboard map', () => {
  it('Enter submits; Tab goes from the summary to its links; Enter on a link focuses its control', async () => {
    document.body.innerHTML = markup();
    uninstall = installValidate(document);
    $('#name').focus();
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(document.activeElement).toBe($('#summary'));
    expect(submits).toHaveLength(0);
    await tab();
    expect(document.activeElement).toBe($('#summary a'));
    await userEvent.keyboard('{Enter}');
    expect(document.activeElement).toBe($('#name'));
    await userEvent.fill($('#name'), 'Ada Lovelace');
    await userEvent.fill($('#email'), 'ada@example.com');
    $('#email').focus();
    await userEvent.keyboard('{Enter}');
    expect(submits).toHaveLength(1);
  });
});
