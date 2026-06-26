import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import {
  createCombo,
  createFoodLogEntry,
  createPantryFood,
  deleteCombo,
  deleteFoodLogEntry,
  deletePantryFood,
  getNutritionDay,
  listCombos,
  listPantryFoods,
  logCombo,
  logPantryFoodEntry,
  updateCombo,
  updateFoodLogEntryQuantity,
  updatePantryFood,
  upsertBodyweightEntry,
} from '@/lib/database';
import { ClaudeRequestError, createClaudeText, getClaudeModel, hasClaudeApiKey } from '@/lib/claude';

const MAX_NAME_LENGTH = 120;
const MAX_SERVING_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 1000;

type FoodEstimate = {
  name: string;
  servingDescription: string;
  calories: number;
  proteinG: number;
  carbsG: number | null;
  fatG: number | null;
  confidence: 'low' | 'medium' | 'high';
  notes: string | null;
};

function todayInputValue(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function normalizeDay(value: unknown, fallback = todayInputValue()): string {
  const raw = typeof value === 'string' && value.trim() ? value.trim() : fallback;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    throw new Error('Date must use YYYY-MM-DD format');
  }
  const date = new Date(`${raw}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== raw) {
    throw new Error('Date must be a valid calendar date');
  }
  return raw;
}

function normalizeText(value: unknown, label: string, maxLength: number): string {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) throw new Error(`${label} is required`);
  if (text.length > maxLength) throw new Error(`${label} must be ${maxLength} characters or less`);
  return text;
}

function extractJson(content: string): string {
  const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) return fencedMatch[1];
  return content;
}

function normalizeNumber(
  value: unknown,
  label: string,
  options: { min?: number; max?: number; integer?: boolean } = {}
): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) throw new Error(`${label} must be a number`);
  if (options.min !== undefined && numeric < options.min) {
    throw new Error(`${label} must be at least ${options.min}`);
  }
  if (options.max !== undefined && numeric > options.max) {
    throw new Error(`${label} must be ${options.max} or less`);
  }
  return options.integer ? Math.round(numeric) : numeric;
}

function optionalMacro(value: unknown, label: string): number | null {
  if (value === undefined || value === null || value === '') return null;
  return normalizeNumber(value, label, { min: 0, max: 1000 });
}

function normalizeId(value: unknown, label: string): number {
  return normalizeNumber(value, label, { min: 1, integer: true });
}

function normalizeQuantity(value: unknown): number {
  return normalizeNumber(value ?? 1, 'Quantity', { min: 0.01, max: 100 });
}

function normalizeComboItems(value: unknown): Array<{ pantryFoodId: number; defaultQuantity: number }> {
  if (!Array.isArray(value)) throw new Error('Combo items are required');
  return value.map((item) => {
    const data = item as Record<string, unknown>;
    return {
      pantryFoodId: normalizeId(data.pantryFoodId ?? data.pantry_food_id, 'Pantry food id'),
      defaultQuantity: normalizeNumber(data.defaultQuantity ?? data.default_quantity, 'Default quantity', {
        min: 0.01,
        max: 100,
      }),
    };
  });
}

function normalizeOverrides(value: unknown): Array<{ pantryFoodId: number; quantity: number }> {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new Error('Overrides must be an array');
  return value.map((item) => {
    const data = item as Record<string, unknown>;
    return {
      pantryFoodId: normalizeId(data.pantryFoodId ?? data.pantry_food_id, 'Pantry food id'),
      quantity: normalizeNumber(data.quantity, 'Quantity', { min: 0.01, max: 100 }),
    };
  });
}

function parseFoodEstimate(value: unknown): FoodEstimate {
  const data = value as Record<string, unknown>;
  const confidence = data.confidence === 'low' || data.confidence === 'high'
    ? data.confidence
    : 'medium';
  return {
    name: normalizeText(data.name, 'Estimated name', MAX_NAME_LENGTH),
    servingDescription: normalizeText(
      data.serving_description ?? data.servingDescription ?? 'estimated serving',
      'Estimated serving',
      MAX_SERVING_LENGTH
    ),
    calories: normalizeNumber(data.calories, 'Estimated calories', { min: 0, max: 10000, integer: true }),
    proteinG: normalizeNumber(data.protein_g ?? data.proteinG, 'Estimated protein', { min: 0, max: 1000 }),
    carbsG: optionalMacro(data.carbs_g ?? data.carbsG, 'Estimated carbs'),
    fatG: optionalMacro(data.fat_g ?? data.fatG, 'Estimated fat'),
    confidence,
    notes: typeof data.notes === 'string' && data.notes.trim()
      ? data.notes.trim().slice(0, 240)
      : null,
  };
}

async function estimateFoodForUser(
  userId: string,
  description: string
): Promise<FoodEstimate> {
  if (!hasClaudeApiKey()) {
    throw new ClaudeRequestError('Missing ANTHROPIC_API_KEY', 500);
  }

  const [pantryFoods, combos] = await Promise.all([
    listPantryFoods(userId),
    listCombos(userId),
  ]);
  const inventory = {
    pantryFoods: pantryFoods.map((food) => ({
      name: food.name,
      serving_description: food.serving_description,
      calories: food.calories,
      protein_g: food.protein_g,
      carbs_g: food.carbs_g,
      fat_g: food.fat_g,
    })).slice(0, 80),
    combos: combos.map((combo) => ({
      name: combo.name,
      items: combo.items.map((item) => ({
        name: item.pantry_food?.name || 'Unknown food',
        default_quantity: item.default_quantity,
      })),
    })).slice(0, 40),
  };

  const { text: content } = await createClaudeText({
    model: getClaudeModel(),
    system: [
      'You estimate nutrition for a personal food log.',
      'Return ONLY valid JSON with this exact shape:',
      '{',
      '  "name": string,',
      '  "serving_description": string,',
      '  "calories": integer,',
      '  "protein_g": number,',
      '  "carbs_g": number | null,',
      '  "fat_g": number | null,',
      '  "confidence": "low" | "medium" | "high",',
      '  "notes": string | null',
      '}',
      'Estimate for the described eaten amount, not per 100g.',
      'Use the user inventory as context when it clearly matches, but do not invent exact certainty.',
      'No markdown, no explanations outside JSON.',
    ].join('\n'),
    messages: [
      {
        role: 'user',
        content: JSON.stringify({ description, inventory }),
      },
    ],
    temperature: 0.2,
    maxTokens: 350,
  });

  try {
    return parseFoodEstimate(JSON.parse(extractJson(content)));
  } catch {
    throw new ClaudeRequestError('Model did not return a valid nutrition estimate', 502);
  }
}

function estimateError(error: unknown) {
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'Could not estimate nutrition' },
    { status: error instanceof ClaudeRequestError ? error.status : 502 }
  );
}

function badRequest(error: unknown) {
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'Invalid nutrition request' },
    { status: 400 }
  );
}

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const date = normalizeDay(request.nextUrl.searchParams.get('date'));
    const [day, pantryFoods, combos] = await Promise.all([
      getNutritionDay(user.id, date),
      listPantryFoods(user.id),
      listCombos(user.id),
    ]);
    return NextResponse.json({ day, pantryFoods, combos });
  } catch (error) {
    return badRequest(error);
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const action = typeof body?.action === 'string' ? body.action : '';

    if (action === 'create_pantry_food') {
      const pantryFood = await createPantryFood({
        userId: user.id,
        name: normalizeText(body.name, 'Name', MAX_NAME_LENGTH),
        servingDescription: normalizeText(body.servingDescription ?? body.serving_description, 'Serving', MAX_SERVING_LENGTH),
        calories: normalizeNumber(body.calories, 'Calories', { min: 0, max: 10000, integer: true }),
        proteinG: normalizeNumber(body.proteinG ?? body.protein_g, 'Protein', { min: 0, max: 1000 }),
        carbsG: optionalMacro(body.carbsG ?? body.carbs_g, 'Carbs'),
        fatG: optionalMacro(body.fatG ?? body.fat_g, 'Fat'),
      });
      return NextResponse.json({ pantryFood }, { status: 201 });
    }

    if (action === 'log_pantry_food') {
      const entry = await logPantryFoodEntry({
        userId: user.id,
        date: normalizeDay(body.date),
        pantryFoodId: normalizeId(body.pantryFoodId ?? body.pantry_food_id, 'Pantry food id'),
        quantity: normalizeQuantity(body.quantity),
      });
      return NextResponse.json({ entry }, { status: 201 });
    }

    if (action === 'log_food') {
      const pantryFoodId = body.pantryFoodId ?? body.pantry_food_id;
      const entry = await createFoodLogEntry({
        userId: user.id,
        date: normalizeDay(body.date),
        pantryFoodId: pantryFoodId === undefined || pantryFoodId === null || pantryFoodId === ''
          ? null
          : normalizeId(pantryFoodId, 'Pantry food id'),
        name: normalizeText(body.name, 'Name', MAX_NAME_LENGTH),
        calories: normalizeNumber(body.calories, 'Calories', { min: 0, max: 10000, integer: true }),
        proteinG: normalizeNumber(body.proteinG ?? body.protein_g, 'Protein', { min: 0, max: 1000 }),
        carbsG: optionalMacro(body.carbsG ?? body.carbs_g, 'Carbs'),
        fatG: optionalMacro(body.fatG ?? body.fat_g, 'Fat'),
        quantity: normalizeQuantity(body.quantity),
      });
      return NextResponse.json({ entry }, { status: 201 });
    }

    if (action === 'log_bodyweight') {
      const bodyweight = await upsertBodyweightEntry({
        userId: user.id,
        date: normalizeDay(body.date),
        weightLbs: normalizeNumber(body.weightLbs ?? body.weight_lbs, 'Weight', { min: 20, max: 1000 }),
      });
      return NextResponse.json({ bodyweight }, { status: 201 });
    }

    if (action === 'create_combo') {
      const combo = await createCombo({
        userId: user.id,
        name: normalizeText(body.name, 'Name', MAX_NAME_LENGTH),
        items: normalizeComboItems(body.items),
      });
      return NextResponse.json({ combo }, { status: 201 });
    }

    if (action === 'log_combo') {
      const entries = await logCombo({
        userId: user.id,
        date: normalizeDay(body.date),
        comboId: normalizeId(body.comboId ?? body.combo_id, 'Combo id'),
        overrides: normalizeOverrides(body.overrides),
      });
      return NextResponse.json({ entries }, { status: 201 });
    }

    if (action === 'estimate_food') {
      const description = normalizeText(body.description, 'Description', MAX_DESCRIPTION_LENGTH);
      try {
        const estimate = await estimateFoodForUser(user.id, description);
        return NextResponse.json({ estimate });
      } catch (estimateFailure) {
        return estimateError(estimateFailure);
      }
    }

    return NextResponse.json({ error: 'Unknown nutrition action' }, { status: 400 });
  } catch (error) {
    return badRequest(error);
  }
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireAuth(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const action = typeof body?.action === 'string' ? body.action : '';

    if (action === 'update_pantry_food') {
      const pantryFood = await updatePantryFood(
        user.id,
        normalizeId(body.id, 'Pantry food id'),
        {
          name: normalizeText(body.name, 'Name', MAX_NAME_LENGTH),
          servingDescription: normalizeText(body.servingDescription ?? body.serving_description, 'Serving', MAX_SERVING_LENGTH),
          calories: normalizeNumber(body.calories, 'Calories', { min: 0, max: 10000, integer: true }),
          proteinG: normalizeNumber(body.proteinG ?? body.protein_g, 'Protein', { min: 0, max: 1000 }),
          carbsG: optionalMacro(body.carbsG ?? body.carbs_g, 'Carbs'),
          fatG: optionalMacro(body.fatG ?? body.fat_g, 'Fat'),
        }
      );
      if (!pantryFood) return NextResponse.json({ error: 'Pantry food not found' }, { status: 404 });
      return NextResponse.json({ pantryFood });
    }

    if (action === 'update_entry_quantity') {
      const entry = await updateFoodLogEntryQuantity(
        user.id,
        normalizeId(body.id, 'Entry id'),
        normalizeQuantity(body.quantity)
      );
      if (!entry) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
      return NextResponse.json({ entry });
    }

    if (action === 'update_combo') {
      const combo = await updateCombo(
        user.id,
        normalizeId(body.id, 'Combo id'),
        {
          name: normalizeText(body.name, 'Name', MAX_NAME_LENGTH),
          items: normalizeComboItems(body.items),
        }
      );
      if (!combo) return NextResponse.json({ error: 'Combo not found' }, { status: 404 });
      return NextResponse.json({ combo });
    }

    return NextResponse.json({ error: 'Unknown nutrition action' }, { status: 400 });
  } catch (error) {
    return badRequest(error);
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireAuth(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const type = request.nextUrl.searchParams.get('type');
    const id = normalizeId(request.nextUrl.searchParams.get('id'), 'Id');

    if (type === 'pantry_food') {
      const deleted = await deletePantryFood(user.id, id);
      if (!deleted) return NextResponse.json({ error: 'Pantry food not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    if (type === 'food_log_entry') {
      const deleted = await deleteFoodLogEntry(user.id, id);
      if (!deleted) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    if (type === 'combo') {
      const deleted = await deleteCombo(user.id, id);
      if (!deleted) return NextResponse.json({ error: 'Combo not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown nutrition type' }, { status: 400 });
  } catch (error) {
    return badRequest(error);
  }
}
