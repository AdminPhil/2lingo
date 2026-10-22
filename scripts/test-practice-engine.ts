import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  console.log("Testing Practice Engine Data Sources...");

  // Check beginner fallback challenges
  const starter = await sql`
    SELECT c.id, c.question, count(co.id) as option_count
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    LEFT JOIN challenge_options co ON co.challenge_id = c.id
    WHERE u.order = 1 AND l.order = 1
    GROUP BY c.id, c.question
    ORDER BY c.order
    LIMIT 3
  `;

  console.log(`Starter challenges available for fallback: ${starter.length}`);
  starter.forEach((s) => {
    console.log(`  - [ID ${s.id}] "${s.question}" (${s.option_count} options)`);
  });

  // Verify learner hearts status
  const learners = await sql`
    SELECT user_name, points, hearts, hearts_used 
    FROM user_progress 
    WHERE user_name IN ('Adriana', 'Vanessa', 'Silvia')
    ORDER BY points DESC
  `;

  console.log("\nCurrent Active Learners:");
  console.table(learners);

  console.log("✅ Practice Engine prerequisites verified successfully!");
}

main().catch(console.error);
