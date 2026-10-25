import { describe, it, expect } from "vitest";
import { evaluateDailyHeartRefill, MAX_DAILY_HEARTS } from "@/lib/heart-refill";

describe("CR-062: Automatic Daily Overnight 5-Heart Top-Up (lib/heart-refill.ts)", () => {
  const TODAY = "2026-10-25";
  const YESTERDAY = "2026-10-24";
  const LAST_WEEK = "2026-10-18";

  it("tops up learners with < 5 hearts when lastHeartRefillDate is yesterday", () => {
    for (const depletedHearts of [0, 1, 2, 3, 4]) {
      const res = evaluateDailyHeartRefill(depletedHearts, YESTERDAY, TODAY);
      expect(res.shouldUpdate).toBe(true);
      expect(res.hearts).toBe(MAX_DAILY_HEARTS);
      expect(res.lastHeartRefillDate).toBe(TODAY);
      expect(res.wasToppedUp).toBe(true);
    }
  });

  it("tops up learners with < 5 hearts when lastHeartRefillDate is null or undefined (first-ever overnight cycle)", () => {
    const resNull = evaluateDailyHeartRefill(2, null, TODAY);
    expect(resNull).toEqual({
      shouldUpdate: true,
      hearts: 5,
      lastHeartRefillDate: TODAY,
      wasToppedUp: true,
    });

    const resUndefined = evaluateDailyHeartRefill(0, undefined, TODAY);
    expect(resUndefined).toEqual({
      shouldUpdate: true,
      hearts: 5,
      lastHeartRefillDate: TODAY,
      wasToppedUp: true,
    });
  });

  it("enforces strict once-per-day idempotency: does NOT refill again on the same day after losing hearts", () => {
    // Learner was already topped up/stamped on TODAY ("2026-10-25") and then lost 3 hearts (down to 2)
    const res = evaluateDailyHeartRefill(2, TODAY, TODAY);
    expect(res.shouldUpdate).toBe(false);
    expect(res.hearts).toBe(2);
    expect(res.lastHeartRefillDate).toBe(TODAY);
    expect(res.wasToppedUp).toBe(false);
  });

  it("stamps lastHeartRefillDate = today when learner starts a new day already at 5/5 hearts so mid-day heart loss isn't auto-refilled", () => {
    const morningCheck = evaluateDailyHeartRefill(5, YESTERDAY, TODAY);
    expect(morningCheck).toEqual({
      shouldUpdate: true,
      hearts: 5,
      lastHeartRefillDate: TODAY,
      wasToppedUp: false,
    });

    // Later that same afternoon, learner loses 2 hearts (down to 3)
    const afternoonCheck = evaluateDailyHeartRefill(3, morningCheck.lastHeartRefillDate, TODAY);
    expect(afternoonCheck.shouldUpdate).toBe(false);
    expect(afternoonCheck.hearts).toBe(3);
  });

  it("preserves Super Izazov bonus hearts (> 5) without reducing them", () => {
    const res = evaluateDailyHeartRefill(6, YESTERDAY, TODAY);
    expect(res.shouldUpdate).toBe(true);
    expect(res.hearts).toBe(6);
    expect(res.lastHeartRefillDate).toBe(TODAY);
    expect(res.wasToppedUp).toBe(false);
  });

  it("tops up learners returning after a multi-day absence", () => {
    const res = evaluateDailyHeartRefill(1, LAST_WEEK, TODAY);
    expect(res.shouldUpdate).toBe(true);
    expect(res.hearts).toBe(5);
    expect(res.lastHeartRefillDate).toBe(TODAY);
    expect(res.wasToppedUp).toBe(true);
  });
});
