import { test, expect } from '@playwright/test';

test('Resuming from pre-workout stretch preserves active exercise progress', async ({ page }) => {
  const workoutName = `Stretch Resume Routine ${Date.now()}`;
  const plan = {
    name: workoutName,
    preWorkoutStretches: [
      {
        name: 'Shoulder Rolls',
        timerSeconds: 30,
        videoUrl: '',
        tips: '',
      },
    ],
    postWorkoutStretches: [],
    exercises: [
      {
        type: 'single',
        name: 'Goblet Squat',
        sets: 3,
        targetReps: 8,
        targetWeight: 50,
        warmupWeight: 0,
        hasWarmup: false,
        restTime: 0,
        videoUrl: '',
        tips: '',
      },
    ],
  };

  await page.route('**/api/workout/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        workout: plan,
        settings: {
          restTimeSeconds: 0,
          supersetRestSeconds: 0,
          weightUnit: 'lbs',
          heightUnit: 'in',
        },
        lastSetSummaries: {},
        lastWorkoutReport: null,
        routineMeta: null,
      }),
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
      body: JSON.stringify({ success: true, sessionId: 456 }),
    });
  });

  await page.goto(`/workout/${encodeURIComponent(workoutName)}/active`);

  await expect(page.getByRole('heading', { name: 'Goblet Squat' })).toBeVisible();

  const startSetButton = page.getByRole('button', { name: /Start Set 1/ });
  const completeSet1Button = page.getByRole('button', { name: /Complete Set 1/ });
  await expect(startSetButton.or(completeSet1Button)).toBeVisible();
  if (await startSetButton.isVisible()) {
    await startSetButton.click();
  }
  await completeSet1Button.click();
  await page.getByRole('button', { name: /Complete Set 2/ }).click();

  const previousButton = page.getByRole('button', { name: '← Previous' });
  await previousButton.click();
  await expect(page.getByText('Review completed sets for this exercise.')).toBeVisible();
  await previousButton.click();

  await expect(page).toHaveURL(new RegExp(`/stretches/${encodeURIComponent(workoutName)}`));
  await expect(page.getByRole('heading', { name: 'PRE-WORKOUT STRETCH' })).toBeVisible();

  await page.getByRole('button', { name: /Start Exercises/ }).click();
  await expect(page).toHaveURL(new RegExp(`/workout/${encodeURIComponent(workoutName)}/active`));
  await expect(page.getByRole('button', { name: '✓ Complete Set 3', exact: true })).toBeVisible();
});
