# Gymmer Monorepo

Structure:

- apps/web: Next.js web app
- apps/ios: iOS app (Xcode project lives here)
- packages/shared: shared contracts/docs (optional)

## Requirements

- Bun (recommended)
- Node.js (required by Next.js)

## Install (root)

```
bun install
```

This installs dependencies for the web app using Bun workspaces.

## Run the web app

From the repo root:

```
bun run dev
```

Other useful commands:

```
bun run build
bun run start
bun run lint
bun run test
bun run test:run
bun run test:e2e
```

## Notes

- Web app environment files live in `apps/web` (e.g. `apps/web/.env.local`).
- You can still run commands directly inside `apps/web` if you prefer.
