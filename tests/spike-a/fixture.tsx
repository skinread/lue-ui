// Spike A fixture, React path: the same dialog and menu as fixture-html.ts, built with the adapters.
import type { ReactNode } from 'react';
import { Dialog, DialogTrigger, Menu, MenuItem, MenuTrigger } from '@lue-ui/react';
import { items } from './fixture-html.js';

export function App({ onAction }: { onAction?: (name: string) => void }): ReactNode {
  return (
    <main>
      <DialogTrigger dialog="project" id="open-dialog">Edit project…</DialogTrigger>
      <Dialog aria-labelledby="project-title" id="project">
        <h2 id="project-title" className="lue-dialog__title">Edit project</h2>
        <p className="lue-dialog__body">Choose an action for this project.</p>
        <MenuTrigger menu="actions" id="actions-button">Actions</MenuTrigger>
        <Menu id="actions" aria-labelledby="actions-button">
          {items.map((name) => (
            <MenuItem key={name} tone={name === 'Delete' ? 'critical' : undefined} onClick={() => onAction?.(name)}>
              {name}
            </MenuItem>
          ))}
        </Menu>
        <form method="dialog" className="lue-dialog__actions">
          <button value="cancel" className="lue-button" id="cancel">Cancel</button>
          <button value="save" className="lue-button" data-variant="primary">Save</button>
        </form>
      </Dialog>
    </main>
  );
}
