'use client';
import { useCallback, useEffect, useId, useRef, useState, type ComponentPropsWithRef, type FormEvent, type MouseEvent, type ReactNode } from 'react';
import { controlError, formErrors, type FieldError } from '@lue-ui/elements/validate';
import { cx } from '../cx.js';

export interface ErrorSummaryProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'title'> {
  /** Each error, linking to its control: `useValidation().summaryProps` provides them. Empty renders nothing. */
  errors: readonly FieldError[];
  /** The heading ("There is a problem" by default). Translate it here. */
  title?: ReactNode;
  /**
   * Changes once per submission (`useValidation` provides it), so the summary takes focus when it's submitted, not
   * while errors are fixed one by one.
   */
  attempt?: number | undefined;
}

/**
 * `<div class="lue-error-summary">` - every error in a form, each linking to its control. Takes focus after each
 * submission that has errors; hidden while there are none (it stays in the page, as in the HTML core).
 */
export function ErrorSummary({ errors, title = 'There is a problem', attempt, className, ...props }: ErrorSummaryProps): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const generated = `summary${useId().replace(/:/g, '')}`;
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
    // A radio group's error sits on its first radio, so choosing any radio in the group clears it.
    const ids = new Set(target.type === 'radio' && target.name
      ? Array.from(event.currentTarget.elements).filter((el) => el instanceof HTMLInputElement && el.type === 'radio' && el.name === target.name).map((el) => el.id)
      : [target.id]);
    setErrors((current) => (current.some((e) => ids.has(e.id)) ? current.filter((e) => !ids.has(e.id)) : current));
  }, []);
  const errorFor = useCallback((id: string) => errors.find((e) => e.id === id)?.message, [errors]);
  return { errors, summaryProps: { errors, attempt }, errorFor, formProps: { noValidate: true, onSubmit, onInput } };
}
