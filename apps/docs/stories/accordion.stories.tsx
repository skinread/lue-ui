import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Accordion, Disclosure } from '@lue-ui/react';

/**
 * Disclosures sharing a name: opening one closes the others, natively (`<details name>`). Leave out the Accordion for
 * a stack where several can be open. Contract: `apps/docs/contracts/accordion.json`.
 */
const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  args: {
    children: (
      <>
        <Disclosure summary="How long does delivery take?"><p>3 to 5 working days, or next day with Express.</p></Disclosure>
        <Disclosure summary="Can I return it?"><p>Yes, within 30 days. We collect it for free.</p></Disclosure>
        <Disclosure summary="Do you ship abroad?"><p>Not yet.</p></Disclosure>
      </>
    ),
  },
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Opening the second closes the first. */
export const OneAtATime: Story = {
  play: async ({ canvas, canvasElement }) => {
    const [first, second] = canvasElement.querySelectorAll('details');
    await userEvent.click(canvas.getByText('How long does delivery take?'));
    await waitFor(() => expect(first!.open).toBe(true));
    await userEvent.click(canvas.getByText('Can I return it?'));
    await waitFor(() => expect(second!.open).toBe(true));
    await expect(first!.open).toBe(false);
  },
};
