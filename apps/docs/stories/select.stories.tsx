import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Field, Select } from '@lue-ui/react';

const options = (
  <>
    <option value="">Choose…</option>
    <option value="standard">Standard, 3 to 5 days</option>
    <option value="express">Express, next day</option>
    <option value="collect">Collect from the studio</option>
  </>
);

/**
 * A native `<select>`. Where the browser supports customisable select (Chromium, Safari 27) the picker is overlay
 * glass; elsewhere the native picker is the fallback. Text options only in v1. Contract: `apps/docs/contracts/select.json`.
 */
const meta = {
  title: 'Components/Select',
  component: Select,
  subcomponents: { Field },
  render: (args) => (
    <Field label="Delivery" hint="Express orders placed before 2pm go out today.">
      <Select {...args}>{options}</Select>
    </Field>
  ),
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = {
  render: (args) => (
    <Field label="Delivery" error="Choose a delivery option">
      <Select {...args}>{options}</Select>
    </Field>
  ),
};

export const Choosing: Story = {
  play: async ({ canvas }) => {
    const select = canvas.getByLabelText('Delivery');
    await userEvent.selectOptions(select, 'express');
    await expect(select).toHaveValue('express');
  },
};
