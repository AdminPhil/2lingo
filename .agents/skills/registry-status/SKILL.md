---
name: registry-status
description: >-
  Query the status of all completed and open Change Requests, Bug tickets, active learner accounts,
  and curriculum integrity rules. Use when the user asks what tickets are open or wants a project health summary.
---

# /registry-status: Master Registry & Health Overview

Use this skill when the user asks about open change requests, unresolved bugs, learner progress, or system status.

## Execution Workflow

1. **Query Registry Tool:**
   Run `npx tsx scripts/registry-tool.ts status` to get exact counts and next ticket IDs.

2. **Scan for Queued Items:**
   Read [`docs/REGISTRY.md`](../../docs/REGISTRY.md) for any items with status `⏳ Queued` or `📋 Open`.

3. **Verify Learner Health:**
   Ensure all active learner accounts (`Silvia`, `Adriana`, `Vanessa`) retain intact streaks, hearts, and XP.

4. **Present Summary:**
   Output a clean, concise markdown table of open items, recent completions, and ready actions.
