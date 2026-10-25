import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { shuffleArray, cn, absoluteUrl } from "@/lib/utils";

describe("lib/utils.ts - Core Utility Functions", () => {
  describe("shuffleArray - Fisher-Yates Shuffle", () => {
    it("handles empty arrays", () => {
      const empty: number[] = [];
      const result = shuffleArray(empty);
      expect(result).toEqual([]);
      expect(result).not.toBe(empty); // returns fresh copy
    });

    it("handles single-item arrays", () => {
      const single = ["jabuka"];
      const result = shuffleArray(single);
      expect(result).toEqual(["jabuka"]);
      expect(result).not.toBe(single);
    });

    it("preserves array length and all original elements", () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = shuffleArray(original);

      expect(result).toHaveLength(original.length);
      // Contains the exact same set of elements
      expect([...result].sort((a, b) => a - b)).toEqual(original);
    });

    it("does not mutate the source array (immutability)", () => {
      const original = Object.freeze(["Zagreb", "Split", "Rijeka", "Osijek"]);
      // If it mutated, Object.freeze would throw a TypeError
      expect(() => shuffleArray(original as any)).not.toThrow();

      const mutableCopy = ["A", "B", "C", "D"];
      const shallow = [...mutableCopy];
      shuffleArray(mutableCopy);
      expect(mutableCopy).toEqual(shallow);
    });

    it("demonstrates non-deterministic permutation over multiple runs", () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      let identicalCount = 0;
      const runs = 20;

      for (let i = 0; i < runs; i++) {
        const shuffled = shuffleArray(items);
        if (shuffled.every((val, idx) => val === items[idx])) {
          identicalCount++;
        }
      }

      // The odds of a 10-item list randomly matching the exact original order 20 times in a row is 1 in (10!)^20
      expect(identicalCount).toBeLessThan(runs);
    });
  });

  describe("cn - Tailwind Class Merging & Conditional Joining", () => {
    it("joins basic space-separated class names", () => {
      expect(cn("flex", "items-center", "justify-between")).toBe(
        "flex items-center justify-between"
      );
    });

    it("filters out falsy and undefined values", () => {
      const isVisible = false;
      const hasError = true;
      const customClass = undefined;

      expect(
        cn(
          "base-class",
          isVisible && "visible",
          hasError && "text-red-500",
          null,
          undefined,
          customClass
        )
      ).toBe("base-class text-red-500");
    });

    it("resolves conflicting Tailwind padding and margin classes using twMerge", () => {
      // Later padding classes override earlier ones
      expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
      expect(cn("p-4", "p-2")).toBe("p-2");
    });

    it("resolves conflicting Tailwind color and layout utilities", () => {
      expect(cn("bg-red-500", "bg-sky-600")).toBe("bg-sky-600");
      expect(cn("block", "hidden")).toBe("hidden");
    });
  });

  describe("absoluteUrl - URL Construction", () => {
    const originalEnv = process.env.NEXT_PUBLIC_APP_URL;

    afterEach(() => {
      process.env.NEXT_PUBLIC_APP_URL = originalEnv;
    });

    it("appends path to NEXT_PUBLIC_APP_URL environment variable", () => {
      process.env.NEXT_PUBLIC_APP_URL = "https://crolingo.com";
      expect(absoluteUrl("/learn")).toBe("https://crolingo.com/learn");
      expect(absoluteUrl("/admin/pod")).toBe("https://crolingo.com/admin/pod");
    });

    it("handles localhost development base URLs", () => {
      process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
      expect(absoluteUrl("/qr-login")).toBe("http://localhost:3000/qr-login");
    });
  });
});
