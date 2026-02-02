import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockExecute = vi.fn();
const mockClose = vi.fn();

vi.mock('@libsql/client', () => ({
  createClient: vi.fn(() => ({
    execute: mockExecute,
    close: mockClose,
  })),
}));

import { getExerciseHistory } from '@/lib/database';

describe('getExerciseHistory', () => {
  beforeEach(() => {
    process.env.TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL ?? 'file:test.db';
    vi.clearAllMocks();
  });

  it('skips session_mode filter when column is missing', async () => {
    mockExecute.mockImplementation((arg) => {
      const sql = typeof arg === 'string' ? arg : arg?.sql;
      if (typeof sql === 'string' && sql.includes('PRAGMA table_info(exercises)')) {
        return Promise.resolve({ rows: [{ name: 'primary_metric' }, { name: 'metric_unit' }] });
      }
      return Promise.resolve({ rows: [] });
    });

    await getExerciseHistory('user-123', 'Box Jumps', 'month');

    const historyCall = mockExecute.mock.calls.find(
      (call) => typeof call[0]?.sql === 'string' && call[0].sql.includes('WITH matched')
    )?.[0];
    expect(historyCall).toBeTruthy();
    expect(historyCall.sql).not.toContain('session_mode');
    expect(historyCall.args).not.toContain('light');
  });
});
