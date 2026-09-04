# ADR 0004: Daily Activity Tile Logging

## Status
Accepted

## Date
2026-09-04

## Context
`/activities` only supported one way to log: a form requiring a free-text activity name and a mandatory duration in minutes. That shape was wrong for the actual nightly habit it was built to serve.

Three problems followed from it:

- **Duration was a barrier.** Most of the time the useful fact is "I ran" or "I rested", not that it took 34 minutes. Requiring minutes made the nightly reminder more expensive to act on than it was worth.
- **Free text fragmented the data.** "Yoga", "yoga", and "Yoga class" are three activities to any aggregation, so the calendar, the 30-day summary, and any MCP export could not group reliably.
- **Nothing downstream saw activities.** The `/profile` Workout Calendar was built purely from `workout_sessions`, and the MCP connector exposed no activity tools at all. A day spent running or resting looked identical to a day with nothing logged.

The nightly Web Push reminder, the `activity_logs` table, and the `/activities?date=` deep link already existed and worked.

## Decision
Make the daily tile picker the primary logging path on `/activities`, recording the activity only.

- **`lib/activity-types.ts` is the canonical preset list.** Each preset owns a stable slug, the exact label written to `activity_logs.activity_type`, an icon, and its behavioral flags. Tile logging always writes the canonical label so aggregation groups cleanly. Free text remains available through the detailed form.
- **`duration_minutes` becomes nullable.** SQLite cannot drop a `NOT NULL` constraint in place, so `ensureActivityLogsTable` rebuilds a legacy table and copies rows over.
- **`activity_logs.source` distinguishes `'tile'` from `'manual'`.** This is the mechanism that lets tile and detailed logging share one table safely.
- **Day reconcile instead of append.** `PUT /api/activities?date=YYYY-MM-DD` takes the full tile selection for a day and inserts, deletes, and refreshes notes to match. It only ever deletes `source = 'tile'` rows.
- **Tile behavior rules live with the presets, not the component.** `Rest` is exclusive. `Other class` collects the class name into `notes`. `Strength training` hides on days that already have a completed workout session, unless it is already selected there.
- **Activities join the calendar and the MCP surface.** `/api/profile/analytics` merges `activity_logs` into both calendar months, and the connector gains `list_activity_logs`, `log_activity`, and an `activities` rollup inside `get_progress_summary`.

## Consequences

Logging a day is one screen and one save. Tapping the nightly notification twice is safe: the reconcile is idempotent, and the picker seeds itself from what is already stored for that day, so re-saving the same selection is a no-op.

The `source` column is load-bearing, not decorative. Without it the day reconcile would have to delete every activity row for a date and could destroy a timed entry the user typed by hand. Any future writer into `activity_logs` must set `source` deliberately; anything writing `'tile'` becomes eligible for deletion by the reconcile.

Canonical labels are now a compatibility surface. Renaming a preset's `label` orphans previously stored rows, which will no longer map back to a tile and will stop seeding the picker. Renaming requires a data migration, not just an edit to the preset list. Slugs, which are what the API accepts, can stay stable independently.

Hiding `Strength training` behind a workout session means the tile grid's contents depend on server state for the selected day. The `hasWorkoutSession` flag is returned by `GET /api/activities?date=`, so the picker cannot render its final shape until that request resolves.

Duration is now optional across the whole feature, so any consumer of `activity_logs` must handle a null. The `/activities` summary reports "Timed minutes" rather than implying every activity contributes minutes, and the MCP export returns `durationMinutes: null` for tile logs.

Nightly reminders no longer fail silently when a push service expires a subscription: `sw.js` re-subscribes on `pushsubscriptionchange`, and `/activities` reports an expired subscription rather than showing reminders as merely off. The reminder copy is now activity-neutral ("What did you end up doing today?"), though the route path and the `last_cardio_reminder_date` column keep their `cardio` names so the external cron-job.org schedule does not need reconfiguring.
