import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  console.log("Searching for 'cat' or 'konj' or 'mačka' across challenges and options...");

  const challenges = await sql`
    SELECT c.id, c.question, c.order as challenge_order,
           l.order as lesson_order, l.title as lesson_title,
           u.order as unit_order, u.title as unit_title
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE c.question ILIKE '%cat%' 
       OR c.question ILIKE '%mačk%' 
       OR c.question ILIKE '%konj%'
       OR c.question ILIKE '%horse%'
    ORDER BY u.order, l.order, c.order
  `;

  console.log(`Found ${challenges.length} matching challenges:`);
  for (const c of challenges) {
    const opts = await sql`
      SELECT id, text, correct, audio_src, image_src
      FROM challenge_options
      WHERE challenge_id = ${c.id}
      ORDER BY id
    `;
    console.log(`\nUnit ${c.unit_order} L${c.lesson_order} Ch ${c.challenge_order} (ID ${c.id}): "${c.question}"`);
    for (const o of opts) {
      console.log(`  - Option ID ${o.id}: "${o.text}" | Correct: ${o.correct} | Audio: ${o.audio_src} | Img: ${o.image_src}`);
    }
  }

  // Also check if any option has text containing "konj" where correct = true
  console.log("\n--- Checking all challenges where 'Konj' is marked correct ---");
  const konjCorrect = await sql`
    SELECT c.id, c.question, co.id as opt_id, co.text, co.correct,
           u.order as unit_order, l.order as lesson_order
    FROM challenge_options co
    JOIN challenges c ON co.challenge_id = c.id
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE co.text ILIKE '%konj%' AND co.correct = true
  `;
  for (const k of konjCorrect) {
    console.log(`Unit ${k.unit_order} L${k.lesson_order} (Challenge ID ${k.id}): Question: "${k.question}" -> Option: "${k.text}" (Correct: ${k.correct})`);
  }
}

main().catch(console.error);
