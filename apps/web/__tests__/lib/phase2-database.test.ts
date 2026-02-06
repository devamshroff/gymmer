import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the libsql client
const mockExecute = vi.fn();
const mockClose = vi.fn();

vi.mock('@libsql/client', () => ({
  createClient: vi.fn(() => ({
    execute: mockExecute,
    close: mockClose,
  })),
}));

// Import after mocking
import {
  setUsername,
  getUsernameExists,
  getUserWithUsername,
  getUserSettings,
  getPublicRoutines,
  addFavorite,
  removeFavorite,
  isFavorited,
  getFavoritedRoutines,
  cloneRoutine,
  setRoutinePublic,
  upsertUserSettings,
} from '@/lib/database';

describe('Phase 2: Username Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecute.mockResolvedValue({ rows: [] });
  });

  describe('setUsername', () => {
    it('updates user with new username', async () => {
      mockExecute.mockResolvedValueOnce({ rows: [] });

      await setUsername('user-123', 'johndoe');

      expect(mockExecute).toHaveBeenCalledWith({
        sql: expect.stringContaining('UPDATE users SET username'),
        args: ['johndoe', 'user-123'],
      });
    });
  });

  describe('getUsernameExists', () => {
    it('returns true when username exists', async () => {
      mockExecute.mockResolvedValueOnce({ rows: [{ 1: 1 }] });

      const exists = await getUsernameExists('johndoe');

      expect(exists).toBe(true);
      expect(mockExecute).toHaveBeenCalledWith({
        sql: 'SELECT 1 FROM users WHERE username = ?',
        args: ['johndoe'],
      });
    });

    it('returns false when username does not exist', async () => {
      mockExecute.mockResolvedValueOnce({ rows: [] });

      const exists = await getUsernameExists('nonexistent');

      expect(exists).toBe(false);
    });
  });

  describe('getUserWithUsername', () => {
    it('returns user data with username', async () => {
      const userData = {
        id: 'user-123',
        email: 'john@example.com',
        username: 'johndoe',
        name: 'John Doe',
        image: null,
      };
      mockExecute.mockResolvedValueOnce({ rows: [userData] });

      const user = await getUserWithUsername('user-123');

      expect(user).toEqual(userData);
      expect(mockExecute).toHaveBeenCalledWith({
        sql: expect.stringContaining('SELECT'),
        args: ['user-123'],
      });
    });

    it('returns null when user not found', async () => {
      mockExecute.mockResolvedValueOnce({ rows: [] });

      const user = await getUserWithUsername('nonexistent');

      expect(user).toBeNull();
    });
  });
});

describe('Phase 2: Public Routines Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecute.mockResolvedValue({ rows: [] });
  });

  describe('getPublicRoutines', () => {
    it('returns all public routines', async () => {
      const routines = [
        { id: 1, name: 'Routine 1', is_public: 1, creator_username: 'user1' },
        { id: 2, name: 'Routine 2', is_public: 1, creator_username: 'user2' },
      ];
      mockExecute.mockImplementation(({ sql }) => {
        if (typeof sql === 'string' && sql.includes('PRAGMA table_info(routines)')) {
          return Promise.resolve({ rows: [{ name: 'like_count' }, { name: 'clone_count' }] });
        }
        if (typeof sql === 'string' && sql.includes('FROM routines r')) {
          return Promise.resolve({ rows: routines });
        }
        return Promise.resolve({ rows: [] });
      });

      const result = await getPublicRoutines();

      expect(result).toEqual(routines);
      expect(mockExecute).toHaveBeenCalledWith({
        sql: expect.stringContaining('WHERE r.is_public = 1'),
        args: [],
      });
      expect(mockExecute).toHaveBeenCalledWith({
        sql: expect.stringContaining('ORDER BY (COALESCE(r.like_count, 0) + COALESCE(r.clone_count, 0)) DESC'),
        args: [],
      });
    });

    it('excludes specific user when provided', async () => {
      const routines = [
        { id: 2, name: 'Routine 2', is_public: 1, creator_username: 'user2' },
      ];
      mockExecute.mockImplementation(({ sql }) => {
        if (typeof sql === 'string' && sql.includes('PRAGMA table_info(routines)')) {
          return Promise.resolve({ rows: [{ name: 'like_count' }, { name: 'clone_count' }] });
        }
        if (typeof sql === 'string' && sql.includes('PRAGMA table_info(workout_sessions)')) {
          return Promise.resolve({ rows: [{ name: 'routine_id' }] });
        }
        if (typeof sql === 'string' && sql.includes('UPDATE workout_sessions')) {
          return Promise.resolve({ rows: [] });
        }
        if (typeof sql === 'string' && sql.includes('FROM routines r')) {
          return Promise.resolve({ rows: routines });
        }
        return Promise.resolve({ rows: [] });
      });

      const result = await getPublicRoutines('user1-id');

      expect(result).toEqual(routines);
      expect(mockExecute).toHaveBeenCalledWith({
        sql: expect.stringContaining('r.user_id != ?'),
        args: ['user1-id', 'user1-id'],
      });
    });
  });

  describe('setRoutinePublic', () => {
    it('sets routine to public', async () => {
      mockExecute.mockResolvedValueOnce({ rows: [] });

      await setRoutinePublic(1, 'user-123', true);

      expect(mockExecute).toHaveBeenCalledWith({
        sql: expect.stringContaining('UPDATE routines SET is_public'),
        args: [1, 1, 'user-123'],
      });
    });

    it('sets routine to private', async () => {
      mockExecute.mockResolvedValueOnce({ rows: [] });

      await setRoutinePublic(1, 'user-123', false);

      expect(mockExecute).toHaveBeenCalledWith({
        sql: expect.stringContaining('UPDATE routines SET is_public'),
        args: [0, 1, 'user-123'],
      });
    });
  });
});

describe('Phase 2: User Settings Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecute.mockResolvedValue({ rows: [] });
  });

  describe('getUserSettings', () => {
    it('returns defaults when settings are missing', async () => {
      mockExecute
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ name: 'weight_unit' }, { name: 'height_unit' }] })
        .mockResolvedValueOnce({ rows: [] });

      const settings = await getUserSettings('user-123');

      expect(settings).toEqual({
        restTimeSeconds: 60,
        supersetRestSeconds: 15,
        weightUnit: 'lbs',
        heightUnit: 'in',
      });
      expect(mockExecute).toHaveBeenCalledWith({
        sql: expect.stringContaining('CREATE TABLE IF NOT EXISTS user_settings'),
      });
      expect(mockExecute).toHaveBeenCalledWith({
        sql: 'SELECT rest_time_seconds, superset_rest_seconds, weight_unit, height_unit FROM user_settings WHERE user_id = ?',
        args: ['user-123'],
      });
    });

    it('returns stored settings when present', async () => {
      mockExecute
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ name: 'weight_unit' }, { name: 'height_unit' }] })
        .mockResolvedValueOnce({
          rows: [{ rest_time_seconds: 45, superset_rest_seconds: 20, weight_unit: 'kg', height_unit: 'cm' }],
        });

      const settings = await getUserSettings('user-123');

      expect(settings).toEqual({
        restTimeSeconds: 45,
        supersetRestSeconds: 20,
        weightUnit: 'kg',
        heightUnit: 'cm',
      });
    });
  });

  describe('upsertUserSettings', () => {
    it('inserts or updates user settings', async () => {
      mockExecute
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      await upsertUserSettings('user-123', {
        restTimeSeconds: 90,
        supersetRestSeconds: 30,
        weightUnit: 'lbs',
        heightUnit: 'in',
      });

      expect(mockExecute).toHaveBeenCalledWith({
        sql: expect.stringContaining('CREATE TABLE IF NOT EXISTS user_settings'),
      });
      expect(mockExecute).toHaveBeenCalledWith({
        sql: expect.stringContaining('INSERT INTO user_settings'),
        args: ['user-123', 90, 30, 'lbs', 'in'],
      });
    });
  });
});

describe('Phase 2: Favorites Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecute.mockResolvedValue({ rows: [] });
  });

  describe('addFavorite', () => {
    it('adds a favorite entry', async () => {
      mockExecute.mockImplementation(({ sql }) => {
        if (typeof sql === 'string' && sql.includes('PRAGMA table_info(routines)')) {
          return Promise.resolve({ rows: [{ name: 'like_count' }, { name: 'clone_count' }] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT changes()')) {
          return Promise.resolve({ rows: [{ changes: 1 }] });
        }
        return Promise.resolve({ rows: [] });
      });

      await addFavorite('user-123', 5);

      expect(mockExecute).toHaveBeenCalledWith({
        sql: expect.stringContaining('INSERT OR IGNORE INTO routine_favorites'),
        args: ['user-123', 5],
      });
      expect(mockExecute).toHaveBeenCalledWith({
        sql: expect.stringContaining('UPDATE routines SET like_count'),
        args: [5],
      });
    });
  });

  describe('removeFavorite', () => {
    it('removes a favorite entry', async () => {
      mockExecute.mockImplementation(({ sql }) => {
        if (typeof sql === 'string' && sql.includes('PRAGMA table_info(routines)')) {
          return Promise.resolve({ rows: [{ name: 'like_count' }, { name: 'clone_count' }] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT changes()')) {
          return Promise.resolve({ rows: [{ changes: 1 }] });
        }
        return Promise.resolve({ rows: [] });
      });

      await removeFavorite('user-123', 5);

      expect(mockExecute).toHaveBeenCalledWith({
        sql: expect.stringContaining('DELETE FROM routine_favorites'),
        args: ['user-123', 5],
      });
      expect(mockExecute).toHaveBeenCalledWith({
        sql: expect.stringContaining('UPDATE routines'),
        args: [5],
      });
    });
  });

  describe('isFavorited', () => {
    it('returns true when favorited', async () => {
      mockExecute.mockResolvedValueOnce({ rows: [{ 1: 1 }] });

      const result = await isFavorited('user-123', 5);

      expect(result).toBe(true);
    });

    it('returns false when not favorited', async () => {
      mockExecute.mockResolvedValueOnce({ rows: [] });

      const result = await isFavorited('user-123', 5);

      expect(result).toBe(false);
    });
  });

  describe('getFavoritedRoutines', () => {
    it('returns favorited routines with creator info', async () => {
      const favorites = [
        {
          id: 1,
          name: 'Favorite Routine',
          creator_username: 'creator1',
          creator_name: 'Creator One',
          is_favorited: 1,
        },
      ];
      mockExecute.mockImplementation(({ sql }) => {
        if (typeof sql === 'string' && sql.includes('FROM routine_favorites')) {
          return Promise.resolve({ rows: favorites });
        }
        if (typeof sql === 'string' && sql.includes('PRAGMA table_info(workout_sessions)')) {
          return Promise.resolve({ rows: [{ name: 'routine_id' }] });
        }
        return Promise.resolve({ rows: [] });
      });

      const result = await getFavoritedRoutines('user-123');

      expect(result).toEqual(favorites);
      expect(mockExecute).toHaveBeenCalledWith({
        sql: expect.stringContaining('routine_favorites rf'),
        args: ['user-123', 'user-123'],
      });
    });

    it('returns empty array when no favorites', async () => {
      mockExecute.mockResolvedValueOnce({ rows: [] });

      const result = await getFavoritedRoutines('user-123');

      expect(result).toEqual([]);
    });
  });
});

describe('Phase 2: Clone Routine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecute.mockResolvedValue({ rows: [] });
  });

  describe('cloneRoutine', () => {
    it('clones a routine with all associated data', async () => {
      mockExecute.mockImplementation(({ sql }) => {
        if (typeof sql === 'string' && sql.includes('PRAGMA table_info(routines)')) {
          return Promise.resolve({ rows: [{ name: 'like_count' }, { name: 'clone_count' }] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routines WHERE id = ?')) {
          return Promise.resolve({ rows: [{ id: 1, name: 'Original Routine', description: 'Test', is_public: 1 }] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT id FROM routines WHERE name = ? AND user_id = ?')) {
          return Promise.resolve({ rows: [] });
        }
        if (typeof sql === 'string' && sql.includes('INSERT INTO routines')) {
          return Promise.resolve({ lastInsertRowid: 10 });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_exercises')) {
          return Promise.resolve({ rows: [] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_pre_stretches')) {
          return Promise.resolve({ rows: [] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_post_stretches')) {
          return Promise.resolve({ rows: [] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_cardio')) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      });

      const newId = await cloneRoutine(1, 'new-user');

      expect(newId).toBe(10);
    });

    it('appends number suffix when name already exists', async () => {
      let nameChecks = 0;
      mockExecute.mockImplementation(({ sql }) => {
        if (typeof sql === 'string' && sql.includes('PRAGMA table_info(routines)')) {
          return Promise.resolve({ rows: [{ name: 'like_count' }, { name: 'clone_count' }] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routines WHERE id = ?')) {
          return Promise.resolve({ rows: [{ id: 1, name: 'Push Day', description: null, is_public: 1 }] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT id FROM routines WHERE name = ? AND user_id = ?')) {
          nameChecks += 1;
          return Promise.resolve({ rows: nameChecks === 1 ? [{ id: 5 }] : [] });
        }
        if (typeof sql === 'string' && sql.includes('INSERT INTO routines')) {
          return Promise.resolve({ lastInsertRowid: 11 });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_exercises')) {
          return Promise.resolve({ rows: [] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_pre_stretches')) {
          return Promise.resolve({ rows: [] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_post_stretches')) {
          return Promise.resolve({ rows: [] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_cardio')) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      });

      await cloneRoutine(1, 'new-user');

      // Verify the INSERT was called with the suffixed name
      const insertCall = mockExecute.mock.calls.find(
        (call) => call[0].sql.includes('INSERT INTO routines')
      );
      expect(insertCall[0].args).toContain('Push Day (2)');
    });

    it('throws error when original routine not found', async () => {
      mockExecute.mockImplementation(({ sql }) => {
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routines WHERE id = ?')) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      });

      await expect(cloneRoutine(999, 'user-123')).rejects.toThrow('Routine not found');
    });

    it('clones exercises from original routine', async () => {
      mockExecute.mockImplementation(({ sql }) => {
        if (typeof sql === 'string' && sql.includes('PRAGMA table_info(routines)')) {
          return Promise.resolve({ rows: [{ name: 'like_count' }, { name: 'clone_count' }] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routines WHERE id = ?')) {
          return Promise.resolve({ rows: [{ id: 1, name: 'Test Routine', description: null, is_public: 1 }] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT id FROM routines WHERE name = ? AND user_id = ?')) {
          return Promise.resolve({ rows: [] });
        }
        if (typeof sql === 'string' && sql.includes('INSERT INTO routines')) {
          return Promise.resolve({ lastInsertRowid: 20 });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_exercises')) {
          return Promise.resolve({
            rows: [
              {
                exercise_id1: 1,
                exercise_id2: null,
                order_index: 0,
              },
            ],
          });
        }
        if (typeof sql === 'string' && sql.includes('INSERT INTO routine_exercises')) {
          return Promise.resolve({ lastInsertRowid: 1 });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_pre_stretches')) {
          return Promise.resolve({ rows: [] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_post_stretches')) {
          return Promise.resolve({ rows: [] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_cardio')) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      });

      await cloneRoutine(1, 'new-user');

      // Verify exercise was cloned
      const exerciseInsertCall = mockExecute.mock.calls.find(
        (call) => call[0].sql.includes('INSERT INTO routine_exercises')
      );
      expect(exerciseInsertCall).toBeDefined();
    });

    it('allows custom name when cloning', async () => {
      mockExecute.mockImplementation(({ sql }) => {
        if (typeof sql === 'string' && sql.includes('PRAGMA table_info(routines)')) {
          return Promise.resolve({ rows: [{ name: 'like_count' }, { name: 'clone_count' }] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routines WHERE id = ?')) {
          return Promise.resolve({ rows: [{ id: 1, name: 'Original Name', description: null, is_public: 1 }] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT id FROM routines WHERE name = ? AND user_id = ?')) {
          return Promise.resolve({ rows: [] });
        }
        if (typeof sql === 'string' && sql.includes('INSERT INTO routines')) {
          return Promise.resolve({ lastInsertRowid: 30 });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_exercises')) {
          return Promise.resolve({ rows: [] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_pre_stretches')) {
          return Promise.resolve({ rows: [] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_post_stretches')) {
          return Promise.resolve({ rows: [] });
        }
        if (typeof sql === 'string' && sql.includes('SELECT * FROM routine_cardio')) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      });

      await cloneRoutine(1, 'new-user', 'My Custom Name');

      // Verify the INSERT used custom name
      const insertCall = mockExecute.mock.calls.find(
        (call) => call[0].sql.includes('INSERT INTO routines')
      );
      expect(insertCall[0].args).toContain('My Custom Name');
    });
  });
});
