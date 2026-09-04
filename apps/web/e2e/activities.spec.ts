import { test, expect, Page } from '@playwright/test';

type ActivityRow = {
  id: number;
  user_id: string;
  activity_type: string;
  duration_minutes: number | null;
  activity_date: string;
  notes: string | null;
  source: 'tile' | 'manual';
  created_at: string;
  updated_at: string;
};

type PutPayload = { slugs: string[]; details?: Record<string, string> };

const SLUG_LABELS: Record<string, string> = {
  rest: 'Rest',
  ran: 'Ran',
  'ankle-rehab': 'Ankle rehab',
  stretches: 'Stretches',
  yoga: 'Yoga',
  'strength-training': 'Strength training',
  'biking-class': 'Biking class',
  'other-class': 'Other class',
};

const LABEL_SLUGS: Record<string, string> = Object.fromEntries(
  Object.entries(SLUG_LABELS).map(([slug, label]) => [label, slug])
);

/**
 * Stateful stand-in for the activities API. The tile picker's whole point is
 * that saving the same day twice does not duplicate rows, so the fake has to
 * actually reconcile rather than blindly append.
 */
function installActivityApi(page: Page, options: { hasWorkoutSession?: boolean } = {}) {
  const state = {
    rows: [] as ActivityRow[],
    nextId: 1,
    putCount: 0,
    lastPut: null as PutPayload | null,
  };

  const dayOf = (row: ActivityRow) => row.activity_date.slice(0, 10);

  const selectedSlugsFor = (rows: ActivityRow[]) => rows
    .filter((row) => row.source === 'tile')
    .map((row) => LABEL_SLUGS[row.activity_type])
    .filter((slug): slug is string => Boolean(slug));

  page.route('**/api/push/subscription*', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ hasSubscription: false, hasEnabledSubscription: false }),
  }));

  page.route('**/api/activities**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const date = url.searchParams.get('date');
    const method = request.method();

    if (method === 'GET' && date) {
      const dayRows = state.rows.filter((row) => dayOf(row) === date);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          date,
          activities: dayRows,
          selectedSlugs: selectedSlugsFor(dayRows),
          hasWorkoutSession: Boolean(options.hasWorkoutSession),
        }),
      });
      return;
    }

    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ activities: [...state.rows].reverse() }),
      });
      return;
    }

    if (method === 'PUT' && date) {
      const payload = request.postDataJSON() as PutPayload;
      state.putCount += 1;
      state.lastPut = payload;

      const wanted = new Map(payload.slugs.map((slug) => [
        SLUG_LABELS[slug],
        payload.details?.[slug]?.trim() || null,
      ]));

      // Drop deselected tile rows for this day; manual rows are never touched.
      state.rows = state.rows.filter((row) => {
        if (dayOf(row) !== date || row.source !== 'tile') return true;
        return wanted.has(row.activity_type);
      });

      for (const [activityType, notes] of wanted) {
        const existing = state.rows.find(
          (row) => dayOf(row) === date && row.source === 'tile' && row.activity_type === activityType
        );
        if (existing) {
          existing.notes = notes;
          continue;
        }
        state.rows.push({
          id: state.nextId++,
          user_id: 'e2e@test.local',
          activity_type: activityType,
          duration_minutes: null,
          activity_date: `${date}T12:00:00.000Z`,
          notes,
          source: 'tile',
          created_at: `${date} 12:00:00`,
          updated_at: `${date} 12:00:00`,
        });
      }

      const dayRows = state.rows.filter((row) => dayOf(row) === date);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          date,
          activities: dayRows,
          selectedSlugs: selectedSlugsFor(dayRows),
        }),
      });
      return;
    }

    if (method === 'POST') {
      const payload = request.postDataJSON() as {
        activityType: string;
        durationMinutes: number | null;
        activityDate: string;
        notes: string;
      };
      const row: ActivityRow = {
        id: state.nextId++,
        user_id: 'e2e@test.local',
        activity_type: payload.activityType,
        duration_minutes: payload.durationMinutes,
        activity_date: `${payload.activityDate}T12:00:00.000Z`,
        notes: payload.notes || null,
        source: 'manual',
        created_at: `${payload.activityDate} 12:00:00`,
        updated_at: `${payload.activityDate} 12:00:00`,
      };
      state.rows.push(row);
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ activity: row }),
      });
      return;
    }

    if (method === 'DELETE') {
      const id = Number(url.searchParams.get('id'));
      state.rows = state.rows.filter((row) => row.id !== id);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    await route.fallback();
  });

  return state;
}

test('logs a day of activities from the tile picker', async ({ page }) => {
  const state = installActivityApi(page);

  await page.goto('/workout');
  await page.getByRole('link', { name: 'Log Activity' }).click();

  await expect(page.getByRole('heading', { name: 'What did you do?' })).toBeVisible();
  await page.getByLabel('Activity date').fill('2026-05-10');

  await page.getByTestId('activity-tile-ran').click();
  await page.getByTestId('activity-tile-stretches').click();

  await expect(page.getByTestId('activity-tile-ran')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('activity-tile-stretches')).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByTestId('day-saved')).toBeVisible();

  expect(state.lastPut?.slugs).toEqual(['ran', 'stretches']);
  await expect(page.getByRole('heading', { name: 'Ran' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Stretches' })).toBeVisible();
});

test('rest is mutually exclusive with every other tile', async ({ page }) => {
  const state = installActivityApi(page);

  await page.goto('/activities?date=2026-05-11');

  await page.getByTestId('activity-tile-ran').click();
  await page.getByTestId('activity-tile-yoga').click();

  // Picking Rest clears the others: you cannot have both rested and run.
  await page.getByTestId('activity-tile-rest').click();
  await expect(page.getByTestId('activity-tile-rest')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('activity-tile-ran')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByTestId('activity-tile-yoga')).toHaveAttribute('aria-pressed', 'false');

  // And picking another tile clears Rest.
  await page.getByTestId('activity-tile-ran').click();
  await expect(page.getByTestId('activity-tile-rest')).toHaveAttribute('aria-pressed', 'false');

  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByTestId('day-saved')).toBeVisible();
  expect(state.lastPut?.slugs).toEqual(['ran']);
});

test('other class captures which class it was', async ({ page }) => {
  const state = installActivityApi(page);

  await page.goto('/activities?date=2026-05-12');

  await page.getByTestId('activity-tile-other-class').click();
  await page.getByLabel('Which class?').fill('Pilates');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByTestId('day-saved')).toBeVisible();

  expect(state.lastPut).toMatchObject({
    slugs: ['other-class'],
    details: { 'other-class': 'Pilates' },
  });

  // The typed detail survives a reload rather than being lost.
  await page.reload();
  await expect(page.getByLabel('Which class?')).toHaveValue('Pilates');
});

test('reopening the same day does not duplicate what is already logged', async ({ page }) => {
  const state = installActivityApi(page);

  await page.goto('/activities?date=2026-05-13');
  await page.getByTestId('activity-tile-yoga').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByTestId('day-saved')).toBeVisible();

  // Simulates tapping the nightly notification a second time.
  await page.goto('/activities?date=2026-05-13');
  await expect(page.getByTestId('activity-tile-yoga')).toHaveAttribute('aria-pressed', 'true');

  await page.getByTestId('activity-tile-ran').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByTestId('day-saved')).toBeVisible();

  const yogaRows = state.rows.filter((row) => row.activity_type === 'Yoga');
  expect(yogaRows).toHaveLength(1);
  expect(state.rows.filter((row) => row.activity_date.startsWith('2026-05-13'))).toHaveLength(2);
});

test('deselecting a tile removes it from the day', async ({ page }) => {
  const state = installActivityApi(page);

  await page.goto('/activities?date=2026-05-14');
  await page.getByTestId('activity-tile-yoga').click();
  await page.getByTestId('activity-tile-ran').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByTestId('day-saved')).toBeVisible();

  await page.getByTestId('activity-tile-yoga').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByTestId('day-saved')).toBeVisible();

  expect(state.rows.map((row) => row.activity_type)).toEqual(['Ran']);
});

test('strength training tile hides on a day that already has a workout session', async ({ page }) => {
  installActivityApi(page, { hasWorkoutSession: true });

  await page.goto('/activities?date=2026-05-15');

  await expect(page.getByTestId('activity-tile-ran')).toBeVisible();
  await expect(page.getByTestId('activity-tile-strength-training')).toHaveCount(0);
  await expect(page.getByText(/Strength training is hidden/)).toBeVisible();
});

test('detailed form still logs a timed activity and duration is optional', async ({ page }) => {
  const state = installActivityApi(page);

  await page.goto('/activities?date=2026-05-16');
  await page.getByRole('button', { name: /Add with details/ }).click();

  await page.getByLabel('Activity', { exact: true }).fill('Soccer');
  await page.getByLabel(/Minutes/).fill('90');
  await page.getByLabel('Notes').fill('Sunday league.');
  await page.getByRole('button', { name: 'Log Activity' }).click();

  await expect(page.getByRole('heading', { name: 'Soccer' })).toBeVisible();
  await expect(page.getByText(/1 hr 30 min/)).toBeVisible();

  // Now without a duration.
  await page.getByLabel('Activity', { exact: true }).fill('Walk');
  await page.getByRole('button', { name: 'Log Activity' }).click();
  await expect(page.getByRole('heading', { name: 'Walk' })).toBeVisible();

  const walk = state.rows.find((row) => row.activity_type === 'Walk');
  expect(walk?.duration_minutes).toBeNull();
});

test('tile save never deletes a manually logged timed activity', async ({ page }) => {
  const state = installActivityApi(page);

  await page.goto('/activities?date=2026-05-17');
  await page.getByRole('button', { name: /Add with details/ }).click();
  await page.getByLabel('Activity', { exact: true }).fill('Soccer');
  await page.getByLabel(/Minutes/).fill('90');
  await page.getByRole('button', { name: 'Log Activity' }).click();
  await expect(page.getByRole('heading', { name: 'Soccer' })).toBeVisible();

  await page.getByTestId('activity-tile-ran').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByTestId('day-saved')).toBeVisible();

  // Then clear every tile for the day.
  await page.getByTestId('activity-tile-ran').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByTestId('day-saved')).toBeVisible();

  expect(state.rows.map((row) => row.activity_type)).toEqual(['Soccer']);
});

test('the date deep link from the nightly reminder opens that day', async ({ page }) => {
  installActivityApi(page);

  await page.goto('/activities?date=2026-05-09');
  await expect(page.getByLabel('Activity date')).toHaveValue('2026-05-09');
});
