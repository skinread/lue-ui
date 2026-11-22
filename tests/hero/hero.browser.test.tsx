// Hero (apps/docs/contracts/hero.json): parity, named by its h1, Tab reaches its action and Enter follows it, the object
// stacks when narrow, the centred layout, the satin off under increased contrast, axe in every theme and reflow.
// Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Hero } from '@lue-ui/react';
import { $, focusDocument, frame, tab } from '../support/browser.js';
import { blockGates, cleanUp, labelOf } from '../support/blocks.js';

const prism = '<svg class="lue-prism" aria-hidden="true" viewBox="0 0 10 10"><path d="M5 1 9 9H1Z"></path></svg>';
const html = `<section class="lue-hero" id="intro" aria-labelledby="intro-title">
  <div class="lue-hero__grid">
    <div class="lue-hero__text">
      <p class="lue-kicker">Design and engineering studio</p>
      <h1 class="lue-display" id="intro-title">Interfaces that hold their light.</h1>
      <p class="lue-lede">Calm to use, alive to touch.</p>
      <div class="lue-actions"><a class="lue-button" data-variant="primary" href="#work">View selected work</a></div>
    </div>
    <div class="lue-hero__object">${prism}</div>
  </div>
</section>`;
const object = <svg className="lue-prism" aria-hidden="true" viewBox="0 0 10 10"><path d="M5 1 9 9H1Z" /></svg>;
cleanUp();

describe('Hero', () => {
  blockGates({
    html,
    react: (
      <Hero
        id="intro"
        kicker="Design and engineering studio"
        title="Interfaces that hold their light."
        lede="Calm to use, alive to touch."
        actions={<a className="lue-button" data-variant="primary" href="#work">View selected work</a>}
        object={object}
      />
    ),
  });

  it('is named by its h1', () => {
    document.body.innerHTML = html;
    expect(labelOf($('#intro'))).toBe('Interfaces that hold their light.');
    expect($('#intro h1').id).toBe('intro-title');
  });

  it('generates the headline id without one of its own', () => {
    document.body.innerHTML = renderToStaticMarkup(<Hero title="Hello" />);
    expect(labelOf($('.lue-hero'))).toBe('Hello');
  });

  it('reaches its action with Tab, and Enter follows it', async () => {
    document.body.innerHTML = html;
    focusDocument();
    await tab();
    expect(document.activeElement).toBe($('a[href="#work"]'));
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(location.hash).toBe('#work');
  });

  it('puts the object beside the text when wide and under it when narrow', async () => {
    const [width, height] = [window.innerWidth, window.innerHeight];
    document.body.innerHTML = html;
    try {
      await page.viewport(1280, 800);
      await frame();
      expect($('.lue-hero__object').getBoundingClientRect().left).toBeGreaterThan($('.lue-hero__text').getBoundingClientRect().left);
      await page.viewport(320, 640);
      await frame();
      expect($('.lue-hero__object').getBoundingClientRect().top).toBeGreaterThanOrEqual($('.lue-hero__text').getBoundingClientRect().bottom);
    } finally {
      await page.viewport(width, height);
    }
  });

  it('centres a single message', () => {
    document.body.innerHTML = renderToStaticMarkup(<Hero title="Hello" layout="center" />);
    expect($('.lue-hero').dataset.layout).toBe('center');
    expect(getComputedStyle($('.lue-hero__grid')).textAlign).toBe('center');
  });

  it('switches its satin off in increased contrast', () => {
    document.documentElement.setAttribute('data-theme', 'dark-more');
    document.body.innerHTML = renderToStaticMarkup(<Hero title="Hello" backdrop={<svg className="lue-satin" aria-hidden="true" />} />);
    expect(getComputedStyle($('.lue-satin')).display).toBe('none');
  });
});
