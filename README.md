# 🇭🇷 2lingo - Croatian Kid Learning Platform

A dedicated, kid-friendly Croatian language learning platform deployed on Render, built with Next.js 14, Drizzle ORM, Neon Postgres, and Clerk.

---

## 🛡️ Architecture & Change Governance Protocol

> **MANDATORY POLICY FOR ALL CONTRIBUTORS & AGENTS:**  
> Before merging any change, creating new units, or seeding the database, you **MUST** run the pre-flight clash check and adhere to the guidelines in the [`docs/`](./docs) directory:

- 📋 **[Pre-Merge Protocol & Governance](docs/GOVERNANCE.md)** — The 5-point checklist required for every change.
- 📚 **[Curriculum & Pedagogical Standards](docs/CURRICULUM_STANDARDS.md)** — The "3 + 1" Unit Arc, Deductive Elimination ("Aha!" discovery), Progressive Fading, Distractor Symmetry, and 2×2 grid rules.
- ❤️ **[Hearts & Gamification Rules](docs/HEARTS_AND_GAMIFICATION.md)** — Practice-to-Earn engine, hearts used tracking, and kids-only leaderboard privacy.
- ⚙️ **[Engineering & Hosting Architecture](docs/ARCHITECTURE.md)** — Database conventions, sequence syncing, user progress preservation, and Render deployment.
- 📜 **[Living Changelog](docs/CHANGELOG.md)** — Chronological history of all platform milestones and curriculum expansions.

### Pre-Merge Automated Audit Command
```shell
npx tsx scripts/audit-curriculum-rules.ts
```

---

## 🚀 Quick Start

### Install packages
```shell
npm install
```

### Run local dev server
```shell
npm run dev
```

### Build for production
```shell
npm run build
```
