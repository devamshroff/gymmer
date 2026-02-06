import { test, expect } from '@playwright/test';

test('Manual routine builder and stretch selection flow', async ({ page }) => {
  const routineId = 555;

  await page.route('**/api/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'e2e@test.local', username: 'e2e', hasUsername: true }),
    });
  });

  await page.route('**/api/routines', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: routineId }) });
      return;
    }
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ routines: [] }) });
      return;
    }
    await route.continue();
  });

  await page.route(`**/api/routines/${routineId}/exercises`, async (route) => {
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  });

  await page.route(`**/api/routines/${routineId}/stretch-recommendations`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        recommendedPreIds: [1],
        recommendedPostIds: [2],
        createdStretches: [],
      }),
    });
  });

  await page.route(`**/api/routines/${routineId}/stretches`, async (route) => {
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  });

  await page.route('**/api/exercises', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        exercises: [
          {
            id: 1,
            name: 'Bench Press',
            equipment: 'Barbell',
            video_url: null,
            tips: null,
            is_bodyweight: 0,
            is_machine: 0,
            primary_metric: 'weight',
            metric_unit: 'lbs',
            muscle_groups: 'chest',
          },
        ],
      }),
    });
  });

  await page.route('**/api/stretches', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        stretches: [
          { id: 1, name: 'Arm Circles', timer_seconds: 30, muscle_groups: 'shoulders', tips: null, video_url: null },
          { id: 2, name: 'Lat Stretch', timer_seconds: 45, muscle_groups: 'back', tips: null, video_url: null },
        ],
      }),
    });
  });

  await page.route('**/api/routines/favorites', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ routines: [] }) });
  });

  await page.route('**/api/routines/public', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ routines: [] }) });
  });

  await page.goto('/routines/builder');
  await page.getByPlaceholder('e.g., Upper Body Day A').fill('E2E Manual Routine');
  await page.getByRole('button', { name: 'Create Routine' }).click();

  await expect(page.getByRole('heading', { name: 'E2E Manual Routine' })).toBeVisible();

  await page.getByRole('button', { name: '+ Exercise' }).click();
  await expect(page.getByRole('heading', { name: 'Select Exercise' })).toBeVisible();
  await page.getByRole('button', { name: 'Bench Press' }).click();

  await expect(page.getByText('Bench Press')).toBeVisible();

  await page.getByRole('button', { name: 'Continue to Stretches' }).click();
  await expect(page.getByRole('heading', { name: 'Select Stretches' })).toBeVisible();

  await page.getByRole('button', { name: 'Arm Circles' }).click();
  await page.getByRole('button', { name: /Post-Workout/ }).click();
  await page.getByRole('button', { name: 'Lat Stretch' }).click();

  await page.getByRole('button', { name: 'Save & Finish Routine' }).click();
  await expect(page).toHaveURL(/\/routines/);
});
