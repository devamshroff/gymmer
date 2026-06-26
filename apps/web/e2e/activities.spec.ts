import { test, expect } from '@playwright/test';

type ActivityPostPayload = {
  activityType: string;
  durationMinutes: number;
  activityDate: string;
  notes: string;
};

test('Activity log flow adds and deletes a timed activity', async ({ page }) => {
  let activities: Array<{
    id: number;
    user_id: string;
    activity_type: string;
    duration_minutes: number;
    activity_date: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
  }> = [];
  let postPayload: ActivityPostPayload | null = null;

  await page.route('**/api/activities?*', async (route) => {
    if (route.request().method() === 'DELETE') {
      activities = [];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    if (route.request().method() !== 'GET') {
      await route.fallback();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ activities }),
    });
  });

  await page.route('**/api/activities', async (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      postPayload = route.request().postDataJSON() as ActivityPostPayload;
      const activity = {
        id: 101,
        user_id: 'e2e@test.local',
        activity_type: postPayload.activityType,
        duration_minutes: postPayload.durationMinutes,
        activity_date: '2026-05-10T12:00:00.000Z',
        notes: postPayload.notes,
        created_at: '2026-05-10 12:00:00',
        updated_at: '2026-05-10 12:00:00',
      };
      activities = [activity];
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ activity }),
      });
      return;
    }

    await route.fallback();
  });

  await page.goto('/workout');
  await expect(page.getByRole('link', { name: 'Log Activity' })).toBeVisible();
  await page.getByRole('link', { name: 'Log Activity' }).click();

  await expect(page.getByRole('heading', { name: 'Log Activity' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Nightly Cardio Reminder' })).toBeVisible();
  await expect(page.getByText('No activities logged yet.')).toBeVisible();

  await page.getByLabel('Activity').fill('Yoga class');
  await page.getByLabel('Minutes').fill('60');
  await page.getByLabel('Date').fill('2026-05-10');
  await page.getByLabel('Notes').fill('Hot yoga with extra balance work.');

  await page.getByRole('button', { name: 'Log Activity' }).click();

  expect(postPayload).toMatchObject({
    activityType: 'Yoga class',
    durationMinutes: 60,
    activityDate: '2026-05-10',
    notes: 'Hot yoga with extra balance work.',
  });
  await expect(page.getByText('Saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Yoga class' })).toBeVisible();
  await expect(page.getByText(/1 hr/)).toBeVisible();
  await expect(page.getByText('Hot yoga with extra balance work.')).toBeVisible();

  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('No activities logged yet.')).toBeVisible();

  await page.goto('/activities?date=2026-05-09');
  await expect(page.getByLabel('Date')).toHaveValue('2026-05-09');
});
