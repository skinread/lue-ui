// Spike A, HTML path: plain markup, then the elements bundle. Runs in Chromium, Firefox and WebKit.
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../../packages/css/src/components/dialog.css';
import '../../packages/css/src/components/menu.css';
import { html } from './fixture-html.js';
import * as s from './scenario.js';

const mutations: MutationRecord[] = [];
const observer = new MutationObserver((records) => mutations.push(...records));

beforeAll(() => {
  document.body.innerHTML = html;
  observer.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
});
afterAll(() => observer.disconnect());

afterEach(s.closeAll);

describe('HTML path', () => {
  it('opens the dialog and the menu with no script at all', async () => {
    expect(customElements.get('lue-menu')).toBeUndefined();
    await s.openDialogAndMenu('pointer');
    s.anchoring();
    await userEvent.keyboard('{Escape}');
    await s.settle();
    expect(s.parts().menu.matches(':popover-open'), 'Esc closes the menu without the element').toBe(false);
    await s.closeAll();
  });

  it('adds the keyboard model once the element is defined', async () => {
    await import('@lue-ui/elements/define');
    await customElements.whenDefined('lue-menu');
    await s.openDialogAndMenu();
    await s.keyboardModel();
  });

  it('passes axe with the dialog and menu open', async () => {
    await s.openDialogAndMenu();
    await s.noAxeViolations();
  });

  it('closes one layer per Escape', s.escapeStacking);

  it('runs an item, closes the menu and returns focus', async () => {
    const chosen: string[] = [];
    document.querySelector('#actions')!.addEventListener('click', (e) => chosen.push((e.target as HTMLElement).textContent!));
    await s.openDialogAndMenu();
    await s.activation(chosen);
  });

  it('closes the menu on Tab', s.tabOut);

  it('never writes to the DOM itself (ADR-0007)', async () => {
    await s.closeAll();
    // The browser sets <dialog open>; nothing else may change.
    const foreign = mutations.filter((m) => !(m.type === 'attributes' && m.attributeName === 'open' && m.target === s.parts().dialog));
    expect(foreign.map((m) => `${m.type} ${m.attributeName ?? ''} on ${(m.target as Element).id || m.target.nodeName}`)).toEqual([]);
  });
});
