import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import EditRoutinePage from '@/app/routines/[id]/edit/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useParams: () => ({ id: '1' }),
  useSearchParams: () => ({
    get: () => null,
  }),
}));

const routineResponse = {
  routine: { name: 'Morning Routine', is_public: 1 },
  exercises: [
    {
      id: 100,
      exercise_id1: 1,
      exercise_name: 'Squat',
      exercise_id2: null,
      exercise2_name: null,
    },
    {
      id: 101,
      exercise_id1: 2,
      exercise_name: 'Bench Press',
      exercise_id2: null,
      exercise2_name: null,
    },
  ],
};

const workoutResponse = {
  workout: {
    preWorkoutStretches: [
      { name: 'Stretch A', timerSeconds: 30 },
      { name: 'Stretch B', timerSeconds: 45 },
    ],
    postWorkoutStretches: [
      { name: 'Stretch C', timerSeconds: 20 },
      { name: 'Stretch D', timerSeconds: 25 },
    ],
  },
};

const stretchesResponse = {
  stretches: [
    { id: 1, name: 'Stretch A', muscle_groups: null, timer_seconds: 30 },
    { id: 2, name: 'Stretch B', muscle_groups: null, timer_seconds: 45 },
    { id: 3, name: 'Stretch C', muscle_groups: null, timer_seconds: 20 },
    { id: 4, name: 'Stretch D', muscle_groups: null, timer_seconds: 25 },
  ],
};

describe('EditRoutinePage reordering', () => {
  beforeEach(() => {
    const fetchMock = vi.fn(async (input: RequestInfo, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.url;
      const method = init?.method ?? 'GET';

      if (url === '/api/routines/1' && method === 'GET') {
        return {
          ok: true,
          json: async () => routineResponse,
        } as Response;
      }

      if (url.startsWith('/api/workout/') && method === 'GET') {
        return {
          ok: true,
          json: async () => workoutResponse,
        } as Response;
      }

      if (url === '/api/stretches' && method === 'GET') {
        return {
          ok: true,
          json: async () => stretchesResponse,
        } as Response;
      }

      if (url === '/api/routines/1/stretches' && method === 'PUT') {
        return {
          ok: true,
          json: async () => ({}),
        } as Response;
      }

      if (url === '/api/routines/1/exercises' && method === 'PUT') {
        return {
          ok: true,
          json: async () => ({}),
        } as Response;
      }

      return {
        ok: true,
        json: async () => ({}),
      } as Response;
    });

    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reorders pre-workout stretches using move buttons', async () => {
    render(<EditRoutinePage />);

    await screen.findByText('Stretch A');

    const preSection = screen.getByText('Pre-Workout Stretches').closest('section');
    if (!preSection) throw new Error('Pre-workout section not found');

    const stretchAItem = screen.getByText('Stretch A').closest('.bg-zinc-800');
    if (!stretchAItem) throw new Error('Stretch item not found');

    const moveDownButton = within(stretchAItem).getByLabelText('Move down');
    fireEvent.click(moveDownButton);

    await waitFor(() => {
      const preNames = within(preSection)
        .getAllByText(/Stretch [AB]/)
        .map((node) => node.textContent);
      expect(preNames).toEqual(['Stretch B', 'Stretch A']);
    });

    const fetchMock = vi.mocked(fetch);
    const reorderCalls = fetchMock.mock.calls.filter(([input, init]) => {
      const url = typeof input === 'string' ? input : input.url;
      return url === '/api/routines/1/stretches' && init?.method === 'PUT';
    });

    expect(reorderCalls).toHaveLength(1);
    const reorderBody = JSON.parse(reorderCalls[0][1]?.body as string);
    expect(reorderBody).toEqual({ type: 'pre', order: [2, 1] });
  });

  it('reorders exercises using drag handles', async () => {
    render(<EditRoutinePage />);

    await screen.findByText('Bench Press');

    const exercisesSection = screen.getByText('Exercises').closest('section');
    if (!exercisesSection) throw new Error('Exercises section not found');

    const benchItem = screen.getByText('Bench Press').closest('.bg-zinc-800');
    const squatItem = screen.getByText('Squat').closest('.bg-zinc-800');
    if (!benchItem || !squatItem) throw new Error('Exercise items not found');

    const dragHandle = within(benchItem).getByLabelText('Drag to reorder');
    const dataTransfer = {
      setData: vi.fn(),
      effectAllowed: 'move',
    };

    fireEvent.dragStart(dragHandle, { dataTransfer });
    fireEvent.dragOver(squatItem, { dataTransfer });
    fireEvent.drop(squatItem, { dataTransfer });
    fireEvent.dragEnd(dragHandle, { dataTransfer });

    await waitFor(() => {
      const exerciseNames = within(exercisesSection)
        .getAllByText(/Squat|Bench Press/)
        .map((node) => node.textContent);
      expect(exerciseNames).toEqual(['Bench Press', 'Squat']);
    });

    const fetchMock = vi.mocked(fetch);
    const reorderCalls = fetchMock.mock.calls.filter(([input, init]) => {
      const url = typeof input === 'string' ? input : input.url;
      return url === '/api/routines/1/exercises' && init?.method === 'PUT';
    });

    expect(reorderCalls).toHaveLength(1);
    const reorderBody = JSON.parse(reorderCalls[0][1]?.body as string);
    expect(reorderBody).toEqual({ order: [101, 100] });
  });
});
