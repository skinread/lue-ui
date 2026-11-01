import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Button, ErrorSummary, Field, TextInput, useValidation } from '@lue-ui/react';

/**
 * A label, an optional hint, an error message and one control. Validation comes from the platform's constraint
 * validation; `useValidation` (React) and `data-lue-validate` (HTML) put the messages in the page and add an error
 * summary. Contract: `apps/docs/contracts/field.json`.
 */
const meta = {
  title: 'Components/Field',
  component: Field,
  subcomponents: { TextInput, ErrorSummary },
  args: { label: 'Email address', children: <TextInput type="email" autoComplete="email" /> },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'We send your receipt here.' } };
export const WithError: Story = { args: { hint: 'We send your receipt here.', error: 'Enter your email address' } };
export const Disabled: Story = { args: { children: <TextInput type="email" disabled defaultValue="ada@example.com" /> } };

function CheckoutForm() {
  const { formProps, summaryProps, errorFor } = useValidation((event) => event.preventDefault());
  return (
    <form {...formProps} style={{ display: 'grid', gap: '1.5rem', maxInlineSize: '28rem' }}>
      <ErrorSummary {...summaryProps} />
      <Field label="Full name" controlId="name" error={errorFor('name')}>
        <TextInput name="name" type="text" autoComplete="name" required data-lue-message-value-missing="Enter your full name" />
      </Field>
      <Field label="Email address" hint="We send your receipt here." controlId="email" error={errorFor('email')}>
        <TextInput
          name="email"
          type="email"
          autoComplete="email"
          required
          data-lue-message-value-missing="Enter your email address"
          data-lue-message-type-mismatch="Enter an email address in the right format, like name@example.com"
        />
      </Field>
      <div><Button type="submit" variant="primary">Continue</Button></div>
    </form>
  );
}

/** Submit it empty: the summary lists both errors and takes focus; each link goes to its field. */
export const Validation: Story = {
  render: () => <CheckoutForm />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    const summary = await canvas.findByRole('alert');
    await waitFor(() => expect(summary.parentElement).toHaveFocus());
    await expect(canvas.getByRole('link', { name: 'Enter your full name' })).toBeVisible();
    await userEvent.click(canvas.getByRole('link', { name: 'Enter your email address' }));
    await expect(canvas.getByLabelText('Email address')).toHaveFocus();
    await expect(canvas.getByLabelText('Full name')).toHaveAttribute('aria-invalid', 'true');
  },
};
