import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '@lue-ui/react';

/** `<hr class="lue-divider">`: a change of topic, drawn as a fading chrome line. Contract: `apps/docs/contracts/divider.json`. */
const meta = {
  title: 'Components/Divider',
  component: Divider,
  render: (args) => (
    <div style={{ maxInlineSize: '32rem' }}>
      <p>The first part of the story ends here.</p>
      <Divider {...args} />
      <p>Something else begins.</p>
    </div>
  ),
} satisfies Meta<typeof Divider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
