'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Combo, FoodLogEntry, NutritionDay, PantryFood } from '@/lib/types';

type NutritionPayload = {
  day: NutritionDay;
  pantryFoods: PantryFood[];
  combos: Combo[];
};

type Estimate = {
  name: string;
  servingDescription: string;
  calories: number;
  proteinG: number;
  carbsG: number | null;
  fatG: number | null;
  confidence: 'low' | 'medium' | 'high';
  notes: string | null;
};

type ComboDraftItem = {
  pantryFoodId: number;
  defaultQuantity: string;
};

type AddMode = 'search' | 'combo' | 'estimate';

const EMPTY_ESTIMATE: Estimate = {
  name: '',
  servingDescription: 'estimated serving',
  calories: 0,
  proteinG: 0,
  carbsG: null,
  fatG: null,
  confidence: 'medium',
  notes: null,
};

function todayInputValue(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function formatInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shiftDateValue(value: string, days: number): string {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return todayInputValue();
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return formatInputDate(date);
}

function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value);
}

function formatMacro(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return `${formatNumber(value, 1)}g`;
}

function formNumber(value: string): number | null {
  if (value.trim() === '') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function dateTitle(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function entryCalories(entry: FoodLogEntry): number {
  return entry.calories * entry.quantity;
}

function entryProtein(entry: FoodLogEntry): number {
  return entry.protein_g * entry.quantity;
}

function foodSubtitle(food: PantryFood): string {
  return `${food.serving_description} - ${formatNumber(food.calories)} cal - ${formatNumber(food.protein_g, 1)}g protein`;
}

function comboSubtitle(combo: Combo): string {
  if (combo.items.length === 0) return 'Empty combo shell';
  return combo.items
    .map((item) => `${item.pantry_food?.name || 'Food'} x${formatNumber(item.default_quantity, 2)}`)
    .join(', ');
}

export default function NutritionPage() {
  const [nutritionDate, setNutritionDate] = useState(todayInputValue);
  const [payload, setPayload] = useState<NutritionPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [bodyweightValue, setBodyweightValue] = useState('');
  const [entryQuantities, setEntryQuantities] = useState<Record<number, string>>({});
  const [inventoryQuantities, setInventoryQuantities] = useState<Record<number, string>>({});

  const [addOpen, setAddOpen] = useState(false);
  const [addMode, setAddMode] = useState<AddMode>('search');
  const [searchQuery, setSearchQuery] = useState('');

  const [comboName, setComboName] = useState('');
  const [comboItems, setComboItems] = useState<ComboDraftItem[]>([]);
  const [comboFoodId, setComboFoodId] = useState('');
  const [comboFoodQuantity, setComboFoodQuantity] = useState('1');

  const [mealDescription, setMealDescription] = useState('');
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [addEstimateToInventory, setAddEstimateToInventory] = useState(true);

  const loadNutrition = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/nutrition?date=${encodeURIComponent(date)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Could not load nutrition.');
      setPayload(data);
      setBodyweightValue(data.day?.bodyweight ? String(data.day.bodyweight.weight_lbs) : '');
      setEntryQuantities(
        Object.fromEntries((data.day?.entries || []).map((entry: FoodLogEntry) => [entry.id, String(entry.quantity)]))
      );
    } catch (loadError) {
      console.error('Error loading nutrition:', loadError);
      setError(loadError instanceof Error ? loadError.message : 'Could not load nutrition.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNutrition(nutritionDate);
  }, [loadNutrition, nutritionDate]);

  const day = payload?.day;
  const pantryFoods = useMemo(() => payload?.pantryFoods || [], [payload?.pantryFoods]);
  const combos = useMemo(() => payload?.combos || [], [payload?.combos]);

  const pantryFoodById = useMemo(() => {
    const map = new Map<number, PantryFood>();
    for (const food of pantryFoods) map.set(food.id, food);
    return map;
  }, [pantryFoods]);

  const filteredPantryFoods = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return pantryFoods.slice(0, 12);
    return pantryFoods.filter((food) => (
      food.name.toLowerCase().includes(query) ||
      food.serving_description.toLowerCase().includes(query)
    ));
  }, [pantryFoods, searchQuery]);

  const filteredCombos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return combos.slice(0, 8);
    return combos.filter((combo) => (
      combo.name.toLowerCase().includes(query) ||
      combo.items.some((item) => item.pantry_food?.name.toLowerCase().includes(query))
    ));
  }, [combos, searchQuery]);

  const calorieRemaining = day ? day.targets.calories - day.totals.calories : 2200;
  const proteinRemaining = day ? day.targets.protein_g - day.totals.protein_g : 170;

  async function nutritionRequest(
    method: 'POST' | 'PATCH' | 'DELETE',
    bodyOrUrl: Record<string, unknown> | string,
    options: { reload?: boolean } = {}
  ) {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        typeof bodyOrUrl === 'string' ? bodyOrUrl : '/api/nutrition',
        typeof bodyOrUrl === 'string'
          ? { method }
          : {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bodyOrUrl),
            }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || 'Nutrition request failed.');
      if (options.reload !== false) await loadNutrition(nutritionDate);
      return data;
    } finally {
      setSaving(false);
    }
  }

  function closeAddPanel() {
    setAddOpen(false);
    setAddMode('search');
    setSearchQuery('');
    setMealDescription('');
    setEstimate(null);
    setComboName('');
    setComboItems([]);
    setComboFoodId('');
    setComboFoodQuantity('1');
  }

  async function handleLogPantry(food: PantryFood) {
    try {
      await nutritionRequest('POST', {
        action: 'log_pantry_food',
        date: nutritionDate,
        pantryFoodId: food.id,
        quantity: formNumber(inventoryQuantities[food.id] || '1') || 1,
      });
      closeAddPanel();
      setMessage(`${food.name} logged.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not log food.');
    }
  }

  async function handleLogCombo(combo: Combo) {
    try {
      await nutritionRequest('POST', {
        action: 'log_combo',
        date: nutritionDate,
        comboId: combo.id,
        overrides: [],
      });
      closeAddPanel();
      setMessage(`${combo.name} logged.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not log combo.');
    }
  }

  async function handleEntryQuantity(entryId: number, value: string) {
    setEntryQuantities((current) => ({ ...current, [entryId]: value }));
    try {
      await nutritionRequest('PATCH', {
        action: 'update_entry_quantity',
        id: entryId,
        quantity: formNumber(value),
      });
      setMessage('Quantity updated.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not update quantity.');
    }
  }

  async function handleDeleteEntry(id: number) {
    try {
      await nutritionRequest('DELETE', `/api/nutrition?type=food_log_entry&id=${id}`);
      setMessage('Entry deleted.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete entry.');
    }
  }

  async function handleBodyweightSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await nutritionRequest('POST', {
        action: 'log_bodyweight',
        date: nutritionDate,
        weightLbs: formNumber(bodyweightValue),
      });
      setMessage('Bodyweight saved.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save bodyweight.');
    }
  }

  function addComboDraftItem() {
    const pantryFoodId = Number(comboFoodId);
    if (!Number.isInteger(pantryFoodId) || pantryFoodId < 1) return;
    setComboItems((current) => [
      ...current.filter((item) => item.pantryFoodId !== pantryFoodId),
      { pantryFoodId, defaultQuantity: comboFoodQuantity || '1' },
    ]);
    setComboFoodId('');
    setComboFoodQuantity('1');
  }

  async function saveCombo() {
    try {
      await nutritionRequest('POST', {
        action: 'create_combo',
        name: comboName,
        items: comboItems.map((item) => ({
          pantryFoodId: item.pantryFoodId,
          defaultQuantity: formNumber(item.defaultQuantity),
        })),
      });
      setComboName('');
      setComboItems([]);
      setAddMode('search');
      setMessage('Combo saved.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save combo.');
    }
  }

  async function handleComboSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await saveCombo();
  }

  async function handleEstimateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEstimating(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'estimate_food',
          description: mealDescription,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Could not estimate meal.');
      setEstimate(data.estimate);
    } catch (estimateError) {
      setError(estimateError instanceof Error ? estimateError.message : 'Could not estimate meal.');
    } finally {
      setEstimating(false);
    }
  }

  async function handleLogEstimate() {
    if (!estimate) return;
    try {
      let pantryFoodId: number | null = null;
      if (addEstimateToInventory) {
        const created = await nutritionRequest('POST', {
          action: 'create_pantry_food',
          name: estimate.name,
          servingDescription: estimate.servingDescription,
          calories: estimate.calories,
          proteinG: estimate.proteinG,
          carbsG: estimate.carbsG,
          fatG: estimate.fatG,
        }, { reload: false });
        pantryFoodId = created?.pantryFood?.id ?? null;
      }

      await nutritionRequest('POST', {
        action: 'log_food',
        date: nutritionDate,
        pantryFoodId,
        name: estimate.name,
        calories: estimate.calories,
        proteinG: estimate.proteinG,
        carbsG: estimate.carbsG,
        fatG: estimate.fatG,
        quantity: 1,
      });
      closeAddPanel();
      setMessage(`${estimate.name} logged.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not log estimate.');
    }
  }

  function updateEstimate<K extends keyof Estimate>(key: K, value: Estimate[K]) {
    setEstimate((current) => ({ ...(current || EMPTY_ESTIMATE), [key]: value }));
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-white">
      <main className="mx-auto max-w-3xl pb-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Nommer</p>
            <h1 className="mt-2 text-3xl font-bold">Nommer</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
            >
              Home
            </Link>
            <Link
              href="/workout"
              className="rounded-lg border border-blue-700 bg-blue-950/50 px-4 py-2 text-sm font-semibold text-blue-100 transition-colors hover:bg-blue-900/60"
            >
              Gymmer
            </Link>
          </div>
        </div>

        <section className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
          <label htmlFor="nutrition-date" className="text-sm font-semibold text-zinc-200">
            Date
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="grid grid-cols-[2.75rem_1fr_2.75rem] gap-2 sm:w-auto">
              <button
                type="button"
                aria-label="Previous day"
                onClick={() => setNutritionDate((current) => shiftDateValue(current, -1))}
                className="min-h-11 rounded-lg border border-zinc-700 bg-zinc-950 text-lg font-semibold text-zinc-200 transition-colors hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                &lt;
              </button>
              <input
                id="nutrition-date"
                type="date"
                value={nutritionDate}
                onChange={(event) => setNutritionDate(event.target.value)}
                className="min-h-11 min-w-0 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                aria-label="Next day"
                onClick={() => setNutritionDate((current) => shiftDateValue(current, 1))}
                className="min-h-11 rounded-lg border border-zinc-700 bg-zinc-950 text-lg font-semibold text-zinc-200 transition-colors hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                &gt;
              </button>
            </div>
            <button
              type="button"
              onClick={() => setNutritionDate(todayInputValue())}
              className="min-h-11 rounded-lg border border-blue-800 bg-blue-950/50 px-4 py-2 text-sm font-semibold text-blue-100 transition-colors hover:bg-blue-900/60"
            >
              Today
            </button>
            <p className="text-sm text-zinc-400 sm:ml-auto">{dateTitle(nutritionDate)}</p>
          </div>
        </section>

        {error && <div className="mb-4 rounded-lg border border-red-900/60 bg-red-950/40 p-3 text-sm text-red-200">{error}</div>}
        {message && <div className="mb-4 rounded-lg border border-blue-900/60 bg-blue-950/40 p-3 text-sm text-blue-200">{message}</div>}

        {loading ? (
          <p className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-4 text-sm text-zinc-400">
            Loading nutrition...
          </p>
        ) : (
          <>
            <section className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Daily log</p>
                  <p className="mt-2 text-3xl font-semibold text-blue-100">
                    {formatNumber(day?.totals.calories || 0)} / {formatNumber(day?.targets.calories || 2200)} cal
                  </p>
                  <p className="mt-1 text-lg font-semibold text-zinc-100">
                    {formatNumber(day?.totals.protein_g || 0, 1)} / {formatNumber(day?.targets.protein_g || 170)}g protein
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm sm:min-w-52">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                    <p className="text-zinc-500">Carbs</p>
                    <p className="mt-1 font-semibold">{formatMacro(day?.totals.carbs_g || 0)}</p>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                    <p className="text-zinc-500">Fat</p>
                    <p className="mt-1 font-semibold">{formatMacro(day?.totals.fat_g || 0)}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p className="text-sm text-zinc-400">Goal</p>
                  <p className="mt-2 text-xl font-semibold">
                    {formatNumber(day?.targets.calories || 2200)} cal - {formatNumber(day?.targets.protein_g || 170)}g protein
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {formatNumber(calorieRemaining)} cal remaining - {formatNumber(proteinRemaining, 1)}g protein remaining
                  </p>
                </div>
                <form onSubmit={handleBodyweightSubmit} className="flex gap-2 sm:justify-end">
                  <label htmlFor="bodyweight" className="sr-only">Weight</label>
                  <input
                    id="bodyweight"
                    type="number"
                    min={20}
                    step={0.1}
                    value={bodyweightValue}
                    onChange={(event) => setBodyweightValue(event.target.value)}
                    placeholder="lbs"
                    className="min-h-11 w-28 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Save
                  </button>
                </form>
              </div>
            </section>

            <section className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Eaten so far</h2>
                <span className="text-sm text-zinc-400">{day?.entries.length || 0} items</span>
              </div>

              {day?.entries.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-zinc-800 p-4 text-sm text-zinc-400">
                  No food logged for this date.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {day?.entries.map((entry) => (
                    <div key={entry.id} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold">{entry.name}</h3>
                          <p className="mt-1 text-sm text-zinc-400">
                            {formatNumber(entryCalories(entry))} cal - {formatNumber(entryProtein(entry), 1)}g protein
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            qty {formatNumber(entry.quantity, 2)} - carbs {formatMacro((entry.carbs_g || 0) * entry.quantity)} - fat {formatMacro((entry.fat_g || 0) * entry.quantity)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleDeleteEntry(entry.id)}
                          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-red-500/60 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="mt-3">
                        <label htmlFor={`entry-quantity-${entry.id}`} className="text-xs font-semibold text-zinc-400">
                          Quantity
                        </label>
                        <input
                          id={`entry-quantity-${entry.id}`}
                          type="number"
                          min={0.01}
                          step={0.25}
                          value={entryQuantities[entry.id] || String(entry.quantity)}
                          onChange={(event) => setEntryQuantities({ ...entryQuantities, [entry.id]: event.target.value })}
                          onBlur={(event) => void handleEntryQuantity(entry.id, event.target.value)}
                          className="mt-1 w-24 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="min-h-14 rounded-full bg-blue-600 px-6 text-base font-semibold text-white shadow-lg shadow-blue-950/40 transition-colors hover:bg-blue-500"
              >
                + Add food
              </button>
            </div>
          </>
        )}
      </main>

      {addOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 p-3 sm:p-6">
          <div className="mx-auto flex max-h-[calc(100vh-1.5rem)] max-w-2xl flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl sm:max-h-[calc(100vh-3rem)]">
            <div className="flex items-center justify-between gap-3 border-b border-zinc-800 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-300">Add to log</p>
                <h2 className="mt-1 text-xl font-semibold">{dateTitle(nutritionDate)}</h2>
              </div>
              <button
                type="button"
                onClick={closeAddPanel}
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-900"
              >
                Close
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto border-b border-zinc-800 p-3">
              {[
                ['search', 'Search'],
                ['estimate', 'Estimate from description'],
                ['combo', 'Create combo'],
              ].map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAddMode(mode as AddMode)}
                  className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    addMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto p-4">
              {addMode === 'search' && (
                <div className="space-y-5">
                  <div>
                    <label htmlFor="inventory-search" className="text-sm font-semibold text-zinc-200">
                      What did you eat?
                    </label>
                    <input
                      id="inventory-search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search inventory, dishes, or combos"
                      autoFocus
                      className="mt-2 min-h-12 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-base text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <section>
                    <h3 className="text-sm font-semibold text-zinc-300">Combos</h3>
                    {filteredCombos.length === 0 ? (
                      <p className="mt-2 text-sm text-zinc-500">No combo matches.</p>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {filteredCombos.map((combo) => (
                          <div key={combo.id} className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h4 className="truncate font-semibold">{combo.name}</h4>
                                <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{comboSubtitle(combo)}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => void handleLogCombo(combo)}
                                disabled={saving || combo.items.length === 0}
                                className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Log combo
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-zinc-300">Inventory</h3>
                    {filteredPantryFoods.length === 0 ? (
                      <p className="mt-2 text-sm text-zinc-500">No inventory matches. Try an estimate or create a combo.</p>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {filteredPantryFoods.map((food) => (
                          <div key={food.id} className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0">
                                <h4 className="truncate font-semibold">{food.name}</h4>
                                <p className="mt-1 text-sm text-zinc-400">{foodSubtitle(food)}</p>
                              </div>
                              <div className="flex gap-2">
                                <label htmlFor={`inventory-quantity-${food.id}`} className="sr-only">
                                  {food.name} quantity
                                </label>
                                <input
                                  id={`inventory-quantity-${food.id}`}
                                  type="number"
                                  min={0.01}
                                  step={0.25}
                                  value={inventoryQuantities[food.id] || '1'}
                                  onChange={(event) => setInventoryQuantities({ ...inventoryQuantities, [food.id]: event.target.value })}
                                  className="w-24 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                                <button
                                  type="button"
                                  onClick={() => void handleLogPantry(food)}
                                  disabled={saving}
                                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                  Log
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              )}

              {addMode === 'estimate' && (
                <div className="space-y-4">
                  <form onSubmit={handleEstimateSubmit}>
                    <label htmlFor="meal-description" className="text-sm font-semibold text-zinc-200">
                      Describe what you ate
                    </label>
                    <textarea
                      id="meal-description"
                      value={mealDescription}
                      onChange={(event) => setMealDescription(event.target.value)}
                      maxLength={1000}
                      required
                      rows={4}
                      placeholder="Example: cottage cheese bowl with 5 spoons cottage cheese, 1 scoop PBfit, 4 small spoons chia"
                      className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-base text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="submit"
                      disabled={estimating || !mealDescription.trim()}
                      className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {estimating ? 'Estimating...' : 'Estimate macros'}
                    </button>
                  </form>

                  {estimate && (
                    <section className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
                      <h3 className="text-base font-semibold">Estimate result</h3>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label htmlFor="estimate-name" className="text-sm font-semibold text-zinc-300">Name</label>
                          <input
                            id="estimate-name"
                            value={estimate.name}
                            onChange={(event) => updateEstimate('name', event.target.value)}
                            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="estimate-serving" className="text-sm font-semibold text-zinc-300">Serving</label>
                          <input
                            id="estimate-serving"
                            value={estimate.servingDescription}
                            onChange={(event) => updateEstimate('servingDescription', event.target.value)}
                            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                        {[
                          ['Calories', 'calories'],
                          ['Protein', 'proteinG'],
                          ['Carbs', 'carbsG'],
                          ['Fat', 'fatG'],
                        ].map(([label, key]) => (
                          <div key={key}>
                            <label htmlFor={`estimate-${key}`} className="text-sm font-semibold text-zinc-300">
                              {label}
                            </label>
                            <input
                              id={`estimate-${key}`}
                              type="number"
                              min={0}
                              step={key === 'calories' ? 1 : 0.1}
                              value={estimate[key as keyof Estimate] === null ? '' : String(estimate[key as keyof Estimate])}
                              onChange={(event) => {
                                const value = key === 'calories'
                                  ? Math.round(formNumber(event.target.value) || 0)
                                  : formNumber(event.target.value);
                                updateEstimate(key as keyof Estimate, value as never);
                              }}
                              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-sm text-zinc-400">
                        Confidence: {estimate.confidence}{estimate.notes ? ` - ${estimate.notes}` : ''}
                      </p>
                      <label className="mt-3 flex items-center gap-2 text-sm text-zinc-300">
                        <input
                          type="checkbox"
                          checked={addEstimateToInventory}
                          onChange={(event) => setAddEstimateToInventory(event.target.checked)}
                          className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-blue-600 focus:ring-blue-600"
                        />
                        Add to inventory
                      </label>
                      <button
                        type="button"
                        onClick={() => void handleLogEstimate()}
                        disabled={saving}
                        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Log estimate
                      </button>
                    </section>
                  )}
                </div>
              )}

              {addMode === 'combo' && (
                <form onSubmit={handleComboSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="combo-name" className="text-sm font-semibold text-zinc-200">
                      Combo name
                    </label>
                    <input
                      id="combo-name"
                      value={comboName}
                      onChange={(event) => setComboName(event.target.value)}
                      maxLength={120}
                      required
                      className="mt-2 min-h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid gap-2 sm:grid-cols-[1fr_7rem_auto] sm:items-end">
                    <div>
                      <label htmlFor="combo-food" className="text-sm font-semibold text-zinc-200">
                        Inventory item
                      </label>
                      <select
                        id="combo-food"
                        value={comboFoodId}
                        onChange={(event) => setComboFoodId(event.target.value)}
                        className="mt-2 min-h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="">Choose food</option>
                        {pantryFoods.map((food) => (
                          <option key={food.id} value={food.id}>{food.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="combo-quantity" className="text-sm font-semibold text-zinc-200">
                        Qty
                      </label>
                      <input
                        id="combo-quantity"
                        type="number"
                        min={0.01}
                        step={0.25}
                        value={comboFoodQuantity}
                        onChange={(event) => setComboFoodQuantity(event.target.value)}
                        className="mt-2 min-h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addComboDraftItem}
                      disabled={!comboFoodId}
                      className="min-h-11 rounded-lg border border-blue-800 bg-blue-950/50 px-4 py-2 text-sm font-semibold text-blue-100 transition-colors hover:bg-blue-900/60 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-2">
                    {comboItems.length === 0 ? (
                      <p className="rounded-lg border border-dashed border-zinc-800 p-3 text-sm text-zinc-500">
                        No items yet. Saving an empty shell is allowed.
                      </p>
                    ) : (
                      comboItems.map((item) => {
                        const food = pantryFoodById.get(item.pantryFoodId);
                        return (
                          <button
                            key={item.pantryFoodId}
                            type="button"
                            onClick={() => setComboItems((current) => current.filter((candidate) => candidate.pantryFoodId !== item.pantryFoodId))}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-left text-sm text-zinc-200 transition-colors hover:border-red-500/60"
                          >
                            {food?.name || 'Food'} x{item.defaultQuantity}
                          </button>
                        );
                      })
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => void saveCombo()}
                    disabled={saving || !comboName.trim()}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Save combo
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
