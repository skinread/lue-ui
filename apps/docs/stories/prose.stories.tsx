import type { Meta, StoryObj } from '@storybook/react-vite';
import { Prose } from '@lue-ui/react';

/**
 * The text styles every block uses, as classes on native elements, and `.lue-prose` for an article's body: a readable
 * measure and spacing between paragraphs, headings and lists. Contract: `apps/docs/contracts/prose.json`.
 */
const meta = {
  title: 'Blocks/Prose',
  component: Prose,
} satisfies Meta<typeof Prose>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TextStyles: Story = {
  name: 'Text styles',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--lue-space-m)' }}>
      <p className="lue-kicker">Kicker</p>
      <h1 className="lue-display">Display headline</h1>
      <h2 className="lue-title">Article title</h2>
      <p className="lue-lede">A lede: a sentence or two under a headline.</p>
      <p className="lue-dek">A dek: what an article is about.</p>
      <h3 className="lue-h2">Section heading</h3>
      <h4 className="lue-h3">Card heading</h4>
      <p className="lue-meta"><span className="lue-kicker">Craft</span><span className="lue-kicker">5 min read</span></p>
      <p className="lue-excerpt">An excerpt, muted, at most sixty characters a line.</p>
    </div>
  ),
};

export const Body: Story = {
  render: () => (
    <Prose as="article">
      <p>Surfaces stay neutral; colour arrives as light, gathered at an edge. Contrast is fixed, so the light can move.</p>
      <h2 id="glass">Glass that steps aside</h2>
      <p>Under increased contrast or reduced transparency, every glass surface turns opaque.</p>
      <ul>
        <li>Body text keeps 7:1 on every surface.</li>
        <li>Muted text keeps 4.5:1.</li>
      </ul>
    </Prose>
  ),
};
