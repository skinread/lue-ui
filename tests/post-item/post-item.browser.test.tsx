// Post item (apps/docs/contracts/post-item.json): parity for the row and the card, the whole item is its link, it shows
// the link's focus, Tab and Enter, a machine-readable date, axe in every theme, reflow, increased contrast and forced
// colours. Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { PostItem } from '@lue-ui/react';
import { $, emulate, focusDocument, frame, outline, resolveColor, tab } from '../support/browser.js';
import { blockGates, cleanUp } from '../support/blocks.js';

const body = `<p class="lue-meta"><span class="lue-kicker">Craft</span><time class="lue-kicker" datetime="2026-10-05">5 October 2026</time></p>
  <h3 class="lue-h3"><a href="#light">Designing with light</a></h3>
  <p class="lue-excerpt">How contrast stays fixed.</p>`;
const row = `<article class="lue-post" id="post">${body}</article>`;
const card = `<article class="lue-post" data-variant="card" id="post">${body}</article>`;
const props = { id: 'post', href: '#light', title: 'Designing with light', category: 'Craft', published: { dateTime: '2026-10-05', label: '5 October 2026' }, excerpt: 'How contrast stays fixed.' };
const inSection = (h: string) => `<main><h2>Journal</h2>${h}</main>`;
cleanUp();

describe('Post item', () => {
  blockGates({ html: card, page: inSection, glass: '.lue-post', react: <PostItem {...props} variant="card" /> });

  it('renders the row as the HTML core does', () => {
    expect(outline(renderToStaticMarkup(<PostItem {...props} />))).toEqual(outline(row));
  });

  it('is its link all over', () => {
    document.body.innerHTML = row;
    const box = $('#post').getBoundingClientRect();
    expect(document.elementFromPoint(box.right - 4, box.bottom - 4)).toBe($('#post a'));
  });

  it('shows the focus ring on the item, and Enter follows the link', async () => {
    document.body.innerHTML = row;
    focusDocument();
    await tab();
    expect(document.activeElement).toBe($('#post a'));
    expect(getComputedStyle($('#post')).outlineStyle).toBe('solid');
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(location.hash).toBe('#light');
  });

  it.skipIf(server.browser === 'webkit')("draws the row's chrome line as a CanvasText border in forced colours", async () => {
    document.body.innerHTML = row;
    await emulate({ forcedColors: 'active' });
    expect(getComputedStyle($('#post')).borderBlockStartColor).toBe(resolveColor('CanvasText'));
  });
});
