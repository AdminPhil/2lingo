import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function inspectOptions() {
  const challenges = await sql`
    SELECT c.id, c.question, c.type, l.title as lesson, u.title as unit, u.order as unit_order
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE u.course_id = 1
    ORDER BY u.order, l.order, c.order
  `;

  let issuesFound = 0;

  for (const c of challenges) {
    const options = await sql`SELECT id, text, correct FROM challenge_options WHERE challenge_id = ${c.id}`;
    
    // Check if options have mixed punctuation endings (e.g. some have !, some don't; some have ?, some don't; some have ., some don't)
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
      issuesFound++;
      console.log(`Issue in Unit ${c.unit_order} (${c.lesson}) - Question: "${c.question}"`);
      console.log('Options:', options.map((o: any) => `"${o.text}" (correct: ${o.correct})`));
      console.log('Endings:', Array.from(uniqueEndings), 'Starts:', Array.from(uniqueStarts));
      console.log('---');
    }
  }

  console.log('Total challenges with asymmetry issues:', issuesFound);
}

inspectOptions();
