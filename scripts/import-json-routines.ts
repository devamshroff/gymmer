// scripts/import-json-routines.ts
// Import workout plans from JSON files into the routines database
import { getDatabase } from '../lib/database';
import { parseTimerSecondsFromText } from '../lib/stretch-utils';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface JsonExercise {
  type: 'single' | 'b2b';
  name?: string;
  sets?: number;
  targetReps?: number;
  targetWeight?: number;
  warmupWeight?: number;
  restTime?: number;
  exercises?: Array<{
    name: string;
    sets?: number;
    targetReps?: number;
    targetWeight?: number;
    warmupWeight?: number;
  }>;
}

interface JsonStretch {
  name: string;
  duration: string;
  videoUrl?: string;
  tips?: string;
}

interface JsonCardio {
  type: string;
  duration: string;
  intensity?: string;
  tips?: string;
}

interface JsonWorkoutPlan {
  name: string;
  description?: string;
  exercises: JsonExercise[];
  preWorkoutStretches?: JsonStretch[];
  postWorkoutStretches?: JsonStretch[];
  cardio?: JsonCardio;
}

async function main() {
  console.log('Importing JSON routines into database...\n');
  const db = getDatabase();

  try {
    const workoutPlansDir = join(__dirname, '../public/workout-plans');
    const files = readdirSync(workoutPlansDir).filter(f => f.endsWith('.json'));

    console.log(`Found ${files.length} JSON file(s)\n`);

    for (const file of files) {
      console.log(`Processing ${file}...`);
      const filePath = join(workoutPlansDir, file);
      const content = readFileSync(filePath, 'utf-8');
      const workout: JsonWorkoutPlan = JSON.parse(content);

      // Check if routine already exists
      const existing = await db.execute({
        sql: 'SELECT id FROM routines WHERE name = ?',
        args: [workout.name]
      });

      let routineId: number;

      if (existing.rows.length > 0) {
        console.log(`  ⊘ Routine "${workout.name}" already exists, skipping...`);
        continue;
      }

      // Create routine
      const routineResult = await db.execute({
        sql: `INSERT INTO routines (name, description, source_file)
              VALUES (?, ?, ?)`,
        args: [workout.name, workout.description || null, file]
      });
      routineId = Number(routineResult.lastInsertRowid);
      console.log(`  ✓ Created routine: ${workout.name} (ID: ${routineId})`);

      // Import exercises
      for (let i = 0; i < workout.exercises.length; i++) {
        const exercise = workout.exercises[i];

        if (exercise.type === 'single' && exercise.name) {
          // Find or create exercise
          let exerciseId = await getOrCreateExercise(db, exercise.name);

          // Add to routine
          await db.execute({
            sql: `INSERT INTO routine_exercises (
              routine_id, exercise_id, order_index, exercise_type,
              sets, target_reps, target_weight, warmup_weight, rest_time
            ) VALUES (?, ?, ?, 'single', ?, ?, ?, ?, ?)`,
            args: [
              routineId,
              exerciseId,
              i,
              exercise.sets || null,
              exercise.targetReps || null,
              exercise.targetWeight || null,
              exercise.warmupWeight || null,
              exercise.restTime || null
            ]
          });
          console.log(`    ✓ Added exercise: ${exercise.name}`);

        } else if (exercise.type === 'b2b' && exercise.exercises && exercise.exercises.length >= 2) {
          const ex1 = exercise.exercises[0];
          const ex2 = exercise.exercises[1];

          let exerciseId1 = await getOrCreateExercise(db, ex1.name);
          let exerciseId2 = await getOrCreateExercise(db, ex2.name);

          // Add B2B pair
          await db.execute({
            sql: `INSERT INTO routine_exercises (
              routine_id, exercise_id, order_index, exercise_type,
              sets, target_reps, target_weight, warmup_weight,
              b2b_partner_id, b2b_sets, b2b_target_reps, b2b_target_weight, b2b_warmup_weight
            ) VALUES (?, ?, ?, 'b2b', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              routineId,
              exerciseId1,
              i,
              ex1.sets || null,
              ex1.targetReps || null,
              ex1.targetWeight || null,
              ex1.warmupWeight || null,
              exerciseId2,
              ex2.sets || null,
              ex2.targetReps || null,
              ex2.targetWeight || null,
              ex2.warmupWeight || null
            ]
          });
          console.log(`    ✓ Added B2B: ${ex1.name} + ${ex2.name}`);
        }
      }

      // Import pre-workout stretches
      if (workout.preWorkoutStretches) {
        for (let i = 0; i < workout.preWorkoutStretches.length; i++) {
          const stretch = workout.preWorkoutStretches[i];
          const stretchId = await getOrCreateStretch(db, stretch, 'pre_workout');

          await db.execute({
            sql: 'INSERT INTO routine_pre_stretches (routine_id, stretch_id, order_index) VALUES (?, ?, ?)',
            args: [routineId, stretchId, i]
          });
        }
        console.log(`    ✓ Added ${workout.preWorkoutStretches.length} pre-workout stretch(es)`);
      }

      // Import post-workout stretches
      if (workout.postWorkoutStretches) {
        for (let i = 0; i < workout.postWorkoutStretches.length; i++) {
          const stretch = workout.postWorkoutStretches[i];
          const stretchId = await getOrCreateStretch(db, stretch, 'post_workout');

          await db.execute({
            sql: 'INSERT INTO routine_post_stretches (routine_id, stretch_id, order_index) VALUES (?, ?, ?)',
            args: [routineId, stretchId, i]
          });
        }
        console.log(`    ✓ Added ${workout.postWorkoutStretches.length} post-workout stretch(es)`);
      }

      // Import cardio
      if (workout.cardio) {
        await db.execute({
          sql: `INSERT INTO routine_cardio (routine_id, cardio_type, duration, intensity, tips)
                VALUES (?, ?, ?, ?, ?)`,
          args: [
            routineId,
            workout.cardio.type,
            workout.cardio.duration,
            workout.cardio.intensity || null,
            workout.cardio.tips || null
          ]
        });
        console.log(`    ✓ Added cardio: ${workout.cardio.type}`);
      }

      console.log('');
    }

    console.log('✅ Import complete!');
  } catch (error) {
    console.error('Error importing routines:', error);
    process.exit(1);
  } finally {
    await db.close();
    process.exit(0);
  }
}

async function getOrCreateExercise(db: any, name: string): Promise<number> {
  // Check if exercise exists
  const existing = await db.execute({
    sql: 'SELECT id FROM exercises WHERE name = ?',
    args: [name]
  });

  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }

  // Create new exercise
  const result = await db.execute({
    sql: 'INSERT INTO exercises (name) VALUES (?)',
    args: [name]
  });

  return Number(result.lastInsertRowid);
}

async function getOrCreateStretch(db: any, stretch: JsonStretch, type: string): Promise<number> {
  // Check if stretch exists
  const existing = await db.execute({
    sql: 'SELECT id FROM stretches WHERE name = ?',
    args: [stretch.name]
  });

  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }

  // Create new stretch
  const result = await db.execute({
    sql: `INSERT INTO stretches (name, timer_seconds, video_url, tips)
          VALUES (?, ?, ?, ?)`,
    args: [
      stretch.name,
      parseTimerSecondsFromText(stretch.duration) ?? 0,
      stretch.videoUrl || null,
      stretch.tips || null
    ]
  });

  return Number(result.lastInsertRowid);
}

main();
