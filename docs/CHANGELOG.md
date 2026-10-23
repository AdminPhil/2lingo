# 📜 2lingo Living Changelog

All notable changes, pedagogical updates, curriculum expansions, and infrastructure upgrades are documented here.

---

## [2026-10-22] - Pod & Family Circle Management Hub (CR-010)

### Added
- **[CR-010] Pod & Family Circle Management Hub:**
  - Built interactive `<PodManagementCard />` inside the Parent Portal at `/admin` showing all active pods, custom invite codes, member counts, and weekly goal progress.
  - Implemented server actions `updatePodSettings()`, `createPod()`, and `deletePod()` in `actions/pod.ts` allowing parents to edit pod names, assign custom invite codes (e.g. `ZGOMBA`, `BAKA`), and adjust weekly celebration goals (500–2,000 XP).
  - Enhanced student-facing `<PodHeader />` dialog on the Leaderboard with a two-tab interface allowing family members to either join an existing pod with a code or create a brand new pod with 1 click.
  - Full relational integrity: deleting non-default pods safely cascades memberships while preserving individual learner XP.

---

## [2026-10-22] - Parent & Admin Access Governance (CR-009)

### Added
- **[CR-009] Parent & Admin Access Governance & Portal Shell:**
  - Modernized `lib/admin.ts` with role-based authorization supporting administrator accounts and `ADMIN_USER_IDS` environment variable, eliminating the obsolete legacy hardcoded gate.
  - Built a dedicated, responsive **Parent & Educator Center** dashboard at `/admin`.
  - Created key metric KPI cards for the Zgomba Family Pod, weekly team XP goal progress, and family streak status.
  - Implemented real-time Learner Health Roster tracking live stats (XP, streaks, hearts, accuracy) for Adriana, Vanessa, and Silvia.
  - Scaffolded modular launch points for upcoming Pod Management (CR-010), Magic Wand Overrides (CR-011), and Tricky Words Analytics (CR-012).
  - Maintained strict child isolation with zero access leaks and seamless back-navigation to the Croatian course map.

---

## [2026-10-22] - Family Pod Name Correction: Zgomba Family (BUG-004)

### Fixed
- **[BUG-004] ✅ RESOLVED & VERIFIED - Family Pod Name and Invite Code Correction:**
  - Renamed the default sister learning circle in Neon Postgres database from "Zubac Family" to **"Zgomba Family"** (`pods.id = 1`).
  - Updated the official family invite code from `ZUBAC6` to **`ZGOMBA`**.
  - Aligned default component props and placeholders across `components/pod-header.tsx` and `components/pod-celebration-meter.tsx`.

---

## [2026-10-22] - Landing Page Course Alignment & Uncovered Flags Removal (CR-008)

### Changed
- **[CR-008] Landing Page Course Alignment & Uncovered Flags Removal:**
  - Removed placeholder buttons and flags for uncovered languages (Spanish, French, Italian, and Japanese) from `app/(marketing)/footer.tsx`.
  - Aligned the public marketing footer to celebrate 2lingo's bespoke Croatian language features:
    - 🇭🇷 **Hrvatski (Croatian)** — Authentic 20-unit curriculum
    - 🔥 **Daily Streaks** — Habit flame retention engine
    - ❤️ **Practice for Hearts** — Low-stress heart practice mini-game
    - 🏡 **Family Pods & Teams** — Collaborative sister learning circles
  - Ensures 100% truth in advertising for parents and young learners.

---

## [2026-10-22] - Peer High-Fives & Social Cheer Engine (CR-007)

### Added
- **[CR-007] Peer High-Fives & Social Cheer Engine (Phase 3):**
  - Added relational `pod_reactions` table to Postgres schema in `db/schema.ts` with migration.
  - Built server actions `sendPodCheer(receiverId, type)` and `claimCheer(cheerId)` in `actions/cheer.ts` with rate-limiting (1 cheer per recipient per calendar day).
  - Built interactive `<CheerButton />` component integrated on the Leaderboard next to each sister's card.
  - Built `<CheerBanner />` notification banner displayed on both `/learn` and `/leaderboard` when unread cheers are waiting.
  - Claiming a high-five awards a micro-bonus of +5 XP to the recipient and propagates +5 XP to active family pods.
  - Child safety and COPPA compliant: pre-set positive reactions only (no open text messaging).

---

## [2026-10-22] - Collaborative Team Celebration Meter (CR-006)

### Added
- **[CR-006] Collaborative Team Celebration Meter (Knowledgehook Engine):**
  - Added `current_xp`, `celebration_unlocked`, and `week_number` columns to the `pods` table in Postgres schema.
  - Implemented `awardPodXp(userId, xp)` action in `actions/pod.ts` ensuring that whenever a child completes a lesson or practice quiz, their earned XP simultaneously boosts all family/class pods they belong to.
  - Wired collaborative XP accumulation into `actions/challenge-progress.ts` and `actions/user-progress.ts`.
  - Built interactive `<PodCelebrationMeter />` component featuring a dynamic progress thermometer, percentage tracker, remaining XP countdown, and a full-screen Confetti Party celebration modal.
  - Initialized Zubac Family pod to 740 / 1,000 XP (74%) to give Adriana, Vanessa, and Silvia an exciting, achievable collaborative milestone.
  - Zero disruption to individual learner accounts; fully compliant with all curriculum and architectural standards.

---

## [2026-10-22] - Learning Pods & Family Circles Engine (CR-005)

### Added
- **[CR-005] Learning Pods & Family Circles Engine (Phase 1):**
  - Added relational `pods` and `pod_members` tables to Postgres schema in `db/schema.ts`.
  - Created initial `"Zubac Family"` pod (ID: 1, Invite Code: `ZUBAC6`) with Adriana as admin, and Vanessa and Silvia as members.
  - Replaced hardcoded username matching in `getTopTenUsers` with dynamic relational pod scoping, permanently securing kid privacy while enabling dynamic multi-pod participation.
  - Created server actions `joinPodByCode()` and `createPod()` in `actions/pod.ts`.
  - Added `<PodHeader />` component to the Leaderboard showing pod name, member count badge, copyable invite code, and interactive "Join Pod" modal dialog.
  - Zero disruption to existing learner data; preserved all XP, streaks, and hearts.

---

## [2026-10-22] - Daily Streak Counter & Habit Flame Engine (CR-004)

### Added
- **[CR-004] Daily Streak Counter & Habit Flame Engine:**
  - Added `streak` (integer, default 0) and `last_active_date` (text `YYYY-MM-DD`) columns to `user_progress` with automated migration.
  - Implemented consecutive calendar day streak calculation algorithm in `lib/streak.ts` (`calculateStreak`).
  - Wired streak tracking into lesson completion (`upsertChallengeProgress`) and practice sessions (`awardPracticeSessionHeart`).
  - Designed custom flame badge asset (`public/streak.svg`) and integrated it into the `UserProgress` header bar across `/learn`, `/leaderboard`, and `/quests`.
  - Added interactive Daily Streak Modal with celebratory animations and habit guidance when clicking the flame icon.
  - Integrated streak metrics into the Leaderboard (`🔥 [N] day(s) • 💔 [N] hearts used`).
  - Baseline initialization safely preserved all existing XP, hearts, and progress for Adriana, Vanessa, and Silvia with zero disruption.

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

### Fixed
- **[BUG-001] ✅ RESOLVED & VERIFIED - Heart Click Inactivity in Lesson Header & Production Deploy Sync:**
  - Resolved issue where clicking the Heart icon at top-right inside an active lesson (`app/lesson/header.tsx`) was a non-interactive static `div`. Converted to an interactive button that displays the Practice Recharge modal (`Need a Heart? Current: X/5 ❤️`) with one-click routing to `/lesson/practice`.
  - Triggered Render deployment synchronization (`dep-dbd315vavr4c73998im0`) so all voluntary practice triggers in `components/user-progress.tsx` and `app/lesson/header.tsx` are live in production.
  - Verified and passed end-to-end testing with active learner Silvia (4 hearts).
- **[BUG-002] ✅ RESOLVED & VERIFIED - Incorrect Option Mapping in Unit 3 Lesson 4 ("Little cat" -> "Konj"):**
  - **Symptom:** In the Practice Review mini-game (`/lesson/practice`), the question `"Little cat"` required the incorrect answer `"Konj"` (Horse) instead of `"Mala mačka"`.
  - **Root Cause:** In Unit 3 Lesson 4 (Boss Quest), challenges 3 through 6 had their option sets circularly offset during initial coordinate assignment in `scripts/refine-units-1-5.ts`, misaligning questions for "Horse", "Big dog", "Little cat", and "Good dog".
  - **Fix:** Realigned challenges 3, 4, 5, and 6 in the database (`scripts/fix-bug-u3l4.ts`) and seed script (`scripts/refine-units-1-5.ts`):
    - Ch 3: `"Which one of these is 'Horse'?"` -> `Konj` (T)
    - Ch 4: `""Big dog""` -> `Veliki pas` (T)
    - Ch 5: `""Little cat""` -> `Mala mačka` (T)
    - Ch 6: `""Good dog""` -> `Dobar pas` (T)
  - Verified with 0 violations in curriculum audit tool.
- **[BUG-003] ✅ RESOLVED & VERIFIED - Bread Question Incorrectly Requiring "Čokolada" & Unit 3/4 Alignment:**
  - **Symptom:** In Unit 5 Lesson 2 Challenge 4, the question `"Bread"` marked `"Čokolada"` (Chocolate) as correct instead of `"Kruh"` (Bread).
  - **Root Cause:** Coordinate assignment in `scripts/refine-units-1-5.ts` assigned `correct: true` to option 1 (`Čokolada`) instead of option 3 (`Kruh`). Semantic dictionary audit also identified and corrected question-option offsets in Unit 3 Lesson 2 (Duck / Pig) and Unit 4 Lesson 4 (Blue / One / Ten).
  - **Fix:** Realigned options across Unit 5 L2, Unit 3 L2, and Unit 4 L4 in Neon database (`scripts/fix-all-mismatched-challenges.ts`) and updated `scripts/refine-units-1-5.ts`:
    - Unit 5 L2 Ch 4: `"Bread"` -> `Kruh` (T) vs `Čokolada`, `Sladoled`, `Jabuka`
    - Unit 3 L2 Ch 3: `"the duck"` -> `Patka` (T)
    - Unit 3 L2 Ch 4: `"Pig"` -> `Svinja` (T)
    - Unit 4 L4 Ch 4: `"Blue"` -> `Plava` (T)
    - Unit 4 L4 Ch 5: `"One"` -> `Jedan` (T)
    - Unit 4 L4 Ch 6: `"Ten"` -> `Deset` (T)
  - Full automated semantic scan across all 359 challenges confirms 0 remaining semantic mismatches.

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
