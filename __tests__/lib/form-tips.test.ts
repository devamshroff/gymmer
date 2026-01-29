import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateFormTips } from '@/lib/form-tips';

const originalEnv = { ...process.env };

describe('generateFormTips', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it('returns null when OPENAI_API_KEY is missing', async () => {
    delete process.env.OPENAI_API_KEY;
    const result = await generateFormTips({
      kind: 'exercise',
      name: 'Bench Press'
    });

    expect(result).toBeNull();
  });

  it('returns normalized tips for exercise requests', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: ' - Keep your wrists stacked.  '
            }
          }
        ]
      })
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await generateFormTips({
      kind: 'exercise',
      name: 'Bench Press',
      muscleGroups: ['chest'],
      equipment: 'barbell',
      difficulty: 'intermediate'
    });

    expect(result).toBe('Keep your wrists stacked.');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('returns normalized tips for stretch requests', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: '"Breathe slowly and avoid bouncing."'
            }
          }
        ]
      })
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await generateFormTips({
      kind: 'stretch',
      name: 'Hamstring Stretch',
      duration: '30 seconds',
      stretchType: 'pre_workout',
      muscleGroups: ['hamstrings']
    });

    expect(result).toBe('Breathe slowly and avoid bouncing.');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('returns null when the OpenAI request fails', async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      text: async () => 'Bad request'
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await generateFormTips({
      kind: 'exercise',
      name: 'Deadlift'
    });

    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
  });
});
