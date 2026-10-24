'use client';
import { createElement, type ComponentPropsWithRef, type ReactNode } from 'react';
import { Button } from '../button/index.js';
import { cx } from '../cx.js';
import { Field, TextInput } from '../field/index.js';

export interface SearchProps extends Omit<ComponentPropsWithRef<'form'>, 'children'> {
  /** The field's label ("Search" by default). */
  label?: ReactNode;
  /** The query's name in the URL (`q` by default). */
  name?: string | undefined;
  /** The button's text ("Search" by default). */
  buttonLabel?: ReactNode;
  defaultValue?: string | undefined;
}

/**
 * `<search class="lue-search">` around a GET form: a labelled `<input type="search">` and a submit button. Works
 * without script. Contract: apps/docs/contracts/search.json.
 */
export function Search({ label = 'Search', name = 'q', buttonLabel = 'Search', defaultValue, className, method = 'get', ...props }: SearchProps): ReactNode {
  return createElement(
    'search',
    { className: cx('lue-search', className) },
    <form {...props} method={method}>
      <Field label={label}>
        <TextInput type="search" name={name} defaultValue={defaultValue} autoComplete="off" />
      </Field>
      <Button type="submit">{buttonLabel}</Button>
    </form>,
  );
}
