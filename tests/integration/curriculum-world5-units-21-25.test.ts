import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { getStageThemeForUnit, getUnitScenery, LEVEL_2_STAGES } from "@/lib/theme-registry";

// Read the seed file definition directly for deterministic regression QA
// or test against public disk assets and theme registry
describe("QA Test Suite: Level 2 & World 5 (Units 21–25 Curriculum Integrity)", () => {
  const PUBLIC_DIR = path.join(__dirname, "..", "..", "public");
  const AUDIO_DIR = path.join(PUBLIC_DIR, "audio", "hr");

  describe("1. World 5 Theme Registry & Unit Mapping Integrity", () => {
    it("defines Level 2 / Stage 5 with Istrian Explorer theme tokens", () => {
      expect(LEVEL_2_STAGES).toHaveLength(1);
      const stage5 = LEVEL_2_STAGES[0];
      expect(stage5.stage).toBe(5);
      expect(stage5.id).toBe("istria-kvarner");
      expect(stage5.stageName).toBe("Istrian Explorer");
      expect(stage5.accentEmoji).toBe("🏛️");
      expect(stage5.solidBg).toBe("bg-amber-600");
      expect(stage5.unitRange).toEqual([21, 25]);
    });

    it("maps all units from 21 through 25 to Stage 5", () => {
      for (let unit = 21; unit <= 25; unit++) {
        const theme = getStageThemeForUnit(unit);
        expect(theme.stage).toBe(5);
        expect(theme.id).toBe("istria-kvarner");
        expect(theme.solidBg).toBe("bg-amber-600");
      }
    });

    it("verifies all unit scenery assets for Units 21–25 exist on disk", () => {
      for (let unit = 21; unit <= 25; unit++) {
        const scenery = getUnitScenery(unit);
        expect(scenery).not.toBeNull();
        expect(scenery?.left).toBeDefined();
        expect(scenery?.right).toBeDefined();

        if (scenery?.left) {
          const leftPath = path.join(PUBLIC_DIR, scenery.left.imageSrc.replace(/^\//, ""));
          expect(fs.existsSync(leftPath), `Scenery left ${scenery.left.imageSrc} must exist on disk`).toBe(true);
        }

        if (scenery?.right) {
          const rightPath = path.join(PUBLIC_DIR, scenery.right.imageSrc.replace(/^\//, ""));
          expect(fs.existsSync(rightPath), `Scenery right ${scenery.right.imageSrc} must exist on disk`).toBe(true);
        }
      }
    });
  });

  describe("2. Units 21–25 Structural & Pedagogical Standards (Seed Data Audit)", () => {
    // Dynamically load the unitsData from the seed script to assert against the contract
    const seedFilePath = path.join(__dirname, "..", "..", "scripts", "seed-units-21-25.ts");
    const seedContent = fs.readFileSync(seedFilePath, "utf8");

    // Extract unitsData array structure safely
    it("seed script defines exactly 5 units (Units 21 to 25)", () => {
      expect(seedContent).toContain('order: 21');
      expect(seedContent).toContain('order: 22');
      expect(seedContent).toContain('order: 23');
      expect(seedContent).toContain('order: 24');
      expect(seedContent).toContain('order: 25');
    });

    it("verifies the '3 + 1' Unit Arc for all 5 units (Lesson 4 is Super Izazov)", () => {
      const superIzazovMatches = seedContent.match(/title:\s*"👑 Super Izazov:[^"]+"/g);
      expect(superIzazovMatches).toHaveLength(5);
      expect(superIzazovMatches).toEqual([
        'title: "👑 Super Izazov: Gospodar Vremena"',
        'title: "👑 Super Izazov: Majstor Sladoleda"',
        'title: "👑 Super Izazov: Mladi Arheolog"',
        'title: "👑 Super Izazov: Gospodar Dana"',
        'title: "👑 Super Izazov: Morski Ronilac"',
      ]);
    });

    it("verifies all 14 new SVG visual assets exist on disk with valid XML content", () => {
      const expectedSvgs = [
        "week.svg",
        "weekend.svg",
        "morning.svg",
        "evening.svg",
        "icecream.svg",
        "scoop.svg",
        "strawberry.svg",
        "arena.svg",
        "knight.svg",
        "clock.svg",
        "toothbrush.svg",
        "goggles.svg",
        "towel.svg",
        "wave.svg",
      ];

      for (const svgFile of expectedSvgs) {
        const fullPath = path.join(PUBLIC_DIR, svgFile);
        expect(fs.existsSync(fullPath), `SVG ${svgFile} must exist in public/`).toBe(true);
        const content = fs.readFileSync(fullPath, "utf8");
        expect(content).toContain("<svg");
        expect(content).toContain("</svg>");
      }
    });

    it("verifies all 14 new SVGs have distinct artwork without duplicate contents", () => {
      const expectedSvgs = [
        "week.svg",
        "weekend.svg",
        "morning.svg",
        "evening.svg",
        "icecream.svg",
        "scoop.svg",
        "strawberry.svg",
        "arena.svg",
        "knight.svg",
        "clock.svg",
        "toothbrush.svg",
        "goggles.svg",
        "towel.svg",
        "wave.svg",
      ];

      const contents = new Set<string>();
      for (const svgFile of expectedSvgs) {
        const content = fs.readFileSync(path.join(PUBLIC_DIR, svgFile), "utf8").trim();
        expect(contents.has(content), `SVG ${svgFile} must not be identical to another asset`).toBe(false);
        contents.add(content);
      }
    });

    it("verifies 100% of audio files referenced in scripts/seed-units-21-25.ts exist in public/audio/hr/", () => {
      const audioMatches = seedContent.match(/\/audio\/hr\/[a-zA-Z0-9_-]+\.mp3/g) || [];
      expect(audioMatches.length).toBeGreaterThan(100);

      const uniqueAudioPaths = Array.from(new Set(audioMatches));
      for (const audioPath of uniqueAudioPaths) {
        const fullPath = path.join(PUBLIC_DIR, audioPath.replace(/^\//, ""));
        expect(fs.existsSync(fullPath), `Audio file ${audioPath} must exist on disk`).toBe(true);
        const stats = fs.statSync(fullPath);
        expect(stats.size).toBeGreaterThan(1000); // Valid non-empty MP3 audio file
      }
    });

    it("verifies multi-word phrase audio files adhere to the underscore naming rule", () => {
      // Find all options with multi-word text and check their audioSrc
      const optionPattern = /text:\s*"([^"]+)",\s*correct:\s*(true|false),(\s*imageSrc:\s*[^,]+,)?\s*audioSrc:\s*"([^"]+)"/g;
      let match;
      let checkedMultiWords = 0;

      while ((match = optionPattern.exec(seedContent)) !== null) {
        const text = match[1].trim();
        const audioSrc = match[4].trim();

        if (text.includes(" ")) {
          const slug = path.basename(audioSrc, ".mp3");
          expect(slug.includes("_"), `Multi-word option "${text}" must have underscore in audio slug "${audioSrc}"`).toBe(true);
          checkedMultiWords++;
        }
      }

      expect(checkedMultiWords).toBeGreaterThan(30);
    });

    it("verifies that Lesson 2, 3, and 4 challenges never contain imageSrc", () => {
      // Parse lesson blocks
      const lessonRegex = /order:\s*([1-4]),\s*title:\s*"([^"]+)",\s*challenges:\s*\[([\s\S]*?)\n\s*\]/g;
      let lessonMatch;
      let nonLesson1ChallengesChecked = 0;

      while ((lessonMatch = lessonRegex.exec(seedContent)) !== null) {
        const lessonOrder = parseInt(lessonMatch[1], 10);
        const challengesBlock = lessonMatch[3];

        if (lessonOrder > 1) {
          expect(challengesBlock).not.toContain("imageSrc:");
          nonLesson1ChallengesChecked++;
        }
      }

      expect(nonLesson1ChallengesChecked).toBe(15); // 3 non-discovery lessons * 5 units = 15 lessons
    });

    it("verifies zero prompt answer leakage (no questions reveal the correct answer)", () => {
      // Parse challenges with questions and options
      const challengeRegex = /question:\s*'([^']+)'[\s\S]*?options:\s*\[([\s\S]*?)\]/g;
      let challengeMatch;
      let challengesAudited = 0;

      while ((challengeMatch = challengeRegex.exec(seedContent)) !== null) {
        const question = challengeMatch[1];
        const optionsBlock = challengeMatch[2];

        // Find the correct option text
        const correctMatch = optionsBlock.match(/text:\s*"([^"]+)",\s*correct:\s*true/);
        if (correctMatch) {
          challengesAudited++;
          const correctText = correctMatch[1].trim().toLowerCase()
            .replace(/č/g, "c").replace(/ć/g, "c").replace(/š/g, "s").replace(/ž/g, "z").replace(/đ/g, "d");
          const cleanQ = question.toLowerCase()
            .replace(/č/g, "c").replace(/ć/g, "c").replace(/š/g, "s").replace(/ž/g, "z").replace(/đ/g, "d");

          if (cleanQ.includes("(") || cleanQ.includes("/")) {
            const regex = new RegExp(`\\b${correctText}\\b`, "i");
            expect(regex.test(cleanQ), `Prompt "${question}" must not reveal answer "${correctMatch[1]}"`).toBe(false);
          }
        }
      }

      expect(challengesAudited).toBeGreaterThanOrEqual(80);
    });
  });
});
