import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, Quote } from '@lue-ui/react';

/** A testimonial: the quotation, a chrome mark and its source. Contract: `apps/docs/contracts/quote.json`. */
const meta = {
  title: 'Blocks/Quote',
  component: Quote,
} satisfies Meta<typeof Quote>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'They made our site faster and easier to use, and our readers noticed within a week.',
    name: 'Alex Morgan',
    role: 'Editor, Kiln',
    avatar: <Avatar name="Alex Morgan" decorative />,
  },
};
