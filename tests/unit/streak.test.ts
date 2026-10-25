import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { calculateStreak } from "@/lib/streak";

describe("lib/streak.ts - calculateStreak algorithm", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("First Lesson & Uninitialized Activity", () => {
    it("initializes streak to 1 for first-time learner with null lastActiveDate", () => {
      vi.setSystemTime(new Date("2026-10-25T14:30:00.000Z"));
      const result = calculateStreak(0, null);

      expect(result).toEqual({
        streak: 1,
        lastActiveDate: "2026-10-25",
        isNewDay: true,
      });
    });

    it("resets streak to 1 if lastActiveDate is null even if currentStreak was non-zero", () => {
      vi.setSystemTime(new Date("2026-10-25T10:00:00.000Z"));
      const result = calculateStreak(14, null);

      expect(result).toEqual({
        streak: 1,
        lastActiveDate: "2026-10-25",
        isNewDay: true,
      });
    });

    it("handles default undefined arguments gracefully", () => {
      vi.setSystemTime(new Date("2026-10-25T08:00:00.000Z"));
      const result = calculateStreak();

      expect(result).toEqual({
        streak: 1,
        lastActiveDate: "2026-10-25",
        isNewDay: true,
      });
    });
  });

  describe("Same-Day Practice Idempotence", () => {
    it("preserves streak count and marks isNewDay: false when practicing again on the same day", () => {
      vi.setSystemTime(new Date("2026-10-25T09:15:00.000Z"));
      const today = "2026-10-25";

      // Learner already practiced today and has streak of 5
      const result = calculateStreak(5, today);

      expect(result).toEqual({
        streak: 5,
        lastActiveDate: today,
        isNewDay: false,
      });
    });

    it("maintains at least streak 1 even if currentStreak was recorded as 0 on the same day", () => {
      vi.setSystemTime(new Date("2026-10-25T11:00:00.000Z"));
      const today = "2026-10-25";

      const result = calculateStreak(0, today);

      expect(result).toEqual({
        streak: 1,
        lastActiveDate: today,
        isNewDay: false,
      });
    });

    it("does not increment streak across multiple rapid completions within the same UTC day", () => {
      vi.setSystemTime(new Date("2026-10-25T01:00:00.000Z"));
      const today = "2026-10-25";

      let state = calculateStreak(3, "2026-10-24"); // Yesterday -> increments to 4
      expect(state.streak).toBe(4);
      expect(state.isNewDay).toBe(true);

      // Repeat lesson at 05:00 UTC
      vi.setSystemTime(new Date("2026-10-25T05:00:00.000Z"));
      state = calculateStreak(state.streak, state.lastActiveDate);
      expect(state.streak).toBe(4);
      expect(state.isNewDay).toBe(false);

      // Repeat lesson at 23:59 UTC
      vi.setSystemTime(new Date("2026-10-25T23:59:59.000Z"));
      state = calculateStreak(state.streak, state.lastActiveDate);
      expect(state.streak).toBe(4);
      expect(state.isNewDay).toBe(false);
    });
  });

  describe("Consecutive Calendar Day Progression", () => {
    it("increments streak by 1 and returns isNewDay: true when lastActiveDate was yesterday", () => {
      vi.setSystemTime(new Date("2026-10-25T15:00:00.000Z"));
      const yesterday = "2026-10-24";

      const result = calculateStreak(7, yesterday);

      expect(result).toEqual({
        streak: 8,
        lastActiveDate: "2026-10-25",
        isNewDay: true,
      });
    });

    it("accurately handles triple-digit high-water-mark streaks", () => {
      vi.setSystemTime(new Date("2026-06-15T12:00:00.000Z"));
      const result = calculateStreak(365, "2026-06-14");

      expect(result).toEqual({
        streak: 366,
        lastActiveDate: "2026-06-15",
        isNewDay: true,
      });
    });
  });

  describe("Missed Day Gap Reset", () => {
    it("resets streak to 1 when learner misses exactly 1 intervening day (2 days gap)", () => {
      vi.setSystemTime(new Date("2026-10-25T12:00:00.000Z"));
      // 2 days ago = 2026-10-23
      const result = calculateStreak(10, "2026-10-23");

      expect(result).toEqual({
        streak: 1,
        lastActiveDate: "2026-10-25",
        isNewDay: true,
      });
    });

    it("resets streak to 1 after an extended absence (30 days)", () => {
      vi.setSystemTime(new Date("2026-10-25T12:00:00.000Z"));
      const result = calculateStreak(42, "2026-09-25");

      expect(result).toEqual({
        streak: 1,
        lastActiveDate: "2026-10-25",
        isNewDay: true,
      });
    });
  });

  describe("Month-End & Year Transitions", () => {
    it("handles transition across month boundary from April 30 to May 1", () => {
      vi.setSystemTime(new Date("2026-05-01T10:00:00.000Z"));
      const yesterday = "2026-04-30";

      const result = calculateStreak(19, yesterday);

      expect(result).toEqual({
        streak: 20,
        lastActiveDate: "2026-05-01",
        isNewDay: true,
      });
    });

    it("handles non-leap February to March transition (Feb 28 to Mar 1 in 2025)", () => {
      vi.setSystemTime(new Date("2025-03-01T12:00:00.000Z"));
      const yesterday = "2025-02-28";

      const result = calculateStreak(5, yesterday);

      expect(result).toEqual({
        streak: 6,
        lastActiveDate: "2025-03-01",
        isNewDay: true,
      });
    });

    it("handles year transition from Dec 31 to Jan 1", () => {
      vi.setSystemTime(new Date("2026-01-01T08:00:00.000Z"));
      const yesterday = "2025-12-31";

      const result = calculateStreak(99, yesterday);

      expect(result).toEqual({
        streak: 100,
        lastActiveDate: "2026-01-01",
        isNewDay: true,
      });
    });
  });

  describe("Leap Year Day Transitions", () => {
    it("handles leap year Feb 28 to Feb 29 transition (2024 leap year)", () => {
      vi.setSystemTime(new Date("2024-02-29T12:00:00.000Z"));
      const yesterday = "2024-02-28";

      const result = calculateStreak(11, yesterday);

      expect(result).toEqual({
        streak: 12,
        lastActiveDate: "2024-02-29",
        isNewDay: true,
      });
    });

    it("handles leap year Feb 29 to Mar 1 transition (2024 leap year)", () => {
      vi.setSystemTime(new Date("2024-03-01T12:00:00.000Z"));
      const yesterday = "2024-02-29";

      const result = calculateStreak(12, yesterday);

      expect(result).toEqual({
        streak: 13,
        lastActiveDate: "2024-03-01",
        isNewDay: true,
      });
    });
  });

  describe("Admin Streak Grace Day Preservation", () => {
    it("preserves admin-protected streak when learner completes a lesson on the protected day", () => {
      vi.setSystemTime(new Date("2026-10-25T16:00:00.000Z"));
      const today = "2026-10-25";

      // Suppose admin restored learner streak to 25 and set lastActiveDate to today
      const adminProtectedStreak = 25;
      const adminLastActive = today;

      // Learner does a lesson in the evening
      const result = calculateStreak(adminProtectedStreak, adminLastActive);

      expect(result).toEqual({
        streak: 25,
        lastActiveDate: today,
        isNewDay: false,
      });
    });

    it("allows learner to advance to +1 on the following day after an admin grace save", () => {
      const today = "2026-10-25";
      const adminProtectedStreak = 25;

      // Next day comes
      vi.setSystemTime(new Date("2026-10-26T10:00:00.000Z"));
      const nextDayResult = calculateStreak(adminProtectedStreak, today);

      expect(nextDayResult).toEqual({
        streak: 26,
        lastActiveDate: "2026-10-26",
        isNewDay: true,
      });
    });
  });
});
