import { test, expect } from '@playwright/test';

test('Workout stats flow loads session data', async ({ page }) => {
  const session = {
    workoutName: 'E2E Routine',
    routineId: null,
    sessionId: null,
    startTime: new Date().toISOString(),
    exercises: [
      {
        name: 'Bench Press',
        type: 'single',
        primaryMetric: 'weight',
        metricUnit: 'lbs',
        sets: [{ weight: 135, reps: 8 }],
      },
    ],
  };

  await page.addInitScript((data) => {
    localStorage.setItem('current_workout_session', JSON.stringify(data));
  }, session);

  await page.route('**/api/workout/E2E%20Routine', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        workout: {
          name: 'E2E Routine',
          preWorkoutStretches: [],
          postWorkoutStretches: [],
          exercises: [
            {
              type: 'single',
              name: 'Bench Press',
              sets: 1,
              targetReps: 8,
              targetWeight: 135,
              warmupWeight: 0,
              hasWarmup: false,
              restTime: 60,
              videoUrl: '',
              tips: '',
            },
          ],
        },
      }),
    });
  });

  await page.route('**/api/user/settings', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ weightUnit: 'lbs', heightUnit: 'in' }),
    });
  });

  await page.goto('/workout/E2E%20Routine/stats');
  await expect(page.getByRole('heading', { name: 'Workout Stats' })).toBeVisible();
  await expect(page.getByText('Bench Press')).toBeVisible();
});
