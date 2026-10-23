import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  console.log("=== 🛠️ RESOLVING VISUAL COLLISIONS IN CURRICULUM & PRACTICE ===");

  // 1. Challenge 1: Molim -> /heart.svg
  await sql`UPDATE challenge_options SET image_src = '/heart.svg' WHERE id = 5119 AND challenge_id = 1`;
  
  // 2. Challenge 3: Molim -> /heart.svg
  await sql`UPDATE challenge_options SET image_src = '/heart.svg' WHERE id = 5127 AND challenge_id = 3`;

  // 3. Challenge 13: Baka -> /grandma.svg
  await sql`UPDATE challenge_options SET image_src = '/grandma.svg' WHERE id = 5190 AND challenge_id = 13`;

  // 4. Challenge 14: Djed -> /grandpa.svg
  await sql`UPDATE challenge_options SET image_src = '/grandpa.svg' WHERE id = 5194 AND challenge_id = 14`;

  console.log("✅ Database image references updated!");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
