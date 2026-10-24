import { createElement, type ReactNode } from 'react';
import { Button } from '../button/index.js';
import { Field, TextInput, type TextInputProps } from '../field/index.js';

const MESSAGES = { decrease: 'Decrease {label}', increase: 'Increase {label}' };

export interface QuantityStepperProps extends Omit<TextInputProps, 'type'> {
  label: ReactNode;
  hint?: ReactNode;
  error?: string | null | undefined;
  /** The buttons' names, translated; {label} is the field's label when it's a string ("Decrease Quantity"). */
  messages?: Partial<typeof MESSAGES> | undefined;
}

/**
 * A Field holding `<lue-stepper>`: − and + buttons around `<input type="number">`, calling stepDown() and stepUp()
 * (mount `<LueElements/>` once; without it the native number input works alone). Contract:
 * apps/docs/contracts/quantity-stepper.json.
 */
export function QuantityStepper({ label, hint, error, messages, min, max, step, ...props }: QuantityStepperProps): ReactNode {
  const m = { ...MESSAGES, ...messages };
  const name = (template: string) => template.replace('{label}', typeof label === 'string' ? label : '').trim();
  return (
    <Field label={label} hint={hint} error={error}>
      {createElement(
        'lue-stepper',
        { className: 'lue-stepper' },
        <Button size="sm" iconOnly aria-label={name(m.decrease)} data-lue-step="down">
          <svg className="lue-button__icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" /></svg>
        </Button>,
        <TextInput {...props} type="number" inputMode="numeric" min={min} max={max} step={step} />,
        <Button size="sm" iconOnly aria-label={name(m.increase)} data-lue-step="up">
          <svg className="lue-button__icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.5" /></svg>
        </Button>,
      )}
    </Field>
  );
}
