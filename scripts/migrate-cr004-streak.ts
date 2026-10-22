import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  console.log("Migrating DB for CR-004: Adding streak and last_active_date to user_progress...");

  await sql`
    ALTER TABLE user_progress 
    ADD COLUMN IF NOT EXISTS streak integer DEFAULT 0 NOT NULL;
  `;

  await sql`
    ALTER TABLE user_progress 
    ADD COLUMN IF NOT EXISTS last_active_date text;
  `;

  const today = new Date().toISOString().split("T")[0];
  console.log(`Setting baseline streak for active learners for date ${today}...`);

  await sql`
    UPDATE user_progress 
    SET streak = 1, last_active_date = ${today}
    WHERE user_name IN ('Adriana', 'Vanessa', 'Silvia', 'silva456');
  `;

  const users = await sql`
    SELECT user_name, points, hearts, hearts_used, streak, last_active_date
    FROM user_progress
    ORDER BY points DESC
  `;

  console.log("Current user progress with streaks:");
  console.table(users);
}

main().catch(console.error);
