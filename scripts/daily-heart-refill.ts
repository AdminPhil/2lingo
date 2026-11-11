import "dotenv/config";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { inArray } from "drizzle-orm";

import * as schema from "../db/schema";
import { evaluateDailyHeartRefill } from "../lib/heart-refill";

// Sanitize connection string from environment (stripping surrounding quotes or accidental whitespace)
const rawUrl = process.env.DATABASE_URL || "";
const cleanUrl = rawUrl.trim().replace(/^["']|["']$/g, "");

if (!cleanUrl) {
  console.error("❌ Fatal: DATABASE_URL environment variable is missing or empty.");
  process.exit(1);
}

const sql = neon(cleanUrl);
// @ts-ignore
const db = drizzle(sql, { schema });

/**
 * Resilient retry wrapper with exponential backoff for serverless cold-start protection.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 2500,
  operationName = "Database operation"
): Promise<T> {
  let lastError: any;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      console.warn(
        `⚠️ [Attempt ${attempt}/${retries}] ${operationName} failed: ${err.message || err}`
      );
      if (attempt < retries) {
        const backoff = delayMs * attempt;
        console.log(`  Waiting ${backoff}ms before retrying...`);
        await new Promise((res) => setTimeout(res, backoff));
      }
    }
  }
  throw new Error(
    `${operationName} failed after ${retries} attempts: ${lastError?.message || lastError}`
  );
}

async function main() {
  const startTime = Date.now();
  console.log("=== 🌙 CROLINGO OVERNIGHT DAILY HEART TOP-UP (CR-062 / BUG-042) ===");

  const today = new Date().toISOString().split("T")[0];
  console.log(`Target Date: ${today}`);

  // 1. Pre-flight connection warmup (wakes up suspended Neon serverless compute)
  console.log("Warming up Neon serverless database connection...");
  await withRetry(
    async () => {
      await sql`SELECT 1 as ping;`;
    },
    3,
    3000,
    "Neon Serverless Connection Warmup"
  );
  console.log("✅ Neon database connection active.");

  // 2. Fetch all learners with retry protection
  console.log("Querying learner records...");
  const allLearners = await withRetry(
    async () => {
      return await db.query.userProgress.findMany();
    },
    3,
    2500,
    "Fetch User Progress Records"
  );

  const toTopUp: Array<{ userId: string; userName: string; oldHearts: number; newHearts: number }> = [];
  const toStamp: Array<{ userId: string; userName: string }> = [];
  let alreadyCurrentCount = 0;

  for (const learner of allLearners) {
    const result = evaluateDailyHeartRefill(
      learner.hearts,
      learner.lastHeartRefillDate,
      today
    );

    if (result.shouldUpdate) {
      if (result.wasToppedUp) {
        toTopUp.push({
          userId: learner.userId,
          userName: learner.userName,
          oldHearts: learner.hearts,
          newHearts: result.hearts,
        });
      } else {
        toStamp.push({
          userId: learner.userId,
          userName: learner.userName,
        });
      }
    } else {
      alreadyCurrentCount++;
    }
  }

  // 3. Perform batched updates instead of N sequential HTTP roundtrips
  if (toTopUp.length > 0) {
    const topUpIds = toTopUp.map((l) => l.userId);
    console.log(`Refilling ${topUpIds.length} learner(s) to 5 hearts...`);
    await withRetry(
      async () => {
        await db
          .update(schema.userProgress)
          .set({
            hearts: 5,
            lastHeartRefillDate: today,
          })
          .where(inArray(schema.userProgress.userId, topUpIds));
      },
      3,
      2500,
      "Batch Refill Depleted Hearts"
    );

    for (const l of toTopUp) {
      console.log(`  ❤️ Topped up ${l.userName}: ${l.oldHearts} -> ${l.newHearts} hearts`);
    }
  }

  if (toStamp.length > 0) {
    const stampIds = toStamp.map((l) => l.userId);
    console.log(`Stamping ${stampIds.length} learner(s) already at 5/5+ hearts...`);
    await withRetry(
      async () => {
        await db
          .update(schema.userProgress)
          .set({
            lastHeartRefillDate: today,
          })
          .where(inArray(schema.userProgress.userId, stampIds));
      },
      3,
      2500,
      "Batch Stamp Current Learners"
    );
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log("---------------------------------------------------------");
  console.log(`Total Learners Evaluated : ${allLearners.length}`);
  console.log(`Learners Topped Up to 5  : ${toTopUp.length}`);
  console.log(`Learners Stamped (5/5+)  : ${toStamp.length}`);
  console.log(`Already Current Today    : ${alreadyCurrentCount}`);
  console.log(`Execution Duration       : ${durationSec}s`);
  console.log("✅ Daily overnight heart top-up complete!");
}

main().catch((err) => {
  console.error("❌ Fatal error during daily heart top-up:", err);
  process.exit(1);
});
