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
├── docs/                # Comprehensive engineering and pedagogical documentation
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

For in-depth guides, pedagogical rules, and architecture specs, explore the [`docs/`](./docs) directory:

| Document | Purpose |
| :--- | :--- |
| 📋 **[`docs/GOVERNANCE.md`](./docs/GOVERNANCE.md)** | **Mandatory Pre-Merge Protocol:** The 4-point review checklist required for PRs and agent tasks. |
| 📚 **[`docs/CURRICULUM_STANDARDS.md`](./docs/CURRICULUM_STANDARDS.md)** | **Pedagogical Specification Contract:** The formal rules asserted by CI/CD audits ("3 + 1" Unit Arc, Deductive Elimination, Progressive Fading, 2×2 Grid). |
| 📖 **[`docs/LESSON_PLANNING_GUIDE.md`](./docs/LESSON_PLANNING_GUIDE.md)** | **Authoring Playbook:** Step-by-step tutorial, unit creation templates, and vocabulary rubrics for curriculum authors. |
| 🎨 **[`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md)** | **Living Design System:** Croatian color palette, regional World progression, Paško mascot guidelines, and 3D tactile UI styles. |
| ❤️ **[`docs/HEARTS_AND_GAMIFICATION.md`](./docs/HEARTS_AND_GAMIFICATION.md)** | **Gamification Engine:** Practice-to-Earn hearts, Super Izazov rewards, streaks, and family pod leaderboards. |
| ⚙️ **[`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)** | **Engineering Architecture:** Database sequences, Clerk sync, Render hosting, and deployment pipelines. |
| 📜 **[`docs/CHANGELOG.md`](./docs/CHANGELOG.md)** | **Living Changelog:** Chronological record of all platform updates, bug fixes, and curriculum milestones. |
