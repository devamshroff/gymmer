import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  createCombo: vi.fn(),
  createFoodLogEntry: vi.fn(),
  createPantryFood: vi.fn(),
  deleteCombo: vi.fn(),
  deleteFoodLogEntry: vi.fn(),
  deletePantryFood: vi.fn(),
  getNutritionDay: vi.fn(),
  listCombos: vi.fn(),
  listPantryFoods: vi.fn(),
  logCombo: vi.fn(),
  logPantryFoodEntry: vi.fn(),
  updateCombo: vi.fn(),
  updateFoodLogEntryQuantity: vi.fn(),
  updatePantryFood: vi.fn(),
  upsertBodyweightEntry: vi.fn(),
}));

vi.mock('@/lib/auth-utils', () => ({
  requireAuth: mocks.requireAuth,
}));

vi.mock('@/lib/database', () => ({
  createCombo: mocks.createCombo,
  createFoodLogEntry: mocks.createFoodLogEntry,
  createPantryFood: mocks.createPantryFood,
  deleteCombo: mocks.deleteCombo,
  deleteFoodLogEntry: mocks.deleteFoodLogEntry,
  deletePantryFood: mocks.deletePantryFood,
  getNutritionDay: mocks.getNutritionDay,
  listCombos: mocks.listCombos,
  listPantryFoods: mocks.listPantryFoods,
  logCombo: mocks.logCombo,
  logPantryFoodEntry: mocks.logPantryFoodEntry,
  updateCombo: mocks.updateCombo,
  updateFoodLogEntryQuantity: mocks.updateFoodLogEntryQuantity,
  updatePantryFood: mocks.updatePantryFood,
  upsertBodyweightEntry: mocks.upsertBodyweightEntry,
}));

function buildRequest(body: Record<string, unknown>) {
  return new NextRequest('https://temple.test/api/nutrition', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('nutrition estimate route', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
    delete process.env.ANTHROPIC_MODEL;
    delete process.env.ANTHROPIC_VERSION;
    mocks.requireAuth.mockResolvedValue({ user: { id: 'user-1' } });
    mocks.listPantryFoods.mockResolvedValue([
      {
        id: 1,
        user_id: 'user-1',
        name: 'Cottage cheese',
        serving_description: 'per spoon',
        calories: 35,
        protein_g: 5,
        carbs_g: null,
        fat_g: null,
        created_at: '2026-06-20 12:00:00',
        updated_at: '2026-06-20 12:00:00',
      },
    ]);
    mocks.listCombos.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_MODEL;
    delete process.env.ANTHROPIC_VERSION;
  });

  it('returns a parsed editable estimate from model JSON', async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const requestBody = JSON.parse(String(init?.body));
      expect(String(_url)).toBe('https://api.anthropic.com/v1/messages');
      expect(init?.headers).toMatchObject({
        'x-api-key': 'test-anthropic-key',
        'anthropic-version': '2023-06-01',
      });
      expect(requestBody.model).toBe('claude-sonnet-4-5');
      expect(requestBody.messages[0].content).toContain('cottage cheese bowl');
      expect(requestBody.messages[0].content).toContain('Cottage cheese');

      return new Response(
        JSON.stringify({
          content: [
            {
              type: 'text',
              text: [
                '```json',
                '{',
                '  "name": "Cottage cheese bowl",',
                '  "serving_description": "1 bowl",',
                '  "calories": 410,',
                '  "protein_g": 45,',
                '  "carbs_g": 30,',
                '  "fat_g": 12,',
                '  "confidence": "high",',
                '  "notes": "Based on the described amount."',
                '}',
                '```',
              ].join('\n'),
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    });
    vi.stubGlobal('fetch', fetchMock);

    const { POST } = await import('@/app/api/nutrition/route');
    const response = await POST(buildRequest({
      action: 'estimate_food',
      description: 'cottage cheese bowl with chia',
    }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.estimate).toEqual({
      name: 'Cottage cheese bowl',
      servingDescription: '1 bowl',
      calories: 410,
      proteinG: 45,
      carbsG: 30,
      fatG: 12,
      confidence: 'high',
      notes: 'Based on the described amount.',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(mocks.listPantryFoods).toHaveBeenCalledWith('user-1');
    expect(mocks.listCombos).toHaveBeenCalledWith('user-1');
  });

  it('returns a server error when Anthropic configuration is missing', async () => {
    delete process.env.ANTHROPIC_API_KEY;

    const { POST } = await import('@/app/api/nutrition/route');
    const response = await POST(buildRequest({
      action: 'estimate_food',
      description: 'protein shake',
    }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Missing ANTHROPIC_API_KEY');
    expect(mocks.listPantryFoods).not.toHaveBeenCalled();
    expect(mocks.listCombos).not.toHaveBeenCalled();
  });
});
