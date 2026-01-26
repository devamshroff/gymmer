// scripts/add-stretch-tips.ts
// Update stretches with comprehensive form tips
import { getDatabase } from '../lib/database';

const stretchTips: Record<string, string> = {
  // Pre-workout dynamic stretches
  'Leg Swings': 'Hold wall or bar for balance. Keep standing leg slightly bent. Control the swing, don\'t just throw your leg. Forward/back loosens hip flexors and hamstrings.',
  'Walking Lunges': 'Big step forward, front knee over ankle not past toes. Back knee almost touches ground. Keep torso upright. Activates glutes, opens hip flexors.',
  'Walking Lunges with Twist': 'Same as walking lunge but rotate torso toward front leg at bottom. Opens hips and warms up core. Keep rotation in mid-back, not lower back.',
  'Bodyweight Squats': 'Feet shoulder-width apart. Sit back and down like sitting in chair. Keep chest up, knees tracking over toes. Full depth if mobility allows.',
  'Arm Circles': 'Start with small circles, gradually make them larger. Forward then backward. Keep core engaged. Warms up shoulder joint.',
  'Band Pull-Aparts': 'Arms straight out front, shoulder-width grip on band. Pull band apart to chest level. Squeeze shoulder blades together. Light resistance.',
  'Scapular Wall Slides': 'Back flat against wall. Arms in "goal post" position. Slide arms up and down while keeping contact with wall. Primes shoulder blade movement.',
  'Push-up Plus': 'Regular push-up but at top, push extra to round upper back. Spreads shoulder blades apart. Activates serratus anterior for pressing.',
  'Ankle Bounces': 'Small quick hops on balls of feet. Keep knees slightly bent. Land softly. Wakes up calves and ankles.',
  'Cat-Cow Stretch': 'On all fours, arch back up (cat) then drop belly down (cow). Move slowly through full range. Mobilizes entire spine.',
  'Cat-Cow': 'On all fours, arch back up (cat) then drop belly down (cow). Move slowly through full range. Mobilizes entire spine.',
  'Glute Bridges': 'Lie on back, knees bent, feet flat. Drive hips up squeezing glutes. Hold briefly at top. Don\'t hyperextend lower back.',
  'Inchworms': 'Bend forward, walk hands out to plank. Walk feet back to hands. Keep legs as straight as possible. Great full-body warmup.',
  'Lateral Leg Swings': 'Hold wall, swing leg side to side across body. Control the movement. Opens hip abductors and adductors.',
  'High Knees': 'Run in place bringing knees to waist height. Pump arms. Stay on balls of feet. Activates hip flexors and core.',
  'Butt Kicks': 'Run in place, kicking heels to glutes. Stay light on feet. Warms up hamstrings and quads.',
  'Ankle Circles': 'Lift foot off ground, rotate ankle in circles. Both directions. Prepares ankle joint for activity.',
  'Hip Circles': 'Stand on one leg, draw circles with raised knee. Both directions. Opens up hip joint.',

  // Post-workout static stretches
  'Quad Stretch': 'Stand on one leg, grab ankle and pull heel to butt. Keep knees together. Push hips forward slightly for deeper stretch.',
  'Standing Quad Stretch': 'Stand on one leg, grab ankle and pull heel to butt. Keep knees together. Push hips forward slightly for deeper stretch.',
  'Pigeon Pose': 'Front leg bent at 90°, back leg straight behind. Square hips forward. Fold forward for deeper glute stretch. Key pose for hip mobility.',
  'Figure-4 Stretch': 'Lie on back, cross ankle over opposite knee. Pull knee toward chest. Feel stretch in glute of crossed leg.',
  'Cross-Body Shoulder Stretch': 'Arm straight across chest. Use other hand to pull it closer. Keep shoulder down, don\'t shrug. Stretches posterior deltoid.',
  'Sleeper Stretch': 'Lie on side, bottom arm at 90°. Use top hand to rotate forearm toward floor. Stretches rotator cuff.',
  'Doorway Chest Stretch': 'Forearm on doorframe, elbow at shoulder height. Step through and rotate away. Feel stretch across chest and front shoulder.',
  'Tricep Overhead Stretch': 'Arm overhead, bend elbow so hand reaches toward opposite shoulder. Pull elbow behind head with other hand.',
  'Bicep Wall Stretch': 'Palm flat on wall behind you, fingers pointing away. Rotate body away from wall. Feel stretch in bicep and chest.',
  "Child's Pose": 'Kneel, sit back on heels, reach arms forward on floor. Rest forehead on mat. Stretches lats, shoulders, lower back.',
  'Lat Stretch on Bar': 'Hang from bar, let body sway to one side. Feel stretch in lat on opposite side. Great for decompressing spine.',
  'Lat Stretch on Pull-up Bar': 'Hang from bar, let body sway to one side. Feel stretch in lat on opposite side. Great for decompressing spine.',
  'Seated Hamstring Stretch': 'One leg extended, other bent in. Reach toward extended foot. Keep back straight, hinge at hips.',
  'Hamstring Stretch (Standing)': 'Foot elevated on bench or ledge. Lean forward with flat back. Feel stretch behind knee and up into glute.',
  'Thread the Needle': 'On all fours, thread one arm under body. Rest shoulder on ground. Stretches upper back and shoulders.',
  'Calf Stretch': 'Against wall, one leg back with heel down. Lean into wall. Straight leg stretches gastrocnemius, bent leg stretches soleus.',
  'Hip Flexor Stretch (Couch Stretch)': 'One knee down, top of foot on wall or couch behind. Other foot forward in lunge. Deep hip flexor stretch.',
  'Supine Twist': 'Lie on back, one knee across body. Keep both shoulders on floor. Look opposite direction. Releases lower back tension.',
  'IT Band Stretch': 'Cross one leg behind other. Lean away from back leg. Feel stretch on outer thigh/hip of back leg.',
  'Butterfly Stretch': 'Sit with soles of feet together. Gently press knees toward floor. Keep spine straight. Opens inner thighs and groin.',
};

async function main() {
  console.log('Updating stretches with form tips...\n');
  const db = getDatabase();

  try {
    let updatedCount = 0;
    let skippedCount = 0;

    for (const [stretchName, tips] of Object.entries(stretchTips)) {
      // Update tips even if they exist (to improve them)
      const result = await db.execute({
        sql: 'UPDATE stretches SET tips = ? WHERE name = ?',
        args: [tips, stretchName]
      });

      if (result.rowsAffected > 0) {
        console.log('  ✓ Updated: ' + stretchName);
        updatedCount++;
      } else {
        console.log('  ✗ Not found: ' + stretchName);
      }
    }

    console.log('\n✅ Update complete!');
    console.log('   Updated: ' + updatedCount);
  } catch (error) {
    console.error('Error updating stretches:', error);
    process.exit(1);
  }
}

main();
