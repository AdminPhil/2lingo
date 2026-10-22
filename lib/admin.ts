import { auth } from "@clerk/nextjs";

// Known administrator and parent account IDs
const DEFAULT_ADMIN_IDS = [
  "user_3L1NgMhZTgf028zJorcCrRWzdXQ", // Phil
  "user_3KzD8MADuGMqXumxmVhHHb6ludF", // Phil
  "user_3L1NcTuNW47BxjbICnQ2zGRIH22", // J C
  "user_2dGb6YEarBAQHrNYoB5dMtISRWK", // Legacy admin
];

export const isAdmin = () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  // 1. Check environment variable if set
  if (process.env.ADMIN_USER_IDS) {
    const envIds = process.env.ADMIN_USER_IDS.split(",").map((id) => id.trim());
    if (envIds.includes(userId)) return true;
  }

  // 2. Check default recognized admin IDs
  return DEFAULT_ADMIN_IDS.includes(userId);
};
