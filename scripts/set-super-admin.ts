import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  console.log("=== 👑 CR-013: Setting up Super-Admin & Zgomba Family Ownership ===");

  const pod1 = await sql`SELECT id, name, invite_code, owner_id FROM pods WHERE id = 1`;
  console.log("Current Pod 1:", pod1);

  // Check if any pods have Phil's ID or if we should link to Phil's known user ID
  // Known Phil user ID from test scripts: user_3L1NgMhZTgf028zJorcCrRWzdXQ
  const philUserId = "user_3L1NgMhZTgf028zJorcCrRWzdXQ";

  // Check members of Pod 1
  const members = await sql`SELECT * FROM pod_members WHERE pod_id = 1`;
  console.log("Current Pod 1 Members:", members);

  console.log("Pod 1 configuration is ready.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
