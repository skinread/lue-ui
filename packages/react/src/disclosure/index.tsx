'use client';
import { createContext, useContext, useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';

const AccordionName = createContext<string | undefined>(undefined);

export interface DisclosureProps extends Omit<ComponentPropsWithRef<'details'>, 'open'> {
  summary: ReactNode;
  /** Open when it first renders. The browser owns `open` after that; listen with `onToggle`. */
  defaultOpen?: boolean | undefined;
  children: ReactNode;
}

/**
 * `<details class="lue-disclosure">` — a summary that shows and hides its content, with no script.
 * Contract: apps/docs/contracts/disclosure.json.
 */
export function Disclosure({ summary, defaultOpen, className, name, children, ...props }: DisclosureProps): ReactNode {
  const group = useContext(AccordionName);
  return (
    <details {...props} name={name ?? group} open={defaultOpen} className={cx('lue-disclosure', className)}>
      <summary>
        {summary}
        <svg className="lue-icon" aria-hidden="true" viewBox="0 0 16 16">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>
      <div>{children}</div>
    </details>
  );
}

export interface AccordionProps extends ComponentPropsWithRef<'div'> {
  /** The name the disclosures share; generated without it. One open at a time is native (`<details name>`). */
  name?: string | undefined;
  /** Disclosures. */
  children: ReactNode;
}

/** `<div class="lue-accordion">` around Disclosures that share a name. Contract: apps/docs/contracts/accordion.json. */
export function Accordion({ name, className, children, ...props }: AccordionProps): ReactNode {
  const generated = `accordion${useId().replace(/:/g, '')}`;
  return (
    <div {...props} className={cx('lue-accordion', className)}>
      <AccordionName value={name ?? generated}>{children}</AccordionName>
    </div>
  );
}
