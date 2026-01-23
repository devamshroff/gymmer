// app/api/workout/[name]/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { WorkoutPlan } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const workoutName = decodeURIComponent(name);
    const workoutPlansDir = path.join(process.cwd(), 'public', 'workout-plans');

    // Read all JSON files to find the matching workout
    const files = fs.readdirSync(workoutPlansDir).filter(file => file.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(workoutPlansDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const workout = JSON.parse(fileContent) as WorkoutPlan;

      if (workout.name === workoutName) {
        return NextResponse.json({ workout });
      }
    }

    return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching workout:', error);
    return NextResponse.json({ error: 'Failed to fetch workout' }, { status: 500 });
  }
}
