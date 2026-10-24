# 📜 2lingo Living Changelog

All notable changes, pedagogical updates, curriculum expansions, and infrastructure upgrades are documented here.

---

## [2026-10-24] - Landing Page High-Fidelity Artwork & Šahovnica Ribbon Polish (CR-022)

### Added & Refined
- **[CR-022] ✅ IMPLEMENTED & VERIFIED - High-Fidelity Artwork & Šahovnica Ribbon Polish:**
  - **High-Resolution Paško Hero Artwork (`public/pasko-hero.jpg`):** Overhauled landing page hero illustration with dedicated digital cartoon artwork featuring Paško the Dalmatian Pup, the red *licitarsko srce*, coastal island ferry (*trajekt*), golden sun, and authentic speech bubbles.
  - **Paško Mascot Navigation Avatar (`public/mascot.png`):** Integrated Paško's high-res circular avatar into the header navigation brand logo.
  - **Authentic Croatian Checkerboard (*Šahovnica*) Ribbon (`app/(marketing)/header.tsx`):** Fixed dashed gradient line with an authentic framed dual-row alternating red-and-white conic checkerboard pattern (`bg-[repeating-conic-gradient(#DC2626_0%_25%,#FFFFFF_0%_50%)]`).
  - **Action Gate Typography & Depth (`app/(marketing)/page.tsx`):** Upgraded "I Already Have an Account" and "I'm New Here! Start Learning" to clean title casing with 3D drop depth and active button scale transitions.

---

## [2026-10-24] - Croatian Landing Page Redesign & "Paško the Dalmatian" Mascot (CR-021)

### Added & Refined
- **[CR-021] ✅ IMPLEMENTED & VERIFIED - Croatian Cultural Landing Page & Paško Mascot:**
  - **New Official Mascot ("Paško the Dalmatian Pup"):** Replaced Duolingo-derivative green cube with an authentic Croatian mascot: Paško, an adorable Dalmatian puppy with Dalmatian black spots, a red-and-white Croatian checkerboard (*šahovnica*) ear spot, and a red bandana collar (`public/pasko.svg` & updated `public/mascot.svg`).
  - **Rich Croatian Hero Illustration (`public/hero-croatian.svg` & `public/hero.svg`):** Built a vector hero scene featuring Paško, Mediterranean kids Luka and Mia, the Adriatic coastal island ferry (*trajekt*), the golden sun, a traditional folk gingerbread *licitarsko srce*, and Croatian speech bubbles (*"Bok!"*, *"Hvala!"*, *"Idemo!"*).
  - **Two Child-Friendly Action Gates (`app/(marketing)/page.tsx`):** Eliminated the ambiguous "Get Started" button in favor of two purpose-driven gates:
    - 🔑 **"I Already Have an Account"** (Primary Green 3D Button) — direct sign-in for returning kids and parents.
    - ✨ **"I'm New Here! Start Learning"** (High-Contrast Clean 3D Button) — sign-up for new families.
  - **Parent Portal Navigation (`app/(marketing)/header.tsx`):** Added dedicated "Parent Portal →" header action directing parents straight to `/admin` upon authentication, paired with a subtle Croatian checkerboard ribbon accent along the header base.

---

## [2026-10-24] - Parent Center Navigation Label Standardization (BUG-009)

### Fixed
- **[BUG-009] ✅ RESOLVED & VERIFIED - Standardized Header Return Button Label ("Back to Learning Path"):**
  - **Symptom:** The return button in the Parent Center (`/admin`) header was inconsistently labeled `Back to Croatian Map`, clashing with platform-standard terminology.
  - **Fix:** Updated button label in `app/admin/page.tsx` to `Back to Learning Path`, matching the Parent Center welcome banner (`View Learning Path`) and the Parent Mode banner (`browsing the Learning Path as a parent`).

---

## [2026-10-24] - Super-Admin User-to-Pod Assignment & Roster Management (CR-020)

### Added & Refined
- **[CR-020] ✅ IMPLEMENTED & VERIFIED - Super-Admin User-to-Pod Assignment & Roster Management:**
  - **Server Action (`actions/pod.ts` - `adminAddUserToPod`):** Implemented secure server action enabling Super-Administrators (or pod owners) to assign any existing learner or parent to any pod. Handles idempotent duplicate membership checks, dynamically updating role (`member` vs `admin`) if already present. Revalidates `/admin`, `/leaderboard`, and `/learn`.
  - **Add Member Modal (`components/admin/add-member-to-pod-modal.tsx`):** Built interactive modal with real-time user search, user avatar/name/ID preview, member collision prevention (greying out users already in the pod), and dual-role picker (`Learner` vs `Pod Admin`).
  - **Pod Management Card Integration (`components/admin/pod-management-card.tsx`):** Rendered clean "+ Add User" action button next to the member count header on each pod card and wired it to the modal.
  - **Admin Page Data Wiring (`app/admin/page.tsx`):** Passed system-wide learner roster (`allLearners`) and `isSuperAdmin` authorization flag into `PodManagementCard`.

---

## [2026-10-24] - Sidebar Navigation Deduplication & Parent-First Ordering (CR-019)

### Added & Refined
- **[CR-019] ✅ IMPLEMENTED & VERIFIED - Sidebar Navigation Deduplication & Parent-First Hierarchy:**
  - **Removed Redundancy:** Removed the duplicate bottom "Parent Center" button from `components/sidebar.tsx`.
  - **Parent-First Ordering:** When an administrator or parent logs in, **"Parent Center"** is automatically prioritized as the top navigation item right below the 2Lingo logo, followed by Learn, Leaderboard, and Quests.
  - **Student View Unaltered:** Learner accounts continue to see clean, distraction-free student navigation (Learn, Leaderboard, Quests) with zero administrative elements.

---

## [2026-10-24] - Parent Mode Banner Layout & Clipping Fix (BUG-008)

### Fixed
- **[BUG-008] ✅ RESOLVED & VERIFIED - Parent Mode Banner Bottom Edge Trimmed by Sticky Header:**
  - **Symptom:** On `/learn`, the green "Parent Account" banner had its bottom 28px trimmed and sliced off, obscuring its bottom rounded corners and button shadow.
  - **Root Cause:** In `app/(main)/learn/page.tsx`, `ParentModeBanner` was placed before `<Header />`. Because `<Header />` has `sticky top-0 bg-white lg:mt-[-28px]`, its solid white background overlaid and clipped the bottom of the banner.
  - **Fix:** Reordered feed elements to anchor `<Header />` at the top of the feed with `ParentModeBanner` positioned cleanly below it. Refined button styling and padding to ensure complete border-radius geometry.

---

## [2026-10-24] - Parent Learning Path Access & Seamless Dual-Mode Navigation (CR-018)

### Added & Fixed
- **[CR-018] ✅ IMPLEMENTED & VERIFIED - Eliminated `/learn` Redirect Trap & Enabled Seamless Parent Learning:**
  - **Unrestricted Learning Path Access:** Removed the forced redirect loop in `app/(main)/learn/page.tsx` so parents can freely take lessons, play Croatian challenges, and inspect units alongside their children without getting pushed to `/admin`.
  - **Parent Mode Banner (`components/parent-mode-banner.tsx`):** Added a discreet, stylish top banner on `/learn` for parent accounts with a 1-click **"Parent Center →"** button for instant return.
  - **Parent Center Shortcut:** Added **"View Learning Path"** button directly inside the Parent Center welcome header (`app/admin/page.tsx`).
  - **Sidebar Streamlining:** Preserved standard `/learn` navigation across all user roles while keeping the discrete "Parent Center" button permanently accessible for authorized admins and parents.

---

## [2026-10-24] - Avatar Skin Tone Refinement & Croatian Example Names (CR-017)

### Added & Refined
- **[CR-017] ✅ IMPLEMENTED & VERIFIED - Avatar Skin Tone Harmonization & Croatian Example Names:**
  - **Lighter Skin Tone Avatars:**
    - Replaced pixelated low-res dark assets (`woman.svg`, `man.svg`, `girl.svg`, `boy.svg`) with modern, clean, scalable vector illustrations.
    - Updated skin complexion across all human avatars to a natural, warm, Mediterranean/Croatian light tone (`#FBD38D` / `#FDDEC9`) that seamlessly matches the Grandma and Grandpa avatars.
    - Switched `AddChildModal` avatar selector to point directly to dedicated kid avatars (`/girl.svg` and `/boy.svg`).
  - **Authentic Croatian Example Names:**
    - Updated "Add Child Learner" dialog placeholders from Valentina to Croatia's two most popular children's names: one girl and one boy:
      - Child's First Name: `e.g. Luka or Mia`
      - Username: `e.g. luka or mia`
    - Harmonized helper text in `actions/child-account.ts` to `(e.g. luka_z or mia12)`.

---

## [2026-10-24] - Parent Direct Child Provisioning, Onboarding Guide & Parent Default Landing (CR-016)

### Added
- **[CR-016] ✅ IMPLEMENTED & VERIFIED - Direct Child Account Creation & Parent Default Navigation:**
  - Parents can now provision learner accounts for their children (e.g. Valentina) directly from the Parent Center without requiring an email address.
  - Automatically provisions a kid-friendly Clerk username and password with avatar selection, assigns `role: 'learner'`, and enrolls them into the family pod with `role: 'member'`.
  - Confirmation dialog provides one-click copyable credentials so children can immediately log in on any device.
- **Parent Center Helper Card (`components/admin/how-to-add-children-card.tsx`):**
  - Prominent onboarding card displayed directly under the welcome banner detailing both setup options:
    - Option 1: Direct Account Creation (no email required).
    - Option 2: Self-Join on Child's Device using the 6-character Family Code or 1-click invite link.
- **Parent Center Default Landing:**
  - When parents log in, they automatically land on `/admin` (Parent Center) instead of the learner map.
  - Sidebar dynamically displays "Curriculum" linking to `/learn?preview=true` so parents can inspect learning progress and challenges without being redirected.
  - Home landing page button automatically updates to "Open Parent Center" when a parent account is signed in.

---

## [2026-10-24] - Child Onboarding Experience & Multi-Pod Leaderboard Switcher (CR-015)

### Added
- **[CR-015] ✅ IMPLEMENTED & VERIFIED - Child Onboarding Screen & Multi-Pod Leaderboard Switcher:**
  - **Kid-Friendly Join Screen (`components/modals/child-onboarding-modal.tsx`):**
    - First-time child onboarding prompt: *"🇭🇷 Join Your Pod! Do you have a Family or School Pod code from your parent or teacher?"*
    - Interactive 6-slot letter tile input with automatic focus progression, backspace navigation, and paste support (e.g. typing or pasting `ZGOMBA`).
    - Enrolls learners with `role: 'member'` (strictly kid-safe learner permissions).
    - Includes *"I'll join later"* skip option with local dismissal persistence so unlinked students can immediately enjoy the curriculum map without friction.
  - **Multi-Pod Leaderboard Switcher (`components/pod-switcher.tsx`):**
    - Built interactive pill switcher on `/leaderboard` allowing students and parents in multiple pods (e.g. Family Pod vs School Classroom) to toggle seamlessly between pod leaderboards and celebration meters.
    - Added dedicated **"➕ Join a Pod"** button on the leaderboard answering user query *"HOW DO I JOIN A POD?"* with one-click access to the letter tile prompt.
  - **Relational Multi-Pod Queries (`db/queries.ts`):**
    - Updated `getTopTenUsers(activePodId?: number)` to scope rankings dynamically to any active pod while continuing to exclude adult owners from child leaderboards.
    - Added `getUserPods()` to return all pods a user belongs to.
    - Enhanced `getUserPod(activePodId?: number)` with fallback to the user's primary pod.
  - **Zustand Store (`store/use-child-onboarding-modal.ts`):**
    - Modal state management enabling join pod prompts from header, switcher, or first-time layout detection.

---

## [2026-10-23] - Multi-Family Role Schema & Parent Onboarding Wizard (CR-014)

### Added
- **[CR-014] ✅ IMPLEMENTED & VERIFIED - Multi-Family Role Schema & Parent Onboarding Wizard:**
  - **Schema Evolution:** Added `role: text("role").default("learner").notNull()` to `user_progress` table in `db/schema.ts` and Neon Postgres.
  - **Account Role Migration:** Marked existing sister learners (Adriana, Vanessa, Silvia) as `learner` and Philip as `parent`.
  - **Role Selection Dialog (`components/modals/role-onboarding-modal.tsx`):**
    - First-time role onboarding wizard: *"Dobrodošli! Are you joining as a: [ 👨‍👩‍👧‍👦 Parent / Educator ] or [ 🎒 Young Learner ]?"*
    - For Young Learners: Automatically initializes learner mode and preserves the learning map.
    - For Parents: Multi-step setup wizard prompting for Family Circle Name (e.g. *"The Horvat Family"*), weekly celebration target (500 XP, 1,000 XP ⭐, or 2,000 XP), and optional custom invite code (e.g. `HORVAT`).
  - **Server Actions (`actions/family-onboarding.ts`):**
    - `createFamilyOnboarding`: Dynamically generates or validates unique invite codes, inserts the new pod with `owner_id = userId`, grants the parent `owner` status in `pod_members`, and sets their role to `parent`.
    - `selectLearnerRole`: Configures learner status cleanly without disruption.
  - **Multi-Tenant Isolation in Parent Center (`app/admin/page.tsx`):**
    - Strictly isolates regular family admins to pods they own (`p.ownerId === userId`), with 0 cross-access to other families.
    - Retains Super-Admin platform oversight for Phil (`philip.zgomba@gmail.com`).
  - **Parent Center Pod Management Updates (`components/admin/pod-management-card.tsx`):**
    - Enhanced role pills to display "Parent" for pod owners and "Admin" for co-admins.
    - Added one-click copy button for family invite codes.
  - **Zustand Store (`store/use-role-modal.ts`) & UI Components (`components/ui/input.tsx`):**
    - Centralized role modal state management.

---

## [2026-10-23] - Parent Center Welcome Banner Gradient Syntax & Readability (BUG-007)

### Fixed
- **[BUG-007] ✅ RESOLVED & VERIFIED - White-on-White Unreadable Text in Parent Center Welcome Banner:**
  - **Symptom:** In `/admin`, the Welcome Banner ("Dobrodošli, Philip! 🇭🇷", subtitle, and active family code) rendered with white text on an unstyled white background, making the text nearly invisible.
  - **Root Cause:** The container used the invalid experimental class `bg-linear-to-r` instead of Tailwind v3's standard `bg-gradient-to-r`.
  - **Fix:** Corrected `bg-linear-to-*` to `bg-gradient-to-*` across `app/admin/page.tsx`, `components/admin/tricky-words-card.tsx`, `components/cheer-banner.tsx`, and `components/pod-celebration-meter.tsx`. Added `bg-green-600` solid color fallback to ensure rich emerald gradient contrast and crisp white text.

---

## [2026-10-23] - Email Super-Admin & Scoped Parent Center Access (CR-013)

### Added
- **[CR-013] Email Super-Admin & Scoped Parent Center Access:**
  - Modernized `lib/admin.ts` with email-based authorization checking Clerk's `currentUser()` and `auth()`.
  - Configured `philip.zgomba@gmail.com` as permanent platform **Super-Admin** and Owner of the Zgomba Family Pod (`pods.id = 1`).
  - Added support for `ADMIN_EMAILS` and `SUPER_ADMIN_USER_IDS` environment variables.
  - Implemented dynamic pod and learner scoping in `app/admin/page.tsx`:
    - Regular family admins/parents are strictly scoped to pods they own (`ownerId === userId`) and members of their family circle.
    - Super-Admin (`philip.zgomba@gmail.com`) is granted complete platform oversight and can view all active family pods.
    - Displayed Super-Admin badge with Crown indicator.
  - Added discrete **"🛡️ Parent Center"** button in `components/sidebar.tsx` (and `components/mobile-sidebar.tsx`) that appears dynamically only when an authorized administrator or parent account is logged in.

---

## [2026-10-23] - Practice Session Quality: Number Alignment & Visual Collision Resolving (BUG-005, BUG-006)

### Fixed
- **[BUG-005] ✅ RESOLVED & VERIFIED - Challenge 43 ("Five (5)") Incorrectly Requiring "Četiri":**
  - **Symptom:** In practice review (`/lesson/practice`) and Unit 4 Lesson 1, selecting **`Pet`** (Five) was marked incorrect (red highlight), while **`Četiri`** (Four) was accepted.
  - **Root Cause:** In `challenge_options` for Challenge 43, Option 2680 (`Četiri`) had `correct: true` while Option 2681 (`Pet`) had `correct: false`.
  - **Fix:** Flipped the boolean flags in Neon Postgres so `Pet` (ID: 2681) is `true` and `Četiri` (ID: 2680) is `false`. Verified 100% precision.
- **[BUG-006] ✅ RESOLVED & VERIFIED - Duplicate Slide SVG Used for "Swing" (`Ljuljačka` vs `Tobogan`):**
  - **Symptom:** In Unit 12 Lesson 1 (Challenge 199), both **`Ljuljačka`** (Swing) and **`Tobogan`** (Slide) displayed the exact same orange slide illustration.
  - **Root Cause:** File inspection revealed `public/swing.svg` was a binary copy of `public/slide.svg`.
  - **Fix:** Replaced `public/swing.svg` with a dedicated, authentic vector SVG of a playground A-frame swing set with chains, seat, and crossbars.
- **Practice Session Deep Audit & Additional Visual Collisions Resolved:**
  - Ran automated curriculum audit across all 359 challenges.
  - Identified and resolved 4 additional image collisions:
    - Challenge 1 & 3: `Molim` (Please) re-routed from `/mascot.svg` to `/heart.svg`, leaving `/mascot.svg` exclusive to `Bok` (Hello).
    - Challenge 13: `Baka` (Grandma) assigned new dedicated `/grandma.svg`, distinguishing it from `Mama` (`/woman.svg`).
    - Challenge 14: `Djed` (Grandpa) assigned new dedicated `/grandpa.svg`, distinguishing it from `Tata` (`/man.svg`).
  - Full audit confirms **0 semantic number mismatches, 0 option cardinality errors, and 0 duplicate image collisions** across all 359 challenges.

---

## [2026-10-22] - Tricky Words & Mistake Heatmap Analytics (CR-012)

### Added
- **[CR-012] Tricky Words & Mistake Heatmap Analytics:**
  - Created `challenge_mistakes` telemetry table in Neon Postgres and wired into `reduceHearts()` in `actions/user-progress.ts` and `app/lesson/quiz.tsx` to automatically capture error selections, distractors, and timestamps.
  - Implemented `getTrickyWordsAnalytics()` in `db/queries.ts` computing top tricky vocabulary items, distractor confusion frequencies, and completion accuracy across Units 1–20.
  - Built interactive `<TrickyWordsCard />` inside the Parent Portal at `/admin` featuring:
    - **Top 10 Tricky Words:** Ranked breakdown of words requiring repetition (e.g. `Laku noć` vs `Dobar dan`, `Molim` vs `Hvala`), accuracy percentages, and specific distractor confusions.
    - **Unit Heatmap:** 20-unit visual matrix showing mastery status chips (Mastered 90%+, Solid 75-89%, Needs Review, and Upcoming) with completion counters and precision progress bars.
    - **Offline Family Conversation Starters:** 3 actionable Croatian prompts for breakfast, dinner, and car rides giving parents practical phrases to reinforce tricky concepts away from screens.
  - Integrated into the Parent & Educator Center shell at `/admin`.

---

## [2026-10-22] - Learner Health & Parent Magic Wand Overrides (CR-011)

### Added
- **[CR-011] Learner Health Card & Parent Magic Wand Overrides:**
  - Implemented server actions `adminRefillHearts()`, `adminProtectStreak()`, and `adminAwardPraiseXp()` in `actions/admin-overrides.ts`.
  - Built interactive `<LearnerHealthCard />` inside the Parent Portal at `/admin` displaying active status, heart meters, flame counts, and real-time override tools for each sister.
  - **Instant Heart Refill:** One-click magic wand replenishment to 5/5 hearts, dissolving frustration after difficult lessons without waiting.
  - **Streak Grace Protection:** One-click streak flame boost for busy school days, recitals, or weekend trips so hard-earned flames are never lost.
  - **Real-Life Croatian Praise Award:** Dialog allowing parents to award +25, +50, or custom XP presets (e.g. "Spoke Croatian at dinner! 🇭🇷", "Helped sister practice vocabulary! 🌟") that instantly reflect in both individual learner XP and the family pod celebration meter.

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
