import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

const sql = neon(process.env.DATABASE_URL || "");

function normalizeWord(s: string): string {
  return s.toLowerCase()
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]/g, "");
}

function normalizeDiacritics(s: string): string {
  return s.toLowerCase()
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d");
}

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

    // Rule: Lesson 1 Visual Flashcards Required (BUG-037 Invariant)
    if (c.l_order === 1 && c.type === "SELECT") {
      const missingImgs = opts.filter((o: any) => !o.image_src);
      if (missingImgs.length > 0) {
        console.error(`[RULE VIOLATION: Missing Visual Flashcard Image] Unit ${c.u_order} L1 Ch${c.c_order}: ${missingImgs.length} option(s) missing image_src in SELECT challenge!`);
        totalErrors++;
      }
    }

    // Rule: Intra-Challenge Image & Visual Asset Uniqueness (Bugs #2, #4)
    const imagesInChallenge = opts.filter((o: any) => !!o.image_src);
    if (imagesInChallenge.length > 0) {
      const imageSrcs = imagesInChallenge.map((o: any) => o.image_src);
      const uniqueImageSrcs = new Set(imageSrcs);
      if (uniqueImageSrcs.size < imageSrcs.length) {
        console.error(`[RULE VIOLATION: Duplicate Image Source] Unit ${c.u_order} L${c.l_order} Ch${c.c_order}: Challenge has multiple options with identical imageSrc!`);
        totalErrors++;
      }

      const fileContents = new Map<string, string>();
      for (const opt of imagesInChallenge) {
        const imgPath = path.join(__dirname, "..", "public", opt.image_src.replace(/^\//, ""));
        if (fs.existsSync(imgPath) && !fileContents.has(opt.image_src)) {
          fileContents.set(opt.image_src, fs.readFileSync(imgPath, "utf8").trim());
        }
      }
      const seenContents = new Map<string, string>();
      for (const opt of imagesInChallenge) {
        const content = fileContents.get(opt.image_src);
        if (content) {
          if (seenContents.has(content) && seenContents.get(content) !== opt.image_src) {
            console.error(`[RULE VIOLATION: Duplicate SVG Artwork] Unit ${c.u_order} L${c.l_order} Ch${c.c_order}: Option "${opt.text}" (${opt.image_src}) has identical artwork to (${seenContents.get(content)})!`);
            totalErrors++;
          } else {
            seenContents.set(content, opt.image_src);
          }
        }
      }
    }

    // Rule: Answer-Prompt Lexical Leakage Guard (Bugs #3, #5)
    const correctOpt = opts.find((o: any) => o.correct);
    if (correctOpt) {
      const cleanQ = c.question.replace(/['"]/g, "").trim();
      const cleanOpt = correctOpt.text.trim();
      if (cleanQ.includes("(") || cleanQ.includes("/")) {
        const regex = new RegExp(`\\b${normalizeDiacritics(cleanOpt)}\\b`, "i");
        if (regex.test(normalizeDiacritics(cleanQ))) {
          console.error(`[RULE VIOLATION: Prompt Answer Leakage] Unit ${c.u_order} L${c.l_order} Ch${c.c_order}: "${c.question}" leaks correct answer "${correctOpt.text}"!`);
          totalErrors++;
        }
      }
    }

    // Rule: Single-Word Audio Semantic Parity Guard (BUG-037 Universal Standard)
    for (const opt of opts) {
      if (opt.audio_src) {
        const trimmed = (opt.text || "").trim();
        if (!trimmed.includes(" ")) {
          const textSlug = normalizeWord(trimmed);
          const baseSlug = path.basename(opt.audio_src, ".mp3");
          const normAudioSlug = normalizeWord(baseSlug);

          // Allowed stem variations (e.g., exact grammatical aliases)
          const ACCEPTED_INFLECTION_ALIASES: Record<string, string[]> = {
            // Croatian words with known legitimate orthographic/stem variations
          };

          if (textSlug !== normAudioSlug) {
            const allowed = ACCEPTED_INFLECTION_ALIASES[textSlug] || [];
            if (!allowed.includes(normAudioSlug)) {
              console.error(`[RULE VIOLATION: Audio Semantic Conflict] Unit ${c.u_order} L${c.l_order} Ch${c.c_order}: Option "${opt.text}" plays audio for "${baseSlug}.mp3"! (Expected ~${textSlug})`);
              totalErrors++;
            }
          }
        }
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
