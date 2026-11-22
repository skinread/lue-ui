// Table of contents (apps/docs/contracts/table-of-contents.json): parity, named by its visible title, the current
// section, Tab through the links and Enter goes to a section, axe in every theme, reflow, increased contrast and forced
// colours. Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { TableOfContents } from '@lue-ui/react';
import { $, emulate, focusDocument, frame, tab } from '../support/browser.js';
import { blockGates, cleanUp, labelOf } from '../support/blocks.js';

const html = `<nav class="lue-toc" id="toc" aria-labelledby="toc-title">
  <p class="lue-kicker" id="toc-title">On this page</p>
  <ol><li><a href="#colour">Colour as light</a></li><li><a href="#contrast" aria-current="true">Contrast that holds</a></li></ol>
</nav>`;
const withArticle = (h: string) => `<main>${h}<h2 id="colour">Colour as light</h2><h2 id="contrast">Contrast that holds</h2></main>`;
cleanUp();

describe('Table of contents', () => {
  blockGates({
    html,
    page: withArticle,
    glass: '.lue-toc',
    react: <TableOfContents id="toc" items={[{ href: '#colour', label: 'Colour as light' }, { href: '#contrast', label: 'Contrast that holds' }]} current="#contrast" />,
  });

  it('is named by its visible title, and marks the current section', () => {
    document.body.innerHTML = withArticle(html);
    expect(labelOf($('#toc'))).toBe('On this page');
    expect($('a[aria-current="true"]').textContent).toBe('Contrast that holds');
  });

  it('moves through the links with Tab, and Enter goes to the section', async () => {
    document.body.innerHTML = withArticle(html);
    focusDocument();
    await tab();
    expect(document.activeElement).toBe($('a[href="#colour"]'));
    await tab();
    expect(document.activeElement).toBe($('a[href="#contrast"]'));
    expect(getComputedStyle(document.activeElement!).outlineStyle).toBe('solid');
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(location.hash).toBe('#contrast');
  });

  it.skipIf(server.browser === 'webkit')('underlines the current section in forced colours, so colour is not the only cue', async () => {
    document.body.innerHTML = html;
    await emulate({ forcedColors: 'active' });
    expect(getComputedStyle($('a[aria-current="true"]')).textDecorationLine).toBe('underline');
  });
});
