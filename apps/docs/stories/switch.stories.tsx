import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Switch } from '@lue-ui/react';

/**
 * `<input type="checkbox" role="switch">` inside its `<label>`: on or off, applied at once. Use a checkbox when the
 * choice waits for a submit. Contract: `apps/docs/contracts/switch.json`.
 */
const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { label: 'Order updates by text' },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const On: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };

/** Space turns it on and off. */
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('switch', { name: 'Order updates by text' });
    // Firefox sometimes drops the first focus() while the story settles, so retry it.
    await waitFor(() => {
      toggle.focus();
      return expect(toggle).toHaveFocus();
    });
    await userEvent.keyboard(' ');
    await expect(toggle).toBeChecked();
  },
};
