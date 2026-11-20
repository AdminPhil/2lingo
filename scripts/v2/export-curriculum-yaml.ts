import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import * as fs from "fs";
import * as path from "path";
import YAML from "yaml";
import { neon } from "@neondatabase/serverless";

import { ALL_STAGES } from "../../lib/theme-registry";
import {
  CefrBand,
  GrammarLadderYaml,
  GrammarLadderYamlSchema,
  LessonKind,
  LexiconYaml,
  LexiconYamlSchema,
  WorldYaml,
  WorldYamlSchema,
} from "../../lib/v2/curriculum-schema";

/**
 * Strictly READ-ONLY (SELECT-only) v1 -> v2 Curriculum YAML Exporter.
 * Exports all 12 Worlds / 60 Units / 240 Lessons / 1,009 Challenges from Neon
 * into declarative `curriculum/worlds/world-XX.yaml`, `curriculum/lexicon.yaml`,
 * and `curriculum/grammar-ladder.yaml`.
 */

const rawDbUrl = (process.env.DATABASE_URL || "").trim().replace(/^["']|["']$/g, "");
if (!rawDbUrl || rawDbUrl.includes("placeholder@localhost")) {
  console.error("❌ DATABASE_URL is required to export live v1 curriculum into YAML.");
  process.exit(1);
}

const sql = neon(rawDbUrl);

function getCefrBandForWorld(worldOrder: number): CefrBand {
  if (worldOrder <= 2) return "Pre-A1";
  if (worldOrder <= 4) return "A1.1";
  if (worldOrder <= 6) return "A1.2";
  if (worldOrder <= 9) return "A2.1";
  if (worldOrder <= 12) return "A2.2";
  if (worldOrder <= 16) return "B1.1";
  return "B1.2";
}

function getLevelOrderForWorld(worldOrder: number): number {
  return Math.ceil(worldOrder / 4);
}

function inferLessonKind(lessonOrder: number, maxOrder: number, title: string): LessonKind {
  if (lessonOrder === maxOrder || title.toLowerCase().includes("super izazov")) {
    return "BOSS_CAPSTONE";
  }
  if (lessonOrder === 1) return "DISCOVERY";
  if (lessonOrder === 2) return "PHRASE_LISTEN";
  return "PRODUCTION";
}

function normalizeStem(word: string): string {
  return word
    .toLowerCase()
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]/g, "");
}

async function exportCurriculum() {
  console.log("=== 📦 CROLINGO v2: READ-ONLY CURRICULUM YAML EXPORTER ===\n");

  const units = (await sql`
    SELECT id, "order", title, description
    FROM units
    WHERE course_id = 1
    ORDER BY "order" ASC
  `) as { id: number; order: number; title: string; description: string }[];

  const lessons = (await sql`
    SELECT id, unit_id, "order", title
    FROM lessons
    ORDER BY unit_id ASC, "order" ASC
  `) as { id: number; unit_id: number; order: number; title: string }[];

  const challenges = (await sql`
    SELECT id, lesson_id, "order", type, question
    FROM challenges
    ORDER BY lesson_id ASC, "order" ASC
  `) as { id: number; lesson_id: number; order: number; type: "SELECT" | "ASSIST"; question: string }[];

  const options = (await sql`
    SELECT id, challenge_id, text, correct, image_src, audio_src
    FROM challenge_options
    ORDER BY challenge_id ASC, id ASC
  `) as {
    id: number;
    challenge_id: number;
    text: string;
    correct: boolean;
    image_src: string | null;
    audio_src: string | null;
  }[];

  const lessonsByUnit = new Map<number, typeof lessons>();
  for (const l of lessons) {
    if (!lessonsByUnit.has(l.unit_id)) lessonsByUnit.set(l.unit_id, []);
    lessonsByUnit.get(l.unit_id)!.push(l);
  }

  const challengesByLesson = new Map<number, typeof challenges>();
  for (const c of challenges) {
    if (!challengesByLesson.has(c.lesson_id)) challengesByLesson.set(c.lesson_id, []);
    challengesByLesson.get(c.lesson_id)!.push(c);
  }

  const optionsByChallenge = new Map<number, typeof options>();
  for (const o of options) {
    if (!optionsByChallenge.has(o.challenge_id)) optionsByChallenge.set(o.challenge_id, []);
    optionsByChallenge.get(o.challenge_id)!.push(o);
  }

  const outWorldsDir = path.join(process.cwd(), "curriculum", "worlds");
  fs.mkdirSync(outWorldsDir, { recursive: true });

  const lexemeMap = new Map<
    string,
    {
      stem: string;
      lemma: string;
      cefrBand: CefrBand;
      introducedUnitOrder: number;
      introducedWorldOrder: number;
      audioSrc: string | null;
      imageSrc: string | null;
      occurrences: number;
    }
  >();

  let totalExportedChallenges = 0;

  for (const stage of ALL_STAGES) {
    const [startUnit, endUnit] = stage.unitRange;
    const worldUnits = units.filter((u) => u.order >= startUnit && u.order <= endUnit);
    const cefrBand = getCefrBandForWorld(stage.stage);
    const levelOrder = getLevelOrderForWorld(stage.stage);

    const yamlUnits = worldUnits.map((u) => {
      const uLessons = lessonsByUnit.get(u.id) || [];
      const maxLessonOrder = uLessons.reduce((acc, l) => Math.max(acc, l.order), 4);

      return {
        order: u.order,
        legacyId: u.id,
        title: u.title,
        description: u.description,
        lessons: uLessons.map((l) => {
          const lChallenges = challengesByLesson.get(l.id) || [];
          return {
            order: l.order,
            legacyId: l.id,
            kind: inferLessonKind(l.order, maxLessonOrder, l.title),
            title: l.title,
            challenges: lChallenges.map((c) => {
              totalExportedChallenges++;
              const cOpts = optionsByChallenge.get(c.id) || [];
              const correctOpt = cOpts.find((o) => o.correct);

              // Register Lesson 1 / single-word target lexemes
              if (correctOpt) {
                const trimmed = correctOpt.text.trim();
                const words = trimmed.split(/\s+/);
                if (words.length === 1) {
                  const stem = normalizeStem(trimmed);
                  if (stem) {
                    const existing = lexemeMap.get(stem);
                    if (!existing) {
                      lexemeMap.set(stem, {
                        stem,
                        lemma: trimmed,
                        cefrBand,
                        introducedUnitOrder: u.order,
                        introducedWorldOrder: stage.stage,
                        audioSrc: correctOpt.audio_src,
                        imageSrc: correctOpt.image_src,
                        occurrences: 1,
                      });
                    } else {
                      existing.occurrences += 1;
                      if (!existing.imageSrc && correctOpt.image_src) {
                        existing.imageSrc = correctOpt.image_src;
                      }
                      if (!existing.audioSrc && correctOpt.audio_src) {
                        existing.audioSrc = correctOpt.audio_src;
                      }
                    }
                  }
                }
              }

              return {
                order: c.order,
                legacyId: c.id,
                type: c.type,
                prompt: c.question,
                grammarTags: [],
                options: cOpts.map((o) => ({
                  text: o.text,
                  correct: o.correct,
                  ...(o.image_src ? { imageSrc: o.image_src } : {}),
                  ...(o.audio_src ? { audioSrc: o.audio_src } : {}),
                })),
              };
            }),
          };
        }),
      };
    });

    const worldDoc: WorldYaml = {
      schemaVersion: 2,
      worldOrder: stage.stage,
      levelOrder,
      slug: stage.id,
      name: stage.stageName,
      badgeLabel: stage.stageBadgeLabel,
      cefrBand,
      theme: {
        solidBg: stage.solidBg,
        gradient: stage.gradient,
        badgeBg: stage.badgeBg,
        accentEmoji: stage.accentEmoji,
        buttonClass: stage.buttonClass,
        accentBorder: stage.accentBorder,
        nodeActiveBg: stage.nodeActiveBg,
        nodeBorderColor: stage.nodeBorderColor,
        nodeStrokeColor: stage.nodeStrokeColor,
        nodeBadgeClasses: stage.nodeBadgeClasses,
        nodeArrowBorder: stage.nodeArrowBorder,
      },
      units: yamlUnits,
    };

    // Validate with Zod before writing
    WorldYamlSchema.parse(worldDoc);

    const fileName = `world-${String(stage.stage).padStart(2, "0")}-${stage.id}.yaml`;
    const filePath = path.join(outWorldsDir, fileName);
    fs.writeFileSync(filePath, YAML.stringify(worldDoc, { lineWidth: 120 }), "utf-8");
    console.log(
      `  ✓ Exported ${fileName} (Units ${startUnit}-${endUnit}, ${yamlUnits.length} units)`
    );
  }

  // Export canonical lexicon.yaml
  const lexemeList = Array.from(lexemeMap.values()).sort(
    (a, b) => a.introducedUnitOrder - b.introducedUnitOrder || a.stem.localeCompare(b.stem)
  );
  const lexiconDoc: LexiconYaml = {
    schemaVersion: 2,
    generatedAt: new Date().toISOString(),
    totalLexemes: lexemeList.length,
    lexemes: lexemeList,
  };
  LexiconYamlSchema.parse(lexiconDoc);
  fs.writeFileSync(
    path.join(process.cwd(), "curriculum", "lexicon.yaml"),
    YAML.stringify(lexiconDoc, { lineWidth: 120 }),
    "utf-8"
  );
  console.log(`\n  ✓ Exported curriculum/lexicon.yaml (${lexemeList.length} canonical lexemes)`);

  // Export official 16-World (Level 1-4) CEFR Grammar Ladder specification
  const grammarLadder: GrammarLadderYaml = {
    schemaVersion: 2,
    courseName: "CroLingo Croatian (Hrvatski)",
    targetHorizonWorlds: 20,
    worlds: [
      { worldOrder: 1, levelOrder: 1, title: "Capital Adventure", cefrBand: "Pre-A1", targetAvgWords: 1.5, targetMinimalPairPct: 10, requiredMechanics: ["SELECT", "ASSIST"], grammarFocus: ["Nominative nouns", "Greetings", "Present 1sg"] },
      { worldOrder: 2, levelOrder: 1, title: "Coastal Explorer", cefrBand: "Pre-A1", targetAvgWords: 1.8, targetMinimalPairPct: 15, requiredMechanics: ["SELECT", "ASSIST", "LISTEN"], grammarFocus: ["Adjective-noun gender agreement", "Present singular"] },
      { worldOrder: 3, levelOrder: 1, title: "Nature Quest", cefrBand: "A1.1", targetAvgWords: 2.2, targetMinimalPairPct: 20, requiredMechanics: ["SELECT", "ASSIST", "LISTEN"], grammarFocus: ["Spatial prepositions (u/na/ispod) with visual diagrams", "Locative vs Accusative intro"] },
      { worldOrder: 4, levelOrder: 1, title: "King's Landing", cefrBand: "A1.1", targetAvgWords: 2.5, targetMinimalPairPct: 25, requiredMechanics: ["SELECT", "ASSIST", "LISTEN", "BUILD_SENTENCE"], grammarFocus: ["Present plural", "Simple SVO sentences", "Accusative direct objects"] },
      { worldOrder: 5, levelOrder: 2, title: "Istrian Explorer", cefrBand: "A1.2", targetAvgWords: 3.0, targetMinimalPairPct: 30, requiredMechanics: ["SELECT", "ASSIST", "LISTEN", "BUILD_SENTENCE"], grammarFocus: ["Days/time expressions", "Ordering & polite requests", "Accusative & Locative contrast"] },
      { worldOrder: 6, levelOrder: 2, title: "Slavonian Hearth", cefrBand: "A1.2", targetAvgWords: 3.3, targetMinimalPairPct: 30, requiredMechanics: ["SELECT", "ASSIST", "LISTEN", "BUILD_SENTENCE"], grammarFocus: ["Genitive of quantity/origin", "Instrumental with s/sa", "Daily household verbs"] },
      { worldOrder: 7, levelOrder: 2, title: "Zagorje Castles", cefrBand: "A2.1", targetAvgWords: 3.5, targetMinimalPairPct: 35, requiredMechanics: ["SELECT", "ASSIST", "LISTEN", "BUILD_SENTENCE"], grammarFocus: ["Past tense (Perfekt)", "Spatial directions", "Storytelling phrases"] },
      { worldOrder: 8, levelOrder: 2, title: "Tesla & Astronomy", cefrBand: "A2.1", targetAvgWords: 3.8, targetMinimalPairPct: 35, requiredMechanics: ["SELECT", "ASSIST", "LISTEN", "BUILD_SENTENCE"], grammarFocus: ["Future tense (Futur I)", "Perfekt spiral retention", "Cause & discovery clauses"] },
      { worldOrder: 9, levelOrder: 3, title: "Sinjska Alka & Cetina", cefrBand: "A2.2", targetAvgWords: 4.0, targetMinimalPairPct: 35, requiredMechanics: ["SELECT", "ASSIST", "LISTEN", "BUILD_SENTENCE"], grammarFocus: ["Reflexive verbs (se)", "Perfekt + Futur I spiral", "Dative & Locative contrast"] },
      { worldOrder: 10, levelOrder: 3, title: "Kvarner & Rijeka", cefrBand: "A2.2", targetAvgWords: 4.2, targetMinimalPairPct: 40, requiredMechanics: ["SELECT", "ASSIST", "LISTEN", "BUILD_SENTENCE"], grammarFocus: ["Maritime motion Accusative vs static Locative", "Compound clauses (jer/ali/dok)"] },
      { worldOrder: 11, levelOrder: 3, title: "Varaždin & Međimurje", cefrBand: "A2.2", targetAvgWords: 4.5, targetMinimalPairPct: 40, requiredMechanics: ["SELECT", "ASSIST", "LISTEN", "BUILD_SENTENCE"], grammarFocus: ["Instrumental without prepositions", "Conditional I intro (bih/bi/bismo)", "Cultural narrative sentences"] },
      { worldOrder: 12, levelOrder: 3, title: "Velebit & Gacka", cefrBand: "A2.2", targetAvgWords: 4.8, targetMinimalPairPct: 45, requiredMechanics: ["SELECT", "ASSIST", "LISTEN", "BUILD_SENTENCE"], grammarFocus: ["All 7 Croatian cases in context", "Subordinate clauses (kada/koji)", "Level 3 Capstone synthesis"] },
      { worldOrder: 13, levelOrder: 4, title: "Šibenik, Krka & Kornati", cefrBand: "B1.1", targetAvgWords: 5.0, targetMinimalPairPct: 45, requiredMechanics: ["SELECT", "ASSIST", "LISTEN", "BUILD_SENTENCE", "CLOZE"], grammarFocus: ["Verbal aspect pairs (pisati/napisati, gledati/pogledati)", "5-lesson arc with Cross-World Spiral"] },
      { worldOrder: 14, levelOrder: 4, title: "Split, Diocletian & Hvar", cefrBand: "B1.1", targetAvgWords: 5.2, targetMinimalPairPct: 45, requiredMechanics: ["SELECT", "ASSIST", "LISTEN", "BUILD_SENTENCE", "CLOZE"], grammarFocus: ["Conditional mood (Kondicional I) in travel & polite requests", "Relative clauses (koji/koja/koje)"] },
      { worldOrder: 15, levelOrder: 4, title: "Neretva, Ston & Korčula", cefrBand: "B1.1", targetAvgWords: 5.4, targetMinimalPairPct: 45, requiredMechanics: ["SELECT", "ASSIST", "LISTEN", "BUILD_SENTENCE", "CLOZE"], grammarFocus: ["Real-world dialogues (market, doctor, family visits)", "Imperative & Vocative mastery"] },
      { worldOrder: 16, levelOrder: 4, title: "Osijek & Baranja", cefrBand: "B1.1", targetAvgWords: 5.6, targetMinimalPairPct: 50, requiredMechanics: ["SELECT", "ASSIST", "LISTEN", "BUILD_SENTENCE", "CLOZE"], grammarFocus: ["Opinions, comparisons, and multi-clause storytelling", "Level 4 Early B1 Capstone"] },
    ],
  };
  GrammarLadderYamlSchema.parse(grammarLadder);
  fs.writeFileSync(
    path.join(process.cwd(), "curriculum", "grammar-ladder.yaml"),
    YAML.stringify(grammarLadder, { lineWidth: 120 }),
    "utf-8"
  );
  console.log(`  ✓ Exported curriculum/grammar-ladder.yaml (${grammarLadder.worlds.length} world specs)`);
  console.log(`\n✅ EXPORT COMPLETE: ${ALL_STAGES.length} Worlds, ${units.length} Units, ${totalExportedChallenges} Challenges exported cleanly!`);
}

exportCurriculum()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Export failed:", err);
    process.exit(1);
  });
