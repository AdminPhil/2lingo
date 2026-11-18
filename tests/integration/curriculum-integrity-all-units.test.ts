import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

function normalizeWord(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/[čć]/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]/g, "");
}

describe.skipIf(!process.env.DATABASE_URL)("BUG-037 Master Curriculum Integrity Suite (All Seeded Units)", () => {
  let units: any[] = [];
  let challenges: any[] = [];
  let optionsByChallenge = new Map<number, any[]>();

  beforeAll(async () => {
    const sql = neon(process.env.DATABASE_URL!);
    units = await sql`SELECT id, "order", title FROM units WHERE course_id = 1 ORDER BY "order"`;

    const rawChallenges = await sql`
      SELECT c.id, c.order as c_order, c.question, c.type, l.order as l_order, u.order as u_order
      FROM challenges c
      JOIN lessons l ON c.lesson_id = l.id
      JOIN units u ON l.unit_id = u.id
      WHERE u.course_id = 1
      ORDER BY u.order, l.order, c.order
    `;
    challenges = rawChallenges;

    const rawOptions = await sql`SELECT id, challenge_id, text, correct, image_src, audio_src FROM challenge_options`;
    for (const opt of rawOptions) {
      if (!optionsByChallenge.has(opt.challenge_id)) {
        optionsByChallenge.set(opt.challenge_id, []);
      }
      optionsByChallenge.get(opt.challenge_id)!.push(opt);
    }
  });

  it("verifies all seeded units (>= 45) have challenges and options loaded", () => {
    expect(units.length).toBeGreaterThanOrEqual(45);
    expect(challenges.length).toBeGreaterThanOrEqual(444);
    expect(optionsByChallenge.size).toBe(challenges.length);

    const unitOrdersWithChallenges = new Set(challenges.map((c) => c.u_order));
    for (const u of units) {
      expect(unitOrdersWithChallenges.has(u.order), `Unit ${u.order} has no challenges`).toBe(true);
    }
  });

  it("enforces Lesson 1 visual flashcard requirement: all SELECT challenges must have images", () => {
    const l1SelectChallenges = challenges.filter((c) => c.l_order === 1 && c.type === "SELECT");
    expect(l1SelectChallenges.length).toBeGreaterThan(0);

    const violations: string[] = [];
    for (const c of l1SelectChallenges) {
      const opts = optionsByChallenge.get(c.id) || [];
      for (const opt of opts) {
        if (!opt.image_src) {
          violations.push(`U${c.u_order} L1 Ch${c.c_order} Option "${opt.text}" has no image_src`);
        } else {
          const imgPath = path.join(process.cwd(), "public", opt.image_src.replace(/^\//, ""));
          if (!fs.existsSync(imgPath)) {
            violations.push(`U${c.u_order} L1 Ch${c.c_order} Option "${opt.text}" image file missing: ${opt.image_src}`);
          }
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("enforces Progressive Fading: Lessons 2, 3, and 4 must have 0 images", () => {
    const fadingChallenges = challenges.filter((c) => c.l_order > 1);
    const violations: string[] = [];

    for (const c of fadingChallenges) {
      const opts = optionsByChallenge.get(c.id) || [];
      const withImages = opts.filter((o) => o.image_src !== null);
      if (withImages.length > 0) {
        violations.push(`U${c.u_order} L${c.l_order} Ch${c.c_order} has images: ${withImages.map((x) => x.text).join(", ")}`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("enforces Universal Audio Parity: single-word options must match their audio slug", () => {
    const violations: string[] = [];

    for (const c of challenges) {
      const opts = optionsByChallenge.get(c.id) || [];
      for (const opt of opts) {
        const text = (opt.text || "").trim();
        if (!text.includes(" ") && opt.audio_src) {
          const textSlug = normalizeWord(text);
          const baseSlug = path.basename(opt.audio_src, ".mp3");
          const normAudioSlug = normalizeWord(baseSlug);

          if (textSlug !== normAudioSlug) {
            violations.push(`U${c.u_order} L${c.l_order} Ch${c.c_order}: Option "${text}" -> audio "${baseSlug}.mp3" (Expected ~${textSlug})`);
          }
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("enforces that all audio files referenced in the database exist on disk and are non-empty", () => {
    const missingFiles: string[] = [];
    for (const c of challenges) {
      const opts = optionsByChallenge.get(c.id) || [];
      for (const opt of opts) {
        if (opt.audio_src) {
          const audioPath = path.join(process.cwd(), "public", opt.audio_src.replace(/^\//, ""));
          if (!fs.existsSync(audioPath)) {
            missingFiles.push(`Missing: ${opt.audio_src} for "${opt.text}" (U${c.u_order} L${c.l_order})`);
          } else if (fs.statSync(audioPath).size === 0) {
            missingFiles.push(`Empty (0 bytes): ${opt.audio_src} for "${opt.text}" (U${c.u_order} L${c.l_order})`);
          }
        }
      }
    }
    expect(missingFiles).toEqual([]);
  });

  it("enforces intra-challenge artwork uniqueness (zero duplicate SVGs)", () => {
    const violations: string[] = [];
    const fileCache = new Map<string, string>();

    for (const c of challenges) {
      const opts = optionsByChallenge.get(c.id) || [];
      const withImages = opts.filter((o) => !!o.image_src);
      const seenArt = new Map<string, string>();

      for (const opt of withImages) {
        const filePath = path.join(process.cwd(), "public", opt.image_src.replace(/^\//, ""));
        if (!fileCache.has(opt.image_src) && fs.existsSync(filePath)) {
          fileCache.set(opt.image_src, fs.readFileSync(filePath, "utf8").trim());
        }
        const art = fileCache.get(opt.image_src);
        if (art) {
          if (seenArt.has(art) && seenArt.get(art) !== opt.image_src) {
            violations.push(`U${c.u_order} L${c.l_order} Ch${c.c_order}: Option "${opt.text}" (${opt.image_src}) duplicates (${seenArt.get(art)})`);
          } else {
            seenArt.set(art, opt.image_src);
          }
        }
      }
    }
    expect(violations).toEqual([]);
  });
});
