import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockExecute = vi.fn();

vi.mock('@libsql/client', () => ({
  createClient: vi.fn(() => ({
    execute: mockExecute,
  })),
}));

type DatabaseModule = typeof import('@/lib/database');
let database: DatabaseModule;

beforeEach(async () => {
  vi.resetModules();
  mockExecute.mockReset();
  mockExecute.mockResolvedValue({ rows: [] });
  database = await import('@/lib/database');
});

describe('activity log database helpers', () => {
  it('creates a user-owned activity log', async () => {
    mockExecute
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [], lastInsertRowid: 7 })
      .mockResolvedValueOnce({
        rows: [{
          id: 7,
          user_id: 'user-1',
          activity_type: 'Yoga',
          duration_minutes: 60,
          activity_date: '2026-05-01T12:00:00.000Z',
          notes: 'Vinyasa class',
          created_at: '2026-05-01 12:00:00',
          updated_at: '2026-05-01 12:00:00',
        }],
      });

    const activity = await database.createActivityLog({
      userId: 'user-1',
      activityType: 'Yoga',
      durationMinutes: 60,
      activityDate: '2026-05-01T12:00:00.000Z',
      notes: 'Vinyasa class',
    });

    expect(activity).toEqual({
      id: 7,
      user_id: 'user-1',
      activity_type: 'Yoga',
      duration_minutes: 60,
      activity_date: '2026-05-01T12:00:00.000Z',
      notes: 'Vinyasa class',
      created_at: '2026-05-01 12:00:00',
      updated_at: '2026-05-01 12:00:00',
    });
    expect(mockExecute).toHaveBeenCalledWith({
      sql: expect.stringContaining('INSERT INTO activity_logs'),
      args: ['user-1', 'Yoga', 60, '2026-05-01T12:00:00.000Z', 'Vinyasa class'],
    });
  });

  it('lists recent activity logs for a user', async () => {
    mockExecute
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [{
          id: 8,
          user_id: 'user-1',
          activity_type: 'Biking',
          duration_minutes: 45,
          activity_date: '2026-05-02T12:00:00.000Z',
          notes: null,
          created_at: '2026-05-02 12:00:00',
          updated_at: '2026-05-02 12:00:00',
        }],
      });

    const activities = await database.listActivityLogs('user-1', 25);

    expect(activities).toHaveLength(1);
    expect(activities[0].activity_type).toBe('Biking');
    expect(mockExecute).toHaveBeenCalledWith({
      sql: expect.stringContaining('ORDER BY activity_date DESC'),
      args: ['user-1', 25],
    });
  });

  it('deletes only activities owned by the user', async () => {
    mockExecute
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: 10 }] })
      .mockResolvedValueOnce({ rows: [] });

    const deleted = await database.deleteActivityLog('user-1', 10);

    expect(deleted).toBe(true);
    expect(mockExecute).toHaveBeenCalledWith({
      sql: 'DELETE FROM activity_logs WHERE id = ? AND user_id = ?',
      args: [10, 'user-1'],
    });
  });

  it('returns false when deleting a missing activity', async () => {
    mockExecute
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const deleted = await database.deleteActivityLog('user-1', 10);

    expect(deleted).toBe(false);
    expect(mockExecute).not.toHaveBeenCalledWith({
      sql: 'DELETE FROM activity_logs WHERE id = ? AND user_id = ?',
      args: [10, 'user-1'],
    });
  });
});

describe('push subscription database helpers', () => {
  it('upserts a push subscription for nightly reminders', async () => {
    mockExecute
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    await database.upsertPushSubscription({
      userId: 'user-1',
      endpoint: 'https://push.example/sub',
      p256dh: 'key',
      auth: 'auth',
      timezone: 'America/New_York',
      userAgent: 'test-agent',
    });

    expect(mockExecute).toHaveBeenCalledWith({
      sql: expect.stringContaining('INSERT INTO push_subscriptions'),
      args: ['user-1', 'https://push.example/sub', 'key', 'auth', 'America/New_York', 'test-agent'],
    });
  });

  it('marks a cardio reminder as sent for the local date', async () => {
    mockExecute
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    await database.markCardioReminderSent(4, '2026-05-26');

    expect(mockExecute).toHaveBeenCalledWith({
      sql: expect.stringContaining('SET last_cardio_reminder_date = ?'),
      args: ['2026-05-26', 4],
    });
  });
});
