import { defineConfig, devices } from '@playwright/test';

const port = process.env.PLAYWRIGHT_PORT || '3100';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${port}`;
const useExternalServer = process.env.PLAYWRIGHT_EXTERNAL === '1';

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  fullyParallel: false,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      'x-e2e-bypass': '1',
    },
  },
  webServer: useExternalServer
    ? undefined
    : {
        command: `bun run dev -- -p ${port}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
          E2E_TEST: '1',
          NEXTAUTH_URL: baseURL,
          TURSO_DATABASE_URL: `file:${process.cwd()}/.e2e/gymmer.db`,
          TURSO_AUTH_TOKEN: 'local',
        },
      },
  globalSetup: './e2e/global-setup.ts',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
