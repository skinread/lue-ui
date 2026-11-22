// Author card (apps/docs/contracts/author-card.json): parity, a region named "About the author", Tab reaches its link and
// Enter follows it, axe in every theme, reflow, increased contrast and forced colours. Chromium, Firefox and WebKit.
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../../packages/tokens/dist/tokens.css';
import '../../packages/css/src/lue.css';
import { AuthorCard, Avatar } from '@lue-ui/react';
import { $, focusDocument, frame, tab } from '../support/browser.js';
import { blockGates, cleanUp } from '../support/blocks.js';

const html = `<section class="lue-author" id="author" aria-label="About the author">
  <span class="lue-avatar" aria-hidden="true">ST</span>
  <div class="lue-author__text"><p class="lue-author__name">Sam Taylor</p><p class="lue-author__bio">Builds accessible front ends.</p></div>
  <a class="lue-button" data-size="sm" href="#sam">More posts by Sam</a>
</section>`;
cleanUp();

describe('Author card', () => {
  blockGates({
    html,
    glass: '.lue-author',
    react: (
      <AuthorCard
        id="author"
        name="Sam Taylor"
        bio="Builds accessible front ends."
        avatar={<Avatar name="Sam Taylor" decorative />}
        action={<a className="lue-button" data-size="sm" href="#sam">More posts by Sam</a>}
      />
    ),
  });

  it('is a region named "About the author", not a nested complementary landmark', () => {
    document.body.innerHTML = html;
    expect($('#author').localName).toBe('section');
    expect($('#author').getAttribute('aria-label')).toBe('About the author');
  });

  it('reaches its link with Tab, and Enter follows it', async () => {
    document.body.innerHTML = html;
    focusDocument();
    await tab();
    expect(document.activeElement).toBe($('a[href="#sam"]'));
    await userEvent.keyboard('{Enter}');
    await frame();
    expect(location.hash).toBe('#sam');
  });
});
