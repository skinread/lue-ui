'use client';
import { useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';
import { Button } from '../button/index.js';

/** A tag to filter by. */
export interface TagFilterOption {
  /** What the tag stands for, in `value`. */
  value: string;
  /** Its visible name. */
  label: ReactNode;
  /** For filtering as navigation: the address of the filtered page. */
  href?: string | undefined;
}

export interface TagFilterProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'defaultValue'> {
  /** What the tags filter, translated: "Filter projects". It names the group. */
  label: string;
  /** The tags. When every one has an `href`, they render as links to filtered pages (a `<nav>`, which takes no `ref`)
   *  and need no script; when any lacks one, they are all toggle buttons. */
  options: TagFilterOption[];
  /** The chosen tags (controlled). Pair it with `onChange`. In the links form only the first is the current page. */
  value?: string[] | undefined;
  /** The tags chosen at first, when uncontrolled. */
  defaultValue?: string[] | undefined;
  /** Called with the chosen tags after each press. Say how many items now show, in a status message. */
  onChange?: ((value: string[]) => void) | undefined;
}

/**
 * A group of toggle buttons (`role="group"`, `aria-pressed`) that filter a list, or - when every option has an
 * `href` - a `<nav>` of links to filtered pages (`aria-current="page"`). Contract: apps/docs/contracts/tag-filter.json.
 */
export function TagFilter({ label, options, value, defaultValue = [], onChange, className, ...props }: TagFilterProps): ReactNode {
  const [own, setOwn] = useState(defaultValue);
  const chosen = value ?? own;
  if (options.every((o) => o.href)) {
    const { ref: _ref, ...rest } = props;
    return (
      <nav {...rest} className={cx('lue-tag-filter', className)} aria-label={label}>
        <ul>
          {options.map((o) => (
            <li key={o.value}>
              <a className="lue-button" data-size="sm" href={o.href} aria-current={o.value === chosen[0] ? 'page' : undefined}>{o.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
  const toggle = (v: string) => {
    const next = chosen.includes(v) ? chosen.filter((c) => c !== v) : [...chosen, v];
    if (value === undefined) setOwn(next);
    onChange?.(next);
  };
  return (
    <div {...props} className={cx('lue-tag-filter', className)} role="group" aria-label={label}>
      {options.map((o) => (
        <Button key={o.value} size="sm" pressed={chosen.includes(o.value)} onClick={() => toggle(o.value)}>{o.label}</Button>
      ))}
    </div>
  );
}
