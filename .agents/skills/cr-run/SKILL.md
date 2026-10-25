---
name: cr-run
description: >-
  Execute a Change Request immediately. Triages scope, assigns the next sequential CR ID,
  implements code changes, runs typechecks & curriculum audit, updates docs/REGISTRY.md and
  docs/CHANGELOG.md, commits, pushes to main, and triggers Render deployment. Use when the user
  wants to implement and ship a feature or change right away.
---

# /cr-run: Instant Change Request Execution

Use this skill when the user requests an immediate change or uses `/cr-run`.

## Execution Workflow

1. **Assign Next Sequential ID:**
   Run `npx tsx scripts/registry-tool.ts next-cr` to determine the next ID (e.g. `CR-053`).

2. **Triage Scope & Invariants:**
   - Review affected files.
   - Verify safety invariants: NEVER drop or modify live learner progress (`Silvia`, `Adriana`, `Vanessa`), NEVER re-add `/shop` to navigation.

3. **Implement Code Changes:**
   Edit or create the necessary application files.

4. **Verify Quality & Safety:**
   - Run typecheck: `cmd /c npx tsc --noEmit`.
   - Run curriculum audit if challenges were touched: `cmd /c npx tsx scripts/audit-curriculum-rules.ts`.
   - If UI changes were made, generate a visual mockup or Generative UI artifact.

5. **Update Living Documentation:**
   - Append to [`docs/CHANGELOG.md`](../../docs/CHANGELOG.md) with ticket details.
   - Append to [`docs/REGISTRY.md`](../../docs/REGISTRY.md) with status `✅ Verified` and increment the total CR count.
   - Author a change request artifact in `.gemini/antigravity/brain/`.

6. **Ship & Deploy (Zero Polling):**
   - Stage and commit with message: `feat(scope): <description> (CR-XXX)`.
   - Push to `origin/main`.
   - Trigger Render deployment asynchronously via API (`POST /v1/services/.../deploys`) and return immediately without polling.
