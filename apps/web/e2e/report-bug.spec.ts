import { test, expect } from '@playwright/test';

test('Report bug form shows confirmation after submit', async ({ page }) => {
  await page.route('**/api/report-bug', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 303,
      headers: {
        location: '/report-bug?status=sent',
      },
    });
  });

  await page.goto('/report-bug');
  await expect(page.getByRole('heading', { name: 'Help us squash this bug' })).toBeVisible();

  await page.getByLabel('What happened?').fill('The timer freezes after clicking start.');
  await page.getByLabel(/Steps to reproduce/).fill('1. Start a workout\n2. Click the timer\n3. Observe freeze');

  const submitResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/api/report-bug') &&
    response.request().method() === 'POST'
  );
  await page.getByRole('button', { name: 'Send report' }).click();

  await submitResponsePromise;
  await page.goto('/report-bug?status=sent');

  await expect(page).toHaveURL(/\/report-bug\?status=sent/);
  await expect(page.getByText('Thanks for the report!')).toBeVisible();
});
