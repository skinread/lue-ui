import { createElement, type ComponentPropsWithRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../cx.js';

type Space = '0' | '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl';
type Tag = 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav' | 'ul' | 'ol' | 'form';

export interface LayoutProps extends ComponentPropsWithRef<'div'> {
  /** The element to render; a div without it. A list (ul, ol) needs li children. */
  as?: Tag | undefined;
  /** A step on the space scale; each primitive has its own default. */
  gap?: Space | undefined;
}

function render(
  name: string,
  { as = 'div', gap, className, style, ...props }: LayoutProps,
  data: Record<string, string | undefined> = {},
  vars: Record<string, string | undefined> = {},
): ReactNode {
  const set = Object.entries(vars).filter(([, value]) => value !== undefined);
  return createElement(as, {
    ...props,
    ...data,
    className: cx(`lue-${name}`, className),
    'data-gap': gap,
    style: set.length ? ({ ...style, ...Object.fromEntries(set) } as CSSProperties) : style,
  });
}

/** `.lue-stack` — children in a column. Contract: apps/docs/contracts/layout.json. */
export function Stack(props: LayoutProps): ReactNode {
  return render('stack', props);
}

/** `.lue-cluster` — children in a row that wraps. */
export function Cluster({ justify, ...props }: LayoutProps & { justify?: 'center' | 'end' | 'between' | undefined }): ReactNode {
  return render('cluster', props, { 'data-justify': justify });
}

/** `.lue-grid` — as many columns of at least `min` (18rem by default) as fit. */
export function Grid({ min, ...props }: LayoutProps & { min?: string | undefined }): ReactNode {
  return render('grid', props, {}, { '--lue-grid-min': min });
}

/** `.lue-sidebar` — a sidebar (the first child, or the last with side="end") beside content; they stack when the
 *  content would be narrower than `contentMin` (50%). */
export function Sidebar({ side, width, contentMin, ...props }: LayoutProps & { side?: 'end' | undefined; width?: string | undefined; contentMin?: string | undefined }): ReactNode {
  return render('sidebar', props, { 'data-side': side }, { '--lue-sidebar-width': width, '--lue-sidebar-content-min': contentMin });
}

/** `.lue-switcher` — side by side, or all stacked when the container is narrower than `threshold` (30rem). */
export function Switcher({ threshold, ...props }: LayoutProps & { threshold?: string | undefined }): ReactNode {
  return render('switcher', props, {}, { '--lue-switcher-threshold': threshold });
}

/** `.lue-center` — a centred column no wider than `max` (the reading measure by default), with the page gutter. */
export function Center({ max, ...props }: Omit<LayoutProps, 'gap'> & { max?: string | undefined }): ReactNode {
  return render('center', props, {}, { '--lue-center-max': max });
}
