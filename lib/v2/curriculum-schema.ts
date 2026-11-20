import { z } from "zod";

/**
 * CroLingo v2 Declarative Curriculum Schema (Zod)
 * Single source of truth for YAML authoring, compile-time QA validation,
 * and deterministic Neon Postgres seeding.
 */

export const CefrBandSchema = z.enum([
  "Pre-A1",
  "A1.1",
  "A1.2",
  "A2.1",
  "A2.2",
  "B1.1",
  "B1.2",
]);

export const LessonKindSchema = z.enum([
  "DISCOVERY",      // L1: Visual audio-to-image flashcard discovery (SELECT)
  "PHRASE_LISTEN",  // L2: Phrase comprehension & audio-only listening (ASSIST / LISTEN)
  "PRODUCTION",     // L3: Active sentence production & grammar drills (BUILD_SENTENCE / CLOZE / ASSIST)
  "SPIRAL_REVIEW",  // L4 (5-lesson arc): Cross-world spaced repetition spiral
  "BOSS_CAPSTONE",  // Final lesson of unit: Mixed-mechanic Super Izazov (+3 Hearts)
]);

export const ChallengeTypeSchema = z.enum([
  "SELECT",         // Tier 1: Visual flashcard recognition (image + audio)
  "ASSIST",         // Tier 2: Text multiple-choice recognition (with minimal pairs in A2+)
  "LISTEN",         // Tier 3: Audio-only listening comprehension (no English text prompt)
  "MATCH_PAIRS",    // Tier 4: 4-5 pair rapid vocabulary matching
  "BUILD_SENTENCE", // Tier 5: Active word-bank tile assembly (target + distractors)
  "CLOZE",          // Tier 6: Fill-in-the-blank Croatian case/verb-aspect drill
]);

export const ChoiceOptionSchema = z.object({
  text: z.string().min(1),
  correct: z.boolean(),
  imageSrc: z.string().min(1).nullable().optional(),
  audioSrc: z.string().min(1).nullable().optional(),
});

export const MatchPairSchema = z.object({
  croatian: z.string().min(1),
  english: z.string().min(1),
  audioSrc: z.string().min(1).optional(),
});

export const SelectChallengeSchema = z.object({
  order: z.number().int().positive(),
  legacyId: z.number().int().positive().optional(),
  type: z.literal("SELECT"),
  prompt: z.string().min(1),
  grammarTags: z.array(z.string()).default([]),
  options: z.array(ChoiceOptionSchema).min(2),
});

export const AssistChallengeSchema = z.object({
  order: z.number().int().positive(),
  legacyId: z.number().int().positive().optional(),
  type: z.literal("ASSIST"),
  prompt: z.string().min(1),
  grammarTags: z.array(z.string()).default([]),
  options: z.array(ChoiceOptionSchema).min(2),
});

export const ListenChallengeSchema = z.object({
  order: z.number().int().positive(),
  legacyId: z.number().int().positive().optional(),
  type: z.literal("LISTEN"),
  prompt: z.string().min(1).default("Tap what you hear"),
  audioSrc: z.string().min(1),
  grammarTags: z.array(z.string()).default([]),
  options: z.array(ChoiceOptionSchema).min(2),
});

export const MatchPairsChallengeSchema = z.object({
  order: z.number().int().positive(),
  legacyId: z.number().int().positive().optional(),
  type: z.literal("MATCH_PAIRS"),
  prompt: z.string().min(1).default("Match the Croatian pairs"),
  grammarTags: z.array(z.string()).default([]),
  pairs: z.array(MatchPairSchema).min(3).max(6),
});

export const BuildSentenceChallengeSchema = z.object({
  order: z.number().int().positive(),
  legacyId: z.number().int().positive().optional(),
  type: z.literal("BUILD_SENTENCE"),
  prompt: z.string().min(1),
  targetSentence: z.string().min(1),
  acceptedAnswers: z.array(z.string().min(1)).default([]),
  wordBank: z.array(z.string().min(1)).min(2),
  audioSrc: z.string().min(1).optional(),
  grammarTags: z.array(z.string()).default([]),
});

export const ClozeChallengeSchema = z.object({
  order: z.number().int().positive(),
  legacyId: z.number().int().positive().optional(),
  type: z.literal("CLOZE"),
  prompt: z.string().min(1),
  sentenceTemplate: z.string().min(1), // e.g. "Brod ulazi u ___."
  audioSrc: z.string().min(1).optional(),
  grammarTags: z.array(z.string()).default([]),
  options: z.array(ChoiceOptionSchema).min(2),
});

export const ChallengeSchema = z.discriminatedUnion("type", [
  SelectChallengeSchema,
  AssistChallengeSchema,
  ListenChallengeSchema,
  MatchPairsChallengeSchema,
  BuildSentenceChallengeSchema,
  ClozeChallengeSchema,
]);

export const LessonSchema = z.object({
  order: z.number().int().positive(),
  legacyId: z.number().int().positive().optional(),
  kind: LessonKindSchema,
  title: z.string().min(1),
  challenges: z.array(ChallengeSchema).min(1),
});

export const UnitSchema = z.object({
  order: z.number().int().positive(),
  legacyId: z.number().int().positive().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  lessons: z.array(LessonSchema).min(4).max(5),
});

export const WorldThemeTokensSchema = z.object({
  solidBg: z.string().min(1),
  gradient: z.string().min(1),
  badgeBg: z.string().min(1),
  accentEmoji: z.string().min(1),
  buttonClass: z.string().min(1),
  accentBorder: z.string().min(1),
  nodeActiveBg: z.string().min(1),
  nodeBorderColor: z.string().min(1),
  nodeStrokeColor: z.string().min(1),
  nodeBadgeClasses: z.string().min(1),
  nodeArrowBorder: z.string().min(1),
});

export const WorldYamlSchema = z.object({
  schemaVersion: z.literal(2),
  worldOrder: z.number().int().positive(),
  levelOrder: z.number().int().positive(),
  slug: z.string().min(1),
  name: z.string().min(1),
  badgeLabel: z.string().min(1),
  cefrBand: CefrBandSchema,
  theme: WorldThemeTokensSchema,
  units: z.array(UnitSchema).min(1),
});

export const LexemeEntrySchema = z.object({
  stem: z.string().min(1),
  lemma: z.string().min(1),
  cefrBand: CefrBandSchema,
  introducedUnitOrder: z.number().int().positive(),
  introducedWorldOrder: z.number().int().positive(),
  audioSrc: z.string().min(1).nullable().optional(),
  imageSrc: z.string().min(1).nullable().optional(),
  occurrences: z.number().int().positive(),
});

export const LexiconYamlSchema = z.object({
  schemaVersion: z.literal(2),
  generatedAt: z.string().min(1),
  totalLexemes: z.number().int().nonnegative(),
  lexemes: z.array(LexemeEntrySchema),
});

export const GrammarLadderWorldSchema = z.object({
  worldOrder: z.number().int().positive(),
  levelOrder: z.number().int().positive(),
  title: z.string().min(1),
  cefrBand: CefrBandSchema,
  targetAvgWords: z.number().positive(),
  targetMinimalPairPct: z.number().min(0).max(100),
  requiredMechanics: z.array(ChallengeTypeSchema).min(1),
  grammarFocus: z.array(z.string()).min(1),
});

export const GrammarLadderYamlSchema = z.object({
  schemaVersion: z.literal(2),
  courseName: z.string().min(1),
  targetHorizonWorlds: z.number().int().positive(),
  worlds: z.array(GrammarLadderWorldSchema).min(1),
});

export type CefrBand = z.infer<typeof CefrBandSchema>;
export type LessonKind = z.infer<typeof LessonKindSchema>;
export type ChallengeType = z.infer<typeof ChallengeTypeSchema>;
export type WorldYaml = z.infer<typeof WorldYamlSchema>;
export type LexiconYaml = z.infer<typeof LexiconYamlSchema>;
export type GrammarLadderYaml = z.infer<typeof GrammarLadderYamlSchema>;
