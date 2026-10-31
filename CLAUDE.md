# Claude Code guide for Lue UI

@AGENTS.md

The guide above is shared by every agent. This file adds only what is specific to Claude Code.

## Start of a session

Read [HANDOVER.md](HANDOVER.md) before anything else: current state, decisions, what is waiting on the user.

## What `.claude/` sets up

- **Permissions** ([settings.json](.claude/settings.json)): the `pnpm` gates, read-only git and both MCP servers run
  without asking. `git push`, publishing (`pnpm publish`, `changeset publish`) and changing the GitHub repo or its
  releases always ask, whatever mode the session is in. Personal overrides go in `.claude/settings.local.json`
  (gitignored).
- **Hooks:** every Edit or Write runs `tools/check-text.mjs` on that file, so an em dash is caught at the edit, not at
  `pnpm lint`. In a cloud session, `SessionStart` runs `pnpm install`.
- **Skills:** `/new-component` (the checklist a component needs before `pnpm check` passes) and `/handover` (bring
  HANDOVER.md, AGENTS.md and the inventory up to date at the end of a stretch of work).
- **Agents:** `a11y-reviewer` reviews a component against its contract and the accessibility non-negotiables,
  read-only. Use it before calling a component done.

## MCP servers

Registered in [.mcp.json](.mcp.json) and enabled for the project in `.claude/settings.json`:

| Server | What it is for | Needs |
| --- | --- | --- |
| `lue-ui` | Components, guidelines, contracts and tokens (`list_components`, `get_component`, `find_tokens`) | `pnpm docs-ai` once, so `apps/docs/public` exists |
| `lue-ui-storybook` | Stories, previews and story tests from `@storybook/addon-mcp` | `pnpm --filter @lue-ui/docs dev` running (port 6006) |

Prefer these over reading `apps/docs/public` or the contracts by hand. A failed `lue-ui-storybook` connection just
means Storybook isn't running.

### Adding an MCP server

1. Add it to `.mcp.json` when the whole team should have it; a personal one goes in your user config
   (`claude mcp add --scope user`).
2. Never commit a secret. Reference it as `${VAR}` in `.mcp.json` (Claude Code expands environment variables there)
   and say in the table above which variable it needs.
3. Add its name to `enabledMcpjsonServers` and, if its tools are read-only, `mcp__<name>` to `permissions.allow` in
   `.claude/settings.json`. Leave tools that write, publish or share on ask.
4. Add a row to the table above, and to [packages/mcp/README.md](packages/mcp/README.md) or the README's agent section
   if consumers will use it too.

### Design tools and privacy

**The Claude Design canvas and the Claude Design System stay private (user's rule, 2026-10-05).** No design MCP may
share, publish or change the visibility of either, or copy their content anywhere public or organisation-wide. Design
tools follow the same flow as before: Claude proposes, the user art-directs, the result is codified in the token source
(`packages/tokens/src`) and the contracts, where the contrast and material gates check it. `/design-sync` is a skill
the user starts; don't call the DesignSync tool outside it.

## Running things from the Claude app on a Mac

- If a browser fails to launch in `pnpm test`, set `TMPDIR` to the session's scratchpad.
- Firefox can't start from the Claude app on macOS; run `pnpm test:engines` or rely on CI for it.
- Long runs (`pnpm test`, `pnpm test:engines`) go in the background.
