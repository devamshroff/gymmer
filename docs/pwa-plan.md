# Gymmer PWA Plan

## Goal
Turn Gymmer into an installable Progressive Web App without creating a second frontend codebase.

This should be built on top of the existing `apps/web` Next.js app. The PWA work is an extension of the current web architecture, not a parallel app.

## Status Snapshot
As of 2026-04-07, Gymmer already ships the basic PWA shell:
- web manifest via `apps/web/app/manifest.ts`
- service worker via `apps/web/public/sw.js`
- install/update bootstrap via `apps/web/app/components/PwaBootstrap.tsx`
- install/offline/update banner via `apps/web/app/components/PwaStatusBanner.tsx`
- offline fallback route via `apps/web/app/offline/page.tsx`
- app metadata wired through `apps/web/app/layout.tsx`
- Web Push cardio activity reminders via `/activities`, `push_subscriptions`, and `/api/notifications/cardio-reminder/send`

What remains is the deeper offline work: durable mutation queueing, retry-safe sync, broader offline read coverage, and stronger observability.
Nightly reminders are intentionally separate from offline sync: they use browser push subscriptions and a server cron job, not local browser timers.

## Current State

### What Gymmer already has
- A single web app in `apps/web` built with Next.js App Router.
- A shared app shell in `apps/web/app/layout.tsx`.
- Client-side workout session state in `apps/web/lib/workout-session.ts`.
- Server-backed autosave in `apps/web/lib/workout-autosave.ts` and `apps/web/app/api/workout-autosave/route.ts`.
- Server-backed final workout save in `apps/web/app/api/save-workout/route.ts`.
- Existing local browser storage usage with `localStorage` and `sessionStorage`.
- A web manifest in `apps/web/app/manifest.ts`.
- A service worker in `apps/web/public/sw.js`.
- Install/update bootstrap and status UI in `apps/web/app/components/PwaBootstrap.tsx` and `apps/web/app/components/PwaStatusBanner.tsx`.
- An offline fallback route in `apps/web/app/offline/page.tsx`.
- Shared PWA config and install helpers in `apps/web/lib/pwa/*`.
- Versioned icon PNG URLs for manifest and Apple touch icons, so iOS and service-worker caches fetch new artwork after app icon changes.
- Web Push reminder opt-in on `apps/web/app/activities/page.tsx`.
- Push subscription APIs at `apps/web/app/api/push/*`.
- Existing browser push subscriptions are re-synced to the server from `/activities` so browser state cannot appear enabled while `push_subscriptions` is empty.
- Scheduled reminder sender at `apps/web/app/api/notifications/cardio-reminder/send/route.ts`, which runs several times during the 10 PM America/New_York hour and filters subscriptions to local 10 PM by saved timezone.

### What Gymmer does not have yet
- No client-side mutation queue for offline sync.
- No offline continuation for already-started workouts.
- No retry-safe mutation contract with stable client mutation IDs.
- No IndexedDB-backed queue/cache layer for durable offline sync.
- No broad offline read coverage beyond the cached shell and fallback flow.
- No offline push scheduling. Nightly reminders require configured Web Push VAPID keys (`VAPID_*`, or `WEB_PUSH_*` aliases) and scheduled server calls during the 10 PM hour.

## Recommendation
Implement the PWA in phases.

## Approved v1 scope
- First release is installable plus cached shell: yes.
- Offline support includes continuing an already-started workout: no.
- Routine edits, profile edits, and settings changes are allowed offline in v1: no.

Implementation status:
- The installable shell portion of v1 is implemented.
- The remaining work is the sync/offline continuation work described in later phases.

Do not try to make the entire app offline-first in one step. The correct sequence is:
1. Make the app installable.
2. Cache the app shell and static assets safely.
3. Add a clear offline experience.
4. Add offline workout continuation and replay.
5. Expand offline coverage only after the workout flow is reliable.

This keeps the risk low and avoids mixing installability work with sync/conflict work.

## Architecture Decision

### Codebase
- Keep a single codebase.
- All PWA work lives under `apps/web`.
- No separate mobile repository is needed.

### Recommended implementation shape
- Use Next metadata/app routes for manifest-related concerns.
- Use a small custom service worker instead of introducing a second rendering stack.
- Keep sync logic in app-level client utilities, not inside page components.
- Keep server persistence in the existing API routes unless a route is clearly too coupled to current online-only assumptions.

## Where The PWA Logic Should Sit

### App identity and install metadata
- `apps/web/app/manifest.ts`
- `apps/web/app/layout.tsx`
- `apps/web/public/icons/*`

Purpose:
- app name
- short name
- icons
- theme color
- display mode
- start URL
- orientation

### Service worker registration
- `apps/web/app/components/PwaBootstrap.tsx`
- `apps/web/app/components/PwaStatusBanner.tsx`
- mounted once from `apps/web/app/layout.tsx` or `apps/web/app/providers.tsx`

Purpose:
- register the service worker
- listen for updates
- expose install/offline/update events to the UI

### Service worker logic
- `apps/web/public/sw.js`

Purpose:
- cache app shell assets
- cache selected GET routes
- provide offline fallback behavior
- optionally use Background Sync later if supported

### Offline route / fallback UI
- `apps/web/app/offline/page.tsx`

Purpose:
- clear recovery path when the user opens a route that is not cached
- explain what still works offline and what does not

### Client-side PWA utilities
- `apps/web/lib/pwa/install.ts`
- `apps/web/lib/pwa/network.ts`
- `apps/web/lib/pwa/cache.ts`
- `apps/web/lib/pwa/offline-queue.ts`
- `apps/web/lib/pwa/sync.ts`

Purpose:
- install prompt state
- online/offline detection
- mutation queueing
- replay/sync orchestration
- cache invalidation helpers

### Workout-specific offline logic
- `apps/web/lib/workout-session.ts`
- `apps/web/lib/workout-autosave.ts`
- optionally new files:
  - `apps/web/lib/workout-sync-queue.ts`
  - `apps/web/lib/workout-offline-state.ts`

Purpose:
- keep workout state local first
- queue autosave/save attempts when offline
- replay those mutations when connectivity returns

### Server persistence logic
- existing API routes:
  - `apps/web/app/api/workout-autosave/route.ts`
  - `apps/web/app/api/save-workout/route.ts`
  - `apps/web/app/api/routines/*`
  - `apps/web/app/api/user/*`

Purpose:
- stay as the source of truth for durable data
- accept idempotent retries from queued offline mutations

## Routes: What Changes Are Needed

## Existing routes
No user-facing route reorganization is required to become a PWA.

The current pages can remain where they are:
- `/`
- `/login`
- `/routines`
- `/workout/[name]/*`
- `/profile`
- `/settings`
- other existing web routes

## New routes/files to add

### Required for a basic PWA
- `apps/web/app/manifest.ts`
- `apps/web/app/offline/page.tsx`
- `apps/web/public/sw.js`

### Optional but likely useful
- install/update banner UI mounted globally
- a small status component that says:
  - offline
  - syncing
  - update available

## Route behavior changes

### GET pages
- Some GET routes should be cached for fast startup and limited offline use.
- Start with shell-level caching, not broad route pre-caching.

Recommended first cache set:
- `/`
- `/login`
- `/routines`
- `/what-is-gymmer`
- `/activities`
- shared CSS, JS, fonts, icons

Workout routes can be added carefully once fallback behavior is proven:
- `/workout/[name]`
- `/workout/[name]/active`
- `/workout/[name]/cardio`
- `/workout/[name]/post-stretches`
- `/workout/[name]/summary`

### API routes
No immediate route split is required.

However, once offline replay is introduced, the existing POST handlers must explicitly support retry-safe behavior.

That means:
- repeated requests must not create bad duplicate state
- the same client mutation can be replayed safely
- partial success must be detectable

## Data Model: Are Changes Necessary?

## Short answer

### For a basic installable PWA
- No server database schema changes are necessary.

### For reliable offline workout sync
- Probably yes, but only in a targeted way.

## What already helps
- `workout_sessions.session_key` already exists in `apps/web/lib/db-schema.sql`.
- That is useful for deduping the same logical workout session across reconnects.
- `upsertWorkoutExerciseLog` already overwrites matching exercise rows instead of blindly inserting duplicates.

These two facts mean Gymmer is already in better shape than a typical app for phased offline sync.

## What is still weak today

### Autosave replay
Current autosave events do not carry a stable client event id.

Implication:
- if a request fails after the server partially processed it, the client cannot prove whether that exact mutation already succeeded

This is somewhat mitigated by the current exercise-log upsert behavior, but it is still not a clean sync contract.

### Final workout save replay
`save-workout` can update the workout session and upsert exercise logs safely enough, but cardio logging is currently insert-based.

Implication:
- a duplicated final save could create duplicate cardio rows for the same workout session

## Recommended data model changes by phase

### Phase 1 to Phase 3
- No database schema changes.

### Phase 4 and beyond
Recommended server-side changes:

1. Add a stable client mutation id for retryable writes.
   Options:
   - add `client_mutation_id` columns where needed
   - or add a dedicated processed-mutations table keyed by user + mutation id

2. Make cardio writes idempotent.
   Options:
   - add a unique constraint per session for cardio rows and upsert
   - or replace insert-only cardio logging with update/upsert semantics

3. If routine editing is later supported offline, add explicit version/conflict metadata.
   Options:
   - `updated_at` checks
   - client-known version numbers
   - server conflict response shape

## Recommended client-side data model changes
These are separate from the server database schema and are very likely needed.

Use IndexedDB for PWA-specific local data instead of expanding `localStorage` further.

Recommended local stores:
- `pwa_outbox`
  - queued POST/PUT mutations waiting to sync
- `pwa_api_cache`
  - cached GET payloads for selected screens
- `pwa_workout_drafts`
  - workout session snapshots if the current `localStorage` approach becomes too constrained
- `pwa_meta`
  - sync timestamps, cache version, install/update state

## Phase Plan

## Phase 0: Definition And Constraints
Goal:
- decide what "PWA" means for Gymmer before writing service worker code

Deliverables:
- written scope
- cache strategy
- offline support matrix
- sync guarantees for workout flows

Decisions to make:
- Is the first release just installable plus cached shell?
- Does offline support include continuing an already-started workout?
- Are routine edits/profile/settings allowed offline in v1? Recommended answer: no.

Output:
- approved scope document
- release checklist

## Phase 1: Installable Web App
Goal:
- make Gymmer installable and correctly branded as a standalone app

Status:
- Complete as of 2026-04-07.

Implementation:
- add `apps/web/app/manifest.ts`
- add app icons under `apps/web/public/icons/*`
- expand `apps/web/app/layout.tsx` metadata with theme color, viewport, and manifest references
- ensure the app has a stable start URL and correct display mode

Success criteria:
- browser recognizes Gymmer as installable
- app opens in standalone mode
- splash screen/icon/theme metadata are correct

Risk:
- very low

Data model impact:
- none

Route impact:
- adds manifest route only

## Phase 2: Service Worker And Safe Caching
Goal:
- cache static assets and a minimal app shell without breaking dynamic behavior

Status:
- Partially complete as of 2026-04-07.
- The service worker, runtime route list, static asset caching, and offline fallback route exist.
- Broader validation and future cache expansion remain open.

Implementation:
- add `apps/web/public/sw.js`
- add `apps/web/app/components/PwaBootstrap.tsx` to register it
- use conservative caching first:
  - static assets: cache first
  - selected pages: network first with fallback cache
  - APIs: do not broadly cache POST responses

Initial cache targets:
- JS/CSS bundles
- icons
- fonts
- home page
- login page
- routines landing page
- offline page

Success criteria:
- repeat visits are faster
- app boots with weak/no network if shell is already cached
- service worker updates can be rolled out safely

Risk:
- medium if cache scope is too broad

Data model impact:
- none

Route impact:
- adds offline fallback route

## Phase 3: Offline UX, Update UX, And Observability
Goal:
- make the PWA understandable when offline instead of silently failing

Status:
- Partially complete as of 2026-04-07.
- The global status banner covers install, update, and offline states.
- Retry entry points, richer observability, and sync-specific messaging remain open.

Implementation:
- global offline indicator
- update available indicator
- "retry sync" entry point
- clear empty/error states for uncached pages
- instrumentation/logging for:
  - install accepted/dismissed
  - offline failures
  - sync retries
  - service worker update events

Recommended UI placement:
- small global banner or status chip in the app shell
- workout pages should surface whether data is local-only or server-synced

Success criteria:
- user can tell whether they are offline
- user can tell whether changes are pending sync
- user can recover without refreshing blindly

Risk:
- low to medium

Data model impact:
- likely only client-side IndexedDB metadata

Route impact:
- none beyond existing pages using new status UI

## Phase 4: Offline Workout Continuation
Goal:
- let a user continue an already-started workout when connectivity drops

This is the first phase where the PWA becomes materially more valuable than "a website you can install."

Implementation:
- keep current workout state local-first
- when `autosaveWorkout` cannot reach the network, queue the mutation locally
- replay queued autosave/save mutations when:
  - app regains connectivity
  - user reopens the app
  - user manually taps retry

Recommended changes:
- add queue layer beneath `apps/web/lib/workout-autosave.ts`
- add stable client mutation ids to queued writes
- make final workout save idempotent
- make cardio persistence idempotent

Success criteria:
- started workout can continue without network
- reconnect pushes the latest state successfully
- replay does not create duplicate or conflicting workout records

Risk:
- high

Data model impact:
- likely yes
- server idempotency support is recommended here

Route impact:
- no route shape changes required
- existing POST routes need stronger contracts

## Phase 5: Expand Offline Read Coverage
Goal:
- make selected non-workout screens useful offline

Recommended order:
1. Routines list
2. Last opened routine/workout preview
3. Exercise and stretch selectors
4. Profile/settings read-only data

Implementation:
- cache GET responses selectively
- keep staleness visible
- prefer "last synced" messaging over pretending data is fresh

Do not start with:
- AI generation
- bug reports
- broad profile editing
- public browsing that depends on fresh shared data

Success criteria:
- common repeat flows still function with weak/no network
- stale cached data is clearly labeled

Risk:
- medium

Data model impact:
- client-side cache only
- server schema likely unchanged

Route impact:
- none required

## Phase 6: Hardening, Tests, And Release
Goal:
- make the PWA safe to ship and maintain

Implementation:
- unit tests for queue and sync logic
- Playwright coverage for:
  - installability checks where practical
  - offline shell load
  - started workout continues offline
  - reconnect replays autosave
  - duplicate replay does not corrupt workout data
- Lighthouse/PWA audit in release process
- versioned cache invalidation strategy

Success criteria:
- clear release checklist
- deterministic upgrade behavior
- no silent sync failures

Risk:
- medium

Data model impact:
- none new if prior phases are complete

Route impact:
- none

## Recommended First Release Scope
This is the highest-leverage first shipment:

### Include
- installable app
- manifest and icons
- service worker
- cached shell/static assets
- offline page
- online/offline status UI

### Do not include yet
- full offline routine editing
- offline AI features
- aggressive API caching
- broad mutation queueing outside workout flows

This keeps the first release realistic and low risk.

## Recommended Second Release Scope
- offline continuation for an already-started workout
- queued autosave replay
- idempotent final workout save
- idempotent cardio persistence

This is the release where the PWA meaningfully improves the core Gymmer experience.

## Specific Risks In Gymmer

### Risk 1: Treating installability as equal to offline-first
These are different problems. Installability is easy. Reliable offline sync is not.

### Risk 2: Expanding `localStorage` too far
Current browser storage usage is acceptable for session state, but IndexedDB is the correct place for durable queues and cached payloads.

### Risk 3: Non-idempotent retries
Any offline queue without retry-safe server handlers will eventually create duplicate or corrupted state.

### Risk 4: Over-caching dynamic routes
Caching authenticated or frequently changing screens too aggressively can create misleading stale UI.

## Clear Answers

### Does this require another codebase?
- No.

### Are database changes required?
- Not for installability and shell caching.
- Probably yes for robust offline sync, especially around retry-safe mutations.

### Do route structures need to change?
- No broad restructure is required.
- Add manifest and offline assets/routes.
- Strengthen existing mutation routes rather than replacing them.

### Where does the PWA logic belong?
- app shell and metadata: `apps/web/app/*`
- service worker: `apps/web/public/sw.js`
- registration/bootstrap: `apps/web/app/components/PwaBootstrap.tsx`
- queue/sync/cache helpers: `apps/web/lib/pwa/*`
- workout offline orchestration: `apps/web/lib/workout-*`
- persistence and idempotency: existing API routes and database layer

## Proposed Implementation Order
1. Phase 0
2. Phase 1
3. Phase 2
4. Phase 3
5. Review performance, failure states, and update behavior
6. Phase 4
7. Phase 5 only after workout offline replay is stable
8. Phase 6 before broad rollout

## Final Recommendation
Build the PWA on top of the current web app.

The correct technical split is:
- PWA shell and installability in the app layer
- offline queue and replay in dedicated client utilities
- retry-safe writes in the existing API/database layer

The only server-side data model changes that look likely are the ones needed to make offline replay safe. Everything before that can be done without reshaping the core schema.
