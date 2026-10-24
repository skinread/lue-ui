// ADR-0005 emulation rows, asserting computed styles (not matchMedia): forced colours, increased contrast, colour
// scheme, reduced motion, 320 px reflow and RTL. Uses the built tokens (pnpm test builds them first) and the CSS
// sources. Forced colours runs in Chromium and Firefox only: Playwright's WebKit reports it but doesn't apply it.
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { commands, page, server } from 'vitest/browser';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import type { MediaEmulation } from './commands.js';
import { html } from './fixture.js';

declare module 'vitest/browser' {
  interface BrowserCommands {
    emulateMedia: (media: MediaEmulation) => Promise<void>;
  }
}

// Emulate, then wait for the next frames so every engine has restyled. Playwright's Firefox updates matchMedia for
// `contrast` but doesn't re-evaluate stylesheets already in the page (a freshly inserted sheet does see it), so there
// the test re-inserts every <style> — a harness gap, not a browser one (checked 2026-10-24, Playwright 1.64).
async function emulate(media: MediaEmulation): Promise<void> {
  await commands.emulateMedia(media);
  if (server.browser === 'firefox') for (const el of document.querySelectorAll('style')) el.parentNode!.append(el);
  await frame();
}

const $ = (selector: string) => document.querySelector<HTMLElement>(selector)!;
const style = (selector: string, pseudo?: string) => getComputedStyle($(selector), pseudo);
const token = (name: string, el: Element = document.documentElement) => getComputedStyle(el).getPropertyValue(name).trim();
const reset = () => emulate({ colorScheme: 'dark', contrast: 'no-preference', forcedColors: 'none', reducedMotion: 'no-preference' });

beforeAll(() => {
  document.body.innerHTML = html;
});
afterEach(async () => {
  await reset();
  await page.viewport(1280, 800);
  document.documentElement.removeAttribute('dir');
});

describe('colour scheme', () => {
  it('is dark by default and follows a light OS preference', async () => {
    await reset();
    expect(style(':root').colorScheme).toBe('dark');
    expect(token('--lue-color-bg-canvas')).toMatch(/^oklch\(15\.5% /);
    await emulate({ colorScheme: 'light' });
    expect(style(':root').colorScheme).toBe('light');
    expect(token('--lue-color-bg-canvas')).not.toMatch(/^oklch\(15\.5% /);
  });

  it('lets data-theme override the OS, and recomputes materials in the subtree', async () => {
    await emulate({ colorScheme: 'light' });
    const island = $('#dark-island');
    expect(getComputedStyle(island).colorScheme).toBe('dark');
    expect(token('--lue-color-bg-canvas', island)).toMatch(/^oklch\(15\.5% /);
    // The glass filter is composed in theme.css; it must use the island's dark brightness, not the page's light one.
    expect(token('--lue-glass-filter', island)).toMatch(/brightness\(0?\.6\)/);
    expect(token('--lue-glass-filter')).toMatch(/brightness\(1\.12\)/);
  });
});

describe('increased contrast', () => {
  it('switches to the -more tokens', async () => {
    const standard = token('--lue-color-fg-default');
    await emulate({ contrast: 'more' });
    expect(token('--lue-color-fg-default')).not.toBe(standard);
    await emulate({ contrast: 'more', colorScheme: 'light' });
    expect(style(':root').colorScheme).toBe('light');
    expect(token('--lue-color-fg-default')).toMatch(/^oklch\(15% /); // light-more ink
  });

  it('makes glass opaque and chrome one solid line', async () => {
    await emulate({ contrast: 'more' });
    expect(style('#card').backdropFilter).toBe('none');
    expect(style('#card').backgroundImage).toBe('none');
    expect(style('#card').backgroundColor).toBe(getComputedStyle(probe('--lue-color-bg-surface')).backgroundColor);
    expect(style('#card', '::before').backgroundImage).toBe('none');
  });

  it('applies within a subtree with data-contrast="more"', async () => {
    const island = $('#dark-island');
    island.setAttribute('data-contrast', 'more');
    try {
      expect(getComputedStyle(island).backdropFilter).toBe('none');
      expect(token('--lue-color-fg-default', island)).not.toBe(token('--lue-color-fg-default'));
    } finally {
      island.removeAttribute('data-contrast');
    }
  });
});

describe('forced colours', () => {
  it.skipIf(server.browser === 'webkit')('drops materials and keeps every boundary visible', async () => {
    await emulate({ forcedColors: 'active' });
    for (const selector of ['#card', '#primary']) {
      expect(style(selector).backdropFilter, selector).toBe('none');
      expect(style(selector, '::before').content, `${selector}::before`).toBe('none');
      expect(style(selector).borderTopStyle, selector).toBe('solid');
      expect(alpha(style(selector).borderTopColor), `${selector} border`).toBe(1);
    }
    expect(style('#primary', '::after').content).toBe('none');
    expect(alpha(style('#email').borderTopColor)).toBe(1);
  });
});

describe('reduced motion', () => {
  it('zeroes every duration', async () => {
    expect(seconds(token('--lue-motion-duration-slow'))).toBe(0.32);
    await emulate({ reducedMotion: 'reduce' });
    expect(seconds(token('--lue-motion-duration-slow'))).toBe(0);
    const durations = style('#primary').transitionDuration.split(',').map((d) => parseFloat(d));
    expect(durations.every((d) => d === 0), style('#primary').transitionDuration).toBe(true);
  });
});

describe('320 px reflow', () => {
  it('never scrolls sideways', async () => {
    await page.viewport(320, 640);
    await frame();
    const root = document.documentElement;
    expect(root.scrollWidth, 'document width').toBeLessThanOrEqual(root.clientWidth);
    for (const el of document.querySelectorAll<HTMLElement>('#page *')) {
      const { right } = el.getBoundingClientRect();
      expect(right, `${el.tagName.toLowerCase()}.${el.className}`).toBeLessThanOrEqual(root.clientWidth + 0.5);
    }
  });

  it('scales fluid space between 360 and 1280 px', async () => {
    const space = () => parseFloat(getComputedStyle(probe('--lue-space-s', 'padding-inline-start')).paddingInlineStart);
    await page.viewport(320, 640);
    await frame();
    expect(space()).toBeCloseTo(16, 1);
    await page.viewport(1280, 800);
    await frame();
    expect(space()).toBeCloseTo(18, 1);
  });
});

describe('right to left', () => {
  it('mirrors logical properties, the switch and marked icons', async () => {
    await emulate({ reducedMotion: 'reduce' }); // read the switch thumb's end state, not its transition
    const ltr = { start: style('#size').paddingLeft, end: style('#size').paddingRight };
    document.documentElement.dir = 'rtl';
    await frame();
    expect(style('#size').paddingRight).toBe(ltr.start);
    expect(style('#size').paddingLeft).toBe(ltr.end);
    expect(style('#switch', '::before').translate).toBe('-20px');
    expect(style('#arrow').scale).toBe('-1 1');
  });
});

// An element that renders a token through a property, so the browser resolves it to a used value.
function probe(name: string, property = 'background-color'): HTMLElement {
  const el = document.createElement('div');
  el.style.setProperty(property, `var(${name})`);
  document.body.append(el);
  queueMicrotask(() => el.remove());
  return el;
}
function alpha(color: string): number {
  const m = color.match(/\/\s*([\d.]+)\)$|rgba\([^)]*,\s*([\d.]+)\)$/);
  return m ? parseFloat(m[1] ?? m[2] ?? '1') : 1;
}
const seconds = (time: string) => (time.endsWith('ms') ? parseFloat(time) / 1000 : parseFloat(time));
const frame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
