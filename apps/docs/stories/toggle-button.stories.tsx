import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Cluster, ToggleButton } from '@lue-ui/react';

/**
 * A button that stays pressed (`aria-pressed`). Its label doesn't change; its state does. In HTML, add
 * `data-lue-toggle` and the behaviour flips it. Contract: `apps/docs/contracts/toggle-button.json`.
 */
const meta = {
  title: 'Components/Toggle button',
  component: ToggleButton,
  args: { children: 'Bold' },
} satisfies Meta<typeof ToggleButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Pressed: Story = { args: { defaultPressed: true } };

export const Group: Story = {
  render: () => (
    <Cluster gap="2xs" role="group" aria-label="Text style">
      <ToggleButton defaultPressed>Bold</ToggleButton>
      <ToggleButton>Italic</ToggleButton>
      <ToggleButton>Underline</ToggleButton>
    </Cluster>
  ),
};

/** A click flips it. */
export const Toggles: Story = {
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Bold' });
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'false');
  },
};
