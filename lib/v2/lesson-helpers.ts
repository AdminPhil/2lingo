/**
 * CroLingo v2 Lesson & Level Helpers
 * Eliminates all hardcoded `lesson.order === 4` and `unit.order === 21/41` assumptions.
 */

export function isSuperIzazovLesson(
  lesson: { order: number; title: string; kind?: string },
  unitLessonsCountOrMaxOrder: number
): boolean {
  if (lesson.kind === "BOSS_CAPSTONE") return true;
  if (lesson.title.toLowerCase().includes("super izazov")) return true;
  return lesson.order >= unitLessonsCountOrMaxOrder && unitLessonsCountOrMaxOrder >= 4;
}

export function getLevelForUnitOrder(unitOrder: number): number {
  return Math.max(1, Math.ceil(unitOrder / 20));
}

export function getUnitRangeForLevel(level: number): [number, number] {
  const safeLevel = Math.max(1, Math.floor(level));
  const start = (safeLevel - 1) * 20 + 1;
  return [start, start + 19];
}
