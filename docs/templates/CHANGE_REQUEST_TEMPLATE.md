# 📝 Change Request: [CR-XXX] [Title]

### 1. Proposed Change & Pedagogical Rationale
- **Target Area:** (e.g., Curriculum / Game Mechanics / Database / UI)
- **Problem Statement:** What problem or limitation does this solve?
- **Proposed Solution:** High-level summary of the change.

---

### 2. Pre-Flight Clash Check (Verification against `docs/`)
- [ ] **Deductive Elimination (`docs/CURRICULUM_STANDARDS.md`):** If introducing a net-new word without pictures, are all 3 distractor choices words the child has already mastered?
- [ ] **Progressive Scaffolding Fading (`docs/CURRICULUM_STANDARDS.md`):** Are images strictly restricted to Lesson 1 (Discovery)? Are Lessons 2, 3, and 4 (Super Izazov) 100% text + audio?
- [ ] **4-Option Grid (`docs/CURRICULUM_STANDARDS.md`):** Does every challenge have exactly 4 choices with uniform casing and zero trailing punctuation giveaways?
- [ ] **Asset Verification (`docs/ARCHITECTURE.md`):** Are all referenced `.mp3` and `.svg` files confirmed to physically exist on disk?
- [ ] **User Progress Guard (`docs/ARCHITECTURE.md`):** Does this ensure live user XP and completions (`Silvia`, `Adriana`, `Vanessa`) are untouched?
- [ ] **Leaderboard Privacy (`docs/HEARTS_AND_GAMIFICATION.md`):** Are test and admin accounts excluded from the leaderboard?

---

### 3. Implementation Plan
- **Database Schema Changes:** (if any)
- **Files to Modify / Create:**
- **Scripts to Run:**

---

### 4. Verification Gate
- [ ] Automated audit passes: `npx tsx scripts/audit-curriculum-rules.ts`
- [ ] TypeScript & Webpack build compiles cleanly: `npm run build`
- [ ] Live user progress verified intact.

---

### 5. Post-Flight Documentation Sync
- [ ] Added entry to `docs/CHANGELOG.md`.
- [ ] Updated corresponding specifications in `docs/*.md` if rules evolved.
