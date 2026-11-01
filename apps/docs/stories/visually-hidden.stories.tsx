import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link, VisuallyHidden } from '@lue-ui/react';

/**
 * Text that assistive technology reads and the screen doesn't show, e.g. the end of a link's name. It shows while
 * something inside it has focus. Contract: `apps/docs/contracts/visually-hidden.json`.
 */
const meta = {
  title: 'Components/Visually hidden',
  component: VisuallyHidden,
  args: { children: ', opens in a new tab' },
  render: (args) => (
    <p>
      <Link href="#pricing">
        Pricing
        <VisuallyHidden {...args} />
      </Link>
    </p>
  ),
} satisfies Meta<typeof VisuallyHidden>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InALinkName: Story = {};
