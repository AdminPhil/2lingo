import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  const users = await sql`
    SELECT user_id, user_name, user_image_src, points, hearts_used
    FROM user_progress
    WHERE user_name IN ('Adriana', 'Vanessa', 'Silvia', 'silva456')
    ORDER BY points DESC
    LIMIT 10
  `;

  console.log("Leaderboard rows with hearts_used:");
  for (const u of users) {
    console.log(`- ${u.user_name}: ${u.points} XP | 💔 ${u.hearts_used} hearts used`);
  }
}

main().catch(console.error);
