import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

const sql = neon(process.env.DATABASE_URL || "");

async function fixBrokenImages() {
  console.log("Checking for broken image references in database...");

  const optionsWithImages = await sql`
    SELECT id, text, image_src 
    FROM challenge_options 
    WHERE image_src IS NOT NULL
  `;

  console.log(`Found ${optionsWithImages.length} options with image_src.`);

  const validPaths = new Set<string>();
  const invalidIds: number[] = [];

  for (const opt of optionsWithImages) {
    const src = opt.image_src as string;
    const localPath = path.join(__dirname, "..", "public", src.replace(/^\//, ""));
    if (fs.existsSync(localPath)) {
      validPaths.add(src);
    } else {
      invalidIds.push(opt.id);
    }
  }

  console.log(`Valid image paths (${validPaths.size}):`, Array.from(validPaths));
  console.log(`Found ${invalidIds.length} options with non-existent image paths.`);

  if (invalidIds.length > 0) {
    console.log("Setting non-existent image_src to NULL in database...");
    // Update in batches of 100
    for (let i = 0; i < invalidIds.length; i += 100) {
      const batch = invalidIds.slice(i, i + 100);
      await sql`
        UPDATE challenge_options 
        SET image_src = NULL 
        WHERE id = ANY(${batch})
      `;
    }
    console.log(`Successfully cleared ${invalidIds.length} broken image references!`);
  }

  // Verify
  const remainingBroken = await sql`
    SELECT COUNT(*) as count 
    FROM challenge_options 
    WHERE image_src IS NOT NULL
  `;
  console.log(`Remaining options with images: ${remainingBroken[0].count} (all pointing to verified files in public/)`);
}

fixBrokenImages()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
