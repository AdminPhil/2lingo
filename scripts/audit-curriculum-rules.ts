import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

const sql = neon(process.env.DATABASE_URL || "");

async function auditAllRules() {
  console.log("=== 🛡️ 2LINGO PRE-FLIGHT CURRICULUM & ARCHITECTURE AUDIT ===\n");

  let totalErrors = 0;

  // 1. Check Units, Lessons, Challenges counts
  const units = await sql`SELECT id, "order", title FROM units WHERE course_id = 1 ORDER BY "order"`;
  const lessons = await sql`SELECT id, unit_id, "order", title FROM lessons ORDER BY id`;
  const challenges = await sql`
    SELECT c.id, c.order as c_order, c.question, c.type, l.order as l_order, u.order as u_order
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE u.course_id = 1
    ORDER BY u.order, l.order, c.order
  `;
  const options = await sql`SELECT id, challenge_id, text, correct, image_src, audio_src FROM challenge_options`;

  console.log(`Auditing: ${units.length} Units, ${lessons.length} Lessons, ${challenges.length} Challenges, ${options.length} Options...`);

  // Group options by challengeId
  const optionsByChallenge = new Map<number, any[]>();
  for (const opt of options) {
    if (!optionsByChallenge.has(opt.challenge_id)) {
      optionsByChallenge.set(opt.challenge_id, []);
    }
    optionsByChallenge.get(opt.challenge_id)!.push(opt);
  }

  // 2. Audit 4-option requirement & Symmetry & Audio
  for (const c of challenges) {
    const opts = optionsByChallenge.get(c.id) || [];

    // Rule: Exactly 4 options
    if (opts.length !== 4) {
      console.error(`[RULE VIOLATION: 4-Option Grid] Unit ${c.u_order} L${c.l_order} Ch${c.c_order} has ${opts.length} options (Expected 4)`);
      totalErrors++;
    }

    // Rule: Punctuation Symmetry (zero giveaways)
    const endings = opts.map((o: any) => {
      const trimmed = o.text.trim();
      const lastChar = trimmed[trimmed.length - 1];
      return ['!', '?', '.'].includes(lastChar) ? lastChar : 'none';
    });
    const uniqueEndings = new Set(endings);

    // Rule: Capitalization Uniformity
    const startsUpper = opts.map((o: any) => /^[A-ZČĆŠŽĐ]/.test(o.text.trim()));
    const uniqueStarts = new Set(startsUpper);

    if (uniqueEndings.size > 1 || uniqueStarts.size > 1) {
      console.error(`[RULE VIOLATION: Distractor Asymmetry] Unit ${c.u_order} L${c.l_order} Ch${c.c_order}: "${c.question}"`);
      console.error('  Options:', opts.map((o: any) => o.text));
      totalErrors++;
    }

    // Rule: Audio File on Disk & Multi-Word Phrase Audio Match (BUG-027)
    for (const opt of opts) {
      if (!opt.audio_src) {
        console.error(`[RULE VIOLATION: Missing Audio Source] Option "${opt.text}" has no audioSrc`);
        totalErrors++;
      } else {
        const audioPath = path.join(__dirname, "..", "public", opt.audio_src.replace(/^\//, ""));
        if (!fs.existsSync(audioPath)) {
          console.error(`[RULE VIOLATION: Audio File Missing on Disk] ${opt.audio_src} (Option: "${opt.text}")`);
          totalErrors++;
        }
        const trimmedText = (opt.text || "").trim();
        if (trimmedText.includes(" ")) {
          const baseSlug = path.basename(opt.audio_src, ".mp3");
          if (!baseSlug.includes("_")) {
            console.error(`[RULE VIOLATION: Multi-Word Phrase Mapped to Single-Word Audio] Option "${opt.text}" -> ${opt.audio_src}`);
            totalErrors++;
          }
        }
      }

      // Rule: If imageSrc present, verify file on disk
      if (opt.image_src) {
        const imgPath = path.join(__dirname, "..", "public", opt.image_src.replace(/^\//, ""));
        if (!fs.existsSync(imgPath)) {
          console.error(`[RULE VIOLATION: Image File Missing on Disk] ${opt.image_src} (Option: "${opt.text}")`);
          totalErrors++;
        }
      }
    }

    // Rule: Progressive Fading (No images in Lessons 2, 3, 4)
    if (c.l_order > 1) {
      const optsWithImages = opts.filter((o: any) => o.image_src !== null);
      if (optsWithImages.length > 0) {
        console.error(`[RULE VIOLATION: Progressive Fading] Unit ${c.u_order} Lesson ${c.l_order} has images attached! (Only Lesson 1 allowed)`);
        totalErrors++;
      }
    }
  }

  // 3. Audit User Progress & Leaderboard Privacy
  const users = await sql`SELECT user_id, user_name, points FROM user_progress ORDER BY points DESC`;
  console.log(`\nActive Learners in Database: ${users.length}`);
  users.forEach((u: any, i: number) => {
    console.log(`  Rank ${i + 1}: ${u.user_name} - ${u.points} XP`);
  });

  const coreLearners = ['Adriana', 'Vanessa', 'Silvia'];
  for (const learner of coreLearners) {
    const found = users.find((u: any) => u.user_name.toLowerCase().includes(learner.toLowerCase()));
    if (!found || found.points === 0) {
      console.error(`[RULE VIOLATION: User Progress Guard] Core learner ${learner} missing or reset to 0 XP!`);
      totalErrors++;
    }
  }

  console.log(`\n========================================`);
  if (totalErrors === 0) {
    console.log(`✅ AUDIT PASSED: 0 rule violations detected! Safe to merge and deploy.`);
    process.exit(0);
  } else {
    console.error(`❌ AUDIT FAILED: ${totalErrors} rule violation(s) must be resolved before merging!`);
    process.exit(1);
  }
}

auditAllRules().catch((err) => {
  console.error("Audit script failed:", err);
  process.exit(1);
});
