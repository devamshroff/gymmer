// scripts/add-stretch-muscle-groups.ts
// Update existing stretches with muscle group information
import { getDatabase } from '../lib/database';

const stretchMuscleGroups: Record<string, string[]> = {
  // Pre-workout stretches
  'Leg Swings': ['hip flexors', 'hamstrings', 'glutes'],
  'Walking Lunges': ['quads', 'glutes', 'hip flexors'],
  'Bodyweight Squats': ['quads', 'glutes', 'hamstrings'],
  'Arm Circles': ['shoulders', 'upper back'],
  'Band Pull-Aparts': ['upper back', 'rear delts', 'shoulders'],
  'Scapular Wall Slides': ['shoulders', 'upper back', 'rotator cuff'],
  'Push-up Plus': ['chest', 'shoulders', 'serratus'],
  'Ankle Bounces': ['calves', 'achilles'],
  'Cat-Cow Stretch': ['spine', 'core', 'lower back'],
  'Cat-Cow': ['spine', 'core', 'lower back'],
  'Walking Lunges with Twist': ['quads', 'glutes', 'core', 'hip flexors'],
  'Glute Bridges': ['glutes', 'hamstrings', 'lower back'],
  'Inchworms': ['hamstrings', 'shoulders', 'core', 'calves'],
  'Lateral Leg Swings': ['hip abductors', 'adductors', 'glutes'],
  'Dynamic Leg Swings': ['hip flexors', 'hamstrings', 'glutes'],
  'Lateral Lunges': ['adductors', 'quads', 'glutes'],
  'High Knees': ['hip flexors', 'quads', 'core'],
  'Butt Kicks': ['hamstrings', 'quads'],
  'Ankle Circles': ['ankles', 'calves'],
  'Hip Circles': ['hips', 'glutes', 'core'],

  // Post-workout stretches
  'Quad Stretch': ['quadriceps', 'hip flexors'],
  'Standing Quad Stretch': ['quadriceps', 'hip flexors'],
  'Pigeon Pose': ['glutes', 'hip flexors', 'piriformis'],
  'Figure-4 Stretch': ['glutes', 'hips', 'lower back'],
  'Cross-Body Shoulder Stretch': ['shoulders', 'upper back'],
  'Sleeper Stretch': ['rotator cuff', 'shoulders'],
  'Doorway Chest Stretch': ['chest', 'shoulders', 'biceps'],
  'Tricep Overhead Stretch': ['triceps', 'lats', 'shoulders'],
  'Bicep Wall Stretch': ['biceps', 'forearms', 'chest'],
  "Child's Pose": ['lats', 'shoulders', 'lower back', 'hips'],
  'Lat Stretch on Bar': ['lats', 'shoulders', 'upper back'],
  'Lat Stretch on Pull-up Bar': ['lats', 'shoulders', 'upper back'],
  'Seated Hamstring Stretch': ['hamstrings', 'calves', 'lower back'],
  'Hamstring Stretch (Standing)': ['hamstrings', 'calves', 'lower back'],
  'Thread the Needle': ['upper back', 'shoulders', 'spine'],
  'Calf Stretch': ['calves', 'achilles'],
  'Hip Flexor Stretch (Couch Stretch)': ['hip flexors', 'quads'],
  'Supine Twist': ['lower back', 'obliques', 'hips'],
  'IT Band Stretch': ['IT band', 'outer thigh', 'glutes'],
  'Butterfly Stretch': ['inner thighs', 'groin', 'hips'],
};

async function main() {
  console.log('Updating stretches with muscle groups...\n');
  const db = getDatabase();

  try {
    let updatedCount = 0;
    let skippedCount = 0;

    for (const [stretchName, muscleGroups] of Object.entries(stretchMuscleGroups)) {
      const result = await db.execute({
        sql: 'UPDATE stretches SET muscle_groups = ? WHERE name = ? AND (muscle_groups IS NULL OR muscle_groups = "")',
        args: [JSON.stringify(muscleGroups), stretchName]
      });

      if (result.rowsAffected > 0) {
        const muscles = muscleGroups.join(', ');
        console.log('  ✓ Updated: ' + stretchName + ' -> ' + muscles);
        updatedCount++;
      } else {
        const existing = await db.execute({
          sql: 'SELECT muscle_groups FROM stretches WHERE name = ?',
          args: [stretchName]
        });
        if (existing.rows.length > 0 && existing.rows[0].muscle_groups) {
          console.log('  ⊘ Skipped: ' + stretchName + ' (already has muscle groups)');
          skippedCount++;
        } else if (existing.rows.length === 0) {
          console.log('  ✗ Not found: ' + stretchName);
        }
      }
    }

    console.log('\n✅ Update complete!');
    console.log('   Updated: ' + updatedCount);
    console.log('   Skipped: ' + skippedCount);
  } catch (error) {
    console.error('Error updating stretches:', error);
    process.exit(1);
  }
}

main();
