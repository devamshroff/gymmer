import { test, expect } from '@playwright/test';

test('Browse public routines and clone', async ({ page }) => {
  const clonedRoutine = {
    id: 420,
    name: 'Sais Routine (Copy)',
    description: 'Public routine for clone.',
    is_public: 0,
    user_id: 'e2e@test.local',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  let cloneCompleted = false;

  await page.route('**/api/routines/**/clone', async (route) => {
    cloneCompleted = true;
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, routineId: clonedRoutine.id }),
    });
  });

  await page.route('**/api/routines', async (route) => {
    if (route.request().method() !== 'GET' || !cloneCompleted) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ routines: [clonedRoutine] }),
    });
  });

  await page.goto('/routines/browse');
  await expect(page.getByRole('heading', { name: 'Browse Public Routines' })).toBeVisible();

  const routineCard = page.getByText('Sais Routine');
  await expect(routineCard).toBeVisible();

  const cloneResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/api/routines/') &&
    response.url().includes('/clone') &&
    response.request().method() === 'POST'
  );
  await page.getByRole('button', { name: 'Clone' }).first().click();
  const cloneResponse = await cloneResponsePromise;
  expect(cloneResponse.status()).toBe(201);

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sais Routine (Copy)' })).toBeVisible();
});
