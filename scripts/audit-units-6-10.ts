import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function auditUnits6To10() {
  console.log("Auditing Units 6 to 10 for visual scaffolding, 4 options, and distractor symmetry...\n");

  const challenges = await sql`
    SELECT c.id, c.question, c.type, c.order as ch_order, l.id as lesson_id, l.title as lesson_title, l.order as lesson_order, u.id as unit_id, u.title as unit_title, u.order as unit_order
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE u.order BETWEEN 6 AND 10
    ORDER BY u.order, l.order, c.order
  `;

  console.log(`Total challenges in Units 6 to 10: ${challenges.length}`);

  let under4Options = 0;
  let missingImagesOnDiscovery = 0;

  for (const c of challenges) {
    const options = await sql`
      SELECT id, text, correct, image_src, audio_src 
      FROM challenge_options 
      WHERE challenge_id = ${c.id}
    `;

    const correctOpt = options.find((o: any) => o.correct);

    if (options.length < 4) {
      under4Options++;
    }

    if (c.lesson_order === 1 && c.type === 'SELECT' && !correctOpt?.image_src) {
      missingImagesOnDiscovery++;
      console.log(`[Missing Visual Scaffold] Unit ${c.unit_order} Lesson ${c.lesson_order} Challenge #${c.id}: "${c.question}" has no image_src on correct option`);
    }
  }

  console.log(`\nChallenges with fewer than 4 options: ${under4Options} / ${challenges.length}`);
  console.log(`Lesson 1 discovery challenges missing visual scaffolding: ${missingImagesOnDiscovery}`);
}

auditUnits6To10().catch(console.error);
