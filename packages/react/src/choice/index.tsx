'use client';
import { createContext, useContext, useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';

const GroupContext = createContext<{ invalid: boolean } | null>(null);

export interface ChoiceGroupProps extends Omit<ComponentPropsWithRef<'fieldset'>, 'children'> {
  legend: ReactNode;
  hint?: ReactNode;
  /** The error message for the whole group. Present → every choice is invalid and the message shows. */
  error?: string | null | undefined;
  /** Checkboxes or radios. */
  children: ReactNode;
}

/**
 * `<fieldset class="lue-fieldset">` - a legend, an optional hint, an error message and a set of checkboxes or radios.
 * The hint and error describe the whole group. Contracts: apps/docs/contracts/checkbox.json, radio-group.json.
 */
export function ChoiceGroup({ legend, hint, error, children, className, id, ...props }: ChoiceGroupProps): ReactNode {
  const generated = `group${useId().replace(/:/g, '')}`;
  const base = id ?? generated;
  const hintId = `${base}-hint`;
  const errorId = `${base}-error`;
  return (
    <fieldset {...props} id={id} className={cx('lue-fieldset', className)} aria-describedby={hint ? `${hintId} ${errorId}` : errorId}>
      <legend>{legend}</legend>
      {hint ? <p className="lue-field__hint" id={hintId}>{hint}</p> : null}
      <p className="lue-field__error" id={errorId} hidden={!error}>
        <span className="lue-visually-hidden">Error: </span>
        <span className="lue-field__message">{error ?? ''}</span>
      </p>
      <GroupContext value={{ invalid: !!error }}>{children}</GroupContext>
    </fieldset>
  );
}

export interface ChoiceProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  /** The visible label; the input sits inside its <label>. */
  label: ReactNode;
}

function Choice({ label, className, kind, id, ...props }: ChoiceProps & { kind: 'checkbox' | 'radio' | 'switch' }): ReactNode {
  const group = useContext(GroupContext);
  const generated = `choice${useId().replace(/:/g, '')}`;
  return (
    <label className="lue-choice">
      <input
        {...props}
        id={id ?? generated}
        type={kind === 'radio' ? 'radio' : 'checkbox'}
        role={kind === 'switch' ? 'switch' : undefined}
        aria-invalid={group?.invalid ? 'true' : props['aria-invalid']}
        className={cx(`lue-${kind}`, className)}
      />
      {label}
    </label>
  );
}

/** `<input type="checkbox" class="lue-checkbox">` in its label. Contract: apps/docs/contracts/checkbox.json. */
export function Checkbox(props: ChoiceProps): ReactNode {
  return <Choice {...props} kind="checkbox" />;
}

/** `<input type="radio" class="lue-radio">` in its label; group radios with a shared `name` in a ChoiceGroup. */
export function Radio(props: ChoiceProps): ReactNode {
  return <Choice {...props} kind="radio" />;
}

/** `<input type="checkbox" role="switch" class="lue-switch">` in its label. Contract: apps/docs/contracts/switch.json. */
export function Switch(props: ChoiceProps): ReactNode {
  return <Choice {...props} kind="switch" />;
}
