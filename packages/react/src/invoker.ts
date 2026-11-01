/** A built-in invoker command, or a custom one (`--name`) that fires a `command` event on the target. */
export type Command = 'show-modal' | 'close' | 'request-close' | 'toggle-popover' | 'show-popover' | 'hide-popover' | `--${string}`;

/**
 * Invoker command attributes for React, to spread onto a `<button>`. React 19 doesn't know `command`/`commandfor` yet
 * (no typings, and camelCase `commandFor` warns), so they're passed through lowercase as plain attributes.
 */
export function invoker(command: Command, target: string): Record<'command' | 'commandfor', string> {
  return { command, commandfor: target };
}
