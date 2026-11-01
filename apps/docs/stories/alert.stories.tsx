import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from '@lue-ui/react';

const info = <svg className="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 7v4M8 5v.5" stroke="currentColor" strokeWidth="1.5" /></svg>;

/**
 * An icon, a title and a body on a tinted surface. The tone is said in words (visually hidden before the title), so it's
 * never colour or icon alone. Add `live` only for an alert injected after the page loads. Contract:
 * `apps/docs/contracts/alert.json`.
 */
const meta = {
  title: 'Components/Alert',
  component: Alert,
  args: { title: 'Delivery is delayed', icon: info, children: 'Orders placed today go out on Monday.' },
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Warning: Story = { args: { tone: 'warning' } };
export const Success: Story = { args: { tone: 'success', title: 'Order placed', children: 'We sent a receipt to your email.' } };
export const Critical: Story = { args: { tone: 'critical', title: 'Payment failed', children: 'Your card was declined. Try another card.' } };
export const TitleOnly: Story = { args: { children: undefined } };
