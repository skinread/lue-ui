import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { LueElements, QuantityStepper } from '@lue-ui/react';

/**
 * A number field with − and + buttons that follow its min, max and step (`<lue-stepper>`); without the element it's
 * the native number input. Contract: `apps/docs/contracts/quantity-stepper.json`.
 */
const meta = {
  title: 'Components/Quantity stepper',
  component: QuantityStepper,
  args: { label: 'Quantity', name: 'qty', min: 1, max: 10, step: 1, defaultValue: 1 },
  render: (args) => <><LueElements /><QuantityStepper {...args} /></>,
} satisfies Meta<typeof QuantityStepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'Up to 10 per order.' } };

/** + steps up; − is marked unavailable at the minimum. */
export const Step: Story = {
  play: async ({ canvas, canvasElement }) => {
    await waitFor(() => expect(canvasElement.ownerDocument.defaultView!.customElements.get('lue-stepper')).toBeDefined());
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Decrease Quantity' })).toHaveAttribute('aria-disabled', 'true'));
    await userEvent.click(canvas.getByRole('button', { name: 'Increase Quantity' }));
    await expect(canvas.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(2);
  },
};
