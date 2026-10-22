# 📝 Change Request: [CR-XXX] [Title]

### 1. Proposed Change & Pedagogical Rationale
- **Target Area:**
- **Problem Statement:**
- **Proposed Solution:**

---

### 2. Pre-Flight Clash Check (Verification against `docs/`)
- [ ] **Deductive Elimination (`docs/CURRICULUM_STANDARDS.md`):** If introducing a net-new word without pictures, are all 3 distractor choices words the child has already mastered?
- [ ] **Progressive Scaffolding Fading (`docs/CURRICULUM_STANDARDS.md`):** Are images strictly restricted to Lesson 1 (Discovery)? Are Lessons 2, 3, and 4 (Super Izazov) 100% text + audio?
- [ ] **4-Option Grid (`docs/CURRICULUM_STANDARDS.md`):** Does every challenge have exactly 4 choices with uniform casing and zero trailing punctuation giveaways?
- [ ] **Asset Verification (`docs/ARCHITECTURE.md`):** Are all referenced `.mp3` and `.svg` files confirmed to physically exist on disk?
- [ ] **User Progress Guard (`docs/ARCHITECTURE.md`):** Does this ensure live user XP and completions (`Silvia`, `Adriana`, `Vanessa`) are untouched?
- [ ] **Leaderboard Privacy (`docs/HEARTS_AND_GAMIFICATION.md`):** Are test and admin accounts excluded from the leaderboard?

---

### 3. Implementation Summary
- **Files Modified / Created:**
- **Scripts Executed:**

---

### 4. Verification Gate
- [ ] Automated audit: `npx tsx scripts/audit-curriculum-rules.ts`
- [ ] Next.js build: `npm run build`
- [ ] Live user progress verified intact.

---

### 5. Post-Flight Documentation Sync
- [ ] Updated `docs/CHANGELOG.md`
- [ ] Updated relevant `docs/*.md`
