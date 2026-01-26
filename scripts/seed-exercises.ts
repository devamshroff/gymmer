// scripts/seed-exercises.ts
// Seed exercises and stretches from existing JSON files
import { getDatabase } from '../lib/database';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

async function main() {
  console.log('Seeding exercises and stretches from JSON files...\n');
  const db = getDatabase();

  try {
    // Read all JSON files from workout-plans directory
    const workoutPlansDir = join(__dirname, '../public/workout-plans');
    const files = readdirSync(workoutPlansDir).filter(f => f.endsWith('.json'));

    const allExercises = new Set<string>();
    const allStretches = new Map<string, { duration: string; videoUrl: string; tips: string; type: string }>();

    // Extract exercises and stretches from all JSON files
    for (const file of files) {
      const filePath = join(workoutPlansDir, file);
      const content = readFileSync(filePath, 'utf-8');
      const workout = JSON.parse(content);

      console.log(`Processing ${file}...`);

      // Extract exercises
      if (workout.exercises) {
        for (const exercise of workout.exercises) {
          if (exercise.type === 'single') {
            allExercises.add(exercise.name);
          } else if (exercise.type === 'b2b') {
            allExercises.add(exercise.exercises[0].name);
            allExercises.add(exercise.exercises[1].name);
          }
        }
      }

      // Extract pre-workout stretches
      if (workout.preWorkoutStretches) {
        for (const stretch of workout.preWorkoutStretches) {
          if (!allStretches.has(stretch.name)) {
            allStretches.set(stretch.name, {
              duration: stretch.duration,
              videoUrl: stretch.videoUrl,
              tips: stretch.tips,
              type: 'pre_workout'
            });
          }
        }
      }

      // Extract post-workout stretches
      if (workout.postWorkoutStretches) {
        for (const stretch of workout.postWorkoutStretches) {
          if (!allStretches.has(stretch.name)) {
            allStretches.set(stretch.name, {
              duration: stretch.duration,
              videoUrl: stretch.videoUrl,
              tips: stretch.tips,
              type: 'post_workout'
            });
          }
        }
      }
    }

    console.log(`\nFound ${allExercises.size} unique exercises`);
    console.log(`Found ${allStretches.size} unique stretches\n`);

    // Insert exercises
    let exerciseCount = 0;
    for (const exerciseName of allExercises) {
      try {
        await db.execute({
          sql: `INSERT OR IGNORE INTO exercises (name, is_custom) VALUES (?, 0)`,
          args: [exerciseName]
        });
        exerciseCount++;
        console.log(`  ✓ ${exerciseName}`);
      } catch (error) {
        console.error(`  ✗ Failed to insert ${exerciseName}:`, error);
      }
    }

    console.log(`\n✓ Inserted ${exerciseCount} exercises`);

    // Insert stretches
    let stretchCount = 0;
    for (const [name, data] of allStretches) {
      try {
        await db.execute({
          sql: `INSERT OR IGNORE INTO stretches (name, duration, video_url, tips, type, is_custom) VALUES (?, ?, ?, ?, ?, 0)`,
          args: [name, data.duration, data.videoUrl, data.tips, data.type]
        });
        stretchCount++;
        console.log(`  ✓ ${name}`);
      } catch (error) {
        console.error(`  ✗ Failed to insert ${name}:`, error);
      }
    }

    console.log(`\n✓ Inserted ${stretchCount} stretches`);

    console.log('\n✅ Seeding complete!');

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await db.close();
    process.exit(0);
  }
}

main();
