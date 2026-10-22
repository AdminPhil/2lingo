import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const dbUrl = (process.env.DATABASE_URL || "").replace(/['"]/g, "");
const sql = neon(dbUrl);

async function main() {
  console.log("=== 🚀 CR-006: Migrating Pod Celebration Meter Columns ===");

  await sql`
    ALTER TABLE pods
    ADD COLUMN IF NOT EXISTS current_xp INTEGER DEFAULT 0 NOT NULL,
    ADD COLUMN IF NOT EXISTS celebration_unlocked BOOLEAN DEFAULT FALSE NOT NULL,
    ADD COLUMN IF NOT EXISTS week_number INTEGER DEFAULT 1 NOT NULL;
  `;
  console.log("✅ pods table updated with celebration columns");

  // Set default Zubac Family current_xp to 740 / 1000 XP
  await sql`
    UPDATE pods
    SET current_xp = 740, target_xp = 1000, celebration_unlocked = FALSE
    WHERE id = 1;
  `;
  console.log("✅ Set Pod 1 ('Zubac Family') progress to 740 / 1000 XP");

  const pods = await sql`SELECT id, name, invite_code, current_xp, target_xp, celebration_unlocked FROM pods WHERE id = 1`;
  console.log("Pod 1 State:", pods);
}

main()
  .then(() => {
    console.log("CR-006 Migration Complete!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  });
