import "dotenv/config";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

import * as schema from "../db/schema";
import { evaluateDailyHeartRefill } from "../lib/heart-refill";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

async function main() {
  console.log("=== 🌙 CROLINGO OVERNIGHT DAILY HEART TOP-UP (CR-062) ===");

  // 1. Ensure non-destructive schema column exists on Neon DB
  await sql`ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS last_heart_refill_date text;`;

  const today = new Date().toISOString().split("T")[0];
  console.log(`Target Date: ${today}`);

  const allLearners = await db.query.userProgress.findMany();
  let toppedUpCount = 0;
  let stampedCount = 0;
  let alreadyCurrentCount = 0;

  for (const learner of allLearners) {
    const result = evaluateDailyHeartRefill(
      learner.hearts,
      learner.lastHeartRefillDate,
      today
    );

    if (result.shouldUpdate) {
      await db
        .update(schema.userProgress)
        .set({
          hearts: result.hearts,
          lastHeartRefillDate: result.lastHeartRefillDate,
        })
        .where(eq(schema.userProgress.userId, learner.userId));

      if (result.wasToppedUp) {
        toppedUpCount++;
        console.log(
          `  ❤️ Topped up ${learner.userName}: ${learner.hearts} -> ${result.hearts} hearts`
        );
      } else {
        stampedCount++;
      }
    } else {
      alreadyCurrentCount++;
    }
  }

  console.log("---------------------------------------------------------");
  console.log(`Total Learners Evaluated : ${allLearners.length}`);
  console.log(`Learners Topped Up to 5  : ${toppedUpCount}`);
  console.log(`Learners Stamped (5/5+)  : ${stampedCount}`);
  console.log(`Already Current Today    : ${alreadyCurrentCount}`);
  console.log("✅ Daily overnight heart top-up complete!");
}

main().catch((err) => {
  console.error("❌ Error during daily heart top-up:", err);
  process.exit(1);
});
