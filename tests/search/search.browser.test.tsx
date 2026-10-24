// Search (apps/docs/contracts/search.json): parity, a search landmark with a labelled field, Tab from field to button,
// Enter submits a GET with the query, axe in every theme. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Search } from '@lue-ui/react';
import { $, expectNoAxeViolations, outline, tab } from '../support/browser.js';

const html = (id: string) => `
<search class="lue-search">
  <form action="#results" method="get">
    <div class="lue-field">
      <label class="lue-field__label" for="${id}">Search projects</label>
      <p class="lue-field__error" id="${id}-error" hidden=""><span class="lue-visually-hidden">Error: </span><span class="lue-field__message"></span></p>
      <input type="search" name="q" autocomplete="off" id="${id}" aria-describedby="${id}-error" class="lue-input">
    </div>
    <button type="submit" class="lue-button">Search</button>
  </form>
</search>`;
const react = () => renderToStaticMarkup(<Search action="#results" label="Search projects" />);

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
});

describe('Search', () => {
  it('renders the same markup from React as the HTML core', () => {
    const markup = react();
    expect(outline(markup)).toEqual(outline(html(markup.match(/ for="([^"]+)"/)![1]!)));
  });

  it('Tab goes from the field to the button, and Enter submits the query', async () => {
    document.body.innerHTML = react();
    const queries: string[] = [];
    $('form').addEventListener('submit', (event) => {
      event.preventDefault();
      queries.push(new FormData(event.target as HTMLFormElement).get('q') as string);
    });
    const input = $<HTMLInputElement>('input');
    expect(input.labels?.[0]?.textContent).toBe('Search projects');
    input.focus();
    await userEvent.keyboard('loom');
    await tab();
    expect(document.activeElement).toBe($('button'));
    input.focus();
    await userEvent.keyboard('{Enter}');
    expect(queries).toEqual(['loom']);
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<header>${react()}</header><main><h1>Projects</h1></main>`;
      await expectNoAxeViolations(document.body);
    });
  }
});
