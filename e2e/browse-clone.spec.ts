import { test, expect } from '@playwright/test';

test('Browse public routines and clone', async ({ page }) => {
  await page.goto('/routines/browse');
  await expect(page.getByRole('heading', { name: 'Browse Public Routines' })).toBeVisible();

  const routineCard = page.getByText('Sais Routine');
  await expect(routineCard).toBeVisible();

  await page.getByRole('button', { name: 'Clone' }).first().click();
  await expect(page.getByText('Saved to your routines!')).toBeVisible();

  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Sais Routine' })).toBeVisible();
});
