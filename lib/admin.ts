import { auth, currentUser } from "@clerk/nextjs";

export const SUPER_ADMIN_EMAILS = [
  "philip.zgomba@gmail.com",
];

export const DEFAULT_ADMIN_EMAILS = [
  "philip.zgomba@gmail.com",
];

// Known administrator and parent account IDs (fast-path fallback)
export const DEFAULT_ADMIN_IDS = [
  "user_3L1NgMhZTgf028zJorcCrRWzdXQ", // Phil
  "user_3KzD8MADuGMqXumxmVhHHb6ludF", // Phil
  "user_3L1NcTuNW47BxjbICnQ2zGRIH22", // J C
  "user_2dGb6YEarBAQHrNYoB5dMtISRWK", // Legacy admin
];

export const isSuperAdmin = async (): Promise<boolean> => {
  const { userId } = auth();
  if (!userId) return false;

  // 1. Check env variable SUPER_ADMIN_USER_IDS
  if (process.env.SUPER_ADMIN_USER_IDS) {
    const envIds = process.env.SUPER_ADMIN_USER_IDS.split(",").map((id) => id.trim());
    if (envIds.includes(userId)) return true;
  }

  // 2. Fast-path check for known Phil Clerk IDs
  if (DEFAULT_ADMIN_IDS.slice(0, 2).includes(userId)) {
    return true;
  }

  // 3. Check verified Clerk user email
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

  return false;
};
