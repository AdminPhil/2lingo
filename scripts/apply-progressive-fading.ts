import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function applyProgressiveFading() {
  console.log("=== APPLYING PROGRESSIVE FADING (DUOLINGO STANDARD) ACROSS ALL 20 UNITS ===\n");

  // 1. Audit current distribution of images by lesson order
  const beforeStats = await sql`
    SELECT l.order as lesson_order, COUNT(co.id) as option_count
    FROM challenge_options co
    JOIN challenges c ON co.challenge_id = c.id
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE co.image_src IS NOT NULL
    GROUP BY l.order
    ORDER BY l.order
  `;

  console.log("Current options with images grouped by Lesson order:");
  for (const s of beforeStats) {
    console.log(`- Lesson ${s.lesson_order}: ${s.option_count} options`);
  }

  // 2. Identify all options with images in Lessons 2, 3, and 4 (including Super Izazov)
  const fadingTargets = await sql`
    SELECT co.id, u.order as unit_order, l.order as lesson_order, c.order as challenge_order, c.question, co.text, co.image_src
    FROM challenge_options co
    JOIN challenges c ON co.challenge_id = c.id
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE l.order > 1 AND co.image_src IS NOT NULL
  `;

  console.log(`\nFound ${fadingTargets.length} options in Lessons 2, 3, and 4 that currently have images.`);

  if (fadingTargets.length > 0) {
    const idsToClear = fadingTargets.map((t: any) => t.id);
    console.log("Fading out images (setting image_src = NULL) for Lessons 2, 3, and 4...");

    // Update in batches of 100
    for (let i = 0; i < idsToClear.length; i += 100) {
      const batch = idsToClear.slice(i, i + 100);
      await sql`
        UPDATE challenge_options
        SET image_src = NULL
        WHERE id = ANY(${batch})
      `;
    }
    console.log(`Successfully faded out images from ${idsToClear.length} options in Lessons 2, 3, and 4!`);
  }

  // 3. Verify Lesson 1 images are clean and valid
  const lesson1Images = await sql`
    SELECT COUNT(co.id) as count
    FROM challenge_options co
    JOIN challenges c ON co.challenge_id = c.id
    JOIN lessons l ON c.lesson_id = l.id
    WHERE l.order = 1 AND co.image_src IS NOT NULL
  `;
  console.log(`\nLesson 1 Discovery options with visual scaffolding: ${lesson1Images[0].count}`);

  // 4. Audit distribution after progressive fading
  const afterStats = await sql`
    SELECT l.order as lesson_order, COUNT(co.id) as option_count
    FROM challenge_options co
    JOIN challenges c ON co.challenge_id = c.id
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE co.image_src IS NOT NULL
    GROUP BY l.order
    ORDER BY l.order
  `;

  console.log("\nPost-fading options with images grouped by Lesson order:");
  for (const s of afterStats) {
    console.log(`- Lesson ${s.lesson_order}: ${s.option_count} options`);
  }

  // 5. Specifically check Unit 7 Lesson 4 (Silvia's challenge: "Which one of these is 'Toy'?")
  const silviaToyChallenge = await sql`
    SELECT c.id, c.question, co.text, co.image_src, co.audio_src
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    JOIN challenge_options co ON co.challenge_id = c.id
    WHERE u.order = 7 AND l.order = 4 AND c.question = 'Which one of these is \"Toy\"?'
  `;
  console.log("\nSilvia's Unit 7 Super Izazov 'Toy' challenge options after fading:");
  for (const opt of silviaToyChallenge) {
    console.log(`- ${opt.text}: image_src = ${opt.image_src} (audio: ${opt.audio_src})`);
  }

  // 6. Verify User Progress intact
  console.log("\n=== USER PROGRESS VERIFICATION ===");
  const users = await sql`SELECT user_id, user_name, points FROM user_progress ORDER BY points DESC`;
  for (const u of users) {
    console.log(`User "${u.user_name}": ${u.points} XP`);
  }

  console.log("\nProgressive fading successfully applied across all 20 units!");
}

applyProgressiveFading()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error applying progressive fading:", err);
    process.exit(1);
  });
