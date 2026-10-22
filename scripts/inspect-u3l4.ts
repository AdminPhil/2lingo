import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  const challenges = await sql`
    SELECT c.id, c.order, c.question
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE u.order = 3 AND l.order = 4
    ORDER BY c.order
  `;

  console.log("=== Unit 3 Lesson 4 Challenges ===");
  for (const c of challenges) {
    const opts = await sql`SELECT id, text, correct, audio_src FROM challenge_options WHERE challenge_id = ${c.id} ORDER BY id`;
    console.log(`\nCh ${c.order} (ID ${c.id}): "${c.question}"`);
    for (const o of opts) {
      console.log(`  - Option: "${o.text}" | Correct: ${o.correct} | Audio: ${o.audio_src}`);
    }
  }
}

main().catch(console.error);
