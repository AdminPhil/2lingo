---
name: bug-queue
description: >-
  Log a bug ticket to the backlog without modifying application code. Assigns the next BUG ID,
  authors a bug ticket artifact with reproduction steps, logs the item as '⏳ Queued' in docs/REGISTRY.md,
  and stops without deploying. Use when the user reports a bug to investigate or fix later.
---

# /bug-queue: Backlog Bug Ticket Ingestion

Use this skill when a user reports a bug that should be documented and prioritized without taking immediate code action.

## Execution Workflow

1. **Assign Next Sequential ID:**
   Run `npx tsx scripts/registry-tool.ts next-bug` to determine the next ID (e.g. `BUG-019`).

2. **Author Bug Ticket Artifact:**
   Create an artifact in `.gemini/antigravity/brain/bug_ticket_bugXXX_<title>.md`:
   - Observed behavior vs Expected behavior
   - Severity rating (Low, Medium, High, Critical)
   - Steps to reproduce
   - Initial hypothesis on root cause
   - Mark status as: `📋 QUEUED / UNASSIGNED`

3. **Register in Master Registry:**
   - Append to Part 2 of [`docs/REGISTRY.md`](../../docs/REGISTRY.md):
     `| **BUG-XXX** | <Severity> | **<Title>:** <Description> | <Suspected Cause> | Pending triage | YYYY-MM-DD | ⏳ Queued |`
   - Increment the open bug count in the header.

4. **Zero Code Modification:**
   - Do NOT edit application source code.
   - Do NOT commit or trigger any deployment.
