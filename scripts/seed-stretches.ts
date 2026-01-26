// scripts/seed-stretches.ts
// Populate stretches database with comprehensive stretches library
import { getDatabase } from '../lib/database';

const stretches = [
  // Pre-Workout Dynamic Stretches
  {
    name: 'Leg Swings (Front to Back)',
    duration: '10 reps each leg',
    type: 'pre_workout',
    muscle_groups: JSON.stringify(['hip flexors', 'hamstrings', 'glutes']),
    tips: 'Hold onto a wall for balance. Swing leg forward and back with control.',
    video_url: null
  },
  {
    name: 'Leg Swings (Side to Side)',
    duration: '10 reps each leg',
    type: 'pre_workout',
    muscle_groups: JSON.stringify(['hip abductors', 'adductors', 'glutes']),
    tips: 'Keep torso upright. Swing leg across body and out to the side.',
    video_url: null
  },
  {
    name: 'Arm Circles',
    duration: '30 seconds',
    type: 'pre_workout',
    muscle_groups: JSON.stringify(['shoulders', 'upper back']),
    tips: 'Start with small circles, gradually increase size. Reverse direction halfway.',
    video_url: null
  },
  {
    name: 'Cat-Cow Stretch',
    duration: '10 reps',
    type: 'pre_workout',
    muscle_groups: JSON.stringify(['spine', 'core', 'lower back']),
    tips: 'On hands and knees, alternate between arching and rounding your back.',
    video_url: null
  },
  {
    name: 'Hip Circles',
    duration: '10 reps each direction',
    type: 'pre_workout',
    muscle_groups: JSON.stringify(['hips', 'glutes', 'core']),
    tips: 'Hands on hips, make large circular motions with your hips.',
    video_url: null
  },
  {
    name: 'Torso Twists',
    duration: '15 reps each side',
    type: 'pre_workout',
    muscle_groups: JSON.stringify(['obliques', 'core', 'lower back']),
    tips: 'Feet shoulder-width apart, rotate torso side to side with controlled movement.',
    video_url: null
  },
  {
    name: 'Walking Lunges with Twist',
    duration: '10 reps each leg',
    type: 'pre_workout',
    muscle_groups: JSON.stringify(['quads', 'glutes', 'core', 'hip flexors']),
    tips: 'Step into lunge, twist torso toward front leg. Great full-body warm-up.',
    video_url: null
  },
  {
    name: 'Inchworms',
    duration: '8 reps',
    type: 'pre_workout',
    muscle_groups: JSON.stringify(['hamstrings', 'shoulders', 'core', 'calves']),
    tips: 'Bend at waist, walk hands out to plank, walk feet to hands. Repeat.',
    video_url: null
  },

  // Post-Workout Static Stretches - Lower Body
  {
    name: 'Standing Quad Stretch',
    duration: '45 seconds each leg',
    type: 'post_workout',
    muscle_groups: JSON.stringify(['quadriceps', 'hip flexors']),
    tips: 'Pull heel to glutes, keep knees together. Use wall for balance if needed.',
    video_url: null
  },
  {
    name: 'Standing Hamstring Stretch',
    duration: '45 seconds each leg',
    type: 'post_workout',
    muscle_groups: JSON.stringify(['hamstrings', 'calves', 'lower back']),
    tips: 'Place heel on elevated surface, keep leg straight, lean forward from hips.',
    video_url: null
  },
  {
    name: 'Seated Forward Fold',
    duration: '60 seconds',
    type: 'post_workout',
    muscle_groups: JSON.stringify(['hamstrings', 'lower back', 'calves']),
    tips: 'Sit with legs extended, reach for toes. Keep back straight, breathe deeply.',
    video_url: null
  },
  {
    name: 'Pigeon Pose',
    duration: '60 seconds each side',
    type: 'post_workout',
    muscle_groups: JSON.stringify(['glutes', 'hip flexors', 'piriformis']),
    tips: 'Front knee bent at 90°, back leg extended. Lean forward to deepen stretch.',
    video_url: null
  },
  {
    name: 'Figure-4 Stretch (Glute Stretch)',
    duration: '45 seconds each side',
    type: 'post_workout',
    muscle_groups: JSON.stringify(['glutes', 'hips', 'lower back']),
    tips: 'On back, cross ankle over opposite knee, pull thigh toward chest.',
    video_url: null
  },
  {
    name: 'Butterfly Stretch',
    duration: '60 seconds',
    type: 'post_workout',
    muscle_groups: JSON.stringify(['inner thighs', 'groin', 'hips']),
    tips: 'Sit with soles of feet together, gently press knees toward floor.',
    video_url: null
  },
  {
    name: 'Calf Stretch (Wall)',
    duration: '45 seconds each leg',
    type: 'post_workout',
    muscle_groups: JSON.stringify(['calves', 'achilles']),
    tips: 'Hands on wall, step back with one leg straight, heel on ground. Lean in.',
    video_url: null
  },

  // Post-Workout Static Stretches - Upper Body
  {
    name: 'Doorway Chest Stretch',
    duration: '45 seconds each side',
    type: 'post_workout',
    muscle_groups: JSON.stringify(['chest', 'shoulders', 'biceps']),
    tips: 'Arm on doorframe at 90°, step forward until stretch in chest.',
    video_url: null
  },
  {
    name: 'Overhead Tricep Stretch',
    duration: '30 seconds each arm',
    type: 'post_workout',
    muscle_groups: JSON.stringify(['triceps', 'lats', 'shoulders']),
    tips: 'Reach arm overhead, bend elbow, pull elbow behind head with other hand.',
    video_url: null
  },
  {
    name: 'Cross-Body Shoulder Stretch',
    duration: '30 seconds each arm',
    type: 'post_workout',
    muscle_groups: JSON.stringify(['shoulders', 'upper back']),
    tips: 'Pull arm across chest with opposite hand. Keep shoulders down.',
    video_url: null
  },
  {
    name: 'Child\'s Pose',
    duration: '60 seconds',
    type: 'post_workout',
    muscle_groups: JSON.stringify(['lats', 'shoulders', 'lower back', 'hips']),
    tips: 'Knees wide, sit back on heels, arms extended forward. Breathe deeply.',
    video_url: null
  },
  {
    name: 'Cobra Stretch',
    duration: '45 seconds',
    type: 'post_workout',
    muscle_groups: JSON.stringify(['abs', 'hip flexors', 'chest', 'shoulders']),
    tips: 'On stomach, push upper body up with arms, hips stay on ground.',
    video_url: null
  }
];

async function main() {
  console.log('Seeding stretches database...\n');
  const db = getDatabase();

  try {
    let insertedCount = 0;
    let skippedCount = 0;

    for (const stretch of stretches) {
      try {
        await db.execute({
          sql: `INSERT OR IGNORE INTO stretches (name, duration, type, muscle_groups, tips, video_url, is_custom)
                VALUES (?, ?, ?, ?, ?, ?, 0)`,
          args: [
            stretch.name,
            stretch.duration,
            stretch.type,
            stretch.muscle_groups,
            stretch.tips,
            stretch.video_url
          ]
        });

        // Check if it was actually inserted
        const result = await db.execute({
          sql: 'SELECT id FROM stretches WHERE name = ?',
          args: [stretch.name]
        });

        if (result.rows.length > 0) {
          console.log(`  ✓ ${stretch.name} (${stretch.type})`);
          insertedCount++;
        } else {
          console.log(`  ⊘ ${stretch.name} (already exists)`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`  ✗ Failed to insert ${stretch.name}:`, error);
      }
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`   Inserted: ${insertedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Total: ${stretches.length}`);
  } catch (error) {
    console.error('Error seeding stretches:', error);
    process.exit(1);
  } finally {
    await db.close();
    process.exit(0);
  }
}

main();
