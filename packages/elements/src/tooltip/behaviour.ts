/**
 * `[data-lue-tooltip="id"]` - the HTML path's tooltip (WCAG 1.4.13): the popover="manual" element with that id shows
 * after a short hover or at once on keyboard focus, stays while the pointer moves onto it, hides when the pointer and
 * focus leave, and Escape hides it without moving focus. The trigger names it in aria-describedby, so the text is read
 * with or without this script. Touch doesn't show tooltips: anything a user needs belongs in a Toggletip.
 *
 * Owned (ADR-0007): nothing; it only opens and closes the popover.
 */
/** Milliseconds a pointer rests on a trigger before its tooltip shows; keyboard focus shows it at once. */
export const TOOLTIP_DELAY = 300;
/** Milliseconds before a tooltip hides once the pointer leaves, so it can move onto the tooltip (WCAG 1.4.13). */
export const TOOLTIP_HIDE_DELAY = 150;

/** Starts the tooltip behaviour for every `[data-lue-tooltip]` trigger inside `root`; returns a function that stops it. */
export function installTooltip(root: Document | HTMLElement = document): () => void {
  const connection = new AbortController();
  const options = { signal: connection.signal };
  const doc = root instanceof Document ? root : root.ownerDocument;
  let open: { trigger: HTMLElement; tip: HTMLElement } | null = null;
  let showTimer: ReturnType<typeof setTimeout> | undefined;
  let hideTimer: ReturnType<typeof setTimeout> | undefined;

  const triggerOf = (target: EventTarget | null) => (target instanceof Element ? target.closest<HTMLElement>('[data-lue-tooltip]') : null);
  const tipOf = (trigger: HTMLElement) => doc.getElementById(trigger.dataset.lueTooltip ?? '');

  const hide = () => {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    if (open?.tip.matches(':popover-open')) open.tip.hidePopover();
    open = null;
  };
  const show = (trigger: HTMLElement, delay: number) => {
    clearTimeout(hideTimer);
    clearTimeout(showTimer);
    if (open?.trigger === trigger) return;
    showTimer = setTimeout(() => {
      const tip = tipOf(trigger);
      if (!tip || !trigger.isConnected) return;
      hide();
      try {
        // The trigger as source makes it the implicit anchor (anchor positioning puts the tip beside it).
        (tip.showPopover as (options?: { source?: HTMLElement }) => void)({ source: trigger });
      } catch {
        tip.showPopover();
      }
      open = { trigger, tip };
    }, delay);
  };
  const leaveSoon = () => {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!open) return;
      const hovered = open.trigger.matches(':hover') || open.tip.matches(':hover');
      const focused = open.trigger.matches(':focus-visible');
      if (!hovered && !focused) hide();
    }, TOOLTIP_HIDE_DELAY);
  };

  root.addEventListener('pointerover', (event) => {
    if ((event as PointerEvent).pointerType === 'touch') return;
    const trigger = triggerOf(event.target);
    if (trigger) show(trigger, TOOLTIP_DELAY);
    else if (open && open.tip.contains(event.target as Node)) clearTimeout(hideTimer);
  }, options);
  root.addEventListener('pointerout', (event) => {
    if (open && (triggerOf(event.target) === open.trigger || open.tip.contains(event.target as Node))) leaveSoon();
    else if (!open) clearTimeout(showTimer);
  }, options);
  root.addEventListener('focusin', (event) => {
    const trigger = triggerOf(event.target);
    if (trigger?.matches(':focus-visible')) show(trigger, 0);
  }, options);
  root.addEventListener('focusout', (event) => {
    if (open && triggerOf(event.target) === open.trigger) leaveSoon();
  }, options);
  root.addEventListener('keydown', (event) => {
    if ((event as KeyboardEvent).key !== 'Escape' || !open) return;
    event.preventDefault(); // dismiss the tooltip only, not a dialog it sits in
    hide();
  }, { ...options, capture: true });

  return () => {
    hide();
    connection.abort();
  };
}
