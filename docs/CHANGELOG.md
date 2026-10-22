# 📜 2lingo Living Changelog

All notable changes, pedagogical updates, curriculum expansions, and infrastructure upgrades are documented here.

---

## [2026-10-22] - Pedagogical Upgrades: Deductive Elimination, Practice-to-Earn & Accuracy Leaderboard (CR-001, CR-002, CR-003)

### Added
- **[CR-001] Deductive Elimination ("Aha!" Discovery Standard):**
  - Updated Unit 7 Lesson 3 ("Jump!" / "Skoči" and "Run!" / "Trči") to use mastered words from earlier units as distractors (*Jabuka*, *Kuća*, *Pas*).
  - Eliminates blind 25% guessing in text-only challenges; children deduce the answer via process-of-elimination.
  - Codified as the pedagogical rule in `docs/CURRICULUM_STANDARDS.md` underpinning all 20 units.
- **[CR-003] Hearts-Used Metric on Leaderboard:**
  - Added `hearts_used` column to `user_progress` and migrated Neon DB.
  - Increment counter automatically on `reduceHearts()` when mistakes occur.
  - Displayed `💔 [N] hearts used` alongside XP under each learner's name on the leaderboard.
  - Seeded initial baseline accuracy: Adriana (4 hearts used), Vanessa (7 hearts used), Silvia (15 hearts used).
- **[CR-002] Practice-to-Earn-a-Heart Engine (Concept A) & Voluntary Practice:**
  - Replaced unmetered "Free Refill" button with "💪 Practice to Earn a Heart (+1 ❤️)".
  - Built dedicated `/lesson/practice` review route with interactive `PracticeQuiz`.
  - Questions dynamically sourced from completed review challenges via `getPracticeLesson()`.
  - Mistakes in practice mode never deduct hearts.
  - Completing the 3 questions awards +1 Heart (capped at 5) and +10 XP via `awardPracticeSessionHeart()`.
  - Enabled voluntary practice: clicking the Heart counter in `UserProgress` anytime when hearts < 5 opens a recharge dialog without requiring the child to fail first.
  - Archived Concepts B and C into `docs/HEARTS_AND_GAMIFICATION.md` roadmap backlog.

---

## [2026-10-22] - Stage 4 Deployment, Visual Scaffolding & Leaderboard Governance

### Added
- **Stage 4 Curriculum (Units 16–20):**
  - Unit 16: *U školi i učionici* (School & Learning)
  - Unit 17: *Priroda i divlje životinje* (Wild Nature & Animals)
  - Unit 18: *Putovanje i prijevoz* (Travel, Ferries & Adventure)
  - Unit 19: *U kuhinji: Kuhanje i obitelj* (Cooking & Family Kitchen)
  - Unit 20: *Hrvatski blagdani i rođendan* (Birthdays & Celebrations)
  - 20 new lessons (including 5 new Boss Quests with Golden Trophy Crown).
  - 90 new challenges (all 4-option 2×2 grid).
- **144 High-Resolution Vector Illustrations:**
  - Added clean open-source vector SVGs in `public/*.svg` covering toys, animals, food, vehicles, nature, clothes, and body parts.
- **76 New Croatian Neural MP3s:**
  - Full voiceover with `hr-HR-GabrijelaNeural` for all Stage 4 phrases.
- **Progressive Scaffolding Fading Standard:**
  - Enforced image presence on Lesson 1 discoveries only; removed images from Lessons 2, 3, and 4 (Super Izazov) to test true retention.
- **Kids-Only Leaderboard Privacy:**
  - Filtered test accounts (`phil`, `J`) from the leaderboard.
  - Positioned Silvia (890 XP) in 3rd place behind Vanessa (910 XP) and Adriana (930 XP).
- **Living Documentation & Governance Suite (`docs/`):**
  - Added `docs/GOVERNANCE.md`, `docs/CURRICULUM_STANDARDS.md`, `docs/HEARTS_AND_GAMIFICATION.md`, `docs/ARCHITECTURE.md`, and `docs/CHANGELOG.md`.

---

## [2026-10-21] - Stage 3 Curriculum & Quality Standards Refinement

### Added
- **Stage 3 Curriculum (Units 11–15):** Daily Verbs, Town/Park, Prepositions, Bakery/Store, Sports/Celebrations.
- **Automated Option Auditor:** `scripts/audit-options.ts` checking for symmetry and 4 options.
- **Viewport Auto-Scroll:** Smooth scrolling to active lesson node `#current-lesson`.
- **Sliding-Scale Quests:** Milestone goals up to 10,000 XP with 3-tier sliding window.

---

## [2026-10-20] - Platform Launch & Base Architecture

### Added
- Dedicated Croatian-first platform deployment on Render (`twolingo.onrender.com`).
- Initial Units 1–10 (Greetings, Family, Animals, Numbers/Colors, Food, House, Body, Summer, Clothes, Weather).
- Neon Postgres schema setup with Drizzle ORM.
- Clerk authentication with kid profiles.
