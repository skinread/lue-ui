// Tag (apps/docs/contracts/tag.json): parity, a named remove button that Enter, Space and a click use, a 24 px target,
// axe in every theme, forced colours. Chromium, Firefox and WebKit.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Tag } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, outline, resetMedia, resolveColor } from '../support/browser.js';

const remove = '<button type="button" class="lue-tag__remove" aria-label="Remove Design"><svg class="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" stroke-width="1.5"></path></svg></button>';
const html = `<span class="lue-tag">Design${remove}</span>`;

afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  document.body.replaceChildren();
  await resetMedia();
});

describe('Tag', () => {
  it('renders the same markup from React as the HTML core', () => {
    expect(outline(renderToStaticMarkup(<Tag>Design</Tag>))).toEqual(outline('<span class="lue-tag">Design</span>'));
    expect(outline(renderToStaticMarkup(<Tag onRemove={() => {}}>Design</Tag>))).toEqual(outline(html));
  });

  it('removes with a click, Enter or Space on its named button', async () => {
    const onRemove = vi.fn();
    const host = document.body.appendChild(document.createElement('div'));
    const root = createRoot(host);
    await act(async () => root.render(<Tag onRemove={onRemove} removeLabel="Remove the Design filter">Design</Tag>));
    const button = $('button');
    expect(button.getAttribute('aria-label')).toBe('Remove the Design filter');
    await userEvent.click(button);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onRemove).toHaveBeenCalledTimes(3);
    await act(async () => root.unmount());
  });

  it('gives the remove button a 24 px target', () => {
    document.body.innerHTML = html;
    const { width, height } = $('button').getBoundingClientRect();
    expect(Math.min(width, height)).toBeGreaterThanOrEqual(24);
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.innerHTML = `<main><p>${html} <span class="lue-tag">Research</span></p></main>`;
      await expectNoAxeViolations(document.body);
    });
  }

  it.skipIf(server.browser === 'webkit')('is Canvas with a CanvasText border in forced colours', async () => {
    document.body.innerHTML = html;
    await emulate({ forcedColors: 'active' });
    expect(getComputedStyle($('.lue-tag')).borderBlockStartColor).toBe(resolveColor('CanvasText'));
  });
});
