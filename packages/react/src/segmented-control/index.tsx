import type { ChangeEventHandler, ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface SegmentedControlProps extends Omit<ComponentPropsWithRef<'fieldset'>, 'children' | 'onChange' | 'defaultValue'> {
  legend: ReactNode;
  /** The radios' shared name. */
  name: string;
  options: { value: string; label: ReactNode; disabled?: boolean | undefined }[];
  defaultValue?: string | undefined;
  /** Controlled value; pair it with onChange. */
  value?: string | undefined;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
}

/**
 * `<fieldset class="lue-segmented">`: a radio group drawn as one pill. Arrow keys move the choice, natively. Contract:
 * apps/docs/contracts/segmented-control.json.
 */
export function SegmentedControl({ legend, name, options, defaultValue, value, onChange, className, ...props }: SegmentedControlProps): ReactNode {
  return (
    <fieldset {...props} className={cx('lue-segmented', className)}>
      <legend>{legend}</legend>
      <div className="lue-segmented__options">
        {options.map((o) => (
          <label key={o.value} className="lue-segmented__option">
            <input
              type="radio"
              name={name}
              value={o.value}
              disabled={o.disabled}
              {...(value === undefined ? { defaultChecked: o.value === defaultValue } : { checked: o.value === value })}
              onChange={onChange}
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
