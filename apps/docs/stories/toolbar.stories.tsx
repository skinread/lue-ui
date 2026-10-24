import type { Meta, StoryObj } from '@storybook/react-vite';
import { LueElements, ToggleButton, Toolbar } from '@lue-ui/react';

/**
 * A group of controls that is one Tab stop; arrow keys move between them (`<lue-roving>`). Without the element every
 * control is a Tab stop. Contract: `apps/docs/contracts/toolbar.json`.
 */
const meta = {
  title: 'Components/Toolbar',
  component: Toolbar,
  args: {
    'aria-label': 'Text formatting',
    children: (
      <>
        <ToggleButton size="sm">Bold</ToggleButton>
        <ToggleButton size="sm">Italic</ToggleButton>
        <ToggleButton size="sm">Underline</ToggleButton>
        <span role="separator" />
        <ToggleButton size="sm">Code</ToggleButton>
      </>
    ),
  },
  render: (args) => <><LueElements /><Toolbar {...args} /></>,
} satisfies Meta<typeof Toolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
