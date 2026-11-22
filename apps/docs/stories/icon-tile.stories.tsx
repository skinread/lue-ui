import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconTile } from '@lue-ui/react';
import { Glyph } from './support/art.js';

/** An icon on a liquid-metal tile; always decorative. Contract: `apps/docs/contracts/icon-tile.json`. */
const meta = {
  title: 'Blocks/Icon tile',
  component: IconTile,
} satisfies Meta<typeof IconTile>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <p style={{ display: 'flex', gap: 'var(--lue-space-m)', alignItems: 'center' }}>
      <IconTile><Glyph name="sparkle" /></IconTile>
      <IconTile size="lg"><Glyph name="sparkle" /></IconTile>
      <span>Decorative: the words carry the meaning.</span>
    </p>
  ),
};
