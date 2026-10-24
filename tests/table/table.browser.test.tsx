// Table (apps/docs/contracts/table.json): parity, a scrolling region named by the caption that Tab reaches and arrow
// keys scroll, numbers aligned to the end, axe in every theme. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Table } from '@lue-ui/react';
import { $, expectNoAxeViolations, focusDocument, frame, outline, tab } from '../support/browser.js';

const rows = '<thead><tr><th scope="col">Project</th><th scope="col" data-numeric="">Hours</th></tr></thead><tbody><tr><th scope="row">Loom</th><td data-numeric="">128</td></tr><tr><th scope="row">Kiln</th><td data-numeric="">64</td></tr></tbody>';
const html = (id = 'cap') => `<section class="lue-table-wrap" aria-labelledby="${id}" tabindex="0"><table class="lue-table"><caption id="${id}">Hours by project</caption>${rows}</table></section>`;

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
});

describe('Table', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(
      <Table caption="Hours by project">
        <thead><tr><th scope="col">Project</th><th scope="col" data-numeric="">Hours</th></tr></thead>
        <tbody><tr><th scope="row">Loom</th><td data-numeric="">128</td></tr><tr><th scope="row">Kiln</th><td data-numeric="">64</td></tr></tbody>
      </Table>,
    );
    const id = react.match(/aria-labelledby="([^"]+)"/)![1]!;
    expect(outline(react)).toEqual(outline(html(id)));
  });

  it('aligns numbers to the end', () => {
    document.body.innerHTML = html();
    expect(getComputedStyle($('td[data-numeric]')).textAlign).toBe('end');
    expect(getComputedStyle($('tbody th')).textAlign).toBe('start');
  });

  it('is a region Tab reaches, and ArrowRight and ArrowLeft scroll it when it overflows', async () => {
    document.body.innerHTML = `<div style="inline-size:160px">${html()}</div>`;
    $('table').style.minInlineSize = '600px';
    focusDocument();
    await tab();
    const wrap = $('.lue-table-wrap');
    expect(document.activeElement).toBe(wrap);
    expect(getComputedStyle(wrap).outlineStyle).toBe('solid');
    // Keyboard scrolling is smooth: wait for it to settle before reading the position.
    const settled = async () => {
      let last = -1;
      while (wrap.scrollLeft !== last) {
        last = wrap.scrollLeft;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return last;
    };
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    const scrolled = await settled();
    expect(scrolled).toBeGreaterThan(0);
    await userEvent.keyboard('{ArrowLeft}');
    expect(await settled()).toBeLessThan(scrolled);
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${html()}</main>`;
      await expectNoAxeViolations(document.body);
    });
  }
});
