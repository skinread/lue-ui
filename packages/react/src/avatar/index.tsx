import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../cx.js';

export interface AvatarProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** The person's name: the image's alt text, or the initials' accessible name. */
  name: string;
  /** A photo. Without it, the initials show. */
  src?: string | undefined;
  /** When the name is already written beside it: hidden from assistive technology so it isn't read twice. */
  decorative?: boolean | undefined;
  /** Medium without it. */
  size?: 'lg' | undefined;
}

/** The first letters of the first and last words. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words.length ? (words[0]![0]! + (words.length > 1 ? words.at(-1)![0]! : '')).toUpperCase() : '';
}

/**
 * `<span class="lue-avatar">` with a photo (`<img alt>`) or initials (`role="img"` with the name). Contract:
 * apps/docs/contracts/avatar.json.
 */
export function Avatar({ name, src, decorative, size, className, ...props }: AvatarProps): ReactNode {
  const own = { ...props, className: cx('lue-avatar', className), 'data-size': size };
  if (src) return <span {...own}><img src={src} alt={decorative ? '' : name} /></span>;
  return decorative ? <span {...own} aria-hidden="true">{initials(name)}</span> : <span {...own} role="img" aria-label={name}>{initials(name)}</span>;
}
