// Tooltip (apps/docs/contracts/tooltip.json): parity, the description read without script, shown after a hover and at
// once on keyboard focus, kept while the pointer moves onto it, hidden when pointer and focus leave, Escape hides it
// (and only it) without moving focus, axe in every theme. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import '@lue-ui/elements/define';
import { TOOLTIP_DELAY, TOOLTIP_HIDE_DELAY } from '@lue-ui/elements';
import { Button, Tooltip, tooltipTrigger } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, focusDocument, frame, outline, resetMedia, tab } from '../support/browser.js';

const html = `<button type="button" class="lue-button" aria-describedby="save-tip" data-lue-tooltip="save-tip" id="save">Save</button><span popover="manual" role="tooltip" class="lue-tooltip" id="save-tip">Saves a draft; nothing is published.</span>`;
const tip = () => $('#save-tip');
const open = () => tip().matches(':popover-open');
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const mount = async () => {
  await page.viewport(800, 400);
  await emulate({ reducedMotion: 'reduce' });
  document.body.innerHTML = `<main style="padding:80px"><button type="button" class="lue-button" id="before">Before</button> ${html} <button type="button" class="lue-button" id="after">After</button></main>`;
  await frame();
};

afterEach(async () => {
  if (document.querySelector('.lue-tooltip:popover-open')) tip().hidePopover();
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Tooltip', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(<><Button {...tooltipTrigger('save-tip')} id="save">Save</Button><Tooltip id="save-tip">Saves a draft; nothing is published.</Tooltip></>);
    expect(outline(react)).toEqual(outline(html));
  });

  it('shows after a hover, stays while the pointer moves onto it, and hides when it leaves', async () => {
    await mount();
    await userEvent.hover($('#save'));
    expect(open()).toBe(false);
    await wait(TOOLTIP_DELAY + 100);
    expect(open()).toBe(true);
    await userEvent.hover(tip());
    await wait(TOOLTIP_HIDE_DELAY + 100);
    expect(open()).toBe(true);
    await userEvent.hover($('#after'));
    await wait(TOOLTIP_HIDE_DELAY + 100);
    expect(open()).toBe(false);
  });

  it('shows at once on keyboard focus, and hides when focus moves on', async () => {
    await mount();
    $('#before').focus();
    await tab();
    await wait(50);
    expect(open()).toBe(true);
    await tab();
    await wait(TOOLTIP_HIDE_DELAY + 100);
    expect(open()).toBe(false);
  });

  it('hides on Escape and leaves focus where it was; Escape in a dialog closes only the tooltip', async () => {
    await mount();
    $('#before').focus();
    await tab();
    await wait(50);
    await userEvent.keyboard('{Escape}');
    expect(open()).toBe(false);
    expect(document.activeElement).toBe($('#save'));
    document.body.innerHTML = `<dialog id="d" class="lue-dialog"><button type="button" class="lue-button" id="first">First</button> ${html}</dialog>`;
    $<HTMLDialogElement>('#d').showModal();
    focusDocument();
    $('#first').focus();
    await tab();
    await wait(50);
    expect(open()).toBe(true);
    await userEvent.keyboard('{Escape}');
    await frame();
    expect(open()).toBe(false);
    expect($<HTMLDialogElement>('#d').open).toBe(true);
    $<HTMLDialogElement>('#d').close();
  });

  it('describes its trigger with or without the script', () => {
    document.body.innerHTML = html;
    expect($('#save').getAttribute('aria-describedby')).toBe('save-tip');
    expect(tip().textContent).toBe('Saves a draft; nothing is published.');
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}, shown`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${html}</main>`;
      tip().showPopover();
      await expectNoAxeViolations(document.body);
    });
  }
});
