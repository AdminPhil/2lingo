import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  console.log("=== Inspecting Unit 5 (All Lessons & Challenges) ===");

  const challenges = await sql`
    SELECT c.id, c.order as challenge_order, c.question, c.type,
           l.order as lesson_order, l.title as lesson_title
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE u.order = 5
    ORDER BY l.order, c.order
  `;

  for (const c of challenges) {
    const opts = await sql`
      SELECT id, text, correct, audio_src, image_src
      FROM challenge_options
      WHERE challenge_id = ${c.id}
      ORDER BY id
    `;
    const correctOpt = opts.find(o => o.correct);
    console.log(`\nL${c.lesson_order} Ch ${c.challenge_order} (ID ${c.id}) [${c.type}]: "${c.question}"`);
    console.log(`  -> Marked Correct: "${correctOpt?.text}"`);
    console.log(`  -> All Options:`, opts.map(o => `${o.text} (${o.correct ? 'CORRECT' : 'false'})`).join(" | "));
  }
}

main().catch(console.error);
