"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db/drizzle";
import { podMembers, pods, userProgress } from "@/db/schema";
import { getUserProgress } from "@/db/queries";

/**
 * Generate a clean, 6-character uppercase alphanumeric code (excluding ambiguous chars 0, O, 1, I).
 */
const generateRandomPodCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

interface FamilyOnboardingInput {
  familyName: string;
  targetXp?: number;
  customCode?: string;
}

export const createFamilyOnboarding = async (data: FamilyOnboardingInput) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const trimmedName = data.familyName.trim();
  if (!trimmedName || trimmedName.length < 2) {
    return { error: "Please enter a valid family or circle name (at least 2 characters)." };
  }

  // Format or generate invite code
  let finalCode = "";
  if (data.customCode?.trim()) {
    finalCode = data.customCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (finalCode.length < 3 || finalCode.length > 10) {
      return { error: "Invite code must be between 3 and 10 alphanumeric characters." };
    }
    // Verify uniqueness
    const existingCode = await db.query.pods.findFirst({
      where: eq(pods.inviteCode, finalCode),
    });
    if (existingCode) {
      return { error: `The code "${finalCode}" is already in use. Please pick a different code.` };
    }
  } else {
    // Generate unique code
    let unique = false;
    let attempts = 0;
    while (!unique && attempts < 10) {
      attempts++;
      finalCode = generateRandomPodCode();
      const existing = await db.query.pods.findFirst({
        where: eq(pods.inviteCode, finalCode),
      });
      if (!existing) {
        unique = true;
      }
    }
  }

  const targetXp = data.targetXp && data.targetXp >= 100 ? data.targetXp : 1000;

  // 1. Ensure userProgress exists and mark role as 'parent'
  const existingProgress = await getUserProgress();
  if (existingProgress) {
    await db.update(userProgress).set({
      role: "parent",
      userName: user.firstName || user.username || existingProgress.userName || "Parent",
      userImageSrc: user.imageUrl || existingProgress.userImageSrc || "/mascot.png",
    }).where(eq(userProgress.userId, userId));
  } else {
    await db.insert(userProgress).values({
      userId,
      activeCourseId: 1,
      userName: user.firstName || user.username || "Parent",
      userImageSrc: user.imageUrl || "/mascot.png",
      role: "parent",
    });
  }

  // 2. Create the new Pod
  const [newPod] = await db.insert(pods).values({
    name: trimmedName,
    type: "family",
    inviteCode: finalCode,
    ownerId: userId,
    targetXp,
    currentXp: 0,
    celebrationUnlocked: false,
    weekNumber: 1,
  }).returning();

  // 3. Add parent as owner in podMembers
  await db.insert(podMembers).values({
    podId: newPod.id,
    userId,
    role: "owner",
  });

  revalidatePath("/admin");
  revalidatePath("/learn");
  revalidatePath("/leaderboard");

  return { 
    success: true, 
    pod: newPod,
    redirectUrl: "/admin",
  };
};

export const selectLearnerRole = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingProgress = await getUserProgress();
  if (existingProgress) {
    await db.update(userProgress).set({
      role: "learner",
    }).where(eq(userProgress.userId, userId));
  } else {
    await db.insert(userProgress).values({
      userId,
      activeCourseId: 1,
      userName: user?.firstName || user?.username || "Learner",
      userImageSrc: user?.imageUrl || "/mascot.png",
      role: "learner",
    });
  }

  revalidatePath("/learn");
  revalidatePath("/leaderboard");

  return { success: true };
};
