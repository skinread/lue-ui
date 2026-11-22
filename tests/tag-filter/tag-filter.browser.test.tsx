// Tag filter (apps/docs/contracts/tag-filter.json): parity for buttons and links, Tab between tags, Space and Enter
// toggle them in React and on the HTML path (data-lue-toggle), Enter follows a link, the current link draws the pressed
// key, axe in every theme and reflow. Chromium, Firefox and WebKit.
import { beforeAll, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { installToggle } from '@lue-ui/elements';
import { TagFilter } from '@lue-ui/react';
import { $, focusDocument, frame, outline, tab } from '../support/browser.js';
import { blockGates, cleanUp } from '../support/blocks.js';

const buttons = `<div class="lue-tag-filter" role="group" aria-label="Filter projects">
  <button type="button" class="lue-button" data-size="sm" aria-pressed="true">Systems</button>
  <button type="button" class="lue-button" data-size="sm" aria-pressed="false">Product</button>
</div>`;
const links = `<nav class="lue-tag-filter" aria-label="Filter projects"><ul>
  <li><a class="lue-button" data-size="sm" href="#systems" aria-current="page">Systems</a></li>
  <li><a class="lue-button" data-size="sm" href="#product">Product</a></li>
</ul></nav>`;
const options = [{ value: 'systems', label: 'Systems' }, { value: 'product', label: 'Product' }];
const linked = options.map((o) => ({ ...o, href: `#${o.value}` }));
const pressed = (name: string) => [...document.querySelectorAll('button')].find((b) => b.textContent === name)!.getAttribute('aria-pressed');

beforeAll(() => {
  installToggle(document);
});
cleanUp();

describe('Tag filter', () => {
  blockGates({ html: buttons, react: <TagFilter label="Filter projects" options={options} defaultValue={['systems']} /> });

  it('renders the links form when every tag has an href, with one current page', () => {
    expect(outline(renderToStaticMarkup(<TagFilter label="Filter projects" options={linked} value={['systems']} />))).toEqual(outline(links));
    document.body.innerHTML = renderToStaticMarkup(<TagFilter label="Filter projects" options={linked} value={['systems', 'product']} />);
    expect(document.querySelectorAll('[aria-current]')).toHaveLength(1);
  });

  it('moves between tags with Tab; Space and Enter turn them on and off, and say what is chosen', async () => {
    const container = document.body.appendChild(document.createElement('div'));
    const chosen: string[][] = [];
    const root = createRoot(container);
    await act(async () => root.render(<TagFilter label="Filter projects" options={options} defaultValue={['systems']} onChange={(v) => chosen.push(v)} />));
    focusDocument();
    await tab();
    expect(document.activeElement!.textContent).toBe('Systems');
    await tab();
    expect(document.activeElement!.textContent).toBe('Product');
    await act(async () => userEvent.keyboard(' '));
    expect(pressed('Product')).toBe('true');
    await act(async () => userEvent.keyboard('{Enter}'));
    expect(pressed('Product')).toBe('false');
    expect(chosen).toEqual([['systems', 'product'], ['systems']]);
    await act(async () => root.unmount());
  });

  it('toggles on the HTML path with data-lue-toggle', async () => {
    document.body.innerHTML = buttons.replaceAll('aria-pressed=', 'data-lue-toggle="" aria-pressed=');
    focusDocument();
    await tab();
    await tab();
    await userEvent.keyboard(' ');
    expect(pressed('Product')).toBe('true');
  });

  it('follows a link with Enter, and draws the current one as the pressed key', async () => {
    document.body.innerHTML = `${links}<button type="button" class="lue-button" data-size="sm" aria-pressed="true" id="key">Key</button>`;
    const current = $('a[aria-current="page"]');
    expect(getComputedStyle(current).backgroundImage).toBe(getComputedStyle($('#key')).backgroundImage);
    expect(getComputedStyle(current).backgroundImage).not.toBe(getComputedStyle($('a[href="#product"]')).backgroundImage);
    focusDocument();
    await tab();
    await tab();
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(location.hash).toBe('#product');
  });
});
