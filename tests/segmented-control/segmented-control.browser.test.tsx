// Segmented control (apps/docs/contracts/segmented-control.json): parity, a radio group with the native keyboard
// model (Tab in at the checked option, arrows move, Space checks), the checked and focused option drawn, a target of
// at least 24 px, the liquid key following the choice (not animated under reduced motion), axe in every theme, forced
// colours. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import '@lue-ui/elements/define';
import { SegmentedControl } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, focusDocument, frame, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const option = (value: string, label: string, checked = false) => `<label class="lue-segmented__option"><input type="radio" name="view" value="${value}"${checked ? ' checked=""' : ''}>${label}</label>`;
const html = `<fieldset class="lue-segmented"><legend>View</legend><div class="lue-segmented__options">${option('day', 'Day')}${option('week', 'Week', true)}${option('month', 'Month')}</div></fieldset>`;
const radio = (v: string) => $<HTMLInputElement>(`input[value="${v}"]`);
const labelOf = (v: string) => radio(v).closest('label')!;

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('dir');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Segmented control', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(<SegmentedControl legend="View" name="view" defaultValue="week" options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />);
    expect(outline(react)).toEqual(outline(html));
  });

  it('enters at the checked option; arrows move it; Space checks', async () => {
    document.body.innerHTML = html;
    focusDocument();
    await tab();
    expect(document.activeElement).toBe(radio('week'));
    expect(getComputedStyle(labelOf('week')).outlineStyle).toBe('solid');
    await userEvent.keyboard('{ArrowRight}');
    expect(radio('month').checked).toBe(true);
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(radio('day').checked).toBe(true);
    radio('day').checked = false;
    await userEvent.keyboard(' ');
    expect(radio('day').checked).toBe(true);
  });

  it('draws the checked option apart from the rest, with a target of at least 24 px', () => {
    document.body.innerHTML = html;
    expect(getComputedStyle(labelOf('week')).boxShadow).not.toBe(getComputedStyle(labelOf('day')).boxShadow);
    const { height } = labelOf('day').getBoundingClientRect();
    expect(height).toBeGreaterThanOrEqual(24);
  });

  describe('liquid key', () => {
    const options = () => $('.lue-segmented__options');
    /** The key's custom properties on the options, in px. */
    const key = () => ['x', 'y', 'w', 'h'].map((p) => parseFloat(options().style.getPropertyValue(`--lue-key-${p}`)));
    /** Where the key should be for an option: its inline-start offset from the padding edge, and its size. */
    const expected = (v: string) => {
      const box = options().getBoundingClientRect();
      const r = labelOf(v).getBoundingClientRect();
      const style = getComputedStyle(options());
      return style.direction === 'rtl'
        ? [box.right - r.right - parseFloat(style.borderRightWidth), r.top - box.top - options().clientTop, r.width, r.height]
        : [r.left - box.left - options().clientLeft, r.top - box.top - options().clientTop, r.width, r.height];
    };
    const near = (actual: number[], wanted: number[]) => actual.forEach((v, i) => expect(v).toBeCloseTo(wanted[i]!, 0));
    /** Counts the animations started on the options. */
    const watch = () => {
      const el = options();
      const calls: Parameters<HTMLElement['animate']>[] = [];
      el.animate = (...args) => {
        calls.push(args);
        return HTMLElement.prototype.animate.apply(el, args);
      };
      return calls;
    };
    const mount = async () => {
      document.body.innerHTML = html;
      await frame();
    };

    it('places the key on the checked option and marks the options', async () => {
      await mount();
      expect(options().getAttribute('data-lue-liquid')).toBe('');
      near(key(), expected('week'));
    });

    it('follows the choice by click and keyboard, flowing on ::before to the resting place', async () => {
      await mount();
      const calls = watch();
      await userEvent.click(labelOf('month'));
      await frame();
      near(key(), expected('month'));
      expect(calls).toHaveLength(1);
      const [keyframes, settings] = calls[0]! as [Keyframe[], KeyframeAnimationOptions];
      expect(settings.pseudoElement).toBe('::before');
      expect(keyframes.at(-1)).toEqual({ translate: `${key()[0]}px 0`, scale: '1 1' });
      radio('month').focus();
      await userEvent.keyboard('{ArrowLeft}');
      await frame();
      expect(radio('week').checked).toBe(true);
      near(key(), expected('week'));
      expect(calls).toHaveLength(2);
    });

    it('measures from the right in right-to-left text', async () => {
      document.documentElement.dir = 'rtl';
      await mount();
      await userEvent.click(labelOf('day'));
      await frame();
      near(key(), expected('day'));
      document.documentElement.removeAttribute('dir');
    });

    it("doesn't animate under reduced motion, but still moves", async () => {
      await emulate({ reducedMotion: 'reduce' });
      await mount();
      const calls = watch();
      await userEvent.click(labelOf('day'));
      await frame();
      near(key(), expected('day'));
      expect(calls).toHaveLength(0);
    });

    it('picks up a control added later', async () => {
      document.body.innerHTML = '<main></main>';
      await frame();
      $('main').innerHTML = html;
      await frame();
      expect(options().hasAttribute('data-lue-liquid')).toBe(true);
      near(key(), expected('week'));
    });

    it('measures again when options change, and takes the key away when none is checked', async () => {
      await mount();
      labelOf('day').remove();
      await frame();
      near(key(), expected('week'));
      labelOf('week').remove();
      await frame();
      expect(options().hasAttribute('data-lue-liquid')).toBe(false);
      expect(options().style.getPropertyValue('--lue-key-x')).toBe('');
      options().insertAdjacentHTML('afterbegin', option('year', 'Year', true));
      await frame();
      expect(options().hasAttribute('data-lue-liquid')).toBe(true);
      near(key(), expected('year'));
    });
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${html}</main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('marks the checked option with SelectedItem in forced colours', async () => {
    document.body.innerHTML = html;
    await emulate({ forcedColors: 'active' });
    expect(getComputedStyle(labelOf('week')).backgroundColor).toBe(resolveColor('SelectedItem'));
  });
});
