import asyncio
import os
import sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "hr")
VOICE = "hr-HR-GabrijelaNeural"

PHRASES = {
    # Unit 16: U školi i učionici (At School & Learning)
    "skola": "Škola",
    "olovka": "Olovka",
    "biljeznica": "Bilježnica",
    "torba": "Torba",
    "uciteljica": "Učiteljica",
    "prijatelj": "Prijatelj",
    "razred": "Razred",
    "pisem": "Pišem",
    "idemo_u_skolu": "Idemo u školu",
    "imam_olovku": "Imam olovku",
    "moj_prijatelj": "Moj prijatelj",
    "pisem_i_citam": "Pišem i čitam",
    "imam_knjigu": "Imam knjigu",
    "velika_skola": "Velika škola",
    "nova_torba": "Nova torba",

    # Unit 17: Priroda i divlje životinje (Wild Nature & Animals)
    "suma": "Šuma",
    "planina": "Planina",
    "rijeka": "Rijeka",
    "kamen": "Kamen",
    "medvjed": "Medvjed",
    "vuk": "Vuk",
    "jelen": "Jelen",
    "orao": "Orao",
    "medvjed_u_sumi": "Medvjed u šumi",
    "visoka_planina": "Visoka planina",
    "orao_leti_gore": "Orao leti gore",
    "bistra_rijeka": "Bistra rijeka",
    "brzi_vuk": "Brzi vuk",
    "mali_jelen": "Mali jelen",

    # Unit 18: Putovanje i prijevoz (Travel, Ferries & Adventure)
    "vlak": "Vlak",
    "avion": "Avion",
    "trajekt": "Trajekt",
    "autobus": "Autobus",
    "karta": "Karta",
    "kofer": "Kofer",
    "kolodvor": "Kolodvor",
    "putujemo": "Putujemo",
    "trajekt_ide_na_otok": "Trajekt ide na otok",
    "putujemo_vlakom": "Putujemo vlakom",
    "gdje_je_moja_karta": "Gdje je moja karta",
    "avion_leti_visoko": "Avion leti visoko",
    "veliki_kofer": "Veliki kofer",
    "brzi_vlak": "Brzi vlak",

    # Unit 19: U kuhinji: Kuhanje i obitelj (Cooking & Family Kitchen)
    "kuhinja": "Kuhinja",
    "tanjur": "Tanjur",
    "zlica": "Žlica",
    "vilica": "Vilica",
    "juha": "Juha",
    "rucak": "Ručak",
    "dorucak": "Doručak",
    "kuham": "Kuham",
    "mama_kuha_juhu": "Mama kuha juhu",
    "topla_juha_na_stolu": "Topla juha na stolu",
    "dobar_tek": "Dobar tek",
    "jedem_rucak": "Jedem ručak",
    "jedem_dorucak": "Jedem doručak",
    "fina_juha": "Fina juha",

    # Unit 20: Hrvatski blagdani i rođendan (Birthdays & Celebrations)
    "rodendan": "Rođendan",
    "torta": "Torta",
    "poklon": "Poklon",
    "svjecice": "Svjećice",
    "cestitam": "Čestitam",
    "ples": "Ples",
    "prijatelji": "Prijatelji",
    "balon": "Balon",
    "sretan_rodendan": "Sretan rođendan",
    "puhni_u_svjecice": "Puhni u svjećice",
    "hvala_na_poklonu": "Hvala na poklonu",
    "slatka_torta": "Slatka torta",
    "veliki_balon": "Veliki balon",
    "lijepi_poklon": "Lijepi poklon",
}

async def generate_audio():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating {len(PHRASES)} Croatian audio files with voice: {VOICE} for Units 16-20...")

    count = 0
    for slug, text in PHRASES.items():
        output_file = os.path.join(OUTPUT_DIR, f"{slug}.mp3")
        communicate = edge_tts.Communicate(text, VOICE, rate="-5%")
        await communicate.save(output_file)
        count += 1
        print(f"[{count}/{len(PHRASES)}] Generated {slug}.mp3 ({text})")

    print(f"\nAll {len(PHRASES)} audio files successfully generated in {OUTPUT_DIR}!")

if __name__ == "__main__":
    asyncio.run(generate_audio())
