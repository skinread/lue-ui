import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search } from '@lue-ui/react';

/**
 * A search landmark around a GET form: a labelled search field and a button. Works without script. Contract:
 * `apps/docs/contracts/search.json`.
 */
const meta = {
  title: 'Components/Search',
  component: Search,
  args: { label: 'Search projects', action: '#results' },
  render: (args) => <div style={{ maxInlineSize: '32rem' }}><Search {...args} /></div>,
} satisfies Meta<typeof Search>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithQuery: Story = { args: { defaultValue: 'weaving' } };
