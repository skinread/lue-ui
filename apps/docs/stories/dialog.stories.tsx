import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Button, Dialog, DialogTrigger } from '@lue-ui/react';

/**
 * `<dialog class="lue-dialog">`, opened with `command="show-modal"` - no script - or from state with `open` and
 * `onOpenChange`. Modality, Esc, focus return and light dismiss are the browser's. Contract:
 * `apps/docs/contracts/dialog.json`.
 */
const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Confirm: Story = {
  render: () => (
    <>
      <DialogTrigger dialog="confirm" variant="danger">Delete project…</DialogTrigger>
      <Dialog id="confirm" aria-labelledby="confirm-title">
        <h2 className="lue-dialog__title" id="confirm-title">Delete this project?</h2>
        <p className="lue-dialog__body">Its pages and images go too. You can&apos;t undo this.</p>
        <form method="dialog" className="lue-dialog__actions">
          <Button type="submit" value="cancel" autoFocus>Cancel</Button>
          <Button type="submit" variant="danger" value="delete">Delete</Button>
        </form>
      </Dialog>
    </>
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Delete project…' }));
    const dialog = canvasElement.ownerDocument.getElementById('confirm') as HTMLDialogElement;
    await waitFor(() => expect(dialog.matches(':modal')).toBe(true));
    await expect(canvasElement.ownerDocument.activeElement).toHaveTextContent('Cancel');
    // Play functions dispatch synthetic events, which can't press Esc on a native dialog (ADR-0005); the real
    // keyboard is tested in tests/dialog.
    await userEvent.click(canvasElement.ownerDocument.activeElement!);
    await waitFor(() => expect(dialog.open).toBe(false));
    await expect(dialog.returnValue).toBe('cancel');
  },
};

function ControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>Edit profile</Button>
      <Dialog id="profile" aria-labelledby="profile-title" open={open} onOpenChange={setOpen}>
        <h2 className="lue-dialog__title" id="profile-title">Edit profile</h2>
        <p className="lue-dialog__body">Opened from state with showModal(), so it works without invoker commands.</p>
        <div className="lue-dialog__actions">
          <Button onClick={() => setOpen(false)}>Done</Button>
        </div>
      </Dialog>
    </>
  );
}

/** Controlled: `open` and `onOpenChange` together, so Esc and light dismiss keep state in sync. */
export const Controlled: Story = { render: () => <ControlledDemo /> };
