import { test, expect } from '@playwright/test';

test('free workout can be saved as a routine with stretch suggestions', async ({ page }) => {
  const session = {
    workoutName: 'Free Workout',
    routineId: null,
    sessionId: null,
    startTime: '2026-02-14T00:00:00.000Z',
    exercises: [
      {
        name: 'Bench Press',
        type: 'single',
        primaryMetric: 'weight',
        metricUnit: 'lbs',
        sets: [{ weight: 100, reps: 8 }],
      },
    ],
    flow: null,
  };

  const plan = {
    name: 'Free Workout',
    preWorkoutStretches: [],
    postWorkoutStretches: [],
    exercises: [
      {
        type: 'single',
        exerciseId: 111,
        name: 'Bench Press',
        sets: 3,
        targetReps: 10,
        targetWeight: 0,
        warmupWeight: 0,
        restTime: 60,
        videoUrl: '',
        tips: '',
      },
    ],
  };

  const planKey = `session_workout_override:${encodeURIComponent(plan.name)}:default`;

  await page.addInitScript(({ sessionData, workoutPlan, storageKey }) => {
    localStorage.setItem('current_workout_session', JSON.stringify(sessionData));
    sessionStorage.setItem(storageKey, JSON.stringify(workoutPlan));
  }, { sessionData: session, workoutPlan: plan, storageKey: planKey });

  await page.route('**/api/user/settings', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        weightUnit: 'lbs',
        heightUnit: 'in',
        restTimeSeconds: 60,
        supersetRestSeconds: 15,
        timerSoundEnabled: true,
        timerVibrateEnabled: true,
      }),
    });
  });

  await page.route('**/api/user', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'user-1' }),
    });
  });

  await page.route('**/api/save-workout', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        sessionId: 1,
        totalDurationMinutes: 1,
        totalStrain: 0,
      }),
    });
  });

  await page.route('**/api/workout-report?*', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ report: null }),
    });
  });

  await page.route('**/api/workout-report', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ report: 'Nice work' }),
    });
  });

  await page.route('**/api/routines', (route) => {
    if (route.request().method() !== 'POST') {
      route.fallback();
      return;
    }
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: 123, success: true }),
    });
  });

  await page.route('**/api/routines/123/exercises', (route) => {
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, success: true }),
    });
  });

  await page.route('**/api/stretches', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ stretches: [] }),
    });
  });

  await page.route('**/api/routines/123/stretch-recommendations', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        recommendedPreIds: [],
        recommendedPostIds: [],
        createdStretches: [],
      }),
    });
  });

  await page.goto('/workout/free-workout/summary?free=1');

  await expect(page.getByText('Save as routine')).toBeVisible();
  await page.getByRole('button', { name: 'Save routine' }).click();
  await expect(page.getByRole('heading', { name: 'Save as routine' })).toBeVisible();
  await page.getByRole('button', { name: 'Save & pick stretches' }).click();

  await expect(page).toHaveURL(/\/routines\/123\/stretches$/);
  await expect(page.getByRole('heading', { name: 'Select Stretches' })).toBeVisible();
});
