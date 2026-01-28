// app/api/workouts/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { WorkoutPlan } from '@/lib/types';
import { getAllRoutines } from '@/lib/database';
import { requireAuth } from '@/lib/auth-utils';

export async function GET() {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    // Get routines from database for this user
    const dbRoutines = await getAllRoutines(user.id);

    // Convert DB routines to a simplified format for the home page
    const routinesFromDb = dbRoutines.map((r: any) => ({
      name: r.name,
      id: r.id,
      isFromDb: true,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));

    // Also check for JSON files (for backwards compatibility during migration)
    const workoutPlansDir = path.join(process.cwd(), 'public', 'workout-plans');
    let workoutsFromJson: { name: string; isFromDb: boolean }[] = [];

    if (fs.existsSync(workoutPlansDir)) {
      const files = fs.readdirSync(workoutPlansDir).filter(file => file.endsWith('.json'));
      workoutsFromJson = files.map(file => {
        const filePath = path.join(workoutPlansDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const workout = JSON.parse(fileContent) as WorkoutPlan;
        return {
          name: workout.name,
          isFromDb: false
        };
      });
    }

    // Combine: DB routines first, then JSON routines
    // Filter out JSON routines that have the same name as a DB routine
    const dbNames = new Set(routinesFromDb.map((r: any) => r.name));
    const uniqueJsonWorkouts = workoutsFromJson.filter(w => !dbNames.has(w.name));

    const allWorkouts = [...routinesFromDb, ...uniqueJsonWorkouts];

    return NextResponse.json({ workouts: allWorkouts });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}
