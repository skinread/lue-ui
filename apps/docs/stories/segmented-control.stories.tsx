import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { SegmentedControl } from '@lue-ui/react';

/**
 * A radio group drawn as one pill. Arrow keys move the choice, natively; it submits with its form. Contract:
 * `apps/docs/contracts/segmented-control.json`.
 */
const meta = {
  title: 'Components/Segmented control',
  component: SegmentedControl,
  args: { legend: 'View', name: 'view', defaultValue: 'week', options: [{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }] },
} satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDisabled: Story = { args: { name: 'view-disabled', options: [{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month', disabled: true }] } };

/** A click checks an option. */
export const Choose: Story = {
  args: { name: 'view-choose' },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText('Month'));
    await expect(canvas.getByRole('radio', { name: 'Month' })).toBeChecked();
  },
};
