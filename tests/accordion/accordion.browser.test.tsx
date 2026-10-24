// Accordion (apps/docs/contracts/accordion.json): parity, one open at a time through <details name> with no script,
// each summary in the Tab order, and axe in every theme. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Accordion, Disclosure } from '@lue-ui/react';
import { $, focusDocument, expectNoAxeViolations, frame, outline, tab } from '../support/browser.js';

const caret = '<svg class="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>';
const items = [['delivery', 'How long does delivery take?', '3 to 5 days.'], ['returns', 'Can I return it?', 'Yes, within 30 days.']];
const html = `
<div class="lue-accordion">
  ${items.map(([id, q, a]) => `<details class="lue-disclosure" id="${id}" name="faq"><summary>${q}${caret}</summary><div><p>${a}</p></div></details>`).join('\n  ')}
</div>`;
const details = (id: string) => $<HTMLDetailsElement>(`#${id}`);

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
});

describe('Accordion', () => {
  it('renders the same markup from React as the HTML core', () => {
    const react = renderToStaticMarkup(
      <Accordion name="faq">
        {items.map(([id, q, a]) => <Disclosure key={id} id={id} summary={q}><p>{a}</p></Disclosure>)}
      </Accordion>,
    );
    expect(outline(react)).toEqual(outline(html));
  });

  it('gives every disclosure the same generated name without one', () => {
    document.body.innerHTML = renderToStaticMarkup(
      <Accordion>{items.map(([id, q, a]) => <Disclosure key={id} summary={q}><p>{a}</p></Disclosure>)}</Accordion>,
    );
    const names = [...document.querySelectorAll('details')].map((d) => d.getAttribute('name'));
    expect(names[0]).toMatch(/^accordion/);
    expect(names[1]).toBe(names[0]);
  });

  it('keeps one open at a time, from the keyboard', async () => {
    document.body.innerHTML = html;
    focusDocument();
    await tab();
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(details('delivery').open).toBe(true);
    await tab();
    expect(document.activeElement).toBe($('#returns summary'));
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(details('returns').open).toBe(true);
    expect(details('delivery').open).toBe(false);
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main>${html}</main>`;
      details('returns').open = true;
      await expectNoAxeViolations(document.body);
    });
  }
});
