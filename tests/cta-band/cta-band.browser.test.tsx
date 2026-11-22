// CTA band (apps/docs/contracts/cta-band.json): parity, named by its heading, Tab reaches the field then the button,
// Enter submits, axe in every theme, reflow, increased contrast and forced colours. Chromium, Firefox and WebKit.
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { CtaBand } from '@lue-ui/react';
import { $, focusDocument, tab } from '../support/browser.js';
import { blockGates, cleanUp, labelOf } from '../support/blocks.js';

const html = `<section class="lue-cta" id="news" aria-labelledby="news-title">
  <h2 class="lue-h2" id="news-title">Notes on light</h2>
  <p class="lue-lede">One letter a month. Unsubscribe in one click.</p>
  <form action="#subscribed">
    <div class="lue-field"><label class="lue-field__label" for="email">Email address</label><input class="lue-input" id="email" type="email" autocomplete="email"></div>
    <button type="submit" class="lue-button" data-variant="primary">Subscribe</button>
  </form>
</section>`;
cleanUp();

describe('CTA band', () => {
  blockGates({
    html,
    glass: '.lue-cta',
    react: (
      <CtaBand id="news" title="Notes on light" lede="One letter a month. Unsubscribe in one click.">
        <form action="#subscribed">
          <div className="lue-field"><label className="lue-field__label" htmlFor="email">Email address</label><input className="lue-input" id="email" type="email" autoComplete="email" /></div>
          <button type="submit" className="lue-button" data-variant="primary">Subscribe</button>
        </form>
      </CtaBand>
    ),
  });

  it('is named by its heading', () => {
    document.body.innerHTML = html;
    expect(labelOf($('#news'))).toBe('Notes on light');
  });

  it('reaches the field then the button with Tab, and Enter submits', async () => {
    document.body.innerHTML = html;
    const submitted = vi.fn((event: Event) => event.preventDefault());
    $('form').addEventListener('submit', submitted);
    focusDocument();
    await tab();
    expect(document.activeElement).toBe($('#email'));
    await userEvent.keyboard('sam@example.com');
    await tab();
    expect(document.activeElement).toBe($('button[type="submit"]'));
    $('#email').focus();
    await userEvent.keyboard('{Enter}');
    expect(submitted).toHaveBeenCalledOnce();
  });
});
