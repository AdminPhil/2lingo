import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const sql = neon(process.env.DATABASE_URL || "");

function normalizeCroatianSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

async function run() {
  console.log("=== 🔊 BUG-027: Multi-Word Croatian Audio Integrity Fix ===");

  const rows = await sql`
    SELECT DISTINCT text, audio_src
    FROM challenge_options
    WHERE text LIKE '% %'
    ORDER BY text
  `;

  console.log(`Found ${rows.length} distinct multi-word Croatian phrases in challenge_options.`);

  const toGenerate: Record<string, string> = {};
  const toUpdateDb: Array<{ text: string; oldAudio: string; newAudio: string }> = [];

  // Always force re-generation of toplo_more.mp3 with clear full-phrase TTS
  toGenerate["toplo_more"] = "Toplo more";

  const audioDir = path.join(__dirname, "..", "public", "audio", "hr");

  for (const row of rows) {
    const text = (row.text as string).trim();
    const currentAudio = (row.audio_src as string) || "";
    const expectedSlug = normalizeCroatianSlug(text);
    const expectedAudioSrc = `/audio/hr/${expectedSlug}.mp3`;
    const expectedDiskPath = path.join(audioDir, `${expectedSlug}.mp3`);

    // Check if current audio_src is a single-word slug (no underscore) or doesn't match the full phrase
    const currentBase = path.basename(currentAudio, ".mp3");
    const isSingleWordAudio = !currentBase.includes("_");

    if (isSingleWordAudio || currentAudio !== expectedAudioSrc) {
      toUpdateDb.push({
        text,
        oldAudio: currentAudio,
        newAudio: expectedAudioSrc,
      });
    }

    if (!fs.existsSync(expectedDiskPath)) {
      toGenerate[expectedSlug] = text;
    }
  }

  console.log(`Phrases needing new/regenerated MP3 on disk: ${Object.keys(toGenerate).length}`);
  console.log(`DB rows (distinct phrases) needing audio_src pointer update: ${toUpdateDb.length}`);

  if (Object.keys(toGenerate).length > 0) {
    const jsonPath = path.join(__dirname, "multiword_phrases_to_generate.json");
    fs.writeFileSync(jsonPath, JSON.stringify(toGenerate, null, 2), "utf-8");

    const pyScriptPath = path.join(__dirname, "generate_multiword_audio.py");
    const pyCode = `import asyncio
import json
import os
import sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "hr")
JSON_PATH = os.path.join(os.path.dirname(__file__), "multiword_phrases_to_generate.json")
VOICE = "hr-HR-GabrijelaNeural"

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        phrases = json.load(f)

    total = len(phrases)
    print(f"Generating {total} multi-word Croatian MP3 files with {VOICE}...")
    count = 0
    for slug, text in phrases.items():
        out_path = os.path.join(OUTPUT_DIR, f"{slug}.mp3")
        # Ensure clean full-phrase synthesis with slight pause/clarity
        communicate = edge_tts.Communicate(text, VOICE, rate="-5%")
        await communicate.save(out_path)
        count += 1
        if count % 10 == 0 or count == total:
            print(f"  [{count}/{total}] Generated {slug}.mp3 -> '{text}'")

if __name__ == "__main__":
    asyncio.run(main())
`;
    fs.writeFileSync(pyScriptPath, pyCode, "utf-8");
    console.log("Running Python edge-tts generator...");
    execSync(`python "${pyScriptPath}"`, { stdio: "inherit" });

    // Clean up temporary files
    if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);
    if (fs.existsSync(pyScriptPath)) fs.unlinkSync(pyScriptPath);
  }

  // Update database pointers
  let updatedCount = 0;
  for (const item of toUpdateDb) {
    await sql`
      UPDATE challenge_options
      SET audio_src = ${item.newAudio}
      WHERE text = ${item.text}
    `;
    updatedCount++;
  }

  console.log(`Updated ${updatedCount} distinct multi-word phrase audio_src pointers in Neon DB.`);
  console.log("✅ BUG-027 Multi-word audio fix complete!");
}

run().catch((err) => {
  console.error("Failed to fix multi-word audio:", err);
  process.exit(1);
});
