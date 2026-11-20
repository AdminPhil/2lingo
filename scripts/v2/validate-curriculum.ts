import * as fs from "fs";
import * as path from "path";
import YAML from "yaml";

import {
  GrammarLadderYamlSchema,
  LexiconYamlSchema,
  WorldYamlSchema,
} from "../../lib/v2/curriculum-schema";

/**
 * CroLingo v2 Compile-Time Curriculum Validator
 * Runs 100% offline with zero DB credentials required.
 * Validates all YAML worlds, lexicon, grammar ladder, and disk .svg/.mp3 assets.
 */
function validateCurriculum() {
  console.log("=== 🛡️ CROLINGO v2 CURRICULUM COMPILER & VALIDATOR ===\n");

  const curriculumDir = path.join(process.cwd(), "curriculum");
  const worldsDir = path.join(curriculumDir, "worlds");
  const publicDir = path.join(process.cwd(), "public");

  let errors = 0;
  let totalUnits = 0;
  let totalLessons = 0;
  let totalChallenges = 0;
  let totalAssetRefs = 0;

  const checkAsset = (relPath: string | null | undefined, context: string) => {
    if (!relPath) return;
    totalAssetRefs++;
    const fullPath = path.join(publicDir, relPath.replace(/^\//, ""));
    if (!fs.existsSync(fullPath)) {
      console.error(`[ASSET MISSING] ${context}: public/${relPath.replace(/^\//, "")}`);
      errors++;
    } else if (fs.statSync(fullPath).size === 0) {
      console.error(`[ASSET EMPTY] ${context}: public/${relPath.replace(/^\//, "")}`);
      errors++;
    }
  };

  // 1. Validate Grammar Ladder
  const ladderPath = path.join(curriculumDir, "grammar-ladder.yaml");
  const ladder = GrammarLadderYamlSchema.parse(
    YAML.parse(fs.readFileSync(ladderPath, "utf-8"))
  );
  console.log(`✓ grammar-ladder.yaml valid (${ladder.worlds.length} world milestones)`);

  // 2. Validate Lexicon
  const lexiconPath = path.join(curriculumDir, "lexicon.yaml");
  const lexicon = LexiconYamlSchema.parse(
    YAML.parse(fs.readFileSync(lexiconPath, "utf-8"))
  );
  for (const lex of lexicon.lexemes) {
    checkAsset(lex.audioSrc, `lexicon:${lex.stem}`);
    checkAsset(lex.imageSrc, `lexicon:${lex.stem}`);
  }
  console.log(`✓ lexicon.yaml valid (${lexicon.totalLexemes} canonical lexemes)`);

  // 3. Validate World YAML files
  const worldFiles = fs
    .readdirSync(worldsDir)
    .filter((f) => f.endsWith(".yaml"))
    .sort();

  const seenWorldOrders = new Set<number>();
  const seenUnitOrders = new Set<number>();

  for (const file of worldFiles) {
    const raw = YAML.parse(fs.readFileSync(path.join(worldsDir, file), "utf-8"));
    const world = WorldYamlSchema.parse(raw);

    if (seenWorldOrders.has(world.worldOrder)) {
      console.error(`[DUPLICATE WORLD] World ${world.worldOrder} duplicated in ${file}`);
      errors++;
    }
    seenWorldOrders.add(world.worldOrder);

    for (const unit of world.units) {
      if (seenUnitOrders.has(unit.order)) {
        console.error(`[DUPLICATE UNIT] Unit ${unit.order} duplicated in ${file}`);
        errors++;
      }
      seenUnitOrders.add(unit.order);
      totalUnits++;

      for (const lesson of unit.lessons) {
        totalLessons++;
        for (const ch of lesson.challenges) {
          totalChallenges++;
          const ctx = `${file} U${unit.order} L${lesson.order} Ch${ch.order}`;

          if (ch.type === "SELECT" || ch.type === "ASSIST" || ch.type === "LISTEN" || ch.type === "CLOZE") {
            const correctCount = ch.options.filter((o) => o.correct).length;
            if (correctCount !== 1) {
              console.error(`[OPTION INTEGRITY] ${ctx}: expected 1 correct option, got ${correctCount}`);
              errors++;
            }
            const seenTexts = new Set<string>();
            for (const opt of ch.options) {
              const norm = opt.text.trim().toLowerCase();
              if (seenTexts.has(norm)) {
                console.error(`[DUPLICATE OPTION] ${ctx}: "${opt.text}"`);
                errors++;
              }
              seenTexts.add(norm);
              checkAsset(opt.imageSrc, `${ctx} (${opt.text})`);
              checkAsset(opt.audioSrc, `${ctx} (${opt.text})`);
            }
            if (ch.type === "LISTEN" || ch.type === "CLOZE") {
              checkAsset(ch.audioSrc, ctx);
            }
          } else if (ch.type === "BUILD_SENTENCE") {
            checkAsset(ch.audioSrc, ctx);
          } else if (ch.type === "MATCH_PAIRS") {
            for (const p of ch.pairs) {
              checkAsset(p.audioSrc, `${ctx} (${p.croatian})`);
            }
          }
        }
      }
    }
  }

  console.log(
    `\nSummary: ${worldFiles.length} Worlds, ${totalUnits} Units, ${totalLessons} Lessons, ${totalChallenges} Challenges, ${totalAssetRefs} Asset Refs checked.`
  );

  if (errors > 0) {
    console.error(`\n❌ v2 CURRICULUM VALIDATION FAILED: ${errors} error(s)!`);
    process.exit(1);
  }
  console.log("\n✅ v2 CURRICULUM VALIDATION PASSED: 0 schema or asset errors!");
}

validateCurriculum();
