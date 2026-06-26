import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockExecute = vi.fn();
const mockBatch = vi.fn();
const mockTransaction = vi.fn();
const mockTransactionExecute = vi.fn();
const mockTransactionBatch = vi.fn();
const mockTransactionCommit = vi.fn();
const mockTransactionClose = vi.fn();

vi.mock('@libsql/client', () => ({
  createClient: vi.fn(() => ({
    execute: mockExecute,
    batch: mockBatch,
    transaction: mockTransaction,
  })),
}));

type DatabaseModule = typeof import('@/lib/database');
let database: DatabaseModule;

beforeEach(async () => {
  vi.resetModules();
  mockExecute.mockReset();
  mockBatch.mockReset();
  mockTransaction.mockReset();
  mockTransactionExecute.mockReset();
  mockTransactionBatch.mockReset();
  mockTransactionCommit.mockReset();
  mockTransactionClose.mockReset();
  mockExecute.mockResolvedValue({ rows: [] });
  mockBatch.mockResolvedValue([]);
  mockTransactionExecute.mockResolvedValue({ rows: [], lastInsertRowid: 0 });
  mockTransactionBatch.mockResolvedValue([]);
  mockTransactionCommit.mockResolvedValue(undefined);
  mockTransaction.mockResolvedValue({
    execute: mockTransactionExecute,
    batch: mockTransactionBatch,
    commit: mockTransactionCommit,
    close: mockTransactionClose,
  });
  database = await import('@/lib/database');
});

describe('nutrition database helpers', () => {
  it('creates a user-owned pantry food', async () => {
    mockExecute.mockImplementation(async (query) => {
      const sql = typeof query === 'string' ? query : query.sql;
      if (sql.includes('INSERT INTO pantry_foods')) {
        return { rows: [], lastInsertRowid: 12 };
      }
      if (sql.includes('SELECT * FROM pantry_foods WHERE id = ? AND user_id = ?')) {
        return {
          rows: [{
            id: 12,
            user_id: 'user-1',
            name: 'PBfit',
            serving_description: 'per scoop',
            calories: 70,
            protein_g: 8,
            carbs_g: 5,
            fat_g: null,
            created_at: '2026-06-01 12:00:00',
            updated_at: '2026-06-01 12:00:00',
          }],
        };
      }
      return { rows: [] };
    });

    const food = await database.createPantryFood({
      userId: 'user-1',
      name: 'PBfit',
      servingDescription: 'per scoop',
      calories: 70,
      proteinG: 8,
      carbsG: 5,
      fatG: null,
    });

    expect(food).toMatchObject({
      id: 12,
      user_id: 'user-1',
      name: 'PBfit',
      serving_description: 'per scoop',
      calories: 70,
      protein_g: 8,
      carbs_g: 5,
      fat_g: null,
    });
    expect(mockExecute).toHaveBeenCalledWith({
      sql: expect.stringContaining('INSERT INTO pantry_foods'),
      args: ['user-1', 'PBfit', 'per scoop', 70, 8, 5, null],
    });
  });

  it('returns nutrition day totals using entry quantities', async () => {
    mockExecute.mockImplementation(async (query) => {
      const sql = typeof query === 'string' ? query : query.sql;
      if (sql.includes('FROM food_log_entries') && sql.includes('ORDER BY created_at DESC')) {
        return {
          rows: [
            {
              id: 2,
              user_id: 'user-1',
              date: '2026-06-20',
              pantry_food_id: 8,
              name: 'Chia seeds',
              calories: 20,
              protein_g: 1,
              carbs_g: 2,
              fat_g: 1,
              quantity: 4,
              created_at: '2026-06-20 12:05:00',
            },
            {
              id: 1,
              user_id: 'user-1',
              date: '2026-06-20',
              pantry_food_id: 7,
              name: 'Cottage cheese',
              calories: 35,
              protein_g: 5,
              carbs_g: null,
              fat_g: null,
              quantity: 5,
              created_at: '2026-06-20 12:00:00',
            },
          ],
        };
      }
      if (sql.includes('FROM bodyweight_entries')) {
        return {
          rows: [{
            id: 3,
            user_id: 'user-1',
            date: '2026-06-20',
            weight_lbs: 181.4,
            created_at: '2026-06-20 08:00:00',
          }],
        };
      }
      return { rows: [] };
    });

    const day = await database.getNutritionDay('user-1', '2026-06-20');

    expect(day.totals).toEqual({
      calories: 255,
      protein_g: 29,
      carbs_g: 8,
      fat_g: 4,
    });
    expect(day.targets).toEqual({ calories: 2200, protein_g: 170 });
    expect(day.bodyweight?.weight_lbs).toBe(181.4);
  });

  it('creates an empty combo shell', async () => {
    mockTransactionExecute.mockResolvedValue({ rows: [], lastInsertRowid: 4 });
    mockExecute.mockImplementation(async (query) => {
      const sql = typeof query === 'string' ? query : query.sql;
      if (sql.includes('SELECT * FROM combos WHERE id = ? AND user_id = ?')) {
        return {
          rows: [{
            id: 4,
            user_id: 'user-1',
            name: 'Cottage bowl',
            created_at: '2026-06-19 12:00:00',
          }],
        };
      }
      return { rows: [] };
    });

    const combo = await database.createCombo({
      userId: 'user-1',
      name: 'Cottage bowl',
      items: [],
    });

    expect(mockTransaction).toHaveBeenCalledWith('write');
    expect(mockTransactionExecute).toHaveBeenCalledWith({
      sql: 'INSERT INTO combos (user_id, name) VALUES (?, ?)',
      args: ['user-1', 'Cottage bowl'],
    });
    expect(mockTransactionBatch).not.toHaveBeenCalled();
    expect(mockTransactionCommit).toHaveBeenCalled();
    expect(mockTransactionClose).toHaveBeenCalled();
    expect(combo).toMatchObject({
      id: 4,
      user_id: 'user-1',
      name: 'Cottage bowl',
      items: [],
    });
  });

  it('logs a combo as separate pantry-derived entries in one batch', async () => {
    mockExecute.mockImplementation(async (query) => {
      const sql = typeof query === 'string' ? query : query.sql;
      const args = typeof query === 'string' ? [] : query.args || [];

      if (sql.includes('SELECT * FROM combos WHERE id = ? AND user_id = ?')) {
        return {
          rows: [{
            id: 4,
            user_id: 'user-1',
            name: 'Cottage bowl',
            created_at: '2026-06-19 12:00:00',
          }],
        };
      }
      if (sql.includes('FROM combo_items ci') && sql.includes('JOIN pantry_foods pf')) {
        return {
          rows: [
            {
              id: 10,
              combo_id: 4,
              pantry_food_id: 7,
              default_quantity: 5,
              food_id: 7,
              food_user_id: 'user-1',
              food_name: 'Cottage cheese',
              food_serving_description: 'per spoon',
              food_calories: 35,
              food_protein_g: 5,
              food_carbs_g: null,
              food_fat_g: null,
              food_created_at: '2026-06-19 12:00:00',
              food_updated_at: '2026-06-19 12:00:00',
            },
            {
              id: 11,
              combo_id: 4,
              pantry_food_id: 8,
              default_quantity: 1,
              food_id: 8,
              food_user_id: 'user-1',
              food_name: 'PBfit',
              food_serving_description: 'per scoop',
              food_calories: 70,
              food_protein_g: 8,
              food_carbs_g: 5,
              food_fat_g: 1,
              food_created_at: '2026-06-19 12:00:00',
              food_updated_at: '2026-06-19 12:00:00',
            },
          ],
        };
      }
      if (sql.includes('SELECT id FROM pantry_foods WHERE id = ? AND user_id = ?')) {
        return { rows: [{ id: args[0] }] };
      }
      if (sql.includes('SELECT * FROM food_log_entries WHERE id = ? AND user_id = ?')) {
        const isFirst = Number(args[0]) === 101;
        return {
          rows: [{
            id: args[0],
            user_id: 'user-1',
            date: '2026-06-20',
            pantry_food_id: isFirst ? 7 : 8,
            name: isFirst ? 'Cottage cheese' : 'PBfit',
            calories: isFirst ? 35 : 70,
            protein_g: isFirst ? 5 : 8,
            carbs_g: isFirst ? null : 5,
            fat_g: isFirst ? null : 1,
            quantity: isFirst ? 4 : 1,
            created_at: '2026-06-20 12:00:00',
          }],
        };
      }
      return { rows: [] };
    });
    mockBatch.mockResolvedValue([
      { rows: [], lastInsertRowid: 101 },
      { rows: [], lastInsertRowid: 102 },
    ]);

    const entries = await database.logCombo({
      userId: 'user-1',
      date: '2026-06-20',
      comboId: 4,
      overrides: [{ pantryFoodId: 7, quantity: 4 }],
    });

    expect(entries).toHaveLength(2);
    expect(entries.map((entry) => entry.name)).toEqual(['Cottage cheese', 'PBfit']);
    expect(mockBatch).toHaveBeenCalledWith([
      {
        sql: expect.stringContaining('INSERT INTO food_log_entries'),
        args: ['user-1', '2026-06-20', 7, 'Cottage cheese', 35, 5, null, null, 4],
      },
      {
        sql: expect.stringContaining('INSERT INTO food_log_entries'),
        args: ['user-1', '2026-06-20', 8, 'PBfit', 70, 8, 5, 1, 1],
      },
    ], 'write');
  });

  it('does not read created combo entries when the combo batch fails', async () => {
    mockExecute.mockImplementation(async (query) => {
      const sql = typeof query === 'string' ? query : query.sql;
      if (sql.includes('SELECT * FROM combos WHERE id = ? AND user_id = ?')) {
        return {
          rows: [{
            id: 4,
            user_id: 'user-1',
            name: 'Cottage bowl',
            created_at: '2026-06-19 12:00:00',
          }],
        };
      }
      if (sql.includes('FROM combo_items ci') && sql.includes('JOIN pantry_foods pf')) {
        return {
          rows: [{
            id: 10,
            combo_id: 4,
            pantry_food_id: 7,
            default_quantity: 5,
            food_id: 7,
            food_user_id: 'user-1',
            food_name: 'Cottage cheese',
            food_serving_description: 'per spoon',
            food_calories: 35,
            food_protein_g: 5,
            food_carbs_g: null,
            food_fat_g: null,
            food_created_at: '2026-06-19 12:00:00',
            food_updated_at: '2026-06-19 12:00:00',
          }],
        };
      }
      return { rows: [] };
    });
    mockBatch.mockRejectedValue(new Error('batch failed'));

    await expect(database.logCombo({
      userId: 'user-1',
      date: '2026-06-20',
      comboId: 4,
    })).rejects.toThrow('batch failed');

    expect(mockExecute).not.toHaveBeenCalledWith({
      sql: expect.stringContaining('SELECT * FROM food_log_entries'),
      args: expect.any(Array),
    });
  });

  it('rejects zero quantity combo overrides before logging anything', async () => {
    mockExecute.mockImplementation(async (query) => {
      const sql = typeof query === 'string' ? query : query.sql;
      if (sql.includes('SELECT * FROM combos WHERE id = ? AND user_id = ?')) {
        return {
          rows: [{
            id: 4,
            user_id: 'user-1',
            name: 'Cottage bowl',
            created_at: '2026-06-19 12:00:00',
          }],
        };
      }
      if (sql.includes('FROM combo_items ci') && sql.includes('JOIN pantry_foods pf')) {
        return {
          rows: [{
            id: 10,
            combo_id: 4,
            pantry_food_id: 7,
            default_quantity: 5,
            food_id: 7,
            food_user_id: 'user-1',
            food_name: 'Cottage cheese',
            food_serving_description: 'per spoon',
            food_calories: 35,
            food_protein_g: 5,
            food_carbs_g: null,
            food_fat_g: null,
            food_created_at: '2026-06-19 12:00:00',
            food_updated_at: '2026-06-19 12:00:00',
          }],
        };
      }
      return { rows: [] };
    });

    await expect(database.logCombo({
      userId: 'user-1',
      date: '2026-06-20',
      comboId: 4,
      overrides: [{ pantryFoodId: 7, quantity: 0 }],
    })).rejects.toThrow('Combo item quantity must be greater than 0');

    expect(mockBatch).not.toHaveBeenCalled();
  });
});
