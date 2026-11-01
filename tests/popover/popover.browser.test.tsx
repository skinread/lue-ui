// Popover (apps/docs/contracts/popover.json): parity, opened and closed by its button with no script, Esc and light
// dismiss, anchored under its button, axe open in every theme, forced colours. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Popover, PopoverTrigger } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, frame, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const html = `
<button type="button" class="lue-button" command="toggle-popover" commandfor="share" id="trigger">Share</button>
<div class="lue-popover" popover="auto" id="share"><p>Copy the link or send it by email.</p><a href="#copy" id="inside">Copy link</a></div>`;
const popover = () => $('#share');
const open = () => popover().matches(':popover-open');
const openWithKeyboard = async () => {
  $('#trigger').focus();
  await userEvent.keyboard('{Enter}');
  await frame();
};

afterEach(async () => {
  if (document.querySelector(':popover-open')) document.querySelector<HTMLElement>(':popover-open')!.hidePopover();
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Popover', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(
      <>
        <PopoverTrigger target="share" id="trigger">Share</PopoverTrigger>
        <Popover id="share"><p>Copy the link or send it by email.</p><a href="#copy" id="inside">Copy link</a></Popover>
      </>,
    );
    expect(outline(react)).toEqual(outline(html));
  });

  it('opens and closes from its button, and Esc closes it', async () => {
    document.body.innerHTML = `<main>${html}</main>`;
    await openWithKeyboard();
    expect(open()).toBe(true);
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(open()).toBe(false);
    await openWithKeyboard();
    await userEvent.keyboard('{Escape}');
    await frame();
    expect(open()).toBe(false);
  });

  it('closes on a click outside (light dismiss)', async () => {
    document.body.innerHTML = `<main><p id="outside">Elsewhere</p>${html}</main>`;
    await openWithKeyboard();
    await userEvent.click($('#outside'));
    await frame();
    expect(open()).toBe(false);
  });

  it('sits under its button where anchor positioning exists', async () => {
    document.body.innerHTML = `<main style="padding:40px">${html}</main>`;
    await openWithKeyboard();
    if (!CSS.supports('position-area: block-end')) return;
    const trigger = $('#trigger').getBoundingClientRect();
    const box = popover().getBoundingClientRect();
    expect(box.top).toBeGreaterThanOrEqual(trigger.bottom);
    // It may flip along the line to fit, but it always overlaps its button's span.
    expect(box.left).toBeLessThan(trigger.right);
    expect(box.right).toBeGreaterThan(trigger.left);
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe open in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${html}</main>`;
      await openWithKeyboard();
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('is Canvas with a CanvasText border in forced colours', async () => {
    document.body.innerHTML = `<main>${html}</main>`;
    await emulate({ forcedColors: 'active', reducedMotion: 'reduce' });
    await openWithKeyboard();
    const style = getComputedStyle(popover());
    expect(style.backgroundColor).toBe(resolveColor('Canvas'));
    expect(style.borderBlockStartColor).toBe(resolveColor('CanvasText'));
  });
});

// Every key in the contract's keyboard map, with real input (tools/check-contracts.mjs checks each is pressed here).
describe('Popover keyboard map', () => {
  it('Space opens it; Tab moves into it from its button', async () => {
    document.body.innerHTML = `<main>${html}</main>`;
    $('#trigger').focus();
    await userEvent.keyboard(' ');
    await frame();
    expect(open()).toBe(true);
    await tab();
    expect(document.activeElement).toBe($('#inside'));
  });
});
