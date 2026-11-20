import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import * as fs from "fs";
import * as path from "path";
import YAML from "yaml";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

import * as schemaV2 from "../../db/schema.v2";
import {
  LexiconYamlSchema,
  WorldYaml,
  WorldYamlSchema,
} from "../../lib/v2/curriculum-schema";

/**
 * CroLingo v2 Deterministic YAML -> Lakebase Postgres Compiler
 * SAFETY GUARDRAIL: Strictly requires `DATABASE_URL_V2` (isolated Neon `v2-dev` branch)
 * and refuses to write to production `DATABASE_URL` unless `--allow-prod-cutover` is explicitly passed.
 */

const allowProd = process.argv.includes("--allow-prod-cutover");
const targetUrl = (process.env.DATABASE_URL_V2 || "").trim().replace(/^["']|["']$/g, "");
const prodUrl = (process.env.DATABASE_URL || "").trim().replace(/^["']|["']$/g, "");

if (!targetUrl) {
  console.error(
    "❌ Missing DATABASE_URL_V2. Create an isolated Neon `v2-dev` branch and set DATABASE_URL_V2 in .env.local before compiling v2 curriculum."
  );
  process.exit(1);
}

if (!allowProd && prodUrl && targetUrl === prodUrl) {
  console.error(
    "❌ SAFETY LOCK: DATABASE_URL_V2 matches production DATABASE_URL! Pass --allow-prod-cutover ONLY during the planned production cutover window."
  );
  process.exit(1);
}

const sql = neon(targetUrl);
// @ts-ignore - neon-http client generic variance with drizzle-orm 0.30
const db = drizzle(sql, { schema: schemaV2 });

const LEVEL_METADATA: Record<
  number,
  { title: string; croatianTitle: string; cefrRange: string }
> = {
  1: { title: "Level 1: First Steps", croatianTitle: "Prvi Koraci", cefrRange: "Pre-A1 → A1.1" },
  2: { title: "Level 2: Young Explorer", croatianTitle: "Mali Istraživač", cefrRange: "A1.2 → A2.1" },
  3: { title: "Level 3: Grand Adventurer", croatianTitle: "Veliki Pustolov", cefrRange: "A2.2" },
  4: { title: "Level 4: Conversational Bridge", croatianTitle: "Most Razgovora", cefrRange: "B1.1" },
  5: { title: "Level 5: Heritage Fluency", croatianTitle: "Majstor Jezika", cefrRange: "B1.2" },
};

async function compileV2Curriculum() {
  console.log("=== 🚀 CROLINGO v2 CURRICULUM COMPILER (YAML -> NEON v2-dev) ===\n");

  const curriculumDir = path.join(process.cwd(), "curriculum");
  const worldsDir = path.join(curriculumDir, "worlds");
  const worldFiles = fs
    .readdirSync(worldsDir)
    .filter((f) => f.endsWith(".yaml"))
    .sort();

  const parsedWorlds: WorldYaml[] = worldFiles.map((file) =>
    WorldYamlSchema.parse(YAML.parse(fs.readFileSync(path.join(worldsDir, file), "utf-8")))
  );
  const lexicon = LexiconYamlSchema.parse(
    YAML.parse(fs.readFileSync(path.join(curriculumDir, "lexicon.yaml"), "utf-8"))
  );

  // 1. Ensure Croatian course exists
  let [course] = await db
    .select()
    .from(schemaV2.courses)
    .where(eq(schemaV2.courses.slug, "croatian"));

  if (!course) {
    [course] = await db
      .insert(schemaV2.courses)
      .values({ slug: "croatian", title: "Croatian (Hrvatski)", imageSrc: "/hr.svg" })
      .returning();
  }
  console.log(`✓ Course ready: ${course.title} (id=${course.id})`);

  // 2. Upsert Levels
  const levelOrders = Array.from(new Set(parsedWorlds.map((w) => w.levelOrder))).sort((a, b) => a - b);
  const levelIdByOrder = new Map<number, number>();
  for (const lOrder of levelOrders) {
    const meta = LEVEL_METADATA[lOrder] || {
      title: `Level ${lOrder}`,
      croatianTitle: `Razina ${lOrder}`,
      cefrRange: "B1",
    };
    const existing = await db.query.levels.findFirst({
      where: (lvl, { and, eq: eqOp }) =>
        and(eqOp(lvl.courseId, course.id), eqOp(lvl.order, lOrder)),
    });
    if (existing) {
      levelIdByOrder.set(lOrder, existing.id);
    } else {
      const [inserted] = await db
        .insert(schemaV2.levels)
        .values({
          courseId: course.id,
          order: lOrder,
          title: meta.title,
          croatianTitle: meta.croatianTitle,
          cefrRange: meta.cefrRange,
        })
        .returning();
      levelIdByOrder.set(lOrder, inserted.id);
    }
  }
  console.log(`✓ Levels synced: ${levelOrders.length}`);

  // 3. Upsert Lexemes
  for (const lex of lexicon.lexemes) {
    await db
      .insert(schemaV2.lexemes)
      .values({
        courseId: course.id,
        stem: lex.stem,
        lemma: lex.lemma,
        cefrBand: lex.cefrBand,
        introducedUnitOrder: lex.introducedUnitOrder,
        audioSrc: lex.audioSrc ?? null,
        imageSrc: lex.imageSrc ?? null,
      })
      .onConflictDoNothing();
  }
  console.log(`✓ Lexemes synced: ${lexicon.lexemes.length}`);

  // 4. Compile Worlds -> Units -> Lessons -> Challenges
  let compiledUnits = 0;
  let compiledLessons = 0;
  let compiledChallenges = 0;

  for (const w of parsedWorlds) {
    const levelId = levelIdByOrder.get(w.levelOrder)!;
    let worldRow = await db.query.worlds.findFirst({
      where: (wr, { eq: eqOp }) => eqOp(wr.slug, w.slug),
    });

    if (!worldRow) {
      [worldRow] = await db
        .insert(schemaV2.worlds)
        .values({
          levelId,
          order: w.worldOrder,
          slug: w.slug,
          name: w.name,
          badgeLabel: w.badgeLabel,
          cefrBand: w.cefrBand,
          themeTokens: w.theme,
        })
        .returning();
    }

    for (const u of w.units) {
      compiledUnits++;
      let unitRow = await db.query.units.findFirst({
        where: (ur, { and, eq: eqOp }) =>
          and(eqOp(ur.worldId, worldRow!.id), eqOp(ur.order, u.order)),
      });
      if (!unitRow) {
        [unitRow] = await db
          .insert(schemaV2.units)
          .values({
            worldId: worldRow.id,
            order: u.order,
            title: u.title,
            description: u.description,
          })
          .returning();
      }

      for (const l of u.lessons) {
        compiledLessons++;
        let lessonRow = await db.query.lessons.findFirst({
          where: (lr, { and, eq: eqOp }) =>
            and(eqOp(lr.unitId, unitRow!.id), eqOp(lr.order, l.order)),
        });
        if (!lessonRow) {
          [lessonRow] = await db
            .insert(schemaV2.lessons)
            .values({
              unitId: unitRow.id,
              order: l.order,
              kind: l.kind,
              title: l.title,
            })
            .returning();
        }

        for (const ch of l.challenges) {
          compiledChallenges++;
          let chRow = await db.query.challenges.findFirst({
            where: (cr, { and, eq: eqOp }) =>
              and(eqOp(cr.lessonId, lessonRow!.id), eqOp(cr.order, ch.order)),
          });

          const payload = { ...ch } as Record<string, unknown>;
          if (!chRow) {
            [chRow] = await db
              .insert(schemaV2.challenges)
              .values({
                lessonId: lessonRow.id,
                order: ch.order,
                type: ch.type,
                prompt: ch.prompt,
                payload,
                grammarTags: ch.grammarTags,
              })
              .returning();
          } else {
            await db
              .update(schemaV2.challenges)
              .set({
                type: ch.type,
                prompt: ch.prompt,
                payload,
                grammarTags: ch.grammarTags,
              })
              .where(eq(schemaV2.challenges.id, chRow.id));
            await db
              .delete(schemaV2.challengeOptions)
              .where(eq(schemaV2.challengeOptions.challengeId, chRow.id));
          }

          if (
            ch.type === "SELECT" ||
            ch.type === "ASSIST" ||
            ch.type === "LISTEN" ||
            ch.type === "CLOZE"
          ) {
            await db.insert(schemaV2.challengeOptions).values(
              ch.options.map((o) => ({
                challengeId: chRow!.id,
                text: o.text,
                correct: o.correct,
                imageSrc: o.imageSrc ?? null,
                audioSrc: o.audioSrc ?? null,
              }))
            );
          }
        }
      }
    }
    console.log(`  ✓ Compiled World ${w.worldOrder}: ${w.name}`);
  }

  console.log(
    `\n✅ v2 COMPILATION COMPLETE: ${parsedWorlds.length} Worlds, ${compiledUnits} Units, ${compiledLessons} Lessons, ${compiledChallenges} Challenges.`
  );
}

compileV2Curriculum()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ v2 Compilation failed:", err);
    process.exit(1);
  });
