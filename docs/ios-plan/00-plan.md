# iOS App Plan (Single-Delivery, Full Parity + Recent Additions)

## Goal
Ship the entire Gymmer iOS app in one delivery with feature parity to the current web app, plus newly added features (user analytics page, navigation refinements, and additional editing workflows).

## Assumptions & Constraints
- Single delivery: no phased releases or partial features.
- Backend and DB schema remain unchanged.
- Authentication: Google Sign-In first; Apple Sign-In can be added later when developer program is enabled.
- For now, Google Sign-In must work without paid Apple Developer Program (simulator + basic config).
- Web app remains the source of truth for features and API behavior.

## Scope (Must-Have)
1. Authentication & Session
   - Google Sign-In (native iOS)
   - Session/token storage (Keychain)
   - Logout
2. Core Workout Flow
   - Routines list + browse public routines
   - Routine preview (targets, history, settings)
   - Active workout: sets, rest timers, supersets, cardio
   - Edit during workout (navigate backward and modify sets)
   - Autosave per set to `/api/workout-autosave`
   - Final save `/api/save-workout`
   - Post-workout summary + stats
3. Routine Management
   - Create routine (builder)
   - Edit routine (add/remove/reorder exercises, stretches)
   - Favorites + clone
   - Public/private toggle
4. Exercise & Stretch Libraries
   - Search exercises/stretches
   - Video links + form tips
5. User Profile
   - Username setup
   - Settings: rest timers + units
   - Goals text
6. AI Features
   - AI routine generation
   - Stretch recommendations
   - Workout targets + report
7. New Features (Recently Added)
   - User analytics page
   - Navigation updates (new tabs/flows)
   - Additional editing workflows (routine editing, workout edits, etc.)
8. Bug Reporting
   - Report bug with screenshot (Resend email flow)

## Non-Goals
- Offline routine browsing or editing (online-only for routines)
- Cross-platform (Android)
- Apple Health / Watch / Widgets
- Payments/subscriptions

## Architecture
- UI: SwiftUI (iOS 17+ baseline)
- Network: URLSession + async/await
- Auth: Google Sign-In SDK, backend token exchange
- Storage:
  - Keychain for tokens
  - Local persistence for in-progress workout session (SQLite/GRDB or JSON file)
- Analytics: client-side events forwarded to backend (or separate service)

## API Surface (Existing)
- Auth: `/api/auth/*` (add token exchange endpoint)
- Workout: `/api/workout/[name]`, `/api/save-workout`, `/api/workout-autosave`
- History: `/api/exercise-history`, `/api/last-exercise`
- Routines: `/api/routines/*`, `/api/routines/[id]/*`, `/api/routines/ai-generate`
- Exercises/Stretches: `/api/exercises`, `/api/stretches`
- User: `/api/user`, `/api/user/settings`, `/api/goals`
- Reports: `/api/workout-report`, `/api/workout-targets`
- Bug reports: `/api/report-bug`

## Data Model Mapping
- Mirror `lib/types.ts`, `lib/constants.ts`, `lib/metric-utils.ts` in Swift models
- Provide strict decoding for nullable fields and numeric conversions

## Workstreams & Tasks (Single Delivery)
1. iOS App Foundation
   - Xcode project setup
   - App navigation + base styling
   - Central API client + error handling
   - Auth module (Google Sign-In + token storage)
2. Workout Flow
   - Workout preview + session bootstrap
   - Active workout UI (sets, rest timer, supersets)
   - In-session editing (back navigation + update sets)
   - Autosave per set
   - Final save + summary
3. Routines
   - List + public browse + favorites
   - Create + edit routines
   - Import/clone
   - Stretch linking
4. User Profile + Settings
   - Username setup
   - Units/rest timers
   - Goals text
5. AI Features
   - Routine generation UI + preview
   - Targets + post-workout report
   - Stretch recommendations
6. New Features
   - User analytics page
   - Navigation changes (tabs/menus)
   - Extra edit flows
7. QA/Polish
   - Error states
   - Loading states
   - Accessibility
   - Edge cases

## Deliverables
- Complete iOS app with parity + new features
- API token exchange endpoint
- Shared API docs + model mapping notes

