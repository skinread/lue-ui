import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Checkbox, ChoiceGroup } from '@lue-ui/react';

/**
 * A native `<input type="checkbox">` inside its `<label>`, redrawn with `appearance: none`. Several checkboxes share a
 * `ChoiceGroup` (a `<fieldset>` with a legend), whose hint and error describe the whole group. Contract:
 * `apps/docs/contracts/checkbox.json`.
 */
const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  subcomponents: { ChoiceGroup },
  args: { label: 'Email me about new collections' },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };

/** `indeterminate` is a DOM property with no attribute, so it's set from a ref. */
export const Indeterminate: Story = {
  args: { label: 'All rooms', ref: (input: HTMLInputElement | null) => { if (input) input.indeterminate = true; } },
};

export const Group: Story = {
  render: () => (
    <ChoiceGroup legend="Rooms" hint="Choose every room you're furnishing.">
      <Checkbox name="rooms" value="living" label="Living room" defaultChecked />
      <Checkbox name="rooms" value="bedroom" label="Bedroom" />
      <Checkbox name="rooms" value="study" label="Study" />
    </ChoiceGroup>
  ),
};

export const GroupWithError: Story = {
  render: () => (
    <ChoiceGroup legend="Rooms" error="Choose at least one room">
      <Checkbox name="rooms" value="living" label="Living room" />
      <Checkbox name="rooms" value="bedroom" label="Bedroom" />
    </ChoiceGroup>
  ),
};

/** Space toggles it; clicking the label does too. */
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    const box = canvas.getByRole('checkbox', { name: 'Email me about new collections' });
    // Firefox sometimes drops the first focus() while the story settles, so retry it.
    await waitFor(() => {
      box.focus();
      return expect(box).toHaveFocus();
    });
    await userEvent.keyboard(' ');
    await expect(box).toBeChecked();
    await userEvent.click(canvas.getByText('Email me about new collections'));
    await expect(box).not.toBeChecked();
  },
};
