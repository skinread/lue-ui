import type { ComponentPropsWithRef, MouseEventHandler, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface TagProps extends ComponentPropsWithRef<'span'> {
  /** Makes it removable: a button inside the tag calls this. */
  onRemove?: MouseEventHandler<HTMLButtonElement> | undefined;
  /** The remove button's name; "Remove {text}" when the tag's text is a string. Translate it here. */
  removeLabel?: string | undefined;
}

/**
 * `<span class="lue-tag">`, a label pill; with `onRemove`, a named remove button inside it. Contract:
 * apps/docs/contracts/tag.json.
 */
export function Tag({ onRemove, removeLabel, className, children, ...props }: TagProps): ReactNode {
  return (
    <span {...props} className={cx('lue-tag', className)}>
      {children}
      {onRemove ? (
        <button type="button" className="lue-tag__remove" aria-label={removeLabel ?? `Remove ${typeof children === 'string' ? children : ''}`.trim()} onClick={onRemove}>
          <svg className="lue-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
      ) : null}
    </span>
  );
}
