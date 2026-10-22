# 📚 2lingo Curriculum & Pedagogical Standards

> **The Pedagogical Constitution:** These rules are inviolable. Any curriculum change or seed script must strictly adhere to these standards.

---

## 🏗️ 1. The "3 + 1" Unit Arc Standard

Every unit in the curriculum contains exactly 4 lessons:

| Lesson | Focus | Pedagogical Mechanism | Visuals | Audio |
| :--- | :--- | :--- | :---: | :---: |
| **Lesson 1** | **Visual Vocabulary Discovery** | Introduces 4 core nouns for the first time. | **ON** (Kid vector SVGs) | Gabrijela Neural |
| **Lesson 2** | **Active Practice & Verbs** | Sensory association, actions, and verb pairs. | **OFF** (Active Recall) | Gabrijela Neural |
| **Lesson 3** | **Modular Compound Sentences** | Connects prior unit words with new verbs (e.g. *Mama kuha juhu*). | **OFF** (Comprehension) | Gabrijela Neural |
| **Lesson 4** | **👑 Super Izazov (Boss Quest)** | Cumulative review quest rewarding the Golden Trophy Crown. | **OFF** (True Retention) | Gabrijela Neural |

---

## 🧠 2. Deductive Elimination ("Aha!" Discovery Rule & Systematic Underpinning)

Whenever a net-new word or action is introduced in a text-only format (e.g., in Lesson 3 Progressive Fading, Lesson 2 active recall, or any challenge where `image_src` is null):
- **NEVER use random, unmastered words as distractors.** Introducing an unfamiliar target alongside unfamiliar distractors forces a blind 25% guess, producing anxiety, unearned heart loss, and guessing habits.
- **The Golden Rule:** All 3 distractor options MUST be words the learner has **already mastered in earlier units**.

### Systematic Architecture & Underpinning Rules
1. **Target Word Isolation:** Exactly one choice is the net-new target (e.g., *Skoči* for "Jump!").
2. **Mastered Distractor Pool:** The 3 incorrect choices must be sampled strictly from prior units with high recognition (e.g., Unit 1 *Jabuka*, Unit 3 *Pas*, Unit 6 *Kuća*).
3. **Semantic Divergence:** Distractors should intentionally span different semantic domains (e.g., one food noun, one animal, one household object) to ensure zero semantic ambiguity.
4. **Immediate Deduction ("Aha!" Moment):** The child reads the card:
   - *"Jabuka? No, that's Apple."*
   - *"Kuća? No, that's House."*
   - *"Pas? No, that's Dog."*
   - *"Skoči MUST be Jump!"*
   This dopamine-triggering deductive discovery creates an active mental anchor, encoding the word into long-term memory far deeper than passive flashcard viewing or blind guessing.
5. **Chained Reinforcement:** In sequential challenges within the same lesson, a newly deduced word can immediately serve as a known distractor for the NEXT new word (e.g., in Unit 7 Lesson 3 Ch 2, *Skoči* serves as a known distractor when introducing *Trči*).
6. **Curriculum-Wide Applicability:** This standard applies across all 20 units. Any script introducing new vocabulary in faded or text-only challenges must strictly pull its 3 distractors from the mastered prior-unit vocabulary pool.

```
Example: Introducing "Jump!" (Skoči) in Unit 7 Lesson 3:
✓ Correct:   Skoči   (New Target — Jump!)
✗ Distractor: Jabuka  (Mastered Unit 1 — Apple)
✗ Distractor: Kuća    (Mastered Unit 6 — House)
✗ Distractor: Pas     (Mastered Unit 3 — Dog)

Next Challenge: Introducing "Run!" (Trči) in Unit 7 Lesson 3:
✓ Correct:   Trči    (New Target — Run!)
✗ Distractor: Skoči   (Deduced in Challenge 1 — Jump!)
✗ Distractor: Mačka   (Mastered Unit 3 — Cat)
✗ Distractor: Voda    (Mastered Unit 1 — Water)
```

---

## 🎨 3. Progressive Scaffolding Fading Rule

- **Lesson 1 (Discovery):** Visual icons (`image_src`) are attached to vocabulary cards so the child learns without anxiety.
- **Lessons 2, 3 & 4 (Practice & Boss Quests):** **`image_src = NULL`**.
- Visual crutches are removed so the child must read, listen, and retrieve the Croatian word from memory.
- In **Super Izazov**, challenges must NEVER have picture giveaways.

---

## ⚖️ 4. Distractor Symmetry & The 2×2 Grid

1. **4 Options Required:** Every `SELECT` and `ASSIST` challenge must have **exactly 4 options**.
   - Fits standard phone/tablet screens without orphan cards.
   - Reduces random guessing to 25%.
2. **Zero Punctuation Giveaways:**
   - Single-word vocabulary cards and noun choices must **NEVER** have trailing punctuation (`!`, `?`, `.`).
   - Sentence cards must share the **exact same punctuation and syntactic length** across all 4 choices so pattern-matching kids cannot deduce the right answer by shape.
3. **Uniform Casing:** All options in a challenge must share identical casing (e.g. all Capitalized).

---

## 🔊 5. Audio Integrity Standard

- 100% of challenge options must have a valid `audioSrc` pointing to `/audio/hr/<slug>.mp3`.
- Voice: `hr-HR-GabrijelaNeural` (Azure Neural Croatian TTS, rate `-5%`).
- The physical audio file must exist in `public/audio/hr/` before the database is seeded.
