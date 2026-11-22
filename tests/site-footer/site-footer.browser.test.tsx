// Site footer (apps/docs/contracts/site-footer.json): parity, Tab through the wordmark and links, Enter follows one,
// axe in every theme, reflow, and the chrome line as a border in forced colours. Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { SiteFooter, Wordmark } from '@lue-ui/react';
import { $, emulate, focusDocument, frame, resolveColor, tab } from '../support/browser.js';
import { blockGates, cleanUp } from '../support/blocks.js';

const html = `<footer class="lue-site-footer" id="footer">
  <a class="lue-wordmark" href="#home">Lue</a>
  <nav aria-label="Footer"><ul><li><a href="#contact">Contact</a></li><li><a href="#accessibility">Accessibility</a></li></ul></nav>
  <p class="lue-site-footer__note">© 2026 Lue Studio</p>
</footer>`;
const onPage = (h: string) => `<main><p>Content</p></main>${h}`;
cleanUp();

describe('Site footer', () => {
  blockGates({
    html,
    page: onPage,
    react: <SiteFooter id="footer" brand={<Wordmark href="#home">Lue</Wordmark>} items={[{ label: 'Contact', href: '#contact' }, { label: 'Accessibility', href: '#accessibility' }]} note="© 2026 Lue Studio" />,
  });

  it('moves through the wordmark and the links with Tab, and Enter follows one', async () => {
    document.body.innerHTML = html;
    focusDocument();
    await tab();
    expect(document.activeElement).toBe($('.lue-wordmark'));
    await tab();
    expect(document.activeElement).toBe($('a[href="#contact"]'));
    expect(getComputedStyle(document.activeElement!).outlineStyle).toBe('solid');
    await tab();
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(location.hash).toBe('#accessibility');
  });

  it.skipIf(server.browser === 'webkit')('draws the chrome line as a CanvasText border in forced colours', async () => {
    document.body.innerHTML = html;
    await emulate({ forcedColors: 'active' });
    expect(getComputedStyle($('#footer')).borderBlockStartColor).toBe(resolveColor('CanvasText'));
  });
});
