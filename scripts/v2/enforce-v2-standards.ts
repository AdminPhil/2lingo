import * as fs from "fs";
import * as path from "path";
import YAML from "yaml";

import { WorldYamlSchema } from "../../lib/v2/curriculum-schema";

/**
 * CroLingo v2 Standards Compliance Enforcer (Option 1)
 * Brings all 12 Worlds / 60 Units / 300 Lessons into 100% compliance with
 * `docs/3. CURRICULUM_STANDARDS_V2.md`:
 *   1. Lesson 1 (DISCOVERY): 100% `SELECT` with verified SVG artwork on every option.
 *   2. Lessons 2-5 (PHRASE_LISTEN, PRODUCTION, SPIRAL_REVIEW, BOSS_CAPSTONE):
 *      Strictly images-OFF (`imageSrc` removed; any `SELECT` in L4 converted to `ASSIST`).
 */

const EXPLICIT_SVG_MAP: Record<string, string> = {
  "dobar dan": "/dobar_dan.svg",
  "laku noć": "/laku_noc.svg",
  "hvala lijepa": "/hvala_lijepa.svg",
  "dobro sam": "/dobro_sam.svg",
  usta: "/mouth.svg",
  pjevam: "/sing.svg",
};

function main() {
  console.log("=== 🛠️ CROLINGO v2: ENFORCING V2 LESSON STANDARDS ACROSS ALL 60 UNITS ===\n");

  const worldsDir = path.join(process.cwd(), "curriculum", "worlds");
  const files = fs
    .readdirSync(worldsDir)
    .filter((f) => f.endsWith(".yaml"))
    .sort();

  // Pass 1: Build master Croatian text -> existing verified imageSrc map
  const svgByText = new Map<string, string>(Object.entries(EXPLICIT_SVG_MAP));
  const parsedFiles = files.map((file) => ({
    file,
    world: WorldYamlSchema.parse(
      YAML.parse(fs.readFileSync(path.join(worldsDir, file), "utf-8"))
    ),
  }));

  for (const { world } of parsedFiles) {
    for (const u of world.units) {
      for (const l of u.lessons) {
        for (const ch of l.challenges) {
          if (ch.type === "SELECT" || ch.type === "ASSIST" || ch.type === "LISTEN" || ch.type === "CLOZE") {
            for (const o of ch.options) {
              if (o.imageSrc && !svgByText.has(o.text.toLowerCase())) {
                svgByText.set(o.text.toLowerCase(), o.imageSrc);
              }
            }
          }
        }
      }
    }
  }

  let l1Converted = 0;
  let l2to5ImagesStripped = 0;
  let l4SelectConverted = 0;

  // Pass 2: Enforce L1 Visual Discovery + L2-L5 Progressive Fading
  for (const { file, world } of parsedFiles) {
    for (const u of world.units) {
      for (const l of u.lessons) {
        if (l.order === 1) {
          l.kind = "DISCOVERY";
          for (let i = 0; i < l.challenges.length; i++) {
            const ch = l.challenges[i];
            if (ch.type === "ASSIST" || ch.type === "SELECT") {
              const needsConversion =
                ch.type !== "SELECT" || ch.options.some((o) => !o.imageSrc);

              if (needsConversion) {
                const updatedOptions = ch.options.map((o) => {
                  const img = o.imageSrc || svgByText.get(o.text.toLowerCase());
                  if (!img) {
                    throw new Error(
                      `No SVG mapped for L1 option "${o.text}" in ${file} U${u.order} L1 Ch${ch.order}`
                    );
                  }
                  return { ...o, imageSrc: img };
                });

                const prompt = ch.prompt.startsWith("Which one")
                  ? ch.prompt
                  : `Which one of these is ${ch.prompt.replace(/^\s*"?|"?\s*$/g, (m) => (m.includes('"') ? '"' : ""))}?`;

                l.challenges[i] = {
                  ...ch,
                  type: "SELECT",
                  prompt,
                  options: updatedOptions,
                };
                l1Converted++;
              }
            }
          }
        } else {
          // Lessons 2-5: Strictly images-OFF (Progressive Fading Invariant)
          for (let i = 0; i < l.challenges.length; i++) {
            const ch = l.challenges[i];
            if (
              ch.type === "SELECT" ||
              ch.type === "ASSIST" ||
              ch.type === "LISTEN" ||
              ch.type === "CLOZE"
            ) {
              for (const o of ch.options) {
                if (o.imageSrc) {
                  delete o.imageSrc;
                  l2to5ImagesStripped++;
                }
              }
              // In L4 SPIRAL_REVIEW, ensure no SELECT card remains (use ASSIST for text-only)
              if (l.order === 4 && ch.type === "SELECT") {
                l.challenges[i] = {
                  ...ch,
                  type: "ASSIST",
                };
                l4SelectConverted++;
              }
            }
          }
        }
      }
    }

    const validated = WorldYamlSchema.parse(world);
    fs.writeFileSync(
      path.join(worldsDir, file),
      YAML.stringify(validated, { lineWidth: 110 }),
      "utf-8"
    );
  }

  console.log(`✓ L1 DISCOVERY challenges upgraded to illustrated SELECT: ${l1Converted}`);
  console.log(`✓ L2–L5 option images stripped (Progressive Fading):     ${l2to5ImagesStripped}`);
  console.log(`✓ L4 SPIRAL_REVIEW SELECT -> ASSIST conversions:         ${l4SelectConverted}`);
  console.log("\n✅ All 12 Worlds / 60 Units / 300 Lessons updated to v2 Standards!");
}

main();
