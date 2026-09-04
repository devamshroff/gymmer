import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockExecute = vi.fn();

vi.mock('@/lib/database', () => ({
  getDatabase: () => ({ execute: mockExecute }),
}));

type ExportModule = typeof import('@/lib/mcp/progress-export');
let progressExport: ExportModule;

beforeEach(async () => {
  vi.resetModules();
  mockExecute.mockReset();
  progressExport = await import('@/lib/mcp/progress-export');
});

function activityRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    activity_type: 'Ran',
    activity_date: '2026-05-04T12:00:00.000Z',
    duration_minutes: null,
    notes: null,
    source: 'tile',
    ...overrides,
  };
}

describe('listMcpActivityLogs', () => {
  it('returns activities with a plain date and null duration for tile logs', async () => {
    mockExecute.mockResolvedValueOnce({ rows: [activityRow()] });

    const result = await progressExport.listMcpActivityLogs('user-1', {
      from: '2026-05-01',
      to: '2026-05-07',
    });

    expect(result.activities).toEqual([{
      id: 1,
      activity: 'Ran',
      date: '2026-05-04',
      loggedAt: '2026-05-04T12:00:00.000Z',
      durationMinutes: null,
      notes: null,
      source: 'tile',
    }]);
    expect(result.range).toEqual({ from: '2026-05-01', to: '2026-05-07', days: 7 });
    expect(result.nextCursor).toBeNull();
  });

  it('scopes the query to the user and range', async () => {
    mockExecute.mockResolvedValueOnce({ rows: [] });

    await progressExport.listMcpActivityLogs('user-1', { from: '2026-05-01', to: '2026-05-07' });

    expect(mockExecute).toHaveBeenCalledWith(expect.objectContaining({
      args: ['user-1', '2026-05-01T00:00:00.000Z', '2026-05-08T00:00:00.000Z', 21, 0],
    }));
  });

  it('returns a cursor when more rows exist than the page limit', async () => {
    // The query asks for limit + 1 rows to detect a further page.
    const rows = Array.from({ length: 4 }, (_, index) => activityRow({ id: index + 1 }));
    mockExecute.mockResolvedValueOnce({ rows });

    const result = await progressExport.listMcpActivityLogs('user-1', { limit: 3 });

    expect(result.activities).toHaveLength(3);
    expect(result.nextCursor).toBe('3');
  });
});

describe('getMcpActivitySummary', () => {
  it('rolls up counts, minutes, and distinct active days', async () => {
    mockExecute.mockResolvedValueOnce({
      rows: [
        activityRow({ id: 1, activity_type: 'Ran', activity_date: '2026-05-01T12:00:00.000Z' }),
        activityRow({ id: 2, activity_type: 'Yoga', activity_date: '2026-05-01T12:00:00.000Z' }),
        activityRow({
          id: 3,
          activity_type: 'Ran',
          activity_date: '2026-05-03T12:00:00.000Z',
          duration_minutes: 30,
        }),
      ],
    });

    const summary = await progressExport.getMcpActivitySummary('user-1', {
      from: '2026-05-01',
      to: '2026-05-07',
    });

    expect(summary.totalLogged).toBe(3);
    // Two activities on May 1 count as one active day.
    expect(summary.daysWithActivity).toBe(2);
    expect(summary.byActivity).toEqual([
      { activity: 'Ran', count: 2, totalMinutes: 30, lastDate: '2026-05-03' },
      { activity: 'Yoga', count: 1, totalMinutes: 0, lastDate: '2026-05-01' },
    ]);
  });

  it('reports an empty range without failing', async () => {
    mockExecute.mockResolvedValueOnce({ rows: [] });

    const summary = await progressExport.getMcpActivitySummary('user-1');

    expect(summary).toEqual({ totalLogged: 0, daysWithActivity: 0, byActivity: [] });
  });
});
