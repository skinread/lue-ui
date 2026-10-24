// Drawer (apps/docs/contracts/drawer.json): parity, opened with no script, docked to each edge (and mirrored in
// right-to-left text), Esc closes it and focus returns, axe open in every theme. Chromium, Firefox and WebKit. The
// rest of its behaviour is Dialog's (tests/dialog).
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { DialogTrigger, Drawer } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, frame, outline, resetMedia, tab } from '../support/browser.js';

const html = (side = 'inline-end') => `
<button type="button" class="lue-button" command="show-modal" commandfor="filters" id="open">Filters</button>
<dialog class="lue-dialog" id="filters" closedby="any" aria-labelledby="filters-title" data-side="${side}">
  <h2 class="lue-dialog__title" id="filters-title">Filters</h2>
  <form method="dialog"><button type="submit" class="lue-button" autofocus="">Done</button></form>
</dialog>`;
const drawer = () => $<HTMLDialogElement>('#filters');
async function open() {
  $('#open').focus();
  await userEvent.keyboard('{Enter}');
  await frame();
}

afterEach(async () => {
  if (document.querySelector<HTMLDialogElement>('dialog[open]')) document.querySelector<HTMLDialogElement>('dialog[open]')!.close();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('dir');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Drawer', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(
      <>
        <DialogTrigger dialog="filters" id="open">Filters</DialogTrigger>
        <Drawer id="filters" aria-labelledby="filters-title">
          <h2 className="lue-dialog__title" id="filters-title">Filters</h2>
          <form method="dialog"><button type="submit" className="lue-button" autoFocus>Done</button></form>
        </Drawer>
      </>,
    );
    expect(outline(react)).toEqual(outline(html()));
  });

  // Edges of the viewport less its scrollbar, measured with a fixed full-viewport probe.
  const viewport = () => {
    const probe = document.body.appendChild(Object.assign(document.createElement('div'), { style: 'position:fixed;inset:0' }));
    const rect = probe.getBoundingClientRect();
    probe.remove();
    return rect;
  };
  const near = (a: number, b: number) => Math.abs(a - b) < 1;
  const edges: [string, string, (r: DOMRect, v: DOMRect) => boolean][] = [
    ['inline-end', 'ltr', (r, v) => near(r.right, v.right) && near(r.top, v.top) && near(r.bottom, v.bottom)],
    ['inline-start', 'ltr', (r, v) => near(r.left, v.left) && near(r.top, v.top) && near(r.bottom, v.bottom)],
    ['inline-end', 'rtl', (r, v) => near(r.left, v.left)],
    ['block-end', 'ltr', (r, v) => near(r.bottom, v.bottom) && near(r.left, v.left) && near(r.right, v.right)],
  ];
  for (const [side, dir, docked] of edges) {
    it(`docks to the ${side} edge in ${dir}`, async () => {
      await emulate({ reducedMotion: 'reduce' });
      document.documentElement.dir = dir;
      document.body.innerHTML = `<main>${html(side)}</main>`;
      await open();
      expect(drawer().matches(':modal')).toBe(true);
      const rect = drawer().getBoundingClientRect();
      const view = viewport();
      expect(docked(rect, view), JSON.stringify([rect, view])).toBe(true);
    });
  }

  it('closes on Esc and gives focus back to its button', async () => {
    document.body.innerHTML = `<main>${html()}</main>`;
    await open();
    await userEvent.keyboard('{Escape}');
    await frame();
    expect(drawer().open).toBe(false);
    expect(document.activeElement).toBe($('#open'));
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe open in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${html()}</main>`;
      await open();
      await expectNoAxeViolations(document.body);
    });
  }
});

// Every key in the contract's keyboard map, with real input (tools/check-contracts.mjs checks each is pressed here).
describe('Drawer keyboard map', () => {
  it('Tab moves between its controls', async () => {
    document.body.innerHTML = `<main>${html().replace('<button type="submit" class="lue-button" autofocus="">Done</button>', '<button type="submit" class="lue-button" autofocus="" id="done">Done</button><button type="submit" class="lue-button" id="reset">Reset</button>')}</main>`;
    await open();
    expect(document.activeElement).toBe($('#done'));
    await tab();
    expect(document.activeElement).toBe($('#reset'));
  });
});
