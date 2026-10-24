# Lue UI docs

Storybook 10 (react-vite) for Lue UI ([RFC-0001 §1](../../docs/architecture/rfc-0001-architecture.md)). Private, like
every package.

```bash
pnpm --filter @lue-ui/docs dev     # http://localhost:6006
pnpm --filter @lue-ui/docs build   # storybook-static/
```

- **Stories** (`stories/`) render the React adapters, which render the HTML core's markup, with the real CSS:
  `@lue-ui/tokens/tokens.css` (build it first: `pnpm build`) and `packages/css/src/lue.css`. The toolbar sets
  `data-theme` (or "auto" for the OS) and the writing direction.
- **Every story is a test** ([ADR-0005](../../docs/architecture/adr/0005-three-engine-testing-and-a11y-gates.md)): the
  `storybook` Vitest project renders it in Chromium, Firefox and WebKit, runs its play function, and fails on any axe
  violation (`a11y.test: 'error'`). `pnpm test` runs it with everything else.
- **Contracts** (`contracts/<component>.json`) are the machine-readable accessibility contracts
  ([format](../../docs/design/components.md#contract-format)), validated against schema v1
  (`contracts/contract.schema.json`) by `pnpm check`. They're written by hand next to the keyboard tests in
  `tests/<component>/`.
- `.storybook/main.ts` and `tsconfig.json` point `@lue-ui/react` and `@lue-ui/elements` at their sources, as the tests
  do, so stories reflect edits without a build. The built packages are exercised by the Next fixture.
