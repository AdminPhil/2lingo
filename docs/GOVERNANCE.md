# 🛡️ CroLingo Change Governance & Pre-Merge Protocol

> **Mandatory Policy:** Every pull request, direct commit, curriculum batch, or database script **MUST** be verified against the standards in `docs/` before merging into `main`.  
> **Developer Setup:** For local setup, environment variables, and directory orientation, refer to [`README.md`](file:///c:/Users/phili/Documents/phils_repo/README.md).

---

## 🚦 The Pre-Merge Protocol

Before executing any code changes or database seeds, the author (developer or AI assistant) must execute this 3-step cycle:

```mermaid
flowchart LR
    A["1. Pre-Flight Clash Check (docs/3. CURRICULUM_STANDARDS.md)"] --> B["2. Automated Audit (scripts/audit-curriculum-rules.ts)"]
    B --> C["3. Post-Flight Sync (docs/CHANGELOG.md & docs/REGISTRY.md)"]
    C --> D["Merge into main & Deploy"]
```

---

## 📋 The Pre-Merge Checklist

Every change must satisfy all items on this checklist:

### 1. Pedagogical Integrity ([`docs/3. CURRICULUM_STANDARDS.md`](./3.%20CURRICULUM_STANDARDS.md))
- [ ] **Deductive Elimination:** When introducing a net-new word without pictures, are all 3 distractor options words the child has **already mastered** in previous units? (No blind guessing).
- [ ] **Progressive Fading:** Are images restricted to Lesson 1 (Discovery)? Are Lessons 2, 3, and 4 (Boss Quest) 100% text + audio only?
- [ ] **Grid Symmetry:** Does every multiple-choice challenge have **exactly 4 options** in a balanced 2×2 grid?
- [ ] **Zero Punctuation Giveaways:** Single-word noun cards have zero trailing punctuation. Sentence options share identical syntax and punctuation across all 4 choices.

### 2. Asset & Infrastructure Integrity ([`docs/2. ARCHITECTURE_AND_DATA.md`](./2.%20ARCHITECTURE_AND_DATA.md))
- [ ] **Audio Playback:** Every option has a verified Azure neural `.mp3` file on disk under `public/audio/hr/`.
- [ ] **Vector Visuals:** Every option with `image_src` has a verified `.svg` file on disk under `public/`.
- [ ] **User Progress Guard:** No script or migration may wipe active user XP, hearts, or challenge completions (`Silvia`, `Adriana`, `Vanessa`).

### 3. Gamification & Privacy ([`docs/6. HEARTS_AND_GAMIFICATION.md`](./6.%20HEARTS_AND_GAMIFICATION.md) & [`docs/7. SECURITY_AND_COPPA.md`](./7.%20SECURITY_AND_COPPA.md))
- [ ] **Leaderboard Filter:** Test and admin accounts (e.g. `phil`, `J`) are strictly filtered out of the leaderboard; only legitimate child learners are displayed.
- [ ] **Heart Accountability:** All errors increment `hearts_used` to track learner accuracy.

### 4. Navigation & Interface Integrity
- [ ] **No "Shop" Item in Navigation:** Ensure `/shop` is strictly omitted from the primary sidebar and mobile navigation unless explicitly ordered by product owners (preserves the "Practice to Earn a Heart" gamification engine).

### 5. Post-Flight Sync
- [ ] **Changelog Updated:** Every feature, unit addition, or schema change is documented in [`docs/CHANGELOG.md`](./CHANGELOG.md).
- [ ] **Master Registry Updated:** Every completed Change Request or Bug Ticket is added to [`docs/REGISTRY.md`](./REGISTRY.md) with Ticket ID, title, date, and status, and the header summary counts incremented.
- [ ] **Standards Updated:** If a pedagogical rule evolved during the work, the corresponding document in `docs/` is updated immediately.
