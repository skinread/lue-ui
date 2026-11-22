// Section (apps/docs/contracts/section.json): parity for Section, Wrap and Actions, named by its heading, Tab reaches
// the head's action, the column's width, axe in every theme and reflow. Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Actions, Section, Wrap } from '@lue-ui/react';
import { $, focusDocument, outline, tab } from '../support/browser.js';
import { blockGates, cleanUp, labelOf } from '../support/blocks.js';

const html = `<section class="lue-section" id="work" aria-labelledby="work-title">
  <div class="lue-section__head"><h2 class="lue-h2" id="work-title">Selected work</h2><a class="lue-button" href="#all">All projects</a></div>
  <p>Three case studies.</p>
</section>`;
cleanUp();

describe('Section', () => {
  blockGates({ html, react: <Section id="work" title="Selected work" action={<a className="lue-button" href="#all">All projects</a>}><p>Three case studies.</p></Section> });

  it('renders Wrap and Actions as the HTML core does', () => {
    expect(outline(renderToStaticMarkup(<Wrap as="main">Page</Wrap>))).toEqual(outline('<main class="lue-wrap">Page</main>'));
    expect(outline(renderToStaticMarkup(<Actions><a href="#a">A</a></Actions>))).toEqual(outline('<div class="lue-actions"><a href="#a">A</a></div>'));
  });

  it('is named by its heading', () => {
    document.body.innerHTML = html;
    expect(labelOf($('#work'))).toBe('Selected work');
  });

  it('has no name or head without a title', () => {
    document.body.innerHTML = renderToStaticMarkup(<Section id="plain"><p>Text</p></Section>);
    expect($('#plain').hasAttribute('aria-labelledby')).toBe(false);
    expect(document.querySelector('.lue-section__head')).toBeNull();
  });

  it('reaches the head action with Tab', async () => {
    document.body.innerHTML = html;
    focusDocument();
    await tab();
    expect(document.activeElement).toBe($('a[href="#all"]'));
  });

  it('keeps the page column within 75rem, with the gutter at each side', () => {
    document.body.innerHTML = '<div class="lue-wrap" id="wrap">Page</div>';
    const box = $('#wrap').getBoundingClientRect();
    expect(box.width).toBeLessThanOrEqual(75 * 16);
    expect(box.left).toBeGreaterThan(0);
  });
});
