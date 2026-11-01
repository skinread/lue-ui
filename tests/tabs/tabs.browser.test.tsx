// Tabs (apps/docs/contracts/tabs.json): parity, links to sections without the element, then tabs: roles and one panel,
// arrow keys (wrapping, mirrored in RTL), Home and End, Tab into the panel, clicks that don't jump, the URL's #panel
// first, only declared attributes written, the liquid key following the selection (not animated under reduced motion),
// axe in every theme, forced colours. Chromium, Firefox and WebKit.
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
    // data-lue-liquid and style (its --lue-key-* properties) are the liquid key's, on the list only.
    expect([...written].sort()).toEqual(['aria-controls', 'aria-labelledby', 'aria-selected', 'data-lue-liquid', 'hidden', 'role', 'style', 'tabindex']);
    const styled = new Set(records.filter((r) => r.attributeName === 'style' || r.attributeName === 'data-lue-liquid').map((r) => r.target));
    expect([...styled]).toEqual([$('.lue-tabs__list')]);
  });

  describe('liquid key', () => {
    /** The key's custom properties on the list, in px. */
    const key = () => {
      const style = $('.lue-tabs__list').style;
      return ['x', 'y', 'w', 'h'].map((p) => parseFloat(style.getPropertyValue(`--lue-key-${p}`)));
    };
    /** Where the key should be for a tab: its inline-start offset from the list's padding edge, and its size. */
    const expected = (id: string) => {
      const el = $('.lue-tabs__list');
      const list = el.getBoundingClientRect();
      const r = tabEl(id).getBoundingClientRect();
      const style = getComputedStyle(el);
      return style.direction === 'rtl'
        ? [list.right - r.right - parseFloat(style.borderRightWidth), r.top - list.top - el.clientTop, r.width, r.height]
        : [r.left - list.left - el.clientLeft, r.top - list.top - el.clientTop, r.width, r.height];
    };
    const near = (actual: number[], wanted: number[]) => actual.forEach((v, i) => expect(v).toBeCloseTo(wanted[i]!, 0));
    /** Counts the animations started on the list. */
    const watch = () => {
      const list = $('.lue-tabs__list');
      const calls: Parameters<HTMLElement['animate']>[] = [];
      list.animate = (...args) => {
        calls.push(args);
        return HTMLElement.prototype.animate.apply(list, args);
      };
      return calls;
    };

    it('places the key on the selected tab and marks the list', async () => {
      await mount();
      await frame();
      expect($('.lue-tabs__list').getAttribute('data-lue-liquid')).toBe('');
      near(key(), expected('overview'));
    });

    it('follows the selection by click and keyboard, flowing on ::before to the resting place', async () => {
      await mount();
      await frame();
      const calls = watch();
      await userEvent.click(tabEl('reviews'));
      await frame();
      near(key(), expected('reviews'));
      expect(calls).toHaveLength(1);
      const [keyframes, options] = calls[0]! as [Keyframe[], KeyframeAnimationOptions];
      expect(options.pseudoElement).toBe('::before');
      expect(keyframes.at(-1)).toEqual({ translate: `${key()[0]}px 0`, scale: '1 1' });
      expect(keyframes.flatMap((k) => Object.keys(k)).every((p) => ['translate', 'scale', 'offset'].includes(p))).toBe(true);
      tabEl('reviews').focus();
      await userEvent.keyboard('{ArrowLeft}');
      await frame();
      near(key(), expected('specs'));
      expect(calls).toHaveLength(2);
    });

    it('measures from the right in right-to-left text', async () => {
      document.documentElement.dir = 'rtl';
      await mount();
      await frame();
      near(key(), expected('overview'));
      await userEvent.click(tabEl('reviews'));
      await frame();
      near(key(), expected('reviews'));
    });

    it("doesn't animate under reduced motion, but still moves", async () => {
      await emulate({ reducedMotion: 'reduce' });
      await mount();
      await frame();
      const calls = watch();
      await userEvent.click(tabEl('specs'));
      await frame();
      near(key(), expected('specs'));
      expect(calls).toHaveLength(0);
    });
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
