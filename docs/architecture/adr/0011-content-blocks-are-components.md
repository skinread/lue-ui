# ADR-0011: Content blocks are components, with contracts and the same gates

- **Status:** Accepted
- **Date:** 2026-11-22
- **Revises:** the [inventory](../../design/components.md#content-blocks---portfolio-and-editorial-pass-2)'s content
  blocks (Pass 2), which planned them as "documented HTML recipes first"
- **Principles:** 1 accessible by construction · 10 legible to humans and agents · 9 one core, many frameworks ·
  4 CSS is the API

## Context

Pass 2 (2026-10-05) moved the focus to portfolio and editorial sites and added nineteen content blocks to the
inventory: site header and footer, three heroes, feature grid, project card, post list item, quote, pull quote,
media + text, timeline, table of contents, code block, figure, author card, newsletter band, tag filter and icon tile.
Their CSS was moved from the Claude Design System seed into one file, `packages/css/src/blocks.css`, and shipped as
`@lue-ui/css/blocks.css`. Nothing else followed: no contract, no React adapter, no story, no test. So none of the
ADR-0005 gates (axe in every theme, keyboard, forced colours, reflow, static markup, visual regression) checked them,
the MCP server and `llms.txt` didn't list them, and their markup lived only in the design-system generator's prose.

## Decision

1. **A block is a component.** Each gets what a component gets: a contract in `apps/docs/contracts` (schema v1,
   unchanged), its CSS in `packages/css/src/blocks/<id>.css` in `@layer lue.blocks` with its own contrast and
   forced-colours rules, a React adapter in `packages/react/src/<id>/` rendering the same markup, stories titled
   `Blocks/<Name>`, and tests in `tests/<id>/`. `pnpm check` holds them to the same rules as components.
2. **`@lue-ui/css/blocks.css` stays** as the bundle of every block, and each block is also importable on its own
   (`@lue-ui/css/blocks/<id>.css`). Each file has the component budget (1.5 KB Brotli).
3. **One contract per block, with two merges and two additions.** The statement and split heroes are one Hero (the
   split hero is a hero with a figure as its object); the article hero is ArticleHeader. Prose (the text styles and
   the article body) and Section (the page wrap, a section with a head, and a row of actions) get contracts too, since
   every block uses them. That makes twenty contracts.
4. **Class names don't change.** The canvas, the Claude Design System and `tests/emulation` already use them. Where the
   design-system generator used inline styles (the footer's note, the quote's source, timeline and author text, the
   feature grid's list), the blocks gain classes.
5. **Changes to the inventory's plans:**
   - **Site header:** no disclosure navigation on small screens yet. The list wraps instead, and the header is sticky
     only on viewports at least 30rem tall, so at 400% zoom it can't cover what has focus or most of the page (WCAG
     1.4.10, 2.4.11). A disclosure is worth adding when a site has more links than fit on two lines.
   - **Author card:** a `<section aria-label>`, not an `<aside>`: an aside with a name is a complementary landmark,
     and inside `<main>` it fails axe's `landmark-complementary-is-top-level` (the reason Alert isn't an aside either).
   - **Table of contents:** named by its visible title through `aria-labelledby`, so the visible label is the name
     (WCAG 2.5.3). The current section is `aria-current="true"`, set by the page; highlighting it from scroll state
     stays a future enhancement.
   - **Code block:** the opt-in copy button isn't built.
   - **Tag filter:** in its links form (filtering as navigation), the chosen tag is `aria-current="page"`, and a
     `.lue-button` link that is the current page now draws the raised chrome key, as `aria-pressed="true"` does
     (ADR-0010's "pressed and selected" language).

## Consequences

- **Positive:** every block is checked in three engines and four themes, listed by the MCP server and `llms.txt`, has
  guidelines generated from its contract, and has a typed React API.
- **Negative:** twenty more contracts, stories and test folders to keep up, and the per-block contrast rules repeat
  the card's.
- **Follow-ups:** the site header's disclosure, the table of contents' scroll-state highlight and the code block's
  copy button, when a site needs them.

## Alternatives considered

- **HTML recipes only, as planned.** Cheaper, but recipes outside the contracts escape every gate and every agent
  tool, which is how the blocks went unchecked for six weeks.
- **One contract for all blocks, like Layout.** Layout's six primitives share one purpose and no semantics; the blocks
  each have their own landmarks, headings and names, which is what a contract is for.
- **Renaming the classes to one `lue-<block>` root each** (`.lue-media-text` for `.lue-split`). Tidier, but it would
  break the canvas and the Claude Design System for no gain to users.
