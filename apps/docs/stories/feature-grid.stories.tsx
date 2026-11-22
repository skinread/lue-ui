import type { Meta, StoryObj } from '@storybook/react-vite';
import { Feature, FeatureGrid, IconTile } from '@lue-ui/react';
import { Glyph } from './support/art.js';

/** A list of features, each a decorative icon tile, a heading and a sentence. Contract: `apps/docs/contracts/feature-grid.json`. */
const meta = {
  title: 'Blocks/Feature grid',
  component: FeatureGrid,
  subcomponents: { Feature },
} satisfies Meta<typeof FeatureGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

const features = [
  ['stack', 'Design systems', 'Tokens, components and guidance your team can build on - accessible by default.'],
  ['window', 'Interface design', 'Product screens that are calm to use and quick to understand.'],
  ['code', 'Front-end engineering', 'Standards-based HTML and CSS first, with just enough JavaScript.'],
  ['person', 'Accessibility', 'Audits and fixes against WCAG 2.2, tested with the assistive technology people use.'],
];

export const Default: Story = {
  render: () => (
    <FeatureGrid min="13rem">
      {features.map(([glyph, title, text]) => (
        <Feature key={title} icon={<IconTile><Glyph name={glyph!} /></IconTile>} title={title}>{text}</Feature>
      ))}
    </FeatureGrid>
  ),
};
