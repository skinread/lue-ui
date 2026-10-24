import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Disclosure } from '@lue-ui/react';

/**
 * `<details class="lue-disclosure">`: a summary that shows and hides its content, with no script. Find-in-page opens
 * it. Contract: `apps/docs/contracts/disclosure.json`.
 */
const meta = {
  title: 'Components/Disclosure',
  component: Disclosure,
  args: { summary: 'Can I return it?', children: <p>Yes, within 30 days. We collect it for free.</p> },
} satisfies Meta<typeof Disclosure>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};
export const Open: Story = { args: { defaultOpen: true } };

/** A click on the summary opens and closes it. (Enter and Space are tested with a real keyboard in tests/disclosure.) */
export const Toggle: Story = {
  play: async ({ canvas, canvasElement }) => {
    const summary = canvas.getByText('Can I return it?');
    const details = canvasElement.querySelector('details')!;
    await userEvent.click(summary);
    await waitFor(() => expect(details.open).toBe(true));
    await userEvent.click(summary);
    await waitFor(() => expect(details.open).toBe(false));
  },
};
