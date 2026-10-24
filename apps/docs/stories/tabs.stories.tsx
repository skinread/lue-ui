import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { LueElements, Tabs } from '@lue-ui/react';

/**
 * Links to panels that `<lue-tabs>` turns into tabs: arrow keys move between them, one panel shows. Without the
 * element it's a list of links to every panel. Contract: `apps/docs/contracts/tabs.json`.
 */
const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    label: 'Project details',
    tabs: [
      { id: 'overview', label: 'Overview', content: <p>A weaving journal, built with the platform.</p> },
      { id: 'specs', label: 'Specs', content: <p>No framework on the page; 9 KB of CSS.</p> },
      { id: 'reviews', label: 'Reviews', content: <p>“Calm and fast.”</p> },
    ],
  },
  render: (args) => <><LueElements /><Tabs {...args} /></>,
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A click shows its panel. (Arrow keys are tested with a real keyboard in tests/tabs.) */
export const Choose: Story = {
  play: async ({ canvas, canvasElement }) => {
    await waitFor(() => expect(canvasElement.ownerDocument.defaultView!.customElements.get('lue-tabs')).toBeDefined());
    await userEvent.click(canvas.getByText('Specs'));
    await waitFor(() => expect(canvas.getByText('Specs')).toHaveAttribute('aria-selected', 'true'));
    await expect(canvas.getByText('No framework on the page; 9 KB of CSS.')).toBeVisible();
  },
};
