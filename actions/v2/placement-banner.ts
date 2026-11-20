"use server";

import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

import * as schemaV2 from "@/db/schema.v2";

/**
 * Persists dismissal of the 1-time CroLingo v2 Welcome & Placement Banner
 * (`user_progress.v2_placement_banner_seen = true`) on v2 databases.
 */
export async function dismissV2PlacementBanner(): Promise<{ success: boolean }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false };
  }

  const dbUrl = (process.env.DATABASE_URL_V2 || process.env.DATABASE_URL || "")
    .trim()
    .replace(/^["']|["']$/g, "");
  if (!dbUrl || dbUrl.includes("placeholder@localhost")) {
    return { success: true };
  }

  try {
    const sql = neon(dbUrl);
    // @ts-ignore - neon-http generic variance with drizzle-orm 0.30
    const dbV2 = drizzle(sql, { schema: schemaV2 });

    await dbV2
      .update(schemaV2.userProgress)
      .set({ v2PlacementBannerSeen: true })
      .where(eq(schemaV2.userProgress.userId, userId));

    return { success: true };
  } catch {
    // Graceful fallback if column doesn't exist yet on pre-cutover v1 DB
    return { success: true };
  }
}
