import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * CroLingo v2 Clean-Sheet Relational Schema (Lakebase Postgres / Neon)
 * - Removes unused Stripe / Shop / user_subscription tutorial deadweight
 * - Models Levels, Worlds, Lesson Kinds, Polymorphic 6-Tier Challenges,
 *   Canonical Lexemes, Half-Life Regression Mastery, and Passwordless QR Login Tokens
 * - Preserves 100% of Learner XP, Streaks, Hearts, Avatars, and Family/Classroom Pods
 */

export const cefrBandEnum = pgEnum("cefr_band", [
  "Pre-A1",
  "A1.1",
  "A1.2",
  "A2.1",
  "A2.2",
  "B1.1",
  "B1.2",
]);

export const lessonKindEnum = pgEnum("lesson_kind", [
  "DISCOVERY",
  "PHRASE_LISTEN",
  "PRODUCTION",
  "SPIRAL_REVIEW",
  "BOSS_CAPSTONE",
]);

export const challengeTypeEnum = pgEnum("challenge_type", [
  "SELECT",
  "ASSIST",
  "LISTEN",
  "MATCH_PAIRS",
  "BUILD_SENTENCE",
  "CLOZE",
]);

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});

export const levels = pgTable("levels", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
  title: text("title").notNull(),
  croatianTitle: text("croatian_title").notNull(),
  cefrRange: text("cefr_range").notNull(), // e.g. "Pre-A1 -> A1.1"
});

export const worlds = pgTable("worlds", {
  id: serial("id").primaryKey(),
  levelId: integer("level_id")
    .references(() => levels.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  badgeLabel: text("badge_label").notNull(),
  cefrBand: cefrBandEnum("cefr_band").notNull(),
  themeTokens: jsonb("theme_tokens").$type<Record<string, string>>().notNull(),
});

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  worldId: integer("world_id")
    .references(() => worlds.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sceneryConfig: jsonb("scenery_config").$type<Record<string, unknown> | null>(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id")
    .references(() => units.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
  kind: lessonKindEnum("kind").notNull(),
  title: text("title").notNull(),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
  type: challengeTypeEnum("type").notNull(),
  question: text("question").notNull(),
  prompt: text("prompt").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
  grammarTags: jsonb("grammar_tags").$type<string[]>().notNull().default([]),
});

export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

export const lexemes = pgTable("lexemes", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  stem: text("stem").notNull(),
  lemma: text("lemma").notNull(),
  cefrBand: cefrBandEnum("cefr_band").notNull(),
  introducedUnitOrder: integer("introduced_unit_order").notNull(),
  audioSrc: text("audio_src"),
  imageSrc: text("image_src"),
}, (table) => ({
  courseStemIdx: uniqueIndex("lexemes_course_stem_idx").on(table.courseId, table.stem),
}));

export const challengeLexemes = pgTable("challenge_lexemes", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  lexemeId: integer("lexeme_id")
    .references(() => lexemes.id, { onDelete: "cascade" })
    .notNull(),
});

export const userLexemeMastery = pgTable("user_lexeme_mastery", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  lexemeId: integer("lexeme_id")
    .references(() => lexemes.id, { onDelete: "cascade" })
    .notNull(),
  strength: real("strength").notNull().default(0.5),
  halfLifeHours: real("half_life_hours").notNull().default(24),
  correctCount: integer("correct_count").notNull().default(0),
  mistakeCount: integer("mistake_count").notNull().default(0),
  lastReviewedAt: timestamp("last_reviewed_at").defaultNow().notNull(),
}, (table) => ({
  userLexemeIdx: uniqueIndex("user_lexeme_mastery_user_lexeme_idx").on(table.userId, table.lexemeId),
}));

export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userChallengeIdx: uniqueIndex("challenge_progress_user_challenge_idx").on(table.userId, table.challengeId),
}));

export const challengeMistakes = pgTable("challenge_mistakes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  selectedOptionId: integer("selected_option_id").references(() => challengeOptions.id, {
    onDelete: "set null",
  }),
  submittedAnswer: text("submitted_answer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("Learner"),
  userImageSrc: text("user_image_src").notNull().default("/avatars/pasko.png"),
  activeCourseId: integer("active_course_id").references(() => courses.id, {
    onDelete: "set null",
  }),
  hearts: integer("hearts").notNull().default(5),
  points: integer("points").notNull().default(0),
  heartsUsed: integer("hearts_used").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  lastActiveDate: text("last_active_date"),
  lastHeartRefillDate: text("last_heart_refill_date"),
  role: text("role").notNull().default("learner"),
  v2PlacementBannerSeen: boolean("v2_placement_banner_seen").notNull().default(false),
});

/**
 * Passwordless QR Badge Tokens:
 * Exchanged server-side for a one-time Clerk Sign-In Token so printing or
 * scanning a student QR badge NEVER resets or exposes their Clerk password.
 */
export const qrLoginTokens = pgTable("qr_login_tokens", {
  id: serial("id").primaryKey(),
  tokenHash: text("token_hash").notNull().unique(),
  userId: text("user_id").notNull(),
  createdByUserId: text("created_by_user_id").notNull(),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pods = pgTable("pods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().default("family"),
  inviteCode: text("invite_code").notNull().unique(),
  ownerId: text("owner_id").notNull(),
  targetXp: integer("target_xp").default(1000),
  currentXp: integer("current_xp").default(0).notNull(),
  celebrationUnlocked: boolean("celebration_unlocked").default(false).notNull(),
  weekNumber: integer("week_number").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const podMembers = pgTable("pod_members", {
  id: serial("id").primaryKey(),
  podId: integer("pod_id")
    .references(() => pods.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id").notNull(),
  role: text("role").notNull().default("member"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const podReactions = pgTable("pod_reactions", {
  id: serial("id").primaryKey(),
  podId: integer("pod_id").references(() => pods.id, { onDelete: "cascade" }),
  senderId: text("sender_id").notNull(),
  senderName: text("sender_name").notNull(),
  receiverId: text("receiver_id").notNull(),
  type: text("type").notNull().default("high_five"),
  seen: boolean("seen").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  levels: many(levels),
  units: many(units),
}));

export const levelsRelations = relations(levels, ({ one, many }) => ({
  course: one(courses, { fields: [levels.courseId], references: [courses.id] }),
  worlds: many(worlds),
}));

export const worldsRelations = relations(worlds, ({ one, many }) => ({
  level: one(levels, { fields: [worlds.levelId], references: [levels.id] }),
  units: many(units),
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
  course: one(courses, { fields: [units.courseId], references: [courses.id] }),
  world: one(worlds, { fields: [units.worldId], references: [worlds.id] }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, { fields: [lessons.unitId], references: [units.id] }),
  challenges: many(challenges),
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, { fields: [challenges.lessonId], references: [lessons.id] }),
  challengeOptions: many(challengeOptions),
  challengeLexemes: many(challengeLexemes),
  challengeProgress: many(challengeProgress),
  challengeMistakes: many(challengeMistakes),
}));

export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeOptions.challengeId],
    references: [challenges.id],
  }),
}));

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeProgress.challengeId],
    references: [challenges.id],
  }),
}));

export const challengeMistakesRelations = relations(challengeMistakes, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeMistakes.challengeId],
    references: [challenges.id],
  }),
  selectedOption: one(challengeOptions, {
    fields: [challengeMistakes.selectedOptionId],
    references: [challengeOptions.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));

export const podsRelations = relations(pods, ({ many }) => ({
  members: many(podMembers),
  reactions: many(podReactions),
}));

export const podMembersRelations = relations(podMembers, ({ one }) => ({
  pod: one(pods, { fields: [podMembers.podId], references: [pods.id] }),
}));

export const podReactionsRelations = relations(podReactions, ({ one }) => ({
  pod: one(pods, { fields: [podReactions.podId], references: [pods.id] }),
}));
