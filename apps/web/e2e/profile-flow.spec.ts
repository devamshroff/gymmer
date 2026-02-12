import { test, expect } from '@playwright/test';

test('Profile settings and goals flow', async ({ page }) => {
  await page.route('**/api/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'e2e@test.local',
        username: 'e2e',
        name: 'E2E User',
        email: 'e2e@test.local',
      }),
    });
  });

  await page.route('**/api/user/settings', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        restTimeSeconds: 60,
        supersetRestSeconds: 15,
        weightUnit: 'lbs',
        heightUnit: 'in',
      }),
    });
  });

  await page.route('**/api/goals', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ goals: 'Build strength and improve conditioning.' }),
    });
  });

  await page.goto('/profile');
  await expect(page.getByRole('heading', { name: '@e2e' })).toBeVisible();

  await page.getByLabel('Goals & preferences').fill('Focus on upper body strength.');
  await page.getByRole('button', { name: 'Save Goals' }).click();
  await expect(page.getByText('Saved')).toHaveCount(1);

  await page.getByLabel('Open settings').click();
  await expect(page).toHaveURL('/settings');

  await page.getByLabel('Rest time between sets (seconds)').fill('45');
  await page.getByLabel('Rest time between superset rounds (seconds)').fill('20');
  await page.getByLabel('Weight unit').selectOption('kg');
  await page.getByLabel('Height unit').selectOption('cm');
  await page.getByRole('button', { name: 'Save Settings' }).click();

  await expect(page.getByText('Saved')).toHaveCount(1);
});
