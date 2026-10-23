import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  await sql`DELETE FROM user_progress WHERE user_id = 'user_3L6xcATMCXxWhB6ule3mHl5iz0h'`;
  console.log("Removed Phil from student user_progress table");

  const users = await sql`SELECT user_id, user_name, points FROM user_progress`;
  console.log("Current active learners:", users);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
