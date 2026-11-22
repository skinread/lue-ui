// Code block (apps/docs/contracts/code-block.json): parity, Tab focuses the code, ArrowRight and ArrowLeft scroll a wide
// block inside itself, axe in every theme, reflow, increased contrast and forced colours. Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { CodeBlock, CodeToken } from '@lue-ui/react';
import { $, focusDocument, frame, tab } from '../support/browser.js';
import { blockGates, cleanUp } from '../support/blocks.js';

const line = ': var(--glass); /* a long line that has to scroll sideways, much longer than the panel is wide */';
const html = `<figure class="lue-code" id="code" style="inline-size:280px">
  <figcaption><span>CSS</span><span>Glass button</span></figcaption>
  <pre tabindex="0"><code><span class="lue-code__token" data-kind="property">background-color</span>${line}</code></pre>
</figure>`;
/** Waits until a smooth scroll has stopped: the same position for three frames running. */
async function settled(element: Element): Promise<number> {
  let last = -1;
  let same = 0;
  while (same < 3) {
    await frame();
    same = element.scrollLeft === last ? same + 1 : 0;
    last = element.scrollLeft;
  }
  return last;
}
cleanUp();

describe('Code block', () => {
  blockGates({
    html,
    glass: '.lue-code',
    react: <CodeBlock id="code" style={{ inlineSize: '280px' }} language="CSS" title="Glass button"><CodeToken kind="property">background-color</CodeToken>{line}</CodeBlock>,
  });

  it('focuses the code with Tab, and the arrow keys scroll it inside itself', async () => {
    document.body.innerHTML = html;
    const pre = $('#code pre');
    focusDocument();
    await tab();
    expect(document.activeElement).toBe(pre);
    expect(getComputedStyle(pre).outlineStyle).toBe('solid');
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    const scrolled = await settled(pre);
    expect(scrolled).toBeGreaterThan(0);
    await userEvent.keyboard('{ArrowLeft}');
    expect(await settled(pre)).toBeLessThan(scrolled);
    expect(document.documentElement.scrollLeft).toBe(0);
  });
});
