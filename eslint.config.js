// Lint gates from ADR-0005: CSS through @eslint/css, markup through html-eslint. Both hold the Baseline floor.
import css from '@eslint/css';
import html from '@html-eslint/eslint-plugin';

export default [
  { ignores: ['**/dist/**', '**/out/**', '**/.next/**', '**/storybook-static/**', '**/node_modules/**', 'tools/**'] },
  {
    files: ['packages/*/src/**/*.css'],
    plugins: { css },
    language: 'css/css',
    rules: {
      ...css.configs.recommended.rules,
      // Tokens are custom properties defined in @lue-ui/tokens, so they're unknown to a per-file check.
      'css/no-invalid-properties': ['error', { allowUnknownVariables: true }],
      'css/use-baseline': ['error', {
        available: 'newly',
        // Enhancements that fail safe: an unknown media feature never matches, and an unknown value is dropped,
        // leaving the declaration before it in force.
        allowMediaConditions: ['prefers-reduced-transparency'],
        allowPropertyValues: { 'text-wrap': ['pretty'] },
      }],
      // Everything ships in `@layer lue` and its sub-layers (RFC-0001 §2). The rule tests each dotted segment.
      'css/use-layers': ['error', { layerNamePattern: '^(lue|reset|tokens|base|layout|components|blocks|materials|contrast|utilities)$',
        // lue.css imports files that put themselves in their own sub-layers; layer() on the import would nest them.
        requireImportLayers: false,
      }],
      'css/prefer-logical-properties': 'error',
      'css/relative-font-units': ['error', { allowUnits: ['rem', 'em'] }],
    },
  },
  {
    files: ['**/*.html'],
    plugins: { '@html-eslint': html },
    language: '@html-eslint/html',
    rules: {
      ...html.configs['flat/recommended'].rules,
      '@html-eslint/use-baseline': ['error', { available: 'newly' }],
      '@html-eslint/require-button-type': 'error',
      '@html-eslint/no-nested-interactive': 'error',
      '@html-eslint/no-positive-tabindex': 'error',
      '@html-eslint/no-redundant-role': 'error',
      '@html-eslint/require-input-label': 'error',
      // Formatting rules are left to the editor.
      '@html-eslint/indent': 'off',
      '@html-eslint/attrs-newline': 'off',
      '@html-eslint/element-newline': 'off',
    },
  },
];
