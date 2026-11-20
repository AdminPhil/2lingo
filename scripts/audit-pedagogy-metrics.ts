import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";
import {
  AuditChallengeRow,
  AuditFunnelRow,
  AuditLessonRow,
  AuditMistakeAggRow,
  AuditOptionRow,
  AuditProgressAggRow,
  AuditTelemetryOverview,
  AuditUnitReachRow,
  AuditUnitRow,
  computePedagogyAuditReport,
  formatReportAsMarkdown,
  formatUnitsAsCsv,
  formatWorldsAsCsv,
} from "../lib/pedagogy-metrics";

const rawDbUrl = (process.env.DATABASE_URL || "").trim().replace(/^["']|["']$/g, "");
const isOfflinePlaceholder = !rawDbUrl || rawDbUrl.includes("placeholder@localhost");

type OutputFormat = "markdown" | "json" | "csv-worlds" | "csv-units";

function parseArgs(argv: string[]): { format: OutputFormat; outPath: string | null } {
  let format: OutputFormat = "markdown";
  let outPath: string | null = null;

  for (const arg of argv) {
    if (arg.startsWith("--format=")) {
      const val = arg.slice("--format=".length).toLowerCase();
      if (val === "markdown" || val === "json" || val === "csv-worlds" || val === "csv-units") {
        format = val;
      } else {
        throw new Error(`Unsupported --format value: ${val}. Expected markdown|json|csv-worlds|csv-units`);
      }
    } else if (arg.startsWith("--out=")) {
      outPath = arg.slice("--out=".length).trim() || null;
    }
  }
  return { format, outPath };
}

async function runReadOnlyAudit() {
  const { format, outPath } = parseArgs(process.argv.slice(2));

  if (isOfflinePlaceholder) {
    console.error("❌ DATABASE_URL is not configured. Pedagogical telemetry audit requires read-only Neon DB access.");
    process.exit(1);
  }

  const sql = neon(rawDbUrl);

  // Strictly READ-ONLY SELECT queries (zero mutations, zero PII exported)
  const [
    unitRowsRaw,
    lessonRowsRaw,
    challengeRowsRaw,
    optionRowsRaw,
    progressAggRaw,
    mistakeAggRaw,
    overviewRaw,
    unitReachRaw,
    funnelRaw,
  ] = await Promise.all([
    sql`
      SELECT id, "order", title, description
      FROM units
      WHERE course_id = 1
      ORDER BY "order"
    `,
    sql`
      SELECT l.id, l.unit_id, l."order", l.title
      FROM lessons l
      JOIN units u ON l.unit_id = u.id
      WHERE u.course_id = 1
      ORDER BY u."order", l."order"
    `,
    sql`
      SELECT c.id, c.lesson_id, u."order" AS unit_order, l."order" AS lesson_order, c."order", c.type, c.question
      FROM challenges c
      JOIN lessons l ON c.lesson_id = l.id
      JOIN units u ON l.unit_id = u.id
      WHERE u.course_id = 1
      ORDER BY u."order", l."order", c."order"
    `,
    sql`
      SELECT co.id, co.challenge_id, co.text, co.correct, co.image_src, co.audio_src
      FROM challenge_options co
      JOIN challenges c ON co.challenge_id = c.id
      JOIN lessons l ON c.lesson_id = l.id
      JOIN units u ON l.unit_id = u.id
      WHERE u.course_id = 1
      ORDER BY co.challenge_id, co.id
    `,
    sql`
      SELECT cp.challenge_id,
             COUNT(*)::int AS completions,
             COUNT(DISTINCT cp.user_id)::int AS unique_users
      FROM challenge_progress cp
      JOIN challenges c ON cp.challenge_id = c.id
      JOIN lessons l ON c.lesson_id = l.id
      JOIN units u ON l.unit_id = u.id
      WHERE cp.completed = true AND u.course_id = 1
      GROUP BY cp.challenge_id
    `,
    sql`
      SELECT cm.challenge_id,
             COUNT(*)::int AS mistake_count,
             COUNT(DISTINCT cm.user_id)::int AS unique_users
      FROM challenge_mistakes cm
      JOIN challenges c ON cm.challenge_id = c.id
      JOIN lessons l ON c.lesson_id = l.id
      JOIN units u ON l.unit_id = u.id
      WHERE u.course_id = 1
      GROUP BY cm.challenge_id
    `,
    sql`
      SELECT
        (SELECT COUNT(*)::int FROM user_progress) AS total_learners,
        (SELECT COUNT(DISTINCT cp.user_id)::int
         FROM challenge_progress cp
         JOIN challenges c ON cp.challenge_id = c.id
         JOIN lessons l ON c.lesson_id = l.id
         JOIN units u ON l.unit_id = u.id
         WHERE cp.completed = true AND u.course_id = 1) AS active_learners_with_progress,
        (SELECT COUNT(DISTINCT cm.user_id)::int
         FROM challenge_mistakes cm
         JOIN challenges c ON cm.challenge_id = c.id
         JOIN lessons l ON c.lesson_id = l.id
         JOIN units u ON l.unit_id = u.id
         WHERE u.course_id = 1) AS active_learners_with_mistakes,
        (SELECT COUNT(*)::int
         FROM challenge_progress cp
         JOIN challenges c ON cp.challenge_id = c.id
         JOIN lessons l ON c.lesson_id = l.id
         JOIN units u ON l.unit_id = u.id
         WHERE cp.completed = true AND u.course_id = 1) AS total_completed_challenges,
        (SELECT COUNT(*)::int
         FROM challenge_mistakes cm
         JOIN challenges c ON cm.challenge_id = c.id
         JOIN lessons l ON c.lesson_id = l.id
         JOIN units u ON l.unit_id = u.id
         WHERE u.course_id = 1) AS total_mistakes
    `,
    sql`
      SELECT u."order" AS unit_order,
             COUNT(DISTINCT cp.user_id)::int AS unique_users
      FROM challenge_progress cp
      JOIN challenges c ON cp.challenge_id = c.id
      JOIN lessons l ON c.lesson_id = l.id
      JOIN units u ON l.unit_id = u.id
      WHERE cp.completed = true AND u.course_id = 1
      GROUP BY u."order"
      ORDER BY u."order"
    `,
    sql`
      SELECT max_unit_order, COUNT(*)::int AS learner_count
      FROM (
        SELECT cp.user_id, MAX(u."order")::int AS max_unit_order
        FROM challenge_progress cp
        JOIN challenges c ON cp.challenge_id = c.id
        JOIN lessons l ON c.lesson_id = l.id
        JOIN units u ON l.unit_id = u.id
        WHERE cp.completed = true AND u.course_id = 1
        GROUP BY cp.user_id
      ) per_user
      GROUP BY max_unit_order
      ORDER BY max_unit_order
    `,
  ]);

  const units: AuditUnitRow[] = unitRowsRaw.map((r: any) => ({
    id: Number(r.id),
    order: Number(r.order),
    title: String(r.title),
    description: String(r.description),
  }));

  const lessons: AuditLessonRow[] = lessonRowsRaw.map((r: any) => ({
    id: Number(r.id),
    unitId: Number(r.unit_id),
    order: Number(r.order),
    title: String(r.title),
  }));

  const challenges: AuditChallengeRow[] = challengeRowsRaw.map((r: any) => ({
    id: Number(r.id),
    lessonId: Number(r.lesson_id),
    unitOrder: Number(r.unit_order),
    lessonOrder: Number(r.lesson_order),
    order: Number(r.order),
    type: String(r.type),
    question: String(r.question),
  }));

  const options: AuditOptionRow[] = optionRowsRaw.map((r: any) => ({
    id: Number(r.id),
    challengeId: Number(r.challenge_id),
    text: String(r.text),
    correct: Boolean(r.correct),
    imageSrc: r.image_src ? String(r.image_src) : null,
    audioSrc: r.audio_src ? String(r.audio_src) : null,
  }));

  const progressAgg: AuditProgressAggRow[] = progressAggRaw.map((r: any) => ({
    challengeId: Number(r.challenge_id),
    completions: Number(r.completions),
    uniqueUsers: Number(r.unique_users),
  }));

  const mistakeAgg: AuditMistakeAggRow[] = mistakeAggRaw.map((r: any) => ({
    challengeId: Number(r.challenge_id),
    mistakeCount: Number(r.mistake_count),
    uniqueUsers: Number(r.unique_users),
  }));

  const ov = overviewRaw[0] as any;
  const unitReach: AuditUnitReachRow[] = unitReachRaw.map((r: any) => ({
    unitOrder: Number(r.unit_order),
    uniqueUsers: Number(r.unique_users),
  }));
  const funnelByMaxUnit: AuditFunnelRow[] = funnelRaw.map((r: any) => ({
    maxUnitOrder: Number(r.max_unit_order),
    learnerCount: Number(r.learner_count),
  }));

  const telemetryOverview: AuditTelemetryOverview = {
    totalLearners: Number(ov?.total_learners ?? 0),
    activeLearnersWithProgress: Number(ov?.active_learners_with_progress ?? 0),
    activeLearnersWithMistakes: Number(ov?.active_learners_with_mistakes ?? 0),
    totalCompletedChallenges: Number(ov?.total_completed_challenges ?? 0),
    totalMistakes: Number(ov?.total_mistakes ?? 0),
    unitReach,
    funnelByMaxUnit,
  };

  const report = computePedagogyAuditReport({
    units,
    lessons,
    challenges,
    options,
    progressAgg,
    mistakeAgg,
    telemetryOverview,
  });

  let output = "";
  if (format === "json") {
    output = JSON.stringify(report, null, 2);
  } else if (format === "csv-worlds") {
    output = formatWorldsAsCsv(report);
  } else if (format === "csv-units") {
    output = formatUnitsAsCsv(report);
  } else {
    output = formatReportAsMarkdown(report);
  }

  if (outPath) {
    const resolved = path.resolve(outPath);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    fs.writeFileSync(resolved, output, "utf-8");
    console.log(`✅ Wrote ${format} pedagogical audit report to ${resolved}`);
  } else {
    console.log(output);
  }
}

runReadOnlyAudit().catch((err) => {
  console.error("Failed to execute pedagogical telemetry audit:", err);
  process.exit(1);
});
