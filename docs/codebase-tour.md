# Codebase Tour

A newcomer's guide to how Gymmer is put together. It assumes you have the app running locally (see the [README](../README.md)).

This file explains the shape of the system. For the exhaustive "which file owns which feature" map, use [agent-reference.md](agent-reference.md). For a generated list of every file, use [architecture-index.md](architecture-index.md).

## The stack in one paragraph

Gymmer is a single Next.js app (App Router, React, TypeScript, Tailwind) in `apps/web`. Pages are React components that call the app's own JSON API routes. The API routes read and write a SQLite-compatible database (Turso in production, a local file in development) through one data-access module. Sign-in is Google OAuth through NextAuth, restricted to an email allowlist. AI features call Claude through the Anthropic API. It is deployed to Vercel and installable as a PWA.

## What the product does

The app is branded **Temple** and has two halves:

- **Gymmer** (`/workout`, `/routines`): build routines, run a workout, log sets, review history and stats.
- **Nommer** (`/nutrition`): log food against a pantry of known foods, track calories, protein and bodyweight.

Alongside those: `/activities` logs non-lifting days (cardio, sports, classes, rest), `/profile` shows goals and a calendar of activity, and `/settings` holds preferences and sign out.

## Where things live

Everything below is under `apps/web/`.

| Path | What is in it |
| --- | --- |
| `app/**/page.tsx` | One file per screen. The folder path is the URL, so `app/routines/builder/page.tsx` is `/routines/builder`. |
| `app/api/**/route.ts` | The JSON API. Same rule: `app/api/routines/route.ts` is `/api/routines`. |
| `app/components/` | UI shared between screens: the timer, exercise and stretch pickers, headers, the PWA banner. |
| `lib/database.ts` | Every SQL query in the app. API routes call functions from here and never write SQL themselves. |
| `lib/db-schema.sql` | The table definitions for a fresh database. |
| `lib/types.ts`, `lib/constants.ts` | The shared data shapes and constants. Read `types.ts` early. |
| `lib/workout-*.ts`, `lib/session-*.ts` | The logic for running a workout in the browser (see below). |
| `lib/claude.ts` | The single helper all AI features use to call Claude. |
| `lib/mcp/`, `app/api/mcp/` | The MCP connector that lets Claude read and log a user's data. |
| `lib/pwa/`, `public/sw.js` | Install prompt, service worker and push notification reminders. |
| `auth.ts`, `proxy.ts`, `lib/auth-utils.ts` | Sign-in and access control (see below). |
| `__tests__/` | Unit tests, mirrored as `api/`, `components/`, `lib/`, `pages/`. |
| `e2e/` | Playwright end-to-end tests. `e2e/flows.md` maps user flows to spec files. |
| `scripts/` | One-off seed, backfill and migration scripts. Not part of the running app. |

`apps/web/data/` holds two small leftover database files from an early version. Nothing reads them.

## How a request flows

Take "show my routines" as the example:

1. The browser loads `/routines`, rendered by `app/routines/page.tsx`.
2. That page fetches `/api/routines`, handled by `app/api/routines/route.ts`.
3. The route calls `requireAuth()` from `lib/auth-utils.ts` to find out who is asking.
4. It calls a query function in `lib/database.ts`, passing that user's ID.
5. The result goes back to the page as JSON.

Almost every feature follows this page → API route → `lib/database.ts` shape. To understand a feature, start at its page, find the `fetch` calls, and follow them.

## Sign-in and who can see what

- `proxy.ts` runs before every page and redirects signed-out visitors to `/login`. It does not cover `/api/*`.
- Each API route protects itself by calling `requireAuth()`. A new API route that forgets this is open to the internet.
- `auth.ts` configures Google sign-in and rejects any email not in the `ALLOWED_EMAILS` environment variable.
- **A user's ID is their Google email.** Every table that holds personal data has a `user_id` column, or belongs to a parent row that does.
- Queries must always filter by the caller's `user_id`. When a route touches a child row (an exercise inside a routine, say), it must first check that the caller owns the parent. This is the rule most worth internalizing: the app has several real users sharing one database.

## How a workout works

This is the most intricate part of the app, and the least like a typical web page.

A workout moves through a fixed sequence of screens: preview → pre-workout stretches → active (the sets) → cardio → post-workout stretches → summary. The pages are under `app/workout/[name]/` and `app/stretches/[workoutName]/`, and `lib/workout-navigation.ts` decides which comes next.

The important design choice: **while a workout is in progress, the browser holds the state, not the server.** Someone mid-set in a gym with bad signal should never lose their numbers.

- `lib/workout-session.ts` keeps the in-progress workout in `localStorage`.
- `lib/workout-autosave.ts` sends changes to `/api/workout-autosave` in the background as they happen.
- `lib/active-routines.ts` lets a user leave and resume where they stopped.
- `lib/session-workout.ts` and `lib/session-changes.ts` use `sessionStorage` for edits made to the plan during a single workout.
- `lib/workout-bootstrap.ts` loads and caches the plan, the user's last sets and their settings at the start.
- The final save goes through `lib/workout-session-save.ts`.

A "free workout" (`/free-workout`) is the same flow without a saved routine: the plan is built in memory.

Because this state lives in the browser and is not separated per user, signing out deliberately wipes it (`lib/sign-out.ts`). If you add a new `localStorage` key, read the sign-out notes in [agent-reference.md](agent-reference.md).

## The database

- One module, `lib/database.ts`, owns all queries. It is large. Search it by table or function name instead of reading it top to bottom.
- `lib/db-schema.sql` creates a fresh database. Some newer tables are also created or upgraded on demand by `ensure...` functions inside `database.ts`, so existing databases pick up changes without a separate migration step.
- There is no migration framework. A schema change means updating `db-schema.sql`, making sure existing databases get upgraded (usually an `ensure...` function), and for anything risky, a script in `scripts/` that Devam runs against production after taking a backup.
- Locally the database is a SQLite file. In production it is Turso, which speaks the same SQL. Any `file:` or `libsql://` URL in `TURSO_DATABASE_URL` works.

## AI features

All of them go through `lib/claude.ts` and need `ANTHROPIC_API_KEY`:

- Generate a routine from a description: `app/api/routines/ai-generate/route.ts`
- Suggest target weights before a workout: `app/api/workout-targets/route.ts`
- Write a post-workout report: `app/api/workout-report/route.ts`
- Estimate macros from a meal description: the `estimate_food` action in `app/api/nutrition/route.ts`

Without the key, the rest of the app works and these fail.

## Making a change

Where to start for common tasks:

| I want to... | Start in |
| --- | --- |
| Change how a screen looks or behaves | Its `page.tsx` under `app/`, then `app/components/` |
| Change what an API returns | The matching `route.ts` under `app/api/`, then the function it calls in `lib/database.ts` |
| Add a column or table | `lib/db-schema.sql` and `lib/database.ts` |
| Change the workout flow | `lib/workout-navigation.ts`, `lib/workout-session.ts` and the pages under `app/workout/[name]/` |
| Change an AI prompt | The API route for that feature (listed above) |
| Add a preset activity tile | `lib/activity-types.ts` |

Before calling a change done, follow the checklist in [AGENTS.md](../AGENTS.md):

1. Add or update unit tests in `__tests__/` and end-to-end tests in `e2e/`.
2. Run `bun run test:run` and `bun run test:e2e`.
3. Update the docs the change affects. If you added, removed or moved a route, API handler, lib file, component or test, run `bun run docs:architecture`.
4. For a decision that would be expensive to rediscover later, add a short record under [adr/](adr/).

The existing end-to-end specs are also the best description of how each flow is supposed to behave. When in doubt about intended behavior, read the spec.
