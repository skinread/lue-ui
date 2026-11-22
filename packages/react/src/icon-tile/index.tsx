import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface IconTileProps extends Omit<ComponentPropsWithRef<'span'>, 'aria-hidden'> {
  /** Large (112px) for heroes and media; 64px without it. */
  size?: 'lg' | undefined;
}

/**
 * `<span class="lue-tile" aria-hidden="true">` - an icon on a liquid-metal tile. Always decorative: the text beside
 * it carries the meaning. Pass the icon (an `<Icon>`) as the child. Contract: apps/docs/contracts/icon-tile.json.
 */
export function IconTile({ size, className, ...props }: IconTileProps): ReactNode {
  return <span {...props} className={cx('lue-tile', className)} data-size={size} aria-hidden="true" />;
}
