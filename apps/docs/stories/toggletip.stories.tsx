import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Toggletip } from '@lue-ui/react';

/**
 * A small button that shows a line of help on click, touch or keyboard, not on hover. The help follows the button in
 * reading order. Contract: `apps/docs/contracts/toggletip.json`.
 */
const meta = {
  title: 'Components/Toggletip',
  component: Toggletip,
  // Each example in its own frame on the docs page: their ids would clash, and an open overlay would cover the page.
  parameters: { docs: { story: { inline: false, height: '200px' } } },
  args: { id: 'delivery-tip', label: 'More about delivery', children: 'Orders placed before 2pm go out today.' },
  render: (args) => (
    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      Express delivery <Toggletip {...args} />
    </p>
  ),
} satisfies Meta<typeof Toggletip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'More about delivery' }));
    const tip = canvasElement.ownerDocument.getElementById('delivery-tip')!;
    await waitFor(() => expect(tip.matches(':popover-open')).toBe(true));
  },
};
