---
name: cr-queue
description: >-
  Queue a Change Request to the backlog without modifying application code. Assigns the next CR ID,
  authors a specification artifact with acceptance criteria, logs the item as '⏳ Queued' in docs/REGISTRY.md,
  and stops without deploying. Use when the user wants to log an idea or queue work for later.
---

# /cr-queue: Backlog Change Request Ingestion

Use this skill when the user wants to log, queue, or backlog a Change Request without implementing it right now.

## Execution Workflow

1. **Assign Next Sequential ID:**
   Run `npx tsx scripts/registry-tool.ts next-cr` to determine the next ID (e.g. `CR-053`).

2. **Author Specification Artifact:**
   Create an artifact in `.gemini/antigravity/brain/change_request_crXXX_<title>.md`:
   - Summary and user rationale
   - Proposed architecture or UI changes
   - Detailed Acceptance Criteria
   - Risk Assessment and Learner Safety confirmation
   - Mark status as: `📋 QUEUED / BACKLOG`

3. **Register in Master Registry:**
   - Append to Part 1 of [`docs/REGISTRY.md`](../../docs/REGISTRY.md):
     `| **CR-XXX** | <Category> | **<Title>:** <Summary> | YYYY-MM-DD | ⏳ Queued |`
   - Increment the open CR count in the header.

4. **Zero Code Modification:**
   - Do NOT edit application source code.
   - Do NOT commit or trigger any deployment.
   - Present the assigned ticket number, brief, and acceptance criteria to the user for future pickup.
