import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockExecute = vi.fn();
const mockClose = vi.fn();

vi.mock('@libsql/client', () => ({
  createClient: vi.fn(() => ({
    execute: mockExecute,
    close: mockClose,
  })),
}));

type DatabaseModule = typeof import('@/lib/database');
let database: DatabaseModule;

beforeEach(async () => {
  vi.resetModules();
  mockExecute.mockReset();
  mockClose.mockReset();
  mockExecute.mockResolvedValue({ rows: [] });
  database = await import('@/lib/database');
});

describe('workout autosave database helpers', () => {
  it('creates sessions with session_key when provided', async () => {
    mockExecute
      .mockResolvedValueOnce({ rows: [{ name: 'routine_id' }, { name: 'session_key' }] })
      .mockResolvedValueOnce({ rows: [{ name: 'routine_id' }, { name: 'session_key' }] })
      .mockResolvedValueOnce({ rows: [], lastInsertRowid: 101 });

    await database.createWorkoutSession({
      user_id: 'user-1',
      routine_id: 55,
      session_key: '2026-01-30T10:00:00.000Z',
      workout_plan_name: 'Test Routine',
      date_completed: '2026-01-30T10:00:00.000Z',
    });

    const insertCall = mockExecute.mock.calls.find((call) => {
      const sql = call[0]?.sql || '';
      return typeof sql === 'string' && sql.includes('INSERT INTO workout_sessions');
    });

    expect(insertCall).toBeTruthy();
    expect(insertCall?.[0]?.sql).toContain('session_key');
  });

  it('fetches session by session_key when column exists', async () => {
    mockExecute
      .mockResolvedValueOnce({ rows: [{ name: 'session_key' }] })
      .mockResolvedValueOnce({ rows: [{ id: 5, session_key: 'abc' }] });

    const session = await database.getWorkoutSessionByKey('user-1', 'abc');

    expect(session).toEqual({ id: 5, session_key: 'abc' });
    expect(mockExecute).toHaveBeenCalledWith({
      sql: expect.stringContaining('WHERE user_id = ? AND session_key = ?'),
      args: ['user-1', 'abc'],
    });
  });

  it('updates existing exercise log rows on upsert', async () => {
    mockExecute
      .mockResolvedValueOnce({ rows: [{ id: 12 }] })
      .mockResolvedValueOnce({ rows: [] });

    await database.upsertWorkoutExerciseLog({
      session_id: 1,
      exercise_name: 'Bench Press',
      exercise_type: 'single',
      set1_weight: 135,
      set1_reps: 8,
    });

    const updateCall = mockExecute.mock.calls.find((call) => {
      const sql = call[0]?.sql || '';
      return typeof sql === 'string' && sql.startsWith('UPDATE workout_exercise_logs');
    });

    expect(updateCall).toBeTruthy();
  });

  it('inserts new exercise log rows when none exist', async () => {
    mockExecute
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [], lastInsertRowid: 77 });

    await database.upsertWorkoutExerciseLog({
      session_id: 2,
      exercise_name: 'Squat',
      exercise_type: 'single',
      set1_weight: 185,
      set1_reps: 5,
    });

    const insertCall = mockExecute.mock.calls.find((call) => {
      const sql = call[0]?.sql || '';
      return typeof sql === 'string' && sql.includes('INSERT INTO workout_exercise_logs');
    });

    expect(insertCall).toBeTruthy();
  });
});
