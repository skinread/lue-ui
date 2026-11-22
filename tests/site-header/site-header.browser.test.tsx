// Site header (apps/docs/contracts/site-header.json): parity, the banner and its named navigation, Tab through the
// wordmark and links, Enter follows one, the current page, sticky only on tall viewports, axe in every theme,
// reflow, increased contrast and forced colours. Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { SiteHeader, Wordmark } from '@lue-ui/react';
import { $, focusDocument, frame, tab } from '../support/browser.js';
import { blockGates, cleanUp } from '../support/blocks.js';

const html = `<header class="lue-site-header" id="header">
  <div class="lue-site-header__bar">
    <a class="lue-wordmark" href="#home">Lue</a>
    <nav aria-label="Main"><ul>
      <li><a class="lue-site-header__link" href="#work" aria-current="page">Work</a></li>
      <li><a class="lue-site-header__link" href="#journal">Journal</a></li>
    </ul></nav>
  </div>
</header>`;
const onPage = (h: string) => `${h}<main><p>Content</p></main>`;
cleanUp();

describe('Site header', () => {
  blockGates({
    html,
    page: onPage,
    glass: '.lue-site-header__bar',
    react: <SiteHeader id="header" brand={<Wordmark href="#home">Lue</Wordmark>} items={[{ label: 'Work', href: '#work', current: true }, { label: 'Journal', href: '#journal' }]} />,
  });

  it('moves through the wordmark and the links with Tab, and Enter follows one', async () => {
    document.body.innerHTML = onPage(html);
    focusDocument();
    await tab();
    expect(document.activeElement).toBe($('.lue-wordmark'));
    expect(getComputedStyle($('.lue-wordmark')).outlineStyle).toBe('solid');
    await tab();
    expect(document.activeElement).toBe($('a[href="#work"]'));
    await tab();
    expect(document.activeElement).toBe($('a[href="#journal"]'));
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(location.hash).toBe('#journal');
  });

  it('marks the current page in words and on screen', () => {
    document.body.innerHTML = html;
    const current = $('a[aria-current="page"]');
    expect(current.textContent).toBe('Work');
    expect(getComputedStyle(current).backgroundColor).not.toBe(getComputedStyle($('a[href="#journal"]')).backgroundColor);
  });

  it('sticks on a tall viewport, and scrolls away on a short one (high zoom)', async () => {
    const [width, height] = [window.innerWidth, window.innerHeight];
    document.body.innerHTML = html;
    try {
      await page.viewport(1024, 768);
      await frame();
      expect(getComputedStyle($('#header')).position).toBe('sticky');
      await page.viewport(1024, 400);
      await frame();
      expect(getComputedStyle($('#header')).position).toBe('static');
    } finally {
      await page.viewport(width, height);
    }
  });
});
