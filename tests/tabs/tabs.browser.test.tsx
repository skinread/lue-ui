// Tabs (apps/docs/contracts/tabs.json): parity, links to sections without the element, then tabs: roles and one panel,
// arrow keys (wrapping, mirrored in RTL), Home and End, Tab into the panel, clicks that don't jump, the URL's #panel
// first, only declared attributes written, axe in every theme, forced colours. Chromium, Firefox and WebKit.
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import '@lue-ui/elements/define';
import { Tabs } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, frame, outline, resetMedia, resolveColor, tab, withoutElements } from '../support/browser.js';

const ids = ['overview', 'specs', 'reviews'];
const labels: Record<string, string> = { overview: 'Overview', specs: 'Specs', reviews: 'Reviews' };
const html = () => `
<lue-tabs class="lue-tabs">
  <nav class="lue-tabs__list" aria-label="Product">${ids.map((id) => `<a class="lue-tabs__tab" id="${id}-tab" href="#${id}">${labels[id]}</a>`).join('')}</nav>
  ${ids.map((id) => `<section class="lue-tabs__panel" id="${id}" aria-labelledby="${id}-tab"><p>${labels[id]} text.</p></section>`).join('')}
</lue-tabs>`;
const tabEl = (id: string) => $(`#${id}-tab`);
const panel = (id: string) => $(`#${id}`);
const selected = () => ids.filter((id) => tabEl(id).getAttribute('aria-selected') === 'true');
const mount = async (markup = html()) => {
  document.body.innerHTML = `<main>${markup}</main>`;
  await frame();
};

beforeAll(async () => {
  await customElements.whenDefined('lue-tabs');
});
afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('dir');
  document.body.replaceChildren();
  history.replaceState(null, '', location.pathname + location.search);
  await resetMedia();
});

describe('Tabs', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(<Tabs label="Product" tabs={ids.map((id) => ({ id, label: labels[id], content: <p>{labels[id]} text.</p> }))} />);
    expect(outline(react)).toEqual(outline(html()));
  });

  it('is a list of links to every section without the element', async () => {
    const doc = await withoutElements(html());
    expect(doc.querySelector('[role]')).toBe(null);
    expect([...doc.querySelectorAll<HTMLElement>('.lue-tabs__panel')].every((p) => getComputedStyle(p).display !== 'none')).toBe(true);
    expect(getComputedStyle(doc.querySelector('.lue-tabs__tab')!).textDecorationLine).toBe('underline');
  });

  it('becomes tabs with one panel shown', async () => {
    await mount();
    expect($('.lue-tabs__list').getAttribute('role')).toBe('tablist');
    expect(ids.map((id) => [tabEl(id).getAttribute('role'), tabEl(id).getAttribute('tabindex'), tabEl(id).getAttribute('aria-controls')])).toEqual([
      ['tab', '0', 'overview'], ['tab', '-1', 'specs'], ['tab', '-1', 'reviews'],
    ]);
    expect(ids.map((id) => panel(id).hidden)).toEqual([false, true, true]);
    expect(panel('overview').getAttribute('role')).toBe('tabpanel');
  });

  it('moves with the arrow keys (wrapping), Home and End, and Tab goes into the panel', async () => {
    await mount();
    tabEl('overview').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(selected()).toEqual(['specs']);
    expect(document.activeElement).toBe(tabEl('specs'));
    expect(panel('specs').hidden).toBe(false);
    await userEvent.keyboard('{End}');
    expect(selected()).toEqual(['reviews']);
    await userEvent.keyboard('{ArrowRight}');
    expect(selected()).toEqual(['overview']);
    await userEvent.keyboard('{ArrowLeft}');
    expect(selected()).toEqual(['reviews']);
    await userEvent.keyboard('{Home}');
    expect(selected()).toEqual(['overview']);
    await tab();
    expect(document.activeElement).toBe(panel('overview'));
  });

  it('mirrors the arrow keys in right-to-left text', async () => {
    document.documentElement.dir = 'rtl';
    await mount();
    tabEl('overview').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(selected()).toEqual(['specs']);
  });

  it('selects on click or Enter without jumping to the panel', async () => {
    await mount();
    await userEvent.click(tabEl('reviews'));
    expect(selected()).toEqual(['reviews']);
    expect(location.hash).toBe('');
    tabEl('specs').focus();
    await userEvent.keyboard('{Enter}');
    expect(selected()).toEqual(['specs']);
  });

  it('opens the tab the URL points to', async () => {
    history.replaceState(null, '', '#specs');
    await mount();
    expect(selected()).toEqual(['specs']);
  });

  it('writes only the attributes its contract declares (ADR-0007)', async () => {
    document.body.innerHTML = '<main id="host"></main>';
    const records: MutationRecord[] = [];
    const observer = new MutationObserver((r) => records.push(...r));
    observer.observe($('#host'), { subtree: true, attributes: true, childList: true });
    $('#host').innerHTML = html();
    await frame();
    tabEl('overview').focus();
    await userEvent.keyboard('{ArrowRight}');
    observer.disconnect();
    const written = new Set(records.filter((r) => r.type === 'attributes').map((r) => r.attributeName));
    expect([...written].sort()).toEqual(['aria-controls', 'aria-labelledby', 'aria-selected', 'hidden', 'role', 'tabindex']);
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      await mount();
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('marks the selected tab with a Highlight bar in forced colours', async () => {
    await mount();
    await emulate({ forcedColors: 'active' });
    expect(getComputedStyle(tabEl('overview')).borderBlockEndColor).toBe(resolveColor('Highlight'));
  });
});
