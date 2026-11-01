// Spike A, React path: server render, then hydrate, with the elements defined after hydration.
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import '../../packages/css/src/components/dialog.css';
import '../../packages/css/src/components/menu.css';
import { LueElements } from '@lue-ui/react';
import { App } from './fixture.js';
import { serverRenderThenHydrate, type Hydrated } from './hydrate.js';
import * as s from './scenario.js';

const chosen: string[] = [];
let hydrated: Hydrated;

beforeAll(async () => {
  hydrated = await serverRenderThenHydrate(
    <>
      <App onAction={(name) => chosen.push(name)} />
      <LueElements />
    </>,
  );
  await customElements.whenDefined('lue-menu');
});

afterEach(s.closeAll);

describe('React path, elements defined after hydration', () => {
  it('hydrates without errors or warnings', () => {
    expect(hydrated.errors).toEqual([]);
  });

  it('opens the dialog and the menu, anchored', async () => {
    await s.openDialogAndMenu('pointer');
    s.anchoring();
  });

  it('has the keyboard model', async () => {
    await s.openDialogAndMenu();
    await s.keyboardModel();
  });

  it('passes axe with the dialog and menu open', async () => {
    await s.openDialogAndMenu();
    await s.noAxeViolations();
  });

  it('closes one layer per Escape', s.escapeStacking);

  it('runs an item through React, closes the menu and returns focus', async () => {
    await s.openDialogAndMenu();
    await s.activation(chosen);
  });

  it('closes the menu on Tab', s.tabOut);
});
