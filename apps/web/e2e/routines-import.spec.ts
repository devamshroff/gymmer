import { test, expect } from '@playwright/test';

test('Import routine from JSON flow', async ({ page }) => {
  await page.route('**/api/routines/import', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 999, success: true }) });
  });

  await page.route('**/api/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'e2e@test.local', username: 'e2e', hasUsername: true }),
    });
  });

  await page.route('**/api/routines', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ routines: [] }) });
  });

  await page.route('**/api/routines/favorites', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ routines: [] }) });
  });

  await page.route('**/api/routines/public', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ routines: [] }) });
  });

  await page.goto('/routines/import');

  const filePayload = {
    name: 'import.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      name: 'Imported Routine',
      exercises: [{ type: 'single', name: 'Bench Press' }],
    })),
  };

  await page.setInputFiles('input[type="file"]', filePayload);
  await expect(page.getByText('Successfully imported "Imported Routine"!')).toBeVisible();

  await page.waitForURL('/routines', { timeout: 5000 });
});
