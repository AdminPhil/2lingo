import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const dbUrl = (process.env.DATABASE_URL || "").replace(/['"]/g, "");
const sql = neon(dbUrl);

async function main() {
  console.log("=== 🚀 CR-005: Migrating Pods & Pod Members ===");

  // 1. Create pods table
  await sql`
    CREATE TABLE IF NOT EXISTS pods (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'family',
      invite_code TEXT NOT NULL UNIQUE,
      owner_id TEXT NOT NULL,
      target_xp INTEGER DEFAULT 1000,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;
  console.log("✅ pods table created/verified");

  // 2. Create pod_members table
  await sql`
    CREATE TABLE IF NOT EXISTS pod_members (
      id SERIAL PRIMARY KEY,
      pod_id INTEGER NOT NULL REFERENCES pods(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      UNIQUE(pod_id, user_id)
    );
  `;
  console.log("✅ pod_members table created/verified");

  // 3. Seed initial default Pod: "Zubac Family" (Invite Code: ZUBAC6)
  const existingPod = await sql`SELECT id, name, invite_code FROM pods WHERE invite_code = 'ZUBAC6'`;
  let podId: number;

  if (existingPod.length === 0) {
    const inserted = await sql`
      INSERT INTO pods (name, type, invite_code, owner_id, target_xp)
      VALUES ('Zubac Family', 'family', 'ZUBAC6', 'user_3L0PFYY5TsRhaaJD2PYJ5NLSuMw', 1000)
      RETURNING id, name, invite_code
    `;
    podId = inserted[0].id;
    console.log(`✅ Created default pod: "${inserted[0].name}" (ID: ${podId}, Code: ${inserted[0].invite_code})`);
  } else {
    podId = existingPod[0].id;
    console.log(`ℹ️ Default pod already exists: "${existingPod[0].name}" (ID: ${podId})`);
  }

  // 4. Enroll active learners (Adriana, Vanessa, Silvia)
  const learners = [
    { userId: "user_3L0PFYY5TsRhaaJD2PYJ5NLSuMw", role: "admin", name: "Adriana" },
    { userId: "user_3L0OtO5oi4GG9tseE9oWY1qR3Ej", role: "member", name: "Vanessa" },
    { userId: "user_3L1otvWOnNRhiXKqfxohNiGPRvX", role: "member", name: "Silvia" },
  ];

  for (const learner of learners) {
    const exists = await sql`
      SELECT id FROM pod_members WHERE pod_id = ${podId} AND user_id = ${learner.userId}
    `;
    if (exists.length === 0) {
      await sql`
        INSERT INTO pod_members (pod_id, user_id, role)
        VALUES (${podId}, ${learner.userId}, ${learner.role})
      `;
      console.log(`✅ Enrolled ${learner.name} (${learner.role}) into Pod ID ${podId}`);
    } else {
      console.log(`ℹ️ ${learner.name} is already a member of Pod ID ${podId}`);
    }
  }

  // 5. Query and print current pod status
  const members = await sql`
    SELECT pm.id, pm.role, pm.user_id, up.user_name, up.points, up.streak, up.hearts_used
    FROM pod_members pm
    LEFT JOIN user_progress up ON pm.user_id = up.user_id
    WHERE pm.pod_id = ${podId}
    ORDER BY up.points DESC
  `;
  console.log("\n=== 👥 Current Members in Zubac Family Pod ===");
  console.log(members);
}

main()
  .then(() => {
    console.log("Migration complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
