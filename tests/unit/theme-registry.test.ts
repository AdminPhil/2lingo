import { describe, it, expect } from "vitest";
import { LEVEL_1_STAGES, getStageThemeForUnit, RegionTheme } from "@/lib/theme-registry";

describe("lib/theme-registry.ts - Regional Theme Registry & Unit Mapping", () => {
  describe("LEVEL_1_STAGES Registry Integrity", () => {
    it("defines exactly 4 distinct stages for Course 1", () => {
      expect(LEVEL_1_STAGES).toHaveLength(4);
      const stageNumbers = LEVEL_1_STAGES.map((s) => s.stage);
      expect(stageNumbers).toEqual([1, 2, 3, 4]);
    });

    it("has unique IDs for all 4 stages", () => {
      const ids = LEVEL_1_STAGES.map((s) => s.id);
      expect(new Set(ids).size).toBe(4);
      expect(ids).toEqual([
        "zagreb-central",
        "dalmatia-coast",
        "plitvice-slavonia",
        "dubrovnik-heritage",
      ]);
    });

    it("partitions Units 1 through 20 contiguously without gaps or overlaps", () => {
      expect(LEVEL_1_STAGES[0].unitRange).toEqual([1, 5]);
      expect(LEVEL_1_STAGES[1].unitRange).toEqual([6, 10]);
      expect(LEVEL_1_STAGES[2].unitRange).toEqual([11, 15]);
      expect(LEVEL_1_STAGES[3].unitRange).toEqual([16, 20]);
    });

    it("assigns distinct solidBg background colors to each world", () => {
      expect(LEVEL_1_STAGES[0].solidBg).toBe("bg-red-600");
      expect(LEVEL_1_STAGES[1].solidBg).toBe("bg-sky-600");
      expect(LEVEL_1_STAGES[2].solidBg).toBe("bg-emerald-600");
      expect(LEVEL_1_STAGES[3].solidBg).toBe("bg-blue-900");

      const distinctBgs = new Set(LEVEL_1_STAGES.map((s) => s.solidBg));
      expect(distinctBgs.size).toBe(4);
    });

    it("ensures all visual styling tokens are non-empty for every stage", () => {
      const requiredKeys: (keyof RegionTheme)[] = [
        "id",
        "stage",
        "stageName",
        "stageBadgeLabel",
        "solidBg",
        "gradient",
        "badgeBg",
        "accentEmoji",
        "buttonClass",
        "accentBorder",
        "nodeActiveBg",
        "nodeBorderColor",
        "nodeStrokeColor",
        "nodeBadgeClasses",
        "nodeArrowBorder",
      ];

      for (const stage of LEVEL_1_STAGES) {
        for (const key of requiredKeys) {
          expect(stage[key], `Stage ${stage.stage} missing ${key}`).toBeDefined();
          if (typeof stage[key] === "string") {
            expect((stage[key] as string).trim().length).toBeGreaterThan(0);
          }
        }
        // Validate stroke color is valid hex format
        expect(stage.nodeStrokeColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    });
  });

  describe("getStageThemeForUnit - Exhaustive Unit 1–20 Verification", () => {
    it("maps Units 1 through 5 to World 1: Zagreb Central (Stage 1, bg-red-600)", () => {
      for (let unit = 1; unit <= 5; unit++) {
        const theme = getStageThemeForUnit(unit);
        expect(theme.stage).toBe(1);
        expect(theme.id).toBe("zagreb-central");
        expect(theme.solidBg).toBe("bg-red-600");
        expect(theme.accentEmoji).toBe("🏰");
      }
    });

    it("maps Units 6 through 10 to World 2: Dalmatia Coast (Stage 2, bg-sky-600)", () => {
      for (let unit = 6; unit <= 10; unit++) {
        const theme = getStageThemeForUnit(unit);
        expect(theme.stage).toBe(2);
        expect(theme.id).toBe("dalmatia-coast");
        expect(theme.solidBg).toBe("bg-sky-600");
        expect(theme.accentEmoji).toBe("🌊");
      }
    });

    it("maps Units 11 through 15 to World 3: Plitvice & Slavonia (Stage 3, bg-emerald-600)", () => {
      for (let unit = 11; unit <= 15; unit++) {
        const theme = getStageThemeForUnit(unit);
        expect(theme.stage).toBe(3);
        expect(theme.id).toBe("plitvice-slavonia");
        expect(theme.solidBg).toBe("bg-emerald-600");
        expect(theme.accentEmoji).toBe("🌲");
      }
    });

    it("maps Units 16 through 20 to World 4: Dubrovnik Heritage (Stage 4, bg-blue-900)", () => {
      for (let unit = 16; unit <= 20; unit++) {
        const theme = getStageThemeForUnit(unit);
        expect(theme.stage).toBe(4);
        expect(theme.id).toBe("dubrovnik-heritage");
        expect(theme.solidBg).toBe("bg-blue-900");
        expect(theme.accentEmoji).toBe("👑");
      }
    });
  });

  describe("Boundary Transitions & Out-of-Bounds Fallbacks", () => {
    it("verifies crisp transition across boundary between World 1 and World 2 (5 vs 6)", () => {
      const unit5 = getStageThemeForUnit(5);
      const unit6 = getStageThemeForUnit(6);

      expect(unit5.stage).toBe(1);
      expect(unit5.solidBg).toBe("bg-red-600");

      expect(unit6.stage).toBe(2);
      expect(unit6.solidBg).toBe("bg-sky-600");
    });

    it("verifies crisp transition across boundary between World 2 and World 3 (10 vs 11)", () => {
      const unit10 = getStageThemeForUnit(10);
      const unit11 = getStageThemeForUnit(11);

      expect(unit10.stage).toBe(2);
      expect(unit10.solidBg).toBe("bg-sky-600");

      expect(unit11.stage).toBe(3);
      expect(unit11.solidBg).toBe("bg-emerald-600");
    });

    it("verifies crisp transition across boundary between World 3 and World 4 (15 vs 16)", () => {
      const unit15 = getStageThemeForUnit(15);
      const unit16 = getStageThemeForUnit(16);

      expect(unit15.stage).toBe(3);
      expect(unit15.solidBg).toBe("bg-emerald-600");

      expect(unit16.stage).toBe(4);
      expect(unit16.solidBg).toBe("bg-blue-900");
    });

    it("verifies crisp transition across boundary between World 4 and World 5 (20 vs 21)", () => {
      const unit20 = getStageThemeForUnit(20);
      const unit21 = getStageThemeForUnit(21);

      expect(unit20.stage).toBe(4);
      expect(unit20.solidBg).toBe("bg-blue-900");

      expect(unit21.stage).toBe(5);
      expect(unit21.id).toBe("istria-kvarner");
      expect(unit21.solidBg).toBe("bg-amber-600");
    });

    it("falls back to Stage 1 (Zagreb) for out-of-bounds lower numbers (Unit 0, negative numbers)", () => {
      const unit0 = getStageThemeForUnit(0);
      expect(unit0.stage).toBe(1);
      expect(unit0.id).toBe("zagreb-central");
      expect(unit0.solidBg).toBe("bg-red-600");

      const negativeUnit = getStageThemeForUnit(-5);
      expect(negativeUnit.stage).toBe(1);
      expect(negativeUnit.id).toBe("zagreb-central");
    });

    it("falls back to Stage 1 (Zagreb) for out-of-bounds higher numbers (Unit 26, Unit 100)", () => {
      const unit26 = getStageThemeForUnit(26);
      expect(unit26.stage).toBe(1);
      expect(unit26.id).toBe("zagreb-central");
      expect(unit26.solidBg).toBe("bg-red-600");

      const unit100 = getStageThemeForUnit(100);
      expect(unit100.stage).toBe(1);
      expect(unit100.id).toBe("zagreb-central");
    });
  });
});
