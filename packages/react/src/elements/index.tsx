'use client';
import { useEffect, type ReactNode } from 'react';

/**
 * Registers Lue UI's custom elements in the browser. Mount it once at the root. It renders nothing, and the import
 * runs after hydration, so server rendering never touches `HTMLElement`.
 */
export function LueElements(): ReactNode {
  useEffect(() => {
    void import('@lue-ui/elements/define');
  }, []);
  return null;
}
