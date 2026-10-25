---
name: bug-fix
description: >-
  Diagnose and fix a bug immediately. Identifies root cause, assigns the next sequential BUG ID,
  implements the fix, runs typechecks, updates docs/REGISTRY.md and docs/CHANGELOG.md,
  commits, pushes to main, and triggers Render deployment. Use when the user reports a bug to fix right away.
---

# /bug-fix: Instant Bug Resolution

Use this skill when the user reports an active bug or defect that requires immediate remediation.

## Execution Workflow

1. **Assign Next Sequential ID:**
   Run `npx tsx scripts/registry-tool.ts next-bug` to determine the next ID (e.g. `BUG-019`).

2. **Root Cause Analysis:**
   Inspect the code, logs, or coordinates to determine why the issue occurred.

3. **Implement Bug Fix:**
   Apply the minimal, surgical fix to correct the issue while preserving all learner invariants.

4. **Verify Quality:**
   - Run typecheck: `cmd /c npx tsc --noEmit`.
   - Run curriculum or data audit if relevant.
   - If visual, produce a comparison mockup showing the fix.

5. **Update Living Documentation:**
   - Append to [`docs/CHANGELOG.md`](../../docs/CHANGELOG.md).
   - Append to Part 2 of [`docs/REGISTRY.md`](../../docs/REGISTRY.md) with status `✅ Resolved` and increment total resolved count.
   - Create a bug report artifact in `.gemini/antigravity/brain/`.

6. **Ship & Deploy (Zero Polling):**
   - Commit with message: `fix(scope): <description> (BUG-XXX)`.
   - Push to `origin/main`.
   - Trigger Render deployment asynchronously and return immediately.
