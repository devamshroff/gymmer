import type { LastSetSummary } from '@/lib/workout-bootstrap';

export interface SetData {
  weight: number;
  reps: number;
}

export type LastSetSummaries = Record<string, LastSetSummary>;
