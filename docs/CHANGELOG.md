# 📜 2lingo Living Changelog

All notable changes, pedagogical updates, curriculum expansions, and infrastructure upgrades are documented here.

---

## [2026-10-24] - Fix Option Text Truncation in Compact SELECT Tiles (BUG-017)

### Fixed & Refined
- **[BUG-017] ✅ RESOLVED & VERIFIED - Option Text Ellipsis Truncation in SELECT Challenges:**
  - **Dual-Mode Challenge Grid (`app/lesson/challenge.tsx`):** Added `hasImages` detection (`options.some(o => Boolean(o.imageSrc))`).
    - For text-only `SELECT` questions (`hasImages === false`), replaced desktop 4-across packing (`lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]`) with `grid-cols-1 sm:grid-cols-2`.
    - Restored the balanced **2×2 grid layout** on desktop and tablet, expanding option card width from ~140px to ~294px and providing 186px+ of dedicated text width.
    - Preserved full-width 1-column layout on mobile (`< sm`), preventing cramped text on small phone viewports.
  - **Eliminated CSS `truncate` in Card Labels (`app/lesson/card.tsx`):**
    - Replaced `truncate` with `break-words leading-snug` (and `leading-tight` for image cards).
    - Enabled natural line wrapping so that multi-word Croatian phrases ("Kako si?", "Laku noć", "Dobar dan", "Doviđenja") are 100% visible and never replaced by ellipsis (`...`).
    - Added `flex-1` to text containers in `ASSIST` and compact text `SELECT` cards to allow labels to claim all available space between the keyboard hotkey badge and speaker button.

---

## [2026-10-24] - Standardize Numbered Documentation Structure (1–9 Hierarchy) (CR-041)

### Added & Refined
- **[CR-041] ✅ IMPLEMENTED & VERIFIED - Numbered Documentation Hierarchy (1–9 Structure):**
  - **Standardized 1–9 Documentation Taxonomy:** Reorganized all engineering, pedagogical, design, and operational documents into an unambiguous numbered sequence:
    - `docs/1. DEVELOPMENT_AND_SETUP.md`: Local development, `.env.local` dictionary, seeding lifecycle, and neural audio generation.
    - `docs/2. ARCHITECTURE_AND_DATA.md`: Consolidated system tech stack, dual-domain Mermaid ERD, 12-table Drizzle schema dictionary, operational state machines, sequence synchronization, and Clerk RBAC.
    - `docs/3. CURRICULUM_STANDARDS.md`: Formal pedagogical specification contract ("3 + 1" Unit Arc, Deductive Elimination, Progressive Fading, 2×2 Grid).
    - `docs/4. LESSON_PLANNING_GUIDE.md`: Step-by-step authoring playbook, unit creation templates, and vocabulary rubrics.
    - `docs/5. DESIGN_SYSTEM.md`: Croatian color tokens, regional World progression, Paško mascot guidelines, and 3D tactile UI styles.
    - `docs/6. HEARTS_AND_GAMIFICATION.md`: Practice-to-Earn hearts, Super Izazov rewards, streaks, and family pod leaderboards.
    - `docs/7. SECURITY_AND_COPPA.md`: Child data privacy, COPPA / GDPR-K compliance, closed social loops, and scoped leaderboards.
    - `docs/8. TESTING_AND_QA.md`: 4-tier verification pipeline, 10-point manual release runbook, and Vitest/Playwright roadmap.
    - `docs/9. DEPLOYMENT_AND_DEVOPS.md`: Render Blueprint spec, Neon connection pooling, asynchronous deploy triggers, zero-polling policy, and rollback runbooks.
  - **Consolidation of Architecture & Data:** Merged `docs/ARCHITECTURE.md` and `docs/DATABASE_AND_DATA_MODEL.md` into the all-in-one `docs/2. ARCHITECTURE_AND_DATA.md`, retiring the redundant duplicate source files.
  - **Central Directory Map in `README.md`:** Updated root `README.md` directory tree and documentation library table with direct links and descriptions matching the 1–9 structure.
  - **Cross-Reference Synchronization:** Updated internal markdown links across `docs/`, `GOVERNANCE.md`, `CHANGE_REQUEST_TEMPLATE.md`, `PULL_REQUEST_TEMPLATE.md`, and `.agents/rules/governance.md`.

---

## [2026-10-24] - Author docs/DEPLOYMENT_AND_DEVOPS.md Operational Manual (CR-040)

### Added & Refined
- **[CR-040] ✅ IMPLEMENTED & VERIFIED - Hosting, CI/CD & Operational Manual:**
  - **Comprehensive `docs/DEPLOYMENT_AND_DEVOPS.md`:** Published the complete infrastructure, deployment, and operational runbook for developers, DevOps engineers, and AI agents.
  - **Render Infrastructure Specification:** Codified the `render.yaml` Blueprint, service architecture, Node.js runtime, build/start lifecycle, and port binding.
  - **Neon Serverless PostgreSQL Protocol:** Detailed the PgBouncer pooled connection pipeline (`drizzle-orm/neon-http`) versus direct connections for DDL schema migrations, auto-suspending compute, and branching.
  - **Automated Deployment Trigger Protocol:** Formalized the REST API execution pipeline (`scripts/trigger-render-deploy.js`), Docker layer cache optimization, and HTTP 201/202 response handling.
  - **Zero-Polling Operational Policy:** Formally codified the strict ban on polling loops and busy-waiting; established asynchronous verification via Render dashboards and webhooks.
  - **Disaster Recovery Playbook:** Documented one-click Render dashboard rollbacks, Git revert runbooks, Neon point-in-time restores (PITR), and Postgres sequence resynchronization scripts.

---

## [2026-10-24] - Author docs/TESTING_AND_QA.md Specification & Release Runbook (CR-039)

### Added & Refined
- **[CR-039] ✅ IMPLEMENTED & VERIFIED - Multi-Tier Quality Assurance & Verification Pipeline:**
  - **Comprehensive `docs/TESTING_AND_QA.md`:** Published the complete testing strategy and release runbook for contributors and QA testers.
  - **4-Tier Pipeline Specification:** Codified Tier 1 (Static Curriculum Analysis via `scripts/audit-curriculum-rules.ts`), Tier 2 (Strict TypeScript Compilation via `tsc --noEmit`), Tier 3 (Production Bundle & SSR Build via `npm run build`), and Tier 4 (Structured Manual QA).
  - **10-Point Interactive Manual QA Runbook:** Structured field checklist with clear pass/fail criteria covering landing page action gates, learner auth, 4-World banners, in-lesson quiz loop, heart depletion & precision metrics, practice refill quizzes, Super Izazov milestone bonuses, streak flames, family pod collaboration, and parent magic wand overrides.
  - **Automated Testing Roadmap:** Formulated the technical expansion plan for Vitest unit/algorithm tests and Playwright component visual regression and E2E browser tests.

---

## [2026-10-24] - Author docs/SECURITY_AND_COPPA_COMPLIANCE.md Standards (CR-038)

### Added & Refined
- **[CR-038] ✅ IMPLEMENTED & VERIFIED - Child Safety, Privacy & COPPA/GDPR-K Compliance Guide:**
  - **Comprehensive `docs/SECURITY_AND_COPPA_COMPLIANCE.md`:** Published the authoritative child safety and legal privacy specification covering US COPPA, EU GDPR-K, and Croatian personal data protection standards.
  - **Zero Child PII Architecture:** Formalized the email-less and phone-less child account model; accounts are created by parents via the Clerk Backend API (`actions/child-account.ts`) without collecting online contact information from minors.
  - **Closed Social Loop:** Documented the restriction of peer interactions to pre-set, positive canned reactions only (`high_five`, `star`, `flame`), completely prohibiting free-text chat, DMs, media uploads, or public profile pages.
  - **Scoped Leaderboards:** Codified relational scoping (`getTopTenUsers`) that protects young learners from exposure to public internet strangers.
  - **Role-Based Access Control (RBAC):** Codified permission matrices across `super_admin`, `parent`, `learner`, and `unassigned`.

---

## [2026-10-24] - Author docs/DATABASE_AND_DATA_MODEL.md Data Architecture (CR-037)

### Added & Refined
- **[CR-037] ✅ IMPLEMENTED & VERIFIED - Dedicated Database Architecture & State Machine Specification:**
  - **Dual-Domain Mermaid ERD (`docs/DATABASE_AND_DATA_MODEL.md`):** Modeled the complete entity relationships across the **Curriculum Domain** (`courses` → `units` → `lessons` → `challenges` → `challenge_options`) and the **User & Social Domain** (`user_progress` ↔ `pods` ↔ `pod_members` ↔ `challenge_progress` ↔ `challenge_mistakes` ↔ `pod_reactions` ↔ `user_subscription`).
  - **Schema Dictionary:** Documented field-level specifications across all 12 tables, detailing primary keys, foreign key cascades, nullability, and default values.
  - **Operational State Machines:** Visualized state transitions for challenge submission and scoring, heart energy and practice refills, daily streak habits, and weekly pod celebration meters.
  - **Drizzle Migration & Sequence Protocols:** Formalized `npm run db:push` workflows and sequence synchronization (`SELECT setval(...)`).
  - **Strict Zero Data Loss Invariant:** Codified policies protecting live production learner records and XP during curriculum re-seeding.

---

## [2026-10-24] - Author docs/DEVELOPMENT_AND_SETUP.md Developer Guide (CR-036)

### Added & Refined
- **[CR-036] ✅ IMPLEMENTED & VERIFIED - Dedicated Developer Setup & Environment Playbook:**
  - **Comprehensive `docs/DEVELOPMENT_AND_SETUP.md`:** Published the complete local onboarding manual for developers, contractors, and AI agents.
  - **Complete `.env.local` Dictionary:** Field-by-field reference explaining the purpose, source dashboard, and default local values for every key (`DATABASE_URL`, Clerk publishable & secret keys, redirection URLs, `NEXT_PUBLIC_APP_URL`, `ADMIN_EMAILS`, `SUPER_ADMIN_USER_IDS`, `STRIPE_API_KEY`, `RENDER_API_KEY`, `RENDER_SERVICE_ID`).
  - **Database Lifecycle:** Step-by-step guidance on running `npm run db:push`, `npm run db:seed`, and `npm run db:studio`, with explicit protocols safeguarding live production learner progress.
  - **Super-Admin & Test Pod Provisioning:** Detailed instructions for configuring administrative credentials, accessing `/admin`, creating family circles, and provisioning test young learners via `AddChildModal`.
  - **Croatian Neural Audio Pipeline:** Guide on setting up `edge-tts` and executing `scripts/generate_croatian_audio.py` using `hr-HR-GabrijelaNeural` at `-5%` rate.

---

## [2026-10-24] - Centralize Architecture Specification & Streamline Gamification (CR-035)

### Added & Refined
- **[CR-035] ✅ IMPLEMENTED & VERIFIED - Data Modeling & System Architecture Centralization:**
  - **Comprehensive `docs/ARCHITECTURE.md`:** Expanded from a 33-line outline into the definitive engineering architecture document. Features a complete 12-table Mermaid ERD, detailed database schema dictionary, Clerk user and role hierarchy models (Super-Admin, Parent, Learner, and email-less child provisioning), pod authorization and scoping mechanics, and typed server action mutation pipelines.
  - **Streamlined `docs/HEARTS_AND_GAMIFICATION.md`:** Stripped out database schema definitions and query implementations; focused strictly on game mechanics, precision tracking (`hearts_used`), Practice-to-Earn sandboxes, Super Izazov milestone bonuses, streak habits, team celebration meters, peer high-fives, and parent magic wand praise.
  - **Brand Synchronization:** Updated naming from legacy "2lingo" to "CroLingo".

---

## [2026-10-24] - Repurpose README.md as Developer Guide & Streamline GOVERNANCE.md (CR-034)

### Added & Refined
- **[CR-034] ✅ IMPLEMENTED & VERIFIED - Developer Onboarding & Governance Separation:**
  - **Repurposed `README.md` as Developer Guide:** Replaced the brief duplicate governance checklist with a comprehensive developer onboarding manual featuring tech stack highlights, quick start instructions, environment variable definitions (`.env.local`), directory structure map, common development and database commands, and a complete documentation library sitemap.
  - **Focused `docs/GOVERNANCE.md`:** Maintained as the dedicated pre-merge engineering and PR review protocol enforcing the 4-point quality checklist and automated CI/CD curriculum validations.
  - **Brand Synchronization:** Updated naming from legacy "2lingo" to "CroLingo".

---

## [2026-10-24] - Consolidate Curriculum Standards & Lesson Planning Guide (CR-033)

### Added & Refined
- **[CR-033] ✅ IMPLEMENTED & VERIFIED - Separation of Concerns in Core Pedagogical Documentation:**
  - **`docs/CURRICULUM_STANDARDS.md` (The Invariant Specification Contract):** Refactored into a concise, declarative, and formal specification defining what constitutes a valid unit. Directly maps each specification rule to the automated CI/CD validator (`scripts/audit-curriculum-rules.ts`).
  - **`docs/LESSON_PLANNING_GUIDE.md` (The Authoring Playbook & How-To Tutorial):** Stripped out duplicate specification tables and verbatim copy; converted into a dedicated instructional playbook for authors and educators with step-by-step authoring workflows, templates, cognitive scaffolding rubrics, and the complete Unit 14 walkthrough.
  - **Cross-Referenced Architecture:** Linked the Authoring Playbook directly to the Invariant Specification Contract, eliminating risk of documentation drift.
  - **Brand Synchronization:** Updated legacy branding from "2lingo" to "CroLingo".

---

## [2026-10-24] - Rename World 4 to King's Landing & Span Top Badge Across Banner (CR-032)

### Added & Refined
- **[CR-032] ✅ IMPLEMENTED & VERIFIED - King's Landing Renaming & UnitBanner Layout Refactoring:**
  - **Renamed World 4 to King's Landing (`lib/theme-registry.ts`):** Celebrated Dubrovnik's iconic cultural standing as the real-world filming location for King's Landing:
    - Updated badge label: `👑 World 4: King's Landing • Ancient Dubrovnik`
    - Updated stage name: `King's Landing`
  - **Full-Width Top Badge Clearance (`app/(main)/learn/unit-banner.tsx`):** Restructured the unit banner layout to dedicate a full-width top row for the world pill badge (`w-full flex items-center`). This completely eliminates awkward text wrapping inside the badge when names are long.
  - **Pushed Nastavi Button Lower:** Aligned the `Nastavi` button with the bottom content row alongside the unit description (`flex sm:items-end justify-between`), giving both the header badge and the call-to-action button generous spacing and visual harmony.

---

## [2026-10-24] - Fix Speaker Icon & Number Collision on Compact Challenge Tiles (BUG-016)

### Fixed
- **[BUG-016] ✅ RESOLVED & VERIFIED - Dual-Mode Layout for SELECT Challenge Cards:**
  - **In-Flow Layout for Text-Only / Compact Tiles (`app/lesson/card.tsx`):** When `SELECT` challenges feature options without images (e.g. *"Sorry / Excuse me"*), cards now render as an in-flow horizontal flex row: `[Number Key (1)]  [Option Text]  --------  [Speaker Icon (🔊)]`.
  - **Eliminated Overlap Glitch:** Replaced absolute positioning on compact tiles with sequential in-flow flex children, mathematically preventing the hotkey badge from ever colliding with or obscuring the speaker icon.
  - **Diagonal Separation for Image Cards:** For tall cards with images, the hotkey badge is positioned in the **top-left corner** (`absolute top-2.5 left-2.5`), ensuring full diagonal separation from the bottom-right speaker icon.

---

## [2026-10-24] - Fix Keyboard Shortcut Number Overflow & Corner Placement (BUG-015)

### Fixed
- **[BUG-015] ✅ RESOLVED & VERIFIED - Challenge Choice Card Number Positioning & Overflow Prevention:**
  - **Relocated Shortcut Numbers to Top-Right Corner (`app/lesson/card.tsx`):** On `SELECT` (image-based) challenge cards, moved keyboard shortcut indicators (`1`, `2`, `3`, `4`) from the bottom text row to a dedicated, absolute hotkey badge in the top-right corner (`absolute top-2.5 right-2.5 bg-white/90 shadow-2xs`).
  - **Eliminated Horizontal Card Overflow:** Previously, long words like *"Doviđenja"* pushed the audio icon and number box beyond the card's right border, making the number float between cards. By separating the hotkey into the corner, the bottom row has ample room for full text and audio button with `min-w-0 truncate` protection.
  - **Standardized `ASSIST` Card Alignment:** Formatted text-only assist cards with clean Duolingo-style ordering: `[Key Badge] [Option Text] -------- [Audio Button]`.
  - **Fortified Card Container:** Added `relative overflow-hidden rounded-2xl` to ensure no internal child elements can ever escape the card frame.

---

## [2026-10-24] - Upgrade Learning Path Progression from "Phase" to "World" (CR-031)

### Added & Refined
- **[CR-031] ✅ IMPLEMENTED & VERIFIED - Gaming-Style "World" Progression:**
  - **Replaced "Phase" with "World" (`lib/theme-registry.ts`):** Transitioned away from academic/clinical "Phase" terminology in favor of vibrant, video-game style "World" progression (reminiscent of Mario, Pokémon, and classic platformers):
    - **World 1:** `🏰 World 1: Capital Adventure • Zagreb & Castles` (Units 1–5)
    - **World 2:** `🌊 World 2: Coastal Explorer • Adriatic Sea & Islands` (Units 6–10)
    - **World 3:** `🌲 World 3: Nature Quest • Plitvice Lakes & Golden Fields` (Units 11–15)
    - **World 4:** `👑 World 4: Crown Citadel • Ancient Dubrovnik (Capstone)` (Units 16–20)
  - **Kid-Friendly Engagement:** Creates immediate excitement and clear gamified milestone targets for young learners and families advancing down the path.

---

## [2026-10-24] - Replace Hardcoded 2lingo.net URL with Dynamic Origin in Parent Center (BUG-014)

### Fixed
- **[BUG-014] ✅ RESOLVED & VERIFIED - Dynamic Origin & Domain Resolution in Family Pod Invites:**
  - **Dynamic Host & Origin Resolution (`components/admin/how-to-add-children-card.tsx`):** Replaced hardcoded `2lingo.net` with dynamic `window.location.host` and `window.location.origin` (defaulting cleanly to `twolingo.onrender.com`).
  - **Accurate Copy Link Action:** Clicking "Copy Invite Link" now generates `${origin}/?join=${inviteCode}`, properly routing invited family members directly to the actual running instance (e.g. `https://twolingo.onrender.com/?join=B9SHUF` or custom domain) rather than a dead or third-party web address.
  - **Dynamic Child Provisioning Modal (`components/admin/add-child-modal.tsx`):** Replaced hardcoded `https://2lingo.net` in credentials clipboard text with `${origin}`, and updated login instructions from `"2lingo.net"` to `"CroLingo at {domain}"`.
  - **Branding Consistency:** Replaced leftover legacy "2lingo" text in modal copy with official **CroLingo** brand identity.

---

## [2026-10-24] - Learning Path Phase Color Sync & Engaging Adventure Phase Titles (CR-030)

### Added & Refined
- **[CR-030] ✅ IMPLEMENTED & VERIFIED - Phase Node Theming & Storybook Adventure Titles:**
  - **Learning Path Node Color Synchronization (`lib/theme-registry.ts`, `app/(main)/learn/lesson-button.tsx`, `app/(main)/learn/unit.tsx`):** Circular stepping stone buttons on `/learn` now dynamically inherit the visual identity of their regional phase rather than hardcoded lime green:
    - Phase 1 (Units 1–5): Continental Red buttons (`bg-red-500 border-red-600`), crimson progress rings (`#ef4444`), and red Start badges.
    - Phase 2 (Units 6–10): Adriatic Azure buttons (`bg-sky-500 border-sky-600`), azure progress rings (`#0284c7`), and sky-blue Start badges.
    - Phase 3 (Units 11–15): Emerald Pine buttons (`bg-emerald-500 border-emerald-600`), green progress rings (`#10b981`), and emerald Start badges.
    - Phase 4 (Units 16–20): Royal Navy buttons (`bg-blue-800 border-blue-950`), navy progress rings (`#1e3a8a`), and deep blue Start badges.
  - **English "Phase" Labeling:** Replaced Croatian `"1. Faza"`, `"2. Faza"`, etc. with clear English `"Phase 1"`, `"Phase 2"`, etc. across all unit banners.
  - **High-Engagement Storybook Adventure Titles:** Upgraded textbook titles into exciting, quest-driven adventure milestones:
    - Phase 1: `🏰 Phase 1: Capital Adventure • Zagreb & Castles`
    - Phase 2: `🌊 Phase 2: Coastal Explorer • Adriatic Sea & Islands`
    - Phase 3: `🌲 Phase 3: Nature Quest • Plitvice Lakes & Golden Fields`
    - Phase 4: `👑 Phase 4: Crown Citadel • Ancient Dubrovnik (Capstone)`
  - **Unit Banner Component Integration (`app/(main)/learn/unit-banner.tsx`):** Updated regional pill badge to display the new engaging adventure titles.

---

## [2026-10-24] - Super Izazov Milestone Heart Reward Engine (CR-029)

### Added & Refined
- **[CR-029] ✅ IMPLEMENTED & VERIFIED - Super Izazov Heart Reward:**
  - **Milestone Heart Replenishment (`actions/challenge-progress.ts`):** Completing Lesson 4 of any unit (**Super Izazov / Boss Quest**) now automatically awards the learner **+1 Heart** (`Math.min(hearts + 1, 5)`), celebrating cumulative retention and mitigating fatigue from previous lesson mistakes.
  - **Client UI & Toast Celebration (`app/lesson/quiz.tsx`):** Added instant celebratory toast notifications (`"👑 Super Izazov riješio! Zaradio si +1 novo srce! ❤️"`) and updated the in-lesson heart counter dynamically.
  - **Finish Screen Victory Banner:** Overhauled the quiz completion screen for Super Izazovs with golden crown + heart messaging: *"Svaka čast! 🌟 Osvojio si zlatnu krunu i zaradio novo srce! 🏆❤️"* alongside an animated reward badge (*"❤️ Super Izazov Nagrada: +1 Novo Srce zarađeno!"*).
  - **Gamification Specification (`docs/HEARTS_AND_GAMIFICATION.md`):** Formally codified Section 3 defining the Super Izazov heart reward rules in both first-time and replay modes.

---

## [2026-10-24] - Mobile Heritage Blue Header & Responsive Leaderboard Viewport (CR-028)

### Added & Refined
- **[CR-028] ✅ IMPLEMENTED & VERIFIED - Mobile Brand Header & Responsive Viewport Alignment:**
  - **National Heritage Navy Mobile Header (`components/mobile-header.tsx`):** Transformed the bare green mobile bar into an authentic Croatian blue navbar (`bg-blue-900 border-b border-blue-950 shadow-xs`) featuring the white hamburger menu, circular Paško mascot avatar, crisp `"CroLingo"` typography, and `"Hrvatski 🇭🇷"` badge.
  - **Zero Horizontal Overflow on Mobile (`components/feed-wrapper.tsx`, `app/(main)/leaderboard/page.tsx`):** Added `min-w-0 w-full max-w-full` to `FeedWrapper` and adjusted outer padding to `px-3 sm:px-6`, eliminating the horizontal clipping that caused the Leaderboard to appear left-justified and cut off on mobile devices.
  - **Responsive Leaderboard Rows:** Removed rigid hardcoded margins (`ml-3 mr-6`), introduced responsive avatar sizing (`h-10 w-10 sm:h-12 sm:w-12`), and applied `flex-1 min-w-0 truncate` to guarantee all 5 elements (rank, avatar, name/metrics, cheer button, XP) fit cleanly on narrow mobile screens (320px–390px).
  - **Responsive Pod Cards (`components/pod-celebration-meter.tsx`, `components/pod-switcher.tsx`, `components/pod-header.tsx`):** Added responsive column wrapping (`flex-col sm:flex-row`) and overflow boundaries, preventing cards from bursting viewport bounds.

---

## [2026-10-24] - Standardize Action Gate Button Heights & 3D Depth (BUG-013)

### Fixed
- **[BUG-013] ✅ RESOLVED & VERIFIED - Landing Action Gate Sizing & Visual Harmony:**
  - **Height Standardization (`app/(marketing)/page.tsx`):** Eliminated the invalid Tailwind `h-13` class and standardized both action buttons to an identical, generous, touch-friendly height (`h-14` / 56px).
  - **Tactile 3D Depth Symmetry:** Harmonized 3D tactile buttons:
    - Primary Gate (`"I Already Have an Account"`): `h-14 text-base font-black bg-green-600 border-b-4 border-green-700 active:border-b-0 active:translate-y-0.5`.
    - Secondary Gate (`"I'm New Here! Start Learning"`): `h-14 text-base font-black bg-white border-2 border-b-4 border-slate-300 hover:border-slate-400 active:border-b-2 active:translate-y-0.5`.
  - **Typography & Icon Polish:** Equalized icon dimensions (`h-5 w-5`), standardized `text-base font-black tracking-normal`, widened container to `max-w-[360px]`, and centered the top Croatian badge (`px-3.5 py-1.5 leading-none`).

---

## [2026-10-24] - Rebrand to CroLingo & National Heritage Navy Logo Typography (CR-027)

### Added & Refined
- **[CR-027] ✅ IMPLEMENTED & VERIFIED - Official Brand Name "CroLingo" & Heritage Navy Palette:**
  - **Brand Name Elevation:** Replaced generic Duolingo-derivative "2lingo" with **CroLingo**, emphasizing dedicated focus on Croatian language and heritage education.
  - **National Heritage Navy Typography (`#1E3A8A` / `text-blue-900`):** Replaced legacy Duolingo green (`text-green-600`) with authentic Croatian tricolor blue (*Trobojnica*) across the marketing header (`app/(marketing)/header.tsx`), main navigation sidebar (`components/sidebar.tsx`), and hero headline (`app/(marketing)/page.tsx`).
  - **SEO & App Metadata (`app/layout.tsx`):** Upgraded root layout metadata from starter boilerplate to `"CroLingo — Learn Croatian the Playful Way"`.
  - **Admin & Onboarding Copy:** Updated parent portal header (`app/admin/page.tsx`), onboarding greetings (`components/modals/role-onboarding-modal.tsx`), and family code cards (`components/admin/how-to-add-children-card.tsx`).
  - **Living Design System Alignment (`docs/DESIGN_SYSTEM.md`):** Updated token catalog assigning `cro-blue-deep` (`#1E3A8A` / `blue-900`) as the primary brand typography token.

---

## [2026-10-24] - Display English Translations for All Quest Stages (BUG-012)

### Fixed
- **[BUG-012] ✅ RESOLVED & VERIFIED - Bilingual Quest Milestone Stages:**
  - **Data Model & Translations (`constants.ts`):** Augmented `quests` definition with explicit `stageCroatian` and `stageEnglish` fields, translating all 8 milestone stages:
    - 50 XP: *Mali Početnik* • "Little Beginner"
    - 100 XP: *Mali Istraživač* • "Little Explorer"
    - 250 XP: *Prijatelj Riječi* • "Friend of Words"
    - 500 XP: *Jadranski Mornar* • "Adriatic Sailor"
    - 1,000 XP: *Vitez Znanja* • "Knight of Knowledge"
    - 2,500 XP: *Sokol Velebita* • "Falcon of Velebit"
    - 5,000 XP: *Majstor Jezika* • "Language Master"
    - 10,000 XP: *Hrvatska Legenda* • "Croatian Legend"
  - **Quests Right-Rail Widget (`components/quests.tsx`):** Rendered clean bilingual row layout with `Earn {X} XP` header, fraction points counter (`points/value`), and clear Croatian title with English translation (`Mali Početnik • "Little Beginner"`).
  - **Quests Page (`app/(main)/quests/page.tsx`):** Updated milestone cards with full bilingual stage subtitle, total XP progress, and completion badge.

---

## [2026-10-24] - Replace Primitive Mascot SVG with Approved Paško Artwork Across App (BUG-011)

### Fixed
- **[BUG-011] ✅ RESOLVED & VERIFIED - Paško Mascot Version Mismatch in Sidebar & Modals:**
  - **Sidebar Logo Avatar (`components/sidebar.tsx`):** Replaced primitive hand-coded `mascot.svg` with the approved, high-resolution circular Paško avatar (`/mascot.png`) matching the marketing header styling (`border-2 border-slate-200/90 shadow-2xs group-hover:scale-105`), paired with crisp "2lingo" branding and "Hrvatski 🇭🇷" subtitle.
  - **In-Lesson Prompts & Modals (`app/lesson/question-bubble.tsx`, `app/lesson/header.tsx`):** Upgraded question speech bubble tap mascot and in-lesson heart recharge dialog to the circular Paško portrait avatar.
  - **User Progress & Celebration Modals (`components/user-progress.tsx`, `components/modals/hearts-modal.tsx`, `components/pod-celebration-meter.tsx`):** Standardized heart recharge prompts and family pod XP celebration dialogs on the official Paško artwork.
  - **Onboarding & Admin Avatars (`components/modals/child-onboarding-modal.tsx`, `components/modals/role-onboarding-modal.tsx`, `components/admin/add-child-modal.tsx`, `components/admin/add-member-to-pod-modal.tsx`):** Replaced all remaining `/mascot.svg` fallbacks with `/mascot.png`.
  - **SVG Asset Compatibility (`public/mascot.svg`, `public/pasko.svg`):** Embedded the approved high-resolution Paško artwork directly into the SVG files with circular clipping, guaranteeing any legacy or database references automatically render the official Dalmatian pup character.
  - **Schema & Action Defaults (`db/schema.ts`, `actions/`):** Updated default `userImageSrc` across database schema and user progress creation actions to `/mascot.png`.

---

## [2026-10-24] - Fix Learning Path Unit Banner Purged Gradient & Icon Size (BUG-010)

### Fixed
- **[BUG-010] ✅ RESOLVED & VERIFIED - Unit Banner Background Purge & Iconography Polish:**
  - **Tailwind Config Content Extension:** Added `'./lib/**/*.{ts,tsx}'` to `tailwind.config.ts`, ensuring Tailwind compiler scans `lib/theme-registry.ts` and preserves all regional gradient color stop utilities in production bundles.
  - **Solid Background Fallback:** Added explicit solid background classes (`bg-red-600`, `bg-sky-600`, `bg-emerald-600`, `bg-blue-900`) to `lib/theme-registry.ts` and `app/(main)/learn/unit-banner.tsx` so banners never collapse to transparent white.
  - **Enlarged Iconography & Pill Badge:** Scaled regional stage badge to `text-xs font-black px-3.5 py-1` with `text-base` emoji (`🏰`, `🌊`, `🌲`, `👑`) and high-contrast translucent background (`bg-black/25 text-white border-white/40`).

---

## [2026-10-24] - 4-Stage Regional Croatian Curriculum Unit Banners (CR-023 to CR-026)

### Added & Refined
- **[CR-023 to CR-026] ✅ IMPLEMENTED & VERIFIED - 4-Stage Regional Croatian Unit Theming:**
  - **Declarative Theme Registry (`lib/theme-registry.ts`):** Established scalable theme engine mapping units to Croatia's 4 distinct cultural and geographic regions with zero hardcoded styling logic.
  - **[CR-023] Stage 1 (Units 1–5 - Zagreb & Central Croatia):** Continental red and hearth amber gradient (`from-red-600 via-rose-600 to-amber-600`), `🏰 1. Faza • Zagreb i Središnja Hrvatska` badge, white 3D continue button with rose accents.
  - **[CR-024] Stage 2 (Units 6–10 - Kvarner & Dalmatian Coast):** Adriatic azure and coastal cyan gradient (`from-sky-500 via-blue-600 to-cyan-600`), `🌊 2. Faza • Kvarner i Dalmatinska Obala` badge, white 3D continue button with sky-blue accents.
  - **[CR-025] Stage 3 (Units 11–15 - Plitvice Lakes & Slavonia):** Emerald pine and golden sunflower wheat gradient (`from-emerald-600 via-teal-600 to-amber-600`), `🌲 3. Faza • Plitvička Jezera i Slavonija` badge, white 3D continue button with emerald accents.
  - **[CR-026] Stage 4 (Units 16–20 - Dubrovnik & Island Heritage):** Royal Adriatic navy and fortress indigo gradient (`from-blue-900 via-indigo-900 to-amber-700`), `👑 4. Faza • Dubrovnik i Otoci (Level 1 Capstone)` badge, royal golden 3D continue button.
  - **Banner Component Polish (`app/(main)/learn/unit-banner.tsx`):** Added dynamic regional badges, responsive layout, decorative radial lighting, and bilingual continue action (`"Nastavi"`).

---

## [2026-10-24] - Landing Page High-Fidelity Artwork & Šahovnica Ribbon Polish (CR-022)

### Added & Refined
- **[CR-022] ✅ IMPLEMENTED & VERIFIED - High-Fidelity Artwork & Šahovnica Ribbon Polish:**
  - **High-Resolution Paško Hero Artwork (`public/pasko-hero.jpg`):** Overhauled landing page hero illustration with dedicated digital cartoon artwork featuring Paško the Dalmatian Pup, the red *licitarsko srce*, coastal island ferry (*trajekt*), golden sun, and authentic speech bubbles.
  - **Paško Mascot Navigation Avatar (`public/mascot.png`):** Integrated Paško's high-res circular avatar into the header navigation brand logo.
  - **Authentic Croatian Checkerboard (*Šahovnica*) Ribbon (`app/(marketing)/header.tsx`):** Fixed dashed gradient line with an authentic framed dual-row alternating red-and-white conic checkerboard pattern (`bg-[repeating-conic-gradient(#DC2626_0%_25%,#FFFFFF_0%_50%)]`).
  - **Action Gate Typography & Depth (`app/(marketing)/page.tsx`):** Upgraded "I Already Have an Account" and "I'm New Here! Start Learning" to clean title casing with 3D drop depth and active button scale transitions.

---

## [2026-10-24] - Croatian Landing Page Redesign & "Paško the Dalmatian" Mascot (CR-021)

### Added & Refined
- **[CR-021] ✅ IMPLEMENTED & VERIFIED - Croatian Cultural Landing Page & Paško Mascot:**
  - **New Official Mascot ("Paško the Dalmatian Pup"):** Replaced Duolingo-derivative green cube with an authentic Croatian mascot: Paško, an adorable Dalmatian puppy with Dalmatian black spots, a red-and-white Croatian checkerboard (*šahovnica*) ear spot, and a red bandana collar (`public/pasko.svg` & updated `public/mascot.svg`).
  - **Rich Croatian Hero Illustration (`public/hero-croatian.svg` & `public/hero.svg`):** Built a vector hero scene featuring Paško, Mediterranean kids Luka and Mia, the Adriatic coastal island ferry (*trajekt*), the golden sun, a traditional folk gingerbread *licitarsko srce*, and Croatian speech bubbles (*"Bok!"*, *"Hvala!"*, *"Idemo!"*).
  - **Two Child-Friendly Action Gates (`app/(marketing)/page.tsx`):** Eliminated the ambiguous "Get Started" button in favor of two purpose-driven gates:
    - 🔑 **"I Already Have an Account"** (Primary Green 3D Button) — direct sign-in for returning kids and parents.
    - ✨ **"I'm New Here! Start Learning"** (High-Contrast Clean 3D Button) — sign-up for new families.
  - **Parent Portal Navigation (`app/(marketing)/header.tsx`):** Added dedicated "Parent Portal →" header action directing parents straight to `/admin` upon authentication, paired with a subtle Croatian checkerboard ribbon accent along the header base.

---

## [2026-10-24] - Parent Center Navigation Label Standardization (BUG-009)

### Fixed
- **[BUG-009] ✅ RESOLVED & VERIFIED - Standardized Header Return Button Label ("Back to Learning Path"):**
  - **Symptom:** The return button in the Parent Center (`/admin`) header was inconsistently labeled `Back to Croatian Map`, clashing with platform-standard terminology.
  - **Fix:** Updated button label in `app/admin/page.tsx` to `Back to Learning Path`, matching the Parent Center welcome banner (`View Learning Path`) and the Parent Mode banner (`browsing the Learning Path as a parent`).

---

## [2026-10-24] - Super-Admin User-to-Pod Assignment & Roster Management (CR-020)

### Added & Refined
- **[CR-020] ✅ IMPLEMENTED & VERIFIED - Super-Admin User-to-Pod Assignment & Roster Management:**
  - **Server Action (`actions/pod.ts` - `adminAddUserToPod`):** Implemented secure server action enabling Super-Administrators (or pod owners) to assign any existing learner or parent to any pod. Handles idempotent duplicate membership checks, dynamically updating role (`member` vs `admin`) if already present. Revalidates `/admin`, `/leaderboard`, and `/learn`.
  - **Add Member Modal (`components/admin/add-member-to-pod-modal.tsx`):** Built interactive modal with real-time user search, user avatar/name/ID preview, member collision prevention (greying out users already in the pod), and dual-role picker (`Learner` vs `Pod Admin`).
  - **Pod Management Card Integration (`components/admin/pod-management-card.tsx`):** Rendered clean "+ Add User" action button next to the member count header on each pod card and wired it to the modal.
  - **Admin Page Data Wiring (`app/admin/page.tsx`):** Passed system-wide learner roster (`allLearners`) and `isSuperAdmin` authorization flag into `PodManagementCard`.

---

## [2026-10-24] - Sidebar Navigation Deduplication & Parent-First Ordering (CR-019)

### Added & Refined
- **[CR-019] ✅ IMPLEMENTED & VERIFIED - Sidebar Navigation Deduplication & Parent-First Hierarchy:**
  - **Removed Redundancy:** Removed the duplicate bottom "Parent Center" button from `components/sidebar.tsx`.
  - **Parent-First Ordering:** When an administrator or parent logs in, **"Parent Center"** is automatically prioritized as the top navigation item right below the 2Lingo logo, followed by Learn, Leaderboard, and Quests.
  - **Student View Unaltered:** Learner accounts continue to see clean, distraction-free student navigation (Learn, Leaderboard, Quests) with zero administrative elements.

---

## [2026-10-24] - Parent Mode Banner Layout & Clipping Fix (BUG-008)

### Fixed
- **[BUG-008] ✅ RESOLVED & VERIFIED - Parent Mode Banner Bottom Edge Trimmed by Sticky Header:**
  - **Symptom:** On `/learn`, the green "Parent Account" banner had its bottom 28px trimmed and sliced off, obscuring its bottom rounded corners and button shadow.
  - **Root Cause:** In `app/(main)/learn/page.tsx`, `ParentModeBanner` was placed before `<Header />`. Because `<Header />` has `sticky top-0 bg-white lg:mt-[-28px]`, its solid white background overlaid and clipped the bottom of the banner.
  - **Fix:** Reordered feed elements to anchor `<Header />` at the top of the feed with `ParentModeBanner` positioned cleanly below it. Refined button styling and padding to ensure complete border-radius geometry.

---

## [2026-10-24] - Parent Learning Path Access & Seamless Dual-Mode Navigation (CR-018)

### Added & Fixed
- **[CR-018] ✅ IMPLEMENTED & VERIFIED - Eliminated `/learn` Redirect Trap & Enabled Seamless Parent Learning:**
  - **Unrestricted Learning Path Access:** Removed the forced redirect loop in `app/(main)/learn/page.tsx` so parents can freely take lessons, play Croatian challenges, and inspect units alongside their children without getting pushed to `/admin`.
  - **Parent Mode Banner (`components/parent-mode-banner.tsx`):** Added a discreet, stylish top banner on `/learn` for parent accounts with a 1-click **"Parent Center →"** button for instant return.
  - **Parent Center Shortcut:** Added **"View Learning Path"** button directly inside the Parent Center welcome header (`app/admin/page.tsx`).
  - **Sidebar Streamlining:** Preserved standard `/learn` navigation across all user roles while keeping the discrete "Parent Center" button permanently accessible for authorized admins and parents.

---

## [2026-10-24] - Avatar Skin Tone Refinement & Croatian Example Names (CR-017)

### Added & Refined
- **[CR-017] ✅ IMPLEMENTED & VERIFIED - Avatar Skin Tone Harmonization & Croatian Example Names:**
  - **Lighter Skin Tone Avatars:**
    - Replaced pixelated low-res dark assets (`woman.svg`, `man.svg`, `girl.svg`, `boy.svg`) with modern, clean, scalable vector illustrations.
    - Updated skin complexion across all human avatars to a natural, warm, Mediterranean/Croatian light tone (`#FBD38D` / `#FDDEC9`) that seamlessly matches the Grandma and Grandpa avatars.
    - Switched `AddChildModal` avatar selector to point directly to dedicated kid avatars (`/girl.svg` and `/boy.svg`).
  - **Authentic Croatian Example Names:**
    - Updated "Add Child Learner" dialog placeholders from Valentina to Croatia's two most popular children's names: one girl and one boy:
      - Child's First Name: `e.g. Luka or Mia`
      - Username: `e.g. luka or mia`
    - Harmonized helper text in `actions/child-account.ts` to `(e.g. luka_z or mia12)`.

---

## [2026-10-24] - Parent Direct Child Provisioning, Onboarding Guide & Parent Default Landing (CR-016)

### Added
- **[CR-016] ✅ IMPLEMENTED & VERIFIED - Direct Child Account Creation & Parent Default Navigation:**
  - Parents can now provision learner accounts for their children (e.g. Valentina) directly from the Parent Center without requiring an email address.
  - Automatically provisions a kid-friendly Clerk username and password with avatar selection, assigns `role: 'learner'`, and enrolls them into the family pod with `role: 'member'`.
  - Confirmation dialog provides one-click copyable credentials so children can immediately log in on any device.
- **Parent Center Helper Card (`components/admin/how-to-add-children-card.tsx`):**
  - Prominent onboarding card displayed directly under the welcome banner detailing both setup options:
    - Option 1: Direct Account Creation (no email required).
    - Option 2: Self-Join on Child's Device using the 6-character Family Code or 1-click invite link.
- **Parent Center Default Landing:**
  - When parents log in, they automatically land on `/admin` (Parent Center) instead of the learner map.
  - Sidebar dynamically displays "Curriculum" linking to `/learn?preview=true` so parents can inspect learning progress and challenges without being redirected.
  - Home landing page button automatically updates to "Open Parent Center" when a parent account is signed in.

---

## [2026-10-24] - Child Onboarding Experience & Multi-Pod Leaderboard Switcher (CR-015)

### Added
- **[CR-015] ✅ IMPLEMENTED & VERIFIED - Child Onboarding Screen & Multi-Pod Leaderboard Switcher:**
  - **Kid-Friendly Join Screen (`components/modals/child-onboarding-modal.tsx`):**
    - First-time child onboarding prompt: *"🇭🇷 Join Your Pod! Do you have a Family or School Pod code from your parent or teacher?"*
    - Interactive 6-slot letter tile input with automatic focus progression, backspace navigation, and paste support (e.g. typing or pasting `ZGOMBA`).
    - Enrolls learners with `role: 'member'` (strictly kid-safe learner permissions).
    - Includes *"I'll join later"* skip option with local dismissal persistence so unlinked students can immediately enjoy the curriculum map without friction.
  - **Multi-Pod Leaderboard Switcher (`components/pod-switcher.tsx`):**
    - Built interactive pill switcher on `/leaderboard` allowing students and parents in multiple pods (e.g. Family Pod vs School Classroom) to toggle seamlessly between pod leaderboards and celebration meters.
    - Added dedicated **"➕ Join a Pod"** button on the leaderboard answering user query *"HOW DO I JOIN A POD?"* with one-click access to the letter tile prompt.
  - **Relational Multi-Pod Queries (`db/queries.ts`):**
    - Updated `getTopTenUsers(activePodId?: number)` to scope rankings dynamically to any active pod while continuing to exclude adult owners from child leaderboards.
    - Added `getUserPods()` to return all pods a user belongs to.
    - Enhanced `getUserPod(activePodId?: number)` with fallback to the user's primary pod.
  - **Zustand Store (`store/use-child-onboarding-modal.ts`):**
    - Modal state management enabling join pod prompts from header, switcher, or first-time layout detection.

---

## [2026-10-23] - Multi-Family Role Schema & Parent Onboarding Wizard (CR-014)

### Added
- **[CR-014] ✅ IMPLEMENTED & VERIFIED - Multi-Family Role Schema & Parent Onboarding Wizard:**
  - **Schema Evolution:** Added `role: text("role").default("learner").notNull()` to `user_progress` table in `db/schema.ts` and Neon Postgres.
  - **Account Role Migration:** Marked existing sister learners (Adriana, Vanessa, Silvia) as `learner` and Philip as `parent`.
  - **Role Selection Dialog (`components/modals/role-onboarding-modal.tsx`):**
    - First-time role onboarding wizard: *"Dobrodošli! Are you joining as a: [ 👨‍👩‍👧‍👦 Parent / Educator ] or [ 🎒 Young Learner ]?"*
    - For Young Learners: Automatically initializes learner mode and preserves the learning map.
    - For Parents: Multi-step setup wizard prompting for Family Circle Name (e.g. *"The Horvat Family"*), weekly celebration target (500 XP, 1,000 XP ⭐, or 2,000 XP), and optional custom invite code (e.g. `HORVAT`).
  - **Server Actions (`actions/family-onboarding.ts`):**
    - `createFamilyOnboarding`: Dynamically generates or validates unique invite codes, inserts the new pod with `owner_id = userId`, grants the parent `owner` status in `pod_members`, and sets their role to `parent`.
    - `selectLearnerRole`: Configures learner status cleanly without disruption.
  - **Multi-Tenant Isolation in Parent Center (`app/admin/page.tsx`):**
    - Strictly isolates regular family admins to pods they own (`p.ownerId === userId`), with 0 cross-access to other families.
    - Retains Super-Admin platform oversight for Phil (`philip.zgomba@gmail.com`).
  - **Parent Center Pod Management Updates (`components/admin/pod-management-card.tsx`):**
    - Enhanced role pills to display "Parent" for pod owners and "Admin" for co-admins.
    - Added one-click copy button for family invite codes.
  - **Zustand Store (`store/use-role-modal.ts`) & UI Components (`components/ui/input.tsx`):**
    - Centralized role modal state management.

---

## [2026-10-23] - Parent Center Welcome Banner Gradient Syntax & Readability (BUG-007)

### Fixed
- **[BUG-007] ✅ RESOLVED & VERIFIED - White-on-White Unreadable Text in Parent Center Welcome Banner:**
  - **Symptom:** In `/admin`, the Welcome Banner ("Dobrodošli, Philip! 🇭🇷", subtitle, and active family code) rendered with white text on an unstyled white background, making the text nearly invisible.
  - **Root Cause:** The container used the invalid experimental class `bg-linear-to-r` instead of Tailwind v3's standard `bg-gradient-to-r`.
  - **Fix:** Corrected `bg-linear-to-*` to `bg-gradient-to-*` across `app/admin/page.tsx`, `components/admin/tricky-words-card.tsx`, `components/cheer-banner.tsx`, and `components/pod-celebration-meter.tsx`. Added `bg-green-600` solid color fallback to ensure rich emerald gradient contrast and crisp white text.

---

## [2026-10-23] - Email Super-Admin & Scoped Parent Center Access (CR-013)

### Added
- **[CR-013] Email Super-Admin & Scoped Parent Center Access:**
  - Modernized `lib/admin.ts` with email-based authorization checking Clerk's `currentUser()` and `auth()`.
  - Configured `philip.zgomba@gmail.com` as permanent platform **Super-Admin** and Owner of the Zgomba Family Pod (`pods.id = 1`).
  - Added support for `ADMIN_EMAILS` and `SUPER_ADMIN_USER_IDS` environment variables.
  - Implemented dynamic pod and learner scoping in `app/admin/page.tsx`:
    - Regular family admins/parents are strictly scoped to pods they own (`ownerId === userId`) and members of their family circle.
    - Super-Admin (`philip.zgomba@gmail.com`) is granted complete platform oversight and can view all active family pods.
    - Displayed Super-Admin badge with Crown indicator.
  - Added discrete **"🛡️ Parent Center"** button in `components/sidebar.tsx` (and `components/mobile-sidebar.tsx`) that appears dynamically only when an authorized administrator or parent account is logged in.

---

## [2026-10-23] - Practice Session Quality: Number Alignment & Visual Collision Resolving (BUG-005, BUG-006)

### Fixed
- **[BUG-005] ✅ RESOLVED & VERIFIED - Challenge 43 ("Five (5)") Incorrectly Requiring "Četiri":**
  - **Symptom:** In practice review (`/lesson/practice`) and Unit 4 Lesson 1, selecting **`Pet`** (Five) was marked incorrect (red highlight), while **`Četiri`** (Four) was accepted.
  - **Root Cause:** In `challenge_options` for Challenge 43, Option 2680 (`Četiri`) had `correct: true` while Option 2681 (`Pet`) had `correct: false`.
  - **Fix:** Flipped the boolean flags in Neon Postgres so `Pet` (ID: 2681) is `true` and `Četiri` (ID: 2680) is `false`. Verified 100% precision.
- **[BUG-006] ✅ RESOLVED & VERIFIED - Duplicate Slide SVG Used for "Swing" (`Ljuljačka` vs `Tobogan`):**
  - **Symptom:** In Unit 12 Lesson 1 (Challenge 199), both **`Ljuljačka`** (Swing) and **`Tobogan`** (Slide) displayed the exact same orange slide illustration.
  - **Root Cause:** File inspection revealed `public/swing.svg` was a binary copy of `public/slide.svg`.
  - **Fix:** Replaced `public/swing.svg` with a dedicated, authentic vector SVG of a playground A-frame swing set with chains, seat, and crossbars.
- **Practice Session Deep Audit & Additional Visual Collisions Resolved:**
  - Ran automated curriculum audit across all 359 challenges.
  - Identified and resolved 4 additional image collisions:
    - Challenge 1 & 3: `Molim` (Please) re-routed from `/mascot.svg` to `/heart.svg`, leaving `/mascot.svg` exclusive to `Bok` (Hello).
    - Challenge 13: `Baka` (Grandma) assigned new dedicated `/grandma.svg`, distinguishing it from `Mama` (`/woman.svg`).
    - Challenge 14: `Djed` (Grandpa) assigned new dedicated `/grandpa.svg`, distinguishing it from `Tata` (`/man.svg`).
  - Full audit confirms **0 semantic number mismatches, 0 option cardinality errors, and 0 duplicate image collisions** across all 359 challenges.

---

## [2026-10-22] - Tricky Words & Mistake Heatmap Analytics (CR-012)

### Added
- **[CR-012] Tricky Words & Mistake Heatmap Analytics:**
  - Created `challenge_mistakes` telemetry table in Neon Postgres and wired into `reduceHearts()` in `actions/user-progress.ts` and `app/lesson/quiz.tsx` to automatically capture error selections, distractors, and timestamps.
  - Implemented `getTrickyWordsAnalytics()` in `db/queries.ts` computing top tricky vocabulary items, distractor confusion frequencies, and completion accuracy across Units 1–20.
  - Built interactive `<TrickyWordsCard />` inside the Parent Portal at `/admin` featuring:
    - **Top 10 Tricky Words:** Ranked breakdown of words requiring repetition (e.g. `Laku noć` vs `Dobar dan`, `Molim` vs `Hvala`), accuracy percentages, and specific distractor confusions.
    - **Unit Heatmap:** 20-unit visual matrix showing mastery status chips (Mastered 90%+, Solid 75-89%, Needs Review, and Upcoming) with completion counters and precision progress bars.
    - **Offline Family Conversation Starters:** 3 actionable Croatian prompts for breakfast, dinner, and car rides giving parents practical phrases to reinforce tricky concepts away from screens.
  - Integrated into the Parent & Educator Center shell at `/admin`.

---

## [2026-10-22] - Learner Health & Parent Magic Wand Overrides (CR-011)

### Added
- **[CR-011] Learner Health Card & Parent Magic Wand Overrides:**
  - Implemented server actions `adminRefillHearts()`, `adminProtectStreak()`, and `adminAwardPraiseXp()` in `actions/admin-overrides.ts`.
  - Built interactive `<LearnerHealthCard />` inside the Parent Portal at `/admin` displaying active status, heart meters, flame counts, and real-time override tools for each sister.
  - **Instant Heart Refill:** One-click magic wand replenishment to 5/5 hearts, dissolving frustration after difficult lessons without waiting.
  - **Streak Grace Protection:** One-click streak flame boost for busy school days, recitals, or weekend trips so hard-earned flames are never lost.
  - **Real-Life Croatian Praise Award:** Dialog allowing parents to award +25, +50, or custom XP presets (e.g. "Spoke Croatian at dinner! 🇭🇷", "Helped sister practice vocabulary! 🌟") that instantly reflect in both individual learner XP and the family pod celebration meter.

---

## [2026-10-22] - Pod & Family Circle Management Hub (CR-010)

### Added
- **[CR-010] Pod & Family Circle Management Hub:**
  - Built interactive `<PodManagementCard />` inside the Parent Portal at `/admin` showing all active pods, custom invite codes, member counts, and weekly goal progress.
  - Implemented server actions `updatePodSettings()`, `createPod()`, and `deletePod()` in `actions/pod.ts` allowing parents to edit pod names, assign custom invite codes (e.g. `ZGOMBA`, `BAKA`), and adjust weekly celebration goals (500–2,000 XP).
  - Enhanced student-facing `<PodHeader />` dialog on the Leaderboard with a two-tab interface allowing family members to either join an existing pod with a code or create a brand new pod with 1 click.
  - Full relational integrity: deleting non-default pods safely cascades memberships while preserving individual learner XP.

---

## [2026-10-22] - Parent & Admin Access Governance (CR-009)

### Added
- **[CR-009] Parent & Admin Access Governance & Portal Shell:**
  - Modernized `lib/admin.ts` with role-based authorization supporting administrator accounts and `ADMIN_USER_IDS` environment variable, eliminating the obsolete legacy hardcoded gate.
  - Built a dedicated, responsive **Parent & Educator Center** dashboard at `/admin`.
  - Created key metric KPI cards for the Zgomba Family Pod, weekly team XP goal progress, and family streak status.
  - Implemented real-time Learner Health Roster tracking live stats (XP, streaks, hearts, accuracy) for Adriana, Vanessa, and Silvia.
  - Scaffolded modular launch points for upcoming Pod Management (CR-010), Magic Wand Overrides (CR-011), and Tricky Words Analytics (CR-012).
  - Maintained strict child isolation with zero access leaks and seamless back-navigation to the Croatian course map.

---

## [2026-10-22] - Family Pod Name Correction: Zgomba Family (BUG-004)

### Fixed
- **[BUG-004] ✅ RESOLVED & VERIFIED - Family Pod Name and Invite Code Correction:**
  - Renamed the default sister learning circle in Neon Postgres database from "Zubac Family" to **"Zgomba Family"** (`pods.id = 1`).
  - Updated the official family invite code from `ZUBAC6` to **`ZGOMBA`**.
  - Aligned default component props and placeholders across `components/pod-header.tsx` and `components/pod-celebration-meter.tsx`.

---

## [2026-10-22] - Landing Page Course Alignment & Uncovered Flags Removal (CR-008)

### Changed
- **[CR-008] Landing Page Course Alignment & Uncovered Flags Removal:**
  - Removed placeholder buttons and flags for uncovered languages (Spanish, French, Italian, and Japanese) from `app/(marketing)/footer.tsx`.
  - Aligned the public marketing footer to celebrate 2lingo's bespoke Croatian language features:
    - 🇭🇷 **Hrvatski (Croatian)** — Authentic 20-unit curriculum
    - 🔥 **Daily Streaks** — Habit flame retention engine
    - ❤️ **Practice for Hearts** — Low-stress heart practice mini-game
    - 🏡 **Family Pods & Teams** — Collaborative sister learning circles
  - Ensures 100% truth in advertising for parents and young learners.

---

## [2026-10-22] - Peer High-Fives & Social Cheer Engine (CR-007)

### Added
- **[CR-007] Peer High-Fives & Social Cheer Engine (Phase 3):**
  - Added relational `pod_reactions` table to Postgres schema in `db/schema.ts` with migration.
  - Built server actions `sendPodCheer(receiverId, type)` and `claimCheer(cheerId)` in `actions/cheer.ts` with rate-limiting (1 cheer per recipient per calendar day).
  - Built interactive `<CheerButton />` component integrated on the Leaderboard next to each sister's card.
  - Built `<CheerBanner />` notification banner displayed on both `/learn` and `/leaderboard` when unread cheers are waiting.
  - Claiming a high-five awards a micro-bonus of +5 XP to the recipient and propagates +5 XP to active family pods.
  - Child safety and COPPA compliant: pre-set positive reactions only (no open text messaging).

---

## [2026-10-22] - Collaborative Team Celebration Meter (CR-006)

### Added
- **[CR-006] Collaborative Team Celebration Meter (Knowledgehook Engine):**
  - Added `current_xp`, `celebration_unlocked`, and `week_number` columns to the `pods` table in Postgres schema.
  - Implemented `awardPodXp(userId, xp)` action in `actions/pod.ts` ensuring that whenever a child completes a lesson or practice quiz, their earned XP simultaneously boosts all family/class pods they belong to.
  - Wired collaborative XP accumulation into `actions/challenge-progress.ts` and `actions/user-progress.ts`.
  - Built interactive `<PodCelebrationMeter />` component featuring a dynamic progress thermometer, percentage tracker, remaining XP countdown, and a full-screen Confetti Party celebration modal.
  - Initialized Zubac Family pod to 740 / 1,000 XP (74%) to give Adriana, Vanessa, and Silvia an exciting, achievable collaborative milestone.
  - Zero disruption to individual learner accounts; fully compliant with all curriculum and architectural standards.

---

## [2026-10-22] - Learning Pods & Family Circles Engine (CR-005)

### Added
- **[CR-005] Learning Pods & Family Circles Engine (Phase 1):**
  - Added relational `pods` and `pod_members` tables to Postgres schema in `db/schema.ts`.
  - Created initial `"Zubac Family"` pod (ID: 1, Invite Code: `ZUBAC6`) with Adriana as admin, and Vanessa and Silvia as members.
  - Replaced hardcoded username matching in `getTopTenUsers` with dynamic relational pod scoping, permanently securing kid privacy while enabling dynamic multi-pod participation.
  - Created server actions `joinPodByCode()` and `createPod()` in `actions/pod.ts`.
  - Added `<PodHeader />` component to the Leaderboard showing pod name, member count badge, copyable invite code, and interactive "Join Pod" modal dialog.
  - Zero disruption to existing learner data; preserved all XP, streaks, and hearts.

---

## [2026-10-22] - Daily Streak Counter & Habit Flame Engine (CR-004)

### Added
- **[CR-004] Daily Streak Counter & Habit Flame Engine:**
  - Added `streak` (integer, default 0) and `last_active_date` (text `YYYY-MM-DD`) columns to `user_progress` with automated migration.
  - Implemented consecutive calendar day streak calculation algorithm in `lib/streak.ts` (`calculateStreak`).
  - Wired streak tracking into lesson completion (`upsertChallengeProgress`) and practice sessions (`awardPracticeSessionHeart`).
  - Designed custom flame badge asset (`public/streak.svg`) and integrated it into the `UserProgress` header bar across `/learn`, `/leaderboard`, and `/quests`.
  - Added interactive Daily Streak Modal with celebratory animations and habit guidance when clicking the flame icon.
  - Integrated streak metrics into the Leaderboard (`🔥 [N] day(s) • 💔 [N] hearts used`).
  - Baseline initialization safely preserved all existing XP, hearts, and progress for Adriana, Vanessa, and Silvia with zero disruption.

---

## [2026-10-22] - Pedagogical Upgrades: Deductive Elimination, Practice-to-Earn & Accuracy Leaderboard (CR-001, CR-002, CR-003)

### Added
- **[CR-001] Deductive Elimination ("Aha!" Discovery Standard):**
  - Updated Unit 7 Lesson 3 ("Jump!" / "Skoči" and "Run!" / "Trči") to use mastered words from earlier units as distractors (*Jabuka*, *Kuća*, *Pas*).
  - Eliminates blind 25% guessing in text-only challenges; children deduce the answer via process-of-elimination.
  - Codified as the pedagogical rule in `docs/CURRICULUM_STANDARDS.md` underpinning all 20 units.
- **[CR-003] Hearts-Used Metric on Leaderboard:**
  - Added `hearts_used` column to `user_progress` and migrated Neon DB.
  - Increment counter automatically on `reduceHearts()` when mistakes occur.
  - Displayed `💔 [N] hearts used` alongside XP under each learner's name on the leaderboard.
  - Seeded initial baseline accuracy: Adriana (4 hearts used), Vanessa (7 hearts used), Silvia (15 hearts used).
- **[CR-002] Practice-to-Earn-a-Heart Engine (Concept A) & Voluntary Practice:**
  - Replaced unmetered "Free Refill" button with "💪 Practice to Earn a Heart (+1 ❤️)".
  - Built dedicated `/lesson/practice` review route with interactive `PracticeQuiz`.
  - Questions dynamically sourced from completed review challenges via `getPracticeLesson()`.
  - Mistakes in practice mode never deduct hearts.
  - Completing the 3 questions awards +1 Heart (capped at 5) and +10 XP via `awardPracticeSessionHeart()`.
  - Enabled voluntary practice: clicking the Heart counter in `UserProgress` anytime when hearts < 5 opens a recharge dialog without requiring the child to fail first.
  - Archived Concepts B and C into `docs/HEARTS_AND_GAMIFICATION.md` roadmap backlog.

### Fixed
- **[BUG-001] ✅ RESOLVED & VERIFIED - Heart Click Inactivity in Lesson Header & Production Deploy Sync:**
  - Resolved issue where clicking the Heart icon at top-right inside an active lesson (`app/lesson/header.tsx`) was a non-interactive static `div`. Converted to an interactive button that displays the Practice Recharge modal (`Need a Heart? Current: X/5 ❤️`) with one-click routing to `/lesson/practice`.
  - Triggered Render deployment synchronization (`dep-dbd315vavr4c73998im0`) so all voluntary practice triggers in `components/user-progress.tsx` and `app/lesson/header.tsx` are live in production.
  - Verified and passed end-to-end testing with active learner Silvia (4 hearts).
- **[BUG-002] ✅ RESOLVED & VERIFIED - Incorrect Option Mapping in Unit 3 Lesson 4 ("Little cat" -> "Konj"):**
  - **Symptom:** In the Practice Review mini-game (`/lesson/practice`), the question `"Little cat"` required the incorrect answer `"Konj"` (Horse) instead of `"Mala mačka"`.
  - **Root Cause:** In Unit 3 Lesson 4 (Boss Quest), challenges 3 through 6 had their option sets circularly offset during initial coordinate assignment in `scripts/refine-units-1-5.ts`, misaligning questions for "Horse", "Big dog", "Little cat", and "Good dog".
  - **Fix:** Realigned challenges 3, 4, 5, and 6 in the database (`scripts/fix-bug-u3l4.ts`) and seed script (`scripts/refine-units-1-5.ts`):
    - Ch 3: `"Which one of these is 'Horse'?"` -> `Konj` (T)
    - Ch 4: `""Big dog""` -> `Veliki pas` (T)
    - Ch 5: `""Little cat""` -> `Mala mačka` (T)
    - Ch 6: `""Good dog""` -> `Dobar pas` (T)
  - Verified with 0 violations in curriculum audit tool.
- **[BUG-003] ✅ RESOLVED & VERIFIED - Bread Question Incorrectly Requiring "Čokolada" & Unit 3/4 Alignment:**
  - **Symptom:** In Unit 5 Lesson 2 Challenge 4, the question `"Bread"` marked `"Čokolada"` (Chocolate) as correct instead of `"Kruh"` (Bread).
  - **Root Cause:** Coordinate assignment in `scripts/refine-units-1-5.ts` assigned `correct: true` to option 1 (`Čokolada`) instead of option 3 (`Kruh`). Semantic dictionary audit also identified and corrected question-option offsets in Unit 3 Lesson 2 (Duck / Pig) and Unit 4 Lesson 4 (Blue / One / Ten).
  - **Fix:** Realigned options across Unit 5 L2, Unit 3 L2, and Unit 4 L4 in Neon database (`scripts/fix-all-mismatched-challenges.ts`) and updated `scripts/refine-units-1-5.ts`:
    - Unit 5 L2 Ch 4: `"Bread"` -> `Kruh` (T) vs `Čokolada`, `Sladoled`, `Jabuka`
    - Unit 3 L2 Ch 3: `"the duck"` -> `Patka` (T)
    - Unit 3 L2 Ch 4: `"Pig"` -> `Svinja` (T)
    - Unit 4 L4 Ch 4: `"Blue"` -> `Plava` (T)
    - Unit 4 L4 Ch 5: `"One"` -> `Jedan` (T)
    - Unit 4 L4 Ch 6: `"Ten"` -> `Deset` (T)
  - Full automated semantic scan across all 359 challenges confirms 0 remaining semantic mismatches.

---

## [2026-10-22] - Stage 4 Deployment, Visual Scaffolding & Leaderboard Governance

### Added
- **Stage 4 Curriculum (Units 16–20):**
  - Unit 16: *U školi i učionici* (School & Learning)
  - Unit 17: *Priroda i divlje životinje* (Wild Nature & Animals)
  - Unit 18: *Putovanje i prijevoz* (Travel, Ferries & Adventure)
  - Unit 19: *U kuhinji: Kuhanje i obitelj* (Cooking & Family Kitchen)
  - Unit 20: *Hrvatski blagdani i rođendan* (Birthdays & Celebrations)
  - 20 new lessons (including 5 new Boss Quests with Golden Trophy Crown).
  - 90 new challenges (all 4-option 2×2 grid).
- **144 High-Resolution Vector Illustrations:**
  - Added clean open-source vector SVGs in `public/*.svg` covering toys, animals, food, vehicles, nature, clothes, and body parts.
- **76 New Croatian Neural MP3s:**
  - Full voiceover with `hr-HR-GabrijelaNeural` for all Stage 4 phrases.
- **Progressive Scaffolding Fading Standard:**
  - Enforced image presence on Lesson 1 discoveries only; removed images from Lessons 2, 3, and 4 (Super Izazov) to test true retention.
- **Kids-Only Leaderboard Privacy:**
  - Filtered test accounts (`phil`, `J`) from the leaderboard.
  - Positioned Silvia (890 XP) in 3rd place behind Vanessa (910 XP) and Adriana (930 XP).
- **Living Documentation & Governance Suite (`docs/`):**
  - Added `docs/GOVERNANCE.md`, `docs/CURRICULUM_STANDARDS.md`, `docs/HEARTS_AND_GAMIFICATION.md`, `docs/ARCHITECTURE.md`, and `docs/CHANGELOG.md`.

---

## [2026-10-21] - Stage 3 Curriculum & Quality Standards Refinement

### Added
- **Stage 3 Curriculum (Units 11–15):** Daily Verbs, Town/Park, Prepositions, Bakery/Store, Sports/Celebrations.
- **Automated Option Auditor:** `scripts/audit-options.ts` checking for symmetry and 4 options.
- **Viewport Auto-Scroll:** Smooth scrolling to active lesson node `#current-lesson`.
- **Sliding-Scale Quests:** Milestone goals up to 10,000 XP with 3-tier sliding window.

---

## [2026-10-20] - Platform Launch & Base Architecture

### Added
- Dedicated Croatian-first platform deployment on Render (`twolingo.onrender.com`).
- Initial Units 1–10 (Greetings, Family, Animals, Numbers/Colors, Food, House, Body, Summer, Clothes, Weather).
- Neon Postgres schema setup with Drizzle ORM.
- Clerk authentication with kid profiles.
