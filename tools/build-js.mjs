// Builds a JS package (RFC-0001 §9): `node tools/build-js.mjs <elements|react>`.
//   1. tsc compiles every source file to its own ESM file plus a .d.ts (isolated declarations), so 'use client'
//      directives survive and consumers' bundlers can tree-shake;
//   2. for elements, esbuild bundles dist/lue.iife.js (window.LueUI);
//   3. checks that every source file starting with 'use client' still does after compiling;
//   4. fails when a budget is passed (Brotli, minified): one element 2 KB, all elements 8 KB, one React adapter 1 KB.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
const PKG = path.join(ROOT, 'packages', name);
const SRC = path.join(PKG, 'src');
const DIST = path.join(PKG, 'dist');
const KB = 1024;
const { build } = await import(path.join(ROOT, 'packages/elements/node_modules/esbuild/lib/main.js'));

fs.rmSync(DIST, { recursive: true, force: true });
execFileSync(path.join(ROOT, 'node_modules/.bin/tsc'), ['-p', path.join(PKG, 'tsconfig.build.json')], { stdio: 'inherit' });

const problems = [];
const sources = fs.readdirSync(SRC, { recursive: true }).filter((f) => /\.tsx?$/.test(f) && !/\.(test|stories)\./.test(f));
for (const file of sources) {
  if (!/^['"]use client['"]/.test(fs.readFileSync(path.join(SRC, file), 'utf8'))) continue;
  const out = path.join(DIST, file.replace(/\.tsx?$/, '.js'));
  if (!/^['"]use client['"]/.test(fs.readFileSync(out, 'utf8'))) problems.push(`${file}: 'use client' was lost`);
}

/** Minified, bundled and Brotli-compressed size of an entry, with the given packages left external. */
async function size(entry, external = []) {
  const result = await build({ entryPoints: [entry], bundle: true, write: false, minify: true, format: 'esm', target: 'es2024', external, logLevel: 'silent' });
  return zlib.brotliCompressSync(result.outputFiles[0].contents).length;
}
const report = (label, bytes, budget) => {
  console.log(`  ${label.padEnd(26)} ${(bytes / KB).toFixed(2)} KB (budget ${budget / KB} KB)`);
  if (bytes > budget) problems.push(`${label} is ${(bytes / KB).toFixed(2)} KB, over ${budget / KB} KB`);
};

if (name === 'elements') {
  await build({
    // From dist, where package.json's sideEffects names the define files (from src they'd be tree-shaken away).
    entryPoints: [path.join(DIST, 'iife.js')],
    bundle: true,
    minify: true,
    format: 'iife',
    globalName: 'LueUI',
    target: 'es2024',
    outfile: path.join(DIST, 'lue.iife.js'),
    logLevel: 'warning',
  });
  const iife = fs.readFileSync(path.join(DIST, 'lue.iife.js'), 'utf8');
  for (const tag of ['lue-menu']) if (!iife.includes(`"${tag}"`)) problems.push(`lue.iife.js doesn't define <${tag}>`);
  for (const f of fs.readdirSync(path.join(DIST, 'define')).filter((f) => f.endsWith('.js'))) {
    report(`define/${f}`, await size(path.join(DIST, 'define', f)), 2 * KB);
  }
  report('lue.iife.js (all)', zlib.brotliCompressSync(fs.readFileSync(path.join(DIST, 'lue.iife.js'))).length, 8 * KB);
}
if (name === 'react') {
  const external = ['react', 'react/*', 'react-dom', 'react-dom/*', '@lue-ui/elements', '@lue-ui/elements/*'];
  for (const dir of fs.readdirSync(DIST, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    report(`${dir.name}/index.js`, await size(path.join(DIST, dir.name, 'index.js'), external), 1 * KB);
  }
}

for (const p of problems) console.error(`build-js: ${p}`);
process.exit(problems.length ? 1 : 0);
