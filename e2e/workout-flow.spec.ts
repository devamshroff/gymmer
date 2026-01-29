import { test, expect } from '@playwright/test';

test('Workout preview and edit flow', async ({ page }) => {
  await page.goto('/workout/E2E%20Routine');
  await expect(page.getByRole('heading', { name: 'E2E Routine' })).toBeVisible();

  await page.getByRole('link', { name: 'Edit Routine' }).click();
  await expect(page.getByRole('heading', { name: 'Edit: E2E Routine' })).toBeVisible();

  await page.getByRole('button', { name: 'Add Pre-Stretch' }).first().click();
  await page.getByRole('button', { name: /Chest Opener/ }).click();
  await expect(page.getByPlaceholder('Search by name or muscle group...')).toBeHidden();
  await expect(page.getByText('Chest Opener')).toBeVisible();

  await page.getByRole('button', { name: 'Done Editing' }).click();
  await expect(page.getByRole('heading', { name: 'E2E Routine' })).toBeVisible();
  await expect(page.getByText('Chest Opener')).toBeVisible();
});
