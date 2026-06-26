import { test, expect } from '@playwright/test';

type TestPantryFood = {
  id: number;
  user_id: string;
  name: string;
  serving_description: string;
  calories: number;
  protein_g: number;
  carbs_g: number | null;
  fat_g: number | null;
  created_at: string;
  updated_at: string;
};

type TestFoodLogEntry = {
  id: number;
  user_id: string;
  date: string;
  pantry_food_id: number | null;
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number | null;
  fat_g: number | null;
  quantity: number;
  created_at: string;
};

type TestComboItem = {
  id: number;
  combo_id: number;
  pantry_food_id: number;
  default_quantity: number;
  pantry_food: TestPantryFood;
};

type TestCombo = {
  id: number;
  user_id: string;
  name: string;
  created_at: string;
  items: TestComboItem[];
};

type TestBodyweight = {
  id: number;
  user_id: string;
  date: string;
  weight_lbs: number;
  created_at: string;
};

type NutritionPostBody = {
  action?: string;
  description?: string;
  name?: string;
  servingDescription?: string;
  calories?: number;
  proteinG?: number;
  carbsG?: number | null;
  fatG?: number | null;
  pantryFoodId?: number;
  quantity?: number;
  date?: string;
  weightLbs?: number;
  items?: Array<{ pantryFoodId: number; defaultQuantity: number }>;
  comboId?: number;
  overrides?: Array<{ pantryFoodId: number; quantity: number }>;
};

test('Nommer day log estimates a meal, saves it to inventory, and logs a combo', async ({ page }) => {
  const pantryFoods: TestPantryFood[] = [];
  const entries: TestFoodLogEntry[] = [];
  const combos: TestCombo[] = [];
  let bodyweight: TestBodyweight | null = null;
  let nextId = 1;

  function buildDay(date: string) {
    const dayEntries = entries.filter((entry) => entry.date === date);
    const totals = dayEntries.reduce(
      (current, entry) => ({
        calories: current.calories + entry.calories * entry.quantity,
        protein_g: current.protein_g + entry.protein_g * entry.quantity,
        carbs_g: current.carbs_g + (entry.carbs_g ?? 0) * entry.quantity,
        fat_g: current.fat_g + (entry.fat_g ?? 0) * entry.quantity,
      }),
      { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
    );
    return {
      date,
      entries: dayEntries,
      totals,
      targets: { calories: 2200, protein_g: 170 },
      bodyweight: bodyweight?.date === date ? bodyweight : null,
    };
  }

  await page.route('**/api/nutrition?*', async (route) => {
    const url = new URL(route.request().url());

    if (route.request().method() === 'DELETE') {
      const id = Number(url.searchParams.get('id'));
      const type = url.searchParams.get('type');
      if (type === 'food_log_entry') {
        const index = entries.findIndex((entry) => entry.id === id);
        if (index >= 0) entries.splice(index, 1);
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    const date = url.searchParams.get('date') || '2026-06-20';
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        day: buildDay(date),
        pantryFoods,
        combos,
      }),
    });
  });

  await page.route('**/api/nutrition', async (route) => {
    const body = route.request().postDataJSON() as NutritionPostBody;

    if (body.action === 'estimate_food') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          estimate: {
            name: 'Chicken bowl',
            servingDescription: '1 bowl',
            calories: 520,
            proteinG: 38,
            carbsG: 55,
            fatG: 16,
            confidence: 'medium',
            notes: 'Estimated from description.',
          },
        }),
      });
      return;
    }

    if (body.action === 'create_pantry_food') {
      const food = {
        id: nextId++,
        user_id: 'e2e@test.local',
        name: body.name || '',
        serving_description: body.servingDescription || '',
        calories: body.calories || 0,
        protein_g: body.proteinG || 0,
        carbs_g: body.carbsG ?? null,
        fat_g: body.fatG ?? null,
        created_at: '2026-06-20 12:00:00',
        updated_at: '2026-06-20 12:00:00',
      } satisfies TestPantryFood;
      pantryFoods.push(food);
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ pantryFood: food }) });
      return;
    }

    if (body.action === 'log_food') {
      const entry = {
        id: nextId++,
        user_id: 'e2e@test.local',
        date: body.date || '2026-06-20',
        pantry_food_id: body.pantryFoodId ?? null,
        name: body.name || '',
        calories: body.calories || 0,
        protein_g: body.proteinG || 0,
        carbs_g: body.carbsG ?? null,
        fat_g: body.fatG ?? null,
        quantity: body.quantity || 1,
        created_at: '2026-06-20 12:00:00',
      } satisfies TestFoodLogEntry;
      entries.push(entry);
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ entry }) });
      return;
    }

    if (body.action === 'log_bodyweight') {
      bodyweight = {
        id: nextId++,
        user_id: 'e2e@test.local',
        date: body.date || '2026-06-20',
        weight_lbs: body.weightLbs || 0,
        created_at: '2026-06-20 08:00:00',
      } satisfies TestBodyweight;
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ bodyweight }) });
      return;
    }

    if (body.action === 'create_combo') {
      const comboId = nextId++;
      const combo = {
        id: comboId,
        user_id: 'e2e@test.local',
        name: body.name || '',
        created_at: '2026-06-20 12:00:00',
        items: (body.items || []).flatMap((item) => {
          const pantryFood = pantryFoods.find((food) => food.id === item.pantryFoodId);
          if (!pantryFood) return [];
          return [{
            id: nextId++,
            combo_id: comboId,
            pantry_food_id: item.pantryFoodId,
            default_quantity: item.defaultQuantity,
            pantry_food: pantryFood,
          } satisfies TestComboItem];
        }),
      } satisfies TestCombo;
      combos.push(combo);
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ combo }) });
      return;
    }

    if (body.action === 'log_combo') {
      const combo = combos.find((item) => item.id === body.comboId);
      if (!combo || !body.date) {
        await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ error: 'Missing combo' }) });
        return;
      }
      const created = combo.items.map((item) => {
        const override = (body.overrides || []).find((candidate) => candidate.pantryFoodId === item.pantry_food_id);
        const food = item.pantry_food;
        const entry = {
          id: nextId++,
          user_id: 'e2e@test.local',
          date: body.date || '2026-06-20',
          pantry_food_id: food.id,
          name: food.name,
          calories: food.calories,
          protein_g: food.protein_g,
          carbs_g: food.carbs_g,
          fat_g: food.fat_g,
          quantity: override?.quantity ?? item.default_quantity,
          created_at: '2026-06-20 12:00:00',
        } satisfies TestFoodLogEntry;
        entries.push(entry);
        return entry;
      });
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ entries: created }) });
      return;
    }

    await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ error: 'Unhandled action' }) });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Nommer' }).click();
  await expect(page.getByRole('heading', { name: 'Nommer' })).toBeVisible();

  await page.locator('#nutrition-date').fill('2026-06-20');
  await page.getByRole('button', { name: 'Previous day' }).click();
  await expect(page.locator('#nutrition-date')).toHaveValue('2026-06-19');
  await page.getByRole('button', { name: 'Next day' }).click();
  await expect(page.locator('#nutrition-date')).toHaveValue('2026-06-20');
  await expect(page.getByText('0 / 2,200 cal')).toBeVisible();
  await expect(page.getByText('No food logged for this date.')).toBeVisible();

  await page.locator('#bodyweight').fill('181.4');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Bodyweight saved.')).toBeVisible();

  await page.getByRole('button', { name: '+ Add food' }).click();
  await page.getByRole('button', { name: 'Estimate from description' }).click();
  await page.locator('#meal-description').fill('Chicken rice bowl with sauce');
  await page.getByRole('button', { name: 'Estimate macros' }).click();
  await expect(page.getByRole('heading', { name: 'Estimate result' })).toBeVisible();
  await expect(page.locator('#estimate-name')).toHaveValue('Chicken bowl');
  await expect(page.getByLabel('Add to inventory')).toBeChecked();
  await page.getByRole('button', { name: 'Log estimate' }).click();

  await expect(page.getByRole('heading', { name: 'Chicken bowl' })).toBeVisible();
  await expect(page.getByText('520 / 2,200 cal')).toBeVisible();
  await expect(page.getByText('38 / 170g protein')).toBeVisible();

  await page.getByRole('button', { name: '+ Add food' }).click();
  await page.getByRole('button', { name: 'Create combo' }).click();
  await page.locator('#combo-name').fill('Chicken bowl shortcut');
  await page.locator('#combo-food').selectOption({ label: 'Chicken bowl' });
  await page.locator('#combo-quantity').fill('1');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Chicken bowl x1' })).toBeVisible();
  await page.getByRole('button', { name: 'Save combo' }).click();

  await expect(page.getByText('Combo saved.')).toBeVisible();
  await page.locator('#inventory-search').fill('shortcut');
  await expect(page.getByRole('heading', { name: 'Chicken bowl shortcut' })).toBeVisible();
  await page.getByRole('button', { name: 'Log combo' }).click();

  await expect(page.getByText('1,040 / 2,200 cal')).toBeVisible();
  await expect(page.getByText('76 / 170g protein')).toBeVisible();
});
