import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  POD_CODE_ALPHABET,
  AMBIGUOUS_CHARACTERS,
  generateRandomPodCode,
  isValidPodCode,
} from "@/lib/pod-code";
import { calculateStreak } from "@/lib/streak";
import { LEVEL_1_STAGES, getStageThemeForUnit } from "@/lib/theme-registry";

describe("Adversarial Stress Test Suite: Milestone 1 Verification", () => {
  // =========================================================================
  // 1. ADVERSARIAL STRESS: lib/pod-code.ts
  // =========================================================================
  describe("Pod Code: High-Volume Adversarial Generation & Ambiguity Exclusion", () => {
    it("generates 100,000 pod codes: asserts 100% exclusion of ambiguous chars ('0', 'O', '1', 'I') and valid regex", () => {
      const iterations = 100000;
      const pattern = /^[A-HJ-NP-Z2-9]{6}$/;
      const ambiguousRegex = /[0O1I]/;
      const seenCodes = new Set<string>();
      const charCounts: Record<string, number> = {};

      for (const char of POD_CODE_ALPHABET) {
        charCounts[char] = 0;
      }

      let invalidLengthCount = 0;
      let patternMismatchCount = 0;
      let ambiguousCharCount = 0;

      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        const code = generateRandomPodCode(6);

        if (code.length !== 6) invalidLengthCount++;
        if (!pattern.test(code)) patternMismatchCount++;
        if (ambiguousRegex.test(code)) ambiguousCharCount++;

        // Collect uniqueness
        seenCodes.add(code);

        // Collect character distribution
        for (let c = 0; c < 6; c++) {
          const ch = code[c];
          charCounts[ch] = (charCounts[ch] || 0) + 1;
        }
      }

      const durationMs = performance.now() - startTime;

      expect(invalidLengthCount).toBe(0);
      expect(patternMismatchCount).toBe(0);
      expect(ambiguousCharCount).toBe(0);
      expect(durationMs).toBeLessThan(8000);

      // Collision Analysis:
      // With N = 100,000 and M = 32^6 = 1,073,741,824
      // Expected collision pairs lambda = N*(N-1) / (2*M) ~ 4.65
      // Unique codes should be approximately 99,995
      const collisions = iterations - seenCodes.size;
      expect(collisions).toBeLessThan(25); // At most 25 collisions is 99.975% uniqueness
      expect(seenCodes.size).toBeGreaterThan(99950);

      // Symbol Uniformity Analysis:
      // Total characters = 600,000 across 32 symbols.
      // Expected mean per character = 18,750.
      // 3-sigma tolerance ~ +/- 405; 5-sigma tolerance ~ +/- 675.
      // Every character should fall strictly within [17500, 20000].
      for (const char of POD_CODE_ALPHABET) {
        expect(charCounts[char]).toBeGreaterThan(17500);
        expect(charCounts[char]).toBeLessThan(20000);
      }
    }, 15000);

    it("stress-tests isValidPodCode with high-volume random and boundary inputs", () => {
      // 1. Valid generated codes
      for (let i = 0; i < 1000; i++) {
        const code = generateRandomPodCode(6);
        expect(isValidPodCode(code)).toBe(true);
      }

      // 2. Custom boundary lengths
      expect(isValidPodCode("ABC")).toBe(true); // min length 3
      expect(isValidPodCode("AB")).toBe(false); // length 2 -> rejected
      expect(isValidPodCode("A")).toBe(false); // length 1 -> rejected
      expect(isValidPodCode("")).toBe(false); // length 0 -> rejected
      expect(isValidPodCode("ABCDEFGHJK")).toBe(true); // max length 10
      expect(isValidPodCode("ABCDEFGHJK2")).toBe(false); // length 11 -> rejected

      // 3. Ambiguous characters in any position
      expect(isValidPodCode("0ABCDE")).toBe(false);
      expect(isValidPodCode("ABC0DE")).toBe(false);
      expect(isValidPodCode("ABCDE0")).toBe(false);
      expect(isValidPodCode("OABCDE")).toBe(false);
      expect(isValidPodCode("ABCODE")).toBe(false);
      expect(isValidPodCode("ABCDEO")).toBe(false);
      expect(isValidPodCode("1ABCDE")).toBe(false);
      expect(isValidPodCode("ABC1DE")).toBe(false);
      expect(isValidPodCode("ABCDE1")).toBe(false);
      expect(isValidPodCode("IABCDE")).toBe(false);
      expect(isValidPodCode("ABCIDE")).toBe(false);
      expect(isValidPodCode("ABCDEI")).toBe(false);

      // 4. Lowercase and mixed-case
      expect(isValidPodCode("abcdef")).toBe(false);
      expect(isValidPodCode("Abcdef")).toBe(false);
      expect(isValidPodCode("abcDEF")).toBe(false);

      // 5. Injection and malformed characters
      expect(isValidPodCode("'; DROP TABLE pods; --")).toBe(false);
      expect(isValidPodCode("<script>")).toBe(false);
      expect(isValidPodCode("POD 12")).toBe(false);
      expect(isValidPodCode("POD-12")).toBe(false);
      expect(isValidPodCode("POD\n12")).toBe(false);
      expect(isValidPodCode("POD\t12")).toBe(false);
      expect(isValidPodCode("POD\u000012")).toBe(false);
      expect(isValidPodCode("ZAGREB🇭🇷")).toBe(false);
      expect(isValidPodCode("ŠKOLA1")).toBe(false);

      // 6. Non-string inputs
      expect(isValidPodCode(null as any)).toBe(false);
      expect(isValidPodCode(undefined as any)).toBe(false);
      expect(isValidPodCode(123456 as any)).toBe(false);
      expect(isValidPodCode(true as any)).toBe(false);
      expect(isValidPodCode([] as any)).toBe(false);
      expect(isValidPodCode({} as any)).toBe(false);
      expect(isValidPodCode(NaN as any)).toBe(false);
      expect(isValidPodCode(Infinity as any)).toBe(false);
    });

    it("verifies generateRandomPodCode handles extreme length arguments", () => {
      expect(generateRandomPodCode(0)).toBe("");
      expect(generateRandomPodCode(-1)).toBe("");
      expect(generateRandomPodCode(-100)).toBe("");
      const singleChar = generateRandomPodCode(1);
      expect(singleChar.length).toBe(1);
      expect(POD_CODE_ALPHABET.includes(singleChar)).toBe(true);

      const longCode = generateRandomPodCode(100);
      expect(longCode.length).toBe(100);
      expect(/^[A-HJ-NP-Z2-9]{100}$/.test(longCode)).toBe(true);
    });
  });

  // =========================================================================
  // 2. ADVERSARIAL STRESS: lib/streak.ts
  // =========================================================================
  describe("Streak: Daylight Saving Time, Midnight Boundaries & Malformed Inputs", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("handles UTC Midnight transitions with microsecond precision", () => {
      // Step 1: Lesson completed 1 millisecond before midnight on 2026-10-24
      vi.setSystemTime(new Date("2026-10-24T23:59:59.999Z"));
      const r1 = calculateStreak(3, "2026-10-23");
      expect(r1).toEqual({
        streak: 4,
        lastActiveDate: "2026-10-24",
        isNewDay: true,
      });

      // Step 2: Next lesson completed 2 milliseconds later at 00:00:00.001Z on 2026-10-25
      vi.setSystemTime(new Date("2026-10-25T00:00:00.001Z"));
      const r2 = calculateStreak(r1.streak, r1.lastActiveDate);
      expect(r2).toEqual({
        streak: 5,
        lastActiveDate: "2026-10-25",
        isNewDay: true,
      });

      // Step 3: Another lesson 23 hours later on the same calendar day (23:59:59.000Z)
      vi.setSystemTime(new Date("2026-10-25T23:59:59.000Z"));
      const r3 = calculateStreak(r2.streak, r2.lastActiveDate);
      expect(r3).toEqual({
        streak: 5,
        lastActiveDate: "2026-10-25",
        isNewDay: false,
      });

      // Step 4: Exactly at midnight 2026-10-26T00:00:00.000Z
      vi.setSystemTime(new Date("2026-10-26T00:00:00.000Z"));
      const r4 = calculateStreak(r3.streak, r3.lastActiveDate);
      expect(r4).toEqual({
        streak: 6,
        lastActiveDate: "2026-10-26",
        isNewDay: true,
      });
    });

    it("handles European Daylight Saving Time Spring Forward transition (March 29, 2026)", () => {
      // In Europe/Zagreb, clocks jump from 02:00 to 03:00 on Sunday, March 29, 2026
      // Under UTC, the date progression is pure ISO: 2026-03-28 -> 2026-03-29 -> 2026-03-30

      // Practice at 23:30 UTC on March 28
      vi.setSystemTime(new Date("2026-03-28T23:30:00.000Z"));
      const r1 = calculateStreak(10, "2026-03-27");
      expect(r1.streak).toBe(11);
      expect(r1.lastActiveDate).toBe("2026-03-28");

      // Practice at 02:30 UTC on March 29 (during local DST shift)
      vi.setSystemTime(new Date("2026-03-29T02:30:00.000Z"));
      const r2 = calculateStreak(r1.streak, r1.lastActiveDate);
      expect(r2.streak).toBe(12);
      expect(r2.lastActiveDate).toBe("2026-03-29");

      // Practice at 04:00 UTC on March 29 (same day)
      vi.setSystemTime(new Date("2026-03-29T04:00:00.000Z"));
      const r3 = calculateStreak(r2.streak, r2.lastActiveDate);
      expect(r3.streak).toBe(12);
      expect(r3.isNewDay).toBe(false);

      // Practice at 01:00 UTC on March 30
      vi.setSystemTime(new Date("2026-03-30T01:00:00.000Z"));
      const r4 = calculateStreak(r3.streak, r3.lastActiveDate);
      expect(r4.streak).toBe(13);
      expect(r4.lastActiveDate).toBe("2026-03-30");
      expect(r4.isNewDay).toBe(true);
    });

    it("handles European Daylight Saving Time Fall Back transition (October 25, 2026)", () => {
      // In Europe/Zagreb, clocks fall back from 03:00 to 02:00 on Sunday, October 25, 2026
      // Under UTC, dates proceed monotonically:

      // Active on Oct 24
      vi.setSystemTime(new Date("2026-10-24T22:00:00.000Z"));
      const r1 = calculateStreak(20, "2026-10-23");
      expect(r1.streak).toBe(21);
      expect(r1.lastActiveDate).toBe("2026-10-24");

      // Active on Oct 25 at 01:30 UTC
      vi.setSystemTime(new Date("2026-10-25T01:30:00.000Z"));
      const r2 = calculateStreak(r1.streak, r1.lastActiveDate);
      expect(r2.streak).toBe(22);
      expect(r2.lastActiveDate).toBe("2026-10-25");

      // Active on Oct 25 at 03:30 UTC
      vi.setSystemTime(new Date("2026-10-25T03:30:00.000Z"));
      const r3 = calculateStreak(r2.streak, r2.lastActiveDate);
      expect(r3.streak).toBe(22);
      expect(r3.isNewDay).toBe(false);

      // Active on Oct 26 at 02:00 UTC
      vi.setSystemTime(new Date("2026-10-26T02:00:00.000Z"));
      const r4 = calculateStreak(r3.streak, r3.lastActiveDate);
      expect(r4.streak).toBe(23);
      expect(r4.lastActiveDate).toBe("2026-10-26");
      expect(r4.isNewDay).toBe(true);
    });

    it("empirically tests negative and corrupt streak inputs", () => {
      vi.setSystemTime(new Date("2026-10-25T12:00:00.000Z"));
      const today = "2026-10-25";
      const yesterday = "2026-10-24";

      // Case A: Corrupted negative streak (-5) on the same day
      // Math.max(-5, 1) recovers streak to 1
      const sameDayNeg = calculateStreak(-5, today);
      expect(sameDayNeg.streak).toBe(1);
      expect(sameDayNeg.isNewDay).toBe(false);

      // Case B: Corrupted negative streak (-5) from yesterday
      // streak: currentStreak + 1 -> -5 + 1 = -4!
      // This is an adversarial edge case where negative streak propagates
      const consecNeg = calculateStreak(-5, yesterday);
      expect(consecNeg.streak).toBe(-4);
      expect(consecNeg.isNewDay).toBe(true);

      // Case C: Corrupted negative streak with gap (2+ days ago)
      // Resets cleanly to 1
      const gapNeg = calculateStreak(-5, "2026-10-20");
      expect(gapNeg.streak).toBe(1);
      expect(gapNeg.isNewDay).toBe(true);
    });

    it("handles multi-year gaps and extreme temporal disparities", () => {
      vi.setSystemTime(new Date("2026-10-25T12:00:00.000Z"));

      // 1 year gap
      expect(calculateStreak(50, "2025-10-25")).toEqual({
        streak: 1,
        lastActiveDate: "2026-10-25",
        isNewDay: true,
      });

      // 5 year gap
      expect(calculateStreak(100, "2021-01-01")).toEqual({
        streak: 1,
        lastActiveDate: "2026-10-25",
        isNewDay: true,
      });

      // 50 year gap (pre-epoch or early epoch)
      expect(calculateStreak(1, "1970-01-01")).toEqual({
        streak: 1,
        lastActiveDate: "2026-10-25",
        isNewDay: true,
      });

      // Future date (clock desync: user device set to next year)
      expect(calculateStreak(25, "2027-01-01")).toEqual({
        streak: 1,
        lastActiveDate: "2026-10-25",
        isNewDay: true,
      });

      // Malformed date strings
      expect(calculateStreak(10, "not-a-date")).toEqual({
        streak: 1,
        lastActiveDate: "2026-10-25",
        isNewDay: true,
      });

      expect(calculateStreak(10, "")).toEqual({
        streak: 1,
        lastActiveDate: "2026-10-25",
        isNewDay: true,
      });
    });
  });

  // =========================================================================
  // 3. ADVERSARIAL STRESS: lib/theme-registry.ts
  // =========================================================================
  describe("Theme Registry: Adversarial & Invalid Input Stress", () => {
    it("handles negative unit numbers safely without crashing, falling back to Stage 1", () => {
      const negativeInputs = [-1, -5, -100, -99999, -Infinity];
      for (const input of negativeInputs) {
        const theme = getStageThemeForUnit(input);
        expect(theme).toBeDefined();
        expect(theme.stage).toBe(1);
        expect(theme.id).toBe("zagreb-central");
        expect(theme.solidBg).toBe("bg-red-600");
      }
    });

    it("handles zero and large integers safely, falling back to Stage 1", () => {
      expect(getStageThemeForUnit(0).stage).toBe(1);
      expect(getStageThemeForUnit(21).stage).toBe(1);
      expect(getStageThemeForUnit(100).stage).toBe(1);
      expect(getStageThemeForUnit(999999).stage).toBe(1);
      expect(getStageThemeForUnit(Number.MAX_SAFE_INTEGER).stage).toBe(1);
      expect(getStageThemeForUnit(Infinity).stage).toBe(1);
    });

    it("handles non-integer (floating-point) inputs gracefully", () => {
      // 1.5 is between 1 and 5 -> matches Stage 1
      expect(getStageThemeForUnit(1.5).stage).toBe(1);
      expect(getStageThemeForUnit(3.7).stage).toBe(1);

      // 5.5 is between 5 and 6 -> outside [1,5] and [6,10], falls back to Stage 1
      expect(getStageThemeForUnit(5.5).stage).toBe(1);

      // 7.2 is between 6 and 10 -> matches Stage 2
      expect(getStageThemeForUnit(7.2).stage).toBe(2);

      // 10.5 is between 10 and 11 -> falls back to Stage 1
      expect(getStageThemeForUnit(10.5).stage).toBe(1);

      // 12.8 is between 11 and 15 -> matches Stage 3
      expect(getStageThemeForUnit(12.8).stage).toBe(3);

      // 15.5 is between 15 and 16 -> falls back to Stage 1
      expect(getStageThemeForUnit(15.5).stage).toBe(1);

      // 18.9 is between 16 and 20 -> matches Stage 4
      expect(getStageThemeForUnit(18.9).stage).toBe(4);

      // 20.1 is above 20 -> falls back to Stage 1
      expect(getStageThemeForUnit(20.1).stage).toBe(1);
    });

    it("handles NaN and non-numeric types safely", () => {
      expect(getStageThemeForUnit(NaN).stage).toBe(1);
      expect(getStageThemeForUnit(null as any).stage).toBe(1);
      expect(getStageThemeForUnit(undefined as any).stage).toBe(1);
      expect(getStageThemeForUnit({} as any).stage).toBe(1);
      expect(getStageThemeForUnit([] as any).stage).toBe(1);
    });

    it("verifies registry return references match LEVEL_1_STAGES definitions", () => {
      expect(getStageThemeForUnit(1)).toBe(LEVEL_1_STAGES[0]);
      expect(getStageThemeForUnit(6)).toBe(LEVEL_1_STAGES[1]);
      expect(getStageThemeForUnit(11)).toBe(LEVEL_1_STAGES[2]);
      expect(getStageThemeForUnit(16)).toBe(LEVEL_1_STAGES[3]);
    });
  });
});
