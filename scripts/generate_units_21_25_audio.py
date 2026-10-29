import asyncio
import os
import sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "hr")
VOICE = "hr-HR-GabrijelaNeural"

PHRASES = {
    # Unit 21: Dani u tjednu i kalendar
    "tjedan": "Tjedan",
    "vikend": "Vikend",
    "jutro": "Jutro",
    "vecer": "Večer",
    "dan": "Dan",
    "noc": "Noć",
    "mjesec": "Mjesec",
    "godina": "Godina",
    "danas": "Danas",
    "sutra": "Sutra",
    "ponedjeljak": "Ponedjeljak",
    "nedjelja": "Nedjelja",
    "danas_je_ponedjeljak": "Danas je ponedjeljak.",
    "sutra_je_novi_dan": "Sutra je novi dan.",
    "vikend_pocinje_sutra": "Vikend počinje sutra.",
    "lijepo_i_toplo_jutro": "Lijepo i toplo jutro.",
    "ugodna_i_mirna_vecer": "Ugodna i mirna večer.",
    "deda_cita_knjigu": "Deda čita knjigu.",
    "djeca_se_igraju_u_parku": "Djeca se igraju u parku.",
    "mala_macka_spava_na_travi": "Mala mačka spava na travi.",
    "dobro_jutro_svima": "Dobro jutro svima.",
    "dobra_vecer_bako": "Dobra večer bako.",
    "radujemo_se_vikendu": "Radujemo se vikendu.",
    "danas_ucimo_hrvatski": "Danas učimo hrvatski.",
    "tjedan_ima_sedam_dana": "Tjedan ima sedam dana.",

    # Unit 22: U slastičarnici
    "sladoled": "Sladoled",
    "kuglica": "Kuglica",
    "cokolada": "Čokolada",
    "jagoda": "Jagoda",
    "kolac": "Kolač",
    "kava": "Kava",
    "zelim": "Želim",
    "naruciti": "Naručiti",
    "kupujem": "Kupujem",
    "sladak": "Sladak",
    "zelim_sladoled_od_cokolade": "Želim sladoled od čokolade.",
    "molim_jednu_kuglicu_jagode": "Molim jednu kuglicu jagode.",
    "ovaj_kolac_je_jako_sladak": "Ovaj kolač je jako sladak.",
    "kupujem_hladni_sladoled_na_plazi": "Kupujem hladni sladoled na plaži.",
    "tata_vozi_auto": "Tata vozi auto.",
    "vlak_putuje_na_kolodvor": "Vlak putuje na kolodvor.",
    "pas_trci_po_livadi": "Pas trči po livadi.",
    "ptica_pjeva_na_stablu": "Ptica pjeva na stablu.",
    "dvije_kuglice_u_kornetu": "Dvije kuglice u kornetu.",
    "volim_cokoladu_i_jagodu": "Volim čokoladu i jagodu.",
    "hvala_lijepa_na_sladoledu": "Hvala lijepa na sladoledu.",
    "koliko_kosta_ovaj_sladoled": "Koliko košta ovaj sladoled?",
    "pasko_jede_fini_sladoled": "Paško jede fini sladoled.",

    # Unit 23: Rimska arena i legende
    "arena": "Arena",
    "vitez": "Vitez",
    "stit": "Štit",
    "dvorac": "Dvorac",
    "mac": "Mač",
    "zid": "Zid",
    "kruna": "Kruna",
    "kula": "Kula",
    "istrazujemo": "Istražujemo",
    "hrabar": "Hrabar",
    "gledamo": "Gledamo",
    "stari": "Stari",
    "istrazujemo_veliku_rimsku_arenu": "Istražujemo veliku rimsku arenu.",
    "hrabri_vitez_nosi_sjajni_stit": "Hrabri vitez nosi sjajni štit.",
    "stari_kameni_zidovi_su_visoki": "Stari kameni zidovi su visoki.",
    "gledamo_drevni_dvorac_na_brdu": "Gledamo drevni dvorac na brdu.",
    "riba_pliva_u_plavom_moru": "Riba pliva u plavom moru.",
    "djecak_pise_olovkom": "Dječak piše olovkom.",
    "mama_pece_kruh": "Mama peče kruh.",
    "auto_stoji_ispred_kuce": "Auto stoji ispred kuće.",
    "pulska_arena_ima_mnogo_lukova": "Pulska arena ima mnogo lukova.",
    "ponosni_vitez_cuva_staru_kulu": "Ponosni vitez čuva staru kulu.",
    "kamen_prica_pricu_iz_proslosti": "Kamen priča priču iz prošlosti.",
    "ovdje_su_zivjeli_hrabri_junaci": "Ovdje su živjeli hrabri junaci.",
    "pasko_ponosno_nosi_zlatnu_krunu": "Paško ponosno nosi zlatnu krunu.",

    # Unit 24: Moj dan i sat
    "sat": "Sat",
    "cetkica": "Četkica",
    "krevet": "Krevet",
    "vecera": "Večera",
    "jastuk": "Jastuk",
    "sapun": "Sapun",
    "budim_se": "Budim se",
    "perem": "Perem",
    "ujutro": "Ujutro",
    "navecer": "Navečer",
    "budim_se_rano_u_sedam_sati": "Budim se rano u sedam sati.",
    "perem_zube_sa_svojom_cetkicom": "Perem zube sa svojom četkicom.",
    "ujutro_jedem_fini_topli_dorucak": "Ujutro jedem fini topli doručak.",
    "navecer_idem_u_topli_krevet": "Navečer idem u topli krevet.",
    "more_sumi_ispod_suncanog_neba": "More šumi ispod sunčanog neba.",
    "mali_zeko_trci_po_travi": "Mali zeko trči po travi.",
    "trajekt_plovi_prema_otoku": "Trajekt plovi prema otoku.",
    "vlak_vozi_kroz_planinu": "Vlak vozi kroz planinu.",
    "koliko_je_sada_tocno_sati": "Koliko je sada točno sati?",
    "sada_je_tocno_osam_sati": "Sada je točno osam sati.",
    "nakon_skole_radim_zadacu": "Nakon škole radim zadaću.",
    "laku_noc_i_slatke_snove": "Laku noć i slatke snove.",
    "spreman_sam_za_novi_dan": "Spreman sam za novi dan.",

    # Unit 25: Ljetne morske radosti
    "maska": "Maska",
    "rucnik": "Ručnik",
    "val": "Val",
    "skoljka": "Školjka",
    "pijesak": "Pijesak",
    "ronim": "Ronim",
    "skacem": "Skačem",
    "plivam": "Plivam",
    "uzivam": "Uživam",
    "skacem_u_more_i_hvatam_val": "Skačem u more i hvatam val.",
    "ronim_s_maskom_i_gledam_ribe": "Ronim s maskom i gledam ribe.",
    "nasao_sam_sjajnu_bijelu_skoljku": "Našao sam sjajnu bijelu školjku.",
    "moj_mekani_rucnik_lezi_na_plazi": "Moj mekani ručnik leži na plaži.",
    "kupujem_kruh_i_sir": "Kupujem kruh i sir.",
    "vitez_nosi_krunu_u_areni": "Vitez nosi krunu u areni.",
    "danas_je_lijep_i_suncan_dan": "Danas je lijep i sunčan dan.",
    "sutra_ucimo_nove_rijeci": "Sutra učimo nove riječi.",
    "more_je_toplo_i_plavo_danas": "More je toplo i plavo danas.",
    "pasko_skace_s_mola_u_more": "Paško skače s mola u more.",
    "volim_roniti_u_cistom_jadranu": "Volim roniti u čistom Jadranu.",
    "hvala_ti_na_predivnom_ljetu": "Hvala ti na predivnom ljetu.",
    "cestitamo_zavrsili_ste_peti_svijet": "Čestitamo završili ste peti svijet.",

    # Distractor words
    "cvijet": "Cvijet",
    "kroasan": "Kroasan",
    "spavati": "Spavati",
    "trcati": "Trčati",
    "plivati": "Plivati",
    "pijemo": "Pijemo",
    "spavamo": "Spavamo",
    "jedemo": "Jedemo",

    # Symmetrical question distractors
    "gdje_je_moj_crveni_auto": "Gdje je moj crveni auto?",
    "kada_polazi_brzi_vlak": "Kada polazi brzi vlak?",
    "tko_pjeva_na_visokom_stablu": "Tko pjeva na visokom stablu?",
    "zasto_sunce_sja_na_nebu": "Zašto sunce sja na nebu?",
    "gdje_se_skriva_mali_zeko": "Gdje se skriva mali zeko?",
    "kada_plovi_bijeli_trajekt": "Kada plovi bijeli trajekt?",
}

async def generate_audio():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating {len(PHRASES)} Croatian audio files with voice: {VOICE} for Units 21-25...")

    count = 0
    for slug, text in PHRASES.items():
        output_file = os.path.join(OUTPUT_DIR, f"{slug}.mp3")
        if os.path.exists(output_file) and os.path.getsize(output_file) > 100:
            print(f"Skipping existing: {slug}.mp3")
            count += 1
            continue
        communicate = edge_tts.Communicate(text, VOICE, rate="-5%")
        await communicate.save(output_file)
        count += 1
        print(f"[{count}/{len(PHRASES)}] Generated {slug}.mp3 ({text})")

    print(f"\nAll {len(PHRASES)} audio files successfully verified in {OUTPUT_DIR}!")

if __name__ == "__main__":
    asyncio.run(generate_audio())
