/**
 * Computes updated streak counter based on current user activity date.
 * - Same calendar day: Maintains streak.
 * - Consecutive calendar day: Increments streak by +1.
 * - Missed 1+ days: Resets streak to 1.
 */
export function calculateStreak(currentStreak: number = 0, lastActiveDate: string | null = null) {
  const today = new Date().toISOString().split("T")[0];
  const yesterdayDate = new Date(Date.now() - 86400000);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  if (lastActiveDate === today) {
    return {
      streak: Math.max(currentStreak, 1),
      lastActiveDate: today,
      isNewDay: false,
    };
  }

  if (lastActiveDate === yesterday) {
    return {
      streak: currentStreak + 1,
      lastActiveDate: today,
      isNewDay: true,
    };
  }

  // First time or missed a day
  return {
    streak: 1,
    lastActiveDate: today,
    isNewDay: true,
  };
}
