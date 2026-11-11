# 📍 2lingo Active Session State & Continuity Anchor

> **Purpose:** Ensures seamless handover across conversation threads without requiring context compaction (`/compact`). Any new conversation can inspect this single file to immediately resume project work with zero loss of context.
> **Last Synchronized:** 2026-11-04
> **Active Branch:** `main` (commit `a5ed3c3`)
> **Deployment:** Render deploy `dep-dblsom49v7es73d9m0kg` (Zero-polling API trigger)

---

## 🏛️ Current Architectural & Curriculum Status

- **Curriculum Scale:** **40 Units**, **160 Lessons**, **689 Challenges**, **2,756 Options** across **8 Worlds**.
- **Latest Completed Milestone:** **CR-082** — Level 2 Graduation Capstone: *Nikola Tesla & The Starry Night Sky (Units 36–40)* introducing the Croatian Future Tense (*Futur I: učit ćemo, gledat ćemo, putovat ćemo, izumit ćemo*).
- **Latest Bug Fix:** **BUG-043** — Mobile sign-out and profile-switcher inactive drawer buttons resolved via z-index elevation (`z-[150]`), dedicated `<SignOutButton />`, controlled mobile drawer auto-dismissal, and automated regression test suite.
- **Master Registry Counts:** **82 Completed Change Requests** (CR-001 to CR-082) | **43 Resolved Bug Tickets** (BUG-001 to BUG-043) | **0 Queued**.
- **Active Learners in Production DB:**
  1. Adriana: **5,950 XP**
  2. Vanessa: **1,750 XP**
  3. Silvia: **1,325 XP**
  *(All live learner progress strictly guarded and preserved).*

---

## 🛡️ Pre-Flight Verification Gates (Current Baseline)

- **Curriculum Rules Audit:** `npx tsx scripts/audit-curriculum-rules.ts` passes with **0 violations**.
- **TypeScript:** `npx tsc --noEmit` passes with **0 errors**.
- **Test Suites:** `npx vitest run` passes with **24/24 suites**, **271/271 tests passing**.

---

## 🧭 Invariants & Architectural Rules

1. **Lesson 1 Visual Discovery Invariant:** Every Unit Lesson 1 must feature 4 `SELECT` challenges with 4 unique visual flashcards on disk before progressive fading in Lessons 2–4 (`ASSIST` mode, `imageSrc: null`).
2. **Audio-Text Parity Guard:** Every spoken synthesis transcript in `scripts/generate-world*-audio.py` must match `challenge_options.text` 1:1.
3. **No Shop Route:** Never add or re-introduce `/shop` into navigation. Heart restoration occurs through retrieval practice or parent magic wands.
4. **Learner Preservation:** Never drop or reset database progress for Adriana, Vanessa, or Silvia.

---

## 📋 Candidate Backlog & Next Horizons

1. **Level 3 Ideation & Curriculum Planning (Worlds 9+):**
   - Higher-level grammatical concepts (conditional tenses, reflexive verbs, cases, extended conversational dialogues).
2. **Post-Launch World 8 Monitoring:**
   - Verify learner telemetry and end-to-end audio/visual playback on live production site.
3. **Classroom & Parent Portal Enhancements:**
   - Teacher analytics, student print kit refinements, and family circle engagement features.

---

## ⚡ Quick Protocol for New Conversations

When the user starts a fresh chat window, they can simply type:
- `"continue"` or `"status"` or `"what's next?"`

The agent should:
1. Read `docs/SESSION_STATE.md` and `docs/REGISTRY.md`.
2. Confirm current system health (run audit if needed).
3. Offer the next recommended actions or await the user's specific instruction.
