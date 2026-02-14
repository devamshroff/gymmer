# AGENTS.md

This repo is the Gymmer monorepo. Read this first before making changes.

## Project Context (Short)
Gymmer helps track workout progress, build routines, and flow through them. It started as a personal tool and is now used by friends, so reliability and correctness matter a lot.

## Product Focus
- Web app is the source of truth and the only actively supported surface.
- iOS was started but abandoned. New features and fixes are **web-only** unless explicitly requested.

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

## Notes for Assistants
- Prefer existing patterns in `apps/web`.
- Keep changes minimal and reversible.
- Assume changes are only for web and not ios, unless user explicitly states otherwise.
