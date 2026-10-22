import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function inspectSentences() {
  const challenges = await sql`
    SELECT c.id, c.question, c.type, l.order as lesson_order, l.title as lesson_title, u.order as unit_order, u.title as unit_title
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE u.order BETWEEN 1 AND 5
    ORDER BY u.order, l.order, c.order
  `;

  for (const c of challenges) {
    const options = await sql`SELECT text, correct, image_src FROM challenge_options WHERE challenge_id = ${c.id}`;
    const correctOpt = options.find((o: any) => o.correct);
    const wordCount = correctOpt?.text.split(' ').length || 0;

    // If it's a multi-word phrase or sentence
    if (wordCount > 1 || c.question.includes('means') || c.question.split(' ').length > 4) {
      console.log(`[Unit ${c.unit_order} Lesson ${c.lesson_order}] Q: "${c.question}"`);
      console.log('   Options:', options.map((o: any) => `"${o.text}" (img: ${o.image_src ? 'yes' : 'no'})`).join(' | '));
    }
  }
}

inspectSentences().catch(console.error);
