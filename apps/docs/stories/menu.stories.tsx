import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { LueElements, Menu, MenuItem, MenuTrigger } from '@lue-ui/react';

/**
 * A popover menu opened by `command="toggle-popover"` and anchored to its button. `<lue-menu>` adds the keyboard
 * model; mount `<LueElements />` once to register it. Contract: `apps/docs/contracts/menu.json`.
 */
const meta = {
  title: 'Components/Menu',
  component: Menu,
  subcomponents: { MenuTrigger, MenuItem },
  // Each example in its own frame on the docs page: their ids would clash, and an open overlay would cover the page.
  parameters: { layout: 'centered', docs: { story: { inline: false, height: '300px' } } },
  render: () => (
    <>
      <LueElements />
      <MenuTrigger menu="sort" id="sort-button">Sort by</MenuTrigger>
      <Menu id="sort" aria-labelledby="sort-button">
        <MenuItem>Newest first</MenuItem>
        <MenuItem>Oldest first</MenuItem>
        <div className="lue-menu__separator" role="separator" />
        <MenuItem>Title, A to Z</MenuItem>
        <MenuItem tone="critical">Clear sorting</MenuItem>
      </Menu>
    </>
  ),
  args: { id: 'sort' },
} satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Opening needs no script; the element moves focus to the first item. (Real keys are tested in tests/menu.) */
export const Open: Story = {
  play: async ({ canvas, canvasElement }) => {
    await customElements.whenDefined('lue-menu');
    await userEvent.click(canvas.getByRole('button', { name: 'Sort by' }));
    const menu = canvasElement.ownerDocument.getElementById('sort')!;
    await waitFor(() => expect(menu.matches(':popover-open')).toBe(true));
    await waitFor(() => expect(canvasElement.ownerDocument.activeElement).toHaveTextContent('Newest first'));
  },
};
