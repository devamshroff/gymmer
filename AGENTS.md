# AGENTS.md

This repo is the Gymmer monorepo. Read this first before making changes.

## Project Context (Short)
Gymmer helps track workout progress, build routines, and flow through them. It started as a personal tool and is now used by friends, so reliability and correctness matter a lot.

## Product Focus
- Gymmer is a web-only product.
- `apps/web` is the source of truth and the only supported surface.

## Primary App
- `apps/web` (Next.js)
- Environment files live in `apps/web` (see `.env.example` and `.env.local`).

## Commands (from repo root)
- Install: `bun install`
- Dev: `bun run dev`
- Build: `bun run build`
- Start: `bun run start`
- Lint: `bun run lint`
- Unit tests: `bun run test`
- Unit tests (run): `bun run test:run`
- E2E tests: `bun run test:e2e`
- Refresh architecture index: `bun run docs:architecture`

## Fast Context
Read in this order before substantial work:
1. `AGENTS.md`
2. `docs/agent-reference.md`
3. `docs/architecture-index.md`

Notes:
- `docs/agent-reference.md` is the curated summary.
- `docs/architecture-index.md` and `docs/architecture-index.json` are generated from the filesystem.
- If route/API/lib/component/test structure changes, rerun `bun run docs:architecture`.

## Documentation Maintenance
- Documentation updates are part of the definition of done.
- Any change to user-facing behavior, developer workflow, architecture, routing, APIs, storage, testing, or PWA behavior must update the relevant docs in the same change.
- Do not leave doc updates for a follow-up unless the user explicitly asks for that tradeoff.
- If route/API/lib/component/test structure changes, rerun `bun run docs:architecture` and commit the regenerated files.
- If the change alters the curated understanding of the system, update `docs/agent-reference.md`.
- If the change affects setup, commands, or contributor workflow, update `README.md` and this file when relevant.
- If the change makes or supersedes a durable architectural decision, add or update an ADR under `docs/adr/`.
- If no documentation changes are needed, explicitly verify that before considering the work done.

## Change Checklist (Must Follow)
1) Scope: identify the user-facing behavior and affected modules.
2) Tests:
   - New feature: add tests.
   - Change existing feature: update tests.
   - Run **both** unit tests and E2E tests for any change.
3) Correctness: if something fails to compile or a test breaks, pause and ask:
   - Am I applying a bandaid to a deeper design issue?
   - Does this actually need to be nullable/optional?
   - Is the design itself wrong?
4) Quality bar: think like a principal developer. Step back and re-check the design before shipping.
5) Documentation:
   - Update all relevant docs in the same change.
   - Regenerate `docs/architecture-index.*` when structure changes.
   - Do not mark work complete with stale docs.

## Notes for Assistants
- Prefer existing patterns in `apps/web`.
- Keep changes minimal and reversible.
- Assume changes are for the web app unless the user explicitly asks for another surface.
