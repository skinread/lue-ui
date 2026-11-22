import { createElement, type ComponentPropsWithRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../cx.js';

export interface FeatureGridProps extends ComponentPropsWithRef<'ul'> {
  /** The narrowest a column may be, as a CSS length (15rem by default). */
  min?: string | undefined;
}

/**
 * `<ul class="lue-feature-grid">` of `<Feature>`s: as many columns of at least `min` as fit. Contract:
 * apps/docs/contracts/feature-grid.json.
 */
export function FeatureGrid({ min, className, style, ...props }: FeatureGridProps): ReactNode {
  return <ul {...props} className={cx('lue-feature-grid', className)} style={min ? ({ ...style, '--lue-feature-min': min } as CSSProperties) : style} />;
}

export interface FeatureProps extends Omit<ComponentPropsWithRef<'li'>, 'title'> {
  /** A decorative `<IconTile>`; the heading says what the feature is. */
  icon?: ReactNode;
  /** The feature's name. */
  title: ReactNode;
  /** The heading's level: h3 without it, under the section's h2. */
  headingLevel?: 'h2' | 'h3' | 'h4' | undefined;
}

/** `<li class="lue-feature">` - an icon tile, a heading and a sentence (the children: inline content, in a `<p>`). */
export function Feature({ icon, title, headingLevel = 'h3', className, children, ...props }: FeatureProps): ReactNode {
  return (
    <li {...props} className={cx('lue-feature', className)}>
      {icon}
      {createElement(headingLevel, { className: 'lue-h3' }, title)}
      {children ? <p>{children}</p> : null}
    </li>
  );
}
