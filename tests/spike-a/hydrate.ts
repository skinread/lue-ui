// Server-render the React fixture, put the HTML in the page, then hydrate it - the way a framework would.
import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import type { ReactNode } from 'react';

export interface Hydrated {
  errors: string[];
}

export async function serverRenderThenHydrate(tree: ReactNode): Promise<Hydrated> {
  const errors: string[] = [];
  const container = document.createElement('div');
  container.innerHTML = renderToString(tree);
  document.body.replaceChildren(container);
  const consoleError = console.error;
  console.error = (...args: unknown[]) => {
    errors.push(args.map(String).join(' '));
    consoleError(...args);
  };
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  try {
    await act(async () => {
      hydrateRoot(container, tree, {
        onRecoverableError: (error) => errors.push(`recoverable: ${String(error)}`),
        onCaughtError: (error) => errors.push(`caught: ${String(error)}`),
        onUncaughtError: (error) => errors.push(`uncaught: ${String(error)}`),
      });
    });
  } finally {
    console.error = consoleError;
  }
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = false;
  return { errors };
}
