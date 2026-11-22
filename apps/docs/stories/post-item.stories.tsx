import type { Meta, StoryObj } from '@storybook/react-vite';
import { Media, PostItem } from '@lue-ui/react';
import { Prism } from './support/art.js';

/** A journal post in a list, as a row or a glass card. Contract: `apps/docs/contracts/post-item.json`. */
const meta = {
  title: 'Blocks/Post item',
  component: PostItem,
  args: {
    href: '#designing-with-light',
    title: 'Designing with light',
    category: 'Craft',
    published: { dateTime: '2026-10-05', label: '5 October 2026' },
    excerpt: 'How contrast stays fixed while colour moves through glass, chrome and a prism.',
  },
} satisfies Meta<typeof PostItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Row: Story = {};
export const CardVariant: Story = {
  name: 'Card',
  args: { variant: 'card', media: <Media ratio="16 / 10"><Prism /></Media> },
  render: (args) => <div style={{ maxInlineSize: '22rem' }}><PostItem {...args} /></div>,
};
