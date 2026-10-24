// Disclosure (apps/docs/contracts/disclosure.json): parity, Enter and Space on the summary toggle it with no script,
// the caret turns, the focus ring, axe open and closed in every theme, and a CanvasText rule in forced colours.
// Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Disclosure } from '@lue-ui/react';
import { $, focusDocument, emulate, expectNoAxeViolations, frame, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const caret = '<svg class="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>';
const html = (open = false) => `
<details class="lue-disclosure" id="returns"${open ? ' open=""' : ''}>
  <summary>Can I return it?${caret}</summary>
  <div><p>Yes, within 30 days.</p></div>
</details>`;
const details = () => $<HTMLDetailsElement>('#returns');

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Disclosure', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = (open?: boolean) => renderToStaticMarkup(
      <Disclosure id="returns" summary="Can I return it?" defaultOpen={open}><p>Yes, within 30 days.</p></Disclosure>,
    );
    expect(outline(react())).toEqual(outline(html()));
    expect(outline(react(true))).toEqual(outline(html(true)));
  });

  it('opens and closes from the keyboard, and the caret turns', async () => {
    await emulate({ reducedMotion: 'reduce' });
    document.body.innerHTML = html();
    focusDocument();
    await tab();
    expect(document.activeElement).toBe($('summary'));
    expect(getComputedStyle($('summary')).outlineStyle).toBe('solid');
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(details().open).toBe(true);
    expect(getComputedStyle($('summary .lue-icon')).rotate).toBe('180deg');
    await userEvent.keyboard(' ');
    await frame();
    expect(details().open).toBe(false);
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe open and closed in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${html()}${html(true).replace('id="returns"', 'id="returns-open"')}</main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('draws its rule in CanvasText in forced colours', async () => {
    document.body.innerHTML = html();
    await emulate({ forcedColors: 'active' });
    const style = getComputedStyle(details());
    expect(style.borderImageSource).toBe('none');
    expect(style.borderBlockEndColor).toBe(resolveColor('CanvasText'));
  });
});
