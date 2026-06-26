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
- Nightly activity reminders use Web Push. Gymmer accepts the Tether-style `VAPID_*` keys, or `WEB_PUSH_*` aliases, plus `CRON_SECRET`; the production scheduler is a daily 10 PM America/New_York cron-job.org job.

## Remote MCP Connector

Gymmer exposes a read-only remote MCP endpoint at `/api/mcp` for Claude/custom connectors. It uses OAuth discovery and authorization-code tokens, not static bearer tokens.

Claude connector URL:

```
https://gymmer-liard.vercel.app/api/mcp
```

The endpoint reads from the existing Turso/libSQL database and creates `mcp_oauth_*` tables automatically for OAuth clients, authorization codes, and tokens. The production Vercel project is linked from `apps/web`; use `bunx vercel --prod --yes` there for production deploys. `temple-liard.vercel.app` currently redirects to `gymmer-liard.vercel.app` until the Google OAuth client allows the Temple callback URL.

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
