# Lue UI docs

Storybook 10 (react-vite) for Lue UI ([RFC-0001 §1](../../docs/architecture/rfc-0001-architecture.md)). Private, like
every package.

```bash
pnpm --filter @lue-ui/docs dev     # http://localhost:6006, and its MCP server at /mcp
pnpm --filter @lue-ui/docs build   # storybook-static/ (writes public/ first: llms.txt, the component pages and guidelines)
```

**Published** at <https://skinread.github.io/lue-ui/> by the
[Storybook to GitHub Pages](../../.github/workflows/storybook-pages.yml) workflow, run by hand from the Actions tab
("Run workflow", pick the branch). It builds the packages, then this Storybook, and deploys `storybook-static`; the AI
docs are served beside it (`/lue-ui/llms.txt`). Later it becomes a step of package publishing.

It needs Settings → Pages → Source set to **GitHub Actions** ("Deploy from a branch" publishes only the README), and
the workflow on the default branch (`develop`), which is where GitHub looks for workflows you can run by hand.

- **Docs pages** (`.storybook/docs-page.tsx`, autodocs for every story file): the React adapter's description, live
  example and props, "When to use it" from its contract, the HTML its first example renders on the server, every
  example, and links to its guidelines, contract and Markdown page. Props come from **react-docgen**, which reads the
  JSDoc on each adapter's own props (react-docgen-typescript needs the TypeScript compiler API, which TypeScript 7
  doesn't ship); `subcomponents` give each part its own tab, and an `argTypesEnhancer` shows optional props without
  `| undefined`. Components with fixed ids or overlays render their examples in frames
  (`parameters.docs.story.inline: false`), so ids don't clash on the page.
- **MCP** ([`@storybook/addon-mcp`](https://storybook.js.org/docs/ai/mcp/overview)): the dev server answers MCP at
  `/mcp` (story-writing instructions, previews, the components' docs, story tests), and `storybook build` writes
  `manifests/components.json`, so the published Storybook can be composed into another Storybook's MCP server. The
  repository's `.mcp.json` registers it as `lue-ui-storybook`.
- **Stories** (`stories/`) render the React adapters, which render the HTML core's markup, with the real CSS:
  `@lue-ui/tokens/tokens.css` (build it first: `pnpm build`) and `packages/css/src/lue.css`. The toolbar sets
  `data-theme` (or "auto" for the OS) and the writing direction.
- **Every story is a test** ([ADR-0005](../../docs/architecture/adr/0005-three-engine-testing-and-a11y-gates.md)): the
  `storybook` Vitest project renders it in Chromium, Firefox and WebKit, runs its play function, and fails on any axe
  violation (`a11y.test: 'error'`). `pnpm test` runs it with everything else.
- **Contracts** (`contracts/<component>.json`) are the machine-readable accessibility contracts
  ([format](../../docs/design/components.md#contract-format)), validated against schema v1
  (`contracts/contract.schema.json`) by `pnpm check`. They're written by hand next to the keyboard tests in
  `tests/<component>/`, and their `guidance` (what it's for, what to use instead, content) becomes the component's
  guidelines (`public/guidelines/<id>.md`).
- `.storybook/main.ts` and `tsconfig.json` point `@lue-ui/react` and `@lue-ui/elements` at their sources, as the tests
  do, so stories reflect edits without a build. The built packages are exercised by the Next fixture.
