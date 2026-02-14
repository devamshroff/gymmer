# Gymmer Overview

## Summary
Gymmer is a workout tracking app for building routines and flowing through them during workouts. It began as a personal tool and is now used by friends, so stability and correctness are important.

## Status and Focus
- The web app is the source of truth and the only actively supported surface.
- The iOS app was started but abandoned; new features and fixes are **web-only** unless explicitly requested.

## Repo Structure (High-Level)
- `apps/web`: Next.js web app (primary)
- `apps/ios`: iOS app (abandoned)
- `docs/ios-plan/*`: iOS planning documents (historical context only)

## Build + Run
See `README.md` for commands. The project uses Bun for install, dev, and build.

## Testing Expectations
Any change requires running both unit and E2E tests. New features must add tests; changes to existing features must update tests.

## Design Mindset
If a test fails or something doesn’t compile, avoid quick patches. Step back and verify whether the design should change (e.g., unnecessary nullability or optionality). Aim for durable, principled fixes.
