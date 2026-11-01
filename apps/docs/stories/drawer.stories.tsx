import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Button, Checkbox, ChoiceGroup, DialogTrigger, Drawer } from '@lue-ui/react';

/**
 * A modal dialog docked to an edge (`data-side`): the inline end by default, the inline start, or the block end as a
 * bottom sheet. Everything else is Dialog's. Contract: `apps/docs/contracts/drawer.json`.
 */
const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  subcomponents: { DialogTrigger },
  // Each example in its own frame on the docs page: their ids would clash, and an open overlay would cover the page.
  parameters: { docs: { story: { inline: false, height: '480px' } } },
  args: { id: 'filters', side: 'inline-end' },
  argTypes: { side: { control: 'inline-radio', options: ['inline-end', 'inline-start', 'block-end'] } },
  render: (args) => (
    <>
      <DialogTrigger dialog={args.id ?? "filters"}>Filters</DialogTrigger>
      <Drawer {...args} aria-labelledby={`${args.id}-title`}>
        <h2 className="lue-dialog__title" id={`${args.id}-title`}>Filters</h2>
        <ChoiceGroup legend="Rooms">
          <Checkbox name="rooms" value="living" label="Living room" />
          <Checkbox name="rooms" value="bedroom" label="Bedroom" />
        </ChoiceGroup>
        <form method="dialog" className="lue-dialog__actions">
          <Button type="submit" variant="primary">Show results</Button>
        </form>
      </Drawer>
    </>
  ),
} satisfies Meta<typeof Drawer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InlineEnd: Story = {};
export const InlineStart: Story = { args: { id: 'filters-start', side: 'inline-start' } };
export const BottomSheet: Story = { args: { id: 'filters-sheet', side: 'block-end' } };

/** Opens as a modal; its submit button closes it. (Esc is tested with a real keyboard in tests/drawer.) */
export const Opens: Story = {
  args: { id: 'filters-open' },
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }));
    const drawer = canvasElement.ownerDocument.getElementById('filters-open') as HTMLDialogElement;
    await waitFor(() => expect(drawer.matches(':modal')).toBe(true));
    await userEvent.click(drawer.querySelector('button[type="submit"]')!);
    await waitFor(() => expect(drawer.open).toBe(false));
  },
};
