import { controlError, formErrors, type FieldError } from './controller.js';

/**
 * `<form data-lue-validate>` — the HTML path's validation behaviour (RFC-0001 §4). The browser still decides what's
 * invalid; this replaces its bubbles with messages in the page:
 *
 * - When a submission fails validation, each invalid control gets `aria-invalid="true"` and its error message (the
 *   `.lue-field__error` its `aria-describedby` points to) is filled and shown; the form's error summary lists every
 *   error as a link and takes focus.
 * - Fixing a control clears its error as you type; a valid submission hides the summary and goes ahead.
 * - A summary link moves focus to its control.
 *
 * It works through the platform's `invalid` event, so the form keeps its native validation and nothing needs
 * `novalidate`. Without this script the browser's own messages still appear, and a server-rendered summary still works.
 *
 * Owned (ADR-0007, written only inside `form[data-lue-validate]`): `aria-invalid` on controls; `hidden` and the text
 * of `.lue-field__message` on error messages; `hidden` and the list items of `[data-lue-error-summary]`. React never
 * renders `data-lue-validate`; its adapter does the same with state.
 */
export function installValidate(root: Document | HTMLElement = document): () => void {
  const connection = new AbortController();
  const options = { capture: true, signal: connection.signal };
  const pending = new Set<HTMLFormElement>();

  const managed = (target: EventTarget | null): HTMLFormElement | null => {
    const form = target instanceof Element ? (target instanceof HTMLFormElement ? target : (target as HTMLInputElement).form ?? null) : null;
    return form?.hasAttribute('data-lue-validate') ? form : null;
  };

  // A failed submission fires `invalid` on every invalid control; render once, after the last.
  root.addEventListener('invalid', (event) => {
    const form = managed(event.target);
    if (!form) return;
    event.preventDefault(); // no browser bubble: the page shows the message
    if (pending.has(form)) return;
    pending.add(form);
    queueMicrotask(() => {
      pending.delete(form);
      render(form, formErrors(form));
    });
  }, options);

  root.addEventListener('submit', (event) => {
    const form = managed(event.target);
    if (form) render(form, []); // only valid forms reach submit
  }, options);

  const clearIfFixed = (event: Event) => {
    const control = event.target as HTMLInputElement;
    if (!managed(control) || control.getAttribute('aria-invalid') !== 'true') return;
    if (controlError(control) === null) showError(control, null);
  };
  root.addEventListener('input', clearIfFixed, options);
  root.addEventListener('change', clearIfFixed, options);

  root.addEventListener('click', (event) => {
    const link = (event.target as Element).closest?.('[data-lue-error-summary] a[href^="#"]');
    if (!link || !managed(link.closest('form'))) return;
    const control = document.getElementById(decodeURIComponent(link.getAttribute('href')!.slice(1)));
    if (!control) return;
    event.preventDefault();
    focusControl(control);
  }, options);

  return () => connection.abort();
}

/** Shows or clears one control's error. */
function showError(control: Element, message: string | null): void {
  if (message) control.setAttribute('aria-invalid', 'true');
  else control.removeAttribute('aria-invalid');
  const error = errorElement(control);
  if (!error) return;
  const text = error.querySelector('.lue-field__message') ?? error;
  text.textContent = message ?? '';
  error.hidden = !message;
}

function render(form: HTMLFormElement, errors: FieldError[]): void {
  const invalid = new Set(errors.map((e) => e.id));
  for (const control of Array.from(form.elements)) {
    if (!control.id) continue;
    const error = errors.find((e) => e.id === control.id);
    if (error) showError(control, error.message);
    else if (control.getAttribute('aria-invalid') === 'true' && !invalid.has(control.id)) showError(control, null);
  }
  const summary = form.querySelector<HTMLElement>('[data-lue-error-summary]');
  if (!summary) {
    if (errors[0]) focusControl(document.getElementById(errors[0].id));
    return;
  }
  const list = summary.querySelector('.lue-error-summary__list') ?? summary;
  list.replaceChildren(
    ...errors.map(({ id, message }) => {
      const item = document.createElement('li');
      const link = item.appendChild(document.createElement('a'));
      link.href = `#${encodeURIComponent(id)}`;
      link.textContent = message;
      return item;
    }),
  );
  summary.hidden = errors.length === 0;
  if (errors.length) summary.focus();
}

/** The control's error message element: the `.lue-field__error` among its `aria-describedby` ids. */
function errorElement(control: Element): HTMLElement | null {
  for (const id of (control.getAttribute('aria-describedby') ?? '').split(/\s+/)) {
    const el = id ? document.getElementById(id) : null;
    if (el?.classList.contains('lue-field__error')) return el;
  }
  return null;
}

/** Focuses a control and brings its label into view with it (GOV.UK's pattern: the question stays readable). */
function focusControl(control: HTMLElement | null): void {
  if (!control) return;
  const label = control.id ? document.querySelector(`label[for="${CSS.escape(control.id)}"]`) : null;
  (label ?? control).scrollIntoView({ block: 'start' });
  control.focus({ preventScroll: true });
}
