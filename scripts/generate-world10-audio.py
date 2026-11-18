import asyncio
import os
import sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "hr")
VOICE = "hr-HR-GabrijelaNeural"

# All single words and phrases for World 10: Kvarner & Rijeka (Units 46–50)
AUDIO_MAP = {
    # ==========================================
    # Unit 46: Luka Rijeka i brodovi (Rijeka Port & Ships)
    # ==========================================
    "luka": "Luka",
    "brod": "Brod",
    "sidro": "Sidro",
    "svjetionik": "Svjetionik",
    "velika_luka": "Velika luka",
    "bijeli_brod": "Bijeli brod",
    "tesko_sidro": "Teško sidro",
    "visoki_svjetionik": "Visoki svjetionik",
    "brod_ulazi_u_luku": "Brod ulazi u luku.",
    "kapetan_spusta_sidro": "Kapetan spušta sidro.",
    "svjetionik_svijetli_nocu": "Svjetionik svijetli noću.",
    "valovi_udaraju_o_obalu": "Valovi udaraju o obalu.",
    "mornari_cekaju_na_brodu": "Mornari čekaju na brodu.",
    "teretni_brod_plovi_kvarnerom": "Teretni brod plovi Kvarnerom.",
    "rijeka_ima_veliku_luku": "Rijeka ima veliku luku.",
    "jako_svjetlo_vodi_brodove": "Jako svjetlo vodi brodove.",
    "putnici_izlaze_na_kopno": "Putnici izlaze na kopno.",
    "sidro_drzi_brod_mirno": "Sidro drži brod mirno.",
    "plovimo_prema_otoku_ujutro": "Plovimo prema otoku ujutro.",
    "vjetar_puse_s_jadrana": "Vjetar puše s Jadrana.",

    # ==========================================
    # Unit 47: Trsatska gradina i stube (Trsat Castle & Stairs)
    # ==========================================
    "gradina": "Gradina",
    "stube": "Stube",
    "vidikovac": "Vidikovac",
    "zmaj": "Zmaj",
    "stara_gradina": "Stara gradina",
    "kamene_stube": "Kamene stube",
    "lijepi_vidikovac": "Lijepi vidikovac",
    "broncani_zmaj": "Brončani zmaj",
    "penjemo_se_uz_stube": "Penjemo se uz stube.",
    "trsatska_gradina_gleda_na_more": "Trsatska gradina gleda na more.",
    "vidimo_cijeli_kvarnerski_zaljev": "Vidimo cijeli Kvarnerski zaljev.",
    "zmaj_cuva_staru_tvrdavu": "Zmaj čuva staru tvrđavu.",
    "put_do_vrha_je_dug": "Put do vrha je dug.",
    "zidine_su_vrlo_visoke": "Zidine su vrlo visoke.",
    "stojimo_na_kamenom_vidikovcu": "Stojimo na kamenom vidikovcu.",
    "stube_vode_prema_gradini": "Stube vode prema gradini.",
    "s_kula_se_vidi_grad": "S kula se vidi grad.",
    "legenda_govori_o_zmaju": "Legenda govori o zmaju.",
    "odmaramo_se_na_vrhu_brda": "Odmaramo se na vrhu brda.",
    "gledamo_zalazak_sunca_nad_rijekom": "Gledamo zalazak sunca nad Rijekom.",

    # ==========================================
    # Unit 48: Opatijska rivijera i kamelije (Opatija Riviera & Camellias)
    # ==========================================
    "setnica": "Šetnica",
    "kamelija": "Kamelija",
    "vila": "Vila",
    "fontana": "Fontana",
    "duga_setnica": "Duga šetnica",
    "ruzicasta_kamelija": "Ružičasta kamelija",
    "stara_vila": "Stara vila",
    "kamena_fontana": "Kamena fontana",
    "setamo_uz_more_navecer": "Šetamo uz more navečer.",
    "kamelija_cvjeta_u_parku": "Kamelija cvjeta u parku.",
    "opatija_je_poznata_po_vilama": "Opatija je poznata po vilama.",
    "voda_tece_iz_fontane": "Voda teče iz fontane.",
    "palme_rastu_uz_obalu": "Palme rastu uz obalu.",
    "miris_mora_osvjezava_zrak": "Miris mora osvježava zrak.",
    "park_je_pun_cvijeca": "Park je pun cvijeća.",
    "slusamo_valove_na_setnici": "Slušamo valove na šetnici.",
    "ljudi_piju_kavu_na_terasi": "Ljudi piju kavu na terasi.",
    "sunce_grije_opatijsku_rivijeru": "Sunce grije opatijsku rivijeru.",
    "stare_lampe_svijetle_uz_put": "Stare lampe svijetle uz put.",
    "cvijet_kamelije_simbol_je_grada": "Cvijet kamelije simbol je grada.",

    # ==========================================
    # Unit 49: Otok Krk i glagoljica (Krk Island & Glagolitic)
    # ==========================================
    "ploca": "Ploča",
    "slovo": "Slovo",
    "maslina": "Maslina",
    "ovca": "Ovca",
    "kamena_ploca": "Kamena ploča",
    "staro_slovo": "Staro slovo",
    "zelena_maslina": "Zelena maslina",
    "bijela_ovca": "Bijela ovca",
    "bascanska_ploca_cuva_povijest": "Bašćanska ploča čuva povijest.",
    "ucimo_stara_glagoljska_slova": "Učimo stara glagoljska slova.",
    "masline_rastu_na_otoku_krku": "Masline rastu na otoku Krku.",
    "ovce_pasu_na_kamenjaru": "Ovce pasu na kamenjaru.",
    "prelazimo_veliki_krcki_most": "Prelazimo veliki Krčki most.",
    "klesari_su_pisali_u_kamenu": "Klesari su pisali u kamenu.",
    "beremo_masline_u_jesen": "Beremo masline u jesen.",
    "maslinovo_ulje_je_zlatno": "Maslinovo ulje je zlatno.",
    "otok_krk_ima_bogatu_bastinu": "Otok Krk ima bogatu baštinu.",
    "stari_zapisi_su_vrlo_vrijedni": "Stari zapisi su vrlo vrijedni.",
    "selo_baska_lezi_uz_plazu": "Selo Baška leži uz plažu.",
    "cuvamo_nasu_pisanu_rijec": "Čuvamo našu pisanu riječ.",

    # ==========================================
    # Unit 50: Riječki karneval i Korzo (Rijeka Carnival & Korzo)
    # ==========================================
    "maska": "Maska",
    "povorka": "Povorka",
    "zvono": "Zvono",
    "bubanj": "Bubanj",
    "sarena_maska": "Šarena maska",
    "velika_povorka": "Velika povorka",
    "glasno_zvono": "Glasno zvono",
    "veliki_bubanj": "Veliki bubanj",
    "karnevalska_povorka_prolazi_korzom": "Karnevalska povorka prolazi Korzom.",
    "svi_nose_sarene_maske": "Svi nose šarene maske.",
    "zvoncari_glasno_zvone_zvonima": "Zvončari glasno zvone zvonima.",
    "bubnjevi_daju_ritam_plesu": "Bubnjevi daju ritam plesu.",
    "grad_slavi_uz_glazbu": "Grad slavi uz glazbu.",
    "publika_pljesce_veselim_maskama": "Publika plješće veselim maskama.",
    "konfeti_padaju_po_ulici": "Konfeti padaju po ulici.",
    "korzo_je_pun_radosti": "Korzo je pun radosti.",
    "tradicionalni_zvoncari_tjeraju_zimu": "Tradicionalni zvončari tjeraju zimu.",
    "plesemo_i_pjevamo_na_karnevalu": "Plešemo i pjevamo na karnevalu.",
    "rijeka_slavi_svoju_tradiciju": "Rijeka slavi svoju tradiciju.",
    "cestitamo_zavrsili_ste_deseti_svijet": "Čestitamo, završili ste deseti svijet!",
}

async def generate_file(filename: str, text: str):
    filepath = os.path.join(OUTPUT_DIR, f"{filename}.mp3")
    if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
        print(f"Skipping existing: {filename}.mp3")
        return
    for attempt in range(1, 5):
        try:
            print(f"Generating: {filename}.mp3 -> '{text}' (attempt {attempt})")
            communicate = edge_tts.Communicate(text, VOICE, rate="-5%")
            await communicate.save(filepath)
            if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
                return
        except Exception as e:
            print(f"  Retryable error on {filename}.mp3: {e}")
            await asyncio.sleep(1.5 * attempt)
    raise RuntimeError(f"Failed to generate {filename}.mp3 after 4 attempts")

async def main():
    print(f"Synthesizing {len(AUDIO_MAP)} audio files for World 10...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for filename, text in AUDIO_MAP.items():
        await generate_file(filename, text)
    print("\nAll World 10 audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
