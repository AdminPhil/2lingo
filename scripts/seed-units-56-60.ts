import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

interface OptionDef {
  text: string;
  correct: boolean;
  imageSrc?: string | null;
  audioSrc: string;
}

interface ChallengeDef {
  type: "SELECT" | "ASSIST";
  order: number;
  question: string;
  options: OptionDef[];
}

interface LessonDef {
  title: string;
  order: number;
  challenges: ChallengeDef[];
}

interface UnitDef {
  order: number;
  title: string;
  description: string;
  lessons: LessonDef[];
}

const unitsData: UnitDef[] = [
  // ==========================================
  // UNIT 56: VELEBIT I ALPSKO BILJE (Alpine Velebit Peaks & Endemic Flora)
  // ==========================================
  {
    order: 56,
    title: "Unit 56",
    description: "Velebit i alpsko bilje (Alpine Velebit Peaks & Endemic Flora)",
    lessons: [
      {
        order: 1,
        title: "Planinski vrhovi i bilje",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Summit"?',
            options: [
              { text: "Vrh", correct: true, imageSrc: "/vrh.svg", audioSrc: "/audio/hr/vrh.mp3" },
              { text: "Degenija", correct: false, imageSrc: "/degenija.svg", audioSrc: "/audio/hr/degenija.mp3" },
              { text: "Greben", correct: false, imageSrc: "/greben.svg", audioSrc: "/audio/hr/greben.mp3" },
              { text: "Bura", correct: false, imageSrc: "/bura.svg", audioSrc: "/audio/hr/bura.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Velebit degenia"?',
            options: [
              { text: "Degenija", correct: true, imageSrc: "/degenija.svg", audioSrc: "/audio/hr/degenija.mp3" },
              { text: "Vrh", correct: false, imageSrc: "/vrh.svg", audioSrc: "/audio/hr/vrh.mp3" },
              { text: "Greben", correct: false, imageSrc: "/greben.svg", audioSrc: "/audio/hr/greben.mp3" },
              { text: "Bura", correct: false, imageSrc: "/bura.svg", audioSrc: "/audio/hr/bura.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Ridge"?',
            options: [
              { text: "Greben", correct: true, imageSrc: "/greben.svg", audioSrc: "/audio/hr/greben.mp3" },
              { text: "Vrh", correct: false, imageSrc: "/vrh.svg", audioSrc: "/audio/hr/vrh.mp3" },
              { text: "Degenija", correct: false, imageSrc: "/degenija.svg", audioSrc: "/audio/hr/degenija.mp3" },
              { text: "Bura", correct: false, imageSrc: "/bura.svg", audioSrc: "/audio/hr/bura.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Bora wind"?',
            options: [
              { text: "Bura", correct: true, imageSrc: "/bura.svg", audioSrc: "/audio/hr/bura.mp3" },
              { text: "Greben", correct: false, imageSrc: "/greben.svg", audioSrc: "/audio/hr/greben.mp3" },
              { text: "Degenija", correct: false, imageSrc: "/degenija.svg", audioSrc: "/audio/hr/degenija.mp3" },
              { text: "Vrh", correct: false, imageSrc: "/vrh.svg", audioSrc: "/audio/hr/vrh.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Staze Velebita",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The high summit"',
            options: [
              { text: "Visoki vrh", correct: true, audioSrc: "/audio/hr/visoki_vrh.mp3" },
              { text: "Žuta degenija", correct: false, audioSrc: "/audio/hr/zuta_degenija.mp3" },
              { text: "Kameni greben", correct: false, audioSrc: "/audio/hr/kameni_greben.mp3" },
              { text: "Snažna bura", correct: false, audioSrc: "/audio/hr/snazna_bura.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Velebit preserves rare plants."',
            options: [
              { text: "Velebit čuva rijetko bilje.", correct: true, audioSrc: "/audio/hr/velebit_cuva_rijetko_bilje.mp3" },
              { text: "Žuta degenija raste na stijenama.", correct: false, audioSrc: "/audio/hr/zuta_degenija_raste_na_stijenama.mp3" },
              { text: "Planinari hodaju duž grebena.", correct: false, audioSrc: "/audio/hr/planinari_hodaju_duz_grebena.mp3" },
              { text: "Hladna bura puše s planine.", correct: false, audioSrc: "/audio/hr/hladna_bura_puse_s_planine.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Yellow degenia grows on the rocks."',
            options: [
              { text: "Žuta degenija raste na stijenama.", correct: true, audioSrc: "/audio/hr/zuta_degenija_raste_na_stijenama.mp3" },
              { text: "Velebit čuva rijetko bilje.", correct: false, audioSrc: "/audio/hr/velebit_cuva_rijetko_bilje.mp3" },
              { text: "Planinari hodaju duž grebena.", correct: false, audioSrc: "/audio/hr/planinari_hodaju_duz_grebena.mp3" },
              { text: "Hladna bura puše s planine.", correct: false, audioSrc: "/audio/hr/hladna_bura_puse_s_planine.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Hikers walk along the ridge."',
            options: [
              { text: "Planinari hodaju duž grebena.", correct: true, audioSrc: "/audio/hr/planinari_hodaju_duz_grebena.mp3" },
              { text: "Velebit čuva rijetko bilje.", correct: false, audioSrc: "/audio/hr/velebit_cuva_rijetko_bilje.mp3" },
              { text: "Žuta degenija raste na stijenama.", correct: false, audioSrc: "/audio/hr/zuta_degenija_raste_na_stijenama.mp3" },
              { text: "Hladna bura puše s planine.", correct: false, audioSrc: "/audio/hr/hladna_bura_puse_s_planine.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Premužićeva staza",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Cold bora wind blows from the mountain."',
            options: [
              { text: "Hladna bura puše s planine.", correct: true, audioSrc: "/audio/hr/hladna_bura_puse_s_planine.mp3" },
              { text: "Snijeg prekriva najviše vrhove.", correct: false, audioSrc: "/audio/hr/snijeg_prekriva_najvise_vrhove.mp3" },
              { text: "Premužićeva staza vodi kroz krš.", correct: false, audioSrc: "/audio/hr/premuziceva_staza_vodi_kroz_krs.mp3" },
              { text: "S vrha se vide jadranski otoci.", correct: false, audioSrc: "/audio/hr/s_vrha_se_vide_jadranski_otoci.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Snow covers the highest peaks."',
            options: [
              { text: "Snijeg prekriva najviše vrhove.", correct: true, audioSrc: "/audio/hr/snijeg_prekriva_najvise_vrhove.mp3" },
              { text: "Hladna bura puše s planine.", correct: false, audioSrc: "/audio/hr/hladna_bura_puse_s_planine.mp3" },
              { text: "Premužićeva staza vodi kroz krš.", correct: false, audioSrc: "/audio/hr/premuziceva_staza_vodi_kroz_krs.mp3" },
              { text: "S vrha se vide jadranski otoci.", correct: false, audioSrc: "/audio/hr/s_vrha_se_vide_jadranski_otoci.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The Premužić Trail leads through the karst."',
            options: [
              { text: "Premužićeva staza vodi kroz krš.", correct: true, audioSrc: "/audio/hr/premuziceva_staza_vodi_kroz_krs.mp3" },
              { text: "Snijeg prekriva najviše vrhove.", correct: false, audioSrc: "/audio/hr/snijeg_prekriva_najvise_vrhove.mp3" },
              { text: "Hladna bura puše s planine.", correct: false, audioSrc: "/audio/hr/hladna_bura_puse_s_planine.mp3" },
              { text: "S vrha se vide jadranski otoci.", correct: false, audioSrc: "/audio/hr/s_vrha_se_vide_jadranski_otoci.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "From the summit you can see the Adriatic islands."',
            options: [
              { text: "S vrha se vide jadranski otoci.", correct: true, audioSrc: "/audio/hr/s_vrha_se_vide_jadranski_otoci.mp3" },
              { text: "Premužićeva staza vodi kroz krš.", correct: false, audioSrc: "/audio/hr/premuziceva_staza_vodi_kroz_krs.mp3" },
              { text: "Snijeg prekriva najviše vrhove.", correct: false, audioSrc: "/audio/hr/snijeg_prekriva_najvise_vrhove.mp3" },
              { text: "Hladna bura puše s planine.", correct: false, audioSrc: "/audio/hr/hladna_bura_puse_s_planine.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Sjeverni Velebit",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Alpine wind brings clean air."',
            options: [
              { text: "Alpski vjetar donosi čist zrak.", correct: true, audioSrc: "/audio/hr/alpski_vjetar_donosi_cist_zrak.mp3" },
              { text: "Botanički vrt leži pod vrhom.", correct: false, audioSrc: "/audio/hr/botanicki_vrt_lezi_pod_vrhom.mp3" },
              { text: "Bijeli kamen blista na suncu.", correct: false, audioSrc: "/audio/hr/bijeli_kamen_blista_na_suncu.mp3" },
              { text: "Nacionalni park štiti Velebit.", correct: false, audioSrc: "/audio/hr/nacionalni_park_stiti_velebit.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The botanical garden lies below the peak."',
            options: [
              { text: "Botanički vrt leži pod vrhom.", correct: true, audioSrc: "/audio/hr/botanicki_vrt_lezi_pod_vrhom.mp3" },
              { text: "Alpski vjetar donosi čist zrak.", correct: false, audioSrc: "/audio/hr/alpski_vjetar_donosi_cist_zrak.mp3" },
              { text: "Bijeli kamen blista na suncu.", correct: false, audioSrc: "/audio/hr/bijeli_kamen_blista_na_suncu.mp3" },
              { text: "Nacionalni park štiti Velebit.", correct: false, audioSrc: "/audio/hr/nacionalni_park_stiti_velebit.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "White stone gleams in the sun."',
            options: [
              { text: "Bijeli kamen blista na suncu.", correct: true, audioSrc: "/audio/hr/bijeli_kamen_blista_na_suncu.mp3" },
              { text: "Alpski vjetar donosi čist zrak.", correct: false, audioSrc: "/audio/hr/alpski_vjetar_donosi_cist_zrak.mp3" },
              { text: "Botanički vrt leži pod vrhom.", correct: false, audioSrc: "/audio/hr/botanicki_vrt_lezi_pod_vrhom.mp3" },
              { text: "Nacionalni park štiti Velebit.", correct: false, audioSrc: "/audio/hr/nacionalni_park_stiti_velebit.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Evening lowers silence onto the mountain."',
            options: [
              { text: "Večer spušta tišinu na planinu.", correct: true, audioSrc: "/audio/hr/vecer_spusta_tisinu_na_planinu.mp3" },
              { text: "Alpski vjetar donosi čist zrak.", correct: false, audioSrc: "/audio/hr/alpski_vjetar_donosi_cist_zrak.mp3" },
              { text: "Botanički vrt leži pod vrhom.", correct: false, audioSrc: "/audio/hr/botanicki_vrt_lezi_pod_vrhom.mp3" },
              { text: "Nacionalni park štiti Velebit.", correct: false, audioSrc: "/audio/hr/nacionalni_park_stiti_velebit.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 57: KANJONI PAKLENICE I PENJANJE (Paklenica Canyons & Climbing)
  // ==========================================
  {
    order: 57,
    title: "Unit 57",
    description: "Kanjoni Paklenice i penjanje (Paklenica Canyons & Climbing)",
    lessons: [
      {
        order: 1,
        title: "Oprema i priroda Paklenice",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Climber"?',
            options: [
              { text: "Penjač", correct: true, imageSrc: "/penjac.svg", audioSrc: "/audio/hr/penjac.mp3" },
              { text: "Uže", correct: false, imageSrc: "/uze.svg", audioSrc: "/audio/hr/uze.mp3" },
              { text: "Špilja", correct: false, imageSrc: "/spilja.svg", audioSrc: "/audio/hr/spilja.mp3" },
              { text: "Bukva", correct: false, imageSrc: "/bukva.svg", audioSrc: "/audio/hr/bukva.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Rope"?',
            options: [
              { text: "Uže", correct: true, imageSrc: "/uze.svg", audioSrc: "/audio/hr/uze.mp3" },
              { text: "Penjač", correct: false, imageSrc: "/penjac.svg", audioSrc: "/audio/hr/penjac.mp3" },
              { text: "Špilja", correct: false, imageSrc: "/spilja.svg", audioSrc: "/audio/hr/spilja.mp3" },
              { text: "Bukva", correct: false, imageSrc: "/bukva.svg", audioSrc: "/audio/hr/bukva.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Cave"?',
            options: [
              { text: "Špilja", correct: true, imageSrc: "/spilja.svg", audioSrc: "/audio/hr/spilja.mp3" },
              { text: "Penjač", correct: false, imageSrc: "/penjac.svg", audioSrc: "/audio/hr/penjac.mp3" },
              { text: "Uže", correct: false, imageSrc: "/uze.svg", audioSrc: "/audio/hr/uze.mp3" },
              { text: "Bukva", correct: false, imageSrc: "/bukva.svg", audioSrc: "/audio/hr/bukva.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Beech tree"?',
            options: [
              { text: "Bukva", correct: true, imageSrc: "/bukva.svg", audioSrc: "/audio/hr/bukva.mp3" },
              { text: "Špilja", correct: false, imageSrc: "/spilja.svg", audioSrc: "/audio/hr/spilja.mp3" },
              { text: "Uže", correct: false, imageSrc: "/uze.svg", audioSrc: "/audio/hr/uze.mp3" },
              { text: "Penjač", correct: false, imageSrc: "/penjac.svg", audioSrc: "/audio/hr/penjac.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Uspon na Anića kuk",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The brave climber"',
            options: [
              { text: "Hrabri penjač", correct: true, audioSrc: "/audio/hr/hrabri_penjac.mp3" },
              { text: "Čvrsto uže", correct: false, audioSrc: "/audio/hr/cvrsto_uze.mp3" },
              { text: "Duboka špilja", correct: false, audioSrc: "/audio/hr/duboka_spilja.mp3" },
              { text: "Stara bukva", correct: false, audioSrc: "/audio/hr/stara_bukva.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The climber ascends the cliff."',
            options: [
              { text: "Penjač se uspinje uz liticu.", correct: true, audioSrc: "/audio/hr/penjac_se_uspinje_uz_liticu.mp3" },
              { text: "Čvrsto uže osigurava svaki korak.", correct: false, audioSrc: "/audio/hr/cvrsto_uze_osigurava_svaki_korak.mp3" },
              { text: "Špilja Manita peć krije sige.", correct: false, audioSrc: "/audio/hr/spilja_manita_pec_krije_sige.mp3" },
              { text: "Stare bukve tvore gustu šumu.", correct: false, audioSrc: "/audio/hr/stare_bukve_tvore_gustu_sumu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "A sturdy rope secures every step."',
            options: [
              { text: "Čvrsto uže osigurava svaki korak.", correct: true, audioSrc: "/audio/hr/cvrsto_uze_osigurava_svaki_korak.mp3" },
              { text: "Penjač se uspinje uz liticu.", correct: false, audioSrc: "/audio/hr/penjac_se_uspinje_uz_liticu.mp3" },
              { text: "Špilja Manita peć krije sige.", correct: false, audioSrc: "/audio/hr/spilja_manita_pec_krije_sige.mp3" },
              { text: "Stare bukve tvore gustu šumu.", correct: false, audioSrc: "/audio/hr/stare_bukve_tvore_gustu_sumu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Manita Peć cave hides stalactites."',
            options: [
              { text: "Špilja Manita peć krije sige.", correct: true, audioSrc: "/audio/hr/spilja_manita_pec_krije_sige.mp3" },
              { text: "Penjač se uspinje uz liticu.", correct: false, audioSrc: "/audio/hr/penjac_se_uspinje_uz_liticu.mp3" },
              { text: "Čvrsto uže osigurava svaki korak.", correct: false, audioSrc: "/audio/hr/cvrsto_uze_osigurava_svaki_korak.mp3" },
              { text: "Stare bukve tvore gustu šumu.", correct: false, audioSrc: "/audio/hr/stare_bukve_tvore_gustu_sumu.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Klanac Velike Paklenice",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Old beech trees form a dense forest."',
            options: [
              { text: "Stare bukve tvore gustu šumu.", correct: true, audioSrc: "/audio/hr/stare_bukve_tvore_gustu_sumu.mp3" },
              { text: "Kanjon Velike Paklenice je strm.", correct: false, audioSrc: "/audio/hr/kanjon_velike_paklenice_je_strm.mp3" },
              { text: "Penjači dolaze iz cijelog svijeta.", correct: false, audioSrc: "/audio/hr/penjaci_dolaze_iz_cijelog_svijeta.mp3" },
              { text: "Hlad u špilji osvježava izletnike.", correct: false, audioSrc: "/audio/hr/hlad_u_spilji_osvjezava_izletnike.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The canyon of Velika Paklenica is steep."',
            options: [
              { text: "Kanjon Velike Paklenice je strm.", correct: true, audioSrc: "/audio/hr/kanjon_velike_paklenice_je_strm.mp3" },
              { text: "Stare bukve tvore gustu šumu.", correct: false, audioSrc: "/audio/hr/stare_bukve_tvore_gustu_sumu.mp3" },
              { text: "Penjači dolaze iz cijelog svijeta.", correct: false, audioSrc: "/audio/hr/penjaci_dolaze_iz_cijelog_svijeta.mp3" },
              { text: "Hlad u špilji osvježava izletnike.", correct: false, audioSrc: "/audio/hr/hlad_u_spilji_osvjezava_izletnike.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Climbers come from all over the world."',
            options: [
              { text: "Penjači dolaze iz cijelog svijeta.", correct: true, audioSrc: "/audio/hr/penjaci_dolaze_iz_cijelog_svijeta.mp3" },
              { text: "Kanjon Velike Paklenice je strm.", correct: false, audioSrc: "/audio/hr/kanjon_velike_paklenice_je_strm.mp3" },
              { text: "Stare bukve tvore gustu šumu.", correct: false, audioSrc: "/audio/hr/stare_bukve_tvore_gustu_sumu.mp3" },
              { text: "Hlad u špilji osvježava izletnike.", correct: false, audioSrc: "/audio/hr/hlad_u_spilji_osvjezava_izletnike.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The coolness in the cave refreshes hikers."',
            options: [
              { text: "Hlad u špilji osvježava izletnike.", correct: true, audioSrc: "/audio/hr/hlad_u_spilji_osvjezava_izletnike.mp3" },
              { text: "Kanjon Velike Paklenice je strm.", correct: false, audioSrc: "/audio/hr/kanjon_velike_paklenice_je_strm.mp3" },
              { text: "Penjači dolaze iz cijelog svijeta.", correct: false, audioSrc: "/audio/hr/penjaci_dolaze_iz_cijelog_svijeta.mp3" },
              { text: "Stare bukve tvore gustu šumu.", correct: false, audioSrc: "/audio/hr/stare_bukve_tvore_gustu_sumu.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Sjenoviti klanac",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Clear water flows along the bottom of the gorge."',
            options: [
              { text: "Bistra voda teče dnom klanca.", correct: true, audioSrc: "/audio/hr/bistra_voda_tece_dnom_klanca.mp3" },
              { text: "Sokol kruži iznad visoke stijene.", correct: false, audioSrc: "/audio/hr/sokol_kruzi_iznad_visoke_stijene.mp3" },
              { text: "Staza prolazi kroz sjenovitu šumu.", correct: false, audioSrc: "/audio/hr/staza_prolazi_kroz_sjenovitu_sumu.mp3" },
              { text: "Planinarski dom nudi topli čaj.", correct: false, audioSrc: "/audio/hr/planinarski_dom_nudi_topli_caj.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "A falcon circles above the high cliff."',
            options: [
              { text: "Sokol kruži iznad visoke stijene.", correct: true, audioSrc: "/audio/hr/sokol_kruzi_iznad_visoke_stijene.mp3" },
              { text: "Bistra voda teče dnom klanca.", correct: false, audioSrc: "/audio/hr/bistra_voda_tece_dnom_klanca.mp3" },
              { text: "Staza prolazi kroz sjenovitu šumu.", correct: false, audioSrc: "/audio/hr/staza_prolazi_kroz_sjenovitu_sumu.mp3" },
              { text: "Planinarski dom nudi topli čaj.", correct: false, audioSrc: "/audio/hr/planinarski_dom_nudi_topli_caj.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The mountain hut offers warm tea."',
            options: [
              { text: "Planinarski dom nudi topli čaj.", correct: true, audioSrc: "/audio/hr/planinarski_dom_nudi_topli_caj.mp3" },
              { text: "Bistra voda teče dnom klanca.", correct: false, audioSrc: "/audio/hr/bistra_voda_tece_dnom_klanca.mp3" },
              { text: "Sokol kruži iznad visoke stijene.", correct: false, audioSrc: "/audio/hr/sokol_kruzi_iznad_visoke_stijene.mp3" },
              { text: "Staza prolazi kroz sjenovitu šumu.", correct: false, audioSrc: "/audio/hr/staza_prolazi_kroz_sjenovitu_sumu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Paklenica connects the mountain and the sea."',
            options: [
              { text: "Paklenica spaja planinu i more.", correct: true, audioSrc: "/audio/hr/paklenica_spaja_planinu_i_more.mp3" },
              { text: "Bistra voda teče dnom klanca.", correct: false, audioSrc: "/audio/hr/bistra_voda_tece_dnom_klanca.mp3" },
              { text: "Sokol kruži iznad visoke stijene.", correct: false, audioSrc: "/audio/hr/sokol_kruzi_iznad_visoke_stijene.mp3" },
              { text: "Planinarski dom nudi topli čaj.", correct: false, audioSrc: "/audio/hr/planinarski_dom_nudi_topli_caj.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 58: UTOČIŠTE ZA MEDVJEDE U KUTEREVU (Kuterevo Bear Sanctuary)
  // ==========================================
  {
    order: 58,
    title: "Unit 58",
    description: "Utočište za medvjede u Kuterevu (Kuterevo Bear Sanctuary & Forest Wildlife)",
    lessons: [
      {
        order: 1,
        title: "Šumske životinje i utočište",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Bear cub"?',
            options: [
              { text: "Medvjedić", correct: true, imageSrc: "/medvjedic.svg", audioSrc: "/audio/hr/medvjedic.mp3" },
              { text: "Utočište", correct: false, imageSrc: "/utociste.svg", audioSrc: "/audio/hr/utociste.mp3" },
              { text: "Ris", correct: false, imageSrc: "/ris.svg", audioSrc: "/audio/hr/ris.mp3" },
              { text: "Sova", correct: false, imageSrc: "/sova.svg", audioSrc: "/audio/hr/sova.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Sanctuary"?',
            options: [
              { text: "Utočište", correct: true, imageSrc: "/utociste.svg", audioSrc: "/audio/hr/utociste.mp3" },
              { text: "Medvjedić", correct: false, imageSrc: "/medvjedic.svg", audioSrc: "/audio/hr/medvjedic.mp3" },
              { text: "Ris", correct: false, imageSrc: "/ris.svg", audioSrc: "/audio/hr/ris.mp3" },
              { text: "Sova", correct: false, imageSrc: "/sova.svg", audioSrc: "/audio/hr/sova.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Lynx"?',
            options: [
              { text: "Ris", correct: true, imageSrc: "/ris.svg", audioSrc: "/audio/hr/ris.mp3" },
              { text: "Medvjedić", correct: false, imageSrc: "/medvjedic.svg", audioSrc: "/audio/hr/medvjedic.mp3" },
              { text: "Utočište", correct: false, imageSrc: "/utociste.svg", audioSrc: "/audio/hr/utociste.mp3" },
              { text: "Sova", correct: false, imageSrc: "/sova.svg", audioSrc: "/audio/hr/sova.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Owl"?',
            options: [
              { text: "Sova", correct: true, imageSrc: "/sova.svg", audioSrc: "/audio/hr/sova.mp3" },
              { text: "Ris", correct: false, imageSrc: "/ris.svg", audioSrc: "/audio/hr/ris.mp3" },
              { text: "Utočište", correct: false, imageSrc: "/utociste.svg", audioSrc: "/audio/hr/utociste.mp3" },
              { text: "Medvjedić", correct: false, imageSrc: "/medvjedic.svg", audioSrc: "/audio/hr/medvjedic.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Život u Kuterevu",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The little bear cub"',
            options: [
              { text: "Mali medvjedić", correct: true, audioSrc: "/audio/hr/mali_medvjedic.mp3" },
              { text: "Šumsko utočište", correct: false, audioSrc: "/audio/hr/sumsko_utociste.mp3" },
              { text: "Brzi ris", correct: false, audioSrc: "/audio/hr/brzi_ris.mp3" },
              { text: "Noćna sova", correct: false, audioSrc: "/audio/hr/nocna_sova.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Bear cubs play in Kuterevo."',
            options: [
              { text: "Medvjedići se igraju u Kuterevu.", correct: true, audioSrc: "/audio/hr/medvjedici_se_igraju_u_kuterevu.mp3" },
              { text: "Utočište pomaže mladim medvjedima.", correct: false, audioSrc: "/audio/hr/utociste_pomaze_mladim_medvjedima.mp3" },
              { text: "Oprezni ris tiho hoda šumom.", correct: false, audioSrc: "/audio/hr/oprezni_ris_tiho_hoda_sumom.mp3" },
              { text: "Sova gleda s visoke grane.", correct: false, audioSrc: "/audio/hr/sova_gleda_s_visoke_grane.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The sanctuary helps young bears."',
            options: [
              { text: "Utočište pomaže mladim medvjedima.", correct: true, audioSrc: "/audio/hr/utociste_pomaze_mladim_medvjedima.mp3" },
              { text: "Medvjedići se igraju u Kuterevu.", correct: false, audioSrc: "/audio/hr/medvjedici_se_igraju_u_kuterevu.mp3" },
              { text: "Oprezni ris tiho hoda šumom.", correct: false, audioSrc: "/audio/hr/oprezni_ris_tiho_hoda_sumom.mp3" },
              { text: "Sova gleda s visoke grane.", correct: false, audioSrc: "/audio/hr/sova_gleda_s_visoke_grane.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "A cautious lynx walks quietly through the forest."',
            options: [
              { text: "Oprezni ris tiho hoda šumom.", correct: true, audioSrc: "/audio/hr/oprezni_ris_tiho_hoda_sumom.mp3" },
              { text: "Medvjedići se igraju u Kuterevu.", correct: false, audioSrc: "/audio/hr/medvjedici_se_igraju_u_kuterevu.mp3" },
              { text: "Utočište pomaže mladim medvjedima.", correct: false, audioSrc: "/audio/hr/utociste_pomaze_mladim_medvjedima.mp3" },
              { text: "Sova gleda s visoke grane.", correct: false, audioSrc: "/audio/hr/sova_gleda_s_visoke_grane.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Briga o divljini",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Volunteers care for forest animals."',
            options: [
              { text: "Volonteri brinu o šumskim životinjama.", correct: true, audioSrc: "/audio/hr/volonteri_brinu_o_sumskim_zivotinjama.mp3" },
              { text: "Mladi medvjedić traži šumsko voće.", correct: false, audioSrc: "/audio/hr/mladi_medvjedic_trazi_sumsko_voce.mp3" },
              { text: "Drvene ograde okružuju velik prostor.", correct: false, audioSrc: "/audio/hr/drvene_ograde_okruzuju_veliki_prostor.mp3" },
              { text: "Posjetitelji uče poštovati divljinu.", correct: false, audioSrc: "/audio/hr/posjetitelji_uce_postovati_divljinu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The young bear cub looks for forest berries."',
            options: [
              { text: "Mladi medvjedić traži šumsko voće.", correct: true, audioSrc: "/audio/hr/mladi_medvjedic_trazi_sumsko_voce.mp3" },
              { text: "Volonteri brinu o šumskim životinjama.", correct: false, audioSrc: "/audio/hr/volonteri_brinu_o_sumskim_zivotinjama.mp3" },
              { text: "Drvene ograde okružuju velik prostor.", correct: false, audioSrc: "/audio/hr/drvene_ograde_okruzuju_veliki_prostor.mp3" },
              { text: "Posjetitelji uče poštovati divljinu.", correct: false, audioSrc: "/audio/hr/posjetitelji_uce_postovati_divljinu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Wooden fences surround a large area."',
            options: [
              { text: "Drvene ograde okružuju velik prostor.", correct: true, audioSrc: "/audio/hr/drvene_ograde_okruzuju_veliki_prostor.mp3" },
              { text: "Volonteri brinu o šumskim životinjama.", correct: false, audioSrc: "/audio/hr/volonteri_brinu_o_sumskim_zivotinjama.mp3" },
              { text: "Mladi medvjedić traži šumsko voće.", correct: false, audioSrc: "/audio/hr/mladi_medvjedic_trazi_sumsko_voce.mp3" },
              { text: "Posjetitelji uče poštovati divljinu.", correct: false, audioSrc: "/audio/hr/posjetitelji_uce_postovati_divljinu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Visitors learn to respect the wilderness."',
            options: [
              { text: "Posjetitelji uče poštovati divljinu.", correct: true, audioSrc: "/audio/hr/posjetitelji_uce_postovati_divljinu.mp3" },
              { text: "Volonteri brinu o šumskim životinjama.", correct: false, audioSrc: "/audio/hr/volonteri_brinu_o_sumskim_zivotinjama.mp3" },
              { text: "Mladi medvjedić traži šumsko voće.", correct: false, audioSrc: "/audio/hr/mladi_medvjedic_trazi_sumsko_voce.mp3" },
              { text: "Drvene ograde okružuju velik prostor.", correct: false, audioSrc: "/audio/hr/drvene_ograde_okruzuju_veliki_prostor.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Mir šume",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Dense firs protect the peace of the forest."',
            options: [
              { text: "Guste jele štite mir šume.", correct: true, audioSrc: "/audio/hr/guste_jele_stite_mir_sume.mp3" },
              { text: "Jesen donosi obilje šumskih plodova.", correct: false, audioSrc: "/audio/hr/jesen_donosi_obilje_sumskih_plodova.mp3" },
              { text: "Selo Kuterevo čuva prirodnu ravnotežu.", correct: false, audioSrc: "/audio/hr/selo_kuterevo_cuva_prirodnu_ravnotezu.mp3" },
              { text: "Noću se čuje pjev šumskih ptica.", correct: false, audioSrc: "/audio/hr/nocu_se_cuje_pjev_sumskih_ptica.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Autumn brings an abundance of forest fruits."',
            options: [
              { text: "Jesen donosi obilje šumskih plodova.", correct: true, audioSrc: "/audio/hr/jesen_donosi_obilje_sumskih_plodova.mp3" },
              { text: "Guste jele štite mir šume.", correct: false, audioSrc: "/audio/hr/guste_jele_stite_mir_sume.mp3" },
              { text: "Selo Kuterevo čuva prirodnu ravnotežu.", correct: false, audioSrc: "/audio/hr/selo_kuterevo_cuva_prirodnu_ravnotezu.mp3" },
              { text: "Noću se čuje pjev šumskih ptica.", correct: false, audioSrc: "/audio/hr/nocu_se_cuje_pjev_sumskih_ptica.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The village of Kuterevo preserves natural balance."',
            options: [
              { text: "Selo Kuterevo čuva prirodnu ravnotežu.", correct: true, audioSrc: "/audio/hr/selo_kuterevo_cuva_prirodnu_ravnotezu.mp3" },
              { text: "Guste jele štite mir šume.", correct: false, audioSrc: "/audio/hr/guste_jele_stite_mir_sume.mp3" },
              { text: "Jesen donosi obilje šumskih plodova.", correct: false, audioSrc: "/audio/hr/jesen_donosi_obilje_sumskih_plodova.mp3" },
              { text: "Noću se čuje pjev šumskih ptica.", correct: false, audioSrc: "/audio/hr/nocu_se_cuje_pjev_sumskih_ptica.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "At night you can hear the song of forest birds."',
            options: [
              { text: "Noću se čuje pjev šumskih ptica.", correct: true, audioSrc: "/audio/hr/nocu_se_cuje_pjev_sumskih_ptica.mp3" },
              { text: "Guste jele štite mir šume.", correct: false, audioSrc: "/audio/hr/guste_jele_stite_mir_sume.mp3" },
              { text: "Jesen donosi obilje šumskih plodova.", correct: false, audioSrc: "/audio/hr/jesen_donosi_obilje_sumskih_plodova.mp3" },
              { text: "Selo Kuterevo čuva prirodnu ravnotežu.", correct: false, audioSrc: "/audio/hr/selo_kuterevo_cuva_prirodnu_ravnotezu.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 59: IZVORI GACKE I PASTRVE (Gacka Crystal Springs & Trout River)
  // ==========================================
  {
    order: 59,
    title: "Unit 59",
    description: "Izvori Gacke i pastrve (Gacka Crystal Springs & Trout River)",
    lessons: [
      {
        order: 1,
        title: "Bistra rijeka Gacka",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Spring"?',
            options: [
              { text: "Vrilo", correct: true, imageSrc: "/vrilo.svg", audioSrc: "/audio/hr/vrilo.mp3" },
              { text: "Pastrva", correct: false, imageSrc: "/pastrva.svg", audioSrc: "/audio/hr/pastrva.mp3" },
              { text: "Potok", correct: false, imageSrc: "/potok.svg", audioSrc: "/audio/hr/potok.mp3" },
              { text: "Mostić", correct: false, imageSrc: "/mostic.svg", audioSrc: "/audio/hr/mostic.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Trout"?',
            options: [
              { text: "Pastrva", correct: true, imageSrc: "/pastrva.svg", audioSrc: "/audio/hr/pastrva.mp3" },
              { text: "Vrilo", correct: false, imageSrc: "/vrilo.svg", audioSrc: "/audio/hr/vrilo.mp3" },
              { text: "Potok", correct: false, imageSrc: "/potok.svg", audioSrc: "/audio/hr/potok.mp3" },
              { text: "Mostić", correct: false, imageSrc: "/mostic.svg", audioSrc: "/audio/hr/mostic.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Stream"?',
            options: [
              { text: "Potok", correct: true, imageSrc: "/potok.svg", audioSrc: "/audio/hr/potok.mp3" },
              { text: "Vrilo", correct: false, imageSrc: "/vrilo.svg", audioSrc: "/audio/hr/vrilo.mp3" },
              { text: "Pastrva", correct: false, imageSrc: "/pastrva.svg", audioSrc: "/audio/hr/pastrva.mp3" },
              { text: "Mostić", correct: false, imageSrc: "/mostic.svg", audioSrc: "/audio/hr/mostic.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Footbridge"?',
            options: [
              { text: "Mostić", correct: true, imageSrc: "/mostic.svg", audioSrc: "/audio/hr/mostic.mp3" },
              { text: "Potok", correct: false, imageSrc: "/potok.svg", audioSrc: "/audio/hr/potok.mp3" },
              { text: "Pastrva", correct: false, imageSrc: "/pastrva.svg", audioSrc: "/audio/hr/pastrva.mp3" },
              { text: "Vrilo", correct: false, imageSrc: "/vrilo.svg", audioSrc: "/audio/hr/vrilo.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Majerovo vrilo",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The clear spring"',
            options: [
              { text: "Bistro vrilo", correct: true, audioSrc: "/audio/hr/bistro_vrilo.mp3" },
              { text: "Riječna pastrva", correct: false, audioSrc: "/audio/hr/rijecna_pastrva.mp3" },
              { text: "Hladni potok", correct: false, audioSrc: "/audio/hr/hladni_potok.mp3" },
              { text: "Drveni mostić", correct: false, audioSrc: "/audio/hr/drveni_mostic.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Majerovo Vrilo springs from stone."',
            options: [
              { text: "Majerovo vrilo izvire iz kamena.", correct: true, audioSrc: "/audio/hr/majerovo_vrilo_izvire_iz_kamena.mp3" },
              { text: "Pastrva pliva u bistroj Gacki.", correct: false, audioSrc: "/audio/hr/pastrva_pliva_u_bistroj_gacki.mp3" },
              { text: "Hladni potok spaja se s rijekom.", correct: false, audioSrc: "/audio/hr/hladni_potok_spaja_se_s_rijekom.mp3" },
              { text: "Prelazimo mali drveni mostić.", correct: false, audioSrc: "/audio/hr/prelazimo_mali_drveni_mostic.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "A trout swims in the clear Gacka."',
            options: [
              { text: "Pastrva pliva u bistroj Gacki.", correct: true, audioSrc: "/audio/hr/pastrva_pliva_u_bistroj_gacki.mp3" },
              { text: "Majerovo vrilo izvire iz kamena.", correct: false, audioSrc: "/audio/hr/majerovo_vrilo_izvire_iz_kamena.mp3" },
              { text: "Hladni potok spaja se s rijekom.", correct: false, audioSrc: "/audio/hr/hladni_potok_spaja_se_s_rijekom.mp3" },
              { text: "Prelazimo mali drveni mostić.", correct: false, audioSrc: "/audio/hr/prelazimo_mali_drveni_mostic.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "We cross a small wooden footbridge."',
            options: [
              { text: "Prelazimo mali drveni mostić.", correct: true, audioSrc: "/audio/hr/prelazimo_mali_drveni_mostic.mp3" },
              { text: "Majerovo vrilo izvire iz kamena.", correct: false, audioSrc: "/audio/hr/majerovo_vrilo_izvire_iz_kamena.mp3" },
              { text: "Pastrva pliva u bistroj Gacki.", correct: false, audioSrc: "/audio/hr/pastrva_pliva_u_bistroj_gacki.mp3" },
              { text: "Hladni potok spaja se s rijekom.", correct: false, audioSrc: "/audio/hr/hladni_potok_spaja_se_s_rijekom.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Vodenice na Gacki",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The water of the Gacka is exceptionally clean."',
            options: [
              { text: "Voda Gacke iznimno je čista.", correct: true, audioSrc: "/audio/hr/voda_gacke_iznimno_je_cista.mp3" },
              { text: "Stare vodenice još uvijek melju.", correct: false, audioSrc: "/audio/hr/stare_vodenice_jos_uvijek_melju.mp3" },
              { text: "Zelena trava okružuje modro jezerce.", correct: false, audioSrc: "/audio/hr/zelena_trava_okruzuje_modro_jezerce.mp3" },
              { text: "Ribiči promatraju tihu površinu vode.", correct: false, audioSrc: "/audio/hr/ribici_promatraju_tihu_povrsinu_vode.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Old watermills still grind grain."',
            options: [
              { text: "Stare vodenice još uvijek melju.", correct: true, audioSrc: "/audio/hr/stare_vodenice_jos_uvijek_melju.mp3" },
              { text: "Voda Gacke iznimno je čista.", correct: false, audioSrc: "/audio/hr/voda_gacke_iznimno_je_cista.mp3" },
              { text: "Zelena trava okružuje modro jezerce.", correct: false, audioSrc: "/audio/hr/zelena_trava_okruzuje_modro_jezerce.mp3" },
              { text: "Ribiči promatraju tihu površinu vode.", correct: false, audioSrc: "/audio/hr/ribici_promatraju_tihu_povrsinu_vode.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Green grass surrounds the deep blue pond."',
            options: [
              { text: "Zelena trava okružuje modro jezerce.", correct: true, audioSrc: "/audio/hr/zelena_trava_okruzuje_modro_jezerce.mp3" },
              { text: "Voda Gacke iznimno je čista.", correct: false, audioSrc: "/audio/hr/voda_gacke_iznimno_je_cista.mp3" },
              { text: "Stare vodenice još uvijek melju.", correct: false, audioSrc: "/audio/hr/stare_vodenice_jos_uvijek_melju.mp3" },
              { text: "Ribiči promatraju tihu površinu vode.", correct: false, audioSrc: "/audio/hr/ribici_promatraju_tihu_povrsinu_vode.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Anglers watch the quiet surface of the water."',
            options: [
              { text: "Ribiči promatraju tihu površinu vode.", correct: true, audioSrc: "/audio/hr/ribici_promatraju_tihu_povrsinu_vode.mp3" },
              { text: "Voda Gacke iznimno je čista.", correct: false, audioSrc: "/audio/hr/voda_gacke_iznimno_je_cista.mp3" },
              { text: "Stare vodenice još uvijek melju.", correct: false, audioSrc: "/audio/hr/stare_vodenice_jos_uvijek_melju.mp3" },
              { text: "Zelena trava okružuje modro jezerce.", correct: false, audioSrc: "/audio/hr/zelena_trava_okruzuje_modro_jezerce.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Gacka dolina",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The transparent spring reflects the blue sky."',
            options: [
              { text: "Prozirni izvor odražava plavo nebo.", correct: true, audioSrc: "/audio/hr/prozirni_izvor_odrazava_plavo_nebo.mp3" },
              { text: "Gacka teče mirno kroz polje.", correct: false, audioSrc: "/audio/hr/gacka_tece_mirno_kroz_polje.mp3" },
              { text: "Jutarnja svježina budi cijelu dolinu.", correct: false, audioSrc: "/audio/hr/jutarnja_svjezina_budi_cijelu_dolinu.mp3" },
              { text: "Hladni potok spaja se s rijekom.", correct: false, audioSrc: "/audio/hr/hladni_potok_spaja_se_s_rijekom.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The Gacka flows calmly through the field."',
            options: [
              { text: "Gacka teče mirno kroz polje.", correct: true, audioSrc: "/audio/hr/gacka_tece_mirno_kroz_polje.mp3" },
              { text: "Prozirni izvor odražava plavo nebo.", correct: false, audioSrc: "/audio/hr/prozirni_izvor_odrazava_plavo_nebo.mp3" },
              { text: "Jutarnja svježina budi cijelu dolinu.", correct: false, audioSrc: "/audio/hr/jutarnja_svjezina_budi_cijelu_dolinu.mp3" },
              { text: "Hladni potok spaja se s rijekom.", correct: false, audioSrc: "/audio/hr/hladni_potok_spaja_se_s_rijekom.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The cold stream joins the river."',
            options: [
              { text: "Hladni potok spaja se s rijekom.", correct: true, audioSrc: "/audio/hr/hladni_potok_spaja_se_s_rijekom.mp3" },
              { text: "Prozirni izvor odražava plavo nebo.", correct: false, audioSrc: "/audio/hr/prozirni_izvor_odrazava_plavo_nebo.mp3" },
              { text: "Gacka teče mirno kroz polje.", correct: false, audioSrc: "/audio/hr/gacka_tece_mirno_kroz_polje.mp3" },
              { text: "Jutarnja svježina budi cijelu dolinu.", correct: false, audioSrc: "/audio/hr/jutarnja_svjezina_budi_cijelu_dolinu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Morning freshness awakens the entire valley."',
            options: [
              { text: "Jutarnja svježina budi cijelu dolinu.", correct: true, audioSrc: "/audio/hr/jutarnja_svjezina_budi_cijelu_dolinu.mp3" },
              { text: "Prozirni izvor odražava plavo nebo.", correct: false, audioSrc: "/audio/hr/prozirni_izvor_odrazava_plavo_nebo.mp3" },
              { text: "Gacka teče mirno kroz polje.", correct: false, audioSrc: "/audio/hr/gacka_tece_mirno_kroz_polje.mp3" },
              { text: "Hladni potok spaja se s rijekom.", correct: false, audioSrc: "/audio/hr/hladni_potok_spaja_se_s_rijekom.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 60: LIČKA BAŠTINA I GORŠTACI (Lika Highlander Heritage Capstone)
  // ==========================================
  {
    order: 60,
    title: "Unit 60",
    description: "Lička baština i gorštaci (Lika Highlander Heritage Capstone)",
    lessons: [
      {
        order: 1,
        title: "Blago Like",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Cabin"?',
            options: [
              { text: "Koliba", correct: true, imageSrc: "/koliba.svg", audioSrc: "/audio/hr/koliba.mp3" },
              { text: "Krumpir", correct: false, imageSrc: "/krumpir.svg", audioSrc: "/audio/hr/krumpir.mp3" },
              { text: "Škripavac", correct: false, imageSrc: "/skripavac.svg", audioSrc: "/audio/hr/skripavac.mp3" },
              { text: "Vuna", correct: false, imageSrc: "/vuna.svg", audioSrc: "/audio/hr/vuna.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Potato"?',
            options: [
              { text: "Krumpir", correct: true, imageSrc: "/krumpir.svg", audioSrc: "/audio/hr/krumpir.mp3" },
              { text: "Koliba", correct: false, imageSrc: "/koliba.svg", audioSrc: "/audio/hr/koliba.mp3" },
              { text: "Škripavac", correct: false, imageSrc: "/skripavac.svg", audioSrc: "/audio/hr/skripavac.mp3" },
              { text: "Vuna", correct: false, imageSrc: "/vuna.svg", audioSrc: "/audio/hr/vuna.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Squeaky cheese"?',
            options: [
              { text: "Škripavac", correct: true, imageSrc: "/skripavac.svg", audioSrc: "/audio/hr/skripavac.mp3" },
              { text: "Koliba", correct: false, imageSrc: "/koliba.svg", audioSrc: "/audio/hr/koliba.mp3" },
              { text: "Krumpir", correct: false, imageSrc: "/krumpir.svg", audioSrc: "/audio/hr/krumpir.mp3" },
              { text: "Vuna", correct: false, imageSrc: "/vuna.svg", audioSrc: "/audio/hr/vuna.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Wool"?',
            options: [
              { text: "Vuna", correct: true, imageSrc: "/vuna.svg", audioSrc: "/audio/hr/vuna.mp3" },
              { text: "Škripavac", correct: false, imageSrc: "/skripavac.svg", audioSrc: "/audio/hr/skripavac.mp3" },
              { text: "Krumpir", correct: false, imageSrc: "/krumpir.svg", audioSrc: "/audio/hr/krumpir.mp3" },
              { text: "Koliba", correct: false, imageSrc: "/koliba.svg", audioSrc: "/audio/hr/koliba.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Okusi i toplina Like",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The wooden cabin"',
            options: [
              { text: "Drvena koliba", correct: true, audioSrc: "/audio/hr/drvena_koliba.mp3" },
              { text: "Lički krumpir", correct: false, audioSrc: "/audio/hr/licki_krumpir.mp3" },
              { text: "Svježi škripavac", correct: false, audioSrc: "/audio/hr/svjezi_skripavac.mp3" },
              { text: "Topla vuna", correct: false, audioSrc: "/audio/hr/topla_vuna.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "A wooden cabin stands beneath the firs."',
            options: [
              { text: "Drvena koliba stoji pod jelama.", correct: true, audioSrc: "/audio/hr/drvena_koliba_stoji_pod_jelama.mp3" },
              { text: "Lički krumpir peče se u pećnici.", correct: false, audioSrc: "/audio/hr/licki_krumpir_pece_se_u_pecnici.mp3" },
              { text: "Svježi škripavac škripi pod zubima.", correct: false, audioSrc: "/audio/hr/svjezi_skripavac_skripi_pod_zubima.mp3" },
              { text: "Bake pletu čarape od vune.", correct: false, audioSrc: "/audio/hr/bake_pletu_carape_od_vune.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Lika potatoes bake in the oven."',
            options: [
              { text: "Lički krumpir peče se u pećnici.", correct: true, audioSrc: "/audio/hr/licki_krumpir_pece_se_u_pecnici.mp3" },
              { text: "Drvena koliba stoji pod jelama.", correct: false, audioSrc: "/audio/hr/drvena_koliba_stoji_pod_jelama.mp3" },
              { text: "Svježi škripavac škripi pod zubima.", correct: false, audioSrc: "/audio/hr/svjezi_skripavac_skripi_pod_zubima.mp3" },
              { text: "Bake pletu čarape od vune.", correct: false, audioSrc: "/audio/hr/bake_pletu_carape_od_vune.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Fresh škripavac cheese squeaks under your teeth."',
            options: [
              { text: "Svježi škripavac škripi pod zubima.", correct: true, audioSrc: "/audio/hr/svjezi_skripavac_skripi_pod_zubima.mp3" },
              { text: "Drvena koliba stoji pod jelama.", correct: false, audioSrc: "/audio/hr/drvena_koliba_stoji_pod_jelama.mp3" },
              { text: "Lički krumpir peče se u pećnici.", correct: false, audioSrc: "/audio/hr/licki_krumpir_pece_se_u_pecnici.mp3" },
              { text: "Bake pletu čarape od vune.", correct: false, audioSrc: "/audio/hr/bake_pletu_carape_od_vune.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Zima pod Velebitom",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Grandmothers knit socks from wool."',
            options: [
              { text: "Bake pletu čarape od vune.", correct: true, audioSrc: "/audio/hr/bake_pletu_carape_od_vune.mp3" },
              { text: "Zima u Lici donosi dubok snijeg.", correct: false, audioSrc: "/audio/hr/zima_u_lici_donosi_dubok_snijeg.mp3" },
              { text: "Tople peći griju planinske domove.", correct: false, audioSrc: "/audio/hr/tople_peci_griju_planinske_domove.mp3" },
              { text: "Gorštaci čuvaju snagu i gostoljubivost.", correct: false, audioSrc: "/audio/hr/gorstaci_cuvaju_snagu_i_gostoljubivost.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Winter in Lika brings deep snow."',
            options: [
              { text: "Zima u Lici donosi dubok snijeg.", correct: true, audioSrc: "/audio/hr/zima_u_lici_donosi_dubok_snijeg.mp3" },
              { text: "Bake pletu čarape od vune.", correct: false, audioSrc: "/audio/hr/bake_pletu_carape_od_vune.mp3" },
              { text: "Tople peći griju planinske domove.", correct: false, audioSrc: "/audio/hr/tople_peci_griju_planinske_domove.mp3" },
              { text: "Gorštaci čuvaju snagu i gostoljubivost.", correct: false, audioSrc: "/audio/hr/gorstaci_cuvaju_snagu_i_gostoljubivost.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Warm stoves heat mountain homes."',
            options: [
              { text: "Tople peći griju planinske domove.", correct: true, audioSrc: "/audio/hr/tople_peci_griju_planinske_domove.mp3" },
              { text: "Zima u Lici donosi dubok snijeg.", correct: false, audioSrc: "/audio/hr/zima_u_lici_donosi_dubok_snijeg.mp3" },
              { text: "Bake pletu čarape od vune.", correct: false, audioSrc: "/audio/hr/bake_pletu_carape_od_vune.mp3" },
              { text: "Gorštaci čuvaju snagu i gostoljubivost.", correct: false, audioSrc: "/audio/hr/gorstaci_cuvaju_snagu_i_gostoljubivost.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Highlanders preserve strength and hospitality."',
            options: [
              { text: "Gorštaci čuvaju snagu i gostoljubivost.", correct: true, audioSrc: "/audio/hr/gorstaci_cuvaju_snagu_i_gostoljubivost.mp3" },
              { text: "Zima u Lici donosi dubok snijeg.", correct: false, audioSrc: "/audio/hr/zima_u_lici_donosi_dubok_snijeg.mp3" },
              { text: "Tople peći griju planinske domove.", correct: false, audioSrc: "/audio/hr/tople_peci_griju_planinske_domove.mp3" },
              { text: "Bake pletu čarape od vune.", correct: false, audioSrc: "/audio/hr/bake_pletu_carape_od_vune.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Ponos Like",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Song echoes through the fields of Lika."',
            options: [
              { text: "Pjesma odjekuje ličkim poljima.", correct: true, audioSrc: "/audio/hr/pjesma_odjekuje_lickim_poljima.mp3" },
              { text: "Svježi planinski zrak daje snagu.", correct: false, audioSrc: "/audio/hr/svjezi_planinski_zrak_daje_snagu.mp3" },
              { text: "Domaća trpeza okuplja cijelu obitelj.", correct: false, audioSrc: "/audio/hr/domaca_trpeza_okuplja_cijelu_obitelj.mp3" },
              { text: "Ponosni kraj spaja krš i šume.", correct: false, audioSrc: "/audio/hr/ponosni_kraj_spaja_krs_i_sume.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Fresh mountain air gives strength."',
            options: [
              { text: "Svježi planinski zrak daje snagu.", correct: true, audioSrc: "/audio/hr/svjezi_planinski_zrak_daje_snagu.mp3" },
              { text: "Pjesma odjekuje ličkim poljima.", correct: false, audioSrc: "/audio/hr/pjesma_odjekuje_lickim_poljima.mp3" },
              { text: "Domaća trpeza okuplja cijelu obitelj.", correct: false, audioSrc: "/audio/hr/domaca_trpeza_okuplja_cijelu_obitelj.mp3" },
              { text: "Ponosni kraj spaja krš i šume.", correct: false, audioSrc: "/audio/hr/ponosni_kraj_spaja_krs_i_sume.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The homemade table gathers the whole family."',
            options: [
              { text: "Domaća trpeza okuplja cijelu obitelj.", correct: true, audioSrc: "/audio/hr/domaca_trpeza_okuplja_cijelu_obitelj.mp3" },
              { text: "Pjesma odjekuje ličkim poljima.", correct: false, audioSrc: "/audio/hr/pjesma_odjekuje_lickim_poljima.mp3" },
              { text: "Svježi planinski zrak daje snagu.", correct: false, audioSrc: "/audio/hr/svjezi_planinski_zrak_daje_snagu.mp3" },
              { text: "Ponosni kraj spaja krš i šume.", correct: false, audioSrc: "/audio/hr/ponosni_kraj_spaja_krs_i_sume.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Congratulations, you have completed the twelfth world!"',
            options: [
              { text: "Čestitamo, završili ste dvanaesti svijet!", correct: true, audioSrc: "/audio/hr/cestitamo_zavrsili_ste_dvanaesti_svijet.mp3" },
              { text: "Pjesma odjekuje ličkim poljima!", correct: false, audioSrc: "/audio/hr/pjesma_odjekuje_lickim_poljima.mp3" },
              { text: "Domaća trpeza okuplja cijelu obitelj!", correct: false, audioSrc: "/audio/hr/domaca_trpeza_okuplja_cijelu_obitelj.mp3" },
              { text: "Ponosni kraj spaja krš i šume!", correct: false, audioSrc: "/audio/hr/ponosni_kraj_spaja_krs_i_sume.mp3" },
            ],
          },
        ],
      },
    ],
  },
];

async function seedWorld12() {
  console.log("🚀 Starting World 12 (Units 56–60: Velebit, Paklenica & Gacka) Seed...");

  const courseResult = await sql`SELECT id FROM courses WHERE title = 'Croatian' LIMIT 1;`;
  if (courseResult.length === 0) {
    throw new Error("Croatian course not found in database!");
  }
  const courseId = courseResult[0].id;
  console.log(`Target Course ID: ${courseId}`);

  for (const unit of unitsData) {
    console.log(`\nProcessing Unit ${unit.order}: "${unit.title} - ${unit.description}"...`);

    const existingUnit = await sql`
      SELECT id FROM units WHERE course_id = ${courseId} AND "order" = ${unit.order};
    `;

    let unitId: number;
    if (existingUnit.length > 0) {
      unitId = existingUnit[0].id;
      await sql`
        UPDATE units
        SET title = ${unit.title}, description = ${unit.description}
        WHERE id = ${unitId};
      `;
      console.log(`  Updated Unit record ID: ${unitId}`);
    } else {
      const inserted = await sql`
        INSERT INTO units (title, description, course_id, "order")
        VALUES (${unit.title}, ${unit.description}, ${courseId}, ${unit.order})
        RETURNING id;
      `;
      unitId = inserted[0].id;
      console.log(`  Created Unit record ID: ${unitId}`);
    }

    for (const lesson of unit.lessons) {
      console.log(`  Processing Lesson ${lesson.order}: "${lesson.title}"...`);
      const existingLesson = await sql`
        SELECT id FROM lessons WHERE unit_id = ${unitId} AND "order" = ${lesson.order};
      `;
      let lessonId: number;
      if (existingLesson.length > 0) {
        lessonId = existingLesson[0].id;
        await sql`
          UPDATE lessons SET title = ${lesson.title} WHERE id = ${lessonId};
        `;
      } else {
        const inserted = await sql`
          INSERT INTO lessons (title, unit_id, "order")
          VALUES (${lesson.title}, ${unitId}, ${lesson.order})
          RETURNING id;
        `;
        lessonId = inserted[0].id;
      }

      for (const challenge of lesson.challenges) {
        const existingChallenge = await sql`
          SELECT id FROM challenges WHERE lesson_id = ${lessonId} AND "order" = ${challenge.order};
        `;
        let challengeId: number;
        if (existingChallenge.length > 0) {
          challengeId = existingChallenge[0].id;
          await sql`
            UPDATE challenges
            SET type = ${challenge.type}, question = ${challenge.question}
            WHERE id = ${challengeId};
          `;
          await sql`DELETE FROM challenge_options WHERE challenge_id = ${challengeId};`;
        } else {
          const inserted = await sql`
            INSERT INTO challenges (lesson_id, type, question, "order")
            VALUES (${lessonId}, ${challenge.type}, ${challenge.question}, ${challenge.order})
            RETURNING id;
          `;
          challengeId = inserted[0].id;
        }

        // Insert options
        for (const opt of challenge.options) {
          await sql`
            INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
            VALUES (${challengeId}, ${opt.text}, ${opt.correct}, ${opt.imageSrc || null}, ${opt.audioSrc});
          `;
        }
      }
    }
  }

  console.log("\n✅ WORLD 12 SEEDED SUCCESSFULLY!");
}

seedWorld12().then(() => process.exit(0)).catch((e) => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
