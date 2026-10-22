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

## 🧠 2. Deductive Elimination ("Aha!" Discovery Rule)

When introducing a net-new word in text multiple choice (without pictures):
- **NEVER use random, unmastered words as distractors.**
- **All 3 incorrect options MUST be words the child has ALREADY mastered in previous units.**

```
Example: Introducing "Jump!" (Skoči) in Unit 7:
✓ Correct:   Skoči  (New Target)
✗ Distractor: Jabuka (Mastered in Unit 1)
✗ Distractor: Kuća   (Mastered in Unit 6)
✗ Distractor: Pas    (Mastered in Unit 3)
```
*Cognitive Result:* The child deduces the answer via process-of-elimination, triggering a dopamine release that cements permanent memory without blind guessing.

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
