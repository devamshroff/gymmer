# Gymmer Overview

## Summary
Gymmer is a workout tracking app for building routines and flowing through them during workouts. It began as a personal tool and is now used by friends, so stability and correctness are important.

## Status and Focus
- Gymmer is a web-only product.
- The web app is the source of truth and the only supported surface.

## Repo Structure (High-Level)
- `apps/web`: Next.js web app
- `docs/*`: project and contributor documentation

## Fast Context
- Start with `AGENTS.md` for repo rules and testing expectations.
- Use `docs/agent-reference.md` for the curated architecture summary.
- Use `docs/architecture-index.md` or `docs/architecture-index.json` for the generated route/API/component/library/test inventory.
- Refresh the generated index with `bun run docs:architecture` after structural changes.

## Documentation Rule
- Relevant docs must be updated in the same change as the code or behavior change.
- Structural changes require regenerating `docs/architecture-index.md` and `docs/architecture-index.json`.
- Durable architecture decisions belong in `docs/adr/`.

## Build + Run
See `README.md` for commands. The project uses Bun for install, dev, and build.

## Testing Expectations
Any change requires running both unit and E2E tests. New features must add tests; changes to existing features must update tests.

## Design Mindset
If a test fails or something doesn’t compile, avoid quick patches. Step back and verify whether the design should change (e.g., unnecessary nullability or optionality). Aim for durable, principled fixes.
