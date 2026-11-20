/**
 * CroLingo v2 XP-Calibrated Pedagogical Placement Policy
 * Preserves 100% of a learner's XP, daily streak, hearts, avatar, and Pods,
 * while placing them at an XP-calibrated World entry checkpoint so they
 * experience upgraded active-recall (LISTEN / BUILD_SENTENCE) and minimal-pair
 * curriculum cleanly.
 */

export type PlacementCheckpoint = {
  targetWorldOrder: number;
  targetUnitOrder: number;
  completedThroughUnitOrder: number; // All units 1..N marked completed (0 = none)
  label: string;
};

export function computeV2PlacementFromXp(points: number): PlacementCheckpoint {
  const xp = Math.max(0, Math.floor(Number.isFinite(points) ? points : 0));

  if (xp >= 4000) {
    return {
      targetWorldOrder: 5,
      targetUnitOrder: 21,
      completedThroughUnitOrder: 20,
      label: "Level 2 Start (World 5: Istrian Explorer, Unit 21)",
    };
  }

  if (xp >= 2000) {
    return {
      targetWorldOrder: 3,
      targetUnitOrder: 11,
      completedThroughUnitOrder: 10,
      label: "World 3 Start (Nature Quest, Unit 11)",
    };
  }

  if (xp >= 1000) {
    return {
      targetWorldOrder: 2,
      targetUnitOrder: 6,
      completedThroughUnitOrder: 5,
      label: "World 2 Start (Coastal Explorer, Unit 6)",
    };
  }

  return {
    targetWorldOrder: 1,
    targetUnitOrder: 1,
    completedThroughUnitOrder: 0,
    label: "World 1 Start (Capital Adventure, Unit 1)",
  };
}
