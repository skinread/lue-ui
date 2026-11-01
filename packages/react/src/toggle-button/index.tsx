'use client';
import { useState, type ReactNode } from 'react';
import { Button, type ButtonProps } from '../button/index.js';

export interface ToggleButtonProps extends Omit<ButtonProps, 'pressed'> {
  /** Controlled state. Pair it with `onPressedChange`. */
  pressed?: boolean | undefined;
  /** Initial state when uncontrolled. */
  defaultPressed?: boolean | undefined;
  /** Called with the new state after each press. */
  onPressedChange?: ((pressed: boolean) => void) | undefined;
}

/**
 * `<button class="lue-button" aria-pressed>` that flips on click. The HTML path's `data-lue-toggle` does the same
 * without React; this never renders it. Contract: apps/docs/contracts/toggle-button.json.
 */
export function ToggleButton({ pressed, defaultPressed = false, onPressedChange, onClick, ...props }: ToggleButtonProps): ReactNode {
  const [own, setOwn] = useState(defaultPressed);
  const value = pressed ?? own;
  return (
    <Button
      {...props}
      pressed={value}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (pressed === undefined) setOwn(!value);
        onPressedChange?.(!value);
      }}
    />
  );
}
