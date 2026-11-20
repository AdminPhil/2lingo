import { describe, it, expect } from "vitest";
import { computeV2PlacementFromXp } from "@/lib/v2/placement";

describe("lib/v2/placement.ts - XP-Calibrated Pedagogical Placement", () => {
  it("places new or early learners (< 1,000 XP) at World 1 Unit 1", () => {
    expect(computeV2PlacementFromXp(0)).toMatchObject({
      targetWorldOrder: 1,
      targetUnitOrder: 1,
      completedThroughUnitOrder: 0,
    });
    expect(computeV2PlacementFromXp(220)).toMatchObject({
      targetWorldOrder: 1,
      targetUnitOrder: 1,
      completedThroughUnitOrder: 0,
    });
  });

  it("places 1,000-1,999 XP learners (e.g. Silvia 1,325 XP) at World 2 Unit 6", () => {
    expect(computeV2PlacementFromXp(1325)).toMatchObject({
      targetWorldOrder: 2,
      targetUnitOrder: 6,
      completedThroughUnitOrder: 5,
    });
  });

  it("places 2,000-3,999 XP learners (e.g. Vanessa 2,350 XP, Valentina 2,300 XP) at World 3 Unit 11", () => {
    expect(computeV2PlacementFromXp(2350)).toMatchObject({
      targetWorldOrder: 3,
      targetUnitOrder: 11,
      completedThroughUnitOrder: 10,
    });
    expect(computeV2PlacementFromXp(2300)).toMatchObject({
      targetWorldOrder: 3,
      targetUnitOrder: 11,
      completedThroughUnitOrder: 10,
    });
  });

  it("places 4,000+ XP learners (e.g. Adriana 6,870 XP) at Level 2 / World 5 Unit 21", () => {
    expect(computeV2PlacementFromXp(6870)).toMatchObject({
      targetWorldOrder: 5,
      targetUnitOrder: 21,
      completedThroughUnitOrder: 20,
    });
  });

  it("handles negative or non-finite XP safely", () => {
    expect(computeV2PlacementFromXp(-100).targetUnitOrder).toBe(1);
    expect(computeV2PlacementFromXp(Number.NaN).targetUnitOrder).toBe(1);
  });
});
