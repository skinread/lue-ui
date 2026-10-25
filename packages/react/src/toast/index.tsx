import { createElement, type HTMLAttributes, type ReactNode } from 'react';

export interface ToastOptions {
  action?: { label: string; onAction: () => void } | undefined;
  duration?: number | null | undefined;
}
interface Region extends HTMLElement {
  show?: (message: string, options?: ToastOptions) => { dismiss(): void };
}

export interface ToastRegionProps extends HTMLAttributes<HTMLElement> {
  /** The dismiss button's name, translated ("Dismiss" by default). */
  'dismiss-label'?: string | undefined;
}

/**
 * `<lue-toast-region>` - render it once, empty, near the end of the page, and mount `<LueElements/>`. The element owns
 * everything inside it. Contract: apps/docs/contracts/toast.json.
 */
export function ToastRegion(props: ToastRegionProps): ReactNode {
  // createElement rather than JSX, so consumers' JSX types aren't augmented with <lue-toast-region>.
  return createElement('lue-toast-region', props);
}

/**
 * Announces and shows a toast in the page's `<lue-toast-region>`. Call it from an event handler. Returns a handle to
 * dismiss it, or undefined before the element is defined.
 */
export function showToast(message: string, options?: ToastOptions): { dismiss(): void } | undefined {
  return document.querySelector<Region>('lue-toast-region')?.show?.(message, options);
}
