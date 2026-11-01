// Toolbar (apps/docs/contracts/toolbar.json): parity, one Tab stop that remembers the last control, arrow keys
// (horizontal, vertical, mirrored in RTL), Home and End, disabled controls skipped, text fields keep their keys, only
// tabindex written, axe in every theme. Chromium, Firefox and WebKit.
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import '@lue-ui/elements/define';
import { ToggleButton, Toolbar } from '@lue-ui/react';
import { $, expectNoAxeViolations, focusDocument, frame, outline, shiftTab, tab } from '../support/browser.js';

const button = (id: string, label: string, extra = '') => `<button type="button" class="lue-button" aria-pressed="false" id="${id}"${extra}>${label}</button>`;
const html = (orientation = '') => `
<lue-roving role="toolbar" aria-label="Text formatting"${orientation ? ` aria-orientation="${orientation}"` : ''} class="lue-toolbar">
  ${button('bold', 'Bold')}${button('italic', 'Italic')}<span role="separator"></span>${button('strike', 'Strike', ' disabled=""')}${button('code', 'Code')}
</lue-roving>`;
const page = (markup = html()) => `<main><button type="button" class="lue-button" id="before">Before</button>${markup}<button type="button" class="lue-button" id="after">After</button></main>`;
const at = () => document.activeElement?.id;

beforeAll(async () => {
  await customElements.whenDefined('lue-roving');
});
afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('dir');
  document.body.replaceChildren();
});

describe('Toolbar', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(
      <Toolbar aria-label="Text formatting">
        <ToggleButton id="bold">Bold</ToggleButton>
        <ToggleButton id="italic">Italic</ToggleButton>
        <span role="separator" />
        <ToggleButton id="strike" disabled>Strike</ToggleButton>
        <ToggleButton id="code">Code</ToggleButton>
      </Toolbar>,
    );
    expect(outline(react)).toEqual(outline(html()));
  });

  it('is one Tab stop that remembers the last control used', async () => {
    document.body.innerHTML = page();
    await frame();
    $('#before').focus();
    await tab();
    expect(at()).toBe('bold');
    await tab();
    expect(at()).toBe('after');
    $('#italic').focus();
    await shiftTab();
    expect(at()).toBe('before');
    await tab();
    expect(at()).toBe('italic');
  });

  it('moves with ArrowRight and ArrowLeft, skips disabled controls, and Home and End go to the ends', async () => {
    document.body.innerHTML = page();
    await frame();
    $('#bold').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(at()).toBe('italic');
    await userEvent.keyboard('{ArrowRight}');
    expect(at()).toBe('code');
    await userEvent.keyboard('{ArrowRight}');
    expect(at()).toBe('code');
    await userEvent.keyboard('{Home}');
    expect(at()).toBe('bold');
    await userEvent.keyboard('{End}');
    expect(at()).toBe('code');
    await userEvent.keyboard('{ArrowLeft}');
    expect(at()).toBe('italic');
  });

  it('uses ArrowDown and ArrowUp when vertical', async () => {
    document.body.innerHTML = page(html('vertical'));
    await frame();
    $('#bold').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(at()).toBe('italic');
    await userEvent.keyboard('{ArrowUp}');
    expect(at()).toBe('bold');
  });

  it('mirrors the arrows in right-to-left text', async () => {
    document.documentElement.dir = 'rtl';
    document.body.innerHTML = page();
    await frame();
    $('#bold').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(at()).toBe('italic');
  });

  it('leaves a text field its own arrow keys', async () => {
    document.body.innerHTML = page(html().replace('<span role="separator"></span>', '<input class="lue-input" id="size" aria-label="Size" value="12">'));
    await frame();
    $('#size').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(at()).toBe('size');
  });

  it('writes only tabindex (ADR-0007)', async () => {
    document.body.innerHTML = '<div id="host"></div>';
    const records: MutationRecord[] = [];
    const observer = new MutationObserver((r) => records.push(...r));
    observer.observe($('#host'), { subtree: true, attributes: true });
    $('#host').innerHTML = page();
    await frame();
    $('#bold').focus();
    await userEvent.keyboard('{ArrowRight}');
    observer.disconnect();
    expect([...new Set(records.map((r) => r.attributeName))]).toEqual(['tabindex']);
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = page();
      await frame();
      await expectNoAxeViolations(document.body);
    });
  }
});
