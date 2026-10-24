import type { Meta, StoryObj } from '@storybook/react-vite';
import { Meter, Progress, Stack } from '@lue-ui/react';

/**
 * Native `<progress>` (how much of a task is done; no value = indeterminate) and `<meter>` (a measurement in a known
 * range), each with a label and, when it helps, the value in words. Contract: `apps/docs/contracts/progress.json`.
 */
const meta = {
  title: 'Components/Progress',
  component: Progress,
  args: { label: 'Uploading', valueText: '3 of 5 files', max: 5, value: 3 },
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Determinate: Story = {};
export const Indeterminate: Story = { args: { value: undefined, valueText: 'Working…' } };
export const Meters: Story = {
  render: () => (
    <Stack gap="m" style={{ maxInlineSize: '24rem' }}>
      <Meter label="Storage used" valueText="20 of 100 GB" min={0} max={100} low={70} high={90} optimum={20} value={20} />
      <Meter label="Storage used" valueText="80 of 100 GB" min={0} max={100} low={70} high={90} optimum={20} value={80} />
      <Meter label="Storage used" valueText="96 of 100 GB" min={0} max={100} low={70} high={90} optimum={20} value={96} />
    </Stack>
  ),
};
