import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockExecute = vi.fn();
const mockBatch = vi.fn();

vi.mock('@libsql/client', () => ({
  createClient: vi.fn(() => ({
    execute: mockExecute,
    batch: mockBatch,
  })),
}));

type DatabaseModule = typeof import('@/lib/database');
let database: DatabaseModule;

type ExecuteArg = string | { sql: string; args?: unknown[] };

function sqlOf(arg: ExecuteArg): string {
  return typeof arg === 'string' ? arg : arg.sql;
}

/**
 * Table setup issues a variable number of statements (CREATE TABLE, a PRAGMA
 * probe, index creation, and on legacy databases a full rebuild). Dispatching on
 * SQL rather than call order keeps these tests from breaking every time that
 * setup changes.
 */
function routeExecute(handlers: Array<{ match: RegExp; result: unknown }>) {
  mockExecute.mockImplementation(async (arg: ExecuteArg) => {
    const sql = sqlOf(arg);
    for (const handler of handlers) {
      if (handler.match.test(sql)) return handler.result;
    }
    return { rows: [] };
  });
}

/** A migrated table: duration_minutes nullable, source present. */
const MIGRATED_COLUMNS = {
  rows: [
    { name: 'id', notnull: 1 },
    { name: 'user_id', notnull: 1 },
    { name: 'activity_type', notnull: 1 },
    { name: 'duration_minutes', notnull: 0 },
    { name: 'activity_date', notnull: 1 },
    { name: 'notes', notnull: 0 },
    { name: 'source', notnull: 1 },
  ],
};

beforeEach(async () => {
  vi.resetModules();
  mockExecute.mockReset();
  mockBatch.mockReset();
  mockExecute.mockResolvedValue({ rows: [] });
  mockBatch.mockResolvedValue([]);
  database = await import('@/lib/database');
});

describe('activity log schema migration', () => {
  it('rebuilds a legacy table so duration_minutes becomes nullable', async () => {
    routeExecute([
      { match: /PRAGMA table_info\(activity_logs\)/, result: {
        rows: [
          { name: 'id', notnull: 1 },
          { name: 'activity_type', notnull: 1 },
          // Legacy shape: duration was mandatory and there was no source column.
          { name: 'duration_minutes', notnull: 1 },
        ],
      } },
    ]);

    await database.listActivityLogs('user-1', 10);

    const statements = mockExecute.mock.calls.map((call) => sqlOf(call[0] as ExecuteArg));
    expect(statements.some((sql) => /RENAME TO activity_logs_old/.test(sql))).toBe(true);
    expect(statements.some((sql) => /INSERT INTO activity_logs\s*\(/.test(sql)
      && /FROM activity_logs_old/.test(sql))).toBe(true);
    expect(statements.some((sql) => /DROP TABLE activity_logs_old/.test(sql))).toBe(true);
  });

  it('adds only the source column when duration is already nullable', async () => {
    routeExecute([
      { match: /PRAGMA table_info\(activity_logs\)/, result: {
        rows: [
          { name: 'id', notnull: 1 },
          { name: 'duration_minutes', notnull: 0 },
        ],
      } },
    ]);

    await database.listActivityLogs('user-1', 10);

    const statements = mockExecute.mock.calls.map((call) => sqlOf(call[0] as ExecuteArg));
    expect(statements.some((sql) => /ADD COLUMN source/.test(sql))).toBe(true);
    expect(statements.some((sql) => /RENAME TO activity_logs_old/.test(sql))).toBe(false);
  });

  it('leaves an already-migrated table alone', async () => {
    routeExecute([
      { match: /PRAGMA table_info\(activity_logs\)/, result: MIGRATED_COLUMNS },
    ]);

    await database.listActivityLogs('user-1', 10);

    const statements = mockExecute.mock.calls.map((call) => sqlOf(call[0] as ExecuteArg));
    expect(statements.some((sql) => /RENAME TO activity_logs_old/.test(sql))).toBe(false);
    expect(statements.some((sql) => /ADD COLUMN source/.test(sql))).toBe(false);
  });
});

describe('activity log database helpers', () => {
  it('creates a user-owned activity log', async () => {
    routeExecute([
      { match: /PRAGMA table_info\(activity_logs\)/, result: MIGRATED_COLUMNS },
      { match: /INSERT INTO activity_logs/, result: { rows: [], lastInsertRowid: 7 } },
      { match: /SELECT \* FROM activity_logs WHERE id/, result: {
        rows: [{
          id: 7,
          user_id: 'user-1',
          activity_type: 'Yoga',
          duration_minutes: 60,
          activity_date: '2026-05-01T12:00:00.000Z',
          notes: 'Vinyasa class',
          source: 'manual',
          created_at: '2026-05-01 12:00:00',
          updated_at: '2026-05-01 12:00:00',
        }],
      } },
    ]);

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
      source: 'manual',
      created_at: '2026-05-01 12:00:00',
      updated_at: '2026-05-01 12:00:00',
    });
    expect(mockExecute).toHaveBeenCalledWith({
      sql: expect.stringContaining('INSERT INTO activity_logs'),
      args: ['user-1', 'Yoga', 60, '2026-05-01T12:00:00.000Z', 'Vinyasa class', 'manual'],
    });
  });

  it('creates an activity with no duration', async () => {
    routeExecute([
      { match: /PRAGMA table_info\(activity_logs\)/, result: MIGRATED_COLUMNS },
      { match: /INSERT INTO activity_logs/, result: { rows: [], lastInsertRowid: 9 } },
      { match: /SELECT \* FROM activity_logs WHERE id/, result: {
        rows: [{
          id: 9,
          user_id: 'user-1',
          activity_type: 'Rest',
          duration_minutes: null,
          activity_date: '2026-05-03T12:00:00.000Z',
          notes: null,
          source: 'tile',
          created_at: '2026-05-03 12:00:00',
          updated_at: '2026-05-03 12:00:00',
        }],
      } },
    ]);

    const activity = await database.createActivityLog({
      userId: 'user-1',
      activityType: 'Rest',
      activityDate: '2026-05-03T12:00:00.000Z',
      source: 'tile',
    });

    expect(activity.duration_minutes).toBeNull();
    expect(activity.source).toBe('tile');
    expect(mockExecute).toHaveBeenCalledWith({
      sql: expect.stringContaining('INSERT INTO activity_logs'),
      args: ['user-1', 'Rest', null, '2026-05-03T12:00:00.000Z', null, 'tile'],
    });
  });

  it('lists recent activity logs for a user', async () => {
    routeExecute([
      { match: /PRAGMA table_info\(activity_logs\)/, result: MIGRATED_COLUMNS },
      { match: /ORDER BY activity_date DESC/, result: {
        rows: [{
          id: 8,
          user_id: 'user-1',
          activity_type: 'Biking',
          duration_minutes: 45,
          activity_date: '2026-05-02T12:00:00.000Z',
          notes: null,
          source: 'manual',
          created_at: '2026-05-02 12:00:00',
          updated_at: '2026-05-02 12:00:00',
        }],
      } },
    ]);

    const activities = await database.listActivityLogs('user-1', 25);

    expect(activities).toHaveLength(1);
    expect(activities[0].activity_type).toBe('Biking');
    expect(mockExecute).toHaveBeenCalledWith({
      sql: expect.stringContaining('ORDER BY activity_date DESC'),
      args: ['user-1', 25],
    });
  });

  it('lists activities for a single day by the date portion of the timestamp', async () => {
    routeExecute([
      { match: /PRAGMA table_info\(activity_logs\)/, result: MIGRATED_COLUMNS },
      { match: /substr\(activity_date, 1, 10\) = \?/, result: {
        rows: [{
          id: 11,
          user_id: 'user-1',
          activity_type: 'Ran',
          duration_minutes: null,
          activity_date: '2026-05-04T12:00:00.000Z',
          notes: null,
          source: 'tile',
          created_at: '2026-05-04 12:00:00',
          updated_at: '2026-05-04 12:00:00',
        }],
      } },
    ]);

    const activities = await database.listActivityLogsForDay('user-1', '2026-05-04');

    expect(activities).toHaveLength(1);
    expect(activities[0].activity_type).toBe('Ran');
    expect(mockExecute).toHaveBeenCalledWith({
      sql: expect.stringContaining('substr(activity_date, 1, 10) = ?'),
      args: ['user-1', '2026-05-04'],
    });
  });

  it('deletes only activities owned by the user', async () => {
    routeExecute([
      { match: /PRAGMA table_info\(activity_logs\)/, result: MIGRATED_COLUMNS },
      { match: /SELECT id FROM activity_logs WHERE id/, result: { rows: [{ id: 10 }] } },
    ]);

    const deleted = await database.deleteActivityLog('user-1', 10);

    expect(deleted).toBe(true);
    expect(mockExecute).toHaveBeenCalledWith({
      sql: 'DELETE FROM activity_logs WHERE id = ? AND user_id = ?',
      args: [10, 'user-1'],
    });
  });

  it('returns false when deleting a missing activity', async () => {
    routeExecute([
      { match: /PRAGMA table_info\(activity_logs\)/, result: MIGRATED_COLUMNS },
    ]);

    const deleted = await database.deleteActivityLog('user-1', 10);

    expect(deleted).toBe(false);
    expect(mockExecute).not.toHaveBeenCalledWith({
      sql: 'DELETE FROM activity_logs WHERE id = ? AND user_id = ?',
      args: [10, 'user-1'],
    });
  });
});

describe('tile activity reconcile', () => {
  const existingTileRows = {
    rows: [
      {
        id: 1,
        user_id: 'user-1',
        activity_type: 'Ran',
        duration_minutes: null,
        activity_date: '2026-05-04T12:00:00.000Z',
        notes: null,
        source: 'tile',
        created_at: '2026-05-04 12:00:00',
        updated_at: '2026-05-04 12:00:00',
      },
      {
        id: 2,
        user_id: 'user-1',
        activity_type: 'Yoga',
        duration_minutes: null,
        activity_date: '2026-05-04T12:00:00.000Z',
        notes: null,
        source: 'tile',
        created_at: '2026-05-04 12:00:00',
        updated_at: '2026-05-04 12:00:00',
      },
    ],
  };

  function setupReconcile() {
    routeExecute([
      { match: /PRAGMA table_info\(activity_logs\)/, result: MIGRATED_COLUMNS },
      { match: /source = 'tile'/, result: existingTileRows },
      { match: /substr\(activity_date, 1, 10\) = \?/, result: { rows: [] } },
    ]);
  }

  it('inserts newly selected activities and removes deselected ones', async () => {
    setupReconcile();

    await database.replaceTileActivityLogsForDay({
      userId: 'user-1',
      day: '2026-05-04',
      activityDate: '2026-05-04T12:00:00.000Z',
      // Ran stays, Yoga is dropped, Stretches is new.
      entries: [{ activityType: 'Ran' }, { activityType: 'Stretches' }],
    });

    const statements = (mockBatch.mock.calls[0]?.[0] ?? []) as Array<{ sql: string; args: unknown[] }>;
    const deletes = statements.filter((statement) => /DELETE FROM activity_logs/.test(statement.sql));
    const inserts = statements.filter((statement) => /INSERT INTO activity_logs/.test(statement.sql));

    expect(deletes).toHaveLength(1);
    expect(deletes[0].args).toEqual([2, 'user-1']);
    expect(inserts).toHaveLength(1);
    expect(inserts[0].args).toEqual(['user-1', 'Stretches', '2026-05-04T12:00:00.000Z', null]);
  });

  it('is idempotent when the same selection is saved twice', async () => {
    setupReconcile();

    await database.replaceTileActivityLogsForDay({
      userId: 'user-1',
      day: '2026-05-04',
      activityDate: '2026-05-04T12:00:00.000Z',
      entries: [{ activityType: 'Ran' }, { activityType: 'Yoga' }],
    });

    // Nothing to add or remove, so no write batch is issued at all.
    expect(mockBatch).not.toHaveBeenCalled();
  });

  it('never deletes manually logged timed activities', async () => {
    setupReconcile();

    await database.replaceTileActivityLogsForDay({
      userId: 'user-1',
      day: '2026-05-04',
      activityDate: '2026-05-04T12:00:00.000Z',
      entries: [],
    });

    // The read that feeds the reconcile is scoped to tile rows, so a manual row
    // is never a deletion candidate.
    expect(mockExecute).toHaveBeenCalledWith({
      sql: expect.stringContaining("source = 'tile'"),
      args: ['user-1', '2026-05-04'],
    });

    const statements = (mockBatch.mock.calls[0]?.[0] ?? []) as Array<{ sql: string; args: unknown[] }>;
    const deletedIds = statements
      .filter((statement) => /DELETE FROM activity_logs/.test(statement.sql))
      .map((statement) => statement.args[0]);
    expect(deletedIds).toEqual([1, 2]);
  });

  it('refreshes notes on a kept activity', async () => {
    setupReconcile();

    await database.replaceTileActivityLogsForDay({
      userId: 'user-1',
      day: '2026-05-04',
      activityDate: '2026-05-04T12:00:00.000Z',
      entries: [
        { activityType: 'Ran' },
        { activityType: 'Yoga', notes: 'Yin' },
      ],
    });

    const statements = (mockBatch.mock.calls[0]?.[0] ?? []) as Array<{ sql: string; args: unknown[] }>;
    const updates = statements.filter((statement) => /UPDATE activity_logs SET notes/.test(statement.sql));
    expect(updates).toHaveLength(1);
    expect(updates[0].args).toEqual(['Yin', 2, 'user-1']);
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

  it('reports whether a user still has a push subscription', async () => {
    routeExecute([
      { match: /FROM push_subscriptions/, result: { rows: [{ total: 1, enabled_total: 0 }] } },
    ]);

    const state = await database.getPushSubscriptionStateForUser('user-1');

    // A row that exists but is disabled means the push service expired it and
    // reminders stopped, which the UI reports differently from "never enabled".
    expect(state).toEqual({ hasSubscription: true, hasEnabledSubscription: false });
  });
});
