import { createElement, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../cx.js';

export interface TabsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The tab list's name, e.g. "Project details". */
  label: string;
  /** Each tab: an id (the panel's; the tab's is `${id}-tab`), its label and its panel's content. */
  tabs: { id: string; label: ReactNode; content: ReactNode }[];
}

/**
 * `<lue-tabs class="lue-tabs">`: a named `<nav>` of links to panels, which the `<lue-tabs>` element turns into tabs (mount
 * `<LueElements/>` once). Server-rendered and without the element, it's a list of links to every panel. Contract:
 * apps/docs/contracts/tabs.json.
 */
export function Tabs({ label, tabs, className, ...props }: TabsProps): ReactNode {
  // createElement rather than JSX, so consumers' JSX types aren't augmented with <lue-tabs>.
  return createElement(
    'lue-tabs',
    { ...props, className: cx('lue-tabs', className) },
    <nav className="lue-tabs__list" aria-label={label}>
      {tabs.map((t) => <a key={t.id} className="lue-tabs__tab" id={`${t.id}-tab`} href={`#${t.id}`}>{t.label}</a>)}
    </nav>,
    ...tabs.map((t) => <section key={t.id} className="lue-tabs__panel" id={t.id} aria-labelledby={`${t.id}-tab`}>{t.content}</section>),
  );
}
