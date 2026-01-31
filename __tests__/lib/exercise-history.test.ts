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
    mockExecute
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    await getExerciseHistory('user-123', 'Box Jumps', 'month');

    expect(mockExecute).toHaveBeenCalledTimes(2);
    const historyCall = mockExecute.mock.calls[0][0];
    expect(historyCall.sql).not.toContain('session_mode');
    expect(historyCall.args).not.toContain('light');
  });
});
