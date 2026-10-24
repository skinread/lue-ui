// Segmented control (apps/docs/contracts/segmented-control.json): parity, a radio group with the native keyboard
// model (Tab in at the checked option, arrows move, Space checks), the checked and focused option drawn, a target of
// at least 24 px, axe in every theme, forced colours. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { SegmentedControl } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, focusDocument, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const option = (value: string, label: string, checked = false) => `<label class="lue-segmented__option"><input type="radio" name="view" value="${value}"${checked ? ' checked=""' : ''}>${label}</label>`;
const html = `<fieldset class="lue-segmented"><legend>View</legend><div class="lue-segmented__options">${option('day', 'Day')}${option('week', 'Week', true)}${option('month', 'Month')}</div></fieldset>`;
const radio = (v: string) => $<HTMLInputElement>(`input[value="${v}"]`);
const labelOf = (v: string) => radio(v).closest('label')!;

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
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
