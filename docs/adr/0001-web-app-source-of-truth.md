# ADR 0001: Web App Is The Source Of Truth

- Status: Accepted
- Date: 2026-04-07

## Context
Gymmer previously had enough repo shape ambiguity that an agent could waste time exploring surfaces that are not actually supported. The product direction is clearer now: Gymmer is a web product, and the monorepo exists to support that app.

## Decision
- `apps/web` is the only supported product surface.
- Next.js App Router in `apps/web/app` is the user-facing shell.
- API route handlers under `apps/web/app/api` remain the server boundary for the web app.
- New work should default to the web app unless a request explicitly says otherwise.

## Consequences
- Repo context and architecture docs should optimize for `apps/web`.
- Tests and generated indexes should treat `apps/web` as the primary inventory root.
- Future expansion to another surface should require a new ADR rather than quietly spreading logic across the repo.
