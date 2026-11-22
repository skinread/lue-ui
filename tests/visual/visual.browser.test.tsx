// Visual regression (ADR-0005): each component's resting states, in dark and light, in three engines, with the
// self-hosted fonts. Baselines live in __screenshots__/ and are named per browser and platform; they're generated on
// Linux, as CI runs, with tests/fonts.conf making text rendering identical across machines; other platforms skip
// this file. When one fails in CI, the job log prints the diff and actual images in base64. Update them with `pnpm vitest run tests/visual --update` on
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
  choice: `
    <div style="display:grid;gap:20px;inline-size:360px">
      <fieldset class="lue-fieldset" aria-describedby="v-rooms-error">
        <legend>Rooms</legend>
        <p class="lue-field__error" id="v-rooms-error"><span class="lue-visually-hidden">Error: </span><span class="lue-field__message">Choose at least one room</span></p>
        <label class="lue-choice"><input class="lue-checkbox" type="checkbox" aria-invalid="true"> Living room</label>
        <label class="lue-choice"><input class="lue-checkbox" type="checkbox" aria-invalid="true"> Bedroom</label>
      </fieldset>
      <label class="lue-choice"><input class="lue-checkbox" type="checkbox" id="v-all"> All rooms</label>
      <label class="lue-choice"><input class="lue-checkbox" type="checkbox" disabled=""> Unavailable</label>
      <label class="lue-choice"><input class="lue-radio" type="radio" name="v-off"> Standard</label>
      <label class="lue-choice"><input class="lue-switch" type="checkbox" role="switch"> Order updates by text</label>
      <div class="lue-field">
        <label class="lue-field__label" for="v-notes">Delivery instructions</label>
        <textarea class="lue-textarea" id="v-notes">Side gate, code 1234</textarea>
      </div>
    </div>`,
  alert: `
    <div style="display:grid;gap:12px;inline-size:420px">
      ${['info', 'warning', 'success', 'critical'].map((tone) => `
      <div class="lue-alert" data-tone="${tone}">
        <svg class="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" stroke-width="1.5"></circle><path d="M8 7v4M8 5v.5" stroke="currentColor" stroke-width="1.5"></path></svg>
        <p class="lue-alert__title"><span class="lue-visually-hidden">${tone}: </span>Delivery is delayed</p>
        <div class="lue-alert__body">Orders placed today go out on Monday.</div>
      </div>`).join('')}
    </div>`,
  disclosure: `
    <div style="display:grid;gap:16px;inline-size:420px">
      <p>Read our <a class="lue-link" href="#statement">accessibility statement</a> first.</p>
      <div class="lue-accordion">
        <details class="lue-disclosure" name="v-faq" open=""><summary>Can I return it?${chevron}</summary><div><p>Yes, within 30 days.</p></div></details>
        <details class="lue-disclosure" name="v-faq"><summary>Do you ship abroad?${chevron}</summary><div><p>Not yet.</p></div></details>
      </div>
    </div>`,
  overlay: `
    <div style="display:grid;gap:20px;justify-items:start">
      <div class="lue-popover"><p>Anyone with the link can view this project.</p><a class="lue-link" href="#copy">Copy link</a></div>
      <span class="lue-popover" data-variant="tip">Orders placed before 2pm go out today.</span>
      <div class="lue-toast"><p class="lue-toast__message">Image removed</p><button type="button" class="lue-button" data-size="sm">Undo</button><button type="button" class="lue-button" data-size="sm" data-icon-only="" aria-label="Dismiss">${icon}</button></div>
    </div>`,
  dialog: `
    <div style="inline-size:480px">
    <dialog class="lue-dialog" open="" aria-labelledby="v-dialog-title" style="position:static;margin:0">
      <h2 class="lue-dialog__title" id="v-dialog-title">Delete this project?</h2>
      <p class="lue-dialog__body">You can't undo this.</p>
      <div class="lue-dialog__actions">
        <button type="button" class="lue-button">Cancel</button>
        <button type="button" class="lue-button" data-variant="danger">Delete</button>
      </div>
    </dialog>
    </div>`,
  menu: `
    <div class="lue-menu" role="menu" aria-label="Sort by">
      <button type="button" class="lue-menu__item" role="menuitem" tabindex="-1">Newest first</button>
      <button type="button" class="lue-menu__item" role="menuitem" tabindex="-1">Oldest first</button>
      <div class="lue-menu__separator" role="separator"></div>
      <button type="button" class="lue-menu__item" role="menuitem" tabindex="-1" data-tone="critical">Clear sorting</button>
    </div>`,
  // Content blocks (ADR-0011), each section under the 640 px viewport.
  'blocks-navigation': `
    <div style="display:grid;gap:24px;inline-size:880px">
      <header class="lue-site-header"><div class="lue-site-header__bar"><a class="lue-wordmark" href="#"><span class="lue-tile" aria-hidden="true"><svg class="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M8 2.5 14 13H2Z" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg></span>Lue</a><nav aria-label="Main"><ul><li><a class="lue-site-header__link" href="#" aria-current="page">Work</a></li><li><a class="lue-site-header__link" href="#">Journal</a></li><li><a class="lue-site-header__link" href="#">About</a></li></ul></nav></div></header>
      <div style="display:flex;gap:24px;align-items:start">
        <nav class="lue-toc" aria-labelledby="v-toc" style="inline-size:260px"><p class="lue-kicker" id="v-toc">On this page</p><ol><li><a href="#">Colour as light</a></li><li><a href="#" aria-current="true">Contrast that holds</a></li></ol></nav>
        <div class="lue-tag-filter" role="group" aria-label="Filter"><button type="button" class="lue-button" data-size="sm" aria-pressed="true">Systems</button><button type="button" class="lue-button" data-size="sm" aria-pressed="false">Product</button></div>
        <nav class="lue-tag-filter" aria-label="Topics"><ul><li><a class="lue-button" data-size="sm" href="#" aria-current="page">Craft</a></li><li><a class="lue-button" data-size="sm" href="#">Notes</a></li></ul></nav>
      </div>
      <footer class="lue-site-footer"><a class="lue-wordmark" href="#">Lue</a><nav aria-label="Footer"><ul><li><a href="#">Contact</a></li><li><a href="#">Accessibility</a></li></ul></nav><p class="lue-site-footer__note">© 2026 Lue Studio</p></footer>
    </div>`,
  'blocks-hero': `
    <section class="lue-hero" aria-labelledby="v-hero" style="inline-size:880px;padding-block:32px"><div class="lue-hero__grid" style="grid-template-columns:1fr auto"><div class="lue-hero__text"><p class="lue-kicker">Design and engineering studio</p><h1 class="lue-display" id="v-hero">Interfaces that hold their light.</h1><p class="lue-lede">Calm to use, alive to touch.</p><div class="lue-actions"><a class="lue-button" data-variant="primary" href="#">View work</a><a class="lue-button" href="#">Read the journal</a></div></div><div class="lue-hero__object"><svg class="lue-prism" aria-hidden="true" viewBox="0 0 400 360" style="inline-size:180px"><path d="M200 30 L360 310 L40 310 Z" style="fill:var(--lue-prism-glass-top);stroke:var(--lue-prism-ring);stroke-width:6"></path></svg></div></div></section>`,
  'blocks-article': `
    <article style="inline-size:880px"><header class="lue-article-header" style="padding-block:0"><nav class="lue-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="#">Journal</a></li><li><a href="#" aria-current="page">Craft</a></li></ol></nav><p class="lue-kicker">Craft · 5 min read</p><h1 class="lue-title">Designing with light</h1><p class="lue-dek">How contrast stays fixed while colour moves.</p><div class="lue-byline"><span class="lue-avatar" aria-hidden="true">ST</span><span>Sam Taylor</span><time datetime="2026-10-05">5 October 2026</time></div></header></article>`,
  'blocks-cards': `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;inline-size:880px;align-items:start">
      <article class="lue-project"><div class="lue-media" style="aspect-ratio:16 / 9"><svg class="lue-prism" aria-hidden="true" viewBox="0 0 400 360" style="inline-size:180px"><path d="M200 30 L360 310 L40 310 Z" style="fill:var(--lue-prism-glass-top);stroke:var(--lue-prism-ring);stroke-width:6"></path></svg></div><div class="lue-project__body"><p class="lue-meta"><span class="lue-kicker">Loom</span><span class="lue-kicker">2026</span></p><h3 class="lue-h3"><a href="#">A design system</a></h3><p class="lue-excerpt">One line on what changed.</p><ul class="lue-tags" aria-label="Disciplines"><li><span class="lue-tag">Systems</span></li></ul></div></article>
      <article class="lue-post" data-variant="card"><p class="lue-meta"><span class="lue-kicker">Craft</span><time class="lue-kicker" datetime="2026-10-05">5 Oct 2026</time></p><h3 class="lue-h3"><a href="#">Designing with light</a></h3><p class="lue-excerpt">How contrast stays fixed.</p></article>
      <div><article class="lue-post"><p class="lue-meta"><span class="lue-kicker">Notes</span></p><h3 class="lue-h3"><a href="#">Glass that steps aside</a></h3></article><ul class="lue-feature-grid"><li class="lue-feature"><span class="lue-tile" aria-hidden="true"><svg class="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M8 2.5 14 13H2Z" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg></span><h3 class="lue-h3">Accessibility</h3><p>Audits and fixes.</p></li></ul></div>
    </div>`,
  'blocks-panels': `
    <div style="display:grid;gap:24px;inline-size:880px">
      <section class="lue-author" aria-label="About the author"><span class="lue-avatar" data-size="lg" aria-hidden="true">ST</span><div class="lue-author__text"><p class="lue-author__name">Sam Taylor</p><p class="lue-author__bio">Builds accessible front ends.</p></div><a class="lue-button" data-size="sm" href="#">More posts</a></section>
      <section class="lue-cta" aria-labelledby="v-cta"><h2 class="lue-h2" id="v-cta">Notes on light</h2><p class="lue-lede">One letter a month.</p><form><div class="lue-field"><label class="lue-field__label" for="v-cta-email">Email address</label><input class="lue-input" id="v-cta-email" type="email"></div><button type="submit" class="lue-button" data-variant="primary">Subscribe</button></form></section>
    </div>`,
  'blocks-media-text': `
    <section class="lue-split" aria-labelledby="v-split" style="inline-size:880px;grid-template-columns:1fr 1fr"><figure class="lue-figure"><div class="lue-media" style="aspect-ratio:16 / 9"><svg class="lue-prism" aria-hidden="true" viewBox="0 0 400 360" style="inline-size:180px"><path d="M200 30 L360 310 L40 310 Z" style="fill:var(--lue-prism-glass-top);stroke:var(--lue-prism-ring);stroke-width:6"></path></svg></div><figcaption>Light pools where glass meets the surface.</figcaption></figure><div class="lue-split__text"><p class="lue-kicker">Case study · Kiln</p><h2 class="lue-h2" id="v-split">An editorial platform</h2><p class="lue-excerpt">Two sentences on the brief.</p><div class="lue-actions"><a class="lue-button" href="#">Read the case study</a></div></div></section>`,
  'blocks-text': `
    <div style="display:grid;gap:20px;inline-size:880px">
      <figure class="lue-quote"><span class="lue-quote__mark lue-chrome-text" aria-hidden="true">“</span><blockquote><p>Faster and easier to use.</p></blockquote><figcaption><span class="lue-quote__source"><span class="lue-quote__name">Alex Morgan</span><span class="lue-quote__role">Editor, Kiln</span></span></figcaption></figure>
      <aside class="lue-pull" aria-hidden="true">Only the colour moves.</aside>
      <ol class="lue-timeline"><li><span class="lue-kicker lue-timeline__when">2024 - now</span><div class="lue-timeline__entry"><p class="lue-timeline__title">Founder</p><p class="lue-timeline__detail">Lue Studio.</p></div></li></ol>
      <figure class="lue-code"><figcaption><span>CSS</span><span>Glass</span></figcaption><pre tabindex="0"><code><span class="lue-code__token" data-kind="comment">/* A pane of glass */</span> .button { <span class="lue-code__token" data-kind="property">backdrop-filter</span>: blur(10px); }</code></pre></figure>
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
        // indeterminate has no attribute.
        const all = document.getElementById('v-all') as HTMLInputElement | null;
        if (all) all.indeterminate = true;
        await document.fonts.ready;
        await expect(page.elementLocator(document.getElementById('shot')!)).toMatchScreenshot(`${name}-${theme}`);
      });
    }
  }
});
