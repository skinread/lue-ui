// Toggletip (apps/docs/contracts/toggletip.json): parity, a named button that shows its help on click or Enter and
// hides it on Esc, the help after the button in reading order, and axe open in every theme. Chromium, Firefox and
// WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Toggletip } from '@lue-ui/react';
import { $, expectNoAxeViolations, frame, outline } from '../support/browser.js';

const html = `
<button type="button" class="lue-button" data-size="sm" data-icon-only="" aria-label="More about delivery" command="toggle-popover" commandfor="delivery-tip"><svg class="lue-button__icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M6 6a2 2 0 1 1 2.5 1.94c-.3.08-.5.35-.5.66V9.5M8 11.5v.5" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg></button>
<span id="delivery-tip" popover="auto" data-variant="tip" class="lue-popover">Orders placed before 2pm go out today.</span>`;
const tip = () => $('#delivery-tip');

afterEach(() => {
  if (document.querySelector(':popover-open')) document.querySelector<HTMLElement>(':popover-open')!.hidePopover();
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
});

describe('Toggletip', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(<Toggletip id="delivery-tip" label="More about delivery">Orders placed before 2pm go out today.</Toggletip>);
    expect(outline(react)).toEqual(outline(html));
  });

  it('shows its help on Enter and on click, and Esc hides it', async () => {
    document.body.innerHTML = `<main><p>Delivery ${html}</p></main>`;
    $('button').focus();
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(tip().matches(':popover-open')).toBe(true);
    await userEvent.keyboard('{Escape}');
    await frame();
    expect(tip().matches(':popover-open')).toBe(false);
    await userEvent.click($('button'));
    await frame();
    expect(tip().matches(':popover-open')).toBe(true);
    expect($('button').compareDocumentPosition(tip()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe open in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main><p>Delivery ${html}</p></main>`;
      tip().showPopover();
      await expectNoAxeViolations(document.body);
    });
  }
});

// Every key in the contract's keyboard map, with real input (tools/check-contracts.mjs checks each is pressed here).
describe('Toggletip keyboard map', () => {
  it('Space shows the help', async () => {
    document.body.innerHTML = `<main><p>Delivery ${html}</p></main>`;
    $('button').focus();
    await userEvent.keyboard(' ');
    await frame();
    expect(tip().matches(':popover-open')).toBe(true);
  });
});
