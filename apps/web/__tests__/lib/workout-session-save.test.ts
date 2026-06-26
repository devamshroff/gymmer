import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EXERCISE_PRIMARY_METRICS, EXERCISE_TYPES } from '@/lib/constants';

const databaseMocks = vi.hoisted(() => ({
  createWorkoutSession: vi.fn(),
  getAllExercises: vi.fn(),
  getRoutineById: vi.fn(),
  getWorkoutSessionById: vi.fn(),
  logCardio: vi.fn(),
  updateWorkoutSession: vi.fn(),
  updateWorkoutSessionReport: vi.fn(),
  upsertWorkoutExerciseLog: vi.fn(),
}));

vi.mock('@/lib/database', () => databaseMocks);

describe('workout-session-save', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-24T11:30:00.000Z'));
    for (const mock of Object.values(databaseMocks)) {
      mock.mockReset();
    }
    databaseMocks.createWorkoutSession.mockResolvedValue(42);
    databaseMocks.getAllExercises.mockResolvedValue([]);
    databaseMocks.getRoutineById.mockResolvedValue(null);
    databaseMocks.getWorkoutSessionById.mockResolvedValue(null);
    databaseMocks.logCardio.mockResolvedValue(1);
    databaseMocks.updateWorkoutSession.mockResolvedValue(undefined);
    databaseMocks.updateWorkoutSessionReport.mockResolvedValue(undefined);
    databaseMocks.upsertWorkoutExerciseLog.mockResolvedValue(1);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('preserves the app save path duration, routine name, strain, and exercise log mapping', async () => {
    const { saveWorkoutSessionForUser } = await import('@/lib/workout-session-save');
    databaseMocks.getRoutineById.mockResolvedValue({ id: 7, name: 'Resolved Routine' });

    const saved = await saveWorkoutSessionForUser('user-1', {
      workoutName: 'Client Name',
      routineId: 7,
      sessionId: null,
      startTime: '2026-06-24T11:00:00.000Z',
      exercises: [
        {
          name: 'Bench Press',
          type: EXERCISE_TYPES.single,
          primaryMetric: EXERCISE_PRIMARY_METRICS.weight,
          warmup: { weight: 45, reps: 10 },
          sets: [{ weight: 135, reps: 8 }],
        },
        {
          name: 'Push Up',
          type: EXERCISE_TYPES.single,
          primaryMetric: EXERCISE_PRIMARY_METRICS.repsOnly,
          sets: [{ weight: 999, reps: 20 }],
        },
      ],
    });

    expect(databaseMocks.createWorkoutSession).toHaveBeenCalledWith({
      user_id: 'user-1',
      routine_id: 7,
      session_key: '2026-06-24T11:00:00.000Z',
      workout_plan_name: 'Resolved Routine',
      date_completed: '2026-06-24T11:30:00.000Z',
      total_duration_minutes: 30,
      total_strain: 1530,
    });
    expect(databaseMocks.upsertWorkoutExerciseLog).toHaveBeenNthCalledWith(1, {
      session_id: 42,
      exercise_name: 'Bench Press',
      exercise_type: EXERCISE_TYPES.single,
      warmup_weight: 45,
      warmup_reps: 10,
      set1_weight: 135,
      set1_reps: 8,
    });
    expect(databaseMocks.upsertWorkoutExerciseLog).toHaveBeenNthCalledWith(2, {
      session_id: 42,
      exercise_name: 'Push Up',
      exercise_type: EXERCISE_TYPES.single,
      set1_weight: 999,
      set1_reps: 20,
    });
    expect(saved).toMatchObject({
      sessionId: 42,
      workoutName: 'Resolved Routine',
      completedAt: '2026-06-24T11:30:00.000Z',
      totalDurationMinutes: 30,
      totalStrain: 1530,
    });
  });

  it('creates MCP sessions through the same save helper shape', async () => {
    const { createWorkoutSessionFromMcp } = await import('@/lib/workout-session-save');
    databaseMocks.createWorkoutSession.mockResolvedValue(101);
    databaseMocks.getAllExercises.mockResolvedValue([
      {
        name: 'Lat Pulldown',
        primary_metric: EXERCISE_PRIMARY_METRICS.weight,
        metric_unit: 'lbs',
        is_machine: 0,
      },
    ]);

    const saved = await createWorkoutSessionFromMcp('user-1', {
      date: '2026-06-23',
      durationMinutes: 47,
      notes: 'Hand logged during outage.',
      exercises: [
        {
          name: 'lat pulldown',
          sets: [
            { weight: 50, reps: 10, isWarmup: true },
            { weight: 100, reps: 8 },
            { weight: 105, reps: 6 },
          ],
        },
      ],
    });

    expect(databaseMocks.createWorkoutSession).toHaveBeenCalledWith({
      user_id: 'user-1',
      routine_id: null,
      session_key: null,
      workout_plan_name: 'Free Workout',
      date_completed: '2026-06-23T12:00:00.000Z',
      total_duration_minutes: 47,
      total_strain: 1930,
    });
    expect(databaseMocks.upsertWorkoutExerciseLog).toHaveBeenCalledWith({
      session_id: 101,
      exercise_name: 'Lat Pulldown',
      exercise_type: EXERCISE_TYPES.single,
      warmup_weight: 50,
      warmup_reps: 10,
      set1_weight: 100,
      set1_reps: 8,
      set2_weight: 105,
      set2_reps: 6,
    });
    expect(databaseMocks.updateWorkoutSessionReport).toHaveBeenCalledWith({
      userId: 'user-1',
      sessionId: 101,
      report: 'Hand logged during outage.',
    });
    expect(saved).toMatchObject({
      sessionId: 101,
      workoutName: 'Free Workout',
      completedAt: '2026-06-23T12:00:00.000Z',
      totalDurationMinutes: 47,
      totalStrain: 1930,
      notesStoredAs: 'workout_report',
      exercises: [
        {
          name: 'Lat Pulldown',
          catalogMatched: true,
          warmup: { weight: 50, reps: 10 },
          sets: [
            { weight: 100, reps: 8 },
            { weight: 105, reps: 6 },
          ],
        },
      ],
    });
  });

  it('leaves MCP duration null when omitted and rejects unsupported set shapes', async () => {
    const { createWorkoutSessionFromMcp } = await import('@/lib/workout-session-save');
    databaseMocks.createWorkoutSession.mockResolvedValue(202);

    await createWorkoutSessionFromMcp('user-1', {
      date: '2026-06-24',
      exercises: [
        {
          name: 'Rows',
          sets: [{ weight: 100, reps: 10 }],
        },
      ],
    });

    expect(databaseMocks.createWorkoutSession).toHaveBeenCalledWith(expect.objectContaining({
      total_duration_minutes: null,
      total_strain: 1000,
    }));

    await expect(createWorkoutSessionFromMcp('user-1', {
      date: '2026-06-24',
      exercises: [
        {
          name: 'Rows',
          sets: [
            { weight: 45, reps: 10, isWarmup: true },
            { weight: 50, reps: 8, isWarmup: true },
          ],
        },
      ],
    })).rejects.toThrow('multiple warmup sets');

    await expect(createWorkoutSessionFromMcp('user-1', {
      date: '2026-02-31',
      exercises: [
        {
          name: 'Rows',
          sets: [{ weight: 100, reps: 10 }],
        },
      ],
    })).rejects.toThrow('valid YYYY-MM-DD date');
  });
});
