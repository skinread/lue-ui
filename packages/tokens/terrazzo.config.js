// Builds dist/tokens.css from the DTCG source (ADR-0003). Literal values per context; no light-dark(), no @property for
// themeable colours. plugins/lue.js adds the contrast gate, the schema checks and the Claude Design JSON.
import { defineConfig } from '@terrazzo/cli';
import css from '@terrazzo/plugin-css';
import { transformCSSValue } from '@terrazzo/token-tools/css';
import { lueClaudeDesign, lueContrast, lueSchema } from './plugins/lue.js';

// Tokens that change with the theme context; everything else is context-free and emitted once, with the default.
const THEMED = ['color.*', 'material.*', 'shadow.*'];
const PRIMITIVES = ['color.neutral.*', 'color.prism.*'];
const variableName = (token) => `--lue-${token.id.replace(/\./g, '-')}`;
const round = (n) => +n.toFixed(4);

// $extensions.lue carries what DTCG 2025.10 can't say (docs/design/tokens.md): a fluid range, em/ch units, a CSS
// easing the cubicBezier type can't hold, and em letter spacing on text styles.
function transform(token, options) {
  const ext = token.$extensions?.lue ?? {};
  if (ext.fluid) {
    // clamp(min, intercept + slope·100vi, max), linear between the two viewports. rem in both terms keeps zoom working.
    const { min, minViewport, maxViewport } = ext.fluid;
    const max = token.$value.value;
    const slope = ((max - min.value) * 16) / (maxViewport - minViewport);
    if (slope === 0) return `${max}rem`;
    return `clamp(${min.value}rem, ${round(min.value - (slope * minViewport) / 16)}rem + ${round(slope * 100)}vi, ${max}rem)`;
  }
  if (ext.css) return ext.css;
  if (ext.unit && typeof token.$value === 'number') return `${token.$value}${ext.unit}`;
  if (token.$type === 'typography') {
    const value = transformCSSValue(token, options);
    if (typeof value !== 'object') return value;
    if (ext.letterSpacingEm != null) value['letter-spacing'] = `${ext.letterSpacingEm}em`;
    if (ext.textTransform) value['text-transform'] = ext.textTransform;
    return value;
  }
  return undefined;
}

// Selectors: the OS preferences apply only where no data-theme is set, at zero specificity, so any [data-theme] wins;
// the -more themes come later in source so they win over their scheme when both preferences match.
const layer = (body) => `@layer lue.tokens {\n${body}\n}`;
const wrap = (selectors, { media, scheme } = {}) => (contents) => {
  const rule = `${selectors} {\n${scheme ? `  color-scheme: ${scheme};\n` : ''}${contents}\n}`;
  return layer(media ? `@media ${media} {\n${rule}\n}` : rule);
};
const AUTO = ':where(:root:not([data-theme]))';

export default defineConfig({
  tokens: ['./src/lue.resolver.json'],
  outDir: './dist/',
  plugins: [
    css({
      filename: 'tokens.css',
      variableName,
      transform,
      // Primitives feed the semantic tokens at build time and are never public CSS (docs/design/tokens.md).
      exclude: PRIMITIVES,
      permutations: [
        { input: { theme: 'dark', density: 'default' }, prepare: wrap(':where(:root), [data-theme="dark"]', { scheme: 'dark' }) },
        { input: { theme: 'light', density: 'default' }, include: THEMED, prepare: wrap(AUTO, { media: '(prefers-color-scheme: light)', scheme: 'light' }) },
        { input: { theme: 'light', density: 'default' }, include: THEMED, prepare: wrap('[data-theme="light"]', { scheme: 'light' }) },
        { input: { theme: 'dark-more', density: 'default' }, include: THEMED, prepare: wrap(AUTO, { media: '(prefers-contrast: more)' }) },
        { input: { theme: 'dark-more', density: 'default' }, include: THEMED, prepare: wrap('[data-theme="dark-more"], [data-theme="dark"][data-contrast="more"]', { scheme: 'dark' }) },
        { input: { theme: 'light-more', density: 'default' }, include: THEMED, prepare: wrap(AUTO, { media: '(prefers-color-scheme: light) and (prefers-contrast: more)' }) },
        { input: { theme: 'light-more', density: 'default' }, include: THEMED, prepare: wrap('[data-theme="light-more"], [data-theme="light"][data-contrast="more"]', { scheme: 'light' }) },
        { input: { theme: 'dark', density: 'compact' }, include: ['density'], prepare: wrap('[data-density="compact"]') },
        { input: { theme: 'dark', density: 'comfortable' }, include: ['density'], prepare: wrap('[data-density="comfortable"]') },
      ],
    }),
    lueSchema(),
    lueContrast(),
    lueClaudeDesign({ variableName, exclude: PRIMITIVES }),
  ],
});
