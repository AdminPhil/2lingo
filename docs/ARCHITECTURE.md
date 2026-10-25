# ⚙️ CroLingo System Architecture & Engineering Specification

> **Document Status:** 🏛️ **CORE ENGINEERING SPECIFICATION**  
> **Repository:** `AdminPhil/2lingo`  
> **Source of Truth:** Data modeling, database relationships, user hierarchies, and server action contracts.  
> **Pedagogical Spec:** See [`docs/CURRICULUM_STANDARDS.md`](file:///c:/Users/phili/Documents/phils_repo/docs/CURRICULUM_STANDARDS.md) for curriculum rules.  
> **Developer Setup:** See [`README.md`](file:///c:/Users/phili/Documents/phils_repo/README.md) for local environment configuration.

---

## 1. System Overview

CroLingo is a full-stack, cloud-native web application built on **Next.js 14**, **Neon Serverless PostgreSQL**, and **Clerk Authentication**:

```mermaid
flowchart TD
    Client["Client Viewports<br/>(Desktop, Tablet, iPad, Mobile)"]
    
    subgraph AppLayer ["Next.js 14 App Router (Render / Vercel)"]
        Marketing["Public Marketing & Auth<br/>app/(marketing)"]
        LearnEngine["Learning Path & Quiz Engine<br/>app/(main)/learn & app/lesson"]
        ParentCenter["Parent & Educator Center<br/>app/admin"]
        ServerActions["Server Action Mutation Pipeline<br/>actions/"]
    end

    subgraph AuthLayer ["Clerk Authentication"]
        ClerkClient["Clerk Frontend SDK<br/>(Young Learner Login, Sessions)"]
        ClerkAPI["Clerk Backend API<br/>(Child Account Provisioning)"]
    end

    subgraph DBLayer ["Neon Serverless PostgreSQL"]
        Drizzle["Drizzle ORM & Relations"]
        NeonPool["HTTP & WebSocket Connection Pool"]
        DB[(12 Relational Tables)]
    end

    subgraph External ["External Services"]
        Stripe["Stripe Billing & Webhooks"]
        AzureTTS["Azure Neural TTS (hr-HR-GabrijelaNeural)"]
    end

    Client --> Marketing
    Client --> LearnEngine
    Client --> ParentCenter
    LearnEngine --> ServerActions
    ParentCenter --> ServerActions
    ServerActions --> Drizzle
    Drizzle --> NeonPool --> DB
    ServerActions --> ClerkAPI
    Client --> ClerkClient
    ServerActions --> Stripe
```

---

## 2. Entity Relationship Diagram (ERD)

The complete data model spans 12 relational tables managed via Drizzle ORM:

```mermaid
erDiagram
    courses ||--o{ units : contains
    courses ||--o{ user_progress : "active course for"
    units ||--o{ lessons : contains
    lessons ||--o{ challenges : contains
    challenges ||--o{ challenge_options : offers
    challenges ||--o{ challenge_progress : tracks
    challenges ||--o{ challenge_mistakes : logs
    challenge_options ||--o{ challenge_mistakes : "mistake selection"

    user_progress ||--o| user_subscription : has
    user_progress ||--o{ challenge_progress : completes
    user_progress ||--o{ challenge_mistakes : commits

    pods ||--o{ pod_members : includes
    pods ||--o{ pod_reactions : contains
    user_progress ||--o{ pod_members : "belongs to"
    user_progress ||--o{ pod_reactions : "sends or receives"

    courses {
        serial id PK
        text title
        text image_src
    }

    units {
        serial id PK
        integer course_id FK
        text title
        text description
        integer order
    }

    lessons {
        serial id PK
        integer unit_id FK
        text title
        integer order
    }

    challenges {
        serial id PK
        integer lesson_id FK
        enum type "SELECT | ASSIST"
        text question
        integer order
    }

    challenge_options {
        serial id PK
        integer challenge_id FK
        text text
        boolean correct
        text image_src
        text audio_src
    }

    challenge_progress {
        serial id PK
        text user_id FK
        integer challenge_id FK
        boolean completed
    }

    challenge_mistakes {
        serial id PK
        text user_id FK
        integer challenge_id FK
        integer selected_option_id FK
        timestamp created_at
    }

    user_progress {
        text user_id PK
        text user_name
        text user_image_src
        integer active_course_id FK
        integer hearts
        integer points
        integer hearts_used
        integer streak
        text last_active_date
        text role "learner | parent | unassigned"
    }

    user_subscription {
        serial id PK
        text user_id UK
        text stripe_customer_id UK
        text stripe_subscription_id UK
        text stripe_price_id
        timestamp stripe_current_period_end
    }

    pods {
        serial id PK
        text name
        text type "family | classroom"
        text invite_code UK
        text owner_id FK
        integer target_xp
        integer current_xp
        boolean celebration_unlocked
        integer week_number
        timestamp created_at
    }

    pod_members {
        serial id PK
        integer pod_id FK
        text user_id FK
        text role "owner | member"
        timestamp joined_at
    }

    pod_reactions {
        serial id PK
        integer pod_id FK
        text sender_id
        text sender_name
        text receiver_id
        text type "high_five | star | flame"
        boolean seen
        timestamp created_at
    }
```

---

## 3. Database Schema Dictionary

### 3.1 Curriculum Hierarchy
- **`courses`:** Top-level language track (`id: 1` = Croatian).
- **`units`:** Ordered curriculum units (20 units across 4 regional Worlds). Cascades delete to lessons.
- **`lessons`:** Exactly 4 lessons per unit ("3 + 1" Unit Arc). Cascades delete to challenges.
- **`challenges`:** Individual questions. Enumerated type: `SELECT` (image cards or compact choice tiles) or `ASSIST` (text list cards).
- **`challenge_options`:** Exactly 4 options per challenge. Stores `text`, `correct` flag, `image_src` (null for Lessons 2–4), and `audio_src`.

### 3.2 Learner State & Analytics
- **`user_progress`:** Primary learner record keyed on Clerk `user_id`. Tracks current `hearts` (0–5), `points` (XP), cumulative precision penalty `hearts_used`, consecutive habit `streak`, `last_active_date` (`YYYY-MM-DD`), and system `role`.
- **`challenge_progress`:** Tracks completed challenge prompts per learner.
- **`challenge_mistakes`:** Audit log of incorrect submissions. Used by the Parent Center Tricky Words report to highlight vocabulary requiring review.
- **`user_subscription`:** Stripe subscription status for Pro memberships.

### 3.3 Collaborative Pods & Social Engine
- **`pods`:** Family circles and learning groups. Tracks shared weekly collective goal (`target_xp`, default 1,000 XP), current pooled progress (`current_xp`), and whether the celebratory confetti threshold is unlocked (`celebration_unlocked`).
- **`pod_members`:** Join table linking learners and parents to pods with roles (`owner` vs `member`).
- **`pod_reactions`:** High-fives and cheer notifications exchanged between family members. Includes `seen` flag to drive the animated `<CheerBanner />`.

---

## 4. User Identity & Role Hierarchy

CroLingo enforces a three-tier user hierarchy built on Clerk authentication:

```mermaid
flowchart TD
    User["Authenticated User (Clerk Session)"] --> CheckAdmin{"isAdmin() Check<br/>(CLERK_ADMIN_IDS)"}
    
    CheckAdmin -->|True| SuperAdmin["Super-Admin (Platform Owner)<br/>• Unrestricted access to all Pods<br/>• Full curriculum inspection<br/>• System database tools"]
    
    CheckAdmin -->|False| CheckRole{"user_progress.role"}
    
    CheckRole -->|"parent"| ParentUser["Parent / Educator<br/>• Access to Parent Center (/admin)<br/>• Owns & creates Family Pods<br/>• Direct Child Account Provisioning<br/>• Magic Wand heart/streak/praise overrides"]
    
    CheckRole -->|"learner"| LearnerUser["Young Learner (Student)<br/>• Active learning path (/learn)<br/>• Scoped to Family Pod Leaderboard<br/>• Can send peer High-Fives<br/>• Restricted from /admin routes"]
```

### 4.1 Child Account Provisioning Architecture
Young children often lack email addresses or phone numbers. CroLingo solves this via the **Direct Child Account Provisioning Engine** ([`actions/child-account.ts`](file:///c:/Users/phili/Documents/phils_repo/actions/child-account.ts)):
1. The parent enters a simple username (e.g., `luka_dalmacija`) and password in the Parent Center.
2. The server action calls the **Clerk Backend REST API** using `CLERK_SECRET_KEY` to create a managed user account with zero email verification requirement.
3. The server action initializes `user_progress` with `role: "learner"` and automatically inserts a `pod_members` record binding the child to the parent's active pod.
4. The child can immediately log in on an iPad or tablet using the username and password.

---

## 5. Learning Pods Authorization & Scoping Mechanics

### 5.1 Relational Privacy Scoping
CroLingo enforces child privacy by scoping leaderboards to **authorized pod members only** ([`db/queries.ts`](file:///c:/Users/phili/Documents/phils_repo/db/queries.ts) → `getTopTenUsers`):
```sql
SELECT up.* FROM user_progress up
JOIN pod_members pm ON up.user_id = pm.user_id
WHERE pm.pod_id = :activePodId AND up.role = 'learner'
ORDER BY up.points DESC LIMIT 10;
```
- Children never see strangers, public accounts, or global internet users.
- Super-admin and developer test accounts are filtered out of student leaderboards by default.

### 5.2 Multi-Pod XP Propagation
When a child completes a challenge (`upsertChallengeProgress`), practices to earn a heart (`practiceToEarnHeart`), or receives parental praise (`adminAwardPraiseXp`):
1. Their individual `user_progress.points` increments.
2. The action triggers `awardPodXp(userId, xp)`.
3. The database updates `pods.current_xp = current_xp + xp` across **every pod the learner belongs to**.
4. If `current_xp >= target_xp`, `celebration_unlocked` is set to `true`, triggering celebratory confetti and team reward modals.

---

## 6. Server Action Mutation Pipelines

All data mutations in CroLingo execute through strictly typed Next.js Server Actions:

| Server Action File | Primary Actions | State & Side-Effects |
| :--- | :--- | :--- |
| **`actions/challenge-progress.ts`** | `upsertChallengeProgress()` | Records challenge completion, awards +10 XP, restores **+1 Heart on Super Izazov**, propagates XP to active pods, logs mistakes on failure. |
| **`actions/user-progress.ts`** | `reduceHearts()`<br/>`refillHearts()`<br/>`practiceToEarnHeart()` | Increments `hearts_used`, deducts heart on quiz error, resets hearts to 5, awards +1 Heart and +10 XP upon completing 3-question review quiz. |
| **`actions/pod.ts`** | `joinPodByCode()`<br/>`createPod()`<br/>`awardPodXp()` | Validates 6-character invite code, enrolls learner, recalculates weekly celebration meter. |
| **`actions/admin-overrides.ts`** | `adminRefillHearts()`<br/>`adminProtectStreak()`<br/>`adminAwardPraiseXp()` | Parent Magic Wand overrides: restores child hearts to 5, grants streak grace day, rewards offline Croatian conversation with +25/+50 XP. |
| **`actions/child-account.ts`** | `createChildAccount()` | Calls Clerk Backend API to provision email-less child logins and enrolls them in parent's pod. |
| **`actions/cheer.ts`** | `sendCheer()`<br/>`markCheerAsSeen()` | Delivers peer high-fives with daily rate limits; claiming awards +5 XP to recipient and active pods. |

---

## 7. Database Invariants & Sequence Synchronization

To maintain database integrity across migrations, seed scripts, and production operations:

### 7.1 User Progress Preservation Invariant
> **CRITICAL RULE:** Curriculum seeding scripts (`scripts/seed.ts`, `scripts/prod.ts`) must **NEVER** drop or truncate `user_progress`, `challenge_progress`, `pods`, or `pod_members`. Active learner XP (e.g. Adriana: 2,230 XP, Silvia: 1,325 XP) must remain strictly intact across all deploys.

### 7.2 Dynamic Coordinate Lookup
Neon Postgres auto-increment IDs shift across re-seeds. Refinement scripts must never hardcode database IDs. Always lookup challenges via hierarchical coordinates:
$$\text{Coordinate} = (\text{unit\_order}, \text{lesson\_order}, \text{challenge\_order})$$

### 7.3 Postgres Sequence Synchronization
After any bulk insert into tables with `serial` primary keys, Postgres sequences must be synchronized to prevent `duplicate key value violates unique constraint` errors:
```sql
SELECT setval('units_id_seq', (SELECT MAX(id) FROM units));
SELECT setval('lessons_id_seq', (SELECT MAX(id) FROM lessons));
SELECT setval('challenges_id_seq', (SELECT MAX(id) FROM challenges));
SELECT setval('challenge_options_id_seq', (SELECT MAX(id) FROM challenge_options));
SELECT setval('pods_id_seq', (SELECT MAX(id) FROM pods));
```

---

## 8. Asset Architecture & Deployment Pipeline

- **Audio Assets (`public/audio/hr/*.mp3`):** Synthesized using Azure Cognitive Services Neural Croatian TTS (`hr-HR-GabrijelaNeural` at `-5%` rate). Automated via `scripts/generate_croatian_audio.py`.
- **Mascot Artwork (`public/mascot.png`, `public/pasko-hero.jpg`):** High-resolution digital illustrations featuring Paško the Dalmatian pup, Croatian folk gingerbread hearts (*licitarsko srce*), coastal ferries (*trajekt*), and checkerboard (*šahovnica*) tokens.
- **Render Deployment Pipeline:**
  - Tracked on Render Web Service via `render.yaml`.
  - Deploys automatically triggered via `scripts/trigger-render-deploy.js` executing asynchronously with zero polling.
