// scripts/add-timer-seconds.ts
// Adds timer_seconds column to stretches table and sets values based on duration text

import { createClient } from '@libsql/client';

// Bun automatically loads .env.local

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Map of stretch names to their timer values in seconds
// 0 means no timer (rep-based stretches)
const stretchTimers: Record<string, number> = {
  // Pre-workout dynamic stretches (mostly rep-based, no timer)
  'Arm Circles': 0,
  'Leg Swings': 0,
  'Dynamic Leg Swings': 0,
  'Hip Circles': 0,
  'Walking Lunges': 0,
  'High Knees': 0,
  'Butt Kicks': 0,
  'Torso Twists': 0,
  'Shoulder Rolls': 0,
  'Neck Rolls': 0,
  'Jumping Jacks': 0,
  'Bodyweight Squats': 0,
  'Inchworms': 0,
  'World\'s Greatest Stretch': 0,
  'Worlds Greatest Stretch': 0,
  'A-Skips': 0,
  'B-Skips': 0,
  'Carioca': 0,
  'Side Shuffles': 0,
  'Toy Soldiers': 0,
  'Frankenstein Walks': 0,

  // Post-workout static stretches (time-based, need timer)
  'Standing Quad Stretch': 30,
  'Standing Hamstring Stretch': 30,
  'Calf Stretch': 30,
  'Hip Flexor Stretch': 30,
  'Pigeon Pose': 45,
  'Figure Four Stretch': 30,
  'Seated Forward Fold': 30,
  'Butterfly Stretch': 30,
  'Child\'s Pose': 45,
  'Childs Pose': 45,
  'Cat-Cow Stretch': 30,
  'Cobra Stretch': 30,
  'Chest Stretch': 30,
  'Tricep Stretch': 30,
  'Shoulder Stretch': 30,
  'Cross-Body Shoulder Stretch': 30,
  'Neck Stretch': 30,
  'Supine Spinal Twist': 30,
  'Lying Glute Stretch': 30,
  'Lying Hamstring Stretch': 30,
  'Standing Side Bend': 30,
  'Doorway Chest Stretch': 30,
  'Wall Chest Stretch': 30,
  '90/90 Hip Stretch': 45,
  'Frog Stretch': 45,
  'Seated Straddle Stretch': 30,
  'Happy Baby Pose': 30,
  'Thread the Needle': 30,
  'Scorpion Stretch': 30,
};

async function addTimerSecondsColumn() {
  console.log('Adding timer_seconds column to stretches table...');

  try {
    // Add the column if it doesn't exist
    await db.execute(`
      ALTER TABLE stretches ADD COLUMN timer_seconds INTEGER DEFAULT 0
    `);
    console.log('Column added successfully');
  } catch (error: any) {
    if (error.message?.includes('duplicate column')) {
      console.log('Column already exists, skipping...');
    } else {
      throw error;
    }
  }

  // Get all stretches
  const result = await db.execute('SELECT id, name, duration, type FROM stretches');
  console.log(`Found ${result.rows.length} stretches to update`);

  let updated = 0;
  for (const row of result.rows) {
    const name = row.name as string;
    const duration = row.duration as string;
    const type = row.type as string;

    // Check if we have a predefined timer value
    let timerSeconds = stretchTimers[name];

    if (timerSeconds === undefined) {
      // Try to parse timer from duration text
      // Look for patterns like "30 sec", "45 seconds", "hold for 20 seconds"
      const holdMatch = duration.toLowerCase().match(/hold\s+(?:for\s+)?(\d+)\s*(?:sec|second)/);
      const secMatch = duration.toLowerCase().match(/(\d+)\s*(?:sec|second)/);

      if (holdMatch) {
        timerSeconds = parseInt(holdMatch[1], 10);
      } else if (secMatch && !duration.toLowerCase().includes('each') && !duration.toLowerCase().includes('per')) {
        // Only use if it's a simple "X seconds" format, not "X seconds each side"
        // For "each side" stretches, we'll use 0 and let the user manage the timer
        if (duration.toLowerCase().includes('side') || duration.toLowerCase().includes('leg') || duration.toLowerCase().includes('arm')) {
          // These need per-side timing, set to the per-side value
          timerSeconds = parseInt(secMatch[1], 10);
        } else {
          timerSeconds = parseInt(secMatch[1], 10);
        }
      } else {
        // Default: post-workout stretches get 30 seconds, pre-workout get 0
        timerSeconds = type === 'post_workout' ? 30 : 0;
      }
    }

    // Update the stretch
    await db.execute({
      sql: 'UPDATE stretches SET timer_seconds = ? WHERE id = ?',
      args: [timerSeconds, row.id]
    });

    console.log(`  ${name}: ${timerSeconds}s (${duration})`);
    updated++;
  }

  console.log(`\nUpdated ${updated} stretches with timer values`);
}

addTimerSecondsColumn()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
