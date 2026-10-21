import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  console.log("Analyzing users and curriculum to auto-complete units based on XP...");

  const users = await sql`
    SELECT user_id, user_name, points, hearts, active_course_id
    FROM user_progress
    ORDER BY points DESC
  `;

  console.log("Found users:", users);

  // Retrieve all challenges ordered by Unit -> Lesson -> Challenge order
  const allChallenges = await sql`
    SELECT 
      c.id AS challenge_id, 
      c.order AS challenge_order, 
      l.id AS lesson_id, 
      l.order AS lesson_order, 
      l.title AS lesson_title,
      u.id AS unit_id, 
      u.order AS unit_order,
      u.title AS unit_title
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE u.course_id = 1
    ORDER BY u.order ASC, l.order ASC, c.order ASC
  `;

  console.log(`Total curriculum challenges: ${allChallenges.length}`);

  // Clear existing challenge_progress to avoid any duplicate keys
  await sql`DELETE FROM challenge_progress`;

  for (const user of users) {
    const points = user.points || 0;
    const challengesToCompleteCount = Math.min(
      Math.floor(points / 10),
      allChallenges.length
    );

    console.log(`\nUser "${user.user_name}" (${user.user_id}) has ${points} XP -> Crediting ${challengesToCompleteCount} completed challenges:`);

    if (challengesToCompleteCount > 0) {
      const challengesToComplete = allChallenges.slice(0, challengesToCompleteCount);
      
      // Batch insert into challenge_progress
      for (const ch of challengesToComplete) {
        await sql`
          INSERT INTO challenge_progress (user_id, challenge_id, completed)
          VALUES (${user.user_id}, ${ch.challenge_id}, true)
        `;
      }

      const lastChallenge = challengesToComplete[challengesToComplete.length - 1];
      console.log(` -> Unlocked up through: Unit ${lastChallenge.unit_order} ("${lastChallenge.unit_title}"), Lesson ${lastChallenge.lesson_order} ("${lastChallenge.lesson_title}")`);
    } else {
      console.log(` -> Starting at Unit 1, Lesson 1 (0 completed challenges).`);
    }
  }

  const finalCount = await sql`SELECT count(*) FROM challenge_progress`;
  console.log(`\nSuccessfully created ${finalCount[0].count} challenge_progress records.`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
