---
name: handover
description: Bring Lue UI's status documents up to date at the end of a stretch of work - HANDOVER.md, the "Current state" in AGENTS.md, the component inventory and the README roadmap - and commit them. Use when the user says to wrap up, update the handover, or before ending a session that changed what is built or decided.
---

# Update the handover

1. Read `git log` since the date at the top of [HANDOVER.md](HANDOVER.md) to see what changed.
2. Update [HANDOVER.md](HANDOVER.md): the date line at the top, "Where things stand", the current pass's section (strike
   done items with `~~...~~` and say what was found on the way), "Waiting on the user", and any new user decision in
   "Decisions made with the user" with its date. Dates are absolute (2026-11-01), never "today".
3. Update "Current state" in [AGENTS.md](AGENTS.md) only if the pass or the gates changed; keep it short, since every
   agent loads it.
4. Update the status line of [docs/design/components.md](docs/design/components.md) and the roadmap in
   [README.md](README.md) if what is built changed.
5. Write a normal dash, never an em dash. Run `pnpm lint`.
6. Commit as `docs: <what changed>` on `develop`. Don't push unless asked.
