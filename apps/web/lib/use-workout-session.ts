'use client';

import { useSyncExternalStore } from 'react';
import { getWorkoutSession, subscribeWorkoutSession, type WorkoutSessionData } from '@/lib/workout-session';

export function useWorkoutSessionStore(): WorkoutSessionData | null {
  return useSyncExternalStore(subscribeWorkoutSession, getWorkoutSession, () => null);
}
