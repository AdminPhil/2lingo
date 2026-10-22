# AI Agent Governance Rule: Mandatory Documentation & Pre-Merge Audit

Before writing any curriculum code, proposing changes, or seeding challenges in this repository, you **MUST**:

1. **Read and Adhere to [`docs/CURRICULUM_STANDARDS.md`](../../docs/CURRICULUM_STANDARDS.md):**
   - **Deductive Elimination:** When introducing a net-new word in text multiple choice, all 3 distractor options MUST be words the child has ALREADY mastered in previous units. Never force a blind guess.
   - **Progressive Fading:** Images are allowed in Lesson 1 (Discovery) only. Lessons 2, 3, and 4 (Super Izazov) MUST have `image_src = null`.
   - **4 Options (2×2 Grid):** Every challenge MUST have exactly 4 options.
   - **Zero Punctuation Giveaways:** Single-word noun options must have no trailing punctuation. Sentences must have identical punctuation and syntactic structure.
   - **Audio Required:** Every card must have a verified `.mp3` file in `public/audio/hr/`.

2. **Preserve User Progress ([`docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md)):**
   - NEVER drop or wipe `user_progress` or `challenge_progress` for live learners (`Silvia`, `Adriana`, `Vanessa`).

3. **Check for Clashes:**
   - Always run `npx tsx scripts/audit-curriculum-rules.ts` before committing.

4. **Sync Documentation ([`docs/CHANGELOG.md`](../../docs/CHANGELOG.md)):**
   - Record every feature, batch addition, or rule change in `docs/CHANGELOG.md` upon completion.
