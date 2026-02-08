# Director of Engineering Review

## Summary
This plan attempts a single-shot delivery of full web parity plus new features. It is ambitious, with multiple high-risk areas (auth, workout flow complexity, AI integrations, analytics) bundled into a single cut.

## Major Risks
1. Scope Compression
   - Full parity + new features is too broad for a single delivery without schedule risk.
2. Auth Constraints
   - Apple Sign-In requires paid developer program for device testing and distribution.
   - Google Sign-In on device may be blocked without proper provisioning.
3. Workout Flow Complexity
   - Autosave + editing + supersets + history/targets are high-interaction, high-bug surface.
4. API Coupling
   - Web APIs weren’t designed for mobile ergonomics (multi-call startup, inconsistent error contracts).
5. Analytics Undefined
   - Analytics data model and endpoints need clarity before implementation.

## Gaps / Missing Detail
- Exact API contract for token exchange and mobile session handling
- Clear analytics endpoints and payloads
- UI/UX design system for mobile
- Performance requirements (payload size, cold start)

## Recommendations
- Still deliver “one shot,” but predefine internal checkpoints with exit criteria.
- Prioritize API hardening early: token exchange, bootstrap endpoints, consistent errors.
- Implement analytics in a thin v1 (read-only) to avoid scope creep.
- Explicitly limit offline scope (session persistence only, no full offline routines).

## Approval Conditions
- A documented API contract for mobile auth + bootstrap
- A test matrix covering workout state + autosave + editing
- Clear decision on analytics data source and time ranges

