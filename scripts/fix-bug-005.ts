import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  console.log("=== 🛠️ FIXING BUG-005: Challenge 43 ('Five (5)') ===");

  await sql`
    UPDATE challenge_options 
    SET correct = false 
    WHERE id = 2680 AND challenge_id = 43 AND text = 'Četiri'
  `;

  await sql`
    UPDATE challenge_options 
    SET correct = true 
    WHERE id = 2681 AND challenge_id = 43 AND text = 'Pet'
  `;

  const updatedOptions = await sql`
    SELECT id, text, correct, audio_src 
    FROM challenge_options 
    WHERE challenge_id = 43
    ORDER BY id
  `;

  console.log("Updated options for Challenge 43:", updatedOptions);

  const correctCount = updatedOptions.filter(o => o.correct).length;
  const correctOption = updatedOptions.find(o => o.correct);

  if (correctCount === 1 && correctOption?.text === 'Pet') {
    console.log("✅ BUG-005 FIXED: 'Pet' is now the single correct option for 'Five (5)'!");
  } else {
    throw new Error(`Verification failed! Correct options: ${correctCount}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
