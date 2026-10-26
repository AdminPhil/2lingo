"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { and, eq, inArray, lt } from "drizzle-orm";

import db from "@/db/drizzle";
import { pods, podMembers, userProgress } from "@/db/schema";
import { isAdmin, isSuperAdmin } from "@/lib/admin";
import { awardPodXp } from "@/actions/pod";

const verifyParentCanManageLearner = async (
  callerUserId: string,
  targetUserId: string
): Promise<boolean> => {
  if (await isSuperAdmin()) return true;

  // Query if target learner is a member of any pod owned by the caller
  const membership = await db.query.podMembers.findFirst({
    where: and(
      eq(podMembers.userId, targetUserId),
      inArray(
        podMembers.podId,
        db.select({ id: pods.id }).from(pods).where(eq(pods.ownerId, callerUserId))
      )
    ),
  });

  return Boolean(membership);
};

export const adminRefillHearts = async (targetUserId: string) => {
  const { userId } = await auth();
  if (!userId || !(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  const canManage = await verifyParentCanManageLearner(userId, targetUserId);
  if (!canManage) {
    return { error: "You can only manage learners inside your own family circle." };
  }

  const learner = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, targetUserId),
  });

  if (!learner) {
    return { error: "Learner record not found." };
  }

  await db.update(userProgress).set({
    hearts: 5,
  }).where(eq(userProgress.userId, targetUserId));

  revalidatePath("/admin");
  revalidatePath("/learn");
  revalidatePath("/leaderboard");

  return { success: true, userName: learner.userName };
};

export const adminProtectStreak = async (targetUserId: string) => {
  const { userId } = await auth();
  if (!userId || !(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  const canManage = await verifyParentCanManageLearner(userId, targetUserId);
  if (!canManage) {
    return { error: "You can only manage learners inside your own family circle." };
  }

  const learner = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, targetUserId),
  });

  if (!learner) {
    return { error: "Learner record not found." };
  }

  const today = new Date().toISOString().split("T")[0];
  const currentStreak = learner.streak || 0;
  const newStreak = Math.max(currentStreak + 1, 1);

  await db.update(userProgress).set({
    streak: newStreak,
    lastActiveDate: today,
  }).where(eq(userProgress.userId, targetUserId));

  revalidatePath("/admin");
  revalidatePath("/learn");
  revalidatePath("/leaderboard");

  return { success: true, userName: learner.userName, streak: newStreak };
};

export const adminAwardPraiseXp = async (
  targetUserId: string,
  amount: number,
  reason: string
) => {
  const { userId } = await auth();
  if (!userId || !(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  const canManage = await verifyParentCanManageLearner(userId, targetUserId);
  if (!canManage) {
    return { error: "You can only manage learners inside your own family circle." };
  }

  if (amount <= 0 || amount > 500) {
    return { error: "Amount must be between 1 and 500 XP." };
  }

  const learner = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, targetUserId),
  });

  if (!learner) {
    return { error: "Learner record not found." };
  }

  const newPoints = (learner.points || 0) + amount;

  await db.update(userProgress).set({
    points: newPoints,
  }).where(eq(userProgress.userId, targetUserId));

  // Also propagate praise XP to active pods
  await awardPodXp(targetUserId, amount);

  revalidatePath("/admin");
  revalidatePath("/learn");
  revalidatePath("/leaderboard");
  revalidatePath("/quests");

  return { 
    success: true, 
    userName: learner.userName, 
    addedXp: amount, 
    newPoints, 
    reason 
  };
};

const getManageableTeamMemberIds = async (callerUserId: string, podId: number) => {
  const pod = await db.query.pods.findFirst({
    where: eq(pods.id, podId),
    with: { members: true },
  });
  if (!pod) return { error: "Team not found." as const };
  if (pod.ownerId !== callerUserId && !(await isSuperAdmin())) {
    return { error: "You can only manage your own teams." as const };
  }
  return { memberIds: pod.members.map((m) => m.userId) };
};

export const adminBulkRefillTeamHearts = async (podId: number) => {
  const { userId } = await auth();
  if (!userId || !(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  const scope = await getManageableTeamMemberIds(userId, podId);
  if ("error" in scope) return { error: scope.error };
  if (scope.memberIds.length === 0) return { success: true, refilled: 0 };

  const depleted = await db.query.userProgress.findMany({
    where: and(
      inArray(userProgress.userId, scope.memberIds),
      lt(userProgress.hearts, 5)
    ),
  });

  if (depleted.length > 0) {
    await db
      .update(userProgress)
      .set({ hearts: 5 })
      .where(inArray(userProgress.userId, depleted.map((l) => l.userId)));
  }

  revalidatePath("/admin");
  revalidatePath("/learn");
  revalidatePath("/leaderboard");

  return { success: true, refilled: depleted.length };
};

export const adminBulkAwardTeamPraiseXp = async (
  podId: number,
  amount: number,
  reason: string
) => {
  const { userId } = await auth();
  if (!userId || !(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  if (amount <= 0 || amount > 100) {
    return { error: "Bulk praise must be between 1 and 100 XP per learner." };
  }

  const scope = await getManageableTeamMemberIds(userId, podId);
  if ("error" in scope) return { error: scope.error };

  const learners = await db.query.userProgress.findMany({
    where: inArray(userProgress.userId, scope.memberIds.length ? scope.memberIds : [""]),
  });

  for (const learner of learners) {
    await db
      .update(userProgress)
      .set({ points: (learner.points || 0) + amount })
      .where(eq(userProgress.userId, learner.userId));
    await awardPodXp(learner.userId, amount);
  }

  revalidatePath("/admin");
  revalidatePath("/learn");
  revalidatePath("/leaderboard");
  revalidatePath("/quests");

  return { success: true, count: learners.length, amount, reason };
};
