# 🚀 CroLingo v2 Staging UAT & Atomic Production Cutover Runbook

> **Branch:** `v2` → `main`  
> **Live Production:** `https://2lingo.onrender.com`  
> **Zero-Loss Guarantee:** 100% of learner XP (`points`), daily `streak`, `hearts`, mascot avatars, `role`, `pods`, `pod_members`, and `pod_reactions` are preserved. Every learner receives an XP-calibrated World checkpoint (`W1/U1`, `W2/U6`, `W3/U11`, `W5/U21`) plus a 1-time welcome banner on `/learn`.

---

## Stage 1: Isolated Staging Preview & Family UAT (~10 min)

1. **Create an Isolated Neon `v2-dev` Branch:**
   - Open [Neon Console](https://console.neon.tech) → select the CroLingo project → **Branches** → **Create Branch**:
     - Branch name: `v2-dev`
     - Parent branch: *Empty / schema-only* (or fork `main` and drop legacy tables before pushing `db/schema.v2.ts`).
   - Copy the `v2-dev` pooled connection string and add to local `.env.local`:
     ```env
     DATABASE_URL_V2="postgresql://..."
     ```

2. **Run the One-Command v2 Bootstrapper (Safety-Locked to `DATABASE_URL_V2`):**
   ```powershell
   npm run v2:bootstrap
   ```
   This automatically executes:
   - `npm run v2:validate` (`0` schema/asset errors across `5,329` refs)
   - `drizzle-kit push:pg --config=drizzle.config.v2.ts --force`
   - `npm run v2:compile` (`12 Worlds / 60 Units / 240 Lessons / 1,009 Challenges / 351 Lexemes`)
   - `npm run v2:migrate -- --execute` (`21` learners, `11` pods, `27` memberships, `10` cheers + XP-calibrated checkpoints)
   - Post-bootstrap integrity assertions (`99` `LISTEN`, `88` `BUILD_SENTENCE`, `0` orphans)

3. **Spin Up a Render Staging Preview Service (Optional or Local Preview):**
   - In Render Dashboard, create a Web Service pointing to repo `AdminPhil/2lingo`, branch **`v2`**, with env vars:
     - `DATABASE_URL` = your Neon `v2-dev` connection string
     - `CROLINGO_SCHEMA_VERSION` = `v2`
     - Same Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) and admin IDs/emails.
   - Add the staging preview URL to Clerk's allowed origins if testing on a custom Render URL.

4. **Family UAT Checklist (5-Minute Smoke Test):**
   - [ ] Log in as a learner → see the 1-time **CroLingo v2 Welcome Banner** with exact XP, streak, and World checkpoint; click **Let's Go!** and verify it stays dismissed on refresh.
   - [ ] Switch Level tabs on `/learn` (`Level 1` / `Level 2` / `Level 3`) and confirm instant rendering.
   - [ ] Click your mascot avatar pill in the HUD (`UserProgress`) → pick a new Croatian mascot → save → confirm it updates on `/learn` and `/leaderboard`.
   - [ ] Complete a **Tier 3 `LISTEN`** challenge (W2–W12 L2) and a **Tier 5 `BUILD_SENTENCE`** challenge (W4–W12 L3–L4) and confirm audio playback, heart/XP persistence, and zero Next-button soft-lock.
   - [ ] Open `/admin` → open a learner's **Student Fast Pass Badge** (`StudentBadgeModal`) and **Team QR Sheet** (`TeamQrSheetModal`) → confirm `/qr-login?token=clqr_...` logs in cleanly with camera scan AND leaves the learner's typed password untouched.

---

## Stage 2: Atomic Production Cutover (~10 min window)

1. **Create Safety Backups (Zero-Risk Rollback):**
   - In Neon Console, create a **point-in-time snapshot branch** of live `main` named `v1-pre-cutover-backup` (retain for 30 days).
   - Tag Git `main` before merging:
     ```powershell
     git checkout main
     git pull origin main
     git tag -a v1-legacy -m "CroLingo v1 final pre-v2 cutover snapshot"
     git push origin v1-legacy
     ```

2. **Create Fresh Cutover Neon Branch (`v2-prod`) & Migrate Latest Live XP:**
   - Create a fresh empty Neon branch named `v2-prod`.
   - Set `DATABASE_URL_V2` in `.env.local` to the `v2-prod` connection string (while `DATABASE_URL` points read-only to live `main` to capture the very latest minute of learner XP & streaks!).
   - Run:
     ```powershell
     npm run v2:bootstrap
     ```
   - Confirm the printed summary shows the exact latest XP totals for every active learner and `0` orphans.

3. **Promote Branch `v2` → `main` & Flip Production Render Env:**
   - Merge `v2` into `main` cleanly:
     ```powershell
     git checkout main
     git merge --no-ff v2 -m "release(v2.0): Promote CroLingo v2 clean-sheet platform to production"
     git push origin main
     ```
   - In Render Dashboard (`2lingo` service → **Environment**):
     - Update `DATABASE_URL` to the `v2-prod` Neon pooled connection string.
     - Add `CROLINGO_SCHEMA_VERSION=v2`.
     - Click **Save Changes** (triggers live deploy of `main`).

4. **Post-Cutover Live Verification (`https://2lingo.onrender.com`):**
   - [ ] Verify `/`, `/learn`, `/leaderboard`, `/quests`, `/admin`, and `/lesson` return HTTP 200.
   - [ ] Verify live leaderboard displays all active learners with 100% preserved XP & streaks.
   - [ ] Complete 1 lesson end-to-end and verify XP increments cleanly.

---

## Stage 3: Instant 1-Click Rollback Procedure (If Ever Needed)

1. In Render Dashboard (`2lingo` → **Environment**): revert `DATABASE_URL` back to the original Neon `main` (or `v1-pre-cutover-backup`) connection string and remove `CROLINGO_SCHEMA_VERSION`.
2. In Render Dashboard (**Deploys**): click **Rollback to this deploy** on the last v1 deploy (or force-deploy Git tag `v1-legacy`).
3. Full recovery time: **< 2 minutes**, zero learner data loss.
