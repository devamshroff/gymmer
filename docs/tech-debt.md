# Tech Debt

- LLM responses are parsed by extracting fenced JSON (regex) in several endpoints (e.g., `lib/form-tips.ts`, `app/api/routines/ai-generate/route.ts`, `app/api/workout-targets/route.ts`). Consider moving to strict schema/tooling responses to avoid brittle parsing and enforce JSON validity.
