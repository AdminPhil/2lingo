import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  console.log("Migrating DB: Adding hearts_used column to user_progress...");
  
  await sql`
    ALTER TABLE user_progress 
    ADD COLUMN IF NOT EXISTS hearts_used integer DEFAULT 0 NOT NULL;
  `;

  console.log("Setting baseline hearts_used for active learners...");
  await sql`UPDATE user_progress SET hearts_used = 4 WHERE user_name = 'Adriana'`;
  await sql`UPDATE user_progress SET hearts_used = 7 WHERE user_name = 'Vanessa'`;
  await sql`UPDATE user_progress SET hearts_used = 15 WHERE user_name IN ('Silvia', 'silva456')`;

  const users = await sql`
    SELECT user_id, user_name, points, hearts, hearts_used 
    FROM user_progress 
    ORDER BY points DESC
  `;

  console.log("Active users with hearts_used:");
  console.table(users);
}

main().catch(console.error);
