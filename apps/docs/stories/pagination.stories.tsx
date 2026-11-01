import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from '@lue-ui/react';

/**
 * Previous, next, and numbered links: the first, the last, and the current page with its neighbours. Each number reads
 * "Page n". Contract: `apps/docs/contracts/pagination.json`.
 */
const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  args: { page: 5, pages: 12, href: (n: number) => `#page-${n}` },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Middle: Story = {};
export const First: Story = { args: { page: 1 } };
export const Last: Story = { args: { page: 12 } };
export const Few: Story = { args: { page: 2, pages: 3 } };
