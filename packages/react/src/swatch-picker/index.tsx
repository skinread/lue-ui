import type { ChangeEventHandler, ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface SwatchPickerProps extends Omit<ComponentPropsWithRef<'fieldset'>, 'children' | 'onChange' | 'defaultValue'> {
  /** The group's name, e.g. "Colour". */
  legend: ReactNode;
  /** The radios' shared name, submitted with the form. */
  name: string;
  /** Each colour with its name, which is always shown: never colour alone. */
  swatches: { value: string; label: ReactNode; color: string; disabled?: boolean | undefined }[];
  /** The swatch chosen first. */
  defaultValue?: string | undefined;
  /** Called with the radio's change event; `event.target.value` is the new value. */
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
}

/**
 * A radio group of colours (`<fieldset class="lue-fieldset">` of `.lue-swatch` labels), each named in words.
 * Contract: apps/docs/contracts/swatch-picker.json.
 */
export function SwatchPicker({ legend, name, swatches, defaultValue, onChange, className, ...props }: SwatchPickerProps): ReactNode {
  return (
    <fieldset {...props} className={cx('lue-fieldset', className)}>
      <legend>{legend}</legend>
      <div className="lue-swatches">
        {swatches.map((s) => (
          <label key={s.value} className="lue-swatch">
            <input type="radio" name={name} value={s.value} disabled={s.disabled} defaultChecked={s.value === defaultValue} onChange={onChange} />
            <span className="lue-swatch__chip" style={{ '--lue-swatch': s.color } as CSSProperties} />
            {s.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
