# Scenarios & User Flows

## Auth & Session
- Sign in with Google (success)
- Sign in with Google (cancel/failure)
- Session persisted across app restart
- Logout clears tokens and local session

## Routine Discovery & Management
- View my routines
- View public routines + preview
- Favorite/unfavorite routine
- Clone routine
- Create routine (single + superset)
- Edit routine (add/remove/reorder exercises)
- Edit routine stretches (pre/post)
- Set routine private/public
- Delete routine

## Workout Flow
- Start workout from routine preview
- Resume in-progress workout after app restart
- Add exercise during workout
- Replace exercise during workout
- Edit earlier sets (navigate backward)
- Superset exercise flow
- Rest timer behavior (start/pause/reset)
- Cardio section entry
- Finish workout and save
- View summary + stats

## History & Insights
- View exercise history chart (fetch on demand)
- View last set summaries
- View workout targets (AI)
- View workout report (AI)

## Profile & Settings
- Username setup required before routine sharing
- Update units + rest timers
- Update goals text
- View profile info

## AI Workflows
- Generate routine from prompt
- Preview generated routine
- Save generated routine
- Stretch recommendations for routine

## Analytics (New)
- Open user analytics page
- View key metrics (session count, volume trends, PRs)
- Filter by time range

## Bug Reporting
- Open report bug form
- Submit report without screenshot
- Submit report with screenshot
- Error handling on failed submission

## Error/Edge Scenarios
- API 401 → auth required
- API 500 → user-friendly error
- Network loss during workout autosave
- Network loss during save
- Missing exercise data (empty history)
- Invalid routine data returned

