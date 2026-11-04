import asyncio
import os
import sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "hr")
VOICE = "hr-HR-GabrijelaNeural"

# All single words and phrases for World 7: Zagorje Castles (Units 31–35)
AUDIO_MAP = {
    # Unit 31: Vrata dvorca (The Castle Gates)
    "dvorac": "Dvorac",
    "kula": "Kula",
    "kljuc": "Ključ",
    "otvoriti": "Otvoriti",
    "uci": "Ući",
    "veliki_dvorac": "Veliki dvorac",
    "stara_kula": "Stara kula",
    "zlatni_kljuc": "Zlatni ključ",
    "otvaram_vrata": "Otvaram vrata.",
    "ulazimo_u_dvorac": "Ulazimo u dvorac.",
    "prelazimo_preko_mosta": "Prelazimo preko mosta.",
    "vidim_visoku_kulu": "Vidim visoku kulu.",
    "dvorac_trakoscan_je_prekrasan": "Dvorac Trakošćan je prekrasan.",
    "otvaram_teska_vrata_kljucem": "Otvaram teška vrata ključem.",

    # Unit 32: Vitezovi i legende (Knights & Legends of Zagorje)
    "vitez": "Vitez",
    "stit": "Štit",
    "mac": "Mač",
    "zastava": "Zastava",
    "cuvati": "Čuvati",
    "braniti": "Braniti",
    "hrabri_vitez": "Hrabri vitez",
    "sjajni_mac": "Sjajni mač",
    "hrvatska_zastava": "Hrvatska zastava",
    "vitez_cuva_dvorac": "Vitez čuva dvorac.",
    "hrabri_vitez_nosi_stit": "Hrabri vitez nosi štit.",
    "zastava_se_vijori_na_kuli": "Zastava se vijori na kuli.",
    "slusamo_staru_legendu_o_vitezu": "Slušamo staru legendu o vitezu.",

    # Unit 33: Kroz dvorac: Lijevo i desno (Directions & Castle Maze)
    "lijevo": "Lijevo",
    "desno": "Desno",
    "ravno": "Ravno",
    "gore": "Gore",
    "skrenuti": "Skrenuti",
    "traziti": "Tražiti",
    "skreni_lijevo": "Skreni lijevo.",
    "skreni_desno": "Skreni desno.",
    "idi_ravno": "Idi ravno.",
    "penjemo_se_gore": "Penjemo se gore.",
    "gdje_je_kula": "Gdje je kula?",
    "gdje_je_dvorac": "Gdje je dvorac?",
    "dvorac_je_blizu": "Dvorac je blizu.",
    "kula_je_daleko": "Kula je daleko.",
    "idemo_ravno_pa_desno": "Idemo ravno pa desno.",
    "trazimo_tajni_prolaz": "Tražimo tajni prolaz.",

    # Unit 34: Drvene igračke i licitari (Traditional Zagorje Folk Crafts)
    "igracka": "Igračka",
    "drvo": "Drvo",
    "konjic": "Konjić",
    "srce": "Srce",
    "bojati": "Bojati",
    "darovati": "Darovati",
    "drveni_konjic": "Drveni konjić",
    "crveno_srce": "Crveno srce",
    "drvena_igracka": "Drvena igračka",
    "bojamo_drvenog_konjica": "Bojamo drvenog konjića.",
    "darujem_slatko_licitarsko_srce": "Darujem slatko licitarsko srce.",
    "majstor_izraduje_drvene_igracke": "Majstor izrađuje drvene igračke.",
    "trznica_je_puna_sarenih_igracaka": "Tržnica je puna šarenih igračaka.",

    # Unit 35: Kraljevska gozba (The Banquet Capstone & Past Tense Perfekt)
    "gozba": "Gozba",
    "kruna": "Kruna",
    "zlatna_kruna": "Zlatna kruna",
    "kraljevska_gozba": "Kraljevska gozba",
    "bili_smo": "Bili smo.",
    "vidjeli_smo": "Vidjeli smo.",
    "isli_smo": "Išli smo.",
    "pjevali_smo": "Pjevali smo.",
    "bili_smo_u_dvorcu": "Bili smo u dvorcu.",
    "vidjeli_smo_hrabrog_viteza": "Vidjeli smo hrabrog viteza.",
    "isli_smo_u_veliku_dvoranu": "Išli smo u veliku dvoranu.",
    "zajedno_smo_pjevali_pjesme": "Zajedno smo pjevali pjesme.",
    "kralj_nosi_sjajnu_krunu": "Kralj nosi sjajnu krunu.",
    "velika_gozba_je_na_stolu": "Velika gozba je na stolu.",
    # Super Izazov Capstone sentences (Symmetric ending in !)
    "cestitamo_zavrsili_ste_sedmi_svijet": "Čestitamo, završili ste sedmi svijet!",
    "posjetili_smo_dvorce_zagorja": "Posjetili smo dvorce Zagorja.",
    "naucili_smo_vazne_hrvatske_rijeci": "Naučili smo važne hrvatske riječi!",
    "ponosno_nastavljamo_nase_putovanje": "Ponosno nastavljamo naše putovanje!",
}

async def generate_file(filename: str, text: str):
    filepath = os.path.join(OUTPUT_DIR, f"{filename}.mp3")
    if os.path.exists(filepath):
        print(f"Skipping existing: {filename}.mp3")
        return
    print(f"Generating: {filename}.mp3 -> '{text}'")
    communicate = edge_tts.Communicate(text, VOICE, rate="-5%")
    await communicate.save(filepath)

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    tasks = [generate_file(fn, txt) for fn, txt in AUDIO_MAP.items()]
    await asyncio.gather(*tasks)
    print("World 7 audio synthesis complete!")

if __name__ == "__main__":
    asyncio.run(main())
