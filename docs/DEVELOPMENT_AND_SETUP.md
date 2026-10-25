# 🛠️ CroLingo Developer Setup & Local Environment Guide

> **Quick-Start & Environment Playbook:** The complete technical guide for setting up CroLingo locally from zero, configuring credentials, seeding databases safely, provisioning test pods, and generating neural audio.  
> **Source of Truth:** For database schemas and server actions, see [`docs/ARCHITECTURE.md`](file:///c:/Users/phili/Documents/phils_repo/docs/ARCHITECTURE.md).  
> **Pre-Merge Policy:** See [`docs/GOVERNANCE.md`](file:///c:/Users/phili/Documents/phils_repo/docs/GOVERNANCE.md).

---

## 1. System Prerequisites

Before running the application locally, ensure your environment has:

| Tool | Minimum Version | Installation / Verification |
| :--- | :---: | :--- |
| **Node.js** | `>= 20.0.0` | `node -v` |
| **npm** | `>= 10.0.0` | `npm -v` |
| **Git** | Any modern version | `git --version` |
| **Python** | `>= 3.10` *(for TTS generation)* | `python --version` |
| **edge-tts** | Latest | `pip install edge-tts` |

---

## 2. Complete `.env.local` Environment Variable Dictionary

Create a `.env.local` file in the project root directory. Here is the exhaustive reference for every environment variable used in CroLingo:

```env
# ==============================================================================
# 1. DATABASE CONFIGURATION (Neon Serverless PostgreSQL)
# ==============================================================================
# Source: Neon Console (https://console.neon.tech/) -> Connection Details -> Pooled connection
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require"

# ==============================================================================
# 2. AUTHENTICATION (Clerk)
# ==============================================================================
# Source: Clerk Dashboard (https://dashboard.clerk.com/) -> API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Clerk Redirection Routes (Standardized for Next.js App Router)
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/learn"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/learn"

# ==============================================================================
# 3. APPLICATION DOMAIN & ORIGIN
# ==============================================================================
# Local: http://localhost:3000
# Production: https://twolingo.onrender.com (or custom domain e.g. https://pasko.app)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ==============================================================================
# 4. SUPER-ADMIN & PARENT PERMISSIONS
# ==============================================================================
# Comma-separated list of Clerk User IDs or emails granted Super-Admin status
# Enables unrestricted access to /admin, all pods, and full curriculum inspection
ADMIN_EMAILS="your-email@example.com"
SUPER_ADMIN_USER_IDS="user_..."

# ==============================================================================
# 5. PAYMENTS & PRO SUBSCRIPTIONS (Stripe - Optional for Local Dev)
# ==============================================================================
# Source: Stripe Dashboard (https://dashboard.stripe.com/) -> Developers -> API keys
STRIPE_API_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ==============================================================================
# 6. CI/CD & RENDER DEPLOYMENT (Render - For Deploy Automation)
# ==============================================================================
# Source: Render Dashboard -> Account Settings -> API Keys
RENDER_API_KEY="rnd_..."
# Source: Render Dashboard -> Service Settings (srv-...)
RENDER_SERVICE_ID="srv-..."
```

---

## 3. Database Seeding & Schema Lifecycle

CroLingo uses **Drizzle ORM** paired with **Neon Serverless PostgreSQL**.

### 3.1 Pushing Schema Updates (`npm run db:push`)
Whenever you edit table structures or relations in [`db/schema.ts`](file:///c:/Users/phili/Documents/phils_repo/db/schema.ts):
```bash
npm run db:push
```
- Drizzle Kit introspects your Neon database and applies schema migrations non-destructively.
- Safe to run in local development; does not drop user data unless a column is deleted.

### 3.2 Seeding Curriculum Units (`npm run db:seed`)
```bash
npm run db:seed
```
- Populates the database with the core curriculum: 20 Units, 80 Lessons, and 359 Challenges across the 4 Worlds.
- **Progress Preservation Invariant:** The seed script deletes and recreates curriculum tables (`challenges`, `lessons`, `units`), but **PRESERVES** `user_progress`, `challenge_progress`, `pods`, and `pod_members`. Active learner XP is never lost!

### 3.3 Visual Database Inspection (`npm run db:studio`)
```bash
npm run db:studio
```
- Launches **Drizzle Studio** in your browser at `https://local.drizzle.studio`.
- Allows real-time visual browsing and manual editing of all 12 tables.

---

## 4. Super-Admin & Test Family Pod Setup

To test the **Parent & Educator Center** (`/admin`) and **Family Pods** locally:

### Step 1: Designate Your User as Super-Admin
1. Run `npm run dev` and navigate to `http://localhost:3000`.
2. Sign in with your Clerk account.
3. Open Clerk Dashboard or Drizzle Studio (`npm run db:studio`) and copy your `user_id` (starts with `user_...`).
4. Add your email or ID to `.env.local`:
   ```env
   ADMIN_EMAILS="your-email@example.com"
   SUPER_ADMIN_USER_IDS="user_your_id"
   ```
5. Restart your development server. You now have unrestricted access to `http://localhost:3000/admin`.

### Step 2: Create a Test Family Circle
1. Go to `http://localhost:3000/admin`.
2. Click **"Create Family Circle"** (or use the Setup Wizard).
3. Name your circle (e.g., *"The Horvat Family"*).
4. System generates a 6-letter invite code (e.g., `HORVAT`).

### Step 3: Provision Local Young Learner Accounts
1. In the Parent Center, click **"Add Child"** (`AddChildModal`).
2. Enter a test child's name (e.g., *"Marko"*), pick an avatar, and choose a simple password.
3. The server action calls the Clerk Backend API to create an email-less student account linked directly to your test pod.
4. Open an incognito browser window, log in as `Marko`, and you can test the student learning path, streaks, and family leaderboard!

---

## 5. Croatian Neural Audio Generation with Edge TTS

CroLingo requires authentic, high-quality audio for 100% of vocabulary words and challenge options. Audio is generated using Microsoft Azure Neural TTS via the `edge-tts` Python library.

### 5.1 Voice Standard
- **Voice Name:** `hr-HR-GabrijelaNeural` (Natural Croatian Female voice)
- **Speech Rate:** `-5%` (slightly measured for young learners and heritage beginners)
- **Output Directory:** `public/audio/hr/<slug>.mp3`

### 5.2 Synthesizing New Audio Files
1. Open [`scripts/generate_croatian_audio.py`](file:///c:/Users/phili/Documents/phils_repo/scripts/generate_croatian_audio.py).
2. Add your new Croatian words or phrases to the `PHRASES` dictionary:
   ```python
   PHRASES = {
       "kruh": "Kruh",
       "svjezi_sir": "Svježi sir",
       "dobar_dan": "Dobar dan",
   }
   ```
3. Run the generator script:
   ```bash
   python scripts/generate_croatian_audio.py
   ```
4. The script synthesizes the audio and writes the `.mp3` files directly into `public/audio/hr/`.
5. Verify playback in your browser or test with the pre-flight audit script.

---

## 6. Pre-Merge Quality Gate & Automated Audit

Before committing code or deploying, run the mandatory automated audits:

```bash
# 1. Full TypeScript Typecheck (Must pass with 0 errors)
npx tsc --noEmit

# 2. Automated Curriculum & Learner Invariant Audit
npx tsx --env-file=.env.local scripts/audit-curriculum-rules.ts
```

### What the Audit Script Validates:
- **4-Option Symmetry:** Every challenge has exactly 4 choices in a balanced grid.
- **Punctuation Uniformity:** Zero trailing punctuation giveaways on single-word nouns; identical punctuation on sentences.
- **Audio Integrity:** Every option has a valid `.mp3` file that physically exists on disk under `public/audio/hr/`.
- **Progressive Fading:** Lessons 2, 3, and 4 (Super Izazov) strictly enforce `image_src = null`.
- **Active Learner Safeguard:** Asserts that all 8 production learners (Adriana: 2,230 XP, Silvia: 1,325 XP, etc.) remain intact.
