# Lue UI MCP server

An [MCP](https://modelcontextprotocol.io) server that gives AI assistants Lue UI's component pages, contracts and
tokens (RFC-0001 §8). It speaks MCP over stdio, has no dependencies, and reads what `tools/build-ai-docs.mjs` writes to
`apps/docs/public`. Private for now.

| Tool | What it returns |
| --- | --- |
| `list_components` | Every component with its one-line summary and status |
| `get_component { name, format? }` | One component's page: the HTML a server renders, the React adapter, the accessibility contract (keyboard map, focus, states), anatomy, platform needs and tokens. `format: "contract"` returns the JSON contract |
| `find_tokens { query, theme? }` | Tokens whose name or custom property contains the query, with their value in each theme |

Resources: `lue-ui://llms.txt`, `lue-ui://tokens.md` and `lue-ui://components/<id>.md`.

## Use it from this repository

```bash
pnpm docs-ai                      # writes apps/docs/public
claude mcp add lue-ui -- node packages/mcp/server.js
```

Any MCP client works the same way: run `node packages/mcp/server.js`. Set `LUE_UI_DOCS` to read the docs from
elsewhere. Tested by `tests/tools/mcp.test.ts` (`pnpm check`).
