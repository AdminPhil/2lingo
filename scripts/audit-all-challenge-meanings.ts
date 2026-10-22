import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

// Simple dictionary of common Croatian words to English to catch obvious mismatches
const dictionary: Record<string, string[]> = {
  "pas": ["dog"],
  "mačka": ["cat"],
  "macka": ["cat"],
  "riba": ["fish"],
  "ptica": ["bird"],
  "krava": ["cow"],
  "konj": ["horse"],
  "svinja": ["pig"],
  "patka": ["duck"],
  "jabuka": ["apple"],
  "banana": ["banana"],
  "sladoled": ["ice cream"],
  "čokolada": ["chocolate"],
  "cokolada": ["chocolate"],
  "kruh": ["bread"],
  "voda": ["water"],
  "mlijeko": ["milk"],
  "sok": ["juice"],
  "sir": ["cheese"],
  "glava": ["head"],
  "ruka": ["hand", "arm"],
  "noga": ["foot", "leg"],
  "oko": ["eye"],
  "uho": ["ear"],
  "nos": ["nose"],
  "usta": ["mouth"],
  "kosa": ["hair"],
  "crvena": ["red"],
  "plava": ["blue"],
  "žuta": ["yellow"],
  "zuta": ["yellow"],
  "zelena": ["green"],
  "crna": ["black"],
  "bijela": ["white"],
  "jedan": ["one", "1"],
  "dva": ["two", "2"],
  "tri": ["three", "3"],
  "četiri": ["four", "4"],
  "cetiri": ["four", "4"],
  "pet": ["five", "5"],
  "šest": ["six", "6"],
  "sest": ["six", "6"],
  "sedam": ["seven", "7"],
  "osam": ["eight", "8"],
  "devet": ["nine", "9"],
  "deset": ["ten", "10"],
  "kuća": ["house"],
  "kuca": ["house"],
  "soba": ["room"],
  "krevet": ["bed"],
  "stol": ["table"],
  "knjiga": ["book"],
  "prozor": ["window"],
  "vrata": ["door"],
  "igračka": ["toy"],
  "igracka": ["toy"],
  "lopta": ["ball"],
  "skoči": ["jump"],
  "skoci": ["jump"],
  "trči": ["run"],
  "trci": ["run"],
};

async function main() {
  console.log("Auditing question vs correct option meanings across all 359 challenges...");

  const challenges = await sql`
    SELECT c.id, c.question, c.order as challenge_order, c.type,
           l.order as lesson_order, l.title as lesson_title,
           u.order as unit_order, u.title as unit_title
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    ORDER BY u.order, l.order, c.order
  `;

  let mismatchCount = 0;

  for (const c of challenges) {
    const opts = await sql`SELECT id, text, correct FROM challenge_options WHERE challenge_id = ${c.id}`;
    const correctOpt = opts.find(o => o.correct);

    if (!correctOpt) {
      console.log(`[NO CORRECT OPTION] Unit ${c.unit_order} L${c.lesson_order} Ch ${c.challenge_order} (ID ${c.id})`);
      mismatchCount++;
      continue;
    }

    const qLower = c.question.toLowerCase().replace(/["'?!]/g, "").trim();
    const optLower = correctOpt.text.toLowerCase().replace(/["'?!]/g, "").trim();

    // Check single word matches against dictionary
    for (const [croatian, englishList] of Object.entries(dictionary)) {
      // If question asks for one of englishList
      const isQuestionForThis = englishList.some(eng => qLower === eng || qLower.includes(`is "${eng}"`) || qLower.includes(`is ${eng}`) || qLower === `which one of these is ${eng}`);
      if (isQuestionForThis) {
        if (!englishList.some(eng => optLower.includes(croatian) || croatian.includes(optLower))) {
          // If the correct option is completely different
          // Check if optLower doesn't match croatian
          if (optLower !== croatian) {
            console.log(`⚠️ MISMATCH DETECTED: Unit ${c.unit_order} L${c.lesson_order} Ch ${c.challenge_order} (ID ${c.id})`);
            console.log(`   Question: "${c.question}"`);
            console.log(`   Expected word matching: ${croatian} (for ${englishList.join('/')})`);
            console.log(`   Actual Correct Option: "${correctOpt.text}"`);
            console.log(`   Available options: ${opts.map(o => o.text).join(", ")}`);
            mismatchCount++;
          }
        }
      }
    }
  }

  console.log(`\nScan complete. Total potential mismatches flagged: ${mismatchCount}`);
}

main().catch(console.error);
