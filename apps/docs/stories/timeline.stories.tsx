import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeline } from '@lue-ui/react';

/** Experience or history as an ordered list. Contract: `apps/docs/contracts/timeline.json`. */
const meta = {
  title: 'Blocks/Timeline',
  component: Timeline,
} satisfies Meta<typeof Timeline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { when: '2024 - now', title: 'Founder', detail: 'Lue Studio · design systems and accessible front ends.' },
      { when: '2021 - 2024', title: 'Design systems lead', detail: 'Kiln · one system for web and print.' },
      { when: '2020', dateTime: '2020', title: 'Speaker', detail: 'A talk on contrast that holds under any light.' },
    ],
  },
};
