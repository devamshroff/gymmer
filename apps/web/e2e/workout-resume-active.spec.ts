import { test, expect } from '@playwright/test';

test('Resume active routine after leaving workout', async ({ page }) => {
  const workoutName = `Active Resume Routine ${Date.now()}`;
  const plan = {
    name: workoutName,
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
        restTime: 0,
        videoUrl: '',
        tips: '',
      },
    ],
  };

  await page.route('**/api/workout/**', async (route) => {
    const url = route.request().url();
    const isBootstrap = url.includes('bootstrap=1');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(isBootstrap ? {
        workout: plan,
        settings: {
          restTimeSeconds: 0,
          supersetRestSeconds: 0,
          weightUnit: 'lbs',
          heightUnit: 'in',
          timerSoundEnabled: false,
          timerVibrateEnabled: false,
        },
        lastSetSummaries: {},
        lastWorkoutReport: null,
        routineMeta: null,
      } : { workout: plan }),
    });
  });

  await page.route('**/api/last-exercise**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ lastLog: null }),
    });
  });

  await page.route('**/api/workout-autosave', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, sessionId: 789 }),
    });
  });

  await page.route('**/api/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'user-1', username: 'tester', hasUsername: true }),
    });
  });

  await page.route('**/api/routines/favorites', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ routines: [] }),
    });
  });

  await page.route('**/api/routines/public', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ routines: [] }),
    });
  });

  await page.route('**/api/routines', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ routines: [] }),
    });
  });

  await page.route('**/api/user/settings', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ weightUnit: 'lbs', heightUnit: 'in', timerSoundEnabled: false, timerVibrateEnabled: false }),
    });
  });

  await page.route('**/api/save-workout', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  });

  await page.route('**/api/workout-report**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ report: null }) });
  });

  await page.goto(`/workout/${encodeURIComponent(workoutName)}/active`);
  await expect(page.getByRole('heading', { name: 'Bench Press' })).toBeVisible();

  const startSetButton = page.getByRole('button', { name: /Start Set 1/ });
  if (await startSetButton.isVisible()) {
    await startSetButton.click();
  }

  await page.waitForFunction(() => !!localStorage.getItem('active_routines_v1:user-1'));

  await page.goto('/routines');
  await expect(page.getByRole('heading', { name: 'Active Routines' })).toBeVisible();
  await expect(page.getByText(workoutName)).toBeVisible();
  await page.getByRole('button', { name: 'Resume' }).click();

  await expect(page).toHaveURL(new RegExp(`/workout/${encodeURIComponent(workoutName)}/active`));
  await expect(page.getByRole('heading', { name: 'Bench Press' })).toBeVisible();

  if (await page.getByRole('button', { name: /Start Set 1/ }).isVisible()) {
    await page.getByRole('button', { name: /Start Set 1/ }).click();
  }
  await page.getByRole('button', { name: /Complete Set 1/ }).click();

  await expect(page.getByRole('heading', { name: 'CARDIO' })).toBeVisible();
  await page.getByRole('button', { name: 'Skip Cardio', exact: true }).click();

  await expect(page.getByText('No post-workout stretches')).toBeVisible();
  await page.getByRole('button', { name: /View Summary/ }).click();

  await expect(page.getByRole('heading', { name: 'Workout Complete!' })).toBeVisible();
  await page.goto('/routines');
  await expect(page.getByRole('heading', { name: 'Active Routines' })).toHaveCount(0);
});
