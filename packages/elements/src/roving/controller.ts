/**
 * Roving focus (WAI-ARIA APG: Toolbar, Tabs), as a pure function: which item an arrow, Home or End key moves to. No DOM
 * access, so elements and framework adapters share it.
 */
export interface RovingOptions {
  /** Which arrows move: horizontal (Left/Right, the default) or vertical (Up/Down). */
  orientation?: 'horizontal' | 'vertical';
  /** Right-to-left text: ArrowLeft moves forward. */
  rtl?: boolean;
  /** Past the last item, go to the first (tabs) or stop (toolbars). */
  wrap?: boolean;
}

/** The index to move to, or null when the key isn't one of ours (or there's nowhere to go). */
export function rovingIndex(key: string, current: number, count: number, { orientation = 'horizontal', rtl = false, wrap = false }: RovingOptions = {}): number | null {
  if (count === 0) return null;
  const forward = orientation === 'vertical' ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
  const back = orientation === 'vertical' ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
  let next: number;
  if (key === forward) next = current + 1;
  else if (key === back) next = current - 1;
  else if (key === 'Home') next = 0;
  else if (key === 'End') next = count - 1;
  else return null;
  if (wrap) return (next + count) % count;
  next = Math.min(Math.max(next, 0), count - 1);
  return next === current ? null : next;
}
