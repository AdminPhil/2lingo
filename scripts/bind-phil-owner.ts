import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

const PHIL_USER_ID = "user_3L6xcATMCXxWhB6ule3mHl5iz0h";

async function main() {
  console.log("=== 👑 Binding Phil (user_3L6xcATMCXxWhB6ule3mHl5iz0h) to Pod 1 ===");

  // 1. Update Pod 1 owner_id
  await sql`UPDATE pods SET owner_id = ${PHIL_USER_ID} WHERE id = 1`;
  console.log("✅ Pod 1 owner_id set to Phil's ID:", PHIL_USER_ID);

  // 2. Check pod_members for Phil
  const existingMember = await sql`
    SELECT * FROM pod_members WHERE pod_id = 1 AND user_id = ${PHIL_USER_ID}
  `;

  if (existingMember.length === 0) {
    await sql`
      INSERT INTO pod_members (pod_id, user_id, role, joined_at)
      VALUES (1, ${PHIL_USER_ID}, 'owner', NOW())
    `;
    console.log("✅ Added Phil to pod_members as owner");
  } else {
    await sql`
      UPDATE pod_members SET role = 'owner' WHERE pod_id = 1 AND user_id = ${PHIL_USER_ID}
    `;
    console.log("✅ Updated Phil's role to owner in pod_members");
  }

  // 3. Verify Pod 1
  const pod = await sql`SELECT id, name, invite_code, owner_id FROM pods WHERE id = 1`;
  const members = await sql`SELECT * FROM pod_members WHERE pod_id = 1`;
  console.log("Pod 1:", pod);
  console.log("Members:", members);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
