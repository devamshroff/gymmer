# ADR 0005: Routine Names Are Unique Per User

## Status
Accepted

## Date
2026-10-04

## Context
Gymmer began as a single-user tool, and the `routines` table declared `name TEXT NOT NULL UNIQUE`. Everything else in the multi-user design already scoped routines by owner: lookups use `getRoutineByName(name, userId)`, the import route checks for a duplicate within the caller's routines, and `cloneRoutine` picks a name that is unique for the cloning user. The global constraint contradicted all of that. Once friends started using the app, a second account could not create "Push Day" if any other account already had one. The API reported this as "already exists", even though that user owned no routine by that name.

## Decision
Routine names are unique per `(user_id, name)` and nowhere else.

- `lib/db-schema.sql` drops the column-level `UNIQUE` and adds `idx_routines_user_name`, a unique index on `(user_id, name)`.
- `ensureRoutineNamesScopedPerUser()` in `lib/database.ts` migrates existing databases. If the live `routines` DDL still declares the global `UNIQUE`, the helper rebuilds the table from that same DDL with only the constraint removed. Rebuilding from the live DDL keeps legacy columns such as `is_custom`. On an already migrated database, the helper only ensures the index exists. It runs before every routine write that sets a name: create, rename, clone, and JSON import.
- The rebuild runs through libSQL's `client.migrate()`, which disables foreign keys for the batch.

## Consequences
`routine_exercises`, `routine_pre_stretches`, `routine_post_stretches`, `routine_cardio`, and `routine_favorites` all reference `routines(id)` with `ON DELETE CASCADE`. When foreign keys are on, the rename-recreate-drop pattern used for `activity_logs` (ADR 0004) silently deletes every child row. Any future rebuild of `routines`, or of any table that has cascading children, must use `migrate()` or otherwise disable foreign keys. `__tests__/lib/routine-name-scope.test.ts` runs against a real SQLite file to prove that the children survive.

Routine names are no longer globally meaningful. Any code that resolves a routine by name must also filter by owner. The `/workout/[name]` lookup already resolves the caller's own routine first, then the caller's favorited routines.
