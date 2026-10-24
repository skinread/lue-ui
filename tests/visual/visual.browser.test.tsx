// Visual regression (ADR-0005): each component's resting states, in dark and light, in three engines, with the
// self-hosted fonts. Baselines live in __screenshots__/ and are named per browser and platform; they're generated on
// Linux, as CI runs, so other platforms skip this file. Update them with `pnpm vitest run tests/visual --update` on
// Linux after an intended visual change, and review the PNG diff like code.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { page, server } from 'vitest/browser';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import '../../packages/css/src/fonts.css';
import { emulate, resetMedia } from '../support/browser.js';

const icon = '<svg class="lue-button__icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5"></path></svg>';
const chevron = '<svg class="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>';

const SECTIONS: Record<string, string> = {
  button: `
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
      <button type="button" class="lue-button">Save for later</button>
      <button type="button" class="lue-button" data-variant="primary">Continue</button>
      <button type="button" class="lue-button" data-variant="danger">Remove</button>
      <button type="button" class="lue-button" data-variant="quiet">Cancel</button>
      <button type="button" class="lue-button" data-size="sm">Small</button>
      <button type="button" class="lue-button" data-size="lg">Large</button>
      <button type="button" class="lue-button" data-icon-only="" aria-label="Close">${icon}</button>
      <button type="button" class="lue-button" aria-pressed="true">Bold</button>
      <button type="button" class="lue-button" disabled="">Unavailable</button>
    </div>`,
  field: `
    <div style="display:grid;gap:20px;max-inline-size:360px">
      <div class="lue-field">
        <label class="lue-field__label" for="v-name">Full name</label>
        <p class="lue-field__hint" id="v-name-hint">As it appears on your card.</p>
        <input class="lue-input" id="v-name" value="Ada Lovelace" aria-describedby="v-name-hint">
      </div>
      <div class="lue-field">
        <label class="lue-field__label" for="v-email">Email address</label>
        <p class="lue-field__error" id="v-email-error"><span class="lue-visually-hidden">Error: </span><span class="lue-field__message">Enter your email address</span></p>
        <input class="lue-input" id="v-email" aria-invalid="true" aria-describedby="v-email-error">
      </div>
      <div class="lue-error-summary" tabindex="-1">
        <div role="alert">
          <h2 class="lue-error-summary__title" id="v-summary-title">There is a problem</h2>
          <ul class="lue-error-summary__list" aria-labelledby="v-summary-title"><li><a href="#v-email">Enter your email address</a></li></ul>
        </div>
      </div>
    </div>`,
  select: `
    <div style="display:grid;gap:20px;max-inline-size:360px">
      <div class="lue-field">
        <label class="lue-field__label" for="v-delivery">Delivery</label>
        <div class="lue-select-wrap"><select class="lue-select" id="v-delivery"><option>Standard, 3 to 5 days</option></select>${chevron}</div>
      </div>
      <label class="lue-choice"><input class="lue-checkbox" type="checkbox" checked=""> Remember me</label>
      <label class="lue-choice"><input class="lue-radio" type="radio" name="v" checked=""> Express</label>
      <label class="lue-choice"><input class="lue-switch" type="checkbox" role="switch" checked=""> Notifications</label>
    </div>`,
  dialog: `
    <dialog class="lue-dialog" open="" aria-labelledby="v-dialog-title" style="position:static;margin:0">
      <h2 class="lue-dialog__title" id="v-dialog-title">Delete this project?</h2>
      <p class="lue-dialog__body">You can't undo this.</p>
      <div class="lue-dialog__actions">
        <button type="button" class="lue-button">Cancel</button>
        <button type="button" class="lue-button" data-variant="danger">Delete</button>
      </div>
    </dialog>`,
  menu: `
    <div class="lue-menu" role="menu" aria-label="Sort by">
      <button type="button" class="lue-menu__item" role="menuitem" tabindex="-1">Newest first</button>
      <button type="button" class="lue-menu__item" role="menuitem" tabindex="-1">Oldest first</button>
      <div class="lue-menu__separator" role="separator"></div>
      <button type="button" class="lue-menu__item" role="menuitem" tabindex="-1" data-tone="critical">Clear sorting</button>
    </div>`,
};

describe.runIf(server.platform === 'linux')('visual', () => {
  beforeAll(async () => {
    await page.viewport(960, 640);
    await emulate({ reducedMotion: 'reduce' });
    await Promise.all(['300 16px Epilogue', '400 16px Figtree', 'italic 400 16px Figtree', '400 16px "Spline Sans Mono"'].map((f) => document.fonts.load(f)));
  });
  afterAll(resetMedia);

  for (const theme of ['dark', 'light']) {
    for (const [name, html] of Object.entries(SECTIONS)) {
      it(`${name} in ${theme}`, async () => {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.innerHTML = `<main id="shot" style="display:inline-block;padding:24px;background:var(--lue-color-bg-canvas)">${html}</main>`;
        await document.fonts.ready;
        await expect(page.elementLocator(document.getElementById('shot')!)).toMatchScreenshot(`${name}-${theme}`);
      });
    }
  }
});
