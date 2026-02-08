# Test Plan

## Unit Tests (iOS)
- Model decoding for all API responses
- Metric/unit conversions (weight/height/time/distance)
- Workout session calculations (volume, duration)
- Session state transitions (in-progress → completed)

## Integration Tests (iOS)
- API client calls (happy path)
- Auth token exchange + refresh behavior
- Autosave retry logic
- Routine CRUD flows
- Exercise history retrieval
- Analytics data fetch

## UI Tests (XCUITest)
- Login flow (Google)
- Routines list → preview → start workout
- Active workout: set entry + rest timer
- Edit earlier set during workout
- Save workout → summary
- Routine builder create + edit
- Profile settings update
- Analytics page open + filter

## Backend/API Tests (Server)
- Token exchange endpoint
- Workout autosave upsert logic
- Routine edit endpoints
- Exercise history range handling
- Analytics endpoint data aggregation

## Manual QA Checklist
- Cold start → login → routine → workout
- App kill/relaunch → resume workout
- Add/replace exercise mid-workout
- Superset handling
- Long workout session + autosave stability
- AI features response parsing
- Bug report submission with screenshot

