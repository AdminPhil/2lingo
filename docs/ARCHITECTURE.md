# ⚙️ 2lingo Architecture & Engineering Protocol

---

## 🛠️ Tech Stack & Hosting

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling & UI:** Tailwind CSS, Radix UI primitives, Lucide icons
- **ORM & Database:** Drizzle ORM + Neon Serverless PostgreSQL (`@neondatabase/serverless`)
- **Authentication:** Clerk (`@clerk/nextjs`)
- **Deployment Platform:** Render (`web` service, free tier, continuous deployment on `main`)
- **Live URL:** `https://twolingo.onrender.com`

---

## 🛡️ User Progress Preservation Rule

> **CRITICAL RULE:** Never wipe or drop live user progress (`user_progress`, `challenge_progress`) during curriculum updates or database seeding.

1. **Seed Script Isolation:**
   - Seed scripts must operate on curriculum content (`units`, `lessons`, `challenges`, `challenge_options`) without deleting `user_progress`.
2. **Dynamic Coordinate Lookup:**
   - Never hardcode challenge IDs in refinement scripts. Neon Postgres auto-increment IDs shift across re-seeds. Always lookup by `(unit_order, lesson_order, challenge_order)` coordinates.
3. **Sequence Sync:**
   - Always sync Postgres sequences (`units_id_seq`, `lessons_id_seq`, etc.) after bulk inserts to prevent duplicate key errors.

---

## 📦 Asset Architecture

- **Croatian Neural Audio:** `public/audio/hr/*.mp3` (Generated via Edge TTS `hr-HR-GabrijelaNeural` at `-5%` rate).
- **Kid Vector Illustrations:** `public/*.svg` (Twemoji open-source vector SVGs for clean, high-contrast, scalable display).
- **Card Fallback:** `app/lesson/card.tsx` implements an `onError` handler on Next.js `<Image>`. If any image asset fails to load, the image container silently hides itself and falls back to text + audio.
