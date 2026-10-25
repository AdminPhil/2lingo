# 🗄️ CroLingo Database Architecture, Data Models & State Machine

> **Document Status:** 🏛️ **CORE DATA ARCHITECTURE SPECIFICATION**  
> **Repository:** `AdminPhil/2lingo`  
> **ORM & Engine:** Drizzle ORM + Neon Serverless PostgreSQL (`@neondatabase/serverless`)  
> **Source Schema:** [`db/schema.ts`](file:///c:/Users/phili/Documents/phils_repo/db/schema.ts)  
> **Engineering Protocols:** See [`docs/ARCHITECTURE.md`](file:///c:/Users/phili/Documents/phils_repo/docs/ARCHITECTURE.md).

---

## 1. Dual-Domain Entity-Relationship Architecture

CroLingo's database separates cleanly into two distinct operational domains:
1. **The Curriculum Domain:** Static, declarative educational content (Courses, Units, Lessons, Challenges, and Options).
2. **The User, Gamification & Social Domain:** Dynamic state tracking individual progress, family pods, peer reactions, and subscriptions.

```mermaid
erDiagram
    %% CURRICULUM DOMAIN
    courses ||--o{ units : "organizes into"
    units ||--o{ lessons : "contains (exactly 4)"
    lessons ||--o{ challenges : "presents"
    challenges ||--o{ challenge_options : "offers (exactly 4)"

    %% USER & SOCIAL DOMAIN
    courses ||--o{ user_progress : "active course"
    user_progress ||--o| user_subscription : "bills via Stripe"
    user_progress ||--o{ challenge_progress : "completes"
    user_progress ||--o{ challenge_mistakes : "commits"
    challenges ||--o{ challenge_progress : "recorded for"
    challenges ||--o{ challenge_mistakes : "logged against"
    challenge_options ||--o{ challenge_mistakes : "selected distractor"

    pods ||--o{ pod_members : "enrolls"
    pods ||--o{ pod_reactions : "contains"
    user_progress ||--o{ pod_members : "belongs to"
    user_progress ||--o{ pod_reactions : "sends or receives"

    courses {
        serial id PK
        text title
        text image_src
    }

    units {
        serial id PK
        integer course_id FK "on delete cascade"
        text title
        text description
        integer order
    }

    lessons {
        serial id PK
        integer unit_id FK "on delete cascade"
        text title
        integer order
    }

    challenges {
        serial id PK
        integer lesson_id FK "on delete cascade"
        enum type "SELECT or ASSIST"
        text question
        integer order
    }

    challenge_options {
        serial id PK
        integer challenge_id FK "on delete cascade"
        text text
        boolean correct
        text image_src "null in L2-L4"
        text audio_src
    }

    user_progress {
        text user_id PK "Clerk user_id"
        text user_name
        text user_image_src
        integer active_course_id FK
        integer hearts "0 to 5, default 5"
        integer points "XP total"
        integer hearts_used "precision penalty"
        integer streak "consecutive days"
        text last_active_date "YYYY-MM-DD"
        text role "learner, parent, unassigned"
    }

    challenge_progress {
        serial id PK
        text user_id FK
        integer challenge_id FK "on delete cascade"
        boolean completed "default false"
    }

    challenge_mistakes {
        serial id PK
        text user_id FK
        integer challenge_id FK "on delete cascade"
        integer selected_option_id FK "on delete set null"
        timestamp created_at
    }

    pods {
        serial id PK
        text name
        text type "family or classroom"
        text invite_code UK "unique 6-char"
        text owner_id FK "parent user_id"
        integer target_xp "default 1000"
        integer current_xp "default 0"
        boolean celebration_unlocked "default false"
        integer week_number "default 1"
        timestamp created_at
    }

    pod_members {
        serial id PK
        integer pod_id FK "on delete cascade"
        text user_id FK
        text role "owner or member"
        timestamp joined_at
    }

    pod_reactions {
        serial id PK
        integer pod_id FK "on delete cascade"
        text sender_id
        text sender_name
        text receiver_id
        text type "high_five, star, flame"
        boolean seen "drives animated banner"
        timestamp created_at
    }

    user_subscription {
        serial id PK
        text user_id UK
        text stripe_customer_id UK
        text stripe_subscription_id UK
        text stripe_price_id
        timestamp stripe_current_period_end
    }
```

---

## 2. Table-by-Table Schema Dictionary

### Domain 1: Curriculum Content (Declarative & Static)

#### 1. `courses`
The top-level language registry. Currently contains Course `1` (*Croatian / Hrvatski*).
- `id`: `serial` primary key.
- `title`: `text`, not null. Course display name (e.g. `"Croatian"`).
- `imageSrc`: `text`, not null. Path to flag asset (e.g. `"/hr.svg"`).

#### 2. `units`
Curriculum units organized across the 4 Worlds (Zagreb, Coast, Plitvice, King's Landing).
- `id`: `serial` primary key.
- `courseId`: `integer` foreign key referencing `courses.id` (`onDelete: "cascade"`).
- `title`: `text`, not null (e.g. `"Unit 1"`, `"Unit 16"`).
- `description`: `text`, not null. Subtitle and pedagogical theme (e.g. `"U školi i učionici (At School & Learning)"`).
- `order`: `integer`, not null. Sequence order on the learning map.

#### 3. `lessons`
Individual lesson nodes along the path. Enforces the strict "3 + 1" Unit Arc (exactly 4 lessons per unit).
- `id`: `serial` primary key.
- `unitId`: `integer` foreign key referencing `units.id` (`onDelete: "cascade"`).
- `title`: `text`, not null (e.g. `"Pozdravi"`, `"Super Izazov"`).
- `order`: `integer`, not null (`1` = Discovery, `2` = Practice, `3` = Sentences, `4` = Boss Quest).

#### 4. `challenges`
Interactive quiz prompts presented to learners.
- `id`: `serial` primary key.
- `lessonId`: `integer` foreign key referencing `lessons.id` (`onDelete: "cascade"`).
- `type`: `pgEnum("type", ["SELECT", "ASSIST"])`.
  - `SELECT`: Image cards or compact choice tiles in a 2×2 or 4-column grid.
  - `ASSIST`: Full-width text list options.
- `question`: `text`, not null. The challenge prompt (e.g. `"Which one of these is 'Goodbye'?"`).
- `order`: `integer`, not null. Sequence within the lesson quiz.

#### 5. `challenge_options`
The selectable multiple-choice answers. Enforces the 4-Option Grid Invariant.
- `id`: `serial` primary key.
- `challengeId`: `integer` foreign key referencing `challenges.id` (`onDelete: "cascade"`).
- `text`: `text`, not null. The Croatian option text.
- `correct`: `boolean`, not null. Exactly one option per challenge is `true`.
- `imageSrc`: `text`, nullable. Present in Lesson 1; **strictly `null` in Lessons 2, 3, and 4**.
- `audioSrc`: `text`, nullable. Path to synthesized neural audio (e.g. `"/audio/hr/dovidenja.mp3"`).

---

### Domain 2: User Progress & Social Hierarchy (Dynamic & Mutable)

#### 6. `user_progress`
Core profile and gamification record per Clerk user.
- `userId`: `text` primary key (Clerk user ID).
- `userName`: `text`, default `"User"`. Display name on leaderboards.
- `userImageSrc`: `text`, default `"/mascot.png"`. Circular avatar image.
- `activeCourseId`: `integer` foreign key referencing `courses.id`.
- `hearts`: `integer`, default `5` (range 0–5). Current practice energy.
- `points`: `integer`, default `0`. Cumulative learner XP.
- `heartsUsed`: `integer`, default `0`. Cumulative mistakes metric measuring precision.
- `streak`: `integer`, default `0`. Consecutive calendar days of active practice.
- `lastActiveDate`: `text`, nullable (`YYYY-MM-DD`). Timestamp for streak calculations.
- `role`: `text`, default `"learner"`. Access control role: `"learner"`, `"parent"`, or `"unassigned"`.

#### 7. `challenge_progress`
Records whether a user has successfully mastered a specific challenge.
- `id`: `serial` primary key.
- `userId`: `text`, not null.
- `challengeId`: `integer` foreign key referencing `challenges.id` (`onDelete: "cascade"`).
- `completed`: `boolean`, default `false`.

#### 8. `challenge_mistakes`
Audit log of errors for the Parent Center Tricky Words analytics.
- `id`: `serial` primary key.
- `userId`: `text`, not null.
- `challengeId`: `integer` foreign key referencing `challenges.id` (`onDelete: "cascade"`).
- `selectedOptionId`: `integer` foreign key referencing `challenge_options.id` (`onDelete: "set null"`).
- `createdAt`: `timestamp`, default `now()`.

#### 9. `pods`
Family circles and collaborative learning groups.
- `id`: `serial` primary key.
- `name`: `text`, not null. Pod name (e.g. `"The Horvat Family"`).
- `type`: `text`, default `"family"`.
- `inviteCode`: `text` unique, not null. Clean 6-character alphanumeric code (e.g. `"HORVAT"`).
- `ownerId`: `text`, not null. Parent/Educator Clerk user ID who manages the pod.
- `targetXp`: `integer`, default `1000`. Collective weekly target for celebration confetti.
- `currentXp`: `integer`, default `0`. Current pooled XP accumulated this week.
- `celebrationUnlocked`: `boolean`, default `false`. Triggers celebratory confetti when `true`.
- `weekNumber`: `integer`, default `1`.
- `createdAt`: `timestamp`, default `now()`.

#### 10. `pod_members`
Membership join table establishing user enrollment and authorization.
- `id`: `serial` primary key.
- `podId`: `integer` foreign key referencing `pods.id` (`onDelete: "cascade"`).
- `userId`: `text`, not null.
- `role`: `text`, default `"member"` (`"owner"` for creator, `"member"` for children).
- `joinedAt`: `timestamp`, default `now()`.

#### 11. `pod_reactions`
Low-stress peer high-fives and cheer notifications.
- `id`: `serial` primary key.
- `podId`: `integer` foreign key referencing `pods.id` (`onDelete: "cascade"`).
- `senderId`: `text`, not null.
- `senderName`: `text`, not null.
- `receiverId`: `text`, not null.
- `type`: `text`, default `"high_five"`.
- `seen`: `boolean`, default `false`. Drives `<CheerBanner />` display on `/learn`.
- `createdAt`: `timestamp`, default `now()`.

#### 12. `user_subscription`
Stripe subscription state for Pro tier memberships.
- `id`: `serial` primary key.
- `userId`: `text` unique, not null.
- `stripeCustomerId`: `text` unique, not null.
- `stripeSubscriptionId`: `text` unique, not null.
- `stripePriceId`: `text`, not null.
- `stripeCurrentPeriodEnd`: `timestamp`, not null.

---

## 3. Core Operational State Machines

### 3.1 Challenge Submission & Scoring Pipeline

```mermaid
stateDiagram-v2
    [*] --> PromptActive: User views Challenge
    PromptActive --> Evaluating: Option Clicked
    
    Evaluating --> CorrectBranch: Option.correct == true
    Evaluating --> IncorrectBranch: Option.correct == false

    state CorrectBranch {
        [*] --> MarkCompleted: Insert challenge_progress
        MarkCompleted --> AwardXP: user_progress.points += 10
        AwardXP --> CheckSuperIzazov: Is Lesson 4?
        CheckSuperIzazov --> AddHeart: Yes (hearts = min(hearts+1, 5))
        CheckSuperIzazov --> PropagatePodXP: No
        AddHeart --> PropagatePodXP: awardPodXp(userId, 10)
    }

    state IncorrectBranch {
        [*] --> DeductHeart: user_progress.hearts -= 1
        DeductHeart --> TrackPenalty: user_progress.hearts_used += 1
        TrackPenalty --> LogMistake: Insert challenge_mistakes
    }

    CorrectBranch --> [*]: Render Success Toast & Animation
    IncorrectBranch --> [*]: Render Retry / Explanation Toast
```

---

### 3.2 Heart Energy & Recharge State Machine

```mermaid
stateDiagram-v2
    Full: 5 Hearts (Full Energy)
    Depleted: 1 to 4 Hearts
    Empty: 0 Hearts (Practice Required)

    [*] --> Full: Account Created
    Full --> Depleted: Incorrect Answer in Standard Quiz
    Depleted --> Depleted: Additional Mistake
    Depleted --> Empty: Final Heart Lost

    Depleted --> Full: Parent Magic Wand (adminRefillHearts)
    Empty --> Full: Parent Magic Wand (adminRefillHearts)

    Depleted --> Depleted: Complete Practice Quiz (+1 Heart)
    Empty --> Depleted: Complete Practice Quiz (+1 Heart)
    
    Depleted --> Depleted: Complete Super Izazov (+1 Heart)
    Empty --> Depleted: Complete Super Izazov (+1 Heart)

    Depleted --> Full: Reaches 5 Hearts
```

---

### 3.3 Daily Streak Habit Loop State Machine

```mermaid
stateDiagram-v2
    state CheckActiveDate <<choice>>
    state EvaluateGap <<choice>>

    [*] --> CheckActiveDate: Lesson or Practice Completed
    
    CheckActiveDate --> SameDay: last_active_date == today
    CheckActiveDate --> EvaluateGap: last_active_date != today

    SameDay --> [*]: Update timestamp (streak unchanged)

    EvaluateGap --> ConsecutiveDay: last_active_date == yesterday
    EvaluateGap --> BrokenStreak: last_active_date < yesterday

    ConsecutiveDay --> [*]: streak += 1, last_active_date = today
    BrokenStreak --> [*]: streak = 1 (Reset), last_active_date = today
```

---

## 4. Drizzle ORM Migration Protocol

### 4.1 Applying Schema Updates (`npm run db:push`)
CroLingo uses **Drizzle Kit Push** to synchronize TypeScript schema definitions with Neon PostgreSQL:
```bash
# Push schema updates non-destructively to Neon
npm run db:push
```
- Drizzle introspects the remote database, compares tables, and executes required `CREATE TABLE`, `ALTER TABLE`, or `ADD COLUMN` statements.
- Never drops tables or columns unless explicitly requested.

### 4.2 Sequence Synchronization Protocol
Neon PostgreSQL uses `serial` columns powered by underlying Postgres sequences (`units_id_seq`, `lessons_id_seq`, etc.). When running bulk inserts or restoration scripts, the sequence pointer can become desynchronized, causing `duplicate key value violates unique constraint` errors.

Whenever a seed script or migration completes, execute this SQL synchronization block:
```sql
SELECT setval('courses_id_seq', COALESCE((SELECT MAX(id) FROM courses), 1));
SELECT setval('units_id_seq', COALESCE((SELECT MAX(id) FROM units), 1));
SELECT setval('lessons_id_seq', COALESCE((SELECT MAX(id) FROM lessons), 1));
SELECT setval('challenges_id_seq', COALESCE((SELECT MAX(id) FROM challenges), 1));
SELECT setval('challenge_options_id_seq', COALESCE((SELECT MAX(id) FROM challenge_options), 1));
SELECT setval('pods_id_seq', COALESCE((SELECT MAX(id) FROM pods), 1));
SELECT setval('pod_members_id_seq', COALESCE((SELECT MAX(id) FROM pod_members), 1));
SELECT setval('pod_reactions_id_seq', COALESCE((SELECT MAX(id) FROM pod_reactions), 1));
SELECT setval('challenge_progress_id_seq', COALESCE((SELECT MAX(id) FROM challenge_progress), 1));
SELECT setval('challenge_mistakes_id_seq', COALESCE((SELECT MAX(id) FROM challenge_mistakes), 1));
```

---

## 5. Strict Zero Data Loss Invariant

> **MANDATORY POLICY FOR ALL DEVELOPERS AND AGENTS:**  
> Real children and families rely on CroLingo daily. Production accounts (`Adriana`, `Silvia`, `Vanessa`, `Zvon`) have earned thousands of XP, unlocked milestones, and built multi-day streaks. Under no circumstances may a curriculum update, database seed, or migration drop or truncate learner data.

### Seed Script Isolation Rule
All database seed scripts ([`scripts/seed.ts`](file:///c:/Users/phili/Documents/phils_repo/scripts/seed.ts), `scripts/prod.ts`) must isolate curriculum tables:
```ts
// ✅ PERMITTED: Truncating curriculum content tables only
await db.delete(challengeOptions);
await db.delete(challenges);
await db.delete(lessons);
await db.delete(units);

// ❌ STRICTLY FORBIDDEN: NEVER touch user progress or pods
// await db.delete(userProgress);     <-- NEVER!
// await db.delete(challengeProgress);<-- NEVER!
// await db.delete(pods);             <-- NEVER!
```

### Dynamic Coordinate Lookup
Neon Postgres auto-increment IDs shift across re-seeds. Scripts that refine or update specific challenges must **never** hardcode database IDs. Always lookup challenges using their natural hierarchical coordinates:
$$\text{Target Challenge} = \text{Query where } (\text{unit.order} = U \text{ and } \text{lesson.order} = L \text{ and } \text{challenge.order} = C)$$
This ensures that running a refinement script always modifies the exact intended challenge regardless of underlying sequence shifts.
