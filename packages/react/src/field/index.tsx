'use client';
import { createContext, useContext, useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';

interface FieldContextValue {
  id: string;
  describedBy: string;
  invalid: boolean;
}
const FieldContext = createContext<FieldContextValue | null>(null);

export interface FieldProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  label: ReactNode;
  hint?: ReactNode;
  /** The error message. Present → the control is invalid and the message shows. */
  error?: string | null | undefined;
  /** The control's id. Generated when left out. */
  controlId?: string | undefined;
  /** One control, such as `<TextInput>`; it picks up the id, description and invalid state from the field. */
  children: ReactNode;
}

/**
 * `<div class="lue-field">` - a label, an optional hint, an error message and one control, wired together with `for`,
 * `aria-describedby` and `aria-invalid`. The error message is always rendered (hidden while empty), as in the HTML core.
 * Contract: apps/docs/contracts/field.json.
 */
export function Field({ label, hint, error, controlId, children, className, ...props }: FieldProps): ReactNode {
  const generated = useId();
  const id = controlId ?? `field${generated.replace(/:/g, '')}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = hint ? `${hintId} ${errorId}` : errorId;
  return (
    <div {...props} className={cx('lue-field', className)}>
      <label className="lue-field__label" htmlFor={id}>{label}</label>
      {hint ? <p className="lue-field__hint" id={hintId}>{hint}</p> : null}
      <p className="lue-field__error" id={errorId} hidden={!error}>
        <span className="lue-visually-hidden">Error: </span>
        <span className="lue-field__message">{error ?? ''}</span>
      </p>
      <FieldContext value={{ id, describedBy, invalid: !!error }}>{children}</FieldContext>
    </div>
  );
}

/** Spreads the surrounding Field's id, description and invalid state onto a control. Shared with Select. */
export function useFieldControl(props: { id?: string | undefined; 'aria-describedby'?: string | undefined; 'aria-invalid'?: unknown }): {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: 'true' | undefined;
} {
  const field = useContext(FieldContext);
  if (!field) return {};
  return {
    id: props.id ?? field.id,
    'aria-describedby': cx(field.describedBy, props['aria-describedby']),
    'aria-invalid': field.invalid ? ('true' as const) : undefined,
  };
}

export type TextInputProps = ComponentPropsWithRef<'input'>;

/** `<input class="lue-input">`. Give it the right `type`, `autoComplete` and `inputMode`; inside a Field it's wired up. */
export function TextInput({ className, ...props }: TextInputProps): ReactNode {
  return <input {...props} {...useFieldControl(props)} className={cx('lue-input', className)} />;
}

export type TextareaProps = ComponentPropsWithRef<'textarea'>;

/** `<textarea class="lue-textarea">`, growing with its content where `field-sizing` exists. Inside a Field it's wired up. */
export function Textarea({ className, ...props }: TextareaProps): ReactNode {
  return <textarea {...props} {...useFieldControl(props)} className={cx('lue-textarea', className)} />;
}
