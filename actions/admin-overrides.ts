"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { and, eq, inArray } from "drizzle-orm";

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
