// PostToolUse hook: runs tools/check-text.mjs on the file Claude just wrote, so an em dash or an escaped dash is caught
// at the edit rather than at `pnpm lint`. Exit 2 hands the message back to Claude to fix.
import { spawnSync } from 'node:child_process';

let input = '';
for await (const chunk of process.stdin) input += chunk;
const file = JSON.parse(input).tool_input?.file_path;
if (!file) process.exit(0);
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const result = spawnSync('node', ['tools/check-text.mjs', file], { cwd: root, encoding: 'utf8' });
if (result.status === 0) process.exit(0);
process.stderr.write(result.stderr);
process.exit(2);
