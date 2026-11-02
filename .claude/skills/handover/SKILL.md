---
name: handover
description: Bring Lue UI's status up to date at the end of a stretch of work - the maintainer's local HANDOVER.md (gitignored), the "Current state" in AGENTS.md, and the component inventory - and commit the public ones. Use when the user says to wrap up, update the handover, or before ending a session that changed what is built or decided.
---

# Update the handover

`HANDOVER.md` is the maintainer's local working notes between sessions. It is gitignored: never commit it, and never
copy its contents (private links, local paths, who asked for what) into a tracked file. The repository is public.

1. Read `git log` since the date at the top of `HANDOVER.md` (if there is one) to see what changed.
2. Update `HANDOVER.md`, creating it if it is missing: the date line at the top, "Where things stand", the current
   pass's section (strike done items with `~~...~~` and say what was found on the way), "Waiting on the user", and any
   new decision with its date. Dates are absolute (2026-11-01), never "today".
3. Update "Current state" in [AGENTS.md](AGENTS.md) only if the pass or the gates changed; keep it short, since every
   agent loads it. Write it for any contributor: what is true of the project, not who decided it.
4. Update the status line of [docs/design/components.md](docs/design/components.md) if what is built changed. The
   [README](README.md) is the project's front page: change it only when its component list, packages or commands
   change, and never put status, progress or milestones in it. A lasting decision goes in an ADR, not the handover.
5. Write a normal dash, never an em dash. Run `pnpm lint`.
6. Commit the public files as `docs: <what changed>` on `develop`. Don't push unless asked.
