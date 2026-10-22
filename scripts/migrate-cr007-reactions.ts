import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const dbUrl = (process.env.DATABASE_URL || "").replace(/['"]/g, "");
const sql = neon(dbUrl);

async function main() {
  console.log("=== 🚀 CR-007: Migrating Pod Reactions Table ===");

  await sql`
    CREATE TABLE IF NOT EXISTS pod_reactions (
      id SERIAL PRIMARY KEY,
      pod_id INTEGER REFERENCES pods(id) ON DELETE CASCADE,
      sender_id TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'high_five',
      seen BOOLEAN DEFAULT FALSE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;
  console.log("✅ pod_reactions table created/verified");

  const tableInfo = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'pod_reactions';
  `;
  console.log("Columns:", tableInfo);
}

main()
  .then(() => {
    console.log("CR-007 Migration Complete!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  });
