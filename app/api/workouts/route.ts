// app/api/workouts/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { WorkoutPlan } from '@/lib/types';

export async function GET() {
  try {
    const workoutPlansDir = path.join(process.cwd(), 'public', 'workout-plans');

    // Check if directory exists
    if (!fs.existsSync(workoutPlansDir)) {
      return NextResponse.json({ workouts: [] });
    }

    // Read all JSON files from the directory
    const files = fs.readdirSync(workoutPlansDir).filter(file => file.endsWith('.json'));

    // Read and parse each JSON file
    const workouts: WorkoutPlan[] = files.map(file => {
      const filePath = path.join(workoutPlansDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent) as WorkoutPlan;
    });

    return NextResponse.json({ workouts });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}
