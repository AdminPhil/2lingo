---
name: cr-mockup
description: >-
  Prototype and preview UI changes before writing production code. Creates interactive
  Generative UI widgets or high-resolution graphic mockup artifacts for design alignment.
  Use when the user wants to see how a screen or component looks before committing to code.
---

# /cr-mockup: Design Prototyping & Visual Alignment

Use this skill when the user asks for a visual mockup, concept design, or interactive prototype prior to implementation.

## Execution Workflow

1. **Inspect Dimensions & Target Components:**
   Analyze the relevant component file in `components/` and determine exact dimensions or theme requirements.

2. **Generate Interactive Prototype (Generative UI):**
   - Create a self-contained `.html` file in `.gemini/antigravity/brain/` using the allowlisted Tailwind CDN:
     `<script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>`
   - Embed base64 image assets or SVG vectors.
   - Embed into chat using `<agent-embed src="file:///.../preview.html"></agent-embed>`.

3. **Generate Static High-Res Mockup:**
   - Render a high-resolution PNG image in `.gemini/antigravity/brain/` matching target device viewport (e.g. iPad, desktop $1920\times1080$, or exact modal dimensions).

4. **Solicit Design Feedback:**
   Present the interactive preview and static render to the user. Await explicit approval before writing application code.
