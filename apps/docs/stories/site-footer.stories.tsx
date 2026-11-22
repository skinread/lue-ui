import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconTile, SiteFooter, Wordmark } from '@lue-ui/react';
import { Glyph } from './support/art.js';

/** The wordmark, a footer navigation and a copyright note, under a chrome line. Contract: `apps/docs/contracts/site-footer.json`. */
const meta = {
  title: 'Blocks/Site footer',
  component: SiteFooter,
} satisfies Meta<typeof SiteFooter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    brand: <Wordmark href="#home" tile={<IconTile><Glyph name="triangle" /></IconTile>}>Lue</Wordmark>,
    items: [
      { label: 'Work', href: '#work' },
      { label: 'Journal', href: '#journal' },
      { label: 'Contact', href: '#contact' },
      { label: 'Accessibility', href: '#accessibility' },
    ],
    note: '© 2026 Lue Studio',
  },
};
