'use client';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';
import { useFieldControl } from '../field/index.js';

export type SelectProps = ComponentPropsWithRef<'select'>;

/**
 * `<select class="lue-select">` in its `.lue-select-wrap`, with the chevron - the same markup as the HTML core. Options
 * are plain `<option>` text (v1: no `<selectedcontent>`). Inside a Field it's wired up like TextInput.
 * Contract: apps/docs/contracts/select.json.
 */
export function Select({ className, ...props }: SelectProps): ReactNode {
  return (
    <div className="lue-select-wrap">
      <select {...props} {...useFieldControl(props)} className={cx('lue-select', className)} />
      <svg className="lue-icon" aria-hidden="true" viewBox="0 0 16 16">
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
