"use server";

import { auth, clerkClient } from "@clerk/nextjs";
import { and, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db/drizzle";
import { podMembers, pods, userProgress } from "@/db/schema";
import { isSuperAdmin } from "@/lib/admin";

const MAX_FAMILY_POD_MEMBERS = 15;
const MAX_CLASSROOM_POD_MEMBERS = 50;
const MAX_CREATIONS_PER_HOUR = 60;

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

  // Enforce pod capacity based on pod type (Family vs Classroom)
  const currentMembers = await db
    .select({ count: sql<number>`count(*)` })
    .from(podMembers)
    .where(eq(podMembers.podId, targetPod.id));

  const memberCount = Number(currentMembers[0]?.count || 0);
  const maxAllowed = targetPod.type === "classroom"
    ? MAX_CLASSROOM_POD_MEMBERS
    : MAX_FAMILY_POD_MEMBERS;

  if (!superAdmin && memberCount >= maxAllowed) {
    return {
      error: `This ${targetPod.type} circle has reached its capacity of ${maxAllowed} learners. Please contact support or create another circle.`
    };
  }

  // Velocity check: prevent rapid-fire script abuse
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCreations = await db
    .select({ count: sql<number>`count(*)` })
    .from(podMembers)
    .where(
      and(
        eq(podMembers.podId, targetPod.id),
        gte(podMembers.joinedAt, oneHourAgo)
      )
    );

  const hourlyCount = Number(recentCreations[0]?.count || 0);
  if (!superAdmin && hourlyCount >= MAX_CREATIONS_PER_HOUR) {
    return {
      error: "Account creation speed limit reached. Please wait a few minutes before adding more learners."
    };
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
      userImageSrc: data.userImageSrc || "/mascot.png",
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
      userImageSrc: data.userImageSrc || "/avatars/pasko.png",
    },
  };
};

export const createMultipleChildAccounts = async (
  children: CreateChildAccountInput[]
) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!children || children.length === 0) {
    return {
      error: "Please provide at least one child account to create.",
      errors: ["Please provide at least one child account to create."],
    };
  }

  if (children.length > 5) {
    return {
      error: "You can create up to 5 children at one time.",
      errors: ["You can create up to 5 children at one time."],
    };
  }

  const cleanUsernames = children.map((c) =>
    (c.username || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "")
  );
  const seenUsernames = new Set<string>();
  for (const u of cleanUsernames) {
    if (u && seenUsernames.has(u)) {
      return {
        error: "Each child in the batch must have a unique username.",
        errors: ["Each child in the batch must have a unique username."],
      };
    }
    seenUsernames.add(u);
  }

  const results: any[] = [];

  for (const child of children) {
    try {
      const res = await createChildAccount(child);
      if (res?.error || !res?.success || !res?.child) {
        const failureReason = res?.error || "Failed to create child account.";
        const rolledBackCount = results.length;
        for (const created of results) {
          try {
            await clerkClient.users.deleteUser(created.id);
          } catch (clerkErr) {
            console.error(`Failed to rollback Clerk user ${created.id}:`, clerkErr);
          }
          try {
            await db.delete(userProgress).where(eq(userProgress.userId, created.id));
            await db.delete(podMembers).where(eq(podMembers.userId, created.id));
          } catch (dbErr) {
            console.error(`Failed to rollback DB records for ${created.id}:`, dbErr);
          }
        }
        return {
          success: false,
          error: `Batch child creation failed and was rolled back atomically: ${failureReason}`,
          errors: [`Batch child creation failed and was rolled back atomically: ${failureReason}`],
          rolledBackCount,
        };
      }
      results.push(res.child);
    } catch (err: any) {
      const failureReason = err?.message || String(err);
      const rolledBackCount = results.length;
      for (const created of results) {
        try {
          await clerkClient.users.deleteUser(created.id);
        } catch (clerkErr) {
          console.error(`Failed to rollback Clerk user ${created.id}:`, clerkErr);
        }
        try {
          await db.delete(userProgress).where(eq(userProgress.userId, created.id));
          await db.delete(podMembers).where(eq(podMembers.userId, created.id));
        } catch (dbErr) {
          console.error(`Failed to rollback DB records for ${created.id}:`, dbErr);
        }
      }
      return {
        success: false,
        error: `Batch child creation failed and was rolled back atomically: ${failureReason}`,
        errors: [`Batch child creation failed and was rolled back atomically: ${failureReason}`],
        rolledBackCount,
      };
    }
  }

  return {
    success: true,
    created: results,
  };
};

export const adminGetOrResetStudentQrPass = async (targetUserId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const superAdmin = await isSuperAdmin();

  // Find user progress record
  const progress = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, targetUserId),
  });

  if (!progress) {
    return { error: "Learner record not found." };
  }

  // Permission check: caller must be super-admin or owner of a pod containing this learner
  if (!superAdmin) {
    const callerPods = await db.query.pods.findMany({
      where: eq(pods.ownerId, userId),
      with: { members: true },
    });
    const isLearnerInCallerPod = callerPods.some((p) =>
      p.members.some((m) => m.userId === targetUserId)
    );
    if (!isLearnerInCallerPod) {
      return { error: "You only have permission to view badges for learners in your own family circle." };
    }
  }

  // Fetch Clerk user
  let clerkUser;
  try {
    clerkUser = await clerkClient.users.getUser(targetUserId);
  } catch {
    return { error: "Failed to locate authentication profile for this learner." };
  }

  const cleanUsername = clerkUser.username || progress.userName.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Generate a clean memorable kid-friendly password for the QR badge
  // Format: Cro<Firstname><2-digit number>! e.g. CroLuka88!
  const randomNum = Math.floor(10 + Math.random() * 90);
  const cleanName = progress.userName.replace(/[^a-zA-Z]/g, "") || "Lingo";
  const newPassword = `Cro${cleanName}${randomNum}!`;

  try {
    await clerkClient.users.updateUser(targetUserId, {
      password: newPassword,
      skipPasswordChecks: true,
    });
  } catch (err: any) {
    return { error: err?.errors?.[0]?.message || "Failed to update authentication credentials." };
  }

  return {
    success: true,
    child: {
      userId: targetUserId,
      name: progress.userName,
      username: cleanUsername,
      password: newPassword,
      userImageSrc: progress.userImageSrc || "/avatars/pasko.png",
    },
  };
};
