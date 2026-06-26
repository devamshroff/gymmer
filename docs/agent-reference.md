# Agent Reference: Feature Design + E2E Workflows

This file is a concise, code-backed reference for how Temple’s web app is structured and how core features are designed. It is intended for assistants and contributors who need to locate logic quickly and reason about flow.

## Read Order
- Start with `AGENTS.md` for repo rules.
- Use this file for the curated summary.
- Use `docs/architecture-index.md` for the generated route/API/component/test inventory.
- Refresh the generated index with `bun run docs:architecture` after structural changes.

## Maintenance Rule
- Keep this file aligned with the actual app.
- Update it in the same change whenever the curated understanding of feature ownership, architecture, storage, workflow, or PWA behavior changes.
- Do not rely on the generated architecture index as a substitute for updating this file when the summary itself is outdated.

## Scope + Product Focus
- Temple is a **web-only product**.
- The **web app is the source of truth** (`apps/web`).

## Architecture Overview (Web)
- **Framework:** Next.js App Router (`apps/web/app/*`), API route handlers in `apps/web/app/api/*`.
- **Data layer:** `apps/web/lib/database.ts` uses Turso/libSQL. Schema in `apps/web/lib/db-schema.sql`.
- **Auth:** NextAuth in `apps/web/auth.ts` with Google provider and email allowlist. API auth helpers in `apps/web/lib/auth-utils.ts`.
- **Remote MCP:** `apps/web/app/api/mcp/route.ts` exposes a Streamable HTTP MCP server for Claude/custom connectors. OAuth discovery and token routes live under `apps/web/app/.well-known/*` and `apps/web/app/api/mcp/oauth/*`.
- **Domain model:** `apps/web/lib/types.ts` and `apps/web/lib/constants.ts` are the canonical types/constants.
- **Nutrition targets:** `apps/web/lib/nutrition-targets.ts` hardcodes the current daily nutrition targets.
- **Shared UI:** `apps/web/app/components/*`.
- **State + caching:** localStorage and sessionStorage for workout state and caching (details below).
- **Standalone activity logs:** Timed cardio/sports/classes live in the user-owned `activity_logs` table and are managed outside workout sessions.
- **Nommer:** Pantry foods, food logs, bodyweight entries, and combos live in user-owned nutrition tables and are managed from `/nutrition`; Claude-backed meal estimates can be parsed, edited, logged, and optionally saved into inventory.
- **PWA shell + reminders:** manifest route in `apps/web/app/manifest.ts`, bootstrap in `apps/web/app/components/PwaBootstrap.tsx`, install/offline banner in `apps/web/app/components/PwaStatusBanner.tsx`, offline fallback in `apps/web/app/offline/page.tsx`, service worker in `apps/web/public/sw.js`, and Web Push cardio reminders through `push_subscriptions`.

## Production Runtime Notes
- The production web app runs on Vercel at `https://gymmer-liard.vercel.app`; `https://temple-liard.vercel.app` currently redirects there until the Google OAuth client allows the Temple callback URL.
- The Vercel project root is `apps/web`.
- `apps/web/vercel.json` forces Bun install/build commands so production matches the repo workflow.
- Product flows that depend on server APIs should still prefer fewer, consolidated startup requests where possible, especially for workout bootstrapping.
- Remote MCP connectors are different from normal web traffic because Claude connects from Anthropic's cloud and expects a reachable HTTPS server plus OAuth. The Vercel deployment is the supported runtime for the remote MCP connector.

## Cross-Cutting Design Patterns
- **Workout state lives on the client** during a session and is persisted in localStorage (`lib/workout-session.ts`).
- **Autosave is event-driven**: the client emits structured autosave events -> API -> DB (`lib/workout-autosave.ts` + `app/api/workout-autosave/route.ts`).
- **Resume flows** rely on locally cached session data, current workout section metadata, and server session IDs (`lib/active-routines.ts`).
- **Routine edits** invalidate caches via local edit-version tracking (`lib/workout-bootstrap.ts`).
- **Session-level overrides** (edited workout plan + targets meta + free-workout bootstrap data + change warnings) live in sessionStorage (`lib/session-workout.ts`).
- **Session change tracking** for edits during workouts is stored in sessionStorage (`lib/session-changes.ts`).

## Feature Design (Where Things Live)

### Authentication + Access Control
- **UI:** `apps/web/app/login/page.tsx`
- **Auth config:** `apps/web/auth.ts`
- **API guard:** `apps/web/lib/auth-utils.ts` (`requireAuth`, E2E bypass via `E2E_TEST=1`)
- **Notes:** Google provider + allowlisted emails (`ALLOWED_EMAILS`). User records are upserted on sign-in.

### User Profile + Settings + Goals
- **UI:** `apps/web/app/profile/page.tsx`, `apps/web/app/settings/page.tsx`
- **API:** `apps/web/app/api/user/route.ts`, `apps/web/app/api/user/settings/route.ts`, `apps/web/app/api/goals/route.ts`
- **Analytics:** `apps/web/app/api/profile/analytics/route.ts` (calendar + progress summaries)
- **Core helpers:** `apps/web/lib/units.ts`, `apps/web/lib/metric-utils.ts`

### Routines (Create, Edit, Import, Browse)
- **UI:**
  - Index: `apps/web/app/routines/page.tsx`
  - Builder: `apps/web/app/routines/builder/page.tsx`
  - Edit: `apps/web/app/routines/[id]/edit/page.tsx`
  - Stretch selection: `apps/web/app/routines/[id]/stretches/page.tsx`
  - Import: `apps/web/app/routines/import/page.tsx`
  - Browse/clone: `apps/web/app/routines/browse/page.tsx`
- **API:**
  - CRUD: `apps/web/app/api/routines/route.ts`, `apps/web/app/api/routines/[id]/route.ts`
  - Exercises/stretches: `apps/web/app/api/routines/[id]/exercises/route.ts`, `apps/web/app/api/routines/[id]/stretches/route.ts`
  - Reorder: `apps/web/app/api/routines/reorder/route.ts`
  - Favorites: `apps/web/app/api/routines/favorites/route.ts`, `apps/web/app/api/routines/[id]/favorite/route.ts`
  - Clone/public: `apps/web/app/api/routines/[id]/clone/route.ts`, `apps/web/app/api/routines/public/route.ts`
  - Cardio: `apps/web/app/api/routines/[id]/cardio/route.ts`
- **Shared UI:** `apps/web/app/components/RoutineEditParts.tsx`, `ExerciseSelector.tsx`, `StretchSelector.tsx`, `SupersetSelector.tsx`

### Free Workout (No Saved Routine)
- **Design:** Uses the same workout flow as routines but builds a blank plan in memory after a dedicated setup step that captures session mode, warms deterministic history-backed targets for all modes, and only upgrades `Progress` mode with an AI pass in the background.
- **UI:** `apps/web/app/free-workout/page.tsx`
- **Core:** `apps/web/lib/free-workout.ts`
- **Bootstrap API:** `apps/web/app/api/free-workout/bootstrap/route.ts`
- **Entry point:** `apps/web/app/page.tsx` (links to the dedicated free-workout setup page)

### Activity Logging (Standalone Cardio/Sports/Classes)
- **UI:** `apps/web/app/activities/page.tsx`
- **API:** `apps/web/app/api/activities/route.ts`
- **Storage:** `activity_logs` table in `apps/web/lib/db-schema.sql`
- **Core helpers:** `createActivityLog`, `listActivityLogs`, `deleteActivityLog` in `apps/web/lib/database.ts`
- **Nightly reminders:** Users opt into browser push reminders from `/activities`. Subscriptions are stored in `push_subscriptions`; `/activities` re-syncs any existing browser push subscription back to the server before showing reminders as enabled. `/api/notifications/cardio-reminder/send` is cron-protected and sends reminders when a subscription's saved timezone reaches 10 PM.
- **Notes:** This is for timed activities that are not full Gymmer workout sessions, such as yoga classes, biking, running, soccer, swimming, or similar conditioning work. These records are user-scoped and separate from `workout_sessions`, `workout_exercise_logs`, and `workout_cardio_logs`.

### Nommer
- **Gateway:** `/` is the Temple two-choice entry screen. `/workout` contains Gymmer, and `/nutrition` contains Nommer.
- **UI:** `apps/web/app/nutrition/page.tsx`
- **API:** `apps/web/app/api/nutrition/route.ts`
- **Storage:** `pantry_foods`, `food_log_entries`, `bodyweight_entries`, `combos`, and `combo_items` in `apps/web/lib/db-schema.sql`
- **Targets:** `apps/web/lib/nutrition-targets.ts` hardcodes 2,200 calories and 170g protein.
- **Core helpers:** nutrition CRUD/read helpers in `apps/web/lib/database.ts`
- **Flow:** The Nommer screen is day-first: native date picker with previous/next day side buttons, daily calorie/protein totals, goal/remaining block, bodyweight save, eaten-so-far list, then `+ Add food`.
- **Add panel:** Search logs pantry inventory or combos, combo creation builds shortcuts from existing pantry items, and estimate mode calls `estimate_food` to turn a meal description into editable macros before logging it.
- **Notes:** Pantry foods are defined at the user's measured unit level. Food log entries copy macros at log time and multiply by `quantity`. Combos are saved bundles of pantry foods and default quantities; empty combo shells are allowed, and logging a combo with items expands into separate `food_log_entries` rows as one batched write without storing recipe-level macros.

### Branding + Themes
- **Temple mark:** App/PWA icons use the shared `T` mark in `apps/web/public/icons/*`.
- **Temple home:** `/` uses the inverse of Tether's dark purple system: light surface, dark ink, and muted olive accent.
- **Gymmer:** Workout pages keep the existing green Gymmer styling.
- **Nommer:** `/nutrition` follows the same dark shell conventions as Gymmer but uses blue accents instead of green.

### PWA Notifications
- **Client helper:** `apps/web/lib/pwa/push-reminders.ts` handles opt-in, opt-out, and server re-sync for existing browser subscriptions.
- **Public key API:** `apps/web/app/api/push/public-key/route.ts`
- **Subscription API:** `apps/web/app/api/push/subscription/route.ts`
- **Reminder send API:** `apps/web/app/api/notifications/cardio-reminder/send/route.ts`
- **Service worker:** `apps/web/public/sw.js` handles `push` and `notificationclick`, opening `/activities`.
- **Deployment:** Requires Web Push VAPID keys and `CRON_SECRET`. Temple accepts Tether-compatible `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT`, with `WEB_PUSH_*` aliases still supported. An external cron-job.org job calls the send route at 10:00, 10:15, 10:30, and 10:45 PM America/New_York; the endpoint still verifies subscription timezone and dedupes by local date.

### Workout Flow (Preview → Pre‑Stretches → Active → Cardio → Post‑Stretches → Summary)
- **UI pages:**
  - Free workout setup: `apps/web/app/free-workout/page.tsx`
  - Preview: `apps/web/app/workout/[name]/page.tsx`
  - Pre-stretches: `apps/web/app/stretches/[workoutName]/page.tsx`
  - Active: `apps/web/app/workout/[name]/active/page.tsx`
  - Cardio: `apps/web/app/workout/[name]/cardio/page.tsx`
  - Post-stretches: `apps/web/app/workout/[name]/post-stretches/page.tsx`
  - Summary: `apps/web/app/workout/[name]/summary/page.tsx`
- **Flow logic:** `apps/web/lib/workout-navigation.ts`, `apps/web/lib/workout-progress.ts`
- **Client session state:** `apps/web/lib/workout-session.ts` (+ hook `apps/web/lib/use-workout-session.ts`)
- **Timers:** `apps/web/lib/workout-timer.ts`, UI in `apps/web/app/components/Timer.tsx`
- **Autosave:** `apps/web/lib/workout-autosave.ts` + UI badge `apps/web/app/components/AutosaveBadge.tsx`
- **Bootstrapping:** `apps/web/lib/workout-bootstrap.ts` (cached plan + last sets + settings)
- **Session overrides:** `apps/web/lib/session-workout.ts`
- **Session edits:** `apps/web/lib/session-changes.ts`
- **Active routine resume:** `apps/web/lib/active-routines.ts`

### Workout Save + History + Stats
- **Save:** `apps/web/app/api/save-workout/route.ts` delegates to `apps/web/lib/workout-session-save.ts`
- **History:** `apps/web/app/api/exercise-history/route.ts`, `apps/web/app/api/last-exercise/route.ts`
- **Stats export:** `apps/web/app/workout/[name]/stats/page.tsx` + `apps/web/app/api/workout/[name]/route.ts`

### Remote MCP Progress Connector
- **MCP endpoint:** `apps/web/app/api/mcp/route.ts`
- **OAuth/discovery:** `apps/web/app/api/mcp/oauth/*`, `apps/web/app/.well-known/oauth-authorization-server/route.ts`, `apps/web/app/.well-known/oauth-protected-resource/route.ts`
- **Read model:** `apps/web/lib/mcp/progress-export.ts`
- **Token storage:** `apps/web/lib/mcp/oauth.ts` creates `mcp_oauth_*` tables in Turso/libSQL.
- **Workout tools:** `get_progress_summary`, `list_workout_sessions`, `get_workout_session`, `get_exercise_progress`, `get_routines_snapshot`, `create_workout_session`
- **Nommer tools:** `list_pantry_foods`, `get_nutrition_day`, `get_nutrition_range`, `log_food`, `create_pantry_food`, `log_bodyweight`, `list_combos`, `log_combo`
- **Notes:** The connector is user-scoped through OAuth access tokens. Write tools require the `gymmer:write` OAuth scope in addition to normal authenticated MCP access. `create_workout_session` creates a completed free-workout session through the same shared save helper as `/api/save-workout`; set weights are stored in pounds (`lbs`), one warmup set maps to the existing warmup columns, up to four working sets map to `set1..set4`, and optional notes are stored in `workout_report`.

### AI Features (Routine Generation + Targets + Reports)
- **Provider helper:** `apps/web/lib/claude.ts` centralizes server-side Anthropic Messages API calls.
- **Routine generation:** `apps/web/app/api/routines/ai-generate/route.ts`
- **Targets (pre‑workout):** `apps/web/app/api/workout-targets/route.ts`
- **Post-workout report:** `apps/web/app/api/workout-report/route.ts`
- **Nommer meal estimates:** `apps/web/app/api/nutrition/route.ts` action `estimate_food` uses Claude and returns normalized JSON for the add panel.
- **Notes:** Uses `ANTHROPIC_API_KEY` plus optional `ANTHROPIC_MODEL`/`ANTHROPIC_VERSION` and user goals/history from DB.

### Exercise + Stretch Library
- **API:** `apps/web/app/api/exercises/route.ts`, `apps/web/app/api/stretches/route.ts`
- **Helpers:** `apps/web/lib/exercise-helpers.ts`, `apps/web/lib/stretch-utils.ts`, `apps/web/lib/form-tips.ts`, `apps/web/lib/muscle-tags.ts`

### Bug Reporting
- **UI:** `apps/web/app/report-bug/page.tsx`
- **API:** `apps/web/app/api/report-bug/route.ts`
- **Notes:** Uses Resend + optional screenshot attachment.

## E2E Workflows (User‑Facing Flows)
Canonical list lives in `apps/web/e2e/flows.md`. Summary below:

| Workflow | Routes | E2E spec |
| --- | --- | --- |
| Home gateway + marketing | `/`, `/workout`, `/what-is-gymmer` | `home-login.spec.ts` |
| Login | `/login` | `home-login.spec.ts` |
| Profile + goals + analytics | `/profile` | `profile-flow.spec.ts` |
| Nommer logging | `/nutrition` | `nutrition.spec.ts` |
| Activity logging | `/activities` | `activities.spec.ts` |
| Routines index + create | `/routines` | `routines-index.spec.ts` |
| Manual routine builder | `/routines/builder` | `routines-builder-flow.spec.ts` |
| Routine stretch selection | `/routines/[id]/stretches` | `routines-builder-flow.spec.ts` |
| Routine import (JSON) | `/routines/import` | `routines-import.spec.ts` |
| AI routine generate + preview + save | `/routines/ai`, `/routines/ai/preview` | `ai-flow.spec.ts` |
| Workout preview + edit routine | `/workout/[name]`, `/routines/[id]/edit` | `workout-flow.spec.ts` |
| Browse + clone public routines | `/routines/browse` | `browse-clone.spec.ts` |
| Pre‑workout stretches | `/stretches/[workoutName]` | `ai-flow.spec.ts` |
| Resume from pre‑stretches | `/stretches/[workoutName]`, `/workout/[name]/active` | `workout-resume-stretch.spec.ts` |
| Resume active routine | `/routines`, `/workout/[name]/active`, `/workout/[name]/cardio`, `/workout/[name]/post-stretches`, `/workout/[name]/summary` | `workout-resume-active.spec.ts` |
| Active workout (sets, warmup, nav) | `/workout/[name]/active` | `ai-flow.spec.ts`, `workout-extra-sets.spec.ts` |
| Cardio | `/workout/[name]/cardio` | `ai-flow.spec.ts` |
| Post‑workout stretches | `/workout/[name]/post-stretches` | `ai-flow.spec.ts` |
| Workout summary + report | `/workout/[name]/summary` | `ai-flow.spec.ts` |
| Workout stats export | `/workout/[name]/stats` | `workout-stats.spec.ts` |
| Report a bug | `/report-bug` | `report-bug.spec.ts` |

## Quick Pointers for Agents
- Start with the UI page route under `apps/web/app/*`.
- Check the matching API route in `apps/web/app/api/*`.
- Look for supporting logic in `apps/web/lib/*` and shared components in `apps/web/app/components/*`.
- Use the E2E specs in `apps/web/e2e/*` as user-flow ground truth.
- Use `docs/architecture-index.json` when a machine-readable file inventory is more useful than prose.
