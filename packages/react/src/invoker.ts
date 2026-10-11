/**
 * Invoker command attributes for React. React 19 doesn't know `command`/`commandfor` yet (no typings, and camelCase
 * `commandFor` warns), so they're passed through lowercase as plain attributes.
 */
export type Command = 'show-modal' | 'close' | 'request-close' | 'toggle-popover' | 'show-popover' | 'hide-popover' | `--${string}`;

export function invoker(command: Command, target: string): Record<'command' | 'commandfor', string> {
  return { command, commandfor: target };
}
