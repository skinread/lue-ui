// Checks every component contract in apps/docs/contracts (RFC-0001 §6): it matches contract.schema.json, every token
// it names exists in the built tokens.css, every class in its anatomy exists in packages/css/src, the component has
// its browser tests (tests/<name>/) and stories, and those tests press every key its keyboard map names. Run by `pnpm check`, after the token build.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'apps/docs/contracts');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const schema = JSON.parse(read('apps/docs/contracts/contract.schema.json'));
const validate = new Ajv({ allErrors: true, strict: false }).compile(schema);

const tokensCss = read('packages/tokens/dist/tokens.css');
const cssDir = path.join(ROOT, 'packages/css/src');
const css = fs.readdirSync(cssDir, { recursive: true }).filter((f) => f.endsWith('.css')).map((f) => fs.readFileSync(path.join(cssDir, f), 'utf8')).join('\n');

/** Every styled class named in an anatomy part or its children (`hook` parts are found by scripts, not styled). */
function classes(node, out = new Set()) {
  if (Array.isArray(node)) node.forEach((n) => classes(n, out));
  else if (node && typeof node === 'object') {
    if (typeof node.class === 'string' && !node.hook) node.class.split('|').forEach((c) => out.add(c));
    Object.values(node).forEach((v) => classes(v, out));
  }
  return out;
}

// Contracts → tests (RFC-0001 §6): each key a contract's keyboard map names must be pressed, with real input, in the
// component's tests (tests/<name>/, or any test file that names its contract). Descriptive entries ("typing", "a
// printable character") aren't key names and aren't checked.
const PRESSED = {
  Tab: /\btab\(\)|\{Tab\}/,
  'Shift+Tab': /\bshiftTab\(\)|\{Shift>\}[^']*\{Tab\}/,
  Enter: /\{Enter\}/,
  Space: /keyboard\(' '\)|\{Space\}/,
  Escape: /\{Escape\}/,
  ArrowDown: /\{ArrowDown\}/,
  ArrowUp: /\{ArrowUp\}/,
  ArrowLeft: /\{ArrowLeft\}/,
  ArrowRight: /\{ArrowRight\}/,
  Home: /\{Home\}/,
  End: /\{End\}/,
  PageUp: /\{PageUp\}/,
  PageDown: /\{PageDown\}/,
  'Alt+ArrowDown': /\{Alt>\}\{ArrowDown\}/,
};
const testsDir = path.join(ROOT, 'tests');
const testFiles = fs.readdirSync(testsDir, { recursive: true }).filter((f) => /\.tsx?$/.test(f) && fs.statSync(path.join(testsDir, f)).isFile()).map((f) => ({ file: f, source: fs.readFileSync(path.join(testsDir, f), 'utf8') }));

const problems = [];
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json') && f !== 'contract.schema.json');
for (const file of files) {
  const contract = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
  const id = file.replace(/\.json$/, '');
  if (!validate(contract)) for (const e of validate.errors) problems.push(`${file}: ${e.instancePath || '/'} ${e.message}`);
  if (contract.name?.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() !== id) problems.push(`${file}: name "${contract.name}" doesn't match the file name`);
  for (const token of contract.tokens ?? []) {
    if (!tokensCss.includes(`${token}:`)) problems.push(`${file}: token ${token} isn't in tokens.css`);
  }
  for (const c of classes(contract.anatomy)) {
    if (!new RegExp(`\\.${c}(?![\\w-])`).test(css)) problems.push(`${file}: class .${c} isn't in packages/css/src`);
  }
  if (!fs.existsSync(path.join(ROOT, 'tests', id))) problems.push(`${file}: no browser tests in tests/${id}/`);
  if (!fs.existsSync(path.join(ROOT, 'apps/docs/stories', `${id}.stories.tsx`))) problems.push(`${file}: no stories in apps/docs/stories/${id}.stories.tsx`);
  const own = testFiles.filter((t) => t.file.startsWith(`${id}${path.sep}`) || t.source.includes(`apps/docs/contracts/${id}.json`)).map((t) => t.source).join('\n');
  for (const key of new Set((contract.a11y?.keyboard ?? []).flatMap((entry) => entry.keys))) {
    if (PRESSED[key] && !PRESSED[key].test(own)) problems.push(`${file}: the keyboard map names ${key}, but no test presses it`);
  }
}
for (const p of problems) console.error(`contracts: ${p}`);
console.log(`${files.length} contracts · ${problems.length} problems`);
process.exit(problems.length ? 1 : 0);
