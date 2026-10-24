// Breadcrumb (apps/docs/contracts/breadcrumb.json): parity, a named landmark with the current page marked, a
// separator screen readers skip, Tab and Enter through its links, axe in every theme. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Breadcrumb } from '@lue-ui/react';
import { $, expectNoAxeViolations, focusDocument, frame, outline, tab } from '../support/browser.js';

const html = `
<nav aria-label="Breadcrumb" class="lue-breadcrumb">
  <ol>
    <li><a href="#home">Home</a></li>
    <li><a href="#work">Work</a></li>
    <li><a href="#loom" aria-current="page">Loom</a></li>
  </ol>
</nav>`;

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  history.replaceState(null, '', location.pathname + location.search);
});

describe('Breadcrumb', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(<Breadcrumb items={[{ label: 'Home', href: '#home' }, { label: 'Work', href: '#work' }, { label: 'Loom', href: '#loom' }]} />);
    expect(outline(react)).toEqual(outline(html));
  });

  it('draws a separator with empty alt text, so it is not read', () => {
    document.body.innerHTML = html;
    const content = getComputedStyle(document.querySelectorAll('li')[1]!, '::before').content;
    expect(content).toContain('/');
    expect(content).toMatch(/\/\s*""/);
    expect(getComputedStyle(document.querySelectorAll('li')[0]!, '::before').content).toBe('none');
  });

  it('Tab moves through its links and Enter follows one', async () => {
    document.body.innerHTML = html;
    focusDocument();
    await tab();
    expect(document.activeElement).toBe($('a[href="#home"]'));
    await tab();
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(location.hash).toBe('#work');
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<header>${html}</header><main><h1>Loom</h1></main>`;
      await expectNoAxeViolations(document.body);
    });
  }
});
