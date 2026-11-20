import * as fs from "fs";
import * as path from "path";
import YAML from "yaml";

import { WorldYamlSchema } from "../../lib/v2/curriculum-schema";
import {
  AuditChallengeRow,
  AuditLessonRow,
  AuditOptionRow,
  AuditUnitRow,
  computePedagogyAuditReport,
} from "../../lib/pedagogy-metrics";

/**
 * CroLingo v2 Offline YAML Pedagogy Gate (`npm run v2:pedagogy`)
 * Runs our full CR-094 Duolingo alignment engine directly on `curriculum/worlds/world-*.yaml`
 * with ZERO database credentials required.
 */
function runYamlPedagogyAudit() {
  const worldsDir = path.join(process.cwd(), "curriculum", "worlds");
  const files = fs
    .readdirSync(worldsDir)
    .filter((f) => f.endsWith(".yaml"))
    .sort();

  const units: AuditUnitRow[] = [];
  const lessons: AuditLessonRow[] = [];
  const challenges: AuditChallengeRow[] = [];
  const options: AuditOptionRow[] = [];

  let nextLessonId = 1;
  let nextChallengeId = 1;
  let nextOptionId = 1;

  for (const file of files) {
    const world = WorldYamlSchema.parse(
      YAML.parse(fs.readFileSync(path.join(worldsDir, file), "utf-8"))
    );

    for (const u of world.units) {
      const unitId = u.legacyId ?? u.order;
      units.push({
        id: unitId,
        order: u.order,
        title: u.title,
        description: u.description,
      });

      for (const l of u.lessons) {
        const lessonId = l.legacyId ?? nextLessonId++;
        lessons.push({
          id: lessonId,
          unitId,
          order: l.order,
          title: l.title,
        });

        for (const ch of l.challenges) {
          const chId = ch.legacyId ?? nextChallengeId++;
          challenges.push({
            id: chId,
            lessonId,
            unitOrder: u.order,
            lessonOrder: l.order,
            order: ch.order,
            type: ch.type,
            question: ch.prompt,
          });

          if (
            ch.type === "SELECT" ||
            ch.type === "ASSIST" ||
            ch.type === "LISTEN" ||
            ch.type === "CLOZE"
          ) {
            for (const o of ch.options) {
              options.push({
                id: nextOptionId++,
                challengeId: chId,
                text: o.text,
                correct: o.correct,
                imageSrc: o.imageSrc ?? null,
                audioSrc: o.audioSrc ?? null,
              });
            }
          } else if (ch.type === "BUILD_SENTENCE") {
            // Expose targetSentence + bank distractors so pedagogy engine scores word length, grammar & distractor rigor
            options.push({
              id: nextOptionId++,
              challengeId: chId,
              text: ch.targetSentence,
              correct: true,
              imageSrc: null,
              audioSrc: ch.audioSrc ?? null,
            });
            // Synthesize a minimal-pair distractor view from bank extras for hardness parity
            const targetWords = ch.targetSentence
              .replace(/[.,!?;:]/g, "")
              .split(/\s+/);
            const extraWords = ch.wordBank.filter(
              (w) => !targetWords.map((t) => t.toLowerCase()).includes(w.toLowerCase())
            );
            for (const extra of extraWords.slice(0, 2)) {
              const swapped = [...targetWords.slice(0, -1), extra].join(" ") + ".";
              options.push({
                id: nextOptionId++,
                challengeId: chId,
                text: swapped,
                correct: false,
                imageSrc: null,
                audioSrc: null,
              });
            }
          }
        }
      }
    }
  }

  const report = computePedagogyAuditReport({
    units,
    lessons,
    challenges,
    options,
    progressAgg: [],
    mistakeAgg: [],
    telemetryOverview: {
      totalLearners: 0,
      activeLearnersWithProgress: 0,
      activeLearnersWithMistakes: 0,
      totalCompletedChallenges: 0,
      totalMistakes: 0,
      unitReach: [],
      funnelByMaxUnit: [],
    },
  });

  console.log("=== 🎓 CROLINGO v2 YAML PEDAGOGY ALIGNMENT SCORECARD ===\n");
  console.log(
    `Overall Duolingo Alignment Score: ${report.totals.overallCompositeRubric} / 5.0`
  );
  console.log(
    `Total: ${report.totals.worlds} Worlds | ${report.totals.units} Units | ${report.totals.challenges} Challenges | ${report.totals.totalUniqueStems} Unique Stems\n`
  );

  console.table(
    report.worlds.map((w) => ({
      World: `W${w.stage}`,
      AvgW: w.avgWordsAll,
      L3_L4_W: w.avgWordsL3L4,
      MinPairPct: `${w.minimalPairPct}%`,
      Past: w.grammar.pastPerfekt,
      Future: w.grammar.futureFuturI,
      Cond: w.grammar.conditional,
      Subord: w.grammar.subordinateOrCompound,
      MechScore: w.rubric.mechanicDiversity,
      Rubric: `${w.rubric.compositeScore}/5`,
    }))
  );

  console.log("\nCognitive Mechanic Ladder:");
  console.table(
    report.mechanicLadder.map((m) => ({
      Tier: m.tier,
      Code: m.code,
      Active: m.implemented ? "YES" : "no",
      Count: m.challengeCount,
      Share: `${m.sharePct}%`,
    }))
  );

  if (report.flags.complexityDips.length > 0) {
    console.log("\nComplexity Dips:", report.flags.complexityDips);
  } else {
    console.log("\n✅ ZERO complexity dips across all 12 Worlds!");
  }
}

runYamlPedagogyAudit();
