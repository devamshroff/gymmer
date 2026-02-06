# Gymmer flows and e2e coverage

This is the current set of user flows (page routes) and the e2e specs that cover them.

| Flow | Routes | E2E coverage |
| --- | --- | --- |
| Home / marketing | `/`, `/what-is-gymmer` | `home-login.spec.ts` |
| Login screen | `/login` | `home-login.spec.ts` |
| Profile settings + goals | `/profile` | `profile-flow.spec.ts` |
| Routines index + create modal | `/routines` | `routines-index.spec.ts` |
| Manual routine builder | `/routines/builder` | `routines-builder-flow.spec.ts` |
| Routine stretch selection | `/routines/[id]/stretches` | `routines-builder-flow.spec.ts` |
| Routine import (JSON) | `/routines/import` | `routines-import.spec.ts` |
| AI routine generate + preview + save | `/routines/ai`, `/routines/ai/preview` | `ai-flow.spec.ts` |
| Workout preview + edit routine | `/workout/[name]`, `/routines/[id]/edit` | `workout-flow.spec.ts` |
| Browse + clone public routines | `/routines/browse` | `browse-clone.spec.ts` |
| Pre-workout stretches | `/stretches/[workoutName]` | `ai-flow.spec.ts` |
| Resume workout from pre-workout stretches | `/stretches/[workoutName]`, `/workout/[name]/active` | `workout-resume-stretch.spec.ts` |
| Active workout (sets, warmup, navigation) | `/workout/[name]/active` | `ai-flow.spec.ts`, `workout-extra-sets.spec.ts` |
| Cardio | `/workout/[name]/cardio` | `ai-flow.spec.ts` |
| Post-workout stretches | `/workout/[name]/post-stretches` | `ai-flow.spec.ts` |
| Workout summary + report | `/workout/[name]/summary` | `ai-flow.spec.ts` |
| Workout stats export | `/workout/[name]/stats` | `workout-stats.spec.ts` |
| Report a bug | `/report-bug` | `report-bug.spec.ts` |
