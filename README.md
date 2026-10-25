# 🇭🇷 CroLingo — Croatian Language & Heritage Learning Platform

A vibrant, gamified web platform engineered specifically for **diaspora children, young families, and heritage learners** to learn Croatian through interactive quests, regional adventures, and family pods alongside **Paško the Dalmatian pup**.

---

## ⚡ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Components & Server Actions)
- **Database:** [Neon Serverless PostgreSQL](https://neon.tech/) with pooled HTTP/WebSocket queries
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) & Drizzle Kit
- **Authentication:** [Clerk](https://clerk.com/) (Young Learner PINs, Google Auth, Family Pods)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with 3D tactile buttons & Radix UI primitives
- **Audio:** Azure Cognitive Services Neural Croatian TTS (`hr-HR-GabrijelaNeural`)
- **Payments:** [Stripe](https://stripe.com/) (Family Pro memberships)
- **Hosting:** [Render](https://render.com/) (Web Service container with automated deploys)

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js:** `>= 20.0.0`
- **Package Manager:** `npm` (or `pnpm`)
- **Git**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/AdminPhil/2lingo.git
cd 2lingo

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the project root:

```env
# Database (Neon Serverless PostgreSQL)
DATABASE_URL="postgresql://user:pass@ep-cool-lakebase.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/learn"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/learn"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Payments (Stripe - Optional for local development)
STRIPE_API_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Directory Structure

```
├── actions/             # Server actions (challenge-progress, user-progress, pod, family-onboarding)
├── app/                 # Next.js 14 App Router
│   ├── (main)/          # Authenticated app routes (/learn, /leaderboard, /quests, /shop, /family)
│   ├── (marketing)/     # Public landing page, header, and footer
│   ├── admin/           # Parent & Educator Center (/admin)
│   ├── api/             # API routes & webhooks (Clerk, Stripe, challenges)
│   └── lesson/          # In-lesson quiz interface & practice engine
├── components/          # Reusable UI components & modals
│   ├── admin/           # Parent Center management cards & modals
│   ├── modals/          # Role onboarding, practice hearts, exit confirmations
│   └── ui/              # Accessible primitives (buttons, dialogs, inputs)
├── db/                  # Drizzle ORM schema, relations, connection, and queries
├── docs/                # Standardized 1–9 Engineering & Pedagogical Documentation Suite
│   ├── 1. DEVELOPMENT_AND_SETUP.md     # [NEW] Env vars, local setup, seeding, and tooling
│   ├── 2. ARCHITECTURE_AND_DATA.md     # [EXPANDED] System tech stack, Mermaid ERD, Drizzle schema & RBAC
│   ├── 3. CURRICULUM_STANDARDS.md      # [CONSOLIDATED] Invariant pedagogical rules (audit spec)
│   ├── 4. LESSON_PLANNING_GUIDE.md     # [CONSOLIDATED] Authoring playbook, vocabulary rubrics & theme guide
│   ├── 5. DESIGN_SYSTEM.md             # [ACTIVE] Croatian color tokens, regional stages & UI component standards
│   ├── 6. HEARTS_AND_GAMIFICATION.md   # [ACTIVE] Gamification loops, practice engine, pods & streaks
│   ├── 7. SECURITY_AND_COPPA.md        # [NEW] Child data privacy, COPPA compliance, and safety guards
│   ├── 8. TESTING_AND_QA.md            # [NEW] Multi-tier verification pipeline & QA checklists
│   ├── 9. DEPLOYMENT_AND_DEVOPS.md     # [NEW] Render CI/CD, Neon pooling, zero-polling policy & backups
│   ├── CHANGELOG.md                    # [ACTIVE] Chronological release and feature audit trail
│   └── GOVERNANCE.md                   # [ACTIVE] Mandatory PR pre-merge protocol and checklist
├── lib/                 # Theme registry, admin checks, TTS helpers, and utility functions
├── public/              # Static assets (mascot artwork, icons, audio files)
│   └── audio/hr/        # Synthesized Croatian neural pronunciation files (.mp3)
└── scripts/             # Database seeding, curriculum audits, and deploy tools
```

---

## 🛠️ Common Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server on port 3000 |
| `npm run build` | Builds optimized production bundle |
| `npm run start` | Starts production server locally |
| `npm run db:push` | Pushes Drizzle schema changes directly to Neon PostgreSQL |
| `npm run db:studio` | Opens local Drizzle Studio database GUI |
| `npm run db:seed` | Populates database with curriculum units and challenges |
| `npm run xp:set` | Adjusts XP for testing and leaderboard validation |

---

## 🧪 Testing & Pre-Merge Audits

Before submitting a Pull Request or committing changes, run the mandatory automated checks:

```bash
# 1. Typecheck TypeScript across the entire project
npx tsc --noEmit

# 2. Run the pre-flight curriculum rules & learner invariant audit
npx tsx --env-file=.env.local scripts/audit-curriculum-rules.ts
```

---

## 📚 Documentation Library

The CroLingo documentation suite is organized in a standardized 1–9 sequence:

```text
├── README.md                           # Quickstart, project overview & architecture directory
└── docs/
    ├── 1. DEVELOPMENT_AND_SETUP.md     # [NEW] Env vars, local setup, seeding, and tooling
    ├── 2. ARCHITECTURE_AND_DATA.md     # [EXPANDED] System tech stack, Mermaid ERD, Drizzle schema & RBAC
    ├── 3. CURRICULUM_STANDARDS.md      # [CONSOLIDATED] Invariant pedagogical rules (audit spec)
    ├── 4. LESSON_PLANNING_GUIDE.md     # [CONSOLIDATED] Authoring playbook, vocabulary rubrics & theme guide
    ├── 5. DESIGN_SYSTEM.md             # [ACTIVE] Croatian color tokens, regional stages & UI component standards
    ├── 6. HEARTS_AND_GAMIFICATION.md   # [ACTIVE] Gamification loops, practice engine, pods & streaks
    ├── 7. SECURITY_AND_COPPA.md        # [NEW] Child data privacy, COPPA compliance, and safety guards
    ├── 8. TESTING_AND_QA.md            # [NEW] Multi-tier verification pipeline & QA checklists
    ├── 9. DEPLOYMENT_AND_DEVOPS.md     # [NEW] Render CI/CD, Neon pooling, zero-polling policy & backups
    └── CHANGELOG.md                    # [ACTIVE] Chronological release and feature audit trail
```

| # | Document | Purpose & Scope |
| :-: | :--- | :--- |
| 1 | 🛠️ **[`docs/1. DEVELOPMENT_AND_SETUP.md`](./docs/1.%20DEVELOPMENT_AND_SETUP.md)** | **Local Setup & Environment:** Complete `.env.local` dictionary, seeding lifecycle, Super-Admin role assignment, and neural audio generation. |
| 2 | ⚙️ **[`docs/2. ARCHITECTURE_AND_DATA.md`](./docs/2.%20ARCHITECTURE_AND_DATA.md)** | **Architecture & Data Models:** System tech stack, dual-domain Mermaid ERD, 12-table Drizzle schema, state machines, sequence synchronization, and RBAC. |
| 3 | 📚 **[`docs/3. CURRICULUM_STANDARDS.md`](./docs/3.%20CURRICULUM_STANDARDS.md)** | **Pedagogical Specification Contract:** Invariant rules enforced by CI/CD audits ("3 + 1" Unit Arc, Deductive Elimination, Progressive Fading, 2×2 Grid). |
| 4 | 📖 **[`docs/4. LESSON_PLANNING_GUIDE.md`](./docs/4.%20LESSON_PLANNING_GUIDE.md)** | **Authoring Playbook:** Step-by-step tutorial, unit creation templates, and vocabulary rubrics for curriculum authors. |
| 5 | 🎨 **[`docs/5. DESIGN_SYSTEM.md`](./docs/5.%20DESIGN_SYSTEM.md)** | **Living Design System:** Croatian color palette, regional World progression, Paško mascot guidelines, and 3D tactile UI styles. |
| 6 | ❤️ **[`docs/6. HEARTS_AND_GAMIFICATION.md`](./docs/6.%20HEARTS_AND_GAMIFICATION.md)** | **Gamification Engine:** Practice-to-Earn hearts, Super Izazov rewards, streaks, and family pod leaderboards. |
| 7 | 🛡️ **[`docs/7. SECURITY_AND_COPPA.md`](./docs/7.%20SECURITY_AND_COPPA.md)** | **Child Safety & Privacy:** COPPA / GDPR-K standards, zero child PII, closed social loops, and scoped leaderboards. |
| 8 | 🧪 **[`docs/8. TESTING_AND_QA.md`](./docs/8.%20TESTING_AND_QA.md)** | **Testing & QA Strategy:** 4-tier verification pipeline, 12-point manual release runbook, and Vitest/Playwright roadmap. |
| 9 | 🚀 **[`docs/9. DEPLOYMENT_AND_DEVOPS.md`](./docs/9.%20DEPLOYMENT_AND_DEVOPS.md)** | **Deployment & DevOps Manual:** Render Blueprint spec, Neon connection pooling, asynchronous deploy triggers, zero-polling policy, and rollback runbooks. |
| — | 📋 **[`docs/GOVERNANCE.md`](./docs/GOVERNANCE.md)** | **Pre-Merge Protocol:** Mandatory 4-point review checklist required for PRs and agent tasks. |
| — | 📜 **[`docs/CHANGELOG.md`](./docs/CHANGELOG.md)** | **Living Changelog:** Chronological record of all platform updates, bug fixes, and curriculum milestones. |
