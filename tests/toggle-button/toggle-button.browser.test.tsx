// Toggle button (apps/docs/contracts/toggle-button.json): parity, the HTML path's data-lue-toggle behaviour (click,
// Enter and Space flip aria-pressed and fire lue-toggle; buttons without it are left alone), the React adapter
// uncontrolled and controlled, and axe in every theme. Chromium, Firefox and WebKit.
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { installToggle, togglePressed } from '@lue-ui/elements';
import { ToggleButton } from '@lue-ui/react';
import { $, expectNoAxeViolations, outline } from '../support/browser.js';

const html = '<button type="button" class="lue-button" aria-pressed="false" data-lue-toggle="" id="bold">Bold</button>';
const pressed = () => $('#bold').getAttribute('aria-pressed');

beforeAll(() => {
  installToggle(document);
});
afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
});

describe('Toggle button', () => {
  it('renders the same markup from React as the HTML core, without the behaviour attribute', () => {
    expect(outline(renderToStaticMarkup(<ToggleButton id="bold">Bold</ToggleButton>))).toEqual(outline(html.replace(' data-lue-toggle=""', '')));
  });

  it('works out the next state', () => {
    expect([togglePressed('false'), togglePressed('true'), togglePressed('mixed'), togglePressed(null)]).toEqual([true, false, true, true]);
  });

  it('flips aria-pressed on click, Enter and Space, and says so', async () => {
    document.body.innerHTML = html;
    const heard = vi.fn();
    document.addEventListener('lue-toggle', (e) => heard((e as CustomEvent).detail.pressed), { once: false });
    await userEvent.click($('#bold'));
    expect(pressed()).toBe('true');
    $('#bold').focus();
    await userEvent.keyboard('{Enter}');
    expect(pressed()).toBe('false');
    await userEvent.keyboard(' ');
    expect(pressed()).toBe('true');
    expect(heard.mock.calls.map((c) => c[0])).toEqual([true, false, true]);
  });

  it('leaves buttons without data-lue-toggle, and cancelled clicks, alone', async () => {
    document.body.innerHTML = `${html.replace(' data-lue-toggle=""', '')}<button type="button" class="lue-button" aria-pressed="false" data-lue-toggle="" id="italic">Italic</button>`;
    $('#italic').addEventListener('click', (e) => e.preventDefault());
    await userEvent.click($('#bold'));
    await userEvent.click($('#italic'));
    expect(pressed()).toBe('false');
    expect($('#italic').getAttribute('aria-pressed')).toBe('false');
  });

  it('keeps its own state in React, or follows props when controlled', async () => {
    const changes: boolean[] = [];
    function Controlled() {
      const [on, setOn] = useState(true);
      return <ToggleButton id="italic" pressed={on} onPressedChange={(next) => { changes.push(next); setOn(next); }}>Italic</ToggleButton>;
    }
    const host = document.body.appendChild(document.createElement('div'));
    const root = createRoot(host);
    await act(async () => root.render(<><ToggleButton id="bold">Bold</ToggleButton><Controlled /></>));
    await userEvent.click($('#bold'));
    expect(pressed()).toBe('true');
    await userEvent.click($('#italic'));
    expect($('#italic').getAttribute('aria-pressed')).toBe('false');
    expect(changes).toEqual([false]);
    await act(async () => root.unmount());
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe pressed and not in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${html}${html.replace('false', 'true').replace('bold', 'bold-2')}</main>`;
      await expectNoAxeViolations(document.body);
    });
  }
});
