# ❤️ Hearts, Gamification & Leaderboard Specification

---

## 💔 1. Hearts & Accuracy Tracking

### The Problem
Children often "speed-guess" through lessons by clicking options rapidly and abusing free heart refills.

### The Standard
1. **Lifetime Hearts Used (`hearts_used`):**
   - The `user_progress` table tracks cumulative hearts lost in `hearts_used`.
   - Every time `reduceHearts()` fires, `hearts_used` increments by 1.
2. **Leaderboard Display:**
   - Under each learner's name on the leaderboard, display their precision metric:
     `[XP] • 💔 [N] hearts used`.
   - This celebrates high accuracy and motivates kids to read and listen before guessing.

---

## 🎯 2. "Practice to Earn a Heart" Engine (Concept A)

1. **Remove Free Refill Button:**
   - The unmetered "Free Refill" button in `HeartsModal` is replaced with **"💪 Practice to Earn a Heart (+1 ❤️)"**.
2. **Review Quiz Mechanic (Concept A):**
   - A dedicated 3-question quick quiz is generated from challenges the child has already completed in previous units.
   - Answering the 3 review questions awards **+1 Heart** (up to the maximum of 5) and **+10 XP**.
   - During practice, mistakes do **not** cost hearts (`reduceHearts` is bypassed), providing a safe sandbox for healthy revision.
3. **Voluntary Practice Entry (No Need to Fail First):**
   - Children can voluntarily top up their hearts anytime (when hearts < 5) by clicking the Hearts counter in `UserProgress` on the map, leaderboard, or quests.
   - Clicking opens a friendly recharge modal: *"Need a Heart? ❤️ Complete 3 quick review questions to earn +1 Heart!"*
   - Eliminates the counter-intuitive behavior of having to intentionally fail a question just to trigger a refill.

---

## 📋 3. Pedagogical Backlog / Future Roadmap

Should Concept A require expansion or alternative modes in the future, the following concepts are preserved in the backlog:
- **Concept B (Replay Mastered Lesson):** Pulsing map beacon inviting children to replay any completed unit lesson on the map in practice mode.
- **Concept C ("Mistake Vault" Targeted Remediation):** An adaptive session that selectively re-tests the child on the exact challenges where `hearts_used` was incremented during recent lessons.

---

## 🏆 4. Leaderboard Privacy & Learning Pods Architecture (CR-005)

1. **Relational Pod Scoping:**
   - The query `getTopTenUsers` in `db/queries.ts` scopes learners to their active Learning Pod (`pods` and `pod_members` tables).
   - Only authorized members of the child's family or classroom pod appear on their leaderboard.
   - Admin, developer, and test accounts (`phil`, `J`) are excluded from family pods by design.
2. **Kid-Friendly Join Codes:**
   - Family pods generate unique 6-character invite codes (e.g. `ZUBAC6`). Kids can join their sisters or cousins without email or phone number sharing.
3. **Display Names:**
   - Always use proper capitalization (e.g. `Silvia`, `Adriana`, `Vanessa`).

---

## 🔥 5. Daily Streak Counter & Habit Flame Engine (CR-004)

1. **Daily Habit Loop:**
   - Children retain vocabulary through consistent daily contact. The daily streak counter tracks consecutive calendar days of practice.
   - `streak` (integer, default 0) and `last_active_date` (text `YYYY-MM-DD`) are tracked in `user_progress`.
2. **Consecutive Day Algorithm:**
   - **Same calendar day:** Practice maintains streak and updates timestamp without double-counting.
   - **Consecutive calendar day:** Practice increments streak by +1.
   - **Missed 1+ days:** Streak resets gracefully to 1 day on next practice.
3. **Interactive UI (`UserProgress`):**
   - Clickable flame icon 🔥 with streak counter in `UserProgress` header bar (`[Flag] [🔥 Streak] [⚡ XP] [❤️ Hearts]`).
   - Clicking opens the **Daily Streak Celebration Modal** detailing current streak, encouraging daily vocabulary habits, and celebrating consistency.
4. **Leaderboard Display:**
   - Under each learner's name on the leaderboard, streak is displayed alongside precision:
     `🔥 [N] days • 💔 [N] hearts used`.

---

## 🗺️ 6. Sliding-Scale Quests & Auto-Scroll

1. **Sliding-Scale Quests:**
   - Quests scale dynamically based on current user points, presenting the next 3 relevant milestones (up to 10,000 XP).
2. **Path Auto-Scroll:**
   - Navigation to `/learn` automatically scrolls the viewport smoothly to `#current-lesson`.


---

## 🌟 7. Collaborative Team Celebration Meter (CR-006)

1. **Knowledgehook Collective Celebration Model:**
   - Instead of purely zero-sum individual competition, learning pods share a weekly collective point target (`target_xp` default 1,000 XP).
   - Prevents discouragement for younger learners by allowing family members to pool their points toward a shared milestone.
2. **Multi-Pod XP Propagation:**
   - Every lesson completed and practice session finished awards +10 XP that simultaneously boosts the weekly celebration meter of every pod the child belongs to via `awardPodXp()`.
3. **Interactive Celebration Thermometer (`<PodCelebrationMeter />`):**
   - Renders at the top of the Leaderboard with real-time percentage fill, remaining XP countdown, and celebration status.
   - When 1,000 XP is achieved (or previewed), it triggers full-screen celebratory confetti (`react-confetti`) and opens the celebratory dialog modal with animated dancing mascot.
