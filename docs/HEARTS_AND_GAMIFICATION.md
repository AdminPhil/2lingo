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

## 🏆 4. Leaderboard Privacy & Child Protection

1. **Strict Kids-Only Filter:**
   - The query `getTopTenUsers` in `db/queries.ts` must always filter by an authorized list of child learners (`Adriana`, `Vanessa`, `Silvia`).
   - Admin, developer, and test accounts (`phil`, `J`) must never appear on the leaderboard.
2. **Display Names:**
   - Always use proper capitalization (e.g. `Silvia`, `Adriana`, `Vanessa`).

---

## 🗺️ 4. Sliding-Scale Quests & Auto-Scroll

1. **Sliding-Scale Quests:**
   - Quests scale dynamically based on current user points, presenting the next 3 relevant milestones (up to 10,000 XP).
2. **Path Auto-Scroll:**
   - Navigation to `/learn` automatically scrolls the viewport smoothly to `#current-lesson`.
