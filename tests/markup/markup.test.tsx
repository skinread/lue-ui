// ADR-0005 static markup gate: every story, rendered with renderToStaticMarkup (as a server would), must be valid
// HTML (html-validate) and pass the repo's html-eslint rules (Baseline, labels, no nested interactive content).
// Runs in Node: this is the markup a crawler, a no-JS browser or Claude Design gets.
import { describe, expect, it } from 'vitest';
import { composeStories } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HtmlValidate } from 'html-validate';
import { ESLint } from 'eslint';
import fs from 'node:fs';

const validator = new HtmlValidate({
  extends: ['html-validate:recommended'],
  rules: {
    // Formatting and authoring style, not validity or accessibility.
    'no-inline-style': 'off',
    'no-trailing-whitespace': 'off',
    'void-style': 'off',
    'doctype-style': 'off',
    // React's serialisation: boolean attributes as attr="", and camelCase names (autoComplete), which HTML reads
    // case-insensitively.
    'attribute-boolean-style': 'off',
    'attr-case': 'off',
    'attribute-empty-style': 'off',
    // <lue-menu> is a custom element html-validate doesn't know.
    'no-unknown-elements': 'off',
    // command / commandfor (invoker commands) are newer than html-validate's element metadata.
    'attribute-allowed-values': ['error', { ignore: [] }],
  },
  elements: [
    'html5',
    {
      'lue-menu': { flow: true, phrasing: false, interactive: false, permittedContent: ['@flow'] },
      button: { attributes: { command: {}, commandfor: {} } },
    },
  ],
});
// React closes void elements with a spaced slash (<input />), which is valid HTML.
const eslint = new ESLint({ overrideConfig: { files: ['**/*.html'], rules: { '@html-eslint/require-closing-tags': ['error', { selfClosing: 'always' }], '@html-eslint/no-extra-spacing-tags': 'off' } } });

// Features a contract declares as an enhancement with a fallback (platform.enhancements) are allowed past use-baseline.
const enhancements = fs.readdirSync('apps/docs/contracts').filter((f) => f.endsWith('.json') && !f.includes('schema'))
  .flatMap((f) => JSON.parse(fs.readFileSync(`apps/docs/contracts/${f}`, 'utf8')).platform?.enhancements ?? [])
  .map((e: { feature: string }) => e.feature);
const declared = (message: string) => {
  const feature = message.match(/^Attribute '([\w-]+)'/)?.[1];
  return !!feature && enhancements.some((e) => e.split(/[\s,]+/).includes(feature));
};

const stories = import.meta.glob<Record<string, unknown>>('../../apps/docs/stories/*.stories.tsx', { eager: true });
const page = (body: string) => `<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><title>Lue UI story</title></head>
<body><main>${body}</main></body>
</html>
`;

for (const [file, module] of Object.entries(stories)) {
  const name = file.split('/').pop()!.replace('.stories.tsx', '');
  describe(name, () => {
    const composed = composeStories(module as Parameters<typeof composeStories>[0]) as Record<string, ComponentType>;
    for (const [story, Story] of Object.entries(composed)) {
      it(story, async () => {
        const html = page(renderToStaticMarkup(<Story />));
        const report = await validator.validateString(html, `${name}-${story}.html`);
        const htmlProblems = report.results.flatMap((r) => r.messages.map((m) => `${m.ruleId}: ${m.message} (${m.selector ?? ''})`));
        const [lint] = await eslint.lintText(html, { filePath: `apps/docs/stories/${name}-${story}.html` });
        const lintProblems = lint!.messages
          .filter((m) => !(m.ruleId === '@html-eslint/use-baseline' && declared(m.message)))
          .map((m) => `${m.ruleId}: ${m.message}`);
        expect([...htmlProblems, ...lintProblems]).toEqual([]);
      });
    }
  });
}
