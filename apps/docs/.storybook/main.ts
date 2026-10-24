// Storybook 10 for Lue UI (RFC-0001 §1: apps/docs). Stories render the React adapters, which render the same markup
// as the HTML core; the CSS is the real package CSS.
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const source = (path: string) => fileURLToPath(new URL(path, import.meta.url));

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  core: { disableTelemetry: true },
  // The JS packages aren't built yet; stories use their sources, as the tests do.
  viteFinal: (vite) => ({
    ...vite,
    resolve: {
      ...vite.resolve,
      alias: [
        ...(Array.isArray(vite.resolve?.alias) ? vite.resolve.alias : Object.entries(vite.resolve?.alias ?? {}).map(([find, replacement]) => ({ find, replacement }))),
        { find: /^@lue-ui\/elements\/define$/, replacement: source('../../../packages/elements/src/define.ts') },
        { find: /^@lue-ui\/elements\/validate$/, replacement: source('../../../packages/elements/src/validate/controller.ts') },
        { find: /^@lue-ui\/elements\/menu$/, replacement: source('../../../packages/elements/src/menu/controller.ts') },
        { find: /^@lue-ui\/elements$/, replacement: source('../../../packages/elements/src/index.ts') },
        { find: /^@lue-ui\/react$/, replacement: source('../../../packages/react/src/index.ts') },
      ],
    },
  }),
};

export default config;
