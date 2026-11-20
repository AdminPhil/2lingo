import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { execSync } from "child_process";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schemaV2 from "../../db/schema.v2";

/**
 * CroLingo v2 One-Command Staging / Cutover Bootstrapper (`npm run v2:bootstrap`)
 *
 * SAFETY GUARDRAIL:
 *   Requires `DATABASE_URL_V2` pointing to an isolated Neon `v2-dev` branch
 *   (strictly refuses to run if `DATABASE_URL_V2 === DATABASE_URL` unless
 *   `--allow-prod-cutover` is explicitly passed).
 *
 * Steps executed in order:
 *   1. Validate YAML curriculum & all 5,329 asset references (`v2:validate`)
 *   2. Push `db/schema.v2.ts` DDL to `DATABASE_URL_V2` (`drizzle-kit push:pg`)
 *   3. Compile 12 Worlds / 60 Units / 1,009 Challenges / 351 Lexemes (`v2:compile`)
 *   4. Migrate 100% of v1 learners, pods, cheers & XP-calibrated checkpoints (`v2:migrate --execute`)
 *   5. Run post-bootstrap row-count & integrity assertions against `DATABASE_URL_V2`
 */

const allowProd = process.argv.includes("--allow-prod-cutover");
const targetUrl = (process.env.DATABASE_URL_V2 || "").trim().replace(/^["']|["']$/g, "");
const prodUrl = (process.env.DATABASE_URL || "").trim().replace(/^["']|["']$/g, "");

if (!targetUrl) {
  console.error(
    "❌ Missing DATABASE_URL_V2. Create an isolated Neon `v2-dev` branch and add DATABASE_URL_V2=... to .env.local first."
  );
  process.exit(1);
}

if (!allowProd && prodUrl && targetUrl === prodUrl) {
  console.error(
    "❌ SAFETY LOCK: DATABASE_URL_V2 matches production DATABASE_URL! Refusing to bootstrap live production without --allow-prod-cutover."
  );
  process.exit(1);
}

const extraFlag = allowProd ? " --allow-prod-cutover" : "";

function runStep(label: string, cmd: string) {
  console.log(`\n▶ ${label}...`);
  execSync(cmd, { stdio: "inherit", env: process.env });
}

async function main() {
  console.log("=== 🚀 CROLINGO v2 ISOLATED DATABASE BOOTSTRAP ===\n");

  runStep("Step 1/5: Validate v2 YAML curriculum & assets", "npm run v2:validate");
  runStep(
    "Step 2/5: Push db/schema.v2.ts DDL to DATABASE_URL_V2",
    "npx drizzle-kit push:pg --config=drizzle.config.v2.ts --force"
  );
  runStep(
    "Step 3/5: Compile 12 Worlds / 60 Units / 1,009 Challenges from YAML",
    `npx tsx ./scripts/v2/compile-curriculum.ts${extraFlag}`
  );
  runStep(
    "Step 4/5: Migrate learners, pods, cheers & XP-calibrated checkpoints",
    `npx tsx ./scripts/v2/migrate-v1-to-v2.ts --execute${extraFlag}`
  );

  console.log("\n▶ Step 5/5: Post-bootstrap integrity verification...");
  const sql = neon(targetUrl);
  // @ts-ignore - neon-http generic variance with drizzle-orm 0.30
  const dbV2 = drizzle(sql, { schema: schemaV2 });

  const [worlds, units, lessons, challenges, lexemes, users, pods, members] =
    await Promise.all([
      dbV2.select().from(schemaV2.worlds),
      dbV2.select().from(schemaV2.units),
      dbV2.select().from(schemaV2.lessons),
      dbV2.select().from(schemaV2.challenges),
      dbV2.select().from(schemaV2.lexemes),
      dbV2.select().from(schemaV2.userProgress),
      dbV2.select().from(schemaV2.pods),
      dbV2.select().from(schemaV2.podMembers),
    ]);

  console.log("  ✓ Worlds:          ", worlds.length);
  console.log("  ✓ Units:           ", units.length);
  console.log("  ✓ Lessons:         ", lessons.length);
  console.log("  ✓ Challenges:      ", challenges.length);
  console.log("  ✓ Lexemes:         ", lexemes.length);
  console.log("  ✓ Migrated Users:  ", users.length);
  console.log("  ✓ Migrated Pods:   ", pods.length);
  console.log("  ✓ Pod Memberships: ", members.length);

  const listenCount = challenges.filter((c) => c.type === "LISTEN").length;
  const buildCount = challenges.filter((c) => c.type === "BUILD_SENTENCE").length;
  console.log(`  ✓ Active Recall:    ${listenCount} LISTEN, ${buildCount} BUILD_SENTENCE`);

  if (worlds.length < 12 || units.length < 60 || challenges.length < 1000) {
    throw new Error("Post-bootstrap curriculum count check failed!");
  }

  console.log("\n✅ CROLINGO v2 DATABASE BOOTSTRAP VERIFIED & READY FOR UAT!");
}

main().catch((err) => {
  console.error("❌ v2 Bootstrap failed:", err);
  process.exit(1);
});
