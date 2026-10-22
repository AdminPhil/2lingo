"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { podMembers, pods } from "@/db/schema";

export const joinPodByCode = async (inviteCode: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const cleanCode = inviteCode.trim().toUpperCase();

  const pod = await db.query.pods.findFirst({
    where: eq(pods.inviteCode, cleanCode),
  });

  if (!pod) {
    return { error: "No family pod found with that code. Please check and try again!" };
  }

  const existingMember = await db.query.podMembers.findFirst({
    where: and(
      eq(podMembers.podId, pod.id),
      eq(podMembers.userId, userId),
    ),
  });

  if (!existingMember) {
    await db.insert(podMembers).values({
      podId: pod.id,
      userId,
      role: "member",
    });
  }

  revalidatePath("/leaderboard");
  revalidatePath("/learn");

  return { success: true, podName: pod.name };
};

export const createPod = async (name: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const trimmedName = name.trim();
  if (!trimmedName) {
    return { error: "Please enter a valid pod name." };
  }

  // Generate a random 6-character code
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let inviteCode = "";
  for (let i = 0; i < 6; i++) {
    inviteCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const [newPod] = await db.insert(pods).values({
    name: trimmedName,
    type: "family",
    inviteCode,
    ownerId: userId,
    targetXp: 1000,
  }).returning();

  await db.insert(podMembers).values({
    podId: newPod.id,
    userId,
    role: "admin",
  });

  revalidatePath("/leaderboard");
  revalidatePath("/learn");

  return { success: true, pod: newPod };
};


export const awardPodXp = async (userId: string, xp: number = 10) => {
  try {
    const memberships = await db.query.podMembers.findMany({
      where: eq(podMembers.userId, userId),
      with: {
        pod: true,
      },
    });

    for (const m of memberships) {
      if (m.pod) {
        const newXp = (m.pod.currentXp ?? 0) + xp;
        const unlocked = newXp >= (m.pod.targetXp ?? 1000);
        await db.update(pods).set({
          currentXp: newXp,
          celebrationUnlocked: unlocked,
        }).where(eq(pods.id, m.pod.id));
      }
    }
  } catch (error) {
    console.error("Failed to award pod XP:", error);
  }
};
