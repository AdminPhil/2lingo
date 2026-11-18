import asyncio
import os
import sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "hr")
VOICE = "hr-HR-GabrijelaNeural"

# All single words and phrases for World 11: Varaždin & Međimurje (Units 51–55)
AUDIO_MAP = {
    # ==========================================
    # Unit 51: Barokni Varaždin i glazba (Baroque Varaždin & Music)
    # ==========================================
    "violina": "Violina",
    "klavir": "Klavir",
    "nota": "Nota",
    "orkestar": "Orkestar",
    "barokna_violina": "Barokna violina",
    "koncertni_klavir": "Koncertni klavir",
    "zlatna_nota": "Zlatna nota",
    "veliki_orkestar": "Veliki orkestar",
    "violina_svira_u_dvorani": "Violina svira u dvorani.",
    "orkestar_izvodi_baroknu_glazbu": "Orkestar izvodi baroknu glazbu.",
    "glazbenik_cita_stare_note": "Glazbenik čita stare note.",
    "klavir_zvuci_vrlo_lijepo": "Klavir zvuči vrlo lijepo.",
    "varazdin_slavi_barokne_veceri": "Varaždin slavi barokne večeri.",
    "publika_slusa_tihu_melodiju": "Publika sluša tihu melodiju.",
    "dirigent_vodi_cijeli_orkestar": "Dirigent vodi cijeli orkestar.",
    "koncert_pocinje_tocno_navecer": "Koncert počinje točno navečer.",
    "zvuk_violine_ispunjava_crkvu": "Zvuk violine ispunjava crkvu.",
    "mladi_umjetnici_vjezbaju_svaki_dan": "Mladi umjetnici vježbaju svaki dan.",
    "barokna_glazba_donosi_mir": "Barokna glazba donosi mir.",
    "pljesak_odjekuje_starim_kazalistem": "Pljesak odjekuje starim kazalištem.",

    # ==========================================
    # Unit 52: Špancirfest i ulice (Špancirfest Festival & Streets)
    # ==========================================
    "pozornica": "Pozornica",
    "glumac": "Glumac",
    "kisobran": "Kišobran",
    "sesir": "Šešir",
    "velika_pozornica": "Velika pozornica",
    "veseli_glumac": "Veseli glumac",
    "sareni_kisobran": "Šareni kišobran",
    "slamni_sesir": "Slamni šešir",
    "sareni_kisobrani_vise_nad_ulicom": "Šareni kišobrani vise nad ulicom.",
    "glumac_zabavlja_djecu_na_trgu": "Glumac zabavlja djecu na trgu.",
    "pjevaci_stoje_na_velikoj_pozornici": "Pjevači stoje na velikoj pozornici.",
    "gosti_setaju_varazdinskim_trgovima": "Gosti šetaju varaždinskim trgovima.",
    "spancirfest_okuplja_mnogo_umjetnika": "Špancirfest okuplja mnogo umjetnika.",
    "ulicni_sviraci_sviraju_do_mraka": "Ulični svirači sviraju do mraka.",
    "slikar_crta_portret_ispod_sesira": "Slikar crta portret ispod šešira.",
    "djeca_se_smiju_veseloj_predstavi": "Djeca se smiju veseloj predstavi.",
    "stari_grad_zivi_u_bojama": "Stari grad živi u bojama.",
    "ljudi_kupuju_rucne_radove": "Ljudi kupuju ručne radove.",
    "ljetna_vecer_mirise_na_pecivo": "Ljetna večer miriše na pecivo.",
    "festival_donosi_radost_svima": "Festival donosi radost svima.",

    # ==========================================
    # Unit 53: Stari grad i anđeli (Varaždin Old Town & Angels)
    # ==========================================
    "andeo": "Anđeo",
    "bedem": "Bedem",
    "toranj": "Toranj",
    "grb": "Grb",
    "mali_andeo": "Mali anđeo",
    "kameni_bedem": "Kameni bedem",
    "visoki_toranj": "Visoki toranj",
    "stari_grb": "Stari grb",
    "varazdin_se_zove_grad_andela": "Varaždin se zove grad anđela.",
    "bijeli_bedemi_okruzuju_stari_grad": "Bijeli bedemi okružuju stari grad.",
    "sat_na_tornju_otkucava_podne": "Sat na tornju otkucava podne.",
    "plemicki_grb_krasi_ulazna_vrata": "Plemićki grb krasi ulazna vrata.",
    "muzej_cuva_stare_portrete": "Muzej čuva stare portrete.",
    "zlatni_andeo_spava_na_prozoru": "Zlatni anđeo spava na prozoru.",
    "setamo_zelenim_parkom_oko_tvrdave": "Šetamo zelenim parkom oko tvrđave.",
    "krovovi_su_prekriveni_crvenim_crijepom": "Krovovi su prekriveni crvenim crijepom.",
    "palace_svjedoce_bogatoj_proslosti": "Palače svjedoče bogatoj prošlosti.",
    "kocija_prolazi_pokraj_gradske_vijecnice": "Kočija prolazi pokraj gradske vijećnice.",
    "svjetiljke_obasjavaju_tihu_ulicicu": "Svjetiljke obasjavaju tihu uličicu.",
    "povijest_varazdina_zivi_u_kamenu": "Povijest Varaždina živi u kamenu.",

    # ==========================================
    # Unit 54: Rijeke Mura i Drava (Mura & Drava Rivers)
    # ==========================================
    "labud": "Labud",
    "vrba": "Vrba",
    "splav": "Splav",
    "obala": "Obala",
    "bijeli_labud": "Bijeli labud",
    "zelena_vrba": "Zelena vrba",
    "drvena_splav": "Drvena splav",
    "mirna_obala": "Mirna obala",
    "bijeli_labud_pliva_po_dravi": "Bijeli labud pliva po Dravi.",
    "vrbe_spustaju_grane_do_vode": "Vrbe spuštaju grane do vode.",
    "drvena_splav_prelazi_rijeku_muru": "Drvena splav prelazi rijeku Muru.",
    "ribar_sjedi_na_mirnoj_obali": "Ribar sjedi na mirnoj obali.",
    "dvije_rijeke_spajaju_se_u_sumi": "Dvije rijeke spajaju se u šumi.",
    "jutarnja_magla_lebdi_iznad_vode": "Jutarnja magla lebdi iznad vode.",
    "ptice_pjevaju_u_gustoj_trsci": "Ptice pjevaju u gustoj trsci.",
    "voda_tece_tiho_prema_istoku": "Voda teče tiho prema istoku.",
    "biciklisti_voze_stazom_uz_nasip": "Biciklisti voze stazom uz nasip.",
    "cista_priroda_stiti_rijetke_ptice": "Čista priroda štiti rijetke ptice.",
    "sunce_se_zrcali_na_povrsini_rijeke": "Sunce se zrcali na površini rijeke.",
    "drava_i_mura_hrane_zelene_livade": "Drava i Mura hrane zelene livade.",

    # ==========================================
    # Unit 55: Međimurski vinogradi i baština (Međimurje Vineyards & Heritage)
    # ==========================================
    "vinograd": "Vinograd",
    "grozde": "Grožđe",
    "cipka": "Čipka",
    "tambura": "Tambura",
    "zeleni_vinograd": "Zeleni vinograd",
    "slatko_grozde": "Slatko grožđe",
    "bijela_cipka": "Bijela čipka",
    "stara_tambura": "Stara tambura",
    "medimurski_bregi_puni_su_vinograda": "Međimurski bregi puni su vinograda.",
    "beremo_slatko_grozde_u_kosare": "Beremo slatko grožđe u košare.",
    "zene_pletu_finu_bijelu_cipku": "Žene pletu finu bijelu čipku.",
    "tambura_prati_staru_narodnu_pjesmu": "Tambura prati staru narodnu pjesmu.",
    "pogled_s_maderkinog_brega_oduzima_dah": "Pogled s Mađerkinog brega oduzima dah.",
    "domaci_kruh_i_sir_cekaju_goste": "Domaći kruh i sir čekaju goste.",
    "podrumi_cuvaju_najbolja_vina_sjevera": "Podrumi čuvaju najbolja vina sjevera.",
    "medimurska_popevka_dira_svako_srce": "Međimurska popevka dira svako srce.",
    "jesen_boji_lisce_u_zlatnu_boju": "Jesen boji lišće u zlatnu boju.",
    "ljudi_pjevaju_uz_zvuke_tamburice": "Ljudi pjevaju uz zvuke tamburice.",
    "sjever_hrvatske_ponosi_se_tradicijom": "Sjever Hrvatske ponosi se tradicijom.",
    "cestitamo_zavrsili_ste_jedanaesti_svijet": "Čestitamo, završili ste jedanaesti svijet!",
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
    print(f"Synthesizing {len(AUDIO_MAP)} audio files for World 11...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for filename, text in AUDIO_MAP.items():
        await generate_file(filename, text)
    print("\nAll World 11 audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
