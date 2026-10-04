import { test, expect } from '@playwright/test';

test('Sign out clears local workout state and returns to login', async ({ page }) => {
  await page.goto('/settings');
  await page.evaluate(() => {
    window.localStorage.setItem('current_workout_session', '{"workoutName":"Push Day"}');
    window.localStorage.setItem('gymmer_pwa_install_dismissed', '1');
    window.sessionStorage.setItem('free_workout_setup', '{}');
  });

  await expect(page.getByRole('heading', { name: 'Account' })).toBeVisible();
  await page.getByRole('button', { name: 'Sign out' }).click();

  await expect(page).toHaveURL(/\/login/);
  const storage = await page.evaluate(() => ({
    workout: window.localStorage.getItem('current_workout_session'),
    pwaDismissed: window.localStorage.getItem('gymmer_pwa_install_dismissed'),
    sessionCount: window.sessionStorage.length,
  }));
  expect(storage.workout).toBeNull();
  expect(storage.pwaDismissed).toBe('1');
  expect(storage.sessionCount).toBe(0);
});
