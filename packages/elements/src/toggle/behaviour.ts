/**
 * `<button aria-pressed data-lue-toggle>` - the HTML path's toggle button (RFC-0001 §4). A click (and so Enter or
 * Space) flips `aria-pressed` between "true" and "false", then fires a bubbling `lue-toggle` event whose
 * `detail.pressed` is the new state. A "mixed" button becomes pressed.
 *
 * Owned (ADR-0007, written only on `[data-lue-toggle]`): `aria-pressed`. React never renders `data-lue-toggle`; its
 * ToggleButton keeps the state itself.
 */
export function installToggle(root: Document | HTMLElement = document): () => void {
  const connection = new AbortController();
  root.addEventListener('click', (event) => {
    const button = (event.target as Element).closest?.('button[data-lue-toggle]');
    if (!button || event.defaultPrevented) return;
    const pressed = togglePressed(button.getAttribute('aria-pressed'));
    button.setAttribute('aria-pressed', String(pressed));
    button.dispatchEvent(new CustomEvent('lue-toggle', { bubbles: true, detail: { pressed } }));
  }, { signal: connection.signal });
  return () => connection.abort();
}

/** The next state of a toggle button from its current `aria-pressed` value. */
export function togglePressed(current: string | null): boolean {
  return current !== 'true';
}
