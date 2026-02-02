import { test, expect } from '@playwright/test';

test('AI routine flow: generate, edit, save, and complete workout', async ({ page }) => {
  const routineName = `E2E AI Routine ${Date.now()}`;
  const routineId = 9001;
  const autosaveEvents: Array<any> = [];
  let saveWorkoutCalled = false;
  const samplePlan = {
    name: routineName,
    description: 'Short push session for testing.',
    exercises: [
      {
        type: 'single',
        name: 'Bench Press',
        sets: 1,
        targetReps: 8,
        targetWeight: 135,
        warmupWeight: 0,
        restTime: 1,
        videoUrl: '',
        tips: 'Keep elbows tucked.'
      }
    ],
    preWorkoutStretches: [],
    postWorkoutStretches: [],
    cardio: {
      type: 'Bike',
      duration: '10 min',
      intensity: 'Moderate',
      tips: 'Keep a steady pace.'
    }
  };

  await page.route('**/api/user/settings', async (route) => {
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

  await page.route('**/api/routines/ai-generate', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ workoutPlan: samplePlan }),
    });
  });

  await page.route('**/api/routines/import', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: routineId, success: true }),
    });
  });

  await page.route('**/api/routines', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        routines: [
          {
            id: routineId,
            name: routineName,
            description: samplePlan.description,
            is_public: 1,
            user_id: 'e2e@test.local',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      }),
    });
  });

  await page.route('**/api/workout/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ workout: samplePlan }),
    });
  });

  await page.route('**/api/save-workout', async (route) => {
    saveWorkoutCalled = true;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });

  await page.route('**/api/workout-autosave', async (route) => {
    const payload = route.request().postDataJSON();
    autosaveEvents.push(payload);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, sessionId: 123 }),
    });
  });

  await page.route('**/api/workout-report', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ report: 'Great session. Keep it up!' }),
    });
  });

  await page.route('**/api/workout-targets', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        encouragement: 'Targets ready.',
        goalSummary: 'Build strength.',
        trendSummary: 'Trending steady.',
        targets: [
          {
            name: 'Bench Press',
            suggestedWeight: 135,
            suggestedReps: 8,
            rationale: 'Baseline target for today.'
          }
        ]
      }),
    });
  });

  await page.goto('/routines/ai');

  await page.getByPlaceholder('Example: 45-minute pull day focused on hypertrophy. Target lats and biceps. No deadlifts. Mild shoulder impingement. Home gym with dumbbells and pull-up bar.')
    .fill('Build a quick push workout for chest and triceps.');

  await page.getByRole('button', { name: 'Generate Routine' }).click();
  await expect(page.getByText('Routine generated!')).toBeVisible();

  await page.getByRole('button', { name: 'View Workout' }).click();
  await expect(page.getByRole('heading', { name: 'Routine Preview' })).toBeVisible();

  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('button', { name: 'Add Pre-Stretch' }).first().click();
  await page.getByRole('button', { name: 'Arm Circles' }).click();

  await page.getByRole('button', { name: 'Save & Exit' }).click();
  await page.waitForURL('/routines', { timeout: 20000 });

  const routineCard = page.getByRole('heading', { name: routineName }).locator('..').locator('..').locator('..');
  await expect(routineCard).toBeVisible();
  await routineCard.getByRole('link', { name: 'Start' }).click();
  await expect(page.getByRole('heading', { name: routineName })).toBeVisible();

  const modeGate = page.getByRole('heading', { name: 'How are you feeling today?' });
  try {
    await modeGate.waitFor({ timeout: 2000 });
    await page.getByRole('button', { name: /Progress/ }).click();
  } catch {
    // Mode already selected; continue.
  }

  await page.getByRole('button', { name: 'Start Workout' }).click();
  await expect(page).toHaveURL(new RegExp(`/stretches/${encodeURIComponent(routineName)}`));

  const skipAllButton = page.getByRole('button', { name: 'Skip All →', exact: true });
  const startExercisesButton = page.getByRole('button', { name: 'Start Exercises →' });
  await Promise.race([
    skipAllButton.waitFor({ timeout: 5000 }),
    startExercisesButton.waitFor({ timeout: 5000 }),
  ]);
  if (await skipAllButton.isVisible()) {
    await skipAllButton.click();
  } else {
    await startExercisesButton.click();
  }
  await expect(page).toHaveURL(new RegExp(`/workout/${encodeURIComponent(routineName)}/active`));

  const startSetButton = page.getByRole('button', { name: 'Start Set 1' });
  const warmupButton = page.getByRole('button', { name: 'Warm up' });
  await Promise.race([
    startSetButton.waitFor({ timeout: 5000 }),
    warmupButton.waitFor({ timeout: 5000 }),
  ]);
  if (await startSetButton.isVisible()) {
    await startSetButton.click();
  } else if (await warmupButton.isVisible()) {
    await warmupButton.click();
  }

  const completeWarmupButton = page.getByRole('button', { name: /Complete Warmup/ });
  const completeSetButton = page.getByRole('button', { name: /Complete Set/ });
  await Promise.race([
    completeWarmupButton.waitFor({ timeout: 5000 }),
    completeSetButton.waitFor({ timeout: 5000 }),
  ]);
  if (await completeWarmupButton.isVisible()) {
    await completeWarmupButton.click();
  } else {
    await completeSetButton.click();
  }

  const restButton = page.getByRole('button', { name: /Skip Rest|Continue Workout/ });
  try {
    await restButton.waitFor({ timeout: 5000 });
    await restButton.click();
  } catch {
    // Rest timer may auto-advance or be disabled.
  }
  const endExerciseButton = page.getByRole('button', { name: /End Exercise & Continue/ });
  try {
    await endExerciseButton.waitFor({ timeout: 5000 });
    await endExerciseButton.click();
  } catch {
    // May already be on cardio for the last exercise.
  }

  await expect(page).toHaveURL(new RegExp(`/workout/${encodeURIComponent(routineName)}/cardio`));
  await page.getByRole('button', { name: 'Skip Cardio', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/workout/${encodeURIComponent(routineName)}/post-stretches`));
  await page.getByRole('button', { name: /View Summary/ }).click();
  await page.waitForURL(new RegExp(`/workout/${encodeURIComponent(routineName)}/summary`), { timeout: 10000 });
  await expect(page.getByRole('heading', { name: 'Workout Complete!' })).toBeVisible();
  expect(autosaveEvents.some((event) => event?.event?.type === 'single_set' || event?.event?.type === 'b2b_set')).toBeTruthy();
});
