import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentProps } from 'react';
import { expect, userEvent } from 'storybook/test';
import { Button } from '@lue-ui/react';

const Close = () => (
  <svg className="lue-button__icon" aria-hidden="true" viewBox="0 0 16 16">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * `<button class="lue-button">`. Variants are `data-*` attributes; state comes from the platform. The React adapter
 * renders exactly the HTML core's markup. Contract: `apps/docs/contracts/button.json`.
 */
const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Continue to payment' },
  argTypes: {
    variant: { control: 'inline-radio', options: [undefined, 'primary', 'danger', 'quiet'] },
    size: { control: 'inline-radio', options: [undefined, 'sm', 'lg'] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Primary: Story = { args: { variant: 'primary' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Remove' } };
export const Quiet: Story = { args: { variant: 'quiet', children: 'Cancel' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args}>Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

export const IconOnly: Story = { args: { iconOnly: true, 'aria-label': 'Close', children: <Close /> } };

export const Toggle: Story = {
  args: { pressed: false, children: 'Bold' },
  render: function Render(args) {
    return <ToggleDemo {...args} />;
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Bold' });
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
  },
};

export const Disabled: Story = { args: { disabled: true, children: 'Unavailable' } };

/** Stays focusable so it can explain itself; the click handler ignores it. */
export const SoftDisabled: Story = { args: { 'aria-disabled': 'true', children: 'Pay now' } };

export const KeyboardFocus: Story = {
  args: { variant: 'primary' },
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button')).toHaveFocus();
  },
};

function ToggleDemo(props: ComponentProps<typeof Button>) {
  const [pressed, setPressed] = useState(props.pressed ?? false);
  return <Button {...props} pressed={pressed} onClick={() => setPressed(!pressed)} />;
}
