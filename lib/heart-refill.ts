export const MAX_DAILY_HEARTS = 5;

export interface HeartRefillEvaluation {
  shouldUpdate: boolean;
  hearts: number;
  lastHeartRefillDate: string;
  wasToppedUp: boolean;
}

/**
 * Evaluates whether a learner's hearts should be automatically topped up for a new calendar day.
 *
 * Rules (CR-062):
 * 1. Once per calendar day (YYYY-MM-DD), at the start of the day (or overnight),
 *    any learner with < 5 hearts is topped up to 5 hearts.
 * 2. If a learner already has >= 5 hearts on their first check of the new calendar day,
 *    their heart count is preserved (including Super Izazov bonus hearts), and
 *    `lastHeartRefillDate` is stamped to `today` so that hearts lost later that same day
 *    are not auto-refilled until tomorrow.
 * 3. If `lastHeartRefillDate === today`, no automatic refill occurs (same-day idempotency).
 */
export function evaluateDailyHeartRefill(
  currentHearts: number,
  lastHeartRefillDate: string | null | undefined,
  today: string = new Date().toISOString().split("T")[0]
): HeartRefillEvaluation {
  if (lastHeartRefillDate === today) {
    return {
      shouldUpdate: false,
      hearts: currentHearts,
      lastHeartRefillDate: today,
      wasToppedUp: false,
    };
  }

  const toppedUpHearts = Math.max(currentHearts, MAX_DAILY_HEARTS);

  return {
    shouldUpdate: true,
    hearts: toppedUpHearts,
    lastHeartRefillDate: today,
    wasToppedUp: toppedUpHearts > currentHearts,
  };
}
