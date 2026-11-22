import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArticleHeader, Avatar, Breadcrumb } from '@lue-ui/react';

/** The top of an article: breadcrumb, kicker, title, dek and byline. Contract: `apps/docs/contracts/article-header.json`. */
const meta = {
  title: 'Blocks/Article header',
  component: ArticleHeader,
} satisfies Meta<typeof ArticleHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    breadcrumb: <Breadcrumb items={[{ label: 'Journal', href: '#journal' }, { label: 'Craft', href: '#craft' }]} />,
    kicker: 'Craft · 5 min read',
    title: 'Designing with light',
    dek: 'How contrast stays fixed while colour moves through glass, chrome and a prism.',
    author: <><Avatar name="Sam Taylor" decorative /><span>Sam Taylor</span></>,
    published: { dateTime: '2026-10-05', label: '5 October 2026' },
  },
  render: (args) => <article><ArticleHeader {...args} /></article>,
};
