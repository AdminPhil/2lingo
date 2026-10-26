---
name: ux-spike
description: >-
  Perform a critical UX/UI research spike on any webpage or route in the application,
  produce a structured Research Spike Markdown artifact (architecture diagrams, prioritized
  friction points, before/after comparison, and proposed Change Request breakdown), AND
  generate an interactive Generative UI HTML mockup artifact showing the prospective redesign
  before writing production code. Use when the user asks for a "research spike", "UX audit",
  "UI critique", or wants to evaluate and prototype improvements to a page or screen.
---

# /ux-spike: Critical Webpage UX/UI Research Spike & Interactive Redesign Mockup

Use this skill whenever the user asks to perform a **research spike**, **critical UX/UI review**, or **usability audit** on a webpage, route, or feature in the application.

This skill produces **two paired deliverables** in `<appDataDir>/brain/<conversation-id>/` without modifying production application code:
1. **The Research Spike Report Artifact (`research_spike_<slug>.md`)** — A deep-dive architectural and UX critique with Mermaid flowcharts, severity-ranked friction points, a Before/After matrix, and a ready-to-execute Change Request (`CR-XXX`) specification.
2. **The Interactive Prospective Redesign Mockup (`mockup_<slug>_redesign.html`)** — A self-contained, clickable Generative UI prototype built with the allowlisted Tailwind CDN that lets the user toggle between the **Current State (Before)** and the **Proposed Redesign (After)** and click through the new navigation/tabs.

---

## Execution Workflow

### Step 1: Inspect the Target Route & Component Tree
1. Map the target URL or page name (e.g., `/admin`, `/learn`, `/leaderboard`, `/lesson`, or `/` marketing page) to its Next.js App Router source in `app/` and child components in `components/`.
2. Read the page file and all child components rendered on that route to measure:
   - **Vertical Scroll Depth & Section Count:** How many distinct blocks are stacked vertically? Are primary daily tasks buried below secondary/onboarding blocks?
   - **Information Redundancy:** Are invite codes, CTAs, or navigation links repeated multiple times across the same viewport?
   - **Dead / Non-Interactive Elements:** Do any cards look clickable (hover states, borders) without actually doing anything?
   - **Persona & State Adaptation:** How does the page behave for a brand-new user (`0` items/learners/mistakes) vs. a returning power user (`> 0` items)? Are empty states missing?
   - **Copy & Jargon Hygiene:** Is internal ticket jargon (e.g., `"CR-012 Live"`), inaccurate unit labels (`"pts"` vs `"challenges"`), or hardcoded single-family copy leaking into the UI?
   - **Multi-Viewport Ergonomics:** How does the layout behave on Desktop (`1280×800`), iPad Safari (`810×1080`), and Mobile (`390×844`)?

---

### Step 2: Author Deliverable #1 — The Research Spike Artifact (`research_spike_<slug>.md`)
Create `research_spike_<slug>.md` in the conversation artifact directory (`UserFacing: true`, `RequestFeedback: false`) containing:
1. **Executive Summary & Current Scroll/Hierarchy Diagram:**
   - A `mermaid` flowchart (`flowchart TD`) illustrating the current component stack and highlighting any UX inversions (e.g., primary daily actions buried at the bottom).
2. **Prioritized UX/UI Friction Points (`🔴 High`, `🟠 Medium`, `🟡 Polish`):**
   - Link directly to exact source files and line ranges (`[file.tsx](file:///.../file.tsx#L10-L25)`).
   - For each finding, state **The Problem** and **The Fix**.
3. **Proposed Redesign Architecture:**
   - A `mermaid` flowchart (`flowchart TD`) showing the streamlined information architecture (e.g., Compact Header + KPI Strip + Interactive Workspace Tabs or Progressive Disclosure).
4. **Before vs. After Comparison Matrix:**
   - A Markdown table comparing Page Height, Time-to-Primary-Action, Redundancy, Empty States, and Persona Adaptability.
5. **Actionable Change Request Breakdown:**
   - Query `docs/REGISTRY.md` (or run `npx tsx scripts/registry-tool.ts next-cr` if available) to identify the next sequential `CR-XXX` ID and draft the exact scope ready for `/cr-run` or `/cr-queue`.

---

### Step 3: Author Deliverable #2 — The Interactive Redesign Mockup (`mockup_<slug>_redesign.html`)
Create a self-contained `.html` file (`mockup_<slug>_redesign.html`) in the conversation artifact directory (`UserFacing: true`, `RequestFeedback: true`) following the **Generative UI** standard:
1. **Include the Allowlisted Tailwind Script:**
   ```html
   <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
   ```
2. **Minimum Font Floor:** Never use sub-12px font sizes (`text-xs` / `12px` minimum floor).
3. **Interactive Features Required in Every UX Spike Mockup:**
   - **Top Perspective Bar:** A sticky comparison bar at the top of the prototype allowing the user to:
     - Switch between **`✨ Proposed Redesign (Interactive)`** and **`⚠️ Current Layout (Annotated Map)`**
     - Toggle **Persona State** (e.g., `Returning Family (3 Learners)` vs. `Brand-New Parent (0 Learners — Empty State)` vs. `Classroom Teacher (24 Students)`)
   - **Working Interactive Controls:** Clickable workspace tabs, working Pod Switcher dropdown, interactive modal previews or inline expandable sections, and 1-click Copy feedback so the user can genuinely test the proposed navigation flow.

---

### Step 4: Present Findings & Next-Step Gate
- Do **NOT** modify production application code during `/ux-spike`.
- Point the user to both artifacts (`research_spike_<slug>.md` and `mockup_<slug>_redesign.html`) without repeating the full report in chat.
- Offer the standard 3-choice handoff:
  1. **Execute immediately (`/cr-run CR-XXX`)**
  2. **Refine the mockup (`/cr-mockup`)**
  3. **Queue to backlog (`/cr-queue CR-XXX`)**
