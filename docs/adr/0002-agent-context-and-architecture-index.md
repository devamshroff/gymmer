# ADR 0002: Agent Context Uses Curated Docs Plus A Generated Architecture Index

- Status: Accepted
- Date: 2026-04-07

## Context
Hand-maintained architecture summaries are useful for onboarding, but they drift. Gymmer already had useful docs, but at least one planning document had fallen behind the actual PWA implementation. That made the repo context less trustworthy for future work.

## Decision
- Keep a short curated reference in `docs/agent-reference.md`.
- Generate the filesystem-backed inventory into:
  - `docs/architecture-index.md`
  - `docs/architecture-index.json`
- Refresh the generated index with `bun run docs:architecture` whenever route, API, library, component, or test structure changes.
- Reserve ADRs for decisions that are expensive to rediscover.

## Consequences
- Agents can start with a small curated summary, then fall through to a generated repo map when they need exact file locations.
- The JSON index provides a compact machine-readable cache for future tooling.
- Structure changes now have an explicit maintenance command instead of relying on memory.
