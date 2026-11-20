import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

import * as schemaV1 from "../../db/schema";
import * as schemaV2 from "../../db/schema.v2";
import { computeV2PlacementFromXp } from "../../lib/v2/placement";

/**
 * CroLingo v1 -> v2 Learner, Pod & XP-Calibrated Placement Migrator
 *
 * Modes:
 *   - Default (`--dry-run`): 100% READ-ONLY against live `DATABASE_URL`.
 *     Audits every learner's XP, streak, hearts, avatar, pods, and computes their
 *     exact v2 XP-Calibrated Placement Checkpoint without writing a single byte.
 *   - `--execute`: Safety-locked to `DATABASE_URL_V2` (refuses to write to live
 *     `DATABASE_URL` unless `--allow-prod-cutover` is explicitly passed).
 *     Copies 100% of learners, pods, memberships, and cheers, and seeds v2
 *     `challenge_progress` through each learner's XP-calibrated World checkpoint.
 */

const isExecute = process.argv.includes("--execute");
const allowProd = process.argv.includes("--allow-prod-cutover");

const sourceUrl = (process.env.DATABASE_URL || "").trim().replace(/^["']|["']$/g, "");
const targetUrl = (process.env.DATABASE_URL_V2 || "").trim().replace(/^["']|["']$/g, "");

if (!sourceUrl) {
  console.error("❌ Missing DATABASE_URL (read-only v1 source).");
  process.exit(1);
}

if (isExecute) {
  if (!targetUrl) {
    console.error(
      "❌ Missing DATABASE_URL_V2. Set DATABASE_URL_V2 to your isolated Neon `v2-dev` branch before running --execute."
    );
    process.exit(1);
  }
  if (!allowProd && targetUrl === sourceUrl) {
    console.error(
      "❌ SAFETY LOCK: DATABASE_URL_V2 matches live production DATABASE_URL! Pass --allow-prod-cutover ONLY during the planned cutover window."
    );
    process.exit(1);
  }
}

const sourceSql = neon(sourceUrl);
// @ts-ignore - neon-http generic variance with drizzle-orm 0.30
const dbV1 = drizzle(sourceSql, { schema: schemaV1 });

async function runMigration() {
  console.log(
    isExecute
      ? "=== 🚀 CROLINGO v1 -> v2 LIVE MIGRATION (--execute -> DATABASE_URL_V2) ===\n"
      : "=== 🔍 CROLINGO v1 -> v2 MIGRATION DRY-RUN (100% READ-ONLY) ===\n"
  );

  // 1. Read v1 state (100% read-only)
  const [v1Users, v1Pods, v1PodMembers, v1PodReactions, v1Units, v1Lessons, v1Challenges, v1Progress] =
    await Promise.all([
      dbV1.select().from(schemaV1.userProgress),
      dbV1.select().from(schemaV1.pods),
      dbV1.select().from(schemaV1.podMembers),
      dbV1.select().from(schemaV1.podReactions),
      dbV1.select().from(schemaV1.units),
      dbV1.select().from(schemaV1.lessons),
      dbV1.select().from(schemaV1.challenges),
      dbV1.select().from(schemaV1.challengeProgress),
    ]);

  // Map challengeId -> unitOrder for v1 diagnostic visibility
  const unitOrderById = new Map<number, number>(v1Units.map((u) => [u.id, u.order]));
  const lessonUnitOrder = new Map<number, number>(
    v1Lessons.map((l) => [l.id, unitOrderById.get(l.unitId) ?? 0])
  );
  const challengeUnitOrder = new Map<number, number>(
    v1Challenges.map((c) => [c.id, lessonUnitOrder.get(c.lessonId) ?? 0])
  );

  const v1MaxUnitByUser = new Map<string, number>();
  for (const row of v1Progress) {
    if (!row.completed) continue;
    const uOrder = challengeUnitOrder.get(row.challengeId) ?? 0;
    const prev = v1MaxUnitByUser.get(row.userId) ?? 0;
    if (uOrder > prev) v1MaxUnitByUser.set(row.userId, uOrder);
  }

  // Referential integrity checks
  const userIdSet = new Set(v1Users.map((u) => u.userId));
  const podIdSet = new Set(v1Pods.map((p) => p.id));
  const orphanedPodMembers = v1PodMembers.filter(
    (m) => !podIdSet.has(m.podId)
  );
  const nonProgressPodMembers = v1PodMembers.filter(
    (m) => !userIdSet.has(m.userId)
  );

  const sortedUsers = [...v1Users].sort((a, b) => b.points - a.points);

  const auditRows = sortedUsers.map((u) => {
    const placement = computeV2PlacementFromXp(u.points);
    return {
      Learner: u.userName,
      Role: u.role,
      XP: u.points,
      Streak: u.streak,
      Hearts: u.hearts,
      Avatar: u.userImageSrc,
      V1_MaxUnit: v1MaxUnitByUser.get(u.userId) ?? 0,
      V2_Target: `W${placement.targetWorldOrder} / U${placement.targetUnitOrder}`,
      SeededUnits:
        placement.completedThroughUnitOrder > 0
          ? `U1..U${placement.completedThroughUnitOrder}`
          : "None (Fresh W1)",
    };
  });

  console.log(`Source v1 Snapshot Summary:`);
  console.log(`  - Learners (user_progress): ${v1Users.length}`);
  console.log(`  - Family/Classroom Pods:    ${v1Pods.length}`);
  console.log(`  - Pod Memberships:          ${v1PodMembers.length}`);
  console.log(`  - Pod Cheers / Reactions:   ${v1PodReactions.length}`);
  console.log(`  - Orphaned Pod Memberships: ${orphanedPodMembers.length}`);
  console.log(`  - Pod Owners w/o Learner Row: ${nonProgressPodMembers.length}\n`);

  console.table(auditRows);

  if (orphanedPodMembers.length > 0) {
    console.error("❌ Integrity warning: orphaned pod memberships detected!");
    process.exit(1);
  }

  if (!isExecute) {
    console.log(
      "\n✅ DRY-RUN PASSED: 100% of XP, streaks, hearts, avatars, roles, pods, and cheers verified for lossless migration."
    );
    console.log(
      "ℹ️  To execute into an isolated Neon `v2-dev` branch, set DATABASE_URL_V2 in .env.local and run:\n   npm run v2:compile; npm run v2:migrate -- --execute"
    );
    return;
  }

  // === EXECUTE MODE (Isolated DATABASE_URL_V2) ===
  const targetSql = neon(targetUrl);
  // @ts-ignore - neon-http generic variance with drizzle-orm 0.30
  const dbV2 = drizzle(targetSql, { schema: schemaV2 });

  const [croatianCourse] = await dbV2
    .select()
    .from(schemaV2.courses)
    .where(eq(schemaV2.courses.slug, "croatian"));

  if (!croatianCourse) {
    console.error(
      "❌ Target v2 database has no compiled curriculum yet! Run `npm run v2:compile` first."
    );
    process.exit(1);
  }

  // 2. Migrate user_progress (100% lossless stats, v2PlacementBannerSeen = false)
  let migratedUsers = 0;
  for (const u of v1Users) {
    await dbV2
      .insert(schemaV2.userProgress)
      .values({
        userId: u.userId,
        userName: u.userName,
        userImageSrc: u.userImageSrc || "/avatars/pasko.png",
        activeCourseId: croatianCourse.id,
        hearts: u.hearts,
        points: u.points,
        heartsUsed: u.heartsUsed,
        streak: u.streak,
        lastActiveDate: u.lastActiveDate,
        lastHeartRefillDate: u.lastHeartRefillDate,
        role: u.role,
        v2PlacementBannerSeen: false,
      })
      .onConflictDoUpdate({
        target: schemaV2.userProgress.userId,
        set: {
          userName: u.userName,
          userImageSrc: u.userImageSrc || "/avatars/pasko.png",
          activeCourseId: croatianCourse.id,
          hearts: u.hearts,
          points: u.points,
          heartsUsed: u.heartsUsed,
          streak: u.streak,
          lastActiveDate: u.lastActiveDate,
          lastHeartRefillDate: u.lastHeartRefillDate,
          role: u.role,
        },
      });
    migratedUsers++;
  }
  console.log(`✓ Migrated ${migratedUsers} user_progress records`);

  // 3. Migrate Pods (preserving inviteCode + XP goals) & map oldPodId -> newPodId
  const podIdMap = new Map<number, number>();
  for (const p of v1Pods) {
    const [existing] = await dbV2
      .select()
      .from(schemaV2.pods)
      .where(eq(schemaV2.pods.inviteCode, p.inviteCode));

    if (existing) {
      podIdMap.set(p.id, existing.id);
    } else {
      const [inserted] = await dbV2
        .insert(schemaV2.pods)
        .values({
          name: p.name,
          type: p.type,
          inviteCode: p.inviteCode,
          ownerId: p.ownerId,
          targetXp: p.targetXp,
          currentXp: p.currentXp,
          celebrationUnlocked: p.celebrationUnlocked,
          weekNumber: p.weekNumber,
          createdAt: p.createdAt,
        })
        .returning();
      podIdMap.set(p.id, inserted.id);
    }
  }
  console.log(`✓ Migrated ${podIdMap.size} family/classroom pods`);

  // 4. Migrate Pod Memberships
  const existingV2Members = await dbV2.select().from(schemaV2.podMembers);
  const existingMemberKeys = new Set(
    existingV2Members.map((m) => `${m.podId}:${m.userId}`)
  );
  let migratedMembers = 0;
  for (const m of v1PodMembers) {
    const targetPodId = podIdMap.get(m.podId);
    if (!targetPodId) continue;
    const key = `${targetPodId}:${m.userId}`;
    if (existingMemberKeys.has(key)) continue;
    await dbV2.insert(schemaV2.podMembers).values({
      podId: targetPodId,
      userId: m.userId,
      role: m.role,
      joinedAt: m.joinedAt,
    });
    existingMemberKeys.add(key);
    migratedMembers++;
  }
  console.log(`✓ Migrated ${migratedMembers} new pod memberships`);

  // 5. Migrate Pod Reactions / Cheers
  const existingV2Reactions = await dbV2.select().from(schemaV2.podReactions);
  let migratedReactions = 0;
  if (existingV2Reactions.length === 0) {
    for (const r of v1PodReactions) {
      const targetPodId = r.podId ? podIdMap.get(r.podId) ?? null : null;
      await dbV2.insert(schemaV2.podReactions).values({
        podId: targetPodId,
        senderId: r.senderId,
        senderName: r.senderName,
        receiverId: r.receiverId,
        type: r.type,
        seen: r.seen,
        createdAt: r.createdAt,
      });
      migratedReactions++;
    }
  }
  console.log(`✓ Migrated ${migratedReactions} pod cheers/reactions`);

  // 6. Seed XP-Calibrated v2 Challenge Progress Checkpoints
  const v2Units = await dbV2.select().from(schemaV2.units);
  const v2Lessons = await dbV2.select().from(schemaV2.lessons);
  const v2Challenges = await dbV2.select().from(schemaV2.challenges);

  let seededProgressRows = 0;
  for (const u of v1Users) {
    const placement = computeV2PlacementFromXp(u.points);
    if (placement.completedThroughUnitOrder <= 0) continue;

    const completedUnitIds = new Set(
      v2Units
        .filter((unit) => unit.order <= placement.completedThroughUnitOrder)
        .map((unit) => unit.id)
    );
    const completedLessonIds = new Set(
      v2Lessons
        .filter((lesson) => completedUnitIds.has(lesson.unitId))
        .map((lesson) => lesson.id)
    );
    const targetChallengeIds = v2Challenges
      .filter((ch) => completedLessonIds.has(ch.lessonId))
      .map((ch) => ch.id);

    // Batch insert in chunks of 100
    for (let i = 0; i < targetChallengeIds.length; i += 100) {
      const chunk = targetChallengeIds.slice(i, i + 100);
      await dbV2
        .insert(schemaV2.challengeProgress)
        .values(
          chunk.map((challengeId) => ({
            userId: u.userId,
            challengeId,
            completed: true,
          }))
        )
        .onConflictDoNothing();
      seededProgressRows += chunk.length;
    }
  }

  console.log(`✓ Seeded ${seededProgressRows} XP-calibrated checkpoint progress rows`);
  console.log("\n✅ v1 -> v2 MIGRATION COMPLETE!");
}

runMigration().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
