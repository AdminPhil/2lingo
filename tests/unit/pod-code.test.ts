import { describe, it, expect } from "vitest";
import {
  POD_CODE_ALPHABET,
  AMBIGUOUS_CHARACTERS,
  generateRandomPodCode,
  isValidPodCode,
} from "@/lib/pod-code";

describe("lib/pod-code.ts - Pod Invite Code Generator & Ambiguity Exclusion", () => {
  describe("Alphabet & Constant Integrity", () => {
    it("has exactly 32 unambiguous characters in POD_CODE_ALPHABET", () => {
      expect(POD_CODE_ALPHABET).toBe("ABCDEFGHJKLMNPQRSTUVWXYZ23456789");
      expect(POD_CODE_ALPHABET.length).toBe(32);
    });

    it("explicitly defines AMBIGUOUS_CHARACTERS as ['0', 'O', '1', 'I']", () => {
      expect(AMBIGUOUS_CHARACTERS).toEqual(["0", "O", "1", "I"]);
    });

    it("guarantees 100% exclusion of every ambiguous character from POD_CODE_ALPHABET", () => {
      for (const char of AMBIGUOUS_CHARACTERS) {
        expect(POD_CODE_ALPHABET.includes(char)).toBe(false);
      }
      expect(POD_CODE_ALPHABET).not.toMatch(/[0O1I]/);
    });

    it("contains no duplicate characters in POD_CODE_ALPHABET", () => {
      const charSet = new Set(POD_CODE_ALPHABET.split(""));
      expect(charSet.size).toBe(POD_CODE_ALPHABET.length);
    });
  });

  describe("generateRandomPodCode - Monte Carlo & Distribution Validation", () => {
    it("generates 6-character code by default", () => {
      const code = generateRandomPodCode();
      expect(code.length).toBe(6);
      expect(typeof code).toBe("string");
    });

    it("supports custom code lengths", () => {
      expect(generateRandomPodCode(4).length).toBe(4);
      expect(generateRandomPodCode(8).length).toBe(8);
      expect(generateRandomPodCode(10).length).toBe(10);
    });

    it("runs 10,000-iteration Monte Carlo assertion that every generated code conforms to /^[A-HJ-NP-Z2-9]{6}$/ with 0 failures", () => {
      const pattern = /^[A-HJ-NP-Z2-9]{6}$/;
      const iterations = 10000;
      let failureCount = 0;
      const seenCodes = new Set<string>();

      for (let i = 0; i < iterations; i++) {
        const code = generateRandomPodCode(6);

        if (!pattern.test(code)) {
          failureCount++;
        }

        // Verify none of the ambiguous characters ever appear
        if (code.includes("0") || code.includes("O") || code.includes("1") || code.includes("I")) {
          failureCount++;
        }

        seenCodes.add(code);
      }

      expect(failureCount).toBe(0);
      // Across 10,000 samples with 30-bit entropy, high uniqueness is expected
      expect(seenCodes.size).toBeGreaterThan(9950);
    });

    it("verifies uniform symbol coverage across all 32 alphabet characters over 10,000 iterations", () => {
      const counts: Record<string, number> = {};
      for (const char of POD_CODE_ALPHABET) {
        counts[char] = 0;
      }

      const totalChars = 10000 * 6; // 60,000 total characters sampled
      for (let i = 0; i < 10000; i++) {
        const code = generateRandomPodCode(6);
        for (const char of code) {
          counts[char] = (counts[char] || 0) + 1;
        }
      }

      // Expected mean count per character = 60,000 / 32 = 1,875
      // With high probability every single character appears at least 1,200 times and at most 2,500 times
      for (const char of POD_CODE_ALPHABET) {
        expect(counts[char]).toBeGreaterThan(1200);
        expect(counts[char]).toBeLessThan(2500);
      }
    });
  });

  describe("isValidPodCode Validation", () => {
    it("accepts valid generated codes", () => {
      for (let i = 0; i < 50; i++) {
        const code = generateRandomPodCode(6);
        expect(isValidPodCode(code)).toBe(true);
      }
    });

    it("accepts valid custom codes of length 3 to 10", () => {
      expect(isValidPodCode("ABC")).toBe(true);
      expect(isValidPodCode("ZAGREB")).toBe(true);
      expect(isValidPodCode("KRNK234567")).toBe(true);
      expect(isValidPodCode("23456789")).toBe(true);
    });

    it("rejects codes containing ambiguous characters", () => {
      expect(isValidPodCode("POD001")).toBe(false); // contains 0 and 1
      expect(isValidPodCode("CROAT1")).toBe(false); // contains 1
      expect(isValidPodCode("HELLO")).toBe(false);  // contains O
      expect(isValidPodCode("SPLIT")).toBe(false);  // contains I
    });

    it("rejects lowercase characters", () => {
      expect(isValidPodCode("zagreb")).toBe(false);
      expect(isValidPodCode("abc")).toBe(false);
      expect(isValidPodCode("AbcDEF")).toBe(false);
    });

    it("rejects codes that are too short (< 3 characters)", () => {
      expect(isValidPodCode("")).toBe(false);
      expect(isValidPodCode("A")).toBe(false);
      expect(isValidPodCode("AB")).toBe(false);
    });

    it("rejects codes that are too long (> 10 characters)", () => {
      expect(isValidPodCode("ABCDEFGHJK234")).toBe(false); // 13 chars
      expect(isValidPodCode("ABCDEFGHJK2")).toBe(false);   // 11 chars
    });

    it("rejects codes containing special characters or whitespace", () => {
      expect(isValidPodCode("POD-12")).toBe(false);
      expect(isValidPodCode("POD_12")).toBe(false);
      expect(isValidPodCode("POD 12")).toBe(false);
      expect(isValidPodCode("POD@12")).toBe(false);
    });

    it("rejects null, undefined, and non-string inputs safely without throwing", () => {
      expect(isValidPodCode(null as any)).toBe(false);
      expect(isValidPodCode(undefined as any)).toBe(false);
      expect(isValidPodCode(123456 as any)).toBe(false);
      expect(isValidPodCode({} as any)).toBe(false);
    });
  });
});
