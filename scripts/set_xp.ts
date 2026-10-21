import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL || "");
// @ts-ignore
const db = drizzle(sql, { schema });

async function setPoints(points: number) {
  const users = await db.query.userProgress.findMany();
  if (users.length === 0) {
    console.log("No user found.");
    return;
  }
  for (const user of users) {
    await db.update(schema.userProgress).set({
      points: points,
    }).where(eq(schema.userProgress.userId, user.userId));
    console.log(`Updated user ${user.userName} (${user.userId}) points to ${points} XP`);
  }
}

const targetPoints = parseInt(process.argv[2] || "100", 10);
setPoints(targetPoints);
