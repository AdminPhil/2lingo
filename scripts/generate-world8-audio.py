import asyncio
import os
import sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "hr")
VOICE = "hr-HR-GabrijelaNeural"

# All single words and phrases for World 8: Nikola Tesla & Astronomy (Units 36–40)
AUDIO_MAP = {
    # Unit 36: Nikola Tesla i svjetlost (The Spark of Invention)
    "svjetlost": "Svjetlost",
    "iskra": "Iskra",
    "struja": "Struja",
    "izum": "Izum",
    "svijetliti": "Svijetliti",
    "paliti": "Paliti",
    "svijetla_svjetlost": "Svijetla svjetlost",
    "mala_iskra": "Mala iskra",
    "elektricna_struja": "Električna struja",
    "vazni_izum": "Važni izum",
    "lampa_svijetli": "Lampa svijetli.",
    "palim_svjetlo": "Palim svjetlo.",
    "tesla_stvara_iskre": "Tesla stvara iskre.",
    "struja_tece_kroz_zicu": "Struja teče kroz žicu.",
    "nikola_tesla_je_slavni_izumitelj": "Nikola Tesla je slavni izumitelj.",
    "svjetlost_obasjava_sobu": "Svjetlost obasjava sobu.",

    # Unit 37: Noćno nebo i zvijezde (The Night Sky & Stars)
    "zvijezda": "Zvijezda",
    "nebo": "Nebo",
    "mjesec": "Mjesec",
    "sjaj": "Sjaj",
    "sjajna_zvijezda": "Sjajna zvijezda",
    "tamno_nebo": "Tamno nebo",
    "puni_mjesec": "Puni mjesec",
    "zlatni_sjaj": "Zlatni sjaj",
    "zvijezde_sjaje": "Zvijezde sjaje.",
    "nocno_nebo_je_tamno": "Noćno nebo je tamno.",
    "gledam_u_nebo": "Gledam u nebo.",
    "mjesec_sja_nocu": "Mjesec sja noću.",
    "tisucu_sjajnih_zvijezda": "Tisuću sjajnih zvijezda.",
    "nebo_je_puno_zvijezda": "Nebo je puno zvijezda.",

    # Unit 38: Zvjezdarnica i planeti (The Observatory & Planets)
    "teleskop": "Teleskop",
    "planet": "Planet",
    "svemir": "Svemir",
    "kupola": "Kupola",
    "promatrati": "Promatrati",
    "otkriti": "Otkriti",
    "veliki_teleskop": "Veliki teleskop",
    "daleki_planet": "Daleki planet",
    "beskrajni_svemir": "Beskrajni svemir",
    "bijela_kupola": "Bijela kupola",
    "gledam_kroz_teleskop": "Gledam kroz teleskop.",
    "otkrivamo_novi_planet": "Otkrivamo novi planet.",
    "zvjezdarnica_visnjan_je_poznata": "Zvjezdarnica Višnjan je poznata.",
    "kupola_se_otvara": "Kupola se otvara.",
    "promatramo_tajne_svemira": "Promatramo tajne svemira.",

    # Unit 39: Grom, munja i snaga prirode (Thunder & Lightning)
    "munja": "Munja",
    "grom": "Grom",
    "baterija": "Baterija",
    "snaga": "Snaga",
    "snazna_munja": "Snažna munja",
    "glasni_grom": "Glasni grom",
    "puna_baterija": "Puna baterija",
    "velika_snaga": "Velika snaga",
    "munja_obasjava_nebo": "Munja obasjava nebo.",
    "cujemo_glasni_grom": "Čujemo glasni grom.",
    "oluja_dolazi": "Oluja dolazi.",
    "punimo_bateriju": "Punimo bateriju.",
    "priroda_ima_veliku_snagu": "Priroda ima veliku snagu.",
    "tesla_istrazuje_munje": "Tesla istražuje munje.",

    # Unit 40: Izumitelji budućnosti (Future Tense: Futur I Capstone)
    "robot": "Robot",
    "ideja": "Ideja",
    "znanje": "Znanje",
    "buducnost": "Budućnost",
    "pametni_robot": "Pametni robot",
    "dobra_ideja": "Dobra ideja",
    "vazno_znanje": "Važno znanje",
    "svijetla_buducnost": "Svijetla budućnost",
    # Futur I Milestones (1st person plural: -t ćemo)
    "ucit_cemo": "Učit ćemo.",
    "gledat_cemo": "Gledat ćemo.",
    "putovat_cemo": "Putovat ćemo.",
    "izumit_cemo": "Izumit ćemo.",
    "ucit_cemo_o_svemiru": "Učit ćemo o svemiru.",
    "gledat_cemo_zvijezde": "Gledat ćemo zvijezde.",
    "putovat_cemo_u_svemir": "Putovat ćemo u svemir.",
    "izumit_cemo_nove_stvari": "Izumit ćemo nove stvari.",
    # Super Izazov Capstone sentences (Symmetric ending in !)
    "cestitamo_zavrsili_ste_osmi_svijet": "Čestitamo, završili ste osmi svijet!",
    "zajedno_cemo_graditi_bolju_buducnost": "Zajedno ćemo graditi bolju budućnost!",
    "znanje_je_nasa_najveca_snaga": "Znanje je naša najveća snaga!",
    "ponosno_koracamo_kroz_svijet_znanosti": "Ponosno koračamo kroz svijet znanosti!",
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
    print(f"Synthesizing {len(AUDIO_MAP)} audio files for World 8...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for filename, text in AUDIO_MAP.items():
        await generate_file(filename, text)
    print("\nAll World 8 audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
