import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Button, Cluster, LueElements, showToast, ToastRegion } from '@lue-ui/react';

/**
 * `<lue-toast-region>` announces short status messages and shows them at the corner of the viewport. They leave after
 * six seconds (paused while hovered or focused); one with an action stays until used. Render the region once, empty,
 * and mount `<LueElements />`. Contract: `apps/docs/contracts/toast.json`.
 */
const meta = {
  title: 'Components/Toast',
  component: ToastRegion,
  render: (args) => (
    <>
      <LueElements />
      <Cluster>
        <Button onClick={() => showToast('Project saved')}>Save</Button>
        <Button onClick={() => showToast('Image removed', { action: { label: 'Undo', onAction: () => showToast('Image restored') } })}>
          Remove image
        </Button>
      </Cluster>
      <ToastRegion {...args} />
    </>
  ),
} satisfies Meta<typeof ToastRegion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A toast with an action stays until it's used. */
export const WithAction: Story = {
  play: async ({ canvas, canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    await waitFor(() => expect(doc.defaultView!.customElements.get('lue-toast-region')).toBeDefined());
    await userEvent.click(canvas.getByRole('button', { name: 'Remove image' }));
    await waitFor(() => expect(doc.querySelector('.lue-toast')).toHaveTextContent('Image removed'));
    await userEvent.click(doc.querySelector<HTMLElement>('.lue-toast .lue-button')!);
    await waitFor(() => expect(doc.querySelector('.lue-toast')).toHaveTextContent('Image restored'));
  },
};
