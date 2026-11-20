import asyncio
import json
import os
import sys
import edge_tts

VOICE = "hr-HR-GabrijelaNeural"
MANIFEST_PATH = os.path.join(os.path.dirname(__file__), "v2-missing-audio.json")
AUDIO_DIR = os.path.join(os.getcwd(), "public", "audio", "hr")


async def synthesize_one(sem: asyncio.Semaphore, slug: str, text: str):
    out_path = os.path.join(AUDIO_DIR, f"{slug}.mp3")
    if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
        return False

    async with sem:
        for attempt in range(1, 5):
            try:
                communicate = edge_tts.Communicate(text, VOICE)
                await communicate.save(out_path)
                if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
                    return True
            except Exception as e:
                print(f"  Retry {attempt} failed for {slug}: {e}", file=sys.stderr)
                await asyncio.sleep(1.5 * attempt)
        raise RuntimeError(f"Failed to synthesize {slug}.mp3")


async def main():
    if not os.path.exists(MANIFEST_PATH):
        print("No v2-missing-audio.json manifest found; nothing to synthesize.")
        return

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        items = json.load(f)

    os.makedirs(AUDIO_DIR, exist_ok=True)
    sem = asyncio.Semaphore(8)
    total = len(items)
    done = 0
    generated = 0

    async def worker(slug: str, text: str):
        nonlocal done, generated
        created = await synthesize_one(sem, slug, text)
        done += 1
        if created:
            generated += 1
        if done % 50 == 0 or done == total:
            print(f"  Progress: {done}/{total} processed ({generated} newly synthesized)", flush=True)

    await asyncio.gather(*(worker(slug, text) for slug, text in items.items()))
    print(f"\n✅ v2 Audio synthesis complete! Newly generated: {generated} / {total} clips.")


if __name__ == "__main__":
    asyncio.run(main())
