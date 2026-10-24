// The MCP server (packages/mcp) speaks MCP over stdio: initialize, then tools and resources from the generated docs
// (pnpm docs-ai writes them; pnpm check and pnpm test run it first).
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import fs from 'node:fs';
import readline from 'node:readline';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let server: ChildProcessWithoutNullStreams;
let next = 1;
const pending = new Map<number, (message: Record<string, unknown>) => void>();
const call = (method: string, params: Record<string, unknown> = {}): Promise<Record<string, any>> =>
  new Promise((resolve) => {
    const id = next++;
    pending.set(id, resolve);
    server.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
  });
const text = async (name: string, args: Record<string, unknown>) => (await call('tools/call', { name, arguments: args })).result;

beforeAll(async () => {
  server = spawn(process.execPath, ['packages/mcp/server.js']);
  readline.createInterface({ input: server.stdout }).on('line', (line) => {
    const message = JSON.parse(line);
    pending.get(message.id)?.(message);
  });
  const init = await call('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '0' } });
  expect(init.result.protocolVersion).toBe('2025-06-18');
  server.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })}\n`);
});
afterAll(() => {
  server.kill();
});

describe('MCP server', () => {
  it('offers its tools with input schemas', async () => {
    const { result } = await call('tools/list');
    expect(result.tools.map((t: { name: string }) => t.name)).toEqual(['list_components', 'get_component', 'find_tokens']);
    for (const tool of result.tools) expect(tool.inputSchema.type).toBe('object');
  });

  it('lists every component', async () => {
    const result = await text('list_components', {});
    expect(result.content[0].text).toContain('- Radio group (radio-group, experimental):');
    const contracts = fs.readdirSync('apps/docs/contracts').filter((f) => f.endsWith('.json') && f !== 'contract.schema.json');
    expect(result.content[0].text.split('\n')).toHaveLength(contracts.length);
  });

  it('gets a component by id, name or title, as Markdown or as its contract', async () => {
    for (const name of ['radio-group', 'RadioGroup', 'radio group']) {
      expect((await text('get_component', { name })).content[0].text).toMatch(/^# Radio group\n/);
    }
    const contract = JSON.parse((await text('get_component', { name: 'toast', format: 'contract' })).content[0].text);
    expect(contract.name).toBe('Toast');
  });

  it('says which components exist when one is unknown', async () => {
    const result = await text('get_component', { name: 'marquee' });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('accordion');
  });

  it('finds tokens with their values', async () => {
    const all = (await text('find_tokens', { query: 'color.fg.accent' })).content[0].text;
    expect(all).toMatch(/^--lue-color-fg-accent \(color\.fg\.accent\): dark .+ · light .+ · dark-more .+ · light-more .+/);
    const dark = (await text('find_tokens', { query: 'radius.m', theme: 'dark' })).content[0].text;
    expect(dark).toBe('--lue-radius-m (radius.m): dark 20px');
  });

  it('serves llms.txt and each page as resources', async () => {
    const { result } = await call('resources/list');
    expect(result.resources.map((r: { uri: string }) => r.uri)).toContain('lue-ui://components/toast.md');
    const read = await call('resources/read', { uri: 'lue-ui://llms.txt' });
    expect(read.result.contents[0].text).toMatch(/^# Lue UI\n/);
  });

  it('answers unknown methods with a JSON-RPC error', async () => {
    expect((await call('sampling/createMessage')).error.code).toBe(-32601);
  });
});
