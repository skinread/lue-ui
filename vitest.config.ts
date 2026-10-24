import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import { emulateMedia } from './tests/emulation/commands.js';

const source = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// Every test runs in Chromium, Firefox and WebKit (ADR-0005). Instances are named "<project> (<browser>)", so CI can
// shard by engine with --project "*(chromium)".
// A fresh object per project: Vitest writes the instance names into it.
const browser = () => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  commands: { emulateMedia },
  instances: [{ browser: 'chromium' as const }, { browser: 'firefox' as const }, { browser: 'webkit' as const }],
});

// Tests run against package sources, not builds (tokens.css is the exception: `pnpm test` builds it first).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@lue-ui\/elements\/define$/, replacement: source('./packages/elements/src/define.ts') },
      { find: /^@lue-ui\/elements\/validate$/, replacement: source('./packages/elements/src/validate/controller.ts') },
      { find: /^@lue-ui\/elements\/menu$/, replacement: source('./packages/elements/src/menu/controller.ts') },
      { find: /^@lue-ui\/elements$/, replacement: source('./packages/elements/src/index.ts') },
      { find: /^@lue-ui\/react$/, replacement: source('./packages/react/src/index.ts') },
    ],
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['packages/*/src/**/*.browser.test.{ts,tsx}', 'tests/**/*.browser.test.{ts,tsx}'],
          browser: browser(),
        },
      },
      {
        // Every story is a test: it renders, its play function passes, and axe finds nothing (a11y.test: 'error').
        extends: true,
        plugins: [storybookTest({ configDir: source('./apps/docs/.storybook') })],
        test: { name: 'storybook', browser: browser() },
      },
    ],
  },
});
