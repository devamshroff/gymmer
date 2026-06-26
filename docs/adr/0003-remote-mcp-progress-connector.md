# ADR 0003: Remote MCP Progress Connector

## Status
Accepted

## Context
Gymmer needs a way for Claude to understand a user's workout progress without manually exporting data. Claude custom connectors use remote MCP over HTTPS and do not support user-pasted static bearer tokens for connector authentication. Gymmer's existing app already owns auth, user identity, and Turso/libSQL access from `apps/web`.

## Decision
Implement the remote MCP server inside `apps/web` as a Next.js API route at `/api/mcp`.

The connector uses:

- Streamable HTTP MCP transport through the Vercel-compatible MCP handler.
- OAuth authorization-code flow with PKCE and dynamic client registration.
- OAuth discovery metadata under `/.well-known/*`.
- User-scoped opaque access and refresh tokens stored in `mcp_oauth_*` tables.
- Bounded, structured progress tools instead of raw database dumps.
- A separate `gymmer:write` OAuth scope for mutating tools.

The workout tool surface is:

- `get_progress_summary`
- `list_workout_sessions`
- `get_workout_session`
- `get_exercise_progress`
- `get_routines_snapshot`
- `create_workout_session`

`create_workout_session` creates a completed free-workout session through the same shared save helper as `/api/save-workout`. It does not insert workout rows through a separate MCP-only write path.

## Consequences
Claude can connect to Gymmer through a standard remote MCP custom connector without static API keys. The server remains part of the web app, so it can reuse the existing Turso/libSQL data layer and deployment pipeline.

The MCP endpoint should run on Vercel or another always-reachable HTTPS runtime. Render free-tier cold starts are acceptable for casual web use but are a poor fit for remote MCP clients that expect prompt server discovery, OAuth redirects, and tool calls.

The connector is read-mostly. Write-capable tools are limited to authenticated users with `gymmer:write` and should reuse the same service/helper code paths as the app UI whenever possible, so MCP-created records do not diverge from app-created records.
