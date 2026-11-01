// Pagination (apps/docs/contracts/pagination.json): which pages show, parity, link names that say "Page", the current
// page marked, Tab and Enter, axe in every theme. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Pagination, pageRange } from '@lue-ui/react';
import { $, expectNoAxeViolations, focusDocument, frame, outline, tab } from '../support/browser.js';

const link = (n: number, current = false) => `<li><a href="#p${n}"${current ? ' aria-current="page"' : ''}><span class="lue-visually-hidden">Page </span>${n}</a></li>`;
const html = `
<nav aria-label="Pagination" class="lue-pagination">
  <ul>
    <li><a class="lue-button" data-variant="quiet" href="#p4" rel="prev">Previous</a></li>
    ${link(1)}<li aria-hidden="true">…</li>${link(4)}${link(5, true)}${link(6)}<li aria-hidden="true">…</li>${link(12)}
    <li><a class="lue-button" data-variant="quiet" href="#p6" rel="next">Next</a></li>
  </ul>
</nav>`;
const react = (page: number, pages: number) => renderToStaticMarkup(<Pagination page={page} pages={pages} href={(n) => `#p${n}`} />);

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  history.replaceState(null, '', location.pathname + location.search);
});

describe('Pagination', () => {
  it('shows the first, the last, and the current page with its neighbours', () => {
    expect(pageRange(5, 12)).toEqual([1, null, 4, 5, 6, null, 12]);
    expect(pageRange(1, 3)).toEqual([1, 2, 3]);
    expect(pageRange(2, 12)).toEqual([1, 2, 3, null, 12]);
    expect(pageRange(1, 1)).toEqual([1]);
  });

  it('renders the same markup from React as the HTML core', () => {
    expect(outline(react(5, 12))).toEqual(outline(html));
  });

  it('leaves out Previous on the first page and Next on the last', () => {
    document.body.innerHTML = react(1, 3);
    expect(document.querySelector('[rel="prev"]')).toBe(null);
    document.body.innerHTML = react(3, 3);
    expect(document.querySelector('[rel="next"]')).toBe(null);
  });

  it('names each number "Page n" and marks the current one', () => {
    document.body.innerHTML = html;
    expect($('[aria-current="page"]').textContent).toBe('Page 5');
    expect(getComputedStyle($('[aria-current="page"]')).fontWeight).toBe('600');
  });

  it('Tab reaches each link and Enter follows one', async () => {
    document.body.innerHTML = html;
    focusDocument();
    await tab();
    expect(document.activeElement?.textContent).toBe('Previous');
    await tab();
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(location.hash).toBe('#p1');
  });

  it('meets the 44 px target for each number', () => {
    document.body.innerHTML = html;
    const { width, height } = $('a[href="#p4"]').getBoundingClientRect();
    expect(Math.min(width, height)).toBeGreaterThanOrEqual(44);
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${html}</main>`;
      await expectNoAxeViolations(document.body);
    });
  }
});
