#!/bin/sh
# SessionStart hook: in a Claude Code cloud session, install dependencies so `pnpm check` works straight away.
# Local sessions already have node_modules, so this does nothing there.
[ "$CLAUDE_CODE_REMOTE" = "true" ] || exit 0
cd "$CLAUDE_PROJECT_DIR" && pnpm install --frozen-lockfile >/dev/null 2>&1 || echo "pnpm install failed; run it by hand" >&2
exit 0
