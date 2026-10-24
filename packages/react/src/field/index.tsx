'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { controlError, formErrors, type FieldError } from '@lue-ui/elements';
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
 * `<div class="lue-field">` — a label, an optional hint, an error message and one control, wired together with `for`,
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

/** Spreads the surrounding Field's id, description and invalid state onto a control. */
function useFieldControl(props: { id?: string | undefined; 'aria-describedby'?: string | undefined; 'aria-invalid'?: unknown }) {
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

export interface ErrorSummaryProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'title'> {
  errors: readonly FieldError[];
  title?: ReactNode;
  /**
   * Changes once per submission (`useValidation` provides it), so the summary takes focus when it's submitted, not
   * while errors are fixed one by one.
   */
  attempt?: number | undefined;
}

/**
 * `<div class="lue-error-summary">` — every error in a form, each linking to its control. Takes focus after each
 * submission that has errors; hidden while there are none (it stays in the page, as in the HTML core).
 */
export function ErrorSummary({ errors, title = 'There is a problem', attempt, className, ...props }: ErrorSummaryProps): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const generated = useId().replace(/:/g, '');
  const titleId = `${props.id ?? generated}-title`;
  const count = useRef(errors.length);
  count.current = errors.length;
  useEffect(() => {
    if (attempt && count.current) ref.current?.focus();
  }, [attempt]);
  const go = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const control = document.getElementById(id);
    if (!control) return;
    event.preventDefault();
    const label = document.querySelector(`label[for="${CSS.escape(id)}"]`);
    (label ?? control).scrollIntoView({ block: 'start' });
    control.focus({ preventScroll: true });
  };
  return (
    <div {...props} ref={ref} tabIndex={-1} hidden={errors.length === 0} className={cx('lue-error-summary', className)}>
      <div role="alert">
        <h2 className="lue-error-summary__title" id={titleId}>{title}</h2>
        <ul className="lue-error-summary__list" aria-labelledby={titleId}>
          {errors.map(({ id, message }) => (
            <li key={id}><a href={`#${id}`} onClick={(e) => go(e, id)}>{message}</a></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export interface Validation {
  /** Every current error, in document order. */
  errors: readonly FieldError[];
  /** Spread onto `<ErrorSummary>`. */
  summaryProps: { errors: readonly FieldError[]; attempt: number };
  /** The error message for a control id, for `<Field error={…}>`. */
  errorFor: (id: string) => string | undefined;
  /** Spread onto the `<form>`: browser bubbles off, messages from the platform's constraint validation. */
  formProps: {
    noValidate: true;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onInput: (event: FormEvent<HTMLFormElement>) => void;
  };
}

/**
 * The React form of `data-lue-validate`: the same messages from the same controller, held in state. Invalid
 * submissions are stopped and the errors returned; `onValid` runs for a valid one. A control's error clears as soon
 * as it's fixed.
 */
export function useValidation(onValid?: (event: FormEvent<HTMLFormElement>) => void): Validation {
  const [errors, setErrors] = useState<readonly FieldError[]>([]);
  const [attempt, setAttempt] = useState(0);
  const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    const found = formErrors(event.currentTarget);
    setErrors(found);
    setAttempt((n) => n + 1);
    if (found.length) event.preventDefault();
    else onValid?.(event);
  }, [onValid]);
  const onInput = useCallback((event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    if (!target.id || controlError(target) !== null) return;
    setErrors((current) => (current.some((e) => e.id === target.id) ? current.filter((e) => e.id !== target.id) : current));
  }, []);
  const errorFor = useCallback((id: string) => errors.find((e) => e.id === id)?.message, [errors]);
  return { errors, summaryProps: { errors, attempt }, errorFor, formProps: { noValidate: true, onSubmit, onInput } };
}
