"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { and, eq, gte } from "drizzle-orm";

import db from "@/db/drizzle";
import { podReactions, userProgress } from "@/db/schema";
import { awardPodXp } from "@/actions/pod";

export const sendPodCheer = async (
  receiverId: string,
  type: "high_five" | "star" | "flame" = "high_five"
) => {
  const { userId: senderId } = await auth();

  if (!senderId) {
    throw new Error("Unauthorized");
  }

  if (senderId === receiverId) {
    return { error: "You can't send a high-five to yourself!" };
  }

  // Get sender's name
  const senderProgress = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, senderId),
  });

  const senderName = senderProgress?.userName || "A learning buddy";

  // Rate limiting: 1 cheer per receiver per calendar day
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const existingCheerToday = await db.query.podReactions.findFirst({
    where: and(
      eq(podReactions.senderId, senderId),
      eq(podReactions.receiverId, receiverId),
      gte(podReactions.createdAt, startOfToday),
    ),
  });

  if (existingCheerToday) {
    return { error: "You already sent a cheer today! Check back tomorrow! 🌟" };
  }

  await db.insert(podReactions).values({
    senderId,
    senderName,
    receiverId,
    type,
    seen: false,
  });

  revalidatePath("/leaderboard");

  return { success: true };
};

export const claimCheer = async (cheerId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const cheer = await db.query.podReactions.findFirst({
    where: and(
      eq(podReactions.id, cheerId),
      eq(podReactions.receiverId, userId),
      eq(podReactions.seen, false),
    ),
  });

  if (!cheer) {
    return { error: "Cheer not found or already claimed." };
  }

  // Mark seen
  await db.update(podReactions).set({
    seen: true,
  }).where(eq(podReactions.id, cheerId));

  // Award +5 XP bonus to user
  const currentProgress = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  if (currentProgress) {
    await db.update(userProgress).set({
      points: currentProgress.points + 5,
    }).where(eq(userProgress.userId, userId));

    // Also contribute +5 XP to active pods
    await awardPodXp(userId, 5);
  }

  revalidatePath("/learn");
  revalidatePath("/leaderboard");
  revalidatePath("/quests");

  return { success: true, bonusXp: 5 };
};
