"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq, isNull } from "drizzle-orm";

import db from "@/db/drizzle";
import { pods, userProgress } from "@/db/schema";
import * as schemaV2 from "@/db/schema.v2";
import { isSuperAdmin } from "@/lib/admin";
import {
  generateQrBadgeToken,
  hashQrBadgeToken,
  isValidQrBadgeTokenFormat,
} from "@/lib/v2/qr-tokens";

async function getClerk() {
  return typeof clerkClient === "function" ? await clerkClient() : (clerkClient as any);
}

function getV2Db() {
  const dbUrl = (process.env.DATABASE_URL_V2 || process.env.DATABASE_URL || "")
    .trim()
    .replace(/^["']|["']$/g, "");
  if (!dbUrl || dbUrl.includes("placeholder@localhost")) {
    return null;
  }
  const sql = neon(dbUrl);
  // @ts-ignore - neon-http generic variance with drizzle-orm 0.30
  return drizzle(sql, { schema: schemaV2 });
}

/**
 * CroLingo v2 Passwordless QR Login Token Exchange
 * Exchanges a scanned opaque badge token (`clqr_...`) for a one-time Clerk Sign-In Token
 * (`strategy: "ticket"`), so scanning or printing a QR badge NEVER touches or resets passwords.
 */
export async function exchangeQrTokenForSignInTicket(rawToken: string): Promise<{
  ticket?: string;
  error?: string;
}> {
  if (!isValidQrBadgeTokenFormat(rawToken)) {
    return { error: "Invalid QR badge token format." };
  }

  const dbV2 = getV2Db();
  if (!dbV2) {
    return { error: "Authentication service is temporarily unavailable." };
  }

  const tokenHash = hashQrBadgeToken(rawToken);

  try {
    const tokenRow = await dbV2.query.qrLoginTokens.findFirst({
      where: and(
        eq(schemaV2.qrLoginTokens.tokenHash, tokenHash),
        isNull(schemaV2.qrLoginTokens.revokedAt)
      ),
    });

    if (!tokenRow) {
      return {
        error:
          "This QR badge is expired or has been revoked. Ask your parent or teacher for a fresh badge.",
      };
    }

    const clerk = await getClerk();
    const signInToken = await clerk.signInTokens.createSignInToken({
      userId: tokenRow.userId,
      expiresInSeconds: 300,
    });

    return { ticket: signInToken.token };
  } catch {
    return { error: "Unable to verify QR badge right now. Please try again." };
  }
}

export type QrTokenBadgeChild = {
  userId: string;
  name: string;
  username: string;
  userImageSrc: string;
  token: string;
};

/**
 * Issues a passwordless QR Fast Pass badge token (`clqr_...`) for a single learner.
 * Stores ONLY the SHA-256 hash in `qr_login_tokens` and NEVER resets or modifies
 * the learner's Clerk password.
 */
export async function issueStudentQrTokenBadge(
  targetUserId: string,
  options?: { revokePrevious?: boolean }
): Promise<{
  success?: boolean;
  child?: QrTokenBadgeChild;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const superAdmin = await isSuperAdmin();

  const progress = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, targetUserId),
  });

  if (!progress) {
    return { error: "Learner record not found." };
  }

  if (!superAdmin) {
    const callerPods = await db.query.pods.findMany({
      where: eq(pods.ownerId, userId),
      with: { members: true },
    });
    const isLearnerInCallerPod = callerPods.some((p) =>
      p.members.some((m) => m.userId === targetUserId)
    );
    if (!isLearnerInCallerPod) {
      return {
        error:
          "You only have permission to view badges for learners in your own family circle.",
      };
    }
  }

  const clerk = await getClerk();
  let cleanUsername = progress.userName.toLowerCase().replace(/[^a-z0-9]/g, "") || "learner";
  try {
    const clerkUser = await clerk.users.getUser(targetUserId);
    if (clerkUser?.username) {
      cleanUsername = clerkUser.username;
    }
  } catch {
    return { error: "Failed to locate authentication profile for this learner." };
  }

  const dbV2 = getV2Db();
  if (!dbV2) {
    return { error: "QR token service is unavailable." };
  }

  const { rawToken, tokenHash } = generateQrBadgeToken();

  try {
    if (options?.revokePrevious) {
      await dbV2
        .update(schemaV2.qrLoginTokens)
        .set({ revokedAt: new Date() })
        .where(
          and(
            eq(schemaV2.qrLoginTokens.userId, targetUserId),
            isNull(schemaV2.qrLoginTokens.revokedAt)
          )
        );
    }

    await dbV2.insert(schemaV2.qrLoginTokens).values({
      tokenHash,
      userId: targetUserId,
      createdByUserId: userId,
    });
  } catch {
    return {
      error:
        "Could not store QR badge token. Ensure the v2 database migration has been applied.",
    };
  }

  return {
    success: true,
    child: {
      userId: targetUserId,
      name: progress.userName,
      username: cleanUsername,
      userImageSrc: progress.userImageSrc || "/avatars/pasko.png",
      token: rawToken,
    },
  };
}

/**
 * Issues passwordless QR Fast Pass badge tokens (`clqr_...`) for every learner in a pod.
 * Never resets learner passwords and never alters progress.
 */
export async function issueTeamQrTokenBadges(
  podId: number,
  options?: { revokePrevious?: boolean }
): Promise<{
  success?: boolean;
  inviteCode?: string;
  podName?: string;
  passes?: QrTokenBadgeChild[];
  failures?: string[];
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const pod = await db.query.pods.findFirst({
    where: eq(pods.id, podId),
    with: { members: true },
  });

  if (!pod) {
    return { error: "Team not found." };
  }

  if (pod.ownerId !== userId && !(await isSuperAdmin())) {
    return { error: "You can only print badges for your own teams." };
  }

  const learnerIds = pod.members
    .filter((m) => m.role === "member" && m.userId !== userId)
    .map((m) => m.userId);

  const passes: QrTokenBadgeChild[] = [];
  const failures: string[] = [];

  for (const learnerId of learnerIds) {
    const res = await issueStudentQrTokenBadge(learnerId, options);
    if (res.success && res.child) {
      passes.push(res.child);
    } else {
      failures.push(learnerId);
    }
  }

  return {
    success: true,
    inviteCode: pod.inviteCode,
    podName: pod.name,
    passes,
    failures,
  };
}
