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

test('Workout calendar shows standalone activity days alongside workouts', async ({ page }) => {
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

  const emptyCalendar = (year: number, month: number) => ({
    year,
    month,
    startWeekday: 0,
    days: [
      // A workout day.
      { date: `${year}-0${month}-01`, count: 1, workoutNames: ['Push Day'], activityNames: [] },
      // An activity-only day: no workout session, but the day was not empty.
      { date: `${year}-0${month}-02`, count: 0, workoutNames: [], activityNames: ['Ran', 'Stretches'] },
      // A day with neither.
      { date: `${year}-0${month}-03`, count: 0, workoutNames: [], activityNames: [] },
    ],
  });

  await page.route('**/api/profile/analytics**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        rangeDays: 30,
        calendar: emptyCalendar(2026, 5),
        calendarPrev: emptyCalendar(2026, 4),
        summary: {
          workoutsLogged: 1,
          avgDuration: null,
          longestStreak: 1,
          trend: [{ day: '2026-05-01', count: 1 }],
        },
        topWorkouts: [],
        progressLeaders: { volume: [], maxWeight: [] },
        exercises: [],
      }),
    });
  });

  await page.goto('/profile');

  const activityDay = page.getByTestId('calendar-day-2026-05-02');
  await expect(activityDay).toHaveAttribute('data-has-activity', 'true');
  await expect(activityDay).toHaveAttribute('title', /Activities: Ran, Stretches/);
  await expect(activityDay).toContainText('Ran');

  const workoutDay = page.getByTestId('calendar-day-2026-05-01');
  await expect(workoutDay).toHaveAttribute('data-has-activity', 'false');
  await expect(workoutDay).toHaveAttribute('title', /1 workout: Push Day/);

  const emptyDay = page.getByTestId('calendar-day-2026-05-03');
  await expect(emptyDay).toHaveAttribute('title', 'Nothing logged');
});
