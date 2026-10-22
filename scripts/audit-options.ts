import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function inspectDatabase() {
  console.log("=== COMPREHENSIVE CURRICULUM & USER PROGRESS AUDIT ===\n");

  const units = await sql`SELECT id, title, description, "order" FROM units WHERE course_id = 1 ORDER BY "order"`;
  const lessons = await sql`SELECT id, unit_id, title, "order" FROM lessons ORDER BY id`;
  const challenges = await sql`
    SELECT c.id, c.question, c.type, c.order as c_order, l.title as lesson, l.order as l_order, u.title as unit, u.order as u_order
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE u.course_id = 1
    ORDER BY u.order, l.order, c.order
  `;
  const allOptions = await sql`SELECT id, challenge_id, text, correct, image_src, audio_src FROM challenge_options`;

  console.log(`Units count: ${units.length}`);
  console.log(`Lessons count: ${lessons.length}`);
  console.log(`Challenges count: ${challenges.length}`);
  console.log(`Challenge Options count: ${allOptions.length}`);

  // Group options by challengeId
  const optionsByChallenge = new Map<number, any[]>();
  for (const opt of allOptions) {
    if (!optionsByChallenge.has(opt.challenge_id)) {
      optionsByChallenge.set(opt.challenge_id, []);
    }
    optionsByChallenge.get(opt.challenge_id)!.push(opt);
  }

  let countIssues = 0;
  let non4Options = 0;
  let missingAudio = 0;

  for (const c of challenges) {
    const options = optionsByChallenge.get(c.id) || [];
    if (options.length !== 4) {
      non4Options++;
      console.log(`[Non-4 Options] Unit ${c.u_order} Lesson ${c.l_order} Challenge ${c.c_order}: has ${options.length} options (Expected 4)`);
    }

    // Check punctuation uniformity
    const endings = options.map((o: any) => {
      const trimmed = o.text.trim();
      const lastChar = trimmed[trimmed.length - 1];
      return ['!', '?', '.'].includes(lastChar) ? lastChar : 'none';
    });
    const uniqueEndings = new Set(endings);

    // Check capitalization uniformity
    const startsUpper = options.map((o: any) => /^[A-ZČĆŠŽĐ]/.test(o.text.trim()));
    const uniqueStarts = new Set(startsUpper);

    if (uniqueEndings.size > 1 || uniqueStarts.size > 1) {
      countIssues++;
      console.log(`[Asymmetry] Unit ${c.u_order} (${c.lesson}) - Question: "${c.question}"`);
      console.log('Options:', options.map((o: any) => `"${o.text}" (correct: ${o.correct})`));
      console.log('Endings:', Array.from(uniqueEndings), 'Starts:', Array.from(uniqueStarts));
      console.log('---');
    }

    // Check audioSrc presence
    for (const opt of options) {
      if (!opt.audio_src) {
        missingAudio++;
        console.log(`[Missing Audio] Challenge ${c.id}: option "${opt.text}" has no audioSrc`);
      }
    }
  }

  console.log(`\nAudit Results:`);
  console.log(`- Total challenges with != 4 options: ${non4Options}`);
  console.log(`- Total challenges with asymmetry issues: ${countIssues}`);
  console.log(`- Total options missing audio: ${missingAudio}`);

  console.log(`\n=== USER PROGRESS VERIFICATION ===`);
  const users = await sql`SELECT user_id, user_name, points FROM user_progress ORDER BY points DESC`;
  for (const u of users) {
    const cpCount = await sql`SELECT count(*) FROM challenge_progress WHERE user_id = ${u.user_id}`;
    console.log(`User "${u.user_name}": ${u.points} XP, completed ${cpCount[0].count} challenges.`);
  }

  console.log(`\n=== AUDIT COMPLETED ===`);
}

inspectDatabase();
