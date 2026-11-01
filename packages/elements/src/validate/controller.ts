/**
 * Form validation messages, shared by the `data-lue-validate` behaviour and the React adapter. It reads the platform's
 * constraint validation and never writes to the DOM.
 */

/** The ValidityState flags, in the order a message is chosen (the first failing one wins). */
export const VALIDITY_FLAGS = [
  'valueMissing',
  'typeMismatch',
  'badInput',
  'patternMismatch',
  'tooShort',
  'tooLong',
  'rangeUnderflow',
  'rangeOverflow',
  'stepMismatch',
  'customError',
] as const;
export type ValidityFlag = (typeof VALIDITY_FLAGS)[number];
export type ValidityLike = Readonly<Record<ValidityFlag | 'valid', boolean>>;
/** Author messages by flag, plus `default` for any flag without its own. */
export type Messages = Partial<Record<ValidityFlag | 'default', string>>;

export interface FieldError {
  /** The control's id, which the summary links to. */
  readonly id: string;
  readonly message: string;
}

/**
 * The message for a control, or null when it's valid: the author's message for the first failing flag, else their
 * default, else the browser's own message.
 */
export function messageFor(validity: ValidityLike, messages: Messages, browserMessage: string): string | null {
  if (validity.valid) return null;
  const flag = VALIDITY_FLAGS.find((f) => validity[f]);
  return (flag && messages[flag]) || messages.default || browserMessage || null;
}

/**
 * Author messages from data attributes: `data-lue-message` is the default and `data-lue-message-value-missing` (and so
 * on, one per flag in kebab case) override it. Takes an element's `dataset`.
 */
export function messagesFrom(dataset: Readonly<Record<string, string | undefined>>): Messages {
  const messages: Messages = {};
  if (dataset.lueMessage) messages.default = dataset.lueMessage;
  for (const flag of VALIDITY_FLAGS) {
    const value = dataset[`lueMessage${flag[0]!.toUpperCase()}${flag.slice(1)}`];
    if (value) messages[flag] = value;
  }
  return messages;
}

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const isControl = (el: Element): el is Control =>
  el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement;

/** The message for one control, or null when it's valid. */
export function controlError(control: Control): string | null {
  return messageFor(control.validity, messagesFrom(control.dataset), control.validationMessage);
}

/**
 * Every invalid control in a form, in document order. Controls need an id (the summary links to it); one without is
 * reported with an empty id so the problem is visible rather than silent. A radio group is one error, on its first
 * radio, since every radio in a required group fails together.
 */
export function formErrors(form: HTMLFormElement): FieldError[] {
  const errors: FieldError[] = [];
  const radioGroups = new Set<string>();
  for (const el of Array.from(form.elements)) {
    if (!isControl(el) || !el.willValidate) continue;
    if (el instanceof HTMLInputElement && el.type === 'radio' && el.name) {
      if (radioGroups.has(el.name)) continue;
      radioGroups.add(el.name);
    }
    const message = controlError(el);
    if (message) errors.push({ id: el.id, message });
  }
  return errors;
}
