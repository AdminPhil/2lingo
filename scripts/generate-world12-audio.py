import asyncio
import os
import sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "hr")
VOICE = "hr-HR-GabrijelaNeural"

# All single words and phrases for World 12: Velebit Mountains, Paklenica & Gacka River (Units 56–60)
AUDIO_MAP = {
    # ==========================================
    # Unit 56: Velebit i alpsko bilje (Alpine Velebit Peaks & Endemic Flora)
    # ==========================================
    "vrh": "Vrh",
    "degenija": "Degenija",
    "greben": "Greben",
    "bura": "Bura",
    "visoki_vrh": "Visoki vrh",
    "zuta_degenija": "Žuta degenija",
    "kameni_greben": "Kameni greben",
    "snazna_bura": "Snažna bura",
    "velebit_cuva_rijetko_bilje": "Velebit čuva rijetko bilje.",
    "zuta_degenija_raste_na_stijenama": "Žuta degenija raste na stijenama.",
    "planinari_hodaju_duz_grebena": "Planinari hodaju duž grebena.",
    "hladna_bura_puse_s_planine": "Hladna bura puše s planine.",
    "snijeg_prekriva_najvise_vrhove": "Snijeg prekriva najviše vrhove.",
    "premuziceva_staza_vodi_kroz_krs": "Premužićeva staza vodi kroz krš.",
    "s_vrha_se_vide_jadranski_otoci": "S vrha se vide jadranski otoci.",
    "alpski_vjetar_donosi_cist_zrak": "Alpski vjetar donosi čist zrak.",
    "botanicki_vrt_lezi_pod_vrhom": "Botanički vrt leži pod vrhom.",
    "bijeli_kamen_blista_na_suncu": "Bijeli kamen blista na suncu.",
    "nacionalni_park_stiti_velebit": "Nacionalni park štiti Velebit.",
    "vecer_spusta_tisinu_na_planinu": "Večer spušta tišinu na planinu.",

    # ==========================================
    # Unit 57: Kanjoni Paklenice i penjanje (Paklenica Canyons & Climbing)
    # ==========================================
    "penjac": "Penjač",
    "uze": "Uže",
    "spilja": "Špilja",
    "bukva": "Bukva",
    "hrabri_penjac": "Hrabri penjač",
    "cvrsto_uze": "Čvrsto uže",
    "duboka_spilja": "Duboka špilja",
    "stara_bukva": "Stara bukva",
    "penjac_se_uspinje_uz_liticu": "Penjač se uspinje uz liticu.",
    "cvrsto_uze_osigurava_svaki_korak": "Čvrsto uže osigurava svaki korak.",
    "spilja_manita_pec_krije_sige": "Špilja Manita peć krije sige.",
    "stare_bukve_tvore_gustu_sumu": "Stare bukve tvore gustu šumu.",
    "kanjon_velike_paklenice_je_strm": "Kanjon Velike Paklenice je strm.",
    "penjaci_dolaze_iz_cijelog_svijeta": "Penjači dolaze iz cijelog svijeta.",
    "hlad_u_spilji_osvjezava_izletnike": "Hlad u špilji osvježava izletnike.",
    "bistra_voda_tece_dnom_klanca": "Bistra voda teče dnom klanca.",
    "sokol_kruzi_iznad_visoke_stijene": "Sokol kruži iznad visoke stijene.",
    "staza_prolazi_kroz_sjenovitu_sumu": "Staza prolazi kroz sjenovitu šumu.",
    "planinarski_dom_nudi_topli_caj": "Planinarski dom nudi topli čaj.",
    "paklenica_spaja_planinu_i_more": "Paklenica spaja planinu i more.",

    # ==========================================
    # Unit 58: Utočište za medvjede u Kuterevu (Kuterevo Bear Sanctuary)
    # ==========================================
    "medvjedic": "Medvjedić",
    "utociste": "Utočište",
    "ris": "Ris",
    "sova": "Sova",
    "mali_medvjedic": "Mali medvjedić",
    "sumsko_utociste": "Šumsko utočište",
    "brzi_ris": "Brzi ris",
    "nocna_sova": "Noćna sova",
    "medvjedici_se_igraju_u_kuterevu": "Medvjedići se igraju u Kuterevu.",
    "utociste_pomaze_mladim_medvjedima": "Utočište pomaže mladim medvjedima.",
    "oprezni_ris_tiho_hoda_sumom": "Oprezni ris tiho hoda šumom.",
    "sova_gleda_s_visoke_grane": "Sova gleda s visoke grane.",
    "volonteri_brinu_o_sumskim_zivotinjama": "Volonteri brinu o šumskim životinjama.",
    "mladi_medvjedic_trazi_sumsko_voce": "Mladi medvjedić traži šumsko voće.",
    "drvene_ograde_okruzuju_veliki_prostor": "Drvene ograde okružuju velik prostor.",
    "posjetitelji_uce_postovati_divljinu": "Posjetitelji uče poštovati divljinu.",
    "guste_jele_stite_mir_sume": "Guste jele štite mir šume.",
    "jesen_donosi_obilje_sumskih_plodova": "Jesen donosi obilje šumskih plodova.",
    "selo_kuterevo_cuva_prirodnu_ravnotezu": "Selo Kuterevo čuva prirodnu ravnotežu.",
    "nocu_se_cuje_pjev_sumskih_ptica": "Noću se čuje pjev šumskih ptica.",

    # ==========================================
    # Unit 59: Izvori Gacke i pastrve (Gacka Crystal Springs & Trout)
    # ==========================================
    "vrilo": "Vrilo",
    "pastrva": "Pastrva",
    "potok": "Potok",
    "mostic": "Mostić",
    "bistro_vrilo": "Bistro vrilo",
    "rijecna_pastrva": "Riječna pastrva",
    "hladni_potok": "Hladni potok",
    "drveni_mostic": "Drveni mostić",
    "majerovo_vrilo_izvire_iz_kamena": "Majerovo vrilo izvire iz kamena.",
    "pastrva_pliva_u_bistroj_gacki": "Pastrva pliva u bistroj Gacki.",
    "hladni_potok_spaja_se_s_rijekom": "Hladni potok spaja se s rijekom.",
    "prelazimo_mali_drveni_mostic": "Prelazimo mali drveni mostić.",
    "voda_gacke_iznimno_je_cista": "Voda Gacke iznimno je čista.",
    "stare_vodenice_jos_uvijek_melju": "Stare vodenice još uvijek melju.",
    "zelena_trava_okruzuje_modro_jezerce": "Zelena trava okružuje modro jezerce.",
    "ribici_promatraju_tihu_povrsinu_vode": "Ribiči promatraju tihu površinu vode.",
    "podvodno_bilje_raste_u_rijeci": "Podvodno bilje raste u rijeci.",
    "prozirni_izvor_odrazava_plavo_nebo": "Prozirni izvor odražava plavo nebo.",
    "gacka_tece_mirno_kroz_polje": "Gacka teče mirno kroz polje.",
    "jutarnja_svjezina_budi_cijelu_dolinu": "Jutarnja svježina budi cijelu dolinu.",

    # ==========================================
    # Unit 60: Lička baština i gorštaci (Lika Highlander Heritage Capstone)
    # ==========================================
    "koliba": "Koliba",
    "krumpir": "Krumpir",
    "skripavac": "Škripavac",
    "vuna": "Vuna",
    "drvena_koliba": "Drvena koliba",
    "licki_krumpir": "Lički krumpir",
    "svjezi_skripavac": "Svježi škripavac",
    "topla_vuna": "Topla vuna",
    "drvena_koliba_stoji_pod_jelama": "Drvena koliba stoji pod jelama.",
    "licki_krumpir_pece_se_u_pecnici": "Lički krumpir peče se u pećnici.",
    "svjezi_skripavac_skripi_pod_zubima": "Svježi škripavac škripi pod zubima.",
    "bake_pletu_carape_od_vune": "Bake pletu čarape od vune.",
    "zima_u_lici_donosi_dubok_snijeg": "Zima u Lici donosi dubok snijeg.",
    "tople_peci_griju_planinske_domove": "Tople peći griju planinske domove.",
    "gorstaci_cuvaju_snagu_i_gostoljubivost": "Gorštaci čuvaju snagu i gostoljubivost.",
    "pjesma_odjekuje_lickim_poljima": "Pjesma odjekuje ličkim poljima.",
    "svjezi_planinski_zrak_daje_snagu": "Svježi planinski zrak daje snagu.",
    "domaca_trpeza_okuplja_cijelu_obitelj": "Domaća trpeza okuplja cijelu obitelj.",
    "ponosni_kraj_spaja_krs_i_sume": "Ponosni kraj spaja krš i šume.",
    "cestitamo_zavrsili_ste_dvanaesti_svijet": "Čestitamo, završili ste dvanaesti svijet!",
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
    print(f"Synthesizing {len(AUDIO_MAP)} audio files for World 12...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for filename, text in AUDIO_MAP.items():
        await generate_file(filename, text)
    print("\nAll World 12 audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
