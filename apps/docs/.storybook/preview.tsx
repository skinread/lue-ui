import type { Preview } from '@storybook/react-vite';
import '@lue-ui/tokens/tokens.css';
import '../../../packages/css/src/lue.css';
import '../../../packages/css/src/fonts.css';

const preview: Preview = {
  parameters: {
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
    dir: {
      description: 'Writing direction',
      toolbar: { title: 'Direction', icon: 'transfer', items: ['ltr', 'rtl'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'auto', dir: 'ltr' },
  decorators: [
    (Story, { globals }) => {
      const root = document.documentElement;
      if (globals.theme === 'auto') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', globals.theme);
      root.dir = globals.dir;
      return <Story />;
    },
  ],
};

export default preview;
