import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Button, ChoiceGroup, ErrorSummary, Radio, useValidation } from '@lue-ui/react';

/**
 * Native radios sharing a `name` in a `ChoiceGroup` (`<fieldset>` and `<legend>`). The browser gives the group its
 * keyboard model: Tab enters at the checked radio, arrow keys move the selection. Contract:
 * `apps/docs/contracts/radio-group.json`.
 */
const meta = {
  title: 'Components/Radio group',
  component: ChoiceGroup,
  subcomponents: { Radio, ErrorSummary },
  args: {
    legend: 'Delivery',
    children: (
      <>
        <Radio name="delivery" value="standard" label="Standard, 3 to 5 days" defaultChecked />
        <Radio name="delivery" value="express" label="Express, next day" />
        <Radio name="delivery" value="collect" label="Collect from the studio" />
      </>
    ),
  },
} satisfies Meta<typeof ChoiceGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'Express orders placed before 2pm go out today.' } };
export const WithError: Story = {
  args: {
    error: 'Choose a delivery option',
    children: (
      <>
        <Radio name="delivery-error" value="standard" label="Standard, 3 to 5 days" />
        <Radio name="delivery-error" value="express" label="Express, next day" />
      </>
    ),
  },
};
export const Disabled: Story = {
  args: {
    children: (
      <>
        <Radio name="delivery-disabled" value="standard" label="Standard, 3 to 5 days" defaultChecked />
        <Radio name="delivery-disabled" value="express" label="Express, next day" disabled />
      </>
    ),
  },
};

/** Arrow keys move the selection. Tab order is covered with a real keyboard in tests/radio-group. */
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    const standard = canvas.getByRole('radio', { name: 'Standard, 3 to 5 days' });
    // Firefox sometimes drops the first focus() while the story settles, so retry it.
    await waitFor(() => {
      standard.focus();
      return expect(standard).toHaveFocus();
    });
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'Express, next day' })).toBeChecked();
  },
};

function DeliveryForm() {
  const { formProps, summaryProps, errorFor } = useValidation((event) => event.preventDefault());
  return (
    <form {...formProps} style={{ display: 'grid', gap: '1.5rem', maxInlineSize: '28rem' }}>
      <ErrorSummary {...summaryProps} />
      <ChoiceGroup legend="Delivery" error={errorFor('delivery-validate-standard')}>
        <Radio id="delivery-validate-standard" name="delivery-validate" value="standard" label="Standard, 3 to 5 days" required data-lue-message-value-missing="Choose a delivery option" />
        <Radio id="delivery-validate-express" name="delivery-validate" value="express" label="Express, next day" required />
      </ChoiceGroup>
      <div><Button type="submit" variant="primary">Continue</Button></div>
    </form>
  );
}

/** A required group is one error, on its first radio; choosing any radio clears it. */
export const Validation: Story = {
  render: () => <DeliveryForm />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    const summary = await canvas.findByRole('alert');
    await waitFor(() => expect(summary.parentElement).toHaveFocus());
    await expect(canvas.getAllByRole('link', { name: 'Choose a delivery option' })).toHaveLength(1);
    await expect(canvas.getByRole('radio', { name: 'Express, next day' })).toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(canvas.getByRole('radio', { name: 'Express, next day' }));
    await expect(canvas.getByRole('radio', { name: 'Standard, 3 to 5 days' })).not.toHaveAttribute('aria-invalid');
  },
};
