import { test, expect } from '@playwright/test';

const samplePlan = {
  name: 'E2E AI Routine',
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

test('AI routine flow: generate, edit, save, and complete workout', async ({ page }) => {
  await page.route('**/api/routines/ai-generate', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ workoutPlan: samplePlan }),
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
  await expect(page).toHaveURL('/');

  await page.getByRole('link', { name: 'E2E AI Routine' }).click();
  await expect(page.getByRole('heading', { name: 'E2E AI Routine' })).toBeVisible();

  await page.getByRole('button', { name: 'Start Workout' }).click();
  await expect(page).toHaveURL(/\/stretches\/E2E%20AI%20Routine/);

  await page.getByRole('button', { name: 'Skip All →', exact: true }).click();
  await expect(page).toHaveURL(/\/workout\/E2E%20AI%20Routine\/active/);

  await page.getByRole('button', { name: /Complete Warmup/ }).click();
  await page.getByRole('button', { name: /Skip Rest|Continue Workout/ }).click();
  await page.getByRole('button', { name: /End Exercise & Continue/ }).click();

  await expect(page).toHaveURL(/\/workout\/E2E%20AI%20Routine\/cardio/);
  await page.getByRole('button', { name: 'Skip Cardio', exact: true }).click();
  await expect(page).toHaveURL(/\/workout\/E2E%20AI%20Routine\/post-stretches/);
  await page.getByRole('button', { name: /View Summary/ }).click();

  await expect(page.getByText('✓ Workout saved')).toBeVisible();
});
