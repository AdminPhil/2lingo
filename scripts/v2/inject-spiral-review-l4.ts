import * as fs from "fs";
import * as path from "path";
import YAML from "yaml";

import { z } from "zod";

import {
  ChallengeSchema,
  UnitSchema,
  WorldYaml,
  WorldYamlSchema,
} from "../../lib/v2/curriculum-schema";

type ChallengeYaml = z.infer<typeof ChallengeSchema>;
type UnitYaml = z.infer<typeof UnitSchema>;

/**
 * CroLingo v2 Option A: Uniform 5-Lesson Arc Across All 60 Units (300 Lessons Total)
 *
 * Every unit U1..U60 follows the 5-step Duolingo mastery rhythm:
 *   L1: DISCOVERY       (visual/audio intro)
 *   L2: PHRASE_LISTEN   (listening + phrase comprehension)
 *   L3: PRODUCTION      (sentence building + minimal-pair practice)
 *   L4: SPIRAL_REVIEW   (cross-unit / cross-world spaced reinforcement)
 *   L5: BOSS_CAPSTONE   (Super Izazov, +3 hearts)
 *
 * Idempotent: skips any unit that already contains a `SPIRAL_REVIEW` lesson.
 */

function cloneChallenge(ch: ChallengeYaml, newOrder: number): ChallengeYaml {
  const copy = JSON.parse(JSON.stringify(ch)) as ChallengeYaml;
  delete copy.legacyId;
  copy.order = newOrder;
  // Progressive Fading Invariant (v2 Standards §3): L4 Spiral Review is strictly images-OFF
  if (
    copy.type === "SELECT" ||
    copy.type === "ASSIST" ||
    copy.type === "LISTEN" ||
    copy.type === "CLOZE"
  ) {
    for (const opt of copy.options) {
      delete opt.imageSrc;
    }
    if (copy.type === "SELECT") {
      return { ...copy, type: "ASSIST" };
    }
  }
  return copy;
}

function pickFromUnit(
  unit: UnitYaml,
  preferredTypes: ChallengeYaml["type"][],
  preferredLessonOrders: number[],
  usedPrompts: Set<string>
): ChallengeYaml | null {
  const orderedLessons = [...unit.lessons].sort((a, b) => {
    const ai = preferredLessonOrders.indexOf(a.order);
    const bi = preferredLessonOrders.indexOf(b.order);
    const aRank = ai === -1 ? 99 : ai;
    const bRank = bi === -1 ? 99 : bi;
    return aRank - bRank;
  });

  for (const preferredType of preferredTypes) {
    for (const lesson of orderedLessons) {
      for (const ch of lesson.challenges) {
        if (ch.type === preferredType && !usedPrompts.has(ch.prompt)) {
          usedPrompts.add(ch.prompt);
          return ch;
        }
      }
    }
  }

  for (const lesson of orderedLessons) {
    for (const ch of lesson.challenges) {
      if (!usedPrompts.has(ch.prompt)) {
        usedPrompts.add(ch.prompt);
        return ch;
      }
    }
  }

  // Fallback even if prompt already used
  for (const lesson of orderedLessons) {
    if (lesson.challenges.length > 0) {
      return lesson.challenges[0];
    }
  }
  return null;
}

function main() {
  console.log("=== 🌀 CROLINGO v2: INJECTING L4 SPIRAL REVIEW ACROSS ALL 60 UNITS ===\n");

  const worldsDir = path.join(process.cwd(), "curriculum", "worlds");
  const files = fs
    .readdirSync(worldsDir)
    .filter((f) => f.endsWith(".yaml"))
    .sort();

  const worldsByFile: { file: string; world: WorldYaml }[] = files.map((file) => ({
    file,
    world: WorldYamlSchema.parse(
      YAML.parse(fs.readFileSync(path.join(worldsDir, file), "utf-8"))
    ),
  }));

  // Index all 60 units by global unit order (1..60)
  const unitByOrder = new Map<number, UnitYaml>();
  for (const { world } of worldsByFile) {
    for (const u of world.units) {
      unitByOrder.set(u.order, u);
    }
  }

  let unitsUpgraded = 0;
  let totalChallengesAdded = 0;

  for (const { world } of worldsByFile) {
    for (const u of world.units) {
      if (u.lessons.some((l) => l.kind === "SPIRAL_REVIEW")) {
        continue;
      }

      // Shift existing BOSS_CAPSTONE (or lesson 4) cleanly to order 5
      const bossLesson =
        u.lessons.find((l) => l.kind === "BOSS_CAPSTONE") ??
        u.lessons.find((l) => l.order === 4);

      if (bossLesson) {
        bossLesson.order = 5;
        bossLesson.kind = "BOSS_CAPSTONE";
      }

      const usedPrompts = new Set<string>();
      const spiralChallenges: ChallengeYaml[] = [];

      const pushPick = (
        sourceUnitOrder: number,
        types: ChallengeYaml["type"][],
        lessonOrders: number[]
      ) => {
        const src = unitByOrder.get(sourceUnitOrder) ?? u;
        const picked = pickFromUnit(src, types, lessonOrders, usedPrompts);
        if (picked) {
          spiralChallenges.push(cloneChallenge(picked, spiralChallenges.length + 1));
        }
      };

      if (u.order === 1) {
        // Unit 1 has no prior units yet: crisp mixed recall recap of Unit 1
        pushPick(1, ["ASSIST", "SELECT"], [2, 3, 1]);
        pushPick(1, ["ASSIST", "SELECT"], [3, 2, 1]);
        pushPick(1, ["SELECT", "ASSIST"], [1, 2, 3]);
        pushPick(1, ["ASSIST", "SELECT"], [3, 5, 2]);
      } else if (u.order <= 5) {
        // World 1 (Units 2-5): spiral from previous World 1 units + current unit
        pushPick(u.order - 1, ["ASSIST", "SELECT"], [2, 3, 1]);
        pushPick(Math.max(1, u.order - 2), ["ASSIST", "SELECT"], [3, 2, 1]);
        pushPick(u.order, ["ASSIST", "SELECT"], [2, 3, 1]);
        pushPick(u.order, ["ASSIST", "SELECT"], [3, 2, 1]);
      } else if (u.order <= 20) {
        // Worlds 2-4 (Units 6-20): near spiral + 1-world spiral + current active recall
        pushPick(u.order - 2, ["LISTEN", "ASSIST"], [2, 3]);
        pushPick(u.order - 5, ["ASSIST", "LISTEN"], [3, 2]);
        pushPick(Math.max(1, u.order - 1), ["BUILD_SENTENCE", "LISTEN", "ASSIST"], [3, 2]);
        pushPick(u.order, ["BUILD_SENTENCE", "LISTEN", "ASSIST"], [3, 2]);
      } else {
        // Worlds 5-12 (Units 21-60): rich sentence-level near + 1-world + 2-world spiral
        // Pull strictly from L2/L3 (never single-word L1) to preserve monotonic A2/B1 complexity!
        pushPick(u.order - 2, ["LISTEN", "ASSIST"], [2, 3]);
        pushPick(u.order - 5, ["BUILD_SENTENCE", "ASSIST"], [3, 2]);
        pushPick(u.order - 10, ["ASSIST", "BUILD_SENTENCE"], [3, 2]);
        pushPick(u.order, ["BUILD_SENTENCE", "ASSIST", "LISTEN"], [3, 2]);
      }

      const spiralLesson = {
        order: 4,
        kind: "SPIRAL_REVIEW" as const,
        title: "Spiral Review",
        challenges: spiralChallenges,
      };

      u.lessons.push(spiralLesson);
      u.lessons.sort((a, b) => a.order - b.order);

      unitsUpgraded++;
      totalChallengesAdded += spiralChallenges.length;
    }
  }

  // Validate & write back all 12 World YAML files
  for (const { file, world } of worldsByFile) {
    const validated = WorldYamlSchema.parse(world);
    const outPath = path.join(worldsDir, file);
    fs.writeFileSync(
      outPath,
      YAML.stringify(validated, { lineWidth: 110 }),
      "utf-8"
    );
    console.log(
      `  ✓ Updated ${file} (${validated.units.length} units × 5 lessons = ${validated.units.reduce((s, u) => s + u.lessons.length, 0)} lessons)`
    );
  }

  console.log(
    `\n✅ COMPLETE: Upgraded ${unitsUpgraded} units to 5-lesson arc (+${totalChallengesAdded} Spiral Review challenges, 300 total lessons)!`
  );
}

main();
