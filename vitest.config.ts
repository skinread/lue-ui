import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import { emulateMedia } from './tests/emulation/commands.js';

const source = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// Tests run against package sources, not builds. Every test runs in Chromium, Firefox and WebKit (ADR-0005).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@lue-ui\/elements\/define$/, replacement: source('./packages/elements/src/define.ts') },
      { find: /^@lue-ui\/elements$/, replacement: source('./packages/elements/src/index.ts') },
      { find: /^@lue-ui\/react$/, replacement: source('./packages/react/src/index.ts') },
    ],
  },
  test: {
    include: ['packages/*/src/**/*.browser.test.{ts,tsx}', 'tests/**/*.browser.test.{ts,tsx}'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      commands: { emulateMedia },
      instances: [{ browser: 'chromium' }, { browser: 'firefox' }, { browser: 'webkit' }],
    },
  },
});
