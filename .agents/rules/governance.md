# AI Agent Governance Rule: Mandatory Documentation & Pre-Merge Audit

Before writing any curriculum code, proposing changes, or seeding challenges in this repository, you **MUST**:

1. **Format Proposals Using the Change Request Template:**
   - Use the structure in [`docs/templates/CHANGE_REQUEST_TEMPLATE.md`](../../docs/templates/CHANGE_REQUEST_TEMPLATE.md) for all proposed features and curriculum modifications.

2. **Read and Adhere to [`docs/3. CURRICULUM_STANDARDS.md`](../../docs/3.%20CURRICULUM_STANDARDS.md):**
   - **Deductive Elimination:** When introducing a net-new word in text multiple choice, all 3 distractor options MUST be words the child has ALREADY mastered in previous units. Never force a blind guess.
   - **Progressive Fading:** Images are allowed in Lesson 1 (Discovery) only. Lessons 2, 3, and 4 (Super Izazov) MUST have `image_src = null`.
   - **4 Options (2×2 Grid):** Every challenge MUST have exactly 4 options.
   - **Zero Punctuation Giveaways:** Single-word noun options must have no trailing punctuation. Sentences must have identical punctuation and syntactic structure.
   - **Audio Required:** Every card must have a verified `.mp3` file in `public/audio/hr/`.

3. **Preserve User Progress ([`docs/2. ARCHITECTURE_AND_DATA.md`](../../docs/2.%20ARCHITECTURE_AND_DATA.md)):**
   - NEVER drop or wipe `user_progress` or `challenge_progress` for live learners (`Silvia`, `Adriana`, `Vanessa`).

4. **Automated Audit Check:**
   - Always run `npx tsx scripts/audit-curriculum-rules.ts` before committing.

5. **Sync Documentation ([`docs/CHANGELOG.md`](../../docs/CHANGELOG.md)):**
   - Record every feature, batch addition, or rule change in `docs/CHANGELOG.md` upon completion.
