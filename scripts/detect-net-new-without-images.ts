import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  const challenges = await sql`
    SELECT u.order as unit_order, u.title as unit_title,
           l.order as lesson_order, l.title as lesson_title,
           c.id as challenge_id, c.order as challenge_order, c.question, c.type
    FROM units u
    JOIN lessons l ON l.unit_id = u.id
    JOIN challenges c ON c.lesson_id = l.id
    ORDER BY u.order, l.order, c.order
  `;

  const seenWords = new Set<string>();
  const deductiveCandidates: any[] = [];

  for (const c of challenges) {
    const opts = await sql`
      SELECT text, correct, image_src
      FROM challenge_options
      WHERE challenge_id = ${c.challenge_id}
      ORDER BY id
    `;
    const hasImages = opts.some(o => !!o.image_src);
    const correctOpt = opts.find(o => o.correct);

    if (hasImages) {
      // Add words to seenWords
      for (const o of opts) {
        if (o.text) seenWords.add(o.text.trim().toLowerCase());
      }
    } else {
      // Text-only challenge
      const correctWord = correctOpt?.text.trim().toLowerCase() || "";
      const isNetNew = !seenWords.has(correctWord);
      
      // Check how many distractors are unseen
      const unseenDistractors = opts
        .filter(o => !o.correct)
        .map(o => o.text.trim())
        .filter(t => !seenWords.has(t.toLowerCase()));

      if (isNetNew) {
        deductiveCandidates.push({
          unit: c.unit_order,
          lesson: c.lesson_order,
          challenge: c.challenge_order,
          challengeId: c.challenge_id,
          question: c.question,
          correct: correctOpt?.text,
          unseenDistractors,
          allDistractors: opts.filter(o => !o.correct).map(o => o.text.trim())
        });
      }
      
      // Now add them to seen words
      for (const o of opts) {
        if (o.text) seenWords.add(o.text.trim().toLowerCase());
      }
    }
  }

  console.log(`\n=== NET-NEW WORDS INTRODUCED IN TEXT-ONLY CHALLENGES ===`);
  console.log(`Found ${deductiveCandidates.length} instances:\n`);
  for (const item of deductiveCandidates) {
    console.log(`Unit ${item.unit} L${item.lesson} Ch${item.challenge} (ID: ${item.challengeId}): "${item.question}" -> Correct: "${item.correct}"`);
    console.log(`  Current distractors: [${item.allDistractors.join(", ")}]`);
    console.log(`  Unseen distractors (Blind Guess Risk): [${item.unseenDistractors.join(", ")}]`);
    console.log("---");
  }
}

main().catch(console.error);
