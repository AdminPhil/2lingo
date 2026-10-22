import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const dbUrl = (process.env.DATABASE_URL || "").replace(/['"]/g, "");
const sql = neon(dbUrl);

async function main() {
  console.log("=== 🛠️ BUG FIX: Renaming Family Pod to 'Zgomba Family' ===");

  await sql`
    UPDATE pods
    SET name = 'Zgomba Family', invite_code = 'ZGOMBA'
    WHERE id = 1;
  `;
  console.log("✅ Updated Pod 1 to name: 'Zgomba Family', invite_code: 'ZGOMBA'");

  const pod = await sql`SELECT id, name, invite_code, current_xp, target_xp FROM pods WHERE id = 1`;
  console.log("Updated Pod:", pod);
}

main()
  .then(() => {
    console.log("Fix complete!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Fix failed:", e);
    process.exit(1);
  });
