// Assembles the Claude Design kit (RFC-0001 §8) for Spike C and /design-sync: one folder per component with its
// guidelines (README.md, generated from the contract by tools/build-ai-docs.mjs) and a live preview (preview.html: every
// story's server-rendered HTML, on bundle.css = tokens + fonts + @lue-ui/css, and bundle.js = the elements IIFE, which
// defines window.LueUI). No React: Claude Design renders the production CSS and elements.
//
// Writes tools/directions/out/claude-design-kit/ (gitignored). The Claude Design System is private (user's rule,
// 2026-10-05): this only builds files locally; uploading them is /design-sync's job, which the user starts.
// Run with `pnpm design-kit` (it builds the packages and the AI docs first).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tools/directions/out/claude-design-kit');
const DOCS = path.join(ROOT, 'apps/docs/public');
const STORIES = path.join(ROOT, 'node_modules/.cache/lue-ui/stories.mjs');
const need = {
  tokens: path.join(ROOT, 'packages/tokens/dist/tokens.css'),
  fonts: path.join(ROOT, 'packages/css/dist/fonts.css'),
  css: path.join(ROOT, 'packages/css/dist/lue.css'),
  js: path.join(ROOT, 'packages/elements/dist/lue.iife.js'),
  stories: STORIES,
  guidelines: path.join(DOCS, 'guidelines'),
};
const missing = Object.entries(need).filter(([, file]) => !fs.existsSync(file)).map(([name]) => name);
if (missing.length) {
  console.error(`design-kit: missing ${missing.join(', ')}; run \`pnpm build && pnpm docs-ai\` first`);
  process.exit(1);
}

const rendered = (await import(pathToFileURL(STORIES).href)).default;
const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'components'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'bundle.css'), [need.tokens, need.fonts, need.css].map((f) => fs.readFileSync(f, 'utf8')).join('\n'));
fs.cpSync(path.join(ROOT, 'packages/css/dist/fonts'), path.join(OUT, 'fonts'), { recursive: true });
fs.copyFileSync(need.js, path.join(OUT, 'bundle.js'));

const problems = [];
const written = [];
for (const id of Object.keys(rendered).sort()) {
  const readme = fs.readFileSync(path.join(DOCS, 'guidelines', `${id}.md`), 'utf8')
    // The kit has no reference pages or contracts beside it.
    .replace(/\n+Reference: .*\n?$/, '\n');
  const title = readme.match(/^# (.+)$/m)?.[1] ?? id;
  const folder = title.replace(/(?:^|\s)(\w)/g, (_, c) => c.toUpperCase());
  // Stories that only add a play function render the same markup as one before them: show each once. A story whose
  // ids are already on the page is left out too (they'd clash: tabs and menus find their parts by id).
  const seen = new Set();
  const ids = new Set();
  const stories = rendered[id].filter((s) => {
    if (!s.html || seen.has(s.html)) return false;
    seen.add(s.html);
    const own = [...s.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    if (own.some((i) => ids.has(i))) return false;
    for (const i of own) ids.add(i);
    return true;
  });
  if (!stories.length) problems.push(`${id}: no story rendered`);
  const sections = stories.map((s) => `<section class="kit-example" aria-labelledby="${id}-${s.name}">
<h2 class="kit-label" id="${id}-${s.name}">${escape(s.name.replace(/([a-z])([A-Z])/g, '$1 $2'))}</h2>
${s.html}
</section>`).join('\n');
  const preview = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)} - Lue UI</title>
<link rel="stylesheet" href="../../bundle.css">
<style>
  body { margin: 0; padding: 24px; }
  .kit-example { display: grid; gap: 12px; padding-block: 16px; border-block-end: 1px solid var(--lue-color-border-subtle); }
  .kit-label { margin: 0; font: var(--lue-text-caption, 500 0.75rem/1.4 var(--lue-font-family-mono)); color: var(--lue-color-fg-muted); text-transform: uppercase; letter-spacing: 0.08em; }
</style>
<script src="../../bundle.js" defer></script>
</head>
<body>
<main>
${sections}
</main>
</body>
</html>
`;
  fs.mkdirSync(path.join(OUT, 'components', folder), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'components', folder, 'README.md'), readme);
  fs.writeFileSync(path.join(OUT, 'components', folder, 'preview.html'), preview);
  written.push(folder);
}

for (const p of problems) console.error(`design-kit: ${p}`);
console.log(`design-kit: ${written.length} components → ${path.relative(ROOT, OUT)} (bundle.css, bundle.js, fonts/, components/<Name>/README.md and preview.html)`);
process.exit(problems.length ? 1 : 0);
