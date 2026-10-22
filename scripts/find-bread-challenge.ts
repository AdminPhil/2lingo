import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  console.log("Searching for challenges with 'Bread'...");

  const challenges = await sql`
    SELECT c.id, c.question, c.order as challenge_order, c.type,
           l.order as lesson_order, l.title as lesson_title,
           u.order as unit_order, u.title as unit_title
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE c.question ILIKE '%bread%'
    ORDER BY u.order, l.order, c.order
  `;

  console.log(`Found ${challenges.length} challenges with 'Bread':`);
  for (const c of challenges) {
    const opts = await sql`
      SELECT id, text, correct, audio_src, image_src
      FROM challenge_options
      WHERE challenge_id = ${c.id}
      ORDER BY id
    `;
    console.log(`\nUnit ${c.unit_order} L${c.lesson_order} Ch ${c.challenge_order} (ID ${c.id}) [Type: ${c.type}]: "${c.question}"`);
    for (const o of opts) {
      console.log(`  - [Option ID ${o.id}] "${o.text}" | Correct: ${o.correct} | Audio: ${o.audio_src}`);
    }
  }
}

main().catch(console.error);
