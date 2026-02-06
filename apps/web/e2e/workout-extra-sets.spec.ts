import { test, expect } from '@playwright/test';

test('Workout flow supports adding extra sets on last set and in review mode', async ({ page }) => {
  const workoutName = `Extra Set Routine ${Date.now()}`;
  const plan = {
    name: workoutName,
    preWorkoutStretches: [],
    postWorkoutStretches: [],
    exercises: [
      {
        type: 'single',
        name: 'Bench Press',
        sets: 3,
        targetReps: 8,
        targetWeight: 135,
        warmupWeight: 0,
        hasWarmup: false,
        restTime: 0,
        videoUrl: '',
        tips: '',
      },
      {
        type: 'single',
        name: 'Incline Press',
        sets: 1,
        targetReps: 8,
        targetWeight: 95,
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
      body: JSON.stringify({ success: true, sessionId: 123 }),
    });
  });

  await page.goto(`/workout/${encodeURIComponent(workoutName)}/active`);

  await expect(page.getByRole('heading', { name: 'Bench Press' })).toBeVisible();

  const startSetButton = page.getByRole('button', { name: /Start Set 1/ });
  const completeSet1Button = page.getByRole('button', { name: /Complete Set 1/ });
  await expect(startSetButton.or(completeSet1Button)).toBeVisible();
  if (await startSetButton.isVisible()) {
    await startSetButton.click();
  }
  await completeSet1Button.click();
  await page.getByRole('button', { name: /Complete Set 2/ }).click();

  const completeAndAddButton = page.getByRole('button', { name: /Complete Set 3 \+ Add another set/ });
  await expect(completeAndAddButton).toBeVisible();
  await completeAndAddButton.click();
  const completeSet4Button = page.getByRole('button', { name: /Complete Set 4$/ });
  await expect(completeSet4Button).toBeVisible();
  await completeSet4Button.click();

  const readyButton = page.getByRole('button', { name: "I'm Ready →" });
  await readyButton.click();

  await expect(page.getByRole('heading', { name: 'Incline Press' })).toBeVisible();
  await page.getByRole('button', { name: '← Previous' }).click();

  await expect(page.getByText('EDIT COMPLETED SETS')).toBeVisible();
  await page.getByRole('button', { name: '+ Add another set' }).click();
  await expect(page.getByText('Set 5')).toBeVisible();
});
