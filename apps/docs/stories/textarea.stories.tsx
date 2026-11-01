import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Field, Textarea } from '@lue-ui/react';

/**
 * A native `<textarea>` in a Field: the same label, hint and error as a text input. Contract:
 * `apps/docs/contracts/textarea.json`.
 */
const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  subcomponents: { Field },
  render: (args) => (
    <Field label="Delivery instructions" hint="Where to leave it if you're out.">
      <Textarea {...args} />
    </Field>
  ),
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Leave it with the neighbour at number 12.' } };
export const WithError: Story = {
  render: (args) => (
    <Field label="Delivery instructions" error="Enter delivery instructions">
      <Textarea {...args} />
    </Field>
  ),
};

/** Enter adds a line; it never submits. */
export const Typing: Story = {
  play: async ({ canvas }) => {
    const box = canvas.getByLabelText('Delivery instructions');
    // Firefox sometimes drops the first focus() while the story settles, so retry it.
    await waitFor(() => {
      box.focus();
      return expect(box).toHaveFocus();
    });
    await userEvent.keyboard('Side gate{Enter}Code 1234');
    await waitFor(() => expect(box).toHaveValue('Side gate\nCode 1234'));
  },
};
