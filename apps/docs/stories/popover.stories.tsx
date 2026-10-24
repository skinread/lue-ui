import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Link, Popover, PopoverTrigger } from '@lue-ui/react';

/**
 * `<div class="lue-popover" popover>`, opened by its button with `command="toggle-popover"` and anchored to it. Esc
 * and a click outside close it; no script. Contract: `apps/docs/contracts/popover.json`.
 */
const meta = {
  title: 'Components/Popover',
  component: Popover,
  args: { id: 'share' },
  render: (args) => (
    <>
      <PopoverTrigger target={args.id}>Share</PopoverTrigger>
      <Popover {...args}>
        <p>Anyone with the link can view this project.</p>
        <Link href="#copy">Copy link</Link>
      </Popover>
    </>
  ),
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Its button opens and closes it. */
export const Toggle: Story = {
  play: async ({ canvas, canvasElement }) => {
    const popover = canvasElement.ownerDocument.getElementById('share')!;
    await userEvent.click(canvas.getByRole('button', { name: 'Share' }));
    await waitFor(() => expect(popover.matches(':popover-open')).toBe(true));
    await userEvent.click(canvas.getByRole('button', { name: 'Share' }));
    await waitFor(() => expect(popover.matches(':popover-open')).toBe(false));
  },
};
