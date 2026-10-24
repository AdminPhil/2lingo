# 📖 2lingo Lesson Planning & Curriculum Authoring Guide

> **Document Status:** 🏛️ **ACTIVE CURRICULUM AUTHORING STANDARD**  
> **Repository:** `AdminPhil/2lingo`  
> **Audience:** Curriculum Authors, Native Croatian Educators, Linguists, and Software Engineers  
> **Companion Documents:** [`docs/CURRICULUM_STANDARDS.md`](file:///c:/Users/phili/Documents/phils_repo/docs/CURRICULUM_STANDARDS.md) (The Invariant Constitution), [`docs/DESIGN_SYSTEM.md`](file:///c:/Users/phili/Documents/phils_repo/docs/DESIGN_SYSTEM.md) (Visuals & Regional Stages)

---

## 1. Pedagogical Philosophy & Audience

### 1.1 The Learner Profile
2lingo is engineered specifically for **diaspora children, heritage learners, and young families** (ages 5–14+). 
- **The Emotional Hurdle:** Heritage learners often experience *linguistic anxiety*—feeling shy or embarrassed when speaking around fluent relatives (Baka, Deda, cousins).
- **The Core Pedagogical Mandate:** Every lesson must be **low-friction, anxiety-free, and high in positive dopamine**. We never test an unlearned word without visual or deductive scaffolding. Guessing should feel like an exciting detective mystery ("Aha!"), never a frustrating blind 25% coin toss.

---

## 2. The Anatomy of a 2lingo Unit: The "3 + 1" Arc

Every unit in the 2lingo curriculum consists of **exactly 4 lessons** (typically ~18 to 22 challenge prompts total). Each lesson has a distinct pedagogical function:

```mermaid
flowchart LR
    L1["Lesson 1: Visual Discovery<br/>🖼️ Images ON<br/>🎯 4 Core Nouns"] 
    --> L2["Lesson 2: Sensory Recall & Verbs<br/>🚫 Images OFF<br/>🎯 Actions & Verb Pairs"] 
    --> L3["Lesson 3: Modular Sentences<br/>🚫 Images OFF<br/>🎯 Compound Phrases & Deduction"] 
    --> L4["Lesson 4: Super Izazov (Boss Quest)<br/>👑 Images OFF<br/>🏆 Retention & Golden Crown"]
```

| Lesson | Focus | Pedagogical Mechanism | Visuals (`imageSrc`) | Audio (`audioSrc`) | Challenge Count |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Lesson 1** | **Visual Vocabulary Discovery** | Introduces 4 core target nouns for the first time with zero anxiety. | **ON** (`kid vector SVG`) | Gabrijela Neural | 4 – 5 challenges |
| **Lesson 2** | **Active Practice & Verbs** | Fades visuals. Introduces action verbs or sensory adjective pairs. | **NULL** (Active Recall) | Gabrijela Neural | 4 – 5 challenges |
| **Lesson 3** | **Modular Compound Sentences** | Connects prior-unit nouns with new verbs (*Subject + Verb + Object*). | **NULL** (Comprehension) | Gabrijela Neural | 4 – 5 challenges |
| **Lesson 4** | **👑 Super Izazov (Boss Quest)** | Cumulative review of the unit. Tests true retrieval; awards Golden Crown. | **NULL** (True Retention) | Gabrijela Neural | 5 – 6 challenges |

---

## 3. Step-by-Step Lesson Plan Creation Workflow

Follow these 8 steps when authoring any new unit (e.g., Units 21 through 120):

```mermaid
flowchart TD
    S1["1. Select Unit Theme & Cultural Setting"] --> S2["2. Choose 4 Target Nouns & 2 Action Verbs"]
    S2 --> S3["3. Author Lesson 1 (Visual Discovery Cards)"]
    S3 --> S4["4. Author Lesson 2 (Sensory Recall & Actions)"]
    S4 --> S5["5. Author Lesson 3 (Compound Sentences with Deductive Distractors)"]
    S5 --> S6["6. Author Lesson 4 (Super Izazov Cumulative Review)"]
    S6 --> S7["7. Generate & Verify Neural Audio Assets"]
    S7 --> S8["8. Run Automated Audit & Seed Database"]
```

### Step 1: Select Unit Theme & Cultural Setting
- Pick a concrete, child-friendly topic (e.g., *At the Bakery*, *Summer at the Coast*, *Animals on the Farm*, *Sports Day*).
- Align with the **Regional Journey Stage** defined in [`docs/DESIGN_SYSTEM.md`](file:///c:/Users/phili/Documents/phils_repo/docs/DESIGN_SYSTEM.md) (e.g. Continental, Dalmatian Coast, Slavonia, or Istria).

### Step 2: Choose 4 Target Nouns & 2 Action Verbs
Every unit introduces:
- **4 Core Nouns** (Concrete, tangible items easy to illustrate: e.g. *Burek*, *Kruh*, *Jabuka*, *Sir*).
- **2 Paired Verbs or Descriptive Adjectives** (e.g. *Kupiti* / To buy, *Jesti* / To eat, or *Toplo* / Warm, *Svježe* / Fresh).

### Step 3: Author Lesson 1 (Visual Discovery)
- Introduce each of the 4 nouns individually with `imageSrc` attached.
- Prompt: `"Which of these is 'Bread'?"` → Choices: *Kruh* (with `/bread.svg`), *Jabuka* (with `/apple.svg`), etc.
- **Rule:** Lesson 1 is the **only** lesson where `imageSrc` is permitted.

### Step 4: Author Lesson 2 (Sensory Recall & Actions)
- **Remove all images (`imageSrc = null`).**
- Test the 4 nouns purely by reading and listening.
- Introduce the unit's 2 core action verbs using **Deductive Elimination** (see Section 4 below).

### Step 5: Author Lesson 3 (Modular Compound Sentences)
- Construct simple, reusable 3-word sentences:
  $$\text{Subject (Mastered Noun)} + \text{Verb (New Action)} + \text{Object (Target Noun)}$$
  *Example:* `"Mama kupuje kruh"` (Mom buys bread) or `"Deda jede burek"` (Grandpa eats burek).
- **Enforce Deductive Distractors:** When testing a full sentence or new verb, the 3 distractors must be constructed from familiar vocabulary so the child can deduce the meaning without panic.

### Step 6: Author Lesson 4 (Super Izazov — Boss Quest)
- Mix all 4 nouns, the 2 verbs, and the compound sentences in a cumulative review.
- Challenge difficulty escalates from word recognition to auditory phrase translation.
- Finishing Lesson 4 unlocks the **Golden Trophy Crown** on the unit map and awards celebratory pod XP.

### Step 7: Generate & Verify Neural Audio Assets
- 100% of challenge options and prompt phrases must have high-quality audio synthesized using Azure Cognitive Services:
  - **Voice:** `hr-HR-GabrijelaNeural`
  - **Rate:** `-5%` (slightly measured for young learners)
  - **Output Path:** `public/audio/hr/<slug>.mp3`
- Run the generation script: `python scripts/generate_croatian_audio.py`.

### Step 8: Run Pre-Flight Automated Audit
Before committing to the database, run the automated curriculum rules auditor:
```bash
npx tsx --env-file=.env.local scripts/audit-curriculum-rules.ts
```
The script validates zero missing audio, zero broken SVGs, zero illegal images on Lessons 2–4, and proper 4-option symmetry.

---

## 4. The Deductive Elimination ("Aha!") Distractor Standard

This is 2lingo's most vital pedagogical mechanism. 

When introducing a net-new word or phrase in Lessons 2, 3, or 4 where images are turned off:
1. **Never use unfamiliar words as distractors.** That creates an unfair 25% blind guess.
2. **The 3 distractors MUST be words the child already mastered in earlier units.**

```
Example: Introducing "Skoči!" (Jump!) in Unit 7:
─────────────────────────────────────────────────────────────
Target:     "Jump!"
Choices:    1. Jabuka   (Mastered Unit 1 — Apple)   -> "No, that's Apple"
            2. Kuća     (Mastered Unit 6 — House)   -> "No, that's House"
            3. Pas      (Mastered Unit 3 — Dog)     -> "No, that's Dog"
            4. Skoči    (New Target — Jump!)        -> "Aha! It MUST be Skoči!"
─────────────────────────────────────────────────────────────
```
By process of elimination, the child's brain actively deducts the answer. This releases dopamine, anchors the word in memory, and builds confidence.

---

## 5. Standard Lesson Plan Authoring Template

Copy this template when creating any new Unit before writing code:

```markdown
# Unit [Number]: [Croatian Title] ([English Title])
- **Regional Stage:** [e.g. Stage 2: Kvarner & Dalmatian Coast]
- **CEFR Target:** [e.g. A1.2]
- **Target Vocabulary:**
  - Noun 1: [Croatian] ([English]) -> Asset: `/slug.svg`
  - Noun 2: [Croatian] ([English]) -> Asset: `/slug.svg`
  - Noun 3: [Croatian] ([English]) -> Asset: `/slug.svg`
  - Noun 4: [Croatian] ([English]) -> Asset: `/slug.svg`
  - Verb / Action 1: [Croatian] ([English])
  - Verb / Action 2: [Croatian] ([English])

---

### Lesson 1: Visual Discovery (Images ON)
- **Challenge 1:** Select "[Noun 1]" (Image ON)
  - Choices: [Noun 1]*, [Distractor A], [Distractor B], [Distractor C]
- **Challenge 2:** Select "[Noun 2]" (Image ON)
- **Challenge 3:** Select "[Noun 3]" (Image ON)
- **Challenge 4:** Select "[Noun 4]" (Image ON)

### Lesson 2: Active Recall & Verbs (Images OFF)
- **Challenge 1:** Select "[Noun 1]" (Text + Audio Only)
- **Challenge 2:** Select "[Noun 2]" (Text + Audio Only)
- **Challenge 3:** Introduce "[Verb 1]" via Deductive Elimination (3 Mastered Distractors)
- **Challenge 4:** Introduce "[Verb 2]" via Deductive Elimination

### Lesson 3: Modular Sentences (Images OFF)
- **Challenge 1:** Sentence: "[Subject] [Verb 1] [Noun 1]"
- **Challenge 2:** Sentence: "[Subject] [Verb 2] [Noun 2]"
- **Challenge 3:** Conversational Prompt / Question
- **Challenge 4:** Listening Comprehension

### Lesson 4: Super Izazov (Boss Quest — Images OFF)
- **Challenge 1:** Rapid Noun Recall
- **Challenge 2:** Action Verb Recall
- **Challenge 3:** Sentence Construction / Assist
- **Challenge 4:** Auditory Discrimination
- **Challenge 5:** Final Unit Boss Challenge (Unlocks Golden Trophy Crown)
```

---

## 6. Complete Walkthrough Example: Unit 14 (*U pekari i na tržnici*)

Here is how Unit 14 was authored using this exact methodology:

### Unit 14: U pekari i na tržnici (*At the Bakery & Farmer's Market*)
- **Stage:** Stage 3 (Plitvice & Slavonia / Food & Daily Life)
- **Target Nouns:**
  1. *Kruh* (Bread) — `/bread.svg`
  2. *Kroasan* (Croissant) — `/croissant.svg`
  3. *Sir* (Cheese) — `/cheese.svg`
  4. *Rajčica* (Tomato) — `/tomato.svg`
- **Target Verbs:**
  - *Kupiti / Kupuje* (To buy / Buys)
  - *Svježe* (Fresh)

---

#### Lesson 1: Visual Discovery
1. **Challenge 1:** "Bread"
   - Correct: **Kruh** (`/bread.svg`)
   - Distractors: *Jabuka* (`/apple.svg`), *Mlijeko* (`/milk.svg`), *Voda* (`/water.svg`)
2. **Challenge 2:** "Croissant"
   - Correct: **Kroasan** (`/croissant.svg`)
   - Distractors: *Kruh*, *Sir*, *Čokolada*
3. **Challenge 3:** "Cheese"
   - Correct: **Sir** (`/cheese.svg`)
   - Distractors: *Kruh*, *Kroasan*, *Jabuka*
4. **Challenge 4:** "Tomato"
   - Correct: **Rajčica** (`/tomato.svg`)
   - Distractors: *Jabuka*, *Banana*, *Naranča*

---

#### Lesson 2: Active Recall & Verbs (Images OFF)
1. **Challenge 1:** "Bread" (Audio only)
   - Correct: **Kruh** (No image)
   - Distractors: *Sir*, *Mlijeko*, *Jabuka*
2. **Challenge 2:** "Fresh" (Deductive Elimination)
   - Correct: **Svježe** (New target)
   - Distractors: *Pas* (Dog - Unit 3), *Kuća* (House - Unit 6), *Auto* (Car - Unit 12)
   - *Child deducts: Pas is dog, Kuća is house, Auto is car -> Svježe MUST be fresh!*
3. **Challenge 3:** "To buy" (Deductive Elimination)
   - Correct: **Kupiti** (New target)
   - Distractors: *Spavati* (To sleep - Unit 11), *Piti* (To drink - Unit 5), *Trčati* (To run - Unit 7)

---

#### Lesson 3: Modular Sentences (Images OFF)
1. **Challenge 1:** "Mom buys bread"
   - Correct: **Mama kupuje kruh.**
   - Distractors: *Mama pije vodu.*, *Tata vozi auto.*, *Deda spava u sobi.*
2. **Challenge 2:** "Fresh bread and cheese"
   - Correct: **Svježi kruh i sir.**
   - Distractors: *Topla juha i voda.*, *Mala mačka i pas.*, *Crveni auto i lopta.*

---

#### Lesson 4: Super Izazov (Boss Quest)
1. **Challenge 1:** Rapid vocabulary check: *Rajčica*
2. **Challenge 2:** Audio challenge: *Topli kroasan*
3. **Challenge 3:** Assist sentence: *Mi kupujemo kruh na tržnici.*
4. **Challenge 4:** Question: *"Što je ovo?"* → *"Ovo je svježi sir."*
5. **Challenge 5 (Final Boss):** *"U pekari miriše topli kruh."* (At the bakery, warm bread smells wonderful).
   - Unlocks the **Golden Trophy Crown** for Unit 14!

---

## 7. Quality Checklist for Every Lesson Plan

Before approving any lesson plan for database seeding, verify:
- [ ] Exactly 4 lessons in the unit (Visual, Verbs, Sentences, Super Izazov).
- [ ] Images exist on disk and appear **ONLY** in Lesson 1.
- [ ] Lessons 2, 3, and 4 have `imageSrc = null`.
- [ ] Every net-new word in text-only challenges has 3 distractors from **prior mastered units**.
- [ ] Every challenge has **exactly 4 choices** with uniform punctuation and casing.
- [ ] Every choice has an audio file (`/audio/hr/<slug>.mp3`) synthesized with `hr-HR-GabrijelaNeural`.
- [ ] Script `npx tsx scripts/audit-curriculum-rules.ts` passes with 0 rule violations.
