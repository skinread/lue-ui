#!/usr/bin/env node
// Lue UI's MCP server (RFC-0001 §8): the component pages, contracts and tokens that tools/build-ai-docs.mjs writes,
// served to AI assistants over stdio (newline-delimited JSON-RPC 2.0, the MCP stdio transport). No dependencies.
//
//   Tools:     list_components · get_component { name, format? } · find_tokens { query, theme? }
//   Resources: lue-ui://llms.txt · lue-ui://tokens.md · lue-ui://components/<id>.md
//
// It reads the docs from LUE_UI_DOCS, or apps/docs/public in this repository (run `pnpm docs-ai` first).
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const DOCS = process.env.LUE_UI_DOCS ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../apps/docs/public');
const VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26'];
const read = (rel) => fs.readFileSync(path.join(DOCS, rel), 'utf8');

function catalogue() {
  const index = JSON.parse(read('contracts/index.json'));
  const title = (id) => read(`components/${id}.md`).match(/^# (.+)$/m)?.[1] ?? id;
  return index.map((c) => ({ id: c.id, title: title(c.id), name: c.name, summary: c.summary, status: c.status }));
}

/** A component by id ("radio-group"), contract name ("RadioGroup") or title ("Radio group"), any case. */
function find(name) {
  const key = String(name ?? '').toLowerCase().replace(/[\s_-]+/g, '');
  return catalogue().find((c) => [c.id, c.name, c.title].some((n) => n.toLowerCase().replace(/[\s_-]+/g, '') === key));
}

const TOOLS = [
  {
    name: 'list_components',
    title: 'List Lue UI components',
    description: 'Every Lue UI component with a one-line summary and status. Start here, then get_component.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
    run: () => catalogue().map((c) => `- ${c.title} (${c.id}, ${c.status}): ${c.summary}`).join('\n'),
  },
  {
    name: 'get_component',
    title: 'Get a Lue UI component',
    description:
      'How to use one component: the HTML a server renders, the React adapter and its props, the accessibility contract (roles, keyboard map, focus), anatomy, platform needs and tokens. format "contract" returns the raw JSON contract instead.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Component id, name or title, e.g. "radio-group", "RadioGroup" or "Radio group"' },
        format: { type: 'string', enum: ['markdown', 'contract'], default: 'markdown' },
      },
      required: ['name'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    run: ({ name, format = 'markdown' }) => {
      const component = find(name);
      if (!component) throw new Error(`No component called "${name}". Components: ${catalogue().map((c) => c.id).join(', ')}`);
      return format === 'contract' ? read(`contracts/${component.id}.json`) : read(`components/${component.id}.md`);
    },
  },
  {
    name: 'find_tokens',
    title: 'Find Lue UI design tokens',
    description:
      'Design tokens whose name or CSS custom property contains the query (e.g. "color.fg", "space", "radius"), with their value in each theme. Use the custom property in CSS, never the value.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Part of a token name or custom property; empty lists every token' },
        theme: { type: 'string', enum: ['dark', 'light', 'dark-more', 'light-more'], description: 'Only this theme\'s values' },
      },
      required: ['query'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    run: ({ query, theme }) => {
      const { themes, tokens } = JSON.parse(read('tokens.json'));
      const q = String(query).toLowerCase();
      const shown = theme ? [theme] : themes;
      const rows = Object.entries(tokens).filter(([name, t]) => name.includes(q) || t.css.includes(q));
      if (!rows.length) return `No tokens match "${query}".`;
      return rows.map(([name, t]) => `${t.css} (${name}): ${shown.map((th) => `${th} ${t.values[th]}`).join(' · ')}`).join('\n');
    },
  },
];

function resources() {
  return [
    { uri: 'lue-ui://llms.txt', name: 'llms.txt', title: 'Lue UI overview', mimeType: 'text/plain', file: 'llms.txt' },
    { uri: 'lue-ui://tokens.md', name: 'tokens.md', title: 'Lue UI tokens', mimeType: 'text/markdown', file: 'tokens.md' },
    ...catalogue().map((c) => ({ uri: `lue-ui://components/${c.id}.md`, name: `${c.id}.md`, title: c.title, description: c.summary, mimeType: 'text/markdown', file: `components/${c.id}.md` })),
  ];
}

const METHODS = {
  initialize: ({ protocolVersion }) => ({
    protocolVersion: VERSIONS.includes(protocolVersion) ? protocolVersion : VERSIONS[0],
    capabilities: { tools: {}, resources: {} },
    serverInfo: { name: 'lue-ui', title: 'Lue UI', version: '0.0.0' },
    instructions: 'Lue UI is a platform-native design system. Call list_components, then get_component for the HTML, React usage and accessibility contract; find_tokens for design tokens.',
  }),
  ping: () => ({}),
  'tools/list': () => ({ tools: TOOLS.map(({ run, ...tool }) => tool) }),
  'tools/call': ({ name, arguments: args = {} }) => {
    const tool = TOOLS.find((t) => t.name === name);
    if (!tool) throw Object.assign(new Error(`Unknown tool: ${name}`), { code: -32602 });
    try {
      return { content: [{ type: 'text', text: tool.run(args) }] };
    } catch (error) {
      return { content: [{ type: 'text', text: error.message }], isError: true };
    }
  },
  'resources/list': () => ({ resources: resources().map(({ file, ...r }) => r) }),
  'resources/read': ({ uri }) => {
    const resource = resources().find((r) => r.uri === uri);
    if (!resource) throw Object.assign(new Error(`Unknown resource: ${uri}`), { code: -32002 });
    return { contents: [{ uri, mimeType: resource.mimeType, text: read(resource.file) }] };
  },
};

const send = (message) => process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', ...message })}\n`);

readline.createInterface({ input: process.stdin }).on('line', (line) => {
  if (!line.trim()) return;
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return send({ id: null, error: { code: -32700, message: 'Parse error' } });
  }
  const { id, method, params = {} } = message;
  if (id === undefined) return; // a notification (notifications/initialized, cancelled): nothing to answer
  const handler = METHODS[method];
  if (!handler) return send({ id, error: { code: -32601, message: `Method not found: ${method}` } });
  try {
    send({ id, result: handler(params) });
  } catch (error) {
    send({ id, error: { code: error.code ?? -32603, message: error.message } });
  }
});
