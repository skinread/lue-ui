import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, LueElements, Tooltip, tooltipTrigger } from '@lue-ui/react';

/**
 * A short description shown on hover or keyboard focus; Escape hides it. It's read through aria-describedby with or
 * without script. Not on touch: anything a user needs belongs in a Toggletip. Contract:
 * `apps/docs/contracts/tooltip.json`.
 */
const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  // Each example in its own frame on the docs page: their ids would clash, and an open overlay would cover the page.
  parameters: { docs: { story: { inline: false, height: '180px' } } },
  args: { id: 'save-tip', children: 'Saves a draft; nothing is published.' },
  render: (args) => (
    <div style={{ paddingBlockStart: '3rem' }}>
      <LueElements />
      <Button {...tooltipTrigger(args.id)}>Save</Button>
      <Tooltip {...args} />
    </div>
  ),
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
