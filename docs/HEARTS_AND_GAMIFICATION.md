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

## 🎯 2. "Practice to Earn a Heart" Engine

1. **Remove Free Refill Button:**
   - The unmetered "Free Refill" button in `HeartsModal` is replaced with **"Practice to Earn a Heart"**.
2. **Review Quiz Mechanic:**
   - A 3-question quick quiz is generated from units the child has already completed.
   - Answering 3/3 correctly awards **+1 Heart**.
   - Directs mistakes into healthy revision rather than locking the child out or giving unearned passes.

---

## 🏆 3. Leaderboard Privacy & Child Protection

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
