# ADR-0006: MIT licence and open governance

- **Status:** Accepted (licence) · Proposed (governance details)
- **Date:** 2026-10-05
- **Principles:** value: open by default · 3 standards over invention · 11 distinctive, not decorative

## Context

The project is open source from day one. The repository already contains an MIT licence (© 2026 Sean Kinread). We
need rules for what may enter the project (fonts, icons, code) and how decisions are made, so the system stays
coherent as contributors arrive.

## Decision

1. **Licence: MIT** for code and documentation, as in [LICENSE](../../../LICENSE). Contributions are accepted under the
   same licence (inbound = outbound); no CLA.
2. **Third-party assets must be open-licensed and self-hostable:** fonts under the SIL Open Font License; icons under
   MIT, ISC or similar. Every asset's licence is recorded next to it.
3. **Decision process:** significant changes start as an RFC in `docs/architecture/`; accepted outcomes are recorded
   as ADRs. Both are public.
4. **Roles (initial):** a lead maintainer (Sean Kinread) approves RFCs and releases; maintainers are added as the
   project grows. Governance is revisited at 1.0.
5. **Component maturity:** **Proposal → Experimental → Candidate → Stable.** Stable requires a contract, the full gate
   set ([ADR-0005](./0005-three-engine-testing-and-a11y-gates.md)), docs, and a Claude Design preview rendered from
   production CSS.
6. **Community files with the first code:** `CONTRIBUTING.md`, a code of conduct (Contributor Covenant 2.1), an
   accessibility statement and `SECURITY.md`.

## Consequences

- **Positive:** the simplest licence for adopters; clear asset rules protect the project's ability to ship fonts and
  icons; a visible, lightweight decision trail.
- **Negative:** MIT has no explicit patent grant (Apache-2.0 does); a single lead maintainer is a bus-factor risk
  until more maintainers join.

## Alternatives considered

- **Apache-2.0.** Explicit patent grant, but heavier notice requirements and less familiar to front-end adopters.
- **MPL-2.0.** File-level copyleft creates friction for commercial adopters.
