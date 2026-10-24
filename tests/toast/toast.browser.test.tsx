// Toast (apps/docs/contracts/toast.json): <lue-toast-region> announces (ariaNotify or its live region), shows, times
// out, pauses while hovered, keeps actions until used, dismisses on Esc with focus going back, queues past three,
// owns only its children, and passes axe in every theme. Chromium, Firefox and WebKit.
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import '@lue-ui/elements/define';
import type { LueToastRegion } from '@lue-ui/elements';
import { showToast, ToastRegion } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, frame, outline, resetMedia } from '../support/browser.js';

const region = () => $<LueToastRegion>('lue-toast-region');
const toasts = () => [...document.querySelectorAll('.lue-toast')].map((t) => t.querySelector('.lue-toast__message')!.textContent);
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const mount = async () => {
  document.body.innerHTML = '<main><button type="button" class="lue-button" id="save">Save</button></main><lue-toast-region></lue-toast-region>';
  await customElements.whenDefined('lue-toast-region');
};

beforeAll(async () => {
  await customElements.whenDefined('lue-toast-region');
});
afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Toast', () => {
  it('renders the same empty element from React as the HTML core', () => {
    expect(outline(renderToStaticMarkup(<ToastRegion dismiss-label="Fermer" />))).toEqual(outline('<lue-toast-region dismiss-label="Fermer"></lue-toast-region>'));
  });

  it('announces and shows a toast, from React too', async () => {
    await mount();
    const notify = vi.fn();
    const native = 'ariaNotify' in region();
    if (native) (region() as unknown as { ariaNotify: typeof notify }).ariaNotify = notify;
    showToast('Saved');
    await frame();
    expect(toasts()).toEqual(['Saved']);
    expect($('.lue-toast-region__list').matches(':popover-open')).toBe(true);
    if (native) expect(notify).toHaveBeenCalledWith('Saved');
    else expect($('lue-toast-region [role="status"]').textContent).toBe('Saved');
  });

  it('leaves after its duration, but not while hovered', async () => {
    // A short frame, so the toast at its bottom stays within reach while other test files share the page.
    await page.viewport(600, 400);
    await emulate({ reducedMotion: 'reduce' });
    await mount();
    // Long enough for a loaded engine to hover it before it leaves.
    region().show('Saved', { duration: 2000 });
    await frame();
    await userEvent.hover($('.lue-toast'));
    await wait(2500);
    expect(toasts()).toEqual(['Saved']);
    await userEvent.hover($('#save'));
    await wait(2500);
    expect(toasts()).toEqual([]);
    expect($('.lue-toast-region__list').matches(':popover-open')).toBe(false);
  });

  it('keeps a toast with an action until it is used', async () => {
    await mount();
    const undo = vi.fn();
    region().show('Removed', { action: { label: 'Undo', onAction: undo }, duration: 100 });
    await wait(250);
    expect(toasts()).toEqual(['Removed']);
    await userEvent.click($('.lue-toast .lue-button'));
    expect(undo).toHaveBeenCalledOnce();
    expect(toasts()).toEqual([]);
  });

  it('dismisses the focused toast on Esc and gives focus back', async () => {
    await mount();
    region().show('Removed', { action: { label: 'Undo', onAction: () => {} } });
    await frame();
    $('#save').focus();
    $('.lue-toast .lue-button').focus();
    await userEvent.keyboard('{Escape}');
    expect(toasts()).toEqual([]);
    expect(document.activeElement).toBe($('#save'));
  });

  it('names its dismiss button, translatably', async () => {
    document.body.innerHTML = '<lue-toast-region dismiss-label="Fermer"></lue-toast-region>';
    region().show('Enregistré', { duration: null });
    await userEvent.click($('[aria-label="Fermer"]'));
    expect(toasts()).toEqual([]);
  });

  it('shows three at a time and queues the rest', async () => {
    await mount();
    const handles = ['One', 'Two', 'Three', 'Four'].map((m) => region().show(m, { duration: null }));
    expect(toasts()).toEqual(['One', 'Two', 'Three']);
    handles[0]!.dismiss();
    expect(toasts()).toEqual(['Two', 'Three', 'Four']);
  });

  it('writes nothing outside itself (ADR-0007)', async () => {
    await mount();
    const records: MutationRecord[] = [];
    const observer = new MutationObserver((r) => records.push(...r));
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
    region().show('Saved', { duration: null });
    await frame();
    observer.disconnect();
    expect(records.filter((r) => !region().contains(r.target) || r.target === region()).filter((r) => r.type !== 'childList' || r.target !== region())).toEqual([]);
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe with toasts showing in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      await mount();
      region().show('Saved', { duration: null });
      region().show('Removed', { action: { label: 'Undo', onAction: () => {} } });
      await frame();
      await expectNoAxeViolations(document.body);
    });
  }
});
