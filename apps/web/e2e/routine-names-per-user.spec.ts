import { test, expect } from '@playwright/test';

// "Sais Routine" is seeded for creator@test.local in global-setup. The E2E user
// must be able to own a routine with the same name, but not two of them.
test('Routine names are unique per user, not across accounts', async ({ request }) => {
  const sharedName = 'Sais Routine';

  const created = await request.post('/api/routines', { data: { name: sharedName } });
  expect(created.status()).toBe(201);
  const { id } = await created.json();

  try {
    const duplicate = await request.post('/api/routines', { data: { name: sharedName } });
    expect(duplicate.status()).toBe(409);
    expect((await duplicate.json()).error).toContain('You already have a routine named');

    const mine = await request.get('/api/routines');
    const { routines } = await mine.json();
    const named = routines.filter((routine: { name: string }) => routine.name === sharedName);
    expect(named).toHaveLength(1);
    expect(named[0].user_id).toBe('e2e@test.local');
  } finally {
    await request.delete(`/api/routines/${id}`);
  }
});
