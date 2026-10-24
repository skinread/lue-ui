// Button (apps/docs/contracts/button.json): markup parity, the keyboard model, focus indicator, target size, axe in
// every theme, the ring's non-inherited angle, and forced colours. Chromium, Firefox and WebKit.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { server, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Button } from '@lue-ui/react';
import { $, emulate, expectNoAxeViolations, frame, outline, resetMedia, resolveColor, tab } from '../support/browser.js';

const icon = '<svg class="lue-button__icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8"></path></svg>';
const html = `
<div id="buttons">
  <button type="button" class="lue-button" id="neutral">Save for later</button>
  <button type="button" class="lue-button" data-variant="primary" id="primary">Continue to payment</button>
  <button type="button" class="lue-button" data-variant="danger" id="danger">Remove</button>
  <button type="button" class="lue-button" data-variant="quiet" id="quiet">Cancel</button>
  <button type="button" class="lue-button" data-size="sm" id="small">Edit</button>
  <button type="button" class="lue-button" data-size="lg" id="large">Subscribe</button>
  <button type="button" class="lue-button" data-icon-only="" aria-label="Close" id="icon">${icon}</button>
  <button type="button" class="lue-button" aria-pressed="true" id="pressed">Bold</button>
  <button type="button" class="lue-button" disabled="" id="disabled">Unavailable</button>
  <button type="button" class="lue-button" aria-disabled="true" id="soft-disabled">Pay now</button>
</div>`;

const react = (
  <div id="buttons">
    <Button id="neutral">Save for later</Button>
    <Button variant="primary" id="primary">Continue to payment</Button>
    <Button variant="danger" id="danger">Remove</Button>
    <Button variant="quiet" id="quiet">Cancel</Button>
    <Button size="sm" id="small">Edit</Button>
    <Button size="lg" id="large">Subscribe</Button>
    <Button iconOnly aria-label="Close" id="icon">
      <svg className="lue-button__icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" /></svg>
    </Button>
    <Button pressed id="pressed">Bold</Button>
    <Button disabled id="disabled">Unavailable</Button>
    <Button aria-disabled="true" id="soft-disabled">Pay now</Button>
  </div>
);

beforeEach(() => {
  document.body.innerHTML = html;
});
afterEach(async () => {
  document.documentElement.removeAttribute('data-theme');
  await resetMedia();
});

describe('Button', () => {
  it('renders the same markup from React as the HTML core', () => {
    expect(outline(renderToStaticMarkup(react))).toEqual(outline(html));
    expect(renderToStaticMarkup(<Button type="submit">Send</Button>)).toBe('<button type="submit" class="lue-button">Send</button>');
  });

  it('activates with Enter and Space, and skips a disabled button but not an aria-disabled one', async () => {
    const pressed: string[] = [];
    $('#buttons').addEventListener('click', (e) => pressed.push((e.target as HTMLElement).id));
    $('#large').focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(pressed).toEqual(['large', 'large']);
    $('#pressed').focus();
    await tab();
    expect(document.activeElement?.id, 'Tab skips the disabled button').toBe('soft-disabled');
  });

  it('shows a focus outline of at least 2 px in the focus-ring colour', async () => {
    $('#quiet').focus();
    await tab();
    expect(document.activeElement?.id).toBe('small');
    const style = getComputedStyle($('#small'));
    expect(style.outlineStyle).toBe('solid');
    expect(parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2);
    expect(style.outlineColor).toBe(resolveColor('var(--lue-color-focus-ring)'));
  });

  it('meets the 24 px target minimum at every size, and icon-only buttons are square', () => {
    for (const el of document.querySelectorAll<HTMLElement>('.lue-button')) {
      const { width, height } = el.getBoundingClientRect();
      expect(height, el.id).toBeGreaterThanOrEqual(24);
      expect(width, el.id).toBeGreaterThanOrEqual(24);
    }
    const { width, height } = $('#icon').getBoundingClientRect();
    expect(width).toBeCloseTo(height, 0);
  });

  for (const theme of ['dark', 'light', 'dark-more', 'light-more']) {
    it(`passes axe in ${theme}`, async () => {
      document.documentElement.setAttribute('data-theme', theme);
      await expectNoAxeViolations($('#buttons'));
    });
  }

  it('turns the ring on hover without its angle inheriting into the button', async () => {
    await emulate({ reducedMotion: 'reduce' }); // read end states
    await userEvent.hover($('#neutral'));
    await frame();
    expect(getComputedStyle($('#neutral'), '::before').getPropertyValue('--lue-angle').trim()).toBe('150deg');
    expect(getComputedStyle($('#neutral')).getPropertyValue('--lue-angle').trim()).toBe('0deg');
  });

  it.skipIf(server.browser === 'webkit')('uses system colours in forced colours, pressed as the selected pair', async () => {
    await emulate({ forcedColors: 'active', reducedMotion: 'reduce' }); // end states, not background transitions
    expect(getComputedStyle($('#neutral')).borderTopColor).toBe(resolveColor('ButtonText'));
    expect(getComputedStyle($('#pressed')).backgroundColor).toBe(resolveColor('SelectedItem'));
    expect(getComputedStyle($('#pressed')).color).toBe(resolveColor('SelectedItemText'));
    expect(getComputedStyle($('#disabled')).color).toBe(resolveColor('GrayText'));
    expect(getComputedStyle($('#primary'), '::after').content).toBe('none');
  });
});
