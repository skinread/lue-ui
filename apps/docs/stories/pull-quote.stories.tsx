import type { Meta, StoryObj } from '@storybook/react-vite';
import { Prose, PullQuote } from '@lue-ui/react';

/** A line from the body, repeated large and hidden from assistive technology. Contract: `apps/docs/contracts/pull-quote.json`. */
const meta = {
  title: 'Blocks/Pull quote',
  component: PullQuote,
} satisfies Meta<typeof PullQuote>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Prose>
      <p>The palette is fixed where it carries meaning. Contrast stays fixed. Only the colour moves.</p>
      <PullQuote>Contrast stays fixed. Only the colour moves.</PullQuote>
      <p>Everything else follows from that.</p>
    </Prose>
  ),
};
