import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthorCard, Avatar } from '@lue-ui/react';

/** Who wrote this, in a glass panel. Contract: `apps/docs/contracts/author-card.json`. */
const meta = {
  title: 'Blocks/Author card',
  component: AuthorCard,
} satisfies Meta<typeof AuthorCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Sam Taylor',
    bio: 'Designs and builds accessible front ends, and writes about colour, contrast and the platform.',
    avatar: <Avatar name="Sam Taylor" size="lg" decorative />,
    action: <a className="lue-button" data-size="sm" href="#sam">More posts by Sam</a>,
  },
};
