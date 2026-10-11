// Spike A, React path: a dialog opened from state calls showModal() — never React's `open` prop — so it works
// without invoker commands (Safari < 26.2, ADR-0004).
import { useState, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Dialog } from '@lue-ui/react';
import { serverRenderThenHydrate } from './hydrate.js';
import { settle } from './scenario.js';

const changes: boolean[] = [];

function Controlled(): ReactNode {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" id="open" onClick={() => setOpen(true)}>Open</button>
      <Dialog
        id="controlled"
        aria-labelledby="controlled-title"
        open={open}
        onOpenChange={(next) => {
          changes.push(next);
          setOpen(next);
        }}
      >
        <h2 id="controlled-title">Controlled</h2>
        <button type="button" onClick={() => setOpen(false)}>Done</button>
      </Dialog>
    </>
  );
}

describe('React path, controlled dialog', () => {
  it('opens modally from state and reports Esc', async () => {
    const { errors } = await serverRenderThenHydrate(<Controlled />);
    expect(errors).toEqual([]);
    const dialog = document.querySelector<HTMLDialogElement>('#controlled')!;
    expect(dialog.hasAttribute('open'), 'server render leaves it closed').toBe(false);

    await userEvent.click(document.querySelector('#open')!);
    await settle();
    expect(dialog.matches(':modal'), 'state opens it with showModal()').toBe(true);

    await userEvent.keyboard('{Escape}');
    await settle();
    expect(dialog.open).toBe(false);
    expect(changes, 'Esc reports the change').toEqual([false]);

    await userEvent.click(document.querySelector('#open')!);
    await settle();
    expect(dialog.matches(':modal'), 'and it opens again from state').toBe(true);
    await userEvent.click(dialog.querySelector('button')!);
    await settle();
    expect(dialog.open, 'state closes it').toBe(false);
  });
});
