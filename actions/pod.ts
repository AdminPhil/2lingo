"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { podMembers, pods } from "@/db/schema";
import { isSuperAdmin } from "@/lib/admin";
import { generateRandomPodCode } from "@/lib/pod-code";

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

  return { success: true, podName: pod.name, podId: pod.id };
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

  const inviteCode = generateRandomPodCode();




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


export const updatePodSettings = async (
  podId: number,
  data: { name?: string; inviteCode?: string; targetXp?: number }
) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const updates: Record<string, any> = {};

  if (data.name?.trim()) {
    updates.name = data.name.trim();
  }

  if (data.inviteCode?.trim()) {
    const cleanCode = data.inviteCode.trim().toUpperCase();
    const existing = await db.query.pods.findFirst({
      where: eq(pods.inviteCode, cleanCode),
    });
    if (existing && existing.id !== podId) {
      return { error: `Invite code "${cleanCode}" is already taken by another pod.` };
    }
    updates.inviteCode = cleanCode;
  }

  if (data.targetXp && data.targetXp > 0) {
    updates.targetXp = data.targetXp;
  }

  if (Object.keys(updates).length > 0) {
    await db.update(pods).set(updates).where(eq(pods.id, podId));
  }

  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  revalidatePath("/learn");

  return { success: true };
};

export const deletePod = async (podId: number) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (podId === 1) {
    return { error: "Cannot delete the default family pod." };
  }

  await db.delete(pods).where(eq(pods.id, podId));

  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  revalidatePath("/learn");

  return { success: true };
};

export const removePodMember = async (podId: number, memberUserId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.delete(podMembers).where(
    and(
      eq(podMembers.podId, podId),
      eq(podMembers.userId, memberUserId),
    )
  );

  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  revalidatePath("/learn");

  return { success: true };
};

export const adminAddUserToPod = async (
  podId: number,
  targetUserId: string,
  role: "member" | "admin" = "member"
) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const targetPod = await db.query.pods.findFirst({
    where: eq(pods.id, podId),
  });

  if (!targetPod) {
    return { error: "Pod not found." };
  }

  const superAdmin = await isSuperAdmin();
  if (targetPod.ownerId !== userId && !superAdmin) {
    return { error: "Only the pod owner or super administrator can add members to this pod." };
  }

  const existingMember = await db.query.podMembers.findFirst({
    where: and(
      eq(podMembers.podId, podId),
      eq(podMembers.userId, targetUserId),
    ),
  });

  if (existingMember) {
    if (existingMember.role !== role) {
      await db.update(podMembers).set({ role }).where(eq(podMembers.id, existingMember.id));
    }
  } else {
    await db.insert(podMembers).values({
      podId,
      userId: targetUserId,
      role,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  revalidatePath("/learn");

  return { success: true };
};

export const adminAddUsersToPod = async (
  podId: number,
  targetUserIds: string[],
  role: "member" | "admin" = "member"
) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!targetUserIds || targetUserIds.length === 0) {
    return { error: "No users selected." };
  }

  const targetPod = await db.query.pods.findFirst({
    where: eq(pods.id, podId),
  });

  if (!targetPod) {
    return { error: "Pod not found." };
  }

  const superAdmin = await isSuperAdmin();
  if (targetPod.ownerId !== userId && !superAdmin) {
    return { error: "Only the pod owner or super administrator can add members to this pod." };
  }

  for (const targetUserId of targetUserIds) {
    const existingMember = await db.query.podMembers.findFirst({
      where: and(
        eq(podMembers.podId, podId),
        eq(podMembers.userId, targetUserId),
      ),
    });

    if (existingMember) {
      if (existingMember.role !== role) {
        await db.update(podMembers).set({ role }).where(eq(podMembers.id, existingMember.id));
      }
    } else {
      await db.insert(podMembers).values({
        podId,
        userId: targetUserId,
        role,
      });
    }
  }

  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  revalidatePath("/learn");

  return { success: true, count: targetUserIds.length };
};
