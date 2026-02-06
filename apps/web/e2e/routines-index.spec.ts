import { test, expect } from '@playwright/test';

test('Routines index and create modal flow', async ({ page }) => {
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
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        routines: [
          {
            id: 101,
            name: 'E2E Routine',
            description: 'Seeded routine for e2e.',
            is_public: 0,
            user_id: 'e2e@test.local',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      }),
    });
  });

  await page.route('**/api/routines/favorites', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ routines: [] }) });
  });

  await page.route('**/api/routines/public', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ routines: [] }),
    });
  });

  await page.goto('/routines');
  await expect(page.getByRole('heading', { name: 'My Routines', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'E2E Routine' })).toBeVisible();

  await page.getByRole('button', { name: '+ Create New Routine' }).click();
  await expect(page.getByRole('heading', { name: 'Create a new routine' })).toBeVisible();

  await page.getByRole('button', { name: 'Manual Builder' }).click();
  await expect(page).toHaveURL(/\/routines\/builder/);
});
