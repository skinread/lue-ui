// Menu (apps/docs/contracts/menu.json). Spike A covers the keyboard model inside a dialog on both paths; this adds the
// menu on its own: ArrowDown/ArrowUp on its button, no writes, axe in every theme, and forced colours.
// Chromium, Firefox and WebKit.
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import '@lue-ui/elements/define';
import { $, emulate, expectNoAxeViolations, frame, resetMedia, resolveColor, tab } from '../support/browser.js';

const html = `
<main>
  <button type="button" class="lue-button" aria-haspopup="menu" command="toggle-popover" commandfor="sort" id="trigger">Sort by</button>
  <button type="button" class="lue-button" id="other">Another button</button>
  <lue-menu class="lue-menu" popover="" role="menu" id="sort" aria-labelledby="trigger">
    <button type="button" class="lue-menu__item" role="menuitem" tabindex="-1">Newest first</button>
    <button type="button" class="lue-menu__item" role="menuitem" tabindex="-1">Oldest first</button>
    <div class="lue-menu__separator" role="separator"></div>
    <button type="button" class="lue-menu__item" role="menuitem" tabindex="-1">Title, A to Z</button>
    <button type="button" class="lue-menu__item" role="menuitem" tabindex="-1" data-tone="critical">Clear sorting</button>
  </lue-menu>
</main>`;

const menu = () => $('#sort');
const open = () => menu().matches(':popover-open');
const focusedText = () => document.activeElement?.textContent;

beforeAll(async () => {
  await customElements.whenDefined('lue-menu');
});
beforeEach(() => {
  document.body.innerHTML = html;
});
afterEach(async () => {
  if (document.querySelector('#sort:popover-open')) menu().hidePopover();
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Menu', () => {
  it('opens at the first item on ArrowDown and the last on ArrowUp', async () => {
    $('#trigger').focus();
    await userEvent.keyboard('{ArrowDown}');
    await frame();
    expect(open()).toBe(true);
    expect(focusedText()).toBe('Newest first');
    await userEvent.keyboard('{Escape}');
    await frame();
    expect(open()).toBe(false);
    expect(document.activeElement).toBe($('#trigger'));
    await userEvent.keyboard('{ArrowUp}');
    await frame();
    expect(open()).toBe(true);
    expect(focusedText()).toBe('Clear sorting');
  });

  it('leaves arrow keys on other buttons alone', async () => {
    $('#other').focus();
    await userEvent.keyboard('{ArrowDown}');
    await frame();
    expect(open()).toBe(false);
    expect(document.activeElement).toBe($('#other'));
  });

  it('opens at the first item with Enter, as before', async () => {
    $('#trigger').focus();
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(focusedText()).toBe('Newest first');
  });

  it('writes nothing to the DOM (ADR-0007)', async () => {
    const records: MutationRecord[] = [];
    const observer = new MutationObserver((r) => records.push(...r));
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
    $('#trigger').focus();
    await userEvent.keyboard('{ArrowUp}');
    await frame();
    await userEvent.keyboard('{ArrowUp}{Escape}');
    await frame();
    observer.disconnect();
    expect(records.map((r) => `${r.type} ${r.attributeName ?? ''} on ${(r.target as Element).id || r.target.nodeName}`)).toEqual([]);
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe open in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      $('#trigger').focus();
      await userEvent.keyboard('{ArrowDown}');
      await frame();
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('uses Canvas, and Highlight on the focused item, in forced colours', async () => {
    await emulate({ forcedColors: 'active', reducedMotion: 'reduce' });
    $('#trigger').focus();
    await userEvent.keyboard('{ArrowDown}');
    await frame();
    expect(getComputedStyle(menu()).backgroundColor).toBe(resolveColor('Canvas'));
    expect(getComputedStyle(menu(), '::before').content).toBe('none');
    const item = document.activeElement as HTMLElement;
    expect(getComputedStyle(item).backgroundColor).toBe(resolveColor('Highlight'));
    expect(getComputedStyle(item).color).toBe(resolveColor('HighlightText'));
  });
});

// Every key in the contract's keyboard map, with real input (tools/check-contracts.mjs checks each is pressed here).
describe('Menu keyboard map', () => {
  it('Space on its button opens it at the first item', async () => {
    $('#trigger').focus();
    await userEvent.keyboard(' ');
    await frame();
    expect(focusedText()).toBe('Newest first');
  });

  it('PageDown and PageUp go to the last and first items; Space activates and closes', async () => {
    $('#trigger').focus();
    await userEvent.keyboard('{ArrowDown}');
    await frame();
    await userEvent.keyboard('{PageDown}');
    expect(focusedText()).toBe('Clear sorting');
    await userEvent.keyboard('{PageUp}');
    expect(focusedText()).toBe('Newest first');
    await userEvent.keyboard(' ');
    await frame();
    expect(open()).toBe(false);
  });

  it('Tab closes it and moves on from its button', async () => {
    $('#trigger').focus();
    await userEvent.keyboard('{ArrowDown}');
    await frame();
    await tab();
    await frame();
    expect(open()).toBe(false);
    expect(document.activeElement).toBe($('#other'));
  });
});
