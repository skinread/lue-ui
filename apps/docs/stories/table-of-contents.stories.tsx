import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableOfContents } from '@lue-ui/react';

/** An article's sections as in-page links, named by its visible title. Contract: `apps/docs/contracts/table-of-contents.json`. */
const meta = {
  title: 'Blocks/Table of contents',
  component: TableOfContents,
} satisfies Meta<typeof TableOfContents>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { href: '#colour', label: 'Colour as light' },
      { href: '#contrast', label: 'Contrast that holds' },
      { href: '#chrome', label: 'A chrome edge' },
      { href: '#glass', label: 'Glass that steps aside' },
    ],
    current: '#contrast',
  },
  render: (args) => <div style={{ maxInlineSize: '18rem' }}><TableOfContents {...args} /></div>,
};
