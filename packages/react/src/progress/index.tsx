'use client';
import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';

interface Labelled {
  /** The visible label; it names the bar. */
  label: ReactNode;
  /** The value in words, shown beside the label (e.g. "3 of 5 files", "60%"). */
  valueText?: ReactNode;
}

function LabelRow({ id, label, valueText }: Labelled & { id: string }): ReactNode {
  return (
    <div className="lue-progress-label">
      <label className="lue-field__label" htmlFor={id}>{label}</label>
      {valueText ? <span className="lue-field__hint">{valueText}</span> : null}
    </div>
  );
}

export interface ProgressProps extends Labelled, Omit<ComponentPropsWithRef<'progress'>, 'children'> {
  /** Leave it out for an indeterminate bar (working, amount unknown). */
  value?: number | undefined;
  /** The value when done (1 by default). */
  max?: number | undefined;
}

/**
 * A labelled `<progress class="lue-progress">`: how much of a task is done. Contract: apps/docs/contracts/progress.json.
 */
export function Progress({ label, valueText, className, id, ...props }: ProgressProps): ReactNode {
  const own = id ?? `progress${useId().replace(/:/g, '')}`;
  return (
    <div className="lue-field">
      <LabelRow id={own} label={label} valueText={valueText} />
      <progress {...props} id={own} className={cx('lue-progress', className)} />
    </div>
  );
}

export interface MeterProps extends Labelled, Omit<ComponentPropsWithRef<'meter'>, 'children'> {
  /** The measurement, between `min` and `max` (0 and 1 by default). Use `low`, `high` and `optimum` for ranges. */
  value: number;
}

/**
 * A labelled `<meter class="lue-meter">`: a measurement in a known range, coloured by `low`, `high` and `optimum`.
 * Contract: apps/docs/contracts/progress.json.
 */
export function Meter({ label, valueText, className, id, ...props }: MeterProps): ReactNode {
  const own = id ?? `meter${useId().replace(/:/g, '')}`;
  return (
    <div className="lue-field">
      <LabelRow id={own} label={label} valueText={valueText} />
      <meter {...props} id={own} className={cx('lue-meter', className)} />
    </div>
  );
}
