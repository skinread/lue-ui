import type { Meta, StoryObj } from '@storybook/react-vite';
import { Rating, Stack } from '@lue-ui/react';

/**
 * A read-only score: stars for the eye, the score in words for everyone. To ask for a rating, use a radio group with
 * words. Contract: `apps/docs/contracts/rating.json`.
 */
const meta = {
  title: 'Components/Rating',
  component: Rating,
  args: { value: 4.5 },
} satisfies Meta<typeof Rating>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Values: Story = {
  render: () => (
    <Stack gap="xs">
      <Rating value={1} />
      <Rating value={3.5} />
      <Rating value={5} />
      <Rating value={7} max={10} />
    </Stack>
  ),
};
export const WordsHidden: Story = { args: { hideText: true } };
