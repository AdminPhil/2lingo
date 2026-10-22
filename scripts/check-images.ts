import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

const sql = neon(process.env.DATABASE_URL || "");

async function checkImages() {
  const imagesWithCount = await sql`
    SELECT image_src, COUNT(*) as count 
    FROM challenge_options 
    WHERE image_src IS NOT NULL 
    GROUP BY image_src 
    ORDER BY count DESC
  `;
  console.log("Image sources and usage counts:");
  for (const r of imagesWithCount) {
    const src = r.image_src as string;
    const localPath = path.join(__dirname, "..", "public", src.replace(/^\//, ""));
    const exists = fs.existsSync(localPath);
    console.log(`${exists ? "✓ EXISTS" : "✗ MISSING"}: ${src} (${r.count} options)`);
  }
}

checkImages().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
