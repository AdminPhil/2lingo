import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  console.log("Analyzing and fixing punctuation/casing asymmetries in challenge options...");

  const challenges = await sql`
    SELECT c.id, c.question, c.type, l.title as lesson, u.title as unit, u.order as unit_order
    FROM challenges c
    JOIN lessons l ON c.lesson_id = l.id
    JOIN units u ON l.unit_id = u.id
    WHERE u.course_id = 1
    ORDER BY u.order, l.order, c.order
  `;

  let fixedCount = 0;

  for (const c of challenges) {
    const options = await sql`SELECT id, text, correct FROM challenge_options WHERE challenge_id = ${c.id}`;
    
    // Check if options have mixed punctuation endings
    const endings = options.map((o: any) => {
      const trimmed = o.text.trim();
      const lastChar = trimmed[trimmed.length - 1];
      return ['!', '?', '.'].includes(lastChar) ? lastChar : 'none';
    });

    const uniqueEndings = new Set(endings);
    const startsUpper = options.map((o: any) => /^[A-ZČĆŠŽĐ]/.test(o.text.trim()));
    const uniqueStarts = new Set(startsUpper);

    if (uniqueEndings.size > 1 || uniqueStarts.size > 1) {
      // Standardize options:
      // If any ending is 'none', then all options in this challenge should strip trailing '!', '?', '.'
      // So no single option gives away the answer via punctuation!
      for (const o of options) {
        let newText = o.text.trim();

        // Capitalize first letter if lowercase
        if (newText.length > 0) {
          const firstChar = newText[0].toUpperCase();
          newText = firstChar + newText.slice(1);
        }

        // Strip trailing punctuation to make all options uniform
        if (uniqueEndings.size > 1) {
          newText = newText.replace(/[!?.]+$/, '').trim();
        }

        if (newText !== o.text) {
          await sql`
            UPDATE challenge_options 
            SET text = ${newText}
            WHERE id = ${o.id}
          `;
          fixedCount++;
        }
      }
    }
  }

  console.log(`Successfully updated ${fixedCount} challenge option texts in database!`);
}

main().catch((err) => {
  console.error("Fix script failed:", err);
  process.exit(1);
});
