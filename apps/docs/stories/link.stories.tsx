import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '@lue-ui/react';

/**
 * `<a class="lue-link">`: underlined always, in running text and alone, so colour is never the only cue. Contract:
 * `apps/docs/contracts/link.json`.
 */
const meta = {
  title: 'Components/Link',
  component: Link,
  args: { href: '#statement', children: 'accessibility statement' },
  render: (args) => (
    <p>
      Read our <Link {...args} /> or get in touch.
    </p>
  ),
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InText: Story = {};
export const OnItsOwn: Story = { render: (args) => <Link {...args}>View every project</Link> };
