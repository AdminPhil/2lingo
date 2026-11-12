import asyncio
import os
import sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "hr")
VOICE = "hr-HR-GabrijelaNeural"

# All single words and phrases for World 9: Sinjska Alka & Cetina Canyon (Units 41–45)
AUDIO_MAP = {
    # ==========================================
    # Unit 41: Sinjski vitezovi i konji (The Knights & Noble Steeds)
    # ==========================================
    "konj": "Konj",
    "sedlo": "Sedlo",
    "staza": "Staza",
    "jahac": "Jahač",
    "vitez": "Vitez",
    "brzo": "Brzo",
    "priprema": "Priprema",
    "naprijed": "Naprijed",
    "konj_se_krece_brzo": "Konj se kreće brzo.",
    "jahac_se_priprema": "Jahač se priprema.",
    "brzi_konj": "Brzi konj",
    "krecemo_se_po_stazi": "Krećemo se po stazi.",
    "plemeniti_konj": "Plemeniti konj",
    "jahac_trci_stazom": "Jahač trči stazom.",
    "vitez_gleda_konja": "Vitez gleda konja.",
    "konj_stoji_mirno": "Konj stoji mirno.",
    "jahaci_se_pripremaju_za_natjecanje": "Jahači se pripremaju za natjecanje.",
    "kozno_sedlo": "Kožno sedlo",
    "vitez_jase_konja": "Vitez jaše konja.",
    "dugacka_trkaca_staza": "Dugačka trkaća staza",
    "vitezovi_vole_svoje_konje": "Vitezovi vole svoje konje.",
    "crveno_sedlo": "Crveno sedlo",
    "staza_je_puna_pijeska": "Staza je puna pijeska.",
    "konj_nosi_sedlo": "Konj nosi sedlo.",
    "plemeniti_konj_galopira": "Plemeniti konj galopira.",
    "jahac_je_u_sedlu": "Jahač je u sedlu.",
    "svi_se_pripremaju_za_pocetak": "Svi se pripremaju za početak.",
    "vitez_se_krece_naprijed": "Vitez se kreće naprijed.",
    "konj_mirno_ceka": "Konj mirno čeka.",
    "sedlo_je_spremno": "Sedlo je spremno.",
    "publika_pljesce_jahacima": "Publika plješće jahačima.",
    "pocetak_velikog_natjecanja": "Početak velikog natjecanja.",

    # ==========================================
    # Unit 42: Alka i koplje (The Tournament & Ring Target)
    # ==========================================
    "alka": "Alka",
    "koplje": "Koplje",
    "meta": "Meta",
    "pogodak": "Pogodak",
    "srida": "Srida",
    "prsten": "Prsten",
    "ostri": "Oštri",
    "bod": "Bod",
    "vitezovi_se_natjecu": "Vitezovi se natječu.",
    "dugacko_koplje": "Dugačko koplje",
    "pogodak_u_sridu": "Pogodak u sridu!",
    "zeljezna_alka": "Željezna alka",
    "vitezovi_gledaju_alku": "Vitezovi gledaju alku.",
    "koplje_leti_naprijed": "Koplje leti naprijed.",
    "promasena_meta": "Promašena meta",
    "mali_zeljezni_prsten": "Mali željezni prsten",
    "vitez_se_usmjerava_na_metu": "Vitez se usmjerava na metu.",
    "natjecemo_se_zajedno": "Natječemo se zajedno.",
    "ostro_koplje": "Oštro koplje",
    "sjajan_pogodak": "Sjajan pogodak",
    "koplje_pogada_cilj": "Koplje pogađa cilj.",
    "alka_stoji_na_uzetu": "Alka stoji na užetu.",
    "vitez_drzi_koplje": "Vitez drži koplje.",
    "velika_drvena_meta": "Velika drvena meta",
    "jahac_usmjerava_koplje_u_alku": "Jahač usmjerava koplje u alku.",
    "svi_se_natjecu_s_ponosom": "Svi se natječu s ponosom.",
    "tri_boda_za_pogodak_u_sridu": "Tri boda za pogodak u sridu!",
    "alka_visi_iznad_staze": "Alka visi iznad staze.",
    "dva_boda_u_gornji_dio": "Dva boda u gornji dio!",
    "koplje_udara_u_zeljezo": "Koplje udara u željezo.",
    "vitez_pogada_u_jedan": "Vitez pogađa u jedan.",
    "publika_slavi_sridu": "Publika slavi sridu!",

    # ==========================================
    # Unit 43: Kanjon rijeke Cetine (The Emerald Canyon & River)
    # ==========================================
    "kanjon": "Kanjon",
    "slap": "Slap",
    "stijena": "Stijena",
    "camac": "Čamac",
    "rijeka": "Rijeka",
    "zeleno": "Zeleno",
    "voda": "Voda",
    "duboko": "Duboko",
    "camac_se_spusta_niz_rijeku": "Čamac se spušta niz rijeku.",
    "visoka_stijena": "Visoka stijena",
    "predivni_slap": "Predivni slap",
    "duboki_kanjon": "Duboki kanjon",
    "voda_tece_kroz_kanjon": "Voda teče kroz kanjon.",
    "stijene_su_visoke": "Stijene su visoke.",
    "rijeka_cetina_je_zelena": "Rijeka Cetina je zelena.",
    "mali_drveni_camac": "Mali drveni čamac",
    "divimo_se_smaragdnoj_rijeci": "Divimo se smaragdnoj rijeci.",
    "brza_voda_tece": "Brza voda teče.",
    "camac_se_krece_kroz_kanjon": "Čamac se kreće kroz kanjon.",
    "strme_stijene_uz_obalu": "Strme stijene uz obalu",
    "gledamo_slap_iz_camca": "Gledamo slap iz čamca.",
    "zelena_rijeka_cetina": "Zelena rijeka Cetina",
    "bijela_rijecna_pjena": "Bijela riječna pjena",
    "stijena_se_uzdize_visoko": "Stijena se uzdiže visoko.",
    "rijeka_se_spusta_u_kanjon": "Rijeka se spušta u kanjon.",
    "divimo_se_glasnom_slapu": "Divimo se glasnom slapu.",
    "camac_prolazi_pokraj_stijena": "Čamac prolazi pokraj stijena.",
    "cista_i_zelena_rijecna_voda": "Čista i zelena riječna voda",
    "veslamo_po_rijeci": "Veslamo po rijeci.",
    "hladna_planinska_voda": "Hladna planinska voda",
    "divimo_se_ljepoti_prirode": "Divimo se ljepoti prirode.",
    "slap_pada_u_rijeku": "Slap pada u rijeku.",

    # ==========================================
    # Unit 44: Stari mlin i kruh ispod peke (Traditional Hearth & Watermill)
    # ==========================================
    "mlin": "Mlin",
    "peka": "Peka",
    "brasno": "Brašno",
    "vatra": "Vatra",
    "ognjiste": "Ognjište",
    "kruh": "Kruh",
    "toplo": "Toplo",
    "dim": "Dim",
    "mlinski_kotac_se_okrece": "Mlinski kotač se okreće.",
    "topla_vatra": "Topla vatra",
    "bijelo_brasno": "Bijelo brašno",
    "kruh_ispod_peke": "Kruh ispod peke",
    "vatra_gori_u_ognjistu": "Vatra gori u ognjištu.",
    "stari_kameni_mlin": "Stari kameni mlin",
    "miris_toplog_kruha": "Miris toplog kruha",
    "mlin_melje_zito": "Mlin melje žito.",
    "grijemo_se_uz_vatru": "Grijemo se uz vatru.",
    "mlin_melje_zito_u_brasno": "Mlin melje žito u brašno.",
    "peka_se_zagrijava_na_ognjistu": "Peka se zagrijava na ognjištu.",
    "miris_svjezeg_kruha": "Miris svježeg kruha",
    "vatra_grije_cijelu_kucu": "Vatra grije cijelu kuću.",
    "brasno_za_domaci_kruh": "Brašno za domaći kruh",
    "dim_se_dize_iz_dimnjaka": "Dim se diže iz dimnjaka.",
    "kruh_se_pece_polako": "Kruh se peče polako.",
    "stari_mlin_se_okrece_pokraj_rijeke": "Stari mlin se okreće pokraj rijeke.",
    "obitelj_se_grije_uz_ognjiste": "Obitelj se grije uz ognjište.",
    "ukusna_vecera_se_priprema_ispod_peke": "Ukusna večera se priprema ispod peke.",
    "zlatna_vatra_pucketa": "Zlatna vatra pucketa.",
    "voda_pokrece_veliki_mlin": "Voda pokreće veliki mlin.",
    "svjezi_kruh_je_spreman": "Svježi kruh je spreman.",
    "svi_jedemo_topli_kruh": "Svi jedemo topli kruh.",
    "mlin_radi_cijeli_dan": "Mlin radi cijeli dan.",

    # ==========================================
    # Unit 45: Slavlje slavodobitnika (The Champion's Celebration Capstone)
    # ==========================================
    "pobjeda": "Pobjeda",
    "medalja": "Medalja",
    "slavlje": "Slavlje",
    "ponos": "Ponos",
    "pobjednik": "Pobjednik",
    "zlato": "Zlato",
    "narod": "Narod",
    "tradicija": "Tradicija",
    "svi_se_raduju_pobjedi": "Svi se raduju pobjedi.",
    "zlatna_medalja": "Zlatna medalja",
    "veliko_slavlje": "Veliko slavlje",
    "istinski_ponos": "Istinski ponos",
    "pobjednik_nosi_medalju": "Pobjednik nosi medalju.",
    "narod_pjeva_i_slavi": "Narod pjeva i slavi.",
    "sjajna_zlatna_medalja": "Sjajna zlatna medalja",
    "slavlje_u_cijelom_gradu": "Slavlje u cijelom gradu",
    "ponosimo_se_nasim_vitezovima": "Ponosimo se našim vitezovima.",
    "pobjednik_se_raduje_na_konju": "Pobjednik se raduje na konju.",
    "sjajna_medalja_na_prsima": "Sjajna medalja na prsima",
    "grad_slavi_vitesko_natjecanje": "Grad slavi viteško natjecanje.",
    "ponosni_vitez_pozdravlja_publiku": "Ponosni vitez pozdravlja publiku.",
    "zlatna_medalja_sja": "Zlatna medalja sja.",
    "svi_pjevaju_pobjednicku_pjesmu": "Svi pjevaju pobjedničku pjesmu.",
    "ponos_hrvatske_tradicije": "Ponos hrvatske tradicije",
    "slavodobitnik_ponosno_prima_zlatnu_medalju": "Slavodobitnik ponosno prima zlatnu medalju.",
    "cijeli_grad_se_raduje_i_pjeva": "Cijeli grad se raduje i pjeva.",
    "ponosimo_se_bogatom_hrvatskom_bastinom": "Ponosimo se bogatom hrvatskom baštinom.",
    "cestitamo_zavrsili_ste_deveti_svijet": "Čestitamo, završili ste deveti svijet!",
    "vitezovi_ponosno_jasu": "Vitezovi ponosno jašu.",
    "slavlje_traje_do_kasno_u_noc": "Slavlje traje do kasno u noć.",
    "zlatni_plamen_tradicije": "Zlatni plamen tradicije.",
    "zajedno_slavimo_veliku_pobjedu": "Zajedno slavimo veliku pobjedu!",
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
    print(f"Synthesizing {len(AUDIO_MAP)} audio files for World 9...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for filename, text in AUDIO_MAP.items():
        await generate_file(filename, text)
    print("\nAll World 9 audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
