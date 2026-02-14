# Agent Reference: Feature Design + E2E Workflows

This file is a concise, code-backed reference for how Gymmer’s web app is structured and how core features are designed. It is intended for assistants and contributors who need to locate logic quickly and reason about flow.

## Scope + Product Focus
- The **web app is the source of truth** (`apps/web`).
- iOS was started but abandoned; new features and fixes are **web-only** unless explicitly requested.
- `docs/ios-plan/*` is **historical context only**.

## Architecture Overview (Web)
- **Framework:** Next.js App Router (`apps/web/app/*`), API route handlers in `apps/web/app/api/*`.
- **Data layer:** `apps/web/lib/database.ts` uses Turso/libSQL. Schema in `apps/web/lib/db-schema.sql`.
- **Auth:** NextAuth in `apps/web/auth.ts` with Google provider and email allowlist. API auth helpers in `apps/web/lib/auth-utils.ts`.
- **Domain model:** `apps/web/lib/types.ts` and `apps/web/lib/constants.ts` are the canonical types/constants.
- **Shared UI:** `apps/web/app/components/*`.
- **State + caching:** localStorage and sessionStorage for workout state and caching (details below).

## Cross-Cutting Design Patterns
- **Workout state lives on the client** during a session and is persisted in localStorage (`lib/workout-session.ts`).
- **Autosave is event-driven**: the client emits structured autosave events -> API -> DB (`lib/workout-autosave.ts` + `app/api/workout-autosave/route.ts`).
- **Resume flows** rely on locally cached session data and server session IDs (`lib/active-routines.ts`).
- **Routine edits** invalidate caches via local edit-version tracking (`lib/workout-bootstrap.ts`).
- **Session-level overrides** (edited workout plan + targets meta + change warnings) live in sessionStorage (`lib/session-workout.ts`).
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
- **Design:** Uses the same workout flow as routines but builds a blank plan in memory.
- **Core:** `apps/web/lib/free-workout.ts`
- **Entry point:** `apps/web/app/routines/page.tsx` (starts “Free Workout” session)

### Workout Flow (Preview → Pre‑Stretches → Active → Cardio → Post‑Stretches → Summary)
- **UI pages:**
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
- **Save:** `apps/web/app/api/save-workout/route.ts`
- **History:** `apps/web/app/api/exercise-history/route.ts`, `apps/web/app/api/last-exercise/route.ts`
- **Stats export:** `apps/web/app/workout/[name]/stats/page.tsx` + `apps/web/app/api/workout/[name]/route.ts`

### AI Features (Routine Generation + Targets + Reports)
- **Routine generation:** `apps/web/app/api/routines/ai-generate/route.ts`
- **Targets (pre‑workout):** `apps/web/app/api/workout-targets/route.ts`
- **Post-workout report:** `apps/web/app/api/workout-report/route.ts`
- **Notes:** Uses `OPENAI_API_KEY` + `OPENAI_MODEL` and user goals/history from DB.

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
| Home + marketing | `/`, `/what-is-gymmer` | `home-login.spec.ts` |
| Login | `/login` | `home-login.spec.ts` |
| Profile + goals + analytics | `/profile` | `profile-flow.spec.ts` |
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
