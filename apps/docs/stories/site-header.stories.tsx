import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconTile, SiteHeader, SkipLink, Wordmark } from '@lue-ui/react';
import { Glyph } from './support/art.js';

/**
 * A floating glass bar with the wordmark and the main navigation; the current page is `aria-current="page"`. The list
 * wraps on narrow screens, and it sticks only on viewports at least 30rem tall. Contract:
 * `apps/docs/contracts/site-header.json`.
 */
const meta = {
  title: 'Blocks/Site header',
  component: SiteHeader,
  subcomponents: { Wordmark },
} satisfies Meta<typeof SiteHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { label: 'Work', href: '#work', current: true },
  { label: 'Journal', href: '#journal' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const Default: Story = {
  args: { brand: <Wordmark href="#home" tile={<IconTile><Glyph name="triangle" /></IconTile>}>Lue</Wordmark>, items },
  render: (args) => (
    <>
      <SkipLink href="#main">Skip to content</SkipLink>
      <SiteHeader {...args} />
    </>
  ),
};
