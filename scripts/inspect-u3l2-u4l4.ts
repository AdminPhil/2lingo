import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

async function main() {
  console.log("=== Inspecting Unit 3 Lesson 2 ===");
  const u3l2 = await sql`
    SELECT c.id, c.order, c.question, co.id as opt_id, co.text, co.correct
    FROM challenges c
    JOIN challenge_options co ON co.challenge_id = c.id
    WHERE c.lesson_id = (SELECT l.id FROM lessons l JOIN units u ON l.unit_id = u.id WHERE u.order = 3 AND l.order = 2)
    ORDER BY c.order, co.id
  `;
  const u3l2Map = new Map();
  for (const r of u3l2) {
    if (!u3l2Map.has(r.id)) u3l2Map.set(r.id, { question: r.question, order: r.order, options: [] });
    u3l2Map.get(r.id).options.push(`${r.text} (${r.correct ? 'T' : 'F'})`);
  }
  for (const [id, data] of u3l2Map.entries()) {
    console.log(`Ch ${data.order} (ID ${id}): "${data.question}" -> [${data.options.join(", ")}]`);
  }

  console.log("\n=== Inspecting Unit 4 Lesson 4 ===");
  const u4l4 = await sql`
    SELECT c.id, c.order, c.question, co.id as opt_id, co.text, co.correct
    FROM challenges c
    JOIN challenge_options co ON co.challenge_id = c.id
    WHERE c.lesson_id = (SELECT l.id FROM lessons l JOIN units u ON l.unit_id = u.id WHERE u.order = 4 AND l.order = 4)
    ORDER BY c.order, co.id
  `;
  const u4l4Map = new Map();
  for (const r of u4l4) {
    if (!u4l4Map.has(r.id)) u4l4Map.set(r.id, { question: r.question, order: r.order, options: [] });
    u4l4Map.get(r.id).options.push(`${r.text} (${r.correct ? 'T' : 'F'})`);
  }
  for (const [id, data] of u4l4Map.entries()) {
    console.log(`Ch ${data.order} (ID ${id}): "${data.question}" -> [${data.options.join(", ")}]`);
  }
}

main().catch(console.error);
