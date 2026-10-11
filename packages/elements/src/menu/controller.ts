/**
 * The menu keyboard model (WAI-ARIA APG, Menu Button), as pure functions. No DOM access, so the element and any
 * framework adapter share one implementation.
 */

/** What a key press inside an open menu should do. */
export type MenuAction =
  | { readonly type: 'focus'; readonly index: number }
  | { readonly type: 'close' }
  | { readonly type: 'typeahead'; readonly char: string }
  | null;

/**
 * Maps a key to an action. `current` is the focused item's index (-1 when none), `count` the number of items.
 * Enter and Space are left to the native button; Escape is left to the popover's light dismiss.
 */
export function menuAction(key: string, current: number, count: number): MenuAction {
  if (count === 0) return null;
  switch (key) {
    case 'ArrowDown':
      return { type: 'focus', index: current < 0 ? 0 : (current + 1) % count };
    case 'ArrowUp':
      return { type: 'focus', index: current < 0 ? count - 1 : (current - 1 + count) % count };
    case 'Home':
    case 'PageUp':
      return { type: 'focus', index: 0 };
    case 'End':
    case 'PageDown':
      return { type: 'focus', index: count - 1 };
    case 'Tab':
      return { type: 'close' };
    default:
      // One printable character, not a modifier name like "Shift".
      return [...key].length === 1 && key !== ' ' ? { type: 'typeahead', char: key } : null;
  }
}

/** How long typed characters keep building one search, in milliseconds. */
export const TYPEAHEAD_TIMEOUT = 500;

/**
 * Finds the item to focus for a typeahead search. Searches forward from the item after `current`, wrapping. Typing
 * the same character repeatedly cycles through the items that start with it.
 */
export function typeaheadMatch(query: string, labels: readonly string[], current: number): number {
  if (!query || labels.length === 0) return -1;
  const q = query.toLocaleLowerCase();
  const repeated = [...q].every((c) => c === q[0]);
  const needle = repeated ? q[0]! : q;
  // A longer query still matches the current item, so start there; a single or repeated character moves on.
  const start = repeated ? current + 1 : Math.max(current, 0);
  for (let i = 0; i < labels.length; i++) {
    const index = (start + i) % labels.length;
    if (labels[index]!.trim().toLocaleLowerCase().startsWith(needle)) return index;
  }
  return -1;
}
