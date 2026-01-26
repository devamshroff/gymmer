// scripts/add-exercise-tips.ts
// Update exercises with comprehensive form tips
import { getDatabase } from '../lib/database';

const exerciseTips: Record<string, string> = {
  // Lower Body
  'Box Jumps': 'Land softly with bent knees. Step down, don\'t jump down. Full hip extension at top. Start with lower box (12-16") and progress.',
  'Belt Squats': 'Keep torso upright, chest proud. Drive through heels. Full depth - ass to grass if mobility allows. Great for quad development without spinal load.',
  'Hack Squats': 'Feet shoulder-width, slightly forward on platform. Full depth, control the descent. Keep lower back pressed into pad. Don\'t lock knees at top.',
  'Romanian Deadlifts': 'Hinge at hips, not lower back. Bar stays close to legs. Slight knee bend, feel hamstring stretch. Squeeze glutes at top. Keep spine neutral.',
  'Single-Leg RDL': 'Balance on one leg, hinge forward. Keep back flat, drive through standing heel. Rear leg goes straight back. 8 reps each leg.',
  'Lateral Bounds': 'Explosive side-to-side jump. Land stable on one foot, pause 1 second. Absorb landing with bent knee. Great for soccer agility.',
  'Hanging Leg Raises': 'Dead hang, no swinging. Raise knees to chest or straight legs to 90°. Control the descent, don\'t let momentum take over.',

  // Upper Body - Push
  'Shoulder Press': 'Brace core, squeeze glutes. Press straight up, lockout overhead. Control descent to shoulders. Keep elbows slightly forward.',
  'DB Shoulder Press': 'Seated or standing. Neutral or pronated grip. Press overhead, lockout at top. Don\'t arch lower back excessively.',
  'Incline DB Press': 'Bench at 30-45°. Press dumbbells at slight angle inward. Full stretch at bottom, squeeze at top. Keep shoulder blades retracted.',
  'Alternating DB Chest Press': 'One arm presses while other stays extended. Keep non-pressing arm locked out. Great core stability challenge.',

  // Upper Body - Pull
  'Close-Grip Pull-ups': 'Hands inside shoulder-width. Pull chest to bar. Full extension at bottom, chin over bar at top. Use assist machine if needed.',
  'Lat Pulldowns (MAG grip or wide)': 'Pull elbows down and back. Allow full stretch at top. Squeeze lats at bottom. Don\'t lean back excessively.',
  'Seated Cable Rows': 'Chest up, slight lean back at end. Squeeze shoulder blades together. Control the return. Don\'t round lower back.',
  'Chest Supported Rows': 'Chest on incline bench. Pull to hips, not chest. Squeeze shoulder blades together. No momentum.',
  'Face Pulls': 'Pull to face level. External rotation at end. Keep elbows high. Squeeze rear delts and upper back.',

  // Arms
  'Seated DB Curls': 'Back supported against bench. Full supination at top. Control eccentric. No swinging.',
  'DB Hammer Curls': 'Neutral grip throughout. No swinging. Squeeze at top, control descent. Great for brachialis.',
  'Cable Bicep Curls': 'Constant cable tension. Squeeze at top. Keep elbows stationary. Control the negative.',
  'Barbell Curls (pronated grip/fists down)': 'Overhand grip (palms down). Targets brachialis and forearms. No swinging, controlled movement.',
  'Tricep Extensions (2 separate handles)': 'Keep elbows pinned at sides. Full extension at bottom. Squeeze triceps hard.',
  'Overhead Tricep Extension (rope)': 'Elbows by ears, don\'t flare. Full stretch at bottom. Complete extension at top.',
  'Cable Tricep Pushdowns': 'Elbows pinned at sides. Full extension. Control the return. Don\'t lean forward.',

  // Shoulders/Back Accessories
  'DB Bent-Over Lateral Raises (Rear Delts)': 'Hinge at hips, chest parallel to floor. Lead with elbows. Pinky higher than thumb at top.',
};

async function main() {
  console.log('Updating exercises with form tips...\n');
  const db = getDatabase();

  try {
    let updatedCount = 0;
    let skippedCount = 0;

    for (const [exerciseName, tips] of Object.entries(exerciseTips)) {
      const result = await db.execute({
        sql: 'UPDATE exercises SET tips = ? WHERE name = ? AND (tips IS NULL OR tips = "")',
        args: [tips, exerciseName]
      });

      if (result.rowsAffected > 0) {
        console.log('  ✓ Updated: ' + exerciseName);
        updatedCount++;
      } else {
        const existing = await db.execute({
          sql: 'SELECT tips FROM exercises WHERE name = ?',
          args: [exerciseName]
        });
        if (existing.rows.length > 0 && existing.rows[0].tips) {
          console.log('  ⊘ Skipped: ' + exerciseName + ' (already has tips)');
          skippedCount++;
        } else if (existing.rows.length === 0) {
          console.log('  ✗ Not found: ' + exerciseName);
        }
      }
    }

    console.log('\n✅ Update complete!');
    console.log('   Updated: ' + updatedCount);
    console.log('   Skipped: ' + skippedCount);
  } catch (error) {
    console.error('Error updating exercises:', error);
    process.exit(1);
  }
}

main();
