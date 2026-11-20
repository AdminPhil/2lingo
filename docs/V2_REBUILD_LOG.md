# 🏗️ CroLingo v2 Rebuild & Architecture Log

> **Branch:** `v2` (Isolated from live `main` production)  
> **Target Horizon:** Levels 1–3 (`U1–60`, v2.0 MVP Cutover) → Level 4 (`U61–80`, Early B1) → Level 5 (`U81–100`, Solid B1) + Daily Refresh  
> **Master Blueprint:** [`implementation_plan.md`](file:///C:/Users/phili/.gemini/antigravity/brain/c629a829-2e9b-4e6a-a598-bb4f714604f3/implementation_plan.md)

---

## Live Status Tracker

| Phase | Scope | Status | Commit(s) | Verification |
| :---: | :--- | :---: | :---: | :--- |
| **Phase 0** | Branch `v2`, Declarative YAML Exporter (`12 Worlds / 60 Units / 1,009 Challenges`), Zod Curriculum Schema, Offline Validator, `db/schema.v2.ts` | ✅ Complete | `07a0e1c` | `v2:validate` (`5,482` assets, `0` errors), `tsc --noEmit` (`0` errors) |
| **Phase 1A** | Retire dead tutorial baggage (`/shop`, Stripe, `react-admin`, unused `/api/*`, `react-use` — 34 files & 125 npm packages removed), Native React hooks (`lib/hooks/browser-hooks.tsx`), Passwordless QR Token Engine (`lib/v2/qr-tokens.ts`), XP-Calibrated Placement Mapper (`lib/v2/placement.ts`), YAML → Postgres Compiler (`scripts/v2/compile-curriculum.ts`, `DATABASE_URL_V2` safety-locked) | ✅ Complete | `613f744` | `tsc --noEmit` (`0` errors), `v2:validate` (`0` errors), Vitest (`29/29` files, `309/309` tests) |
| **Phase 1B** | Upgrade runtime stack to **Next.js `15.5.29` + React `19` + Clerk `v6` (`@clerk/nextjs@6`)**, migrate `middleware.ts` to `clerkMiddleware` (`229 kB → 85.7 kB`), migrate 12 server modules to `@clerk/nextjs/server` + `await auth()` / `await clerkClient()`, async Next.js 15 `params`/`searchParams` + `<Suspense>` on `/qr-login` | ✅ Complete | `6beb6de` | `next build` (`14/14` routes, `6.0s`, `0` Edge warnings), `tsc --noEmit` (`0` errors), Vitest (`29/29` files, `309/309` tests) |
| **Phase 2** | **4-Tier State-Machine Quiz Engine** (`features/quiz/quiz-machine.ts`, `listen-prompt.tsx`, `build-sentence-board.tsx`, `v2-quiz.tsx` supporting `SELECT`, `ASSIST`, `LISTEN`, `BUILD_SENTENCE`), **Dynamic Level-Tabbed `/learn`** (`world-navigator.tsx`, `learn/page.tsx`, `lib/v2/lesson-helpers.ts`), and **Passwordless Token QR Login** (`actions/v2/qr-auth.ts`, `/qr-login?token=clqr_...`) | ✅ Complete | `Phase 2` | `next build` (`14/14` routes, `7.0s`), `tsc --noEmit` (`0` errors), Vitest (`31/31` files, `316/316` tests) |
| **Phase 3** | Elevate Levels 1–3 YAML (`CR-095` U13 wall, `CR-096` W7–8 dip & tense spiral, `CR-097` `30–45%` minimal pairs, `LISTEN` + `BUILD_SENTENCE` injection) | ⏳ Planned | — | — |
| **Phase 4** | Port 3-Tab `/admin`, Token QR Badges, Learner Avatar Picker (`CR-088`), Dry-Run Live Migration on Neon Branch | ⏳ Planned | — | — |
| **Phase 5** | Family UAT on Render Preview → Atomic `v2` → `main` Production Cutover (`v1-legacy` tag + 30-day Neon snapshot) → Level 4 (`U61–80`) | ⏳ Planned | — | — |

---

## Architectural Decision Log (ADR)

### ADR-001: Declarative Curriculum-as-Data (`curriculum/worlds/*.yaml`)
- **Decision:** Replace 9 ad-hoc TypeScript seed scripts with versioned YAML validated by Zod (`lib/v2/curriculum-schema.ts`).
- **Why:** Enables compile-time pedagogical & asset gating (`npm run v2:validate`) before any DB write, cleanly supports polymorphic 6-tier challenges (`SELECT`, `ASSIST`, `LISTEN`, `MATCH_PAIRS`, `BUILD_SENTENCE`, `CLOZE`), and guarantees zero seed-to-DB drift.

### ADR-002: Passwordless QR Login Tokens (`lib/v2/qr-tokens.ts` + `qr_login_tokens`)
- **Decision:** Retire `?u=...&p=...` QR codes that silently overwrote Clerk passwords when opening `StudentBadgeModal` or `TeamQrSheetModal`.
- **Why:** Viewing or printing a QR badge should never break a learner's typed password. v2 stores only a SHA-256 hash of an opaque badge token and exchanges it server-side for a one-time Clerk Sign-In Token.

### ADR-003: XP-Calibrated Pedagogical Placement on Cutover (`lib/v2/placement.ts`)
- **Decision:** Preserve 100% of every learner's XP (`points`), daily `streak`, `hearts`, mascot avatar, `role`, and Pods on cutover, while mapping their unlocked frontier to an XP-calibrated World checkpoint (`W1/U1`, `W2/U6`, `W3/U11`, `W5/U21`).
- **Why:** Allows active learners to experience the newly elevated active-recall (`LISTEN`, `BUILD_SENTENCE`) and minimal-pair curriculum without losing their XP or leaderboard rank.

### ADR-004: Zero-Deadweight Core Platform (Retiring Stripe, `/shop`, `react-admin`, `react-use`)
- **Decision:** Remove all unused paid-subscription scaffolding (`stripe`, `/shop`, `components/promo.tsx`, `actions/user-subscription.ts`), legacy `react-admin` CRUD routes, and `react-use` (replaced by ~80 lines of native React hooks in `lib/hooks/browser-hooks.tsx`).
- **Why:** CroLingo is 100% free & COPPA-compliant; removing dead packages cuts attack surface, speeds builds, and unblocks a clean React 19 + Next.js 15 upgrade.

### ADR-005: Modern Runtime Stack (Next.js 15 + React 19 + Clerk v6)
- **Decision:** Upgrade from Next.js `14.1.1` / React `18` / Clerk `v4` to Next.js `15.5.29` / React `19` / Clerk `v6` (`clerkMiddleware`, `@clerk/nextjs/server`, async `auth()` & `clerkClient()`, async `params`/`searchParams`).
- **Why:** Eliminates all Edge Runtime warnings, cuts Middleware bundle size by 62% (`229 kB → 85.7 kB`), reduces npm audit vulnerabilities from `55 → 26`, and unlocks native Clerk `signInTokens` for passwordless QR badges.

### ADR-006: Pure `useReducer` State-Machine Quiz Engine & Level-Tabbed `/learn`
- **Decision:** Model lesson execution as an explicit finite state machine (`IDLE → SUBMITTING → FEEDBACK_CORRECT | FEEDBACK_WRONG → COMPLETED`) in `features/quiz/quiz-machine.ts` with pure Croatian sentence graders (`LISTEN` + `BUILD_SENTENCE`), and scope `/learn` to 1 Level (~20 units) per tab derived dynamically from `ALL_STAGES`.
- **Why:** Eliminates async stale-response soft-locks (`BUG-049`) by construction, enables active listening & sentence production without English crutches, removes hardcoded `lesson.order === 4` / `unit.order === 21/41` checks, and cuts mobile/iPad `/learn` DOM size by 67–80% as the curriculum scales to 100 units.
