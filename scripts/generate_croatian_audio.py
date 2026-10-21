import asyncio
import os
import sys
import edge_tts

# Ensure utf-8 stdout on Windows
sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "hr")
VOICE = "hr-HR-GabrijelaNeural"

PHRASES = {
    # Unit 1: Greetings & Polite Words
    "bok": "Bok",
    "dovidenja": "Doviđenja",
    "hvala": "Hvala",
    "dobar_dan": "Dobar dan",
    "laku_noc": "Laku noć",
    "molim": "Molim",
    "hvala_lijepa": "Hvala lijepa",
    "oprosti": "Oprosti",
    "da": "Da",
    "ne": "Ne",
    "kako_si": "Kako si?",
    "dobro_sam": "Dobro sam!",

    # Unit 2: Family & People
    "mama": "Mama",
    "tata": "Tata",
    "baka": "Baka",
    "djed": "Djed",
    "djecak": "Dječak",
    "djevojcica": "Djevojčica",
    "muskarac": "Muškarac",
    "zena": "Žena",
    "brat": "Brat",
    "sestra": "Sestra",
    "beba": "Beba",
    "to_je_mama": "To je mama",
    "to_je_tata": "To je tata",
    "bok_mama": "Bok mama",
    "volim_te": "Volim te",

    # Unit 3: Animals
    "pas": "Pas",
    "macka": "Mačka",
    "riba": "Riba",
    "ptica": "Ptica",
    "krava": "Krava",
    "konj": "Konj",
    "patka": "Patka",
    "svinja": "Svinja",
    "veliki_pas": "Veliki pas",
    "mala_macka": "Mala mačka",
    "dobar_pas": "Dobar pas",
    "dobar_konj": "Dobar konj",
    "dobra_ptica": "Dobra ptica",
    "zao_pas": "Zao pas",
    "velika_krava": "Velika krava",

    # Unit 4: Colors & Numbers
    "crvena": "Crvena",
    "plava": "Plava",
    "zuta": "Žuta",
    "zelena": "Zelena",
    "bijela": "Bijela",
    "crna": "Crna",
    "jedan": "Jedan",
    "dva": "Dva",
    "tri": "Tri",
    "cetiri": "Četiri",
    "pet": "Pet",
    "sest": "Šest",
    "sedam": "Sedam",
    "osam": "Osam",
    "devet": "Devet",
    "deset": "Deset",

    # Unit 5: Food & Snacks
    "jabuka": "Jabuka",
    "banana": "Banana",
    "sladoled": "Sladoled",
    "cokolada": "Čokolada",
    "voda": "Voda",
    "mlijeko": "Mlijeko",
    "sok": "Sok",
    "kruh": "Kruh",
    "gladan_sam": "Gladan sam",
    "mogu_li_dobiti_sladoled_molim": "Mogu li dobiti sladoled, molim?",
    "volim_te_mama": "Volim te mama",
    "jako_je_ukusno": "Jako je ukusno!",
    "ne_hvala": "Ne hvala",
}

async def generate_audio():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating {len(PHRASES)} Croatian audio files with voice: {VOICE}...")

    count = 0
    for slug, text in PHRASES.items():
        output_file = os.path.join(OUTPUT_DIR, f"{slug}.mp3")
        communicate = edge_tts.Communicate(text, VOICE, rate="-5%")
        await communicate.save(output_file)
        count += 1
        print(f"[{count}/{len(PHRASES)}] Generated {slug}.mp3")

    print(f"\nAll {len(PHRASES)} audio files successfully generated in {OUTPUT_DIR}!")

if __name__ == "__main__":
    asyncio.run(generate_audio())
