'use client';
import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';

export interface TableProps extends Omit<ComponentPropsWithRef<'table'>, 'children'> {
  /** The table's name: shown above it, and it names the scrolling region. */
  caption: ReactNode;
  /** thead, tbody and tfoot. */
  children: ReactNode;
}

/**
 * `<table class="lue-table">` with a caption, in a scrollable `<section class="lue-table-wrap">` that keyboard users can
 * scroll (a region named by the caption, with `tabindex="0"`). Mark number cells with `data-numeric`. Contract: apps/docs/contracts/table.json.
 */
export function Table({ caption, className, children, ...props }: TableProps): ReactNode {
  const id = `caption${useId().replace(/:/g, '')}`;
  return (
    <section className="lue-table-wrap" aria-labelledby={id} tabIndex={0}>
      <table {...props} className={cx('lue-table', className)}>
        <caption id={id}>{caption}</caption>
        {children}
      </table>
    </section>
  );
}
