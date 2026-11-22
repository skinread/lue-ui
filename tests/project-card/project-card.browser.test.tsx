// Project card (apps/docs/contracts/project-card.json): parity, the whole card is its link while its tags stay on top,
// the card shows the link's focus, Tab and Enter, axe in every theme, reflow, increased contrast and forced colours.
// Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { Media, ProjectCard } from '@lue-ui/react';
import { $, focusDocument, frame, tab } from '../support/browser.js';
import { blockGates, cleanUp } from '../support/blocks.js';

const html = `<article class="lue-project" id="card" style="max-inline-size:320px">
  <div class="lue-media"></div>
  <div class="lue-project__body">
    <p class="lue-meta"><span class="lue-kicker">Loom</span><span class="lue-kicker">2026</span></p>
    <h3 class="lue-h3"><a href="#loom">A design system for a weaving journal</a></h3>
    <p class="lue-excerpt">One line on the problem, and what changed.</p>
    <ul class="lue-tags" aria-label="Disciplines"><li><span class="lue-tag">Systems</span></li></ul>
  </div>
</article>`;
const inSection = (h: string) => `<main><h2>Work</h2>${h}</main>`;
const at = (x: number, y: number) => document.elementFromPoint(x, y);
cleanUp();

describe('Project card', () => {
  blockGates({
    html,
    page: inSection,
    glass: '.lue-project',
    react: (
      <ProjectCard
        id="card"
        style={{ maxInlineSize: '320px' }}
        href="#loom"
        title="A design system for a weaving journal"
        media={<Media />}
        meta={['Loom', '2026']}
        excerpt="One line on the problem, and what changed."
        tags={['Systems']}
      />
    ),
  });

  it('is its link all over, its tags included (they are text, not targets)', () => {
    document.body.innerHTML = html;
    const box = $('#card').getBoundingClientRect();
    expect(at(box.left + 6, box.top + 6)).toBe($('#card a'));
    const tag = $('.lue-tag').getBoundingClientRect();
    expect(at(tag.left + tag.width / 2, tag.top + tag.height / 2)).toBe($('#card a'));
  });

  it('shows the focus ring on the card, and Enter follows the link', async () => {
    document.body.innerHTML = html;
    focusDocument();
    await tab();
    expect(document.activeElement).toBe($('#card a'));
    expect(getComputedStyle($('#card')).outlineStyle).toBe('solid');
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(location.hash).toBe('#loom');
  });
});
