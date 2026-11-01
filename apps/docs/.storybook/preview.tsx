import type { ArgTypesEnhancer, InputType } from 'storybook/internal/types';
import type { Preview } from '@storybook/react-vite';
import '@lue-ui/tokens/tokens.css';
import '../../../packages/css/src/lue.css';
import '../../../packages/css/src/fonts.css';
import './backdrop.css';
import { DocsPage } from './docs-page.js';

type SBType = { name: string; value?: unknown; raw?: string; required?: boolean };
const CONTROLS: Record<string, string> = { boolean: 'boolean', string: 'text', number: 'number' };

/**
 * The adapters type optional props as `T | undefined` (exactOptionalPropertyTypes), which react-docgen reports as a
 * union: the props table said "union" and `boolean | undefined` got an object control. This shows the type without
 * `undefined`, and gives a single remaining type its own control.
 */
const optionalProps: ArgTypesEnhancer = ({ argTypes }) =>
  Object.fromEntries(
    Object.entries(argTypes).map(([key, argType]): [string, InputType] => {
      const type = argType.type as SBType | undefined;
      if (!type?.raw) return [key, argType];
      const raw = type.raw.replace(/\s*\|\s*(undefined|null)\b/g, '');
      const next: InputType = { ...argType, table: { ...argType.table, type: raw.length <= 60 ? { summary: raw } : { summary: type.name, detail: raw } } };
      const members = type.name === 'union' && Array.isArray(type.value) ? (type.value as SBType[]).filter((m) => !(m.name === 'other' && (m.value === 'undefined' || m.value === 'null'))) : [];
      const only = members.length === 1 ? members[0]! : undefined;
      const control = only && CONTROLS[only.name];
      if (only && control) {
        next.type = { ...only, required: type.required ?? false } as InputType['type'];
        const current = argType.control as { type?: string } | undefined;
        if (!current?.type || current.type === 'object') next.control = { type: control } as InputType['control'];
      }
      return [key, next];
    }),
  );

const preview: Preview = {
  // A docs page for every component: the React adapter, its props, the HTML it renders, and its stories.
  tags: ['autodocs'],
  argTypesEnhancers: [optionalProps],
  parameters: {
    docs: { page: DocsPage, toc: true },
    // ADR-0005: axe violations fail story tests.
    a11y: { test: 'error' },
    layout: 'padded',
    backgrounds: { disable: true },
  },
  globalTypes: {
    theme: {
      description: 'Lue theme (data-theme on the root). "auto" follows the OS.',
      toolbar: { title: 'Theme', icon: 'contrast', items: ['auto', 'dark', 'light', 'dark-more', 'light-more'], dynamicTitle: true },
    },
    backdrop: {
      description: 'What the glass sits on: Lue\'s ambient light (so its refraction and depth show), or the plain canvas',
      toolbar: { title: 'Backdrop', icon: 'photo', items: ['light', 'plain'], dynamicTitle: true },
    },
    dir: {
      description: 'Writing direction',
      toolbar: { title: 'Direction', icon: 'transfer', items: ['ltr', 'rtl'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'auto', dir: 'ltr', backdrop: 'light' },
  decorators: [
    (Story, { globals, viewMode }) => {
      const root = document.documentElement;
      if (globals.theme === 'auto') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', globals.theme);
      root.dir = globals.dir;
      if (globals.backdrop === 'plain') return <Story />;
      // Glass needs something behind it to bend. On a docs page each story gets its own lit stage; on its own, the
      // light fills the viewport behind it.
      return viewMode === 'docs' ? (
        <div className="lue-stage" style={{ padding: 'var(--lue-space-l)', borderRadius: 'var(--lue-radius-m)' }}>
          <div className="lue-ambient" aria-hidden="true" />
          <div className="sb-light" aria-hidden="true" />
          <Story />
        </div>
      ) : (
        <>
          <div className="lue-ambient" aria-hidden="true" style={{ position: 'fixed' }} />
          <div className="sb-light" data-fixed="" aria-hidden="true" />
          <Story />
        </>
      );
    },
  ],
};

export default preview;
