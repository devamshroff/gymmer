# Gymmer

Gymmer is a workout tracker: you build routines, flow through them at the gym set by set, and see your progress over time. It started as a personal tool and is now used by a small group of friends, so the live data is real and correctness matters.

The whole product is one Next.js web app in `apps/web`. It is installable as a PWA and runs in production on Vercel at `https://gymmer-liard.vercel.app`.

A note on names, because you will see all three in the code and UI:

- **Temple** is the name shown in the app itself (header, login screen, home screen icon).
- **Gymmer** is the workout half, under `/workout` and `/routines`. It is also the name of this repo.
- **Nommer** is the nutrition half, under `/nutrition`.

New here? Read this file to get the app running, then [docs/codebase-tour.md](docs/codebase-tour.md) to learn where things live.

## Run it locally

You need:

- [Bun](https://bun.sh) 1.3.6 or newer. Bun installs dependencies, runs the dev server and runs the tests. A separate Node.js install is not required.
- The `sqlite3` command line tool (preinstalled on macOS).
- A Google account whose email is on the allowlist, plus Google OAuth credentials (see step 2).

### 1. Install

```bash
git clone https://github.com/devamshroff/gymmer.git
cd gymmer
bun install
```

### 2. Create `apps/web/.env.local`

```bash
cp apps/web/.env.example apps/web/.env.local
```

Then fill in the values below. Everything else in the file is optional and can stay as it is (see [Environment variables](#environment-variables)).

| Variable | What to put |
| --- | --- |
| `TURSO_DATABASE_URL` | `file:./.local/dev.db` for a private local database (recommended, set up in step 3). |
| `TURSO_AUTH_TOKEN` | Leave as is. It is ignored for `file:` databases. |
| `AUTH_SECRET` | Any long random string. Generate one with `openssl rand -base64 32`. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | A Google OAuth client. Ask Devam for the existing one, or create your own in Google Cloud Console. Either way the client must list `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI. |
| `ALLOWED_EMAILS` | Your Google email. Comma-separated if more than one. Only these accounts can sign in. |

> **Do not point local dev at the production database.** If someone hands you a `.env.local` with a `libsql://...` URL, that is the live database your changes would write to. Use the local file database below unless you specifically need production data.

### 3. Create a local database

From `apps/web`:

```bash
cd apps/web
mkdir -p .local
sqlite3 .local/dev.db < lib/db-schema.sql
```

That gives you an empty database with the right tables. To fill the exercise and stretch libraries so there is something to build routines from:

```bash
bun --env-file=.env.local scripts/seed-exercises.ts
bun --env-file=.env.local scripts/seed-stretches.ts
bun --env-file=.env.local scripts/seed-exercise-metrics.ts
```

These scripts write to whatever database `.env.local` points at, so check `TURSO_DATABASE_URL` before running them. `.local/` is gitignored. To start over, delete `.local/dev.db` and repeat this step.

### 4. Start the app

From the repo root:

```bash
bun run dev
```

Open http://localhost:3000 and sign in with Google. Your user record is created on first sign-in.

If you land back on the login page with `error=AccessDenied`, your email does not exactly match an entry in `ALLOWED_EMAILS` (the match is case-sensitive). Restart the dev server after editing `.env.local`.

## Commands

Run these from the repo root. They all forward to `apps/web`.

| Command | What it does |
| --- | --- |
| `bun run dev` | Dev server on http://localhost:3000 |
| `bun run build` | Production build |
| `bun run start` | Serve the production build |
| `bun run lint` | ESLint |
| `bun run test` | Unit tests in watch mode (Vitest) |
| `bun run test:run` | Unit tests once |
| `bun run test:e2e` | End-to-end tests (Playwright) |
| `bun run docs:architecture` | Regenerate `docs/architecture-index.*` |

## Tests

**Unit tests** live in `apps/web/__tests__` and need no database or credentials.

**End-to-end tests** live in `apps/web/e2e`. They do not touch your dev database or need Google sign-in: Playwright starts its own dev server with a throwaway SQLite database at `apps/web/.e2e/gymmer.db` (rebuilt from `lib/db-schema.sql` on every run) and a test-only auth bypass. Two things to know:

- Install the browser once: `cd apps/web && bunx playwright install chromium`.
- Stop your own dev server first. If something is already listening on port 3000, Playwright reuses it instead of starting the test server, and the tests fail at the login screen.

The project rule is that any behavior change runs both suites, new features add tests, and changed features update them. `apps/web/e2e/flows.md` lists every user flow and the spec that covers it.

## Environment variables

All of these go in `apps/web/.env.local` for local dev and in the Vercel project settings for production. `apps/web/.env.example` is the template.

Needed to boot and sign in:

| Variable | Purpose |
| --- | --- |
| `TURSO_DATABASE_URL` | Database location. `file:...` for local SQLite, `libsql://...` for Turso. |
| `TURSO_AUTH_TOKEN` | Turso token. Only required for `libsql://` URLs. |
| `AUTH_SECRET` | Signs login sessions (NextAuth). |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google sign-in. |
| `ALLOWED_EMAILS` | Comma-separated allowlist of Google emails that may sign in. |

Optional. The app runs without them and only the listed feature is unavailable:

| Variable | Feature |
| --- | --- |
| `ANTHROPIC_API_KEY` (plus optional `ANTHROPIC_MODEL`, `ANTHROPIC_VERSION`) | AI features: routine generation, workout targets, post-workout reports, form tips, meal estimates. |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (or the `WEB_PUSH_*` aliases) | Push notification reminders. Generate keys with `bunx web-push generate-vapid-keys`. |
| `CRON_SECRET` | Protects the reminder endpoint that the external scheduler calls. |
| `RESEND_API_KEY`, `BUG_REPORT_FROM_EMAIL`, `BUG_REPORT_TO_EMAIL` | Emailing bug reports from `/report-bug`. |
| `APP_JWT_SECRET` | Token exchange at `/api/auth/token`. |
| `OPENAI_API_KEY` | Only used by two old one-off backfill scripts in `apps/web/scripts`. |

## Repo layout

```
gymmer/
├── AGENTS.md            Working rules for anyone (human or AI) changing the code
├── README.md            This file
├── docs/                Architecture docs and decision records
└── apps/web/            The Next.js app. Everything that ships is in here
    ├── app/             Pages and API routes
    ├── lib/             Database access, domain logic, shared helpers
    ├── __tests__/       Unit tests
    ├── e2e/             End-to-end tests
    ├── scripts/         One-off database seed and migration scripts
    ├── public/          Service worker, icons, sample workout plans
    ├── auth.ts          Google sign-in and the email allowlist
    └── proxy.ts         Redirects signed-out visitors to /login
```

[docs/codebase-tour.md](docs/codebase-tour.md) goes one level deeper.

## Documentation

| File | Use it for |
| --- | --- |
| [docs/codebase-tour.md](docs/codebase-tour.md) | A newcomer's guide to how the app is put together. |
| [docs/agent-reference.md](docs/agent-reference.md) | The detailed, feature-by-feature map of which files own what. |
| [docs/architecture-index.md](docs/architecture-index.md) | A generated inventory of every route, API, component, lib file and test. |
| [docs/adr/](docs/adr/) | Short records of the big design decisions and why they were made. |
| [AGENTS.md](AGENTS.md) | The change checklist: tests, docs and quality bar. |
| [apps/web/README.md](apps/web/README.md) | Operational notes: the MCP connector, push reminders, deploying. |

Docs ship with the code change, not later. If a change alters behavior, routes, APIs, storage, setup or tests, update the matching doc in the same change. If you add, remove or move routes, API handlers, lib files, components or tests, rerun `bun run docs:architecture` and commit the result.

## Deploying

Production deploys are manual. Pushing to GitHub does not deploy anything. From `apps/web`, with access to the Vercel project:

```bash
bunx vercel --prod --yes
```

Check with Devam before deploying. Friends use the production app daily, and schema changes need a database backup first.

To let a new person sign in to production, add their email to `ALLOWED_EMAILS` in the Vercel project's environment variables and redeploy.
