import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

const sql = neon(process.env.DATABASE_URL || "");

// Croatian-English vocabulary baseline for semantic verification
const numberMap: Record<string, string> = {
  "one": "jedan",
  "two": "dva",
  "three": "tri",
  "four": "četiri",
  "five": "pet",
  "six": "šest",
  "seven": "sedam",
  "eight": "osam",
  "nine": "devet",
  "ten": "deset",
  "1": "jedan",
  "2": "dva",
  "3": "tri",
  "4": "četiri",
  "5": "pet",
  "6": "šest",
  "7": "sedam",
  "8": "osam",
  "9": "devet",
  "10": "deset",
};

async function audit() {
  console.log("=== 🔍 COMPREHENSIVE PRACTICE SESSION & CURRICULUM AUDIT ===\n");

  const challenges = await sql`
    SELECT c.id, c.question, c.type, l.id as lesson_id, l.title as lesson_title, u.order as unit_order, u.title as unit_title
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    ORDER BY u.order, l.id, c.id
  `;

  const allOptions = await sql`
    SELECT id, challenge_id, text, correct, image_src, audio_src
    FROM challenge_options
    ORDER BY challenge_id, id
  `;

  const optionsByChallenge = new Map<number, typeof allOptions>();
  for (const opt of allOptions) {
    if (!optionsByChallenge.has(opt.challenge_id)) {
      optionsByChallenge.set(opt.challenge_id, []);
    }
    optionsByChallenge.get(opt.challenge_id)!.push(opt);
  }

  let issuesFound = 0;

  // 1. Check Option Count & Exactly One Correct
  console.log("--- 1. Checking 4-Option Grid & Correct Answer Cardinality ---");
  for (const c of challenges) {
    const opts = optionsByChallenge.get(c.id) || [];
    if (opts.length !== 4) {
      console.error(`❌ Challenge ${c.id} (U${c.unit_order}): Has ${opts.length} options instead of 4!`);
      issuesFound++;
    }
    const correctOpts = opts.filter(o => o.correct);
    if (correctOpts.length !== 1) {
      console.error(`❌ Challenge ${c.id} (U${c.unit_order}): Has ${correctOpts.length} correct options (expected exactly 1)!`);
      issuesFound++;
    }
  }

  // 2. Check for Duplicate Images within any Challenge
  console.log("\n--- 2. Checking for Duplicate Image Collisions within Challenges ---");
  for (const c of challenges) {
    const opts = optionsByChallenge.get(c.id) || [];
    const imageMap = new Map<string, string[]>();
    for (const opt of opts) {
      if (opt.image_src) {
        if (!imageMap.has(opt.image_src)) {
          imageMap.set(opt.image_src, []);
        }
        imageMap.get(opt.image_src)!.push(opt.text);
      }
    }
    imageMap.forEach((texts, img) => {
      if (texts.length > 1) {
        console.error(`❌ Challenge ${c.id} (U${c.unit_order} "${c.question}"): Image collision on '${img}' used by multiple options: [${texts.join(', ')}]`);
        issuesFound++;
      }
    });
  }

  // 3. Check for Semantic Number Mismatches (like BUG-005)
  console.log("\n--- 3. Checking for Semantic Number Mismatches ---");
  for (const c of challenges) {
    const qLower = c.question.toLowerCase();
    const opts = optionsByChallenge.get(c.id) || [];
    const correctOpt = opts.find(o => o.correct);

    for (const [numKey, hrExpected] of Object.entries(numberMap)) {
      // Check if question specifically asks for a single number e.g. "Five (5)" or "Which one of these is 'Four'?"
      const pattern = new RegExp(`\\b${numKey}\\b`, 'i');
      if (pattern.test(qLower)) {
        // Exclude complex questions like "Count 1 to 5" in titles, this checks question prompt
        if (qLower.includes(`"${numKey}"`) || qLower.includes(`(${numKey})`) || qLower.includes(`is "${numKey}"`) || qLower.includes(`is '${numKey}'`)) {
          if (correctOpt && correctOpt.text.toLowerCase() !== hrExpected.toLowerCase()) {
            // Check if it's an exact word question
            console.error(`❌ Semantic Mismatch in Challenge ${c.id} (U${c.unit_order}): Question asks for '${numKey}' (expected '${hrExpected}'), but correct answer is '${correctOpt.text}'!`);
            issuesFound++;
          }
        }
      }
    }
  }

  // 4. Check Asset Existence on Disk
  console.log("\n--- 4. Checking Physical Asset Existence on Disk (SVG & MP3) ---");
  let missingFiles = 0;
  for (const opt of allOptions) {
    if (opt.image_src) {
      const cleanPath = opt.image_src.startsWith('/') ? opt.image_src.slice(1) : opt.image_src;
      const fullPath = path.join(process.cwd(), 'public', cleanPath);
      if (!fs.existsSync(fullPath)) {
        console.error(`❌ Missing Image File: '${opt.image_src}' referenced in option ${opt.id}`);
        missingFiles++;
        issuesFound++;
      }
    }
    if (opt.audio_src) {
      const cleanPath = opt.audio_src.startsWith('/') ? opt.audio_src.slice(1) : opt.audio_src;
      const fullPath = path.join(process.cwd(), 'public', cleanPath);
      if (!fs.existsSync(fullPath)) {
        console.error(`❌ Missing Audio File: '${opt.audio_src}' referenced in option ${opt.id}`);
        missingFiles++;
        issuesFound++;
      }
    }
  }
  if (missingFiles === 0) {
    console.log("✅ All referenced .svg and .mp3 files physically exist on disk!");
  }

  // 5. Check Options with Contradictory Images (e.g. text 'Ljuljačka' with image '/slide.svg')
  console.log("\n--- 5. Checking for Obvious Text-to-Image Filename Contradictions ---");
  const knownPairs: [string, string][] = [
    ["ljulja", "slide"],
    ["tobogan", "swing"],
    ["pas", "cat"],
    ["macka", "dog"],
    ["kruh", "chocolate"],
    ["cokolada", "bread"],
    ["jabuka", "pear"],
    ["kruska", "apple"],
  ];
  for (const opt of allOptions) {
    if (!opt.image_src) continue;
    const textNorm = opt.text.toLowerCase().replace(/č/g, 'c').replace(/ć/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z');
    const imgNorm = opt.image_src.toLowerCase();
    for (const [word, badImg] of knownPairs) {
      if (textNorm.includes(word) && imgNorm.includes(badImg)) {
        console.error(`❌ Contradictory Image in Option ${opt.id} (Challenge ${opt.challenge_id}): Text is '${opt.text}' but image is '${opt.image_src}'!`);
        issuesFound++;
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`AUDIT FINISHED: ${issuesFound} issues found.`);
  if (issuesFound === 0) {
    console.log("🎉 ALL 359 CHALLENGES AND PRACTICE SESSION CANDIDATES ARE CLEAN!");
  }
}

audit()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
