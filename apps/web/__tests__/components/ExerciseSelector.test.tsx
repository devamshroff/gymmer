import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExerciseSelector from '@/app/components/ExerciseSelector';

const exercisesResponse = {
  exercises: [
    {
      id: 1,
      name: 'Bench Press',
      video_url: null,
      tips: null,
      equipment: 'Barbell',
      muscle_groups: '["chest"]',
    },
    {
      id: 2,
      name: 'Chest Fly',
      video_url: null,
      tips: null,
      equipment: 'Machine',
      muscle_groups: '["chest"]',
    },
    {
      id: 3,
      name: 'Lat Pulldown',
      video_url: null,
      tips: null,
      equipment: 'Cable',
      muscle_groups: '["back"]',
    },
  ],
};

describe('ExerciseSelector', () => {
  beforeEach(() => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => exercisesResponse,
    })) as typeof fetch;

    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders recommendation panels and exercise groups in compact grids', async () => {
    render(
      <ExerciseSelector
        onSelect={() => {}}
        onSelectSuperset={() => {}}
        onCancel={() => {}}
        recommendedExercises={[
          {
            id: 1,
            name: 'Bench Press',
            video_url: null,
            tips: null,
            equipment: 'Barbell',
            history_count: 12,
            recent_count: 4,
          },
        ]}
        recommendedSupersets={[
          {
            exercise1: { id: 1, name: 'Bench Press', video_url: null, tips: null },
            exercise2: { id: 2, name: 'Chest Fly', video_url: null, tips: null },
            totalCount: 5,
            recentCount: 2,
            lastUsedAt: '2026-04-01T12:00:00.000Z',
          },
        ]}
      />
    );

    await screen.findByText('All Exercises · Chest');

    const mostPopularSection = screen.getByText('Most Popular Exercises').closest('.space-y-2');
    const commonPairingsSection = screen.getByText('Common Pairings').closest('.space-y-2');
    const recommendationGrid = mostPopularSection?.parentElement;
    const mostPopularGrid = screen.getByText('Most Popular Exercises').nextElementSibling;
    const commonPairingsGrid = screen.getByText('Common Pairings').nextElementSibling;
    const chestGrid = screen.getByText('All Exercises · Chest').nextElementSibling;

    expect(mostPopularSection).toBeInTheDocument();
    expect(commonPairingsSection).toBeInTheDocument();
    expect(recommendationGrid).toHaveClass('grid', 'xl:grid-cols-2');
    expect(mostPopularGrid).toHaveClass('grid', 'sm:grid-cols-2');
    expect(commonPairingsGrid).toHaveClass('grid', 'sm:grid-cols-2');
    expect(chestGrid).toHaveClass('grid', 'sm:grid-cols-2', 'xl:grid-cols-3');
  });
});
