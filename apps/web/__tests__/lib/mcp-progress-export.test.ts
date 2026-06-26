import { describe, expect, it } from 'vitest';
import { resolveDateRange } from '@/lib/mcp/progress-export';

describe('resolveDateRange', () => {
  it('defaults to the last 90 days ending today', () => {
    const range = resolveDateRange({}, new Date('2026-05-25T14:30:00.000Z'));

    expect(range.from).toBe('2026-02-25');
    expect(range.to).toBe('2026-05-25');
    expect(range.days).toBe(90);
    expect(range.fromIso).toBe('2026-02-25T00:00:00.000Z');
    expect(range.toExclusiveIso).toBe('2026-05-26T00:00:00.000Z');
  });

  it('accepts an explicit inclusive date range', () => {
    const range = resolveDateRange(
      { from: '2026-05-01', to: '2026-05-07' },
      new Date('2026-05-25T14:30:00.000Z')
    );

    expect(range.from).toBe('2026-05-01');
    expect(range.to).toBe('2026-05-07');
    expect(range.days).toBe(7);
  });

  it('rejects malformed and excessive ranges', () => {
    expect(() => resolveDateRange({ from: '05-01-2026' })).toThrow('from must use YYYY-MM-DD format');
    expect(() => resolveDateRange({ from: '2026-05-08', to: '2026-05-07' })).toThrow('from must be on or before to');
    expect(() => resolveDateRange({ from: '2025-01-01', to: '2026-05-25' })).toThrow('date range cannot exceed 365 days');
  });
});
