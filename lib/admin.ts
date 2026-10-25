import { auth, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { pods, userProgress } from "@/db/schema";

export const SUPER_ADMIN_EMAILS: string[] = (process.env.SUPER_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const DEFAULT_ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS || process.env.SUPER_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// Administrator account IDs sourced from private environment variables
export const DEFAULT_ADMIN_IDS: string[] = (process.env.ADMIN_USER_IDS || process.env.SUPER_ADMIN_USER_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export const isSuperAdmin = async (): Promise<boolean> => {
  const { userId } = auth();
  if (!userId) return false;

  // 1. Check env variable SUPER_ADMIN_USER_IDS or configured admin IDs
  const superAdminIds = (process.env.SUPER_ADMIN_USER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (superAdminIds.includes(userId)) {
    return true;
  }

  // 2. Fallback check for DEFAULT_ADMIN_IDS
  if (DEFAULT_ADMIN_IDS.includes(userId)) {
    return true;
  }

  // 3. Check verified Clerk user email against SUPER_ADMIN_EMAILS
  try {
    const user = await currentUser();
    if (user?.emailAddresses) {
      const emails = user.emailAddresses.map((e) => e.emailAddress.toLowerCase().trim());
      if (emails.some((email) => SUPER_ADMIN_EMAILS.includes(email))) {
        return true;
      }
    }
  } catch {
    // Graceful fallback if currentUser() is unavailable
  }

  return false;
};

export const isAdmin = async (): Promise<boolean> => {
  const { userId } = auth();
  if (!userId) return false;

  // 1. Fast-path check for known admin user IDs
  if (DEFAULT_ADMIN_IDS.includes(userId)) {
    return true;
  }

  // 2. Check ADMIN_USER_IDS environment variable
  if (process.env.ADMIN_USER_IDS) {
    const envIds = process.env.ADMIN_USER_IDS.split(",").map((id) => id.trim());
    if (envIds.includes(userId)) return true;
  }

  // 3. Check Clerk user email against approved admin list & ADMIN_EMAILS
  try {
    const user = await currentUser();
    if (user?.emailAddresses) {
      const emails = user.emailAddresses.map((e) => e.emailAddress.toLowerCase().trim());
      
      // Check hardcoded approved emails
      if (emails.some((email) => DEFAULT_ADMIN_EMAILS.includes(email))) {
        return true;
      }

      // Check ADMIN_EMAILS environment variable
      if (process.env.ADMIN_EMAILS) {
        const envEmails = process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase());
        if (emails.some((email) => envEmails.includes(email))) {
          return true;
        }
      }
    }
  } catch {
    // Graceful fallback if currentUser() is unavailable
  }

  // 4. Check if user is registered with role='parent' or owns any pod
  try {
    const progress = await db.query.userProgress.findFirst({
      where: eq(userProgress.userId, userId),
      columns: { role: true },
    });
    if (progress?.role === "parent") {
      return true;
    }

    const ownedPod = await db.query.pods.findFirst({
      where: eq(pods.ownerId, userId),
      columns: { id: true },
    });
    if (ownedPod) {
      return true;
    }
  } catch {
    // Graceful fallback
  }

  return false;
};
