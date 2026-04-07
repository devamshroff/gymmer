import { test, expect } from '@playwright/test';

test('free workout setup boots into active workout', async ({ page }) => {
  await page.route('**/api/free-workout/bootstrap', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        sessionMode: 'maintenance',
        source: 'ai',
        encouragement: 'Keep it smooth.',
        goalSummary: 'Targets are ready.',
        trendSummary: 'Bench and rows have history.',
        targetsByExercise: {
          'Bench Press': { suggestedWeight: 135, suggestedReps: 8 },
        },
        popularExercises: [
          {
            id: 1,
            name: 'Bench Press',
            video_url: null,
            tips: null,
            equipment: 'Barbell',
            history_count: 12,
            recent_count: 4,
          },
        ],
        popularSupersets: [
          {
            exercise1: { id: 1, name: 'Bench Press', video_url: null, tips: null },
            exercise2: { id: 2, name: 'Chest Fly', video_url: null, tips: null },
            totalCount: 5,
            recentCount: 2,
            lastUsedAt: '2026-04-01T12:00:00.000Z',
          },
        ],
      }),
    });
  });

  await page.route('**/api/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'e2e@test.local' }),
    });
  });

  await page.route('**/api/user/settings', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        weightUnit: 'lbs',
        heightUnit: 'in',
        restTimeSeconds: 75,
        supersetRestSeconds: 20,
        timerSoundEnabled: true,
        timerVibrateEnabled: true,
      }),
    });
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
            video_url: null,
            tips: null,
            equipment: 'Barbell',
            muscle_groups: '["chest"]',
          },
          {
            id: 2,
            name: 'Chest Fly',
            video_url: null,
            tips: null,
            equipment: 'Machine',
            muscle_groups: '["chest"]',
          },
        ],
      }),
    });
  });

  await page.goto('/free-workout');
  await expect(page.getByRole('heading', { name: 'How are you feeling today?' })).toBeVisible();

  await page.getByRole('button', { name: /Maintenance/i }).click();
  await page.getByRole('button', { name: 'Start free workout' }).click();

  await expect(page).toHaveURL(/\/workout\/free-workout\/active\?free=1/);
  await expect(page.getByText('No exercises yet.')).toBeVisible();
  await expect(page.getByRole('button', { name: '+ Add Exercise' })).toBeVisible();

  await page.getByRole('button', { name: '+ Add Exercise' }).click();
  await expect(page.getByText('Most Popular Exercises')).toBeVisible();
  await expect(page.getByText('Common Pairings')).toBeVisible();
  await expect(page.getByRole('button', { name: /Bench Press Barbell/i }).first()).toBeVisible();
});
