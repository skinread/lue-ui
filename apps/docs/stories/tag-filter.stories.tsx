import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagFilter } from '@lue-ui/react';

/**
 * Filter a list by tag: toggle buttons, or - when every tag has an `href` - links to filtered pages, which need no
 * script. Contract: `apps/docs/contracts/tag-filter.json`.
 */
const meta = {
  title: 'Blocks/Tag filter',
  component: TagFilter,
  args: { label: 'Filter projects' },
} satisfies Meta<typeof TagFilter>;
export default meta;
type Story = StoryObj<typeof meta>;

const tags = ['Systems', 'Product', 'Engineering', 'Content'];

export const Buttons: Story = {
  args: { options: tags.map((t) => ({ value: t, label: t })), defaultValue: ['Systems'] },
};

export const Links: Story = {
  args: { options: tags.map((t) => ({ value: t, label: t, href: `?tag=${t.toLowerCase()}` })), value: ['Systems'] },
};
