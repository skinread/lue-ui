// Builds the AI-readable docs (RFC-0001 §8) from the component contracts and stories into apps/docs/public, which
// Storybook serves at its root:
//   llms.txt                 the index (llmstxt.org): what Lue UI is, and a link per component
//   llms-full.txt            every page below, in one file
//   components/<id>.md       one page per contract: summary, the HTML each story renders on the server, React props,
//                            the accessibility contract, anatomy, platform needs and tokens
//   tokens.md, tokens.json   every token with its value in each theme
//   contracts/<id>.json      the contracts themselves, and contracts/index.json
// Stories are rendered with renderToStaticMarkup (as in the markup gate), so the HTML shown is the no-JavaScript
// markup. Fails when a contract has no summary or a story doesn't render. Run by `pnpm check` and the docs build.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'apps/docs/public');
const CONTRACTS = path.join(ROOT, 'apps/docs/contracts');
const STORIES = path.join(ROOT, 'apps/docs/stories');
const CACHE = path.join(ROOT, 'node_modules/.cache/lue-ui');
const { build } = await import(path.join(ROOT, 'packages/elements/node_modules/esbuild/lib/main.js'));

const problems = [];
const ids = fs.readdirSync(CONTRACTS).filter((f) => f.endsWith('.json') && f !== 'contract.schema.json').map((f) => f.slice(0, -5)).sort();
const contracts = Object.fromEntries(ids.map((id) => [id, JSON.parse(fs.readFileSync(path.join(CONTRACTS, `${id}.json`), 'utf8'))]));

// ---- render every story to static HTML, through a small esbuild bundle run in Node
const ALIASES = [
  [/^@lue-ui\/elements\/define$/, 'packages/elements/src/define.ts'],
  [/^@lue-ui\/elements\/validate$/, 'packages/elements/src/validate/controller.ts'],
  [/^@lue-ui\/elements\/menu$/, 'packages/elements/src/menu/controller.ts'],
  [/^@lue-ui\/elements$/, 'packages/elements/src/index.ts'],
  [/^@lue-ui\/react$/, 'packages/react/src/index.ts'],
];
const entry = [
  "import { createElement } from 'react';",
  "import { renderToStaticMarkup } from 'react-dom/server';",
  "import { composeStories } from '@storybook/react-vite';",
  ...ids.map((id, i) => `import * as s${i} from ${JSON.stringify(path.join(STORIES, `${id}.stories.tsx`))};`),
  `const modules = { ${ids.map((id, i) => `${JSON.stringify(id)}: s${i}`).join(', ')} };`,
  'export default Object.fromEntries(Object.entries(modules).map(([id, mod]) => [id, Object.entries(composeStories(mod)).map(([key, Story]) => {',
  '  try { return { name: Story.storyName ?? key, html: renderToStaticMarkup(createElement(Story)) }; }',
  '  catch (error) { return { name: Story.storyName ?? key, error: String(error) }; }',
  '})]));',
].join('\n');
fs.mkdirSync(CACHE, { recursive: true });
const outfile = path.join(CACHE, 'stories.mjs');
await build({
  stdin: { contents: entry, resolveDir: ROOT, loader: 'tsx' },
  bundle: true,
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  packages: 'external',
  outfile,
  // The define files are skipped (package.json sideEffects names their dist paths): good, they need a browser.
  logLevel: 'error',
  plugins: [{
    name: 'lue-sources',
    setup(b) {
      for (const [filter, file] of ALIASES) b.onResolve({ filter }, () => ({ path: path.join(ROOT, file) }));
    },
  }],
});
const rendered = (await import(`${pathToFileURL(outfile).href}?${Date.now()}`)).default;

/** A story file's title (its Storybook name, e.g. "Radio group") and the JSDoc above `const meta`, less the pointer
 *  back to the contract. */
function storyMeta(id) {
  const source = fs.readFileSync(path.join(STORIES, `${id}.stories.tsx`), 'utf8');
  const doc = source.match(/\/\*\*([\s\S]*?)\*\/\s*const meta/)?.[1] ?? '';
  return {
    title: source.match(/title: '(?:[^'/]*\/)?([^']+)'/)?.[1] ?? contracts[id].name,
    description: doc.split('\n').map((l) => l.replace(/^\s*\* ?/, '')).join(' ').replace(/\s+/g, ' ').replace(/\s*Contract: `[^`]+`\.?/, '').trim(),
  };
}
const meta = Object.fromEntries(ids.map((id) => [id, storyMeta(id)]));

// ---- Markdown helpers
const cell = (v) => String(v ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const table = (head, rows) => rows.length ? [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n') : '';
const code = (s) => `\`${String(s).replace(/`/g, "'")}\``;
const attrs = (a) => Object.entries(a ?? {}).map(([k, v]) => `${k}${v === '' ? '' : `="${v}"`}`).join(', ');
const section = (title, body) => (body && String(body).trim() ? `## ${title}\n\n${String(body).trim()}\n` : '');
const list = (items) => items.map((i) => `- ${i}`).join('\n');

function anatomyRows(anatomy) {
  return Object.entries(anatomy).map(([part, p]) => [part, `<${p.element}>`, p.class ? code(`.${p.class.split('|').join(', .')}`) : '', p.required === false ? 'optional' : 'required', attrs(p.attributes)]);
}

function page(id) {
  const c = contracts[id];
  const stories = rendered[id] ?? [];
  for (const s of stories) if (s.error) problems.push(`${id}: story "${s.name}" didn't render: ${s.error}`);
  if (!c.summary) problems.push(`${id}: the contract has no summary`);
  const a = c.a11y;
  const keyboard = table(['Keys', 'Action', 'On'], a.keyboard.map((k) => [k.keys.join(', '), k.action, [k.on, k.where].filter(Boolean).join('; ')]));
  const focus = list(Object.entries(a.focus ?? {}).map(([k, v]) => `**${k}:** ${v}`));
  const platform = [
    c.platform.baseline?.length ? `Baseline features it relies on: ${c.platform.baseline.join(', ')}.` : '',
    table(['Enhancement', 'Fallback', 'Where'], (c.platform.enhancements ?? []).map((e) => [e.feature, e.fallback, e.where])),
    table(['Known gap', 'Where', 'Policy'], (c.platform.knownGaps ?? []).map((g) => [g.gap, g.where, g.policy])),
  ].filter(Boolean).join('\n\n');
  const react = c.react ? [
    `\`import { ${String(c.react.component).split(/,\s*/).join(', ')} } from '@lue-ui/react'\``,
    table(['Prop', 'Meaning'], Object.entries(c.react.props ?? {}).map(([k, v]) => [k === '...' ? 'other props' : code(k), v])),
    c.react.note ?? '',
  ].filter(Boolean).join('\n\n') : '';
  const variants = table(['Variant', 'Attribute', 'Values'], Object.entries(c.variants ?? {}).map(([k, v]) => [k, code(v.attribute), v.values?.join(', ') ?? (v.type === 'boolean' ? 'present or absent' : '')]));
  const owned = Object.keys(c.ownedAttributes ?? {}).length ? list(Object.entries(c.ownedAttributes).map(([el, v]) => `${code(el)}: ${Array.isArray(v) ? v.join(', ') : typeof v === 'object' ? JSON.stringify(v) : v}`)) + (c.elementRules ? `\n\n${c.elementRules}` : '') : 'Nothing: no script writes to its DOM.';
  // Stories that only add a play function render the same markup as one before them: show each markup once.
  const seen = new Set();
  const html = stories.filter((s) => s.html && !seen.has(s.html) && seen.add(s.html)).map((s) => `### ${s.name}\n\n\`\`\`html\n${s.html}\n\`\`\``).join('\n\n');
  return [
    `# ${meta[id].title}\n\n> ${c.summary}\n`,
    meta[id].description ? `${meta[id].description}\n` : '',
    `Status: ${c.status} · Platform rung: ${c.rung}. ${c.rungReason}${c.covers ? `\n\nCovers: ${c.covers.join('; ')}.` : ''}\n`,
    section('HTML', html ? `Each example is what a server renders: it works before any script loads.\n\n${html}` : ''),
    section('React', react),
    section('Accessibility', [
      list([`**Role:** ${a.role}`, `**Name:** ${a.name}`, a.description ? `**Description:** ${a.description}` : '', a.targetSize ? `**Target size:** ${a.targetSize}` : ''].filter(Boolean)),
      table(['State', 'Exposed through'], (a.states ?? []).map((s) => [s.state, s.via])),
      `### Keyboard\n\n${keyboard}`,
      `### Focus\n\n${focus}`,
    ].filter(Boolean).join('\n\n')),
    section('Anatomy', table(['Part', 'Element', 'Class', 'Needed', 'Attributes'], anatomyRows(c.anatomy))),
    section('Variants', variants),
    section('Messages (translate these)', table(['Key', 'Default'], Object.entries(c.messages ?? {}).map(([k, v]) => [k, v]))),
    section('Owned attributes (ADR-0007)', owned),
    section('Platform', platform),
    section('Without JavaScript', c.withoutJavaScript),
    section('Motion', c.motion),
    section('Increased contrast', c.contrast),
    section('Forced colours', c.forcedColors),
    section('Rules', list(c.rules ?? [])),
    section('Tokens', (c.tokens ?? []).map(code).join(', ')),
    section('Deletion trigger', c.deletionTrigger ?? 'None: this is the platform pattern.'),
    `Contract: [${id}.json](../contracts/${id}.json)\n`,
  ].filter(Boolean).join('\n');
}

// ---- tokens.md from the built token values
const tokensJs = path.join(ROOT, 'packages/tokens/dist/tokens.js');
if (!fs.existsSync(tokensJs)) problems.push('packages/tokens/dist/tokens.js is missing: build the tokens first');
const { tokens = {}, themes = [], values = {} } = fs.existsSync(tokensJs) ? await import(pathToFileURL(tokensJs).href) : {};
const tokensMd = [
  '# Lue UI tokens\n',
  '> Every public design token, as a CSS custom property, with its value in each theme.\n',
  'Use the custom property, never the value: it follows the theme of the element it is used on (`data-theme` on any element, or the OS preferences). Import `@lue-ui/tokens/tokens.css` once. In JavaScript, `@lue-ui/tokens/tokens.js` exports the same references (`tokens`) and the literal values (`values`).\n',
  table(['Token', 'CSS', ...themes], Object.entries(tokens).map(([name, ref]) => [name, code(ref.slice(4, -1)), ...themes.map((t) => code(values[t]?.[name] ?? ''))])),
  '',
].join('\n');

// ---- llms.txt
const llms = [
  '# Lue UI\n',
  '> An open-source, accessibility-first design system built on the platform: native HTML elements and CSS in `@layer lue`, a few light-DOM custom elements, and React 19 adapters that render the same markup.\n',
  [
    '- Packages: `@lue-ui/tokens` (design tokens as CSS custom properties), `@lue-ui/css` (component CSS), `@lue-ui/elements` (custom elements and opt-in behaviours), `@lue-ui/react` (adapters). Not on npm yet.',
    '- Markup first: every component is native HTML plus a `lue-` class; variants are `data-*` attributes, state comes from native pseudo-classes and ARIA. The HTML in each page works without JavaScript unless it says otherwise.',
    '- No Shadow DOM, no portals, no runtime CSS-in-JS. Overlays use `<dialog>` and `popover` with invoker commands (`command`, `commandfor`).',
    '- Every component is tested with real keyboard input and axe in Chromium, Firefox and WebKit, in four themes (dark, light and their increased-contrast versions), with forced colours, reduced motion, 320 px reflow and right-to-left text.',
  ].join('\n'),
  '',
  '## Components\n',
  ids.map((id) => `- [${meta[id].title}](components/${id}.md): ${contracts[id].summary}`).join('\n'),
  '',
  '## Foundations\n',
  '- [Tokens](tokens.md): every token with its value in each theme',
  '- [Contracts](contracts/index.json): the machine-readable contracts every page is built from',
  '',
  '## Optional\n',
  '- [Everything in one file](llms-full.txt)',
  '',
].join('\n');

// ---- write
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'components'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'contracts'), { recursive: true });
const pages = ids.map((id) => [id, page(id)]);
for (const [id, md] of pages) fs.writeFileSync(path.join(OUT, 'components', `${id}.md`), md);
for (const id of ids) fs.copyFileSync(path.join(CONTRACTS, `${id}.json`), path.join(OUT, 'contracts', `${id}.json`));
fs.writeFileSync(path.join(OUT, 'contracts/index.json'), `${JSON.stringify(ids.map((id) => ({ id, name: contracts[id].name, summary: contracts[id].summary, status: contracts[id].status, url: `${id}.json` })), null, 2)}\n`);
fs.writeFileSync(path.join(OUT, 'tokens.md'), tokensMd);
fs.writeFileSync(path.join(OUT, 'tokens.json'), `${JSON.stringify({ themes, tokens: Object.fromEntries(Object.entries(tokens).map(([name, ref]) => [name, { css: ref.slice(4, -1), values: Object.fromEntries(themes.map((t) => [t, values[t]?.[name]])) }])) }, null, 2)}\n`);
fs.writeFileSync(path.join(OUT, 'llms.txt'), llms);
fs.writeFileSync(path.join(OUT, 'llms-full.txt'), [llms, tokensMd, ...pages.map(([, md]) => md)].join('\n---\n\n'));

for (const p of problems) console.error(`ai-docs: ${p}`);
const stories = Object.values(rendered).reduce((n, s) => n + s.length, 0);
console.log(`ai-docs: ${ids.length} pages, ${stories} stories rendered, ${Object.keys(tokens).length} tokens → apps/docs/public`);
process.exit(problems.length ? 1 : 0);
