# Gymmer Web

## Getting Started

From the repo root, run:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Remote MCP

The web app exposes a remote MCP endpoint for Claude/custom connectors:

```
https://temple-liard.vercel.app/api/mcp
```

It uses OAuth discovery and authorization-code tokens under:

- `/.well-known/oauth-authorization-server`
- `/.well-known/oauth-protected-resource`
- `/api/mcp/oauth/*`

The MCP endpoint reuses the existing Turso/libSQL data layer and creates `mcp_oauth_*` tables automatically. Workout and nutrition read tools require `gymmer:read`; write tools require `gymmer:write`.

Workout session writes are available through `create_workout_session`. It creates a completed free-workout session through the same save helper used by `/api/save-workout`, accepts set weights in stored pounds (`lbs`), maps one warmup set to the existing warmup columns, stores up to four working sets, and stores optional notes in the existing `workout_report` text field.

## Nightly Activity Reminders

The `/activities` page can opt a user into a 10 PM browser push reminder to log cardio or sports activity. Configure Web Push and cron secrets in the deployment environment:

```bash
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:you@example.com
CRON_SECRET=...
```

Gymmer also accepts the older `WEB_PUSH_PUBLIC_KEY`, `WEB_PUSH_PRIVATE_KEY`, and `WEB_PUSH_SUBJECT` aliases. The `VAPID_*` names match the existing Tether notification setup.

Generate VAPID keys with:

```bash
bunx web-push generate-vapid-keys
```

An external cron-job.org job calls `/api/notifications/cardio-reminder/send` at 10:00, 10:15, 10:30, and 10:45 PM America/New_York with the `x-cron-secret` header. The endpoint still checks each saved subscription's timezone and dedupes by local date before sending.

When `/activities` loads, Gymmer re-saves any existing browser push subscription to the server before showing reminders as enabled. This keeps browser notification state aligned with the `push_subscriptions` table after DB or deployment changes.

PWA icon filenames are versioned in `app/layout.tsx` and `lib/pwa/config.ts` because iOS can aggressively cache Apple touch icons by URL. When app icon artwork changes, add a new versioned PNG filename and point the metadata/manifest at it.

## Claude / Anthropic

Server-side LLM features use Claude through Anthropic's Messages API. Configure these in `apps/web/.env.local` for local dev and in the Vercel project environment for production:

```bash
ANTHROPIC_API_KEY=...
ANTHROPIC_MODEL=claude-sonnet-4-5 # optional
ANTHROPIC_VERSION=2023-06-01 # optional
```

## Deploy on Vercel

The Vercel project is linked from `apps/web`. Deploy production with:

```bash
bunx vercel --prod --yes
```

`vercel.json` forces Bun install/build commands so production matches the repo workflow.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
