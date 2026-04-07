# Gymmer Monorepo

Structure:

- apps/web: Next.js web app
- docs: project and contributor documentation

## Requirements

- Bun (recommended)
- Node.js (required by Next.js)

## Install (root)

```
bun install
```

This installs dependencies for the Gymmer web app using Bun workspaces.

## Run Gymmer

From the repo root:

```
bun run dev
```

Other useful commands:

```
bun run build
bun run start
bun run lint
bun run test
bun run test:run
bun run test:e2e
bun run docs:architecture
```

## Notes

- Gymmer is maintained as a web-only app in this repo.
- Environment files live in `apps/web` (e.g. `apps/web/.env.local`).
- You can still run commands directly inside `apps/web` if you prefer.

## Repo Context

- `AGENTS.md`: repo-level working rules and testing expectations
- `docs/agent-reference.md`: curated feature and architecture summary
- `docs/architecture-index.md`: generated repo map
- `docs/architecture-index.json`: generated machine-readable architecture index

## Documentation Rule

- Documentation is expected to ship with the code change, not later.
- Update the relevant docs whenever behavior, architecture, workflows, commands, routes, APIs, tests, or PWA behavior change.
- If repo structure changes, rerun `bun run docs:architecture`.
- If the system-level design changes in a durable way, add or update an ADR in `docs/adr/`.
