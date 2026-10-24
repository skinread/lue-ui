import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { SwatchPicker } from '@lue-ui/react';

/**
 * A radio group of colours, each named in words, never colour alone. Arrow keys move the choice. Contract:
 * `apps/docs/contracts/swatch-picker.json`.
 */
const meta = {
  title: 'Components/Swatch picker',
  component: SwatchPicker,
  args: {
    legend: 'Colour',
    name: 'colour',
    defaultValue: 'clay',
    swatches: [
      { value: 'sage', label: 'Sage', color: 'oklch(0.72 0.05 145)' },
      { value: 'clay', label: 'Clay', color: 'oklch(0.62 0.11 45)' },
      { value: 'ink', label: 'Ink', color: 'oklch(0.3 0.06 265)' },
      { value: 'chalk', label: 'Chalk', color: 'oklch(0.96 0.01 90)' },
    ],
  },
} satisfies Meta<typeof SwatchPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A click checks a colour. */
export const Choose: Story = {
  args: { name: 'colour-choose' },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText('Ink'));
    await expect(canvas.getByRole('radio', { name: 'Ink' })).toBeChecked();
  },
};
