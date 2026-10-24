// Dialog (apps/docs/contracts/dialog.json). Spike A proved commands, Esc stacking and focus hand-off with a menu
// inside; this covers the component on its own: markup parity, initial focus, focus staying inside, Esc and focus
// return, form method="dialog", light dismiss where supported, scroll lock, the transition, axe in every theme,
// forced colours, and the controlled-without-onOpenChange warning. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { act, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Button, Dialog, DialogTrigger } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, frame, outline, resetMedia, resolveColor, shiftTab, tab } from '../support/browser.js';

const html = `
<main>
  <button type="button" class="lue-button" data-variant="danger" command="show-modal" commandfor="confirm" id="open">Delete…</button>
  <p>Page content behind the dialog.</p>
  <a href="#top" id="behind">A link behind it</a>
</main>
<dialog class="lue-dialog" id="confirm" closedby="any" aria-labelledby="confirm-title">
  <h2 class="lue-dialog__title" id="confirm-title">Delete this project?</h2>
  <p class="lue-dialog__body">You can't undo this.</p>
  <form method="dialog" class="lue-dialog__actions">
    <button type="submit" class="lue-button" value="cancel" autofocus="" id="cancel">Cancel</button>
    <button type="submit" class="lue-button" data-variant="danger" value="delete" id="delete">Delete</button>
  </form>
</dialog>`;

const dialog = () => $<HTMLDialogElement>('#confirm');
/** Opens from the keyboard, so focus return is checked in every engine (WebKit doesn't focus buttons on click). */
async function openByKeyboard() {
  $('#open').focus();
  await userEvent.keyboard('{Enter}');
  await frame();
}

afterEach(async () => {
  if (document.querySelector<HTMLDialogElement>('dialog[open]')) document.querySelector<HTMLDialogElement>('dialog[open]')!.close();
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Dialog', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(
      <>
        <main>
          <DialogTrigger dialog="confirm" variant="danger" id="open">Delete…</DialogTrigger>
          <p>Page content behind the dialog.</p>
          <a href="#top" id="behind">A link behind it</a>
        </main>
        <Dialog id="confirm" aria-labelledby="confirm-title">
          <h2 className="lue-dialog__title" id="confirm-title">Delete this project?</h2>
          <p className="lue-dialog__body">You can&apos;t undo this.</p>
          <form method="dialog" className="lue-dialog__actions">
            <Button type="submit" value="cancel" autoFocus id="cancel">Cancel</Button>
            <Button type="submit" variant="danger" value="delete" id="delete">Delete</Button>
          </form>
        </Dialog>
      </>,
    );
    expect(outline(react)).toEqual(outline(html));
  });

  it('opens modally on its autofocus button, keeps focus inside, and Esc returns focus', async () => {
    document.body.innerHTML = html;
    await openByKeyboard();
    expect(dialog().matches(':modal')).toBe(true);
    expect(document.activeElement).toBe($('#cancel'));
    // Tab moves within the dialog; past its last control a native modal hands focus to the browser's own UI, which a
    // test frame can't follow (WebKit hung there), so the page behind is checked by trying to focus it instead.
    await tab();
    expect(document.activeElement).toBe($('#delete'));
    await shiftTab();
    expect(document.activeElement).toBe($('#cancel'));
    $('#behind').focus();
    expect(document.activeElement, 'the page behind is inert').toBe($('#cancel'));
    await userEvent.keyboard('{Escape}');
    await frame();
    expect(dialog().open).toBe(false);
    expect(document.activeElement).toBe($('#open'));
  });

  it('closes with the chosen button through form method="dialog"', async () => {
    document.body.innerHTML = html;
    await openByKeyboard();
    await userEvent.click($('#delete'));
    await frame();
    expect(dialog().open).toBe(false);
    expect(dialog().returnValue).toBe('delete');
  });

  it.runIf('closedBy' in HTMLDialogElement.prototype)('closes on a backdrop click (closedby="any")', async () => {
    document.body.innerHTML = html;
    await openByKeyboard();
    await userEvent.click(document.body, { position: { x: 5, y: 5 } });
    await frame();
    expect(dialog().open).toBe(false);
  });

  it('locks page scroll while open, keeping the gutter', async () => {
    document.body.innerHTML = html;
    await openByKeyboard();
    expect(getComputedStyle(document.documentElement).overflow).toBe('hidden');
    expect(getComputedStyle(document.documentElement).scrollbarGutter).toBe('stable');
    dialog().close();
    expect(getComputedStyle(document.documentElement).overflow).toBe('visible');
  });

  it('transitions in, and not at all under reduced motion', async () => {
    document.body.innerHTML = html;
    expect(getComputedStyle(dialog()).transitionDuration.split(',').some((d) => parseFloat(d) > 0)).toBe(true);
    await emulate({ reducedMotion: 'reduce' });
    expect(getComputedStyle(dialog()).transitionDuration.split(',').every((d) => parseFloat(d) === 0)).toBe(true);
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe open in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = html;
      await openByKeyboard();
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('uses Canvas and a visible boundary in forced colours', async () => {
    document.body.innerHTML = html;
    await emulate({ forcedColors: 'active', reducedMotion: 'reduce' });
    await openByKeyboard();
    const style = getComputedStyle(dialog());
    expect(style.backgroundColor).toBe(resolveColor('Canvas'));
    expect(style.borderTopColor).toBe(resolveColor('CanvasText'));
    expect(style.backdropFilter).toBe('none');
    expect(getComputedStyle(dialog(), '::before').content).toBe('none');
  });

  it('warns once in development when open is controlled without onOpenChange', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    function Uncontrolled(): ReactNode {
      const [open] = useState(false);
      return <Dialog id="d" aria-label="Settings" open={open}>Settings</Dialog>;
    }
    const root = createRoot(document.body.appendChild(document.createElement('div')));
    await act(async () => root.render(<><Uncontrolled /><Uncontrolled /></>));
    expect(warn.mock.calls.filter(([m]) => String(m).includes('onOpenChange'))).toHaveLength(1);
    await act(async () => root.unmount());
    warn.mockRestore();
  });
});

// Every key in the contract's keyboard map, with real input (tools/check-contracts.mjs checks each is pressed here).
describe('Dialog keyboard map', () => {
  it('Shift+Tab moves back within it', async () => {
    document.body.innerHTML = html;
    await openByKeyboard();
    expect(document.activeElement).toBe($('#cancel'));
    await tab();
    expect(document.activeElement).toBe($('#delete'));
    await shiftTab();
    expect(document.activeElement).toBe($('#cancel'));
  });
});
