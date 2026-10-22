import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

const sql = neon(process.env.DATABASE_URL || "");

async function auditImages() {
  const images = await sql`
    SELECT image_src, COUNT(*) as count 
    FROM challenge_options 
    WHERE image_src IS NOT NULL 
    GROUP BY image_src 
    ORDER BY count DESC
  `;

  console.log(`Distinct image sources: ${images.length}`);
  let missing = 0;
  for (const r of images) {
    const src = r.image_src as string;
    const local = path.join(__dirname, "..", "public", src.replace(/^\//, ""));
    const exists = fs.existsSync(local);
    if (!exists) {
      console.log(`MISSING: ${src}`);
      missing++;
    }
  }

  console.log(`Missing images on disk: ${missing}`);

  const totalWithOptionsWithImages = await sql`
    SELECT COUNT(*) as count FROM challenge_options WHERE image_src IS NOT NULL
  `;
  console.log(`Total options with images: ${totalWithOptionsWithImages[0].count}`);

  // Check Unit 7 Lesson 4 (the user's challenge!)
  const unit7Toy = await sql`
    SELECT c.id, c.question, co.text, co.image_src
    FROM challenges c
    JOIN challenge_options co ON co.challenge_id = c.id
    WHERE c.question = 'Which one of these is \"Toy\"?'
  `;
  console.log("\nToy challenge options in DB:", unit7Toy);
}

auditImages()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
