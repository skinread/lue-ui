import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../cx.js';

export interface HeroProps extends Omit<ComponentPropsWithRef<'section'>, 'title' | 'children'> {
  /** The page's headline: the h1, which also names the hero. */
  title: ReactNode;
  /** A short line above the headline: what the page or studio is. */
  kicker?: ReactNode;
  /** A sentence or two under the headline. */
  lede?: ReactNode;
  /** Up to two buttons or links. */
  actions?: ReactNode;
  /** Beside the text: decorative art (a prism, `aria-hidden`) or, for a split hero, a `<Figure>`. */
  object?: ReactNode;
  /** Decorative art behind everything (a satin `<svg class="lue-satin" aria-hidden="true">`). */
  backdrop?: ReactNode;
  /** "center" for a single centred message without an object. */
  layout?: 'center' | undefined;
}

/**
 * `<section class="lue-hero" aria-labelledby>` - the opening statement of a page: kicker, headline, lede and actions,
 * beside an object. Sized to its content. The headline's id is `<id>-title` when the hero has an `id`. Contract:
 * apps/docs/contracts/hero.json.
 */
export function Hero({ title, kicker, lede, actions, object, backdrop, layout, className, ...props }: HeroProps): ReactNode {
  const generated = useId().replace(/[^\w-]/g, '');
  const id = props.id ? `${props.id}-title` : `hero${generated}`;
  return (
    <section {...props} className={cx('lue-hero', className)} aria-labelledby={id} data-layout={layout}>
      {backdrop}
      <div className="lue-hero__grid">
        <div className="lue-hero__text">
          {kicker ? <p className="lue-kicker">{kicker}</p> : null}
          <h1 className="lue-display" id={id}>{title}</h1>
          {lede ? <p className="lue-lede">{lede}</p> : null}
          {actions ? <div className="lue-actions">{actions}</div> : null}
        </div>
        {object ? <div className="lue-hero__object">{object}</div> : null}
      </div>
    </section>
  );
}
