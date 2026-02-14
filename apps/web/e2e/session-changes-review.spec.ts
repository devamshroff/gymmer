import { test, expect } from '@playwright/test';

test('Session changes banner appears in routine editor', async ({ page }) => {
  await page.goto('/workout/E2E%20Routine');
  await expect(page.getByRole('heading', { name: 'E2E Routine' })).toBeVisible();

  await page.getByRole('link', { name: 'Edit Routine' }).click();
  await expect(page.getByRole('heading', { name: 'Edit: E2E Routine' })).toBeVisible();

  const urlParts = page.url().split('/');
  const routineIndex = urlParts.indexOf('routines');
  if (routineIndex === -1 || routineIndex + 1 >= urlParts.length) {
    throw new Error('Failed to resolve routine id from edit URL');
  }
  const routineId = urlParts[routineIndex + 1];

  const sessionChanges = {
    exercises: [
      {
        id: 'test-exercise-change',
        mode: 'single',
        origin: 'add',
        exercise1: { id: 999001, name: 'Session Exercise' },
        exercise2: null,
        replacedName: null,
        createdAt: '2026-02-14T00:00:00.000Z',
      },
    ],
    preStretches: [
      {
        id: 'test-pre-stretch-change',
        stretchType: 'pre',
        origin: 'add',
        stretch: {
          id: 999002,
          name: 'Session Stretch',
          timer_seconds: 30,
          muscle_groups: null,
        },
        replacedName: null,
        createdAt: '2026-02-14T00:00:00.000Z',
      },
    ],
    postStretches: [],
  };

  await page.evaluate((payload) => {
    const key = `session_workout_changes:${encodeURIComponent(payload.routineName)}:${encodeURIComponent(payload.routineId)}`;
    sessionStorage.setItem(key, JSON.stringify(payload.changes));
  }, { routineName: 'E2E Routine', routineId, changes: sessionChanges });

  await page.goto(`/routines/${routineId}/edit?sessionChanges=1`);

  const panel = page.locator('aside');
  await expect(panel.getByText('Session changes')).toBeVisible();
  await expect(panel).toContainText('Session Exercise');
  await expect(panel).toContainText('Session Stretch');
});
