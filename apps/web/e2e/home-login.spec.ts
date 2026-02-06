import { test, expect } from '@playwright/test';

test('Home, marketing, and login pages load', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'My Routines' })).toBeVisible();

  await page.getByRole('link', { name: 'What is Gymmer?' }).click();
  await expect(page.getByRole('heading', { name: 'What is Gymmer?' })).toBeVisible();

  await page.goto('/login?error=AccessDenied');
  await expect(page.getByText("You're not authorized to access Gymmer.")).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
});
