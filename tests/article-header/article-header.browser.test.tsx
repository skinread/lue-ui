// Article header (apps/docs/contracts/article-header.json): parity, the h1 and a machine-readable date, Tab through the
// breadcrumb, axe in every theme and reflow. Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { ArticleHeader, Breadcrumb } from '@lue-ui/react';
import { $, focusDocument, tab } from '../support/browser.js';
import { blockGates, cleanUp } from '../support/blocks.js';

const html = `<header class="lue-article-header">
  <nav class="lue-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="#journal">Journal</a></li><li><a href="#craft" aria-current="page">Craft</a></li></ol></nav>
  <p class="lue-kicker">Craft · 5 min read</p>
  <h1 class="lue-title">Designing with light</h1>
  <p class="lue-dek">How contrast stays fixed while colour moves.</p>
  <div class="lue-byline"><span>Sam Taylor</span><time datetime="2026-10-05">5 October 2026</time></div>
</header>`;
const inArticle = (h: string) => `<main><article>${h}<p>Body.</p></article></main>`;
cleanUp();

describe('Article header', () => {
  blockGates({
    html,
    page: inArticle,
    react: (
      <ArticleHeader
        breadcrumb={<Breadcrumb items={[{ label: 'Journal', href: '#journal' }, { label: 'Craft', href: '#craft' }]} />}
        kicker="Craft · 5 min read"
        title="Designing with light"
        dek="How contrast stays fixed while colour moves."
        author={<span>Sam Taylor</span>}
        published={{ dateTime: '2026-10-05', label: '5 October 2026' }}
      />
    ),
  });

  it('titles the article with its h1 and dates it in machine-readable form', () => {
    document.body.innerHTML = inArticle(html);
    expect($('article h1').textContent).toBe('Designing with light');
    expect($('time').getAttribute('datetime')).toBe('2026-10-05');
  });

  it('moves through the breadcrumb with Tab', async () => {
    document.body.innerHTML = inArticle(html);
    focusDocument();
    await tab();
    expect(document.activeElement).toBe($('a[href="#journal"]'));
    await tab();
    expect(document.activeElement).toBe($('a[href="#craft"]'));
  });
});
