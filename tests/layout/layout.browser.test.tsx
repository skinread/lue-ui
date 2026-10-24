// Layout primitives (apps/docs/contracts/layout.json): parity, and each one's behaviour measured at two container
// widths: Stack gaps, Cluster wrapping, Grid columns, Sidebar stacking, Switcher switching and Center's measure. Logical
// properties, so Sidebar mirrors in right-to-left text. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Center, Cluster, Grid, Sidebar, Stack, Switcher } from '@lue-ui/react';
import { $, expectNoAxeViolations, frame, outline, tab } from '../support/browser.js';

const box = (id: string, width = '') => `<div id="${id}" style="block-size:20px${width ? `;inline-size:${width}` : ''}"></div>`;
const rect = (id: string) => $(`#${id}`).getBoundingClientRect();
const mount = async (width: number, markup: string) => {
  document.body.innerHTML = `<div id="frame" style="inline-size:${width}px">${markup}</div>`;
  await frame();
};

afterEach(() => {
  document.documentElement.removeAttribute('dir');
  document.body.replaceChildren();
});

describe('Layout primitives', () => {
  it('render the same markup from React as the HTML core', () => {
    const pairs: [string, string][] = [
      [renderToStaticMarkup(<Stack gap="l"><p>a</p></Stack>), '<div class="lue-stack" data-gap="l"><p>a</p></div>'],
      [renderToStaticMarkup(<Cluster as="ul" justify="between"><li>a</li></Cluster>), '<ul class="lue-cluster" data-justify="between"><li>a</li></ul>'],
      [renderToStaticMarkup(<Grid min="12rem"><p>a</p></Grid>), '<div class="lue-grid" style="--lue-grid-min:12rem"><p>a</p></div>'],
      [renderToStaticMarkup(<Sidebar side="end" width="15rem"><p>a</p><p>b</p></Sidebar>), '<div class="lue-sidebar" data-side="end" style="--lue-sidebar-width:15rem"><p>a</p><p>b</p></div>'],
      [renderToStaticMarkup(<Switcher threshold="40rem"><p>a</p></Switcher>), '<div class="lue-switcher" style="--lue-switcher-threshold:40rem"><p>a</p></div>'],
      [renderToStaticMarkup(<Center as="main"><p>a</p></Center>), '<main class="lue-center"><p>a</p></main>'],
    ];
    for (const [react, html] of pairs) expect(outline(react)).toEqual(outline(html));
  });

  it('Stack: a column with the default gap, or the one asked for', async () => {
    await mount(400, `<div class="lue-stack">${box('a')}${box('b')}</div><div class="lue-stack" data-gap="0">${box('c')}${box('d')}</div>`);
    expect(rect('b').top - rect('a').bottom).toBeCloseTo(16, 0);
    expect(rect('d').top - rect('c').bottom).toBe(0);
  });

  it('Cluster: a row that wraps', async () => {
    const markup = `<div class="lue-cluster">${box('a', '150px')}${box('b', '150px')}</div>`;
    await mount(400, markup);
    expect(rect('b').top).toBe(rect('a').top);
    await mount(250, markup);
    expect(rect('b').top).toBeGreaterThan(rect('a').bottom);
  });

  it('Grid: as many columns of at least --lue-grid-min as fit', async () => {
    const markup = `<div class="lue-grid" data-gap="0" style="--lue-grid-min:100px">${box('a')}${box('b')}${box('c')}</div>`;
    await mount(300, markup);
    expect([rect('a').top, rect('b').top, rect('c').top]).toEqual([rect('a').top, rect('a').top, rect('a').top]);
    await mount(150, markup);
    expect(rect('b').top).toBeGreaterThan(rect('a').top);
    expect(rect('a').width).toBe(150);
  });

  it('Sidebar: side by side while the content keeps half the width, stacked below that, mirrored in RTL', async () => {
    const markup = `<div class="lue-sidebar" data-gap="0" style="--lue-sidebar-width:200px">${box('side')}${box('content')}</div>`;
    await mount(800, markup);
    // The sidebar grows by 1 and the content by 999, so the sidebar takes a sliver of the leftover space.
    expect(rect('side').width).toBeCloseTo(200, -1);
    expect(rect('content').width).toBeCloseTo(600, -1);
    expect(rect('content').left).toBeCloseTo(rect('side').right, 1);
    document.documentElement.dir = 'rtl';
    await frame();
    expect(rect('content').right).toBeCloseTo(rect('side').left, 1);
    document.documentElement.dir = 'ltr';
    await mount(300, markup);
    expect(rect('content').top).toBeGreaterThan(rect('side').top);
    expect(rect('content').width).toBe(300);
  });

  it('Sidebar: data-side="end" puts the sidebar last', async () => {
    await mount(800, `<div class="lue-sidebar" data-side="end" data-gap="0" style="--lue-sidebar-width:200px">${box('content')}${box('side')}</div>`);
    expect(rect('side').width).toBeCloseTo(200, -1);
    expect(rect('content').width).toBeCloseTo(600, -1);
    expect(rect('side').left).toBeCloseTo(rect('content').right, 1);
  });

  it('Switcher: all side by side above the threshold, all stacked below it', async () => {
    const markup = `<div class="lue-switcher" data-gap="0" style="--lue-switcher-threshold:500px">${box('a')}${box('b')}${box('c')}</div>`;
    await mount(600, markup);
    expect(rect('c').top).toBe(rect('a').top);
    expect(rect('a').width).toBe(200);
    await mount(400, markup);
    expect(rect('b').top).toBeGreaterThan(rect('a').top);
    expect(rect('a').width).toBe(400);
  });

  it('Center: no wider than its measure plus the gutter, centred', async () => {
    await mount(2000, `<div class="lue-center" id="center" style="--lue-center-max:600px;--lue-gutter:20px">${box('a')}</div>`);
    expect(rect('center').width).toBe(640);
    expect(rect('a').width).toBe(600);
    expect(rect('center').left).toBe((2000 - 640) / 2 + rect('frame').left);
  });

  it('pass axe', async () => {
    await mount(600, '<main class="lue-center"><div class="lue-stack"><h1>Title</h1><ul class="lue-cluster"><li>One</li><li>Two</li></ul></div></main>');
    await expectNoAxeViolations(document.body);
  });
});

// Every key in the contract's keyboard map, with real input (tools/check-contracts.mjs checks each is pressed here).
describe('Layout keyboard map', () => {
  it('adds no Tab stops', async () => {
    document.body.innerHTML = `<button type="button" class="lue-button" id="a">A</button><div class="lue-stack"><div class="lue-cluster"><p>Text</p></div><div class="lue-sidebar"><p>Side</p><p>Main</p></div></div><button type="button" class="lue-button" id="b">B</button>`;
    $('#a').focus();
    await tab();
    expect(document.activeElement).toBe($('#b'));
  });
});
