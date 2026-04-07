# ADRs

Architecture Decision Records live here.

Use an ADR when a decision would be expensive to rediscover later, especially when it affects:
- product surface and repo boundaries
- storage or sync contracts
- framework-level structure
- how agent/context docs are maintained

Guidelines:
- use `NNNN-short-kebab-case.md`
- keep status explicit: `Accepted`, `Superseded`, or `Deprecated`
- record the date in `YYYY-MM-DD` format
- prefer short decisions with concrete consequences over long background sections

Current ADRs:
- `0001-web-app-source-of-truth.md`
- `0002-agent-context-and-architecture-index.md`
