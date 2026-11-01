import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from '@lue-ui/react';

/** `<kbd class="lue-kbd">`, a key cap; nest them for a combination. Contract: `apps/docs/contracts/kbd.json`. */
const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  args: { children: 'Esc' },
  render: (args) => <p>Press <Kbd {...args} /> to close.</p>,
} satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Combination: Story = {
  render: () => <p>Press <Kbd><Kbd>Ctrl</Kbd>+<Kbd>K</Kbd></Kbd> to search.</p>,
};
