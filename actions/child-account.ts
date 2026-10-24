"use server";

import { auth, clerkClient } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db/drizzle";
import { podMembers, pods, userProgress } from "@/db/schema";
import { isSuperAdmin } from "@/lib/admin";

interface CreateChildAccountInput {
  childName: string;
  username: string;
  password: string;
  userImageSrc?: string;
  podId: number;
}

export const createChildAccount = async (data: CreateChildAccountInput) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const childName = data.childName.trim();
  if (!childName || childName.length < 2) {
    return { error: "Please enter your child's name (at least 2 characters)." };
  }

  // Format and validate username
  const cleanUsername = data.username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  if (!cleanUsername || cleanUsername.length < 4 || cleanUsername.length > 25) {
    return { error: "Username must be between 4 and 25 letters or numbers (e.g. luka_z or mia12)." };
  }

  const password = data.password.trim();
  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  // Verify parent ownership of target pod
  const targetPod = await db.query.pods.findFirst({
    where: eq(pods.id, data.podId),
  });

  if (!targetPod) {
    return { error: "Target family pod not found." };
  }

  const superAdmin = await isSuperAdmin();
  if (targetPod.ownerId !== userId && !superAdmin) {
    return { error: "You can only create learner accounts for your own family circle." };
  }

  // 1. Create Clerk User with username & password (no email required)
  let clerkUser;
  try {
    clerkUser = await clerkClient.users.createUser({
      username: cleanUsername,
      password,
      firstName: childName,
      skipPasswordChecks: true,
      skipPasswordRequirement: false,
    });
  } catch (err: any) {
    const clerkErrors = err?.errors;
    if (clerkErrors && clerkErrors.length > 0) {
      const code = clerkErrors[0]?.code;
      const message = clerkErrors[0]?.message;
      if (code === "form_identifier_exists") {
        return { error: `The username "${cleanUsername}" is already taken. Please try another one!` };
      }
      return { error: message || "Failed to create user credentials. Please try again." };
    }
    return { error: "Failed to communicate with authentication service. Please try again." };
  }

  // 2. Insert into user_progress table
  try {
    await db.insert(userProgress).values({
      userId: clerkUser.id,
      userName: childName,
      userImageSrc: data.userImageSrc || "/mascot.svg",
      activeCourseId: 1,
      hearts: 5,
      points: 0,
      heartsUsed: 0,
      streak: 0,
      role: "learner",
    });
  } catch (dbErr) {
    // If DB fails, attempt to delete Clerk user to maintain consistency
    try {
      await clerkClient.users.deleteUser(clerkUser.id);
    } catch {}
    return { error: "Failed to initialize learner record in database." };
  }

  // 3. Add to podMembers as member
  await db.insert(podMembers).values({
    podId: targetPod.id,
    userId: clerkUser.id,
    role: "member",
  });

  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  revalidatePath("/learn");

  return {
    success: true,
    child: {
      id: clerkUser.id,
      name: childName,
      username: cleanUsername,
      password,
      podName: targetPod.name,
      inviteCode: targetPod.inviteCode,
    },
  };
};
