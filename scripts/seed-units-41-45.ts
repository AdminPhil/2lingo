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
  // UNIT 41: SINJSKI VITEZOVI I KONJI (The Knights & Noble Steeds)
  // ==========================================
  {
    order: 41,
    title: "Unit 41",
    description: "Sinjski vitezovi i konji (The Knights & Noble Steeds)",
    lessons: [
      {
        order: 1,
        title: "Konji i viteška oprema",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Horse"?',
            options: [
              { text: "Konj", correct: true, imageSrc: "/konj.svg", audioSrc: "/audio/hr/konj.mp3" },
              { text: "Sedlo", correct: false, imageSrc: "/sedlo.svg", audioSrc: "/audio/hr/sedlo.mp3" },
              { text: "Staza", correct: false, imageSrc: "/staza.svg", audioSrc: "/audio/hr/staza.mp3" },
              { text: "Jahač", correct: false, imageSrc: "/jahac.svg", audioSrc: "/audio/hr/jahac.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Saddle"?',
            options: [
              { text: "Sedlo", correct: true, imageSrc: "/sedlo.svg", audioSrc: "/audio/hr/sedlo.mp3" },
              { text: "Konj", correct: false, imageSrc: "/konj.svg", audioSrc: "/audio/hr/konj.mp3" },
              { text: "Staza", correct: false, imageSrc: "/staza.svg", audioSrc: "/audio/hr/staza.mp3" },
              { text: "Jahač", correct: false, imageSrc: "/jahac.svg", audioSrc: "/audio/hr/jahac.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Track"?',
            options: [
              { text: "Staza", correct: true, imageSrc: "/staza.svg", audioSrc: "/audio/hr/staza.mp3" },
              { text: "Sedlo", correct: false, imageSrc: "/sedlo.svg", audioSrc: "/audio/hr/sedlo.mp3" },
              { text: "Konj", correct: false, imageSrc: "/konj.svg", audioSrc: "/audio/hr/konj.mp3" },
              { text: "Jahač", correct: false, imageSrc: "/jahac.svg", audioSrc: "/audio/hr/jahac.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Rider"?',
            options: [
              { text: "Jahač", correct: true, imageSrc: "/jahac.svg", audioSrc: "/audio/hr/jahac.mp3" },
              { text: "Staza", correct: false, imageSrc: "/staza.svg", audioSrc: "/audio/hr/staza.mp3" },
              { text: "Sedlo", correct: false, imageSrc: "/sedlo.svg", audioSrc: "/audio/hr/sedlo.mp3" },
              { text: "Konj", correct: false, imageSrc: "/konj.svg", audioSrc: "/audio/hr/konj.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Brzi galop i kretanje",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The horse moves fast."',
            options: [
              { text: "Konj se kreće brzo.", correct: true, audioSrc: "/audio/hr/konj_se_krece_brzo.mp3" },
              { text: "Jahač se priprema.", correct: false, audioSrc: "/audio/hr/jahac_se_priprema.mp3" },
              { text: "Konj stoji mirno.", correct: false, audioSrc: "/audio/hr/konj_stoji_mirno.mp3" },
              { text: "Vitez gleda konja.", correct: false, audioSrc: "/audio/hr/vitez_gleda_konja.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The rider prepares."',
            options: [
              { text: "Jahač se priprema.", correct: true, audioSrc: "/audio/hr/jahac_se_priprema.mp3" },
              { text: "Konj se kreće brzo.", correct: false, audioSrc: "/audio/hr/konj_se_krece_brzo.mp3" },
              { text: "Jahač trči stazom.", correct: false, audioSrc: "/audio/hr/jahac_trci_stazom.mp3" },
              { text: "Konj stoji mirno.", correct: false, audioSrc: "/audio/hr/konj_stoji_mirno.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The fast horse"',
            options: [
              { text: "Brzi konj", correct: true, audioSrc: "/audio/hr/brzi_konj.mp3" },
              { text: "Plemeniti konj", correct: false, audioSrc: "/audio/hr/plemeniti_konj.mp3" },
              { text: "Staza", correct: false, audioSrc: "/audio/hr/staza.mp3" },
              { text: "Sedlo", correct: false, audioSrc: "/audio/hr/sedlo.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "We are moving along the track."',
            options: [
              { text: "Krećemo se po stazi.", correct: true, audioSrc: "/audio/hr/krecemo_se_po_stazi.mp3" },
              { text: "Jahač trči stazom.", correct: false, audioSrc: "/audio/hr/jahac_trci_stazom.mp3" },
              { text: "Vitez gleda konja.", correct: false, audioSrc: "/audio/hr/vitez_gleda_konja.mp3" },
              { text: "Konj stoji mirno.", correct: false, audioSrc: "/audio/hr/konj_stoji_mirno.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Vitezovi u nošnjama",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The riders prepare for the tournament."',
            options: [
              { text: "Jahači se pripremaju za natjecanje.", correct: true, audioSrc: "/audio/hr/jahaci_se_pripremaju_za_natjecanje.mp3" },
              { text: "Vitezovi vole svoje konje.", correct: false, audioSrc: "/audio/hr/vitezovi_vole_svoje_konje.mp3" },
              { text: "Konj nosi sedlo.", correct: false, audioSrc: "/audio/hr/konj_nosi_sedlo.mp3" },
              { text: "Staza je puna pijeska.", correct: false, audioSrc: "/audio/hr/staza_je_puna_pijeska.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The leather saddle"',
            options: [
              { text: "Kožno sedlo", correct: true, audioSrc: "/audio/hr/kozno_sedlo.mp3" },
              { text: "Crveno sedlo", correct: false, audioSrc: "/audio/hr/crveno_sedlo.mp3" },
              { text: "Dugačka trkaća staza", correct: false, audioSrc: "/audio/hr/dugacka_trkaca_staza.mp3" },
              { text: "Brzi konj", correct: false, audioSrc: "/audio/hr/brzi_konj.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The knight is riding a horse."',
            options: [
              { text: "Vitez jaše konja.", correct: true, audioSrc: "/audio/hr/vitez_jase_konja.mp3" },
              { text: "Konj nosi sedlo.", correct: false, audioSrc: "/audio/hr/konj_nosi_sedlo.mp3" },
              { text: "Vitezovi vole svoje konje.", correct: false, audioSrc: "/audio/hr/vitezovi_vole_svoje_konje.mp3" },
              { text: "Staza je puna pijeska.", correct: false, audioSrc: "/audio/hr/staza_je_puna_pijeska.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "A long race track"',
            options: [
              { text: "Dugačka trkaća staza", correct: true, audioSrc: "/audio/hr/dugacka_trkaca_staza.mp3" },
              { text: "Kožno sedlo", correct: false, audioSrc: "/audio/hr/kozno_sedlo.mp3" },
              { text: "Crveno sedlo", correct: false, audioSrc: "/audio/hr/crveno_sedlo.mp3" },
              { text: "Plemeniti konj", correct: false, audioSrc: "/audio/hr/plemeniti_konj.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Viteška priprema",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The noble horse is galloping."',
            options: [
              { text: "Plemeniti konj galopira.", correct: true, audioSrc: "/audio/hr/plemeniti_konj_galopira.mp3" },
              { text: "Jahač je u sedlu.", correct: false, audioSrc: "/audio/hr/jahac_je_u_sedlu.mp3" },
              { text: "Konj mirno čeka.", correct: false, audioSrc: "/audio/hr/konj_mirno_ceka.mp3" },
              { text: "Sedlo je spremno.", correct: false, audioSrc: "/audio/hr/sedlo_je_spremno.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The rider is in the saddle."',
            options: [
              { text: "Jahač je u sedlu.", correct: true, audioSrc: "/audio/hr/jahac_je_u_sedlu.mp3" },
              { text: "Plemeniti konj galopira.", correct: false, audioSrc: "/audio/hr/plemeniti_konj_galopira.mp3" },
              { text: "Sedlo je spremno.", correct: false, audioSrc: "/audio/hr/sedlo_je_spremno.mp3" },
              { text: "Konj mirno čeka.", correct: false, audioSrc: "/audio/hr/konj_mirno_ceka.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Everyone is preparing for the start."',
            options: [
              { text: "Svi se pripremaju za početak.", correct: true, audioSrc: "/audio/hr/svi_se_pripremaju_za_pocetak.mp3" },
              { text: "Vitez se kreće naprijed.", correct: false, audioSrc: "/audio/hr/vitez_se_krece_naprijed.mp3" },
              { text: "Publika plješće jahačima.", correct: false, audioSrc: "/audio/hr/publika_pljesce_jahacima.mp3" },
              { text: "Početak velikog natjecanja.", correct: false, audioSrc: "/audio/hr/pocetak_velikog_natjecanja.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The knight moves forward."',
            options: [
              { text: "Vitez se kreće naprijed.", correct: true, audioSrc: "/audio/hr/vitez_se_krece_naprijed.mp3" },
              { text: "Svi se pripremaju za početak.", correct: false, audioSrc: "/audio/hr/svi_se_pripremaju_za_pocetak.mp3" },
              { text: "Publika plješće jahačima.", correct: false, audioSrc: "/audio/hr/publika_pljesce_jahacima.mp3" },
              { text: "Početak velikog natjecanja.", correct: false, audioSrc: "/audio/hr/pocetak_velikog_natjecanja.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 42: ALKA I KOPLJE (The Tournament & Ring Target)
  // ==========================================
  {
    order: 42,
    title: "Unit 42",
    description: "Alka i koplje (The Tournament & Ring Target)",
    lessons: [
      {
        order: 1,
        title: "Alka i ciljanje",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Ring target"?',
            options: [
              { text: "Alka", correct: true, imageSrc: "/alka.svg", audioSrc: "/audio/hr/alka.mp3" },
              { text: "Koplje", correct: false, imageSrc: "/koplje.svg", audioSrc: "/audio/hr/koplje.mp3" },
              { text: "Meta", correct: false, imageSrc: "/meta.svg", audioSrc: "/audio/hr/meta.mp3" },
              { text: "Pogodak", correct: false, imageSrc: "/pogodak.svg", audioSrc: "/audio/hr/pogodak.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Lance"?',
            options: [
              { text: "Koplje", correct: true, imageSrc: "/koplje.svg", audioSrc: "/audio/hr/koplje.mp3" },
              { text: "Alka", correct: false, imageSrc: "/alka.svg", audioSrc: "/audio/hr/alka.mp3" },
              { text: "Meta", correct: false, imageSrc: "/meta.svg", audioSrc: "/audio/hr/meta.mp3" },
              { text: "Pogodak", correct: false, imageSrc: "/pogodak.svg", audioSrc: "/audio/hr/pogodak.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Target"?',
            options: [
              { text: "Meta", correct: true, imageSrc: "/meta.svg", audioSrc: "/audio/hr/meta.mp3" },
              { text: "Koplje", correct: false, imageSrc: "/koplje.svg", audioSrc: "/audio/hr/koplje.mp3" },
              { text: "Alka", correct: false, imageSrc: "/alka.svg", audioSrc: "/audio/hr/alka.mp3" },
              { text: "Pogodak", correct: false, imageSrc: "/pogodak.svg", audioSrc: "/audio/hr/pogodak.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Direct hit"?',
            options: [
              { text: "Pogodak", correct: true, imageSrc: "/pogodak.svg", audioSrc: "/audio/hr/pogodak.mp3" },
              { text: "Meta", correct: false, imageSrc: "/meta.svg", audioSrc: "/audio/hr/meta.mp3" },
              { text: "Koplje", correct: false, imageSrc: "/koplje.svg", audioSrc: "/audio/hr/koplje.mp3" },
              { text: "Alka", correct: false, imageSrc: "/alka.svg", audioSrc: "/audio/hr/alka.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Natjecanje vitezova",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The knights compete."',
            options: [
              { text: "Vitezovi se natječu.", correct: true, audioSrc: "/audio/hr/vitezovi_se_natjecu.mp3" },
              { text: "Koplje leti naprijed.", correct: false, audioSrc: "/audio/hr/koplje_leti_naprijed.mp3" },
              { text: "Vitezovi gledaju alku.", correct: false, audioSrc: "/audio/hr/vitezovi_gledaju_alku.mp3" },
              { text: "Željezna alka.", correct: false, audioSrc: "/audio/hr/zeljezna_alka.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The long lance"',
            options: [
              { text: "Dugačko koplje", correct: true, audioSrc: "/audio/hr/dugacko_koplje.mp3" },
              { text: "Željezna alka", correct: false, audioSrc: "/audio/hr/zeljezna_alka.mp3" },
              { text: "Promašena meta", correct: false, audioSrc: "/audio/hr/promasena_meta.mp3" },
              { text: "Mali željezni prsten", correct: false, audioSrc: "/audio/hr/mali_zeljezni_prsten.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Direct hit in the center!"',
            options: [
              { text: "Pogodak u sridu!", correct: true, audioSrc: "/audio/hr/pogodak_u_sridu.mp3" },
              { text: "Tri boda za pogodak u sridu!", correct: false, audioSrc: "/audio/hr/tri_boda_za_pogodak_u_sridu.mp3" },
              { text: "Publika slavi sridu!", correct: false, audioSrc: "/audio/hr/publika_slavi_sridu.mp3" },
              { text: "Dva boda u gornji dio!", correct: false, audioSrc: "/audio/hr/dva_boda_u_gornji_dio.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The iron ring"',
            options: [
              { text: "Željezna alka", correct: true, audioSrc: "/audio/hr/zeljezna_alka.mp3" },
              { text: "Dugačko koplje", correct: false, audioSrc: "/audio/hr/dugacko_koplje.mp3" },
              { text: "Promašena meta", correct: false, audioSrc: "/audio/hr/promasena_meta.mp3" },
              { text: "Mali željezni prsten", correct: false, audioSrc: "/audio/hr/mali_zeljezni_prsten.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Usmjeri koplje",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The knight aims at the target."',
            options: [
              { text: "Vitez se usmjerava na metu.", correct: true, audioSrc: "/audio/hr/vitez_se_usmjerava_na_metu.mp3" },
              { text: "Natječemo se zajedno.", correct: false, audioSrc: "/audio/hr/natjecemo_se_zajedno.mp3" },
              { text: "Vitez drži koplje.", correct: false, audioSrc: "/audio/hr/vitez_drzi_koplje.mp3" },
              { text: "Koplje pogađa cilj.", correct: false, audioSrc: "/audio/hr/koplje_pogada_cilj.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "We are competing together."',
            options: [
              { text: "Natječemo se zajedno.", correct: true, audioSrc: "/audio/hr/natjecemo_se_zajedno.mp3" },
              { text: "Vitez se usmjerava na metu.", correct: false, audioSrc: "/audio/hr/vitez_se_usmjerava_na_metu.mp3" },
              { text: "Vitez drži koplje.", correct: false, audioSrc: "/audio/hr/vitez_drzi_koplje.mp3" },
              { text: "Alka stoji na užetu.", correct: false, audioSrc: "/audio/hr/alka_stoji_na_uzetu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Sharp lance"',
            options: [
              { text: "Oštro koplje", correct: true, audioSrc: "/audio/hr/ostro_koplje.mp3" },
              { text: "Sjajan pogodak", correct: false, audioSrc: "/audio/hr/sjajan_pogodak.mp3" },
              { text: "Velika drvena meta", correct: false, audioSrc: "/audio/hr/velika_drvena_meta.mp3" },
              { text: "Dugačko koplje", correct: false, audioSrc: "/audio/hr/dugacko_koplje.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "A great hit"',
            options: [
              { text: "Sjajan pogodak", correct: true, audioSrc: "/audio/hr/sjajan_pogodak.mp3" },
              { text: "Oštro koplje", correct: false, audioSrc: "/audio/hr/ostro_koplje.mp3" },
              { text: "Velika drvena meta", correct: false, audioSrc: "/audio/hr/velika_drvena_meta.mp3" },
              { text: "Željezna alka", correct: false, audioSrc: "/audio/hr/zeljezna_alka.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Pogodak u sridu!",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The rider aims the lance at the ring."',
            options: [
              { text: "Jahač usmjerava koplje u alku.", correct: true, audioSrc: "/audio/hr/jahac_usmjerava_koplje_u_alku.mp3" },
              { text: "Alka visi iznad staze.", correct: false, audioSrc: "/audio/hr/alka_visi_iznad_staze.mp3" },
              { text: "Koplje udara u željezo.", correct: false, audioSrc: "/audio/hr/koplje_udara_u_zeljezo.mp3" },
              { text: "Vitez pogađa u jedan.", correct: false, audioSrc: "/audio/hr/vitez_pogada_u_jedan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Everyone is competing with pride."',
            options: [
              { text: "Svi se natječu s ponosom.", correct: true, audioSrc: "/audio/hr/svi_se_natjecu_s_ponosom.mp3" },
              { text: "Alka visi iznad staze.", correct: false, audioSrc: "/audio/hr/alka_visi_iznad_staze.mp3" },
              { text: "Koplje udara u željezo.", correct: false, audioSrc: "/audio/hr/koplje_udara_u_zeljezo.mp3" },
              { text: "Vitez pogađa u jedan.", correct: false, audioSrc: "/audio/hr/vitez_pogada_u_jedan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Three points for the center hit!"',
            options: [
              { text: "Tri boda za pogodak u sridu!", correct: true, audioSrc: "/audio/hr/tri_boda_za_pogodak_u_sridu.mp3" },
              { text: "Pogodak u sridu!", correct: false, audioSrc: "/audio/hr/pogodak_u_sridu.mp3" },
              { text: "Dva boda u gornji dio!", correct: false, audioSrc: "/audio/hr/dva_boda_u_gornji_dio.mp3" },
              { text: "Publika slavi sridu!", correct: false, audioSrc: "/audio/hr/publika_slavi_sridu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The alka hangs above the track."',
            options: [
              { text: "Alka visi iznad staze.", correct: true, audioSrc: "/audio/hr/alka_visi_iznad_staze.mp3" },
              { text: "Jahač usmjerava koplje u alku.", correct: false, audioSrc: "/audio/hr/jahac_usmjerava_koplje_u_alku.mp3" },
              { text: "Koplje udara u željezo.", correct: false, audioSrc: "/audio/hr/koplje_udara_u_zeljezo.mp3" },
              { text: "Vitez pogađa u jedan.", correct: false, audioSrc: "/audio/hr/vitez_pogada_u_jedan.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 43: KANJON RIJEKE CETINE (The Emerald Canyon & River)
  // ==========================================
  {
    order: 43,
    title: "Unit 43",
    description: "Kanjon rijeke Cetine (The Emerald Canyon & River)",
    lessons: [
      {
        order: 1,
        title: "Kanjon i rijeka",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Canyon"?',
            options: [
              { text: "Kanjon", correct: true, imageSrc: "/kanjon.svg", audioSrc: "/audio/hr/kanjon.mp3" },
              { text: "Slap", correct: false, imageSrc: "/slap.svg", audioSrc: "/audio/hr/slap.mp3" },
              { text: "Stijena", correct: false, imageSrc: "/stijena.svg", audioSrc: "/audio/hr/stijena.mp3" },
              { text: "Čamac", correct: false, imageSrc: "/camac.svg", audioSrc: "/audio/hr/camac.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Waterfall"?',
            options: [
              { text: "Slap", correct: true, imageSrc: "/slap.svg", audioSrc: "/audio/hr/slap.mp3" },
              { text: "Kanjon", correct: false, imageSrc: "/kanjon.svg", audioSrc: "/audio/hr/kanjon.mp3" },
              { text: "Stijena", correct: false, imageSrc: "/stijena.svg", audioSrc: "/audio/hr/stijena.mp3" },
              { text: "Čamac", correct: false, imageSrc: "/camac.svg", audioSrc: "/audio/hr/camac.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Cliff"?',
            options: [
              { text: "Stijena", correct: true, imageSrc: "/stijena.svg", audioSrc: "/audio/hr/stijena.mp3" },
              { text: "Slap", correct: false, imageSrc: "/slap.svg", audioSrc: "/audio/hr/slap.mp3" },
              { text: "Kanjon", correct: false, imageSrc: "/kanjon.svg", audioSrc: "/audio/hr/kanjon.mp3" },
              { text: "Čamac", correct: false, imageSrc: "/camac.svg", audioSrc: "/audio/hr/camac.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Boat"?',
            options: [
              { text: "Čamac", correct: true, imageSrc: "/camac.svg", audioSrc: "/audio/hr/camac.mp3" },
              { text: "Stijena", correct: false, imageSrc: "/stijena.svg", audioSrc: "/audio/hr/stijena.mp3" },
              { text: "Slap", correct: false, imageSrc: "/slap.svg", audioSrc: "/audio/hr/slap.mp3" },
              { text: "Kanjon", correct: false, imageSrc: "/kanjon.svg", audioSrc: "/audio/hr/kanjon.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Spuštanje niz rijeku",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The boat descends down the river."',
            options: [
              { text: "Čamac se spušta niz rijeku.", correct: true, audioSrc: "/audio/hr/camac_se_spusta_niz_rijeku.mp3" },
              { text: "Voda teče kroz kanjon.", correct: false, audioSrc: "/audio/hr/voda_tece_kroz_kanjon.mp3" },
              { text: "Stijene su visoke.", correct: false, audioSrc: "/audio/hr/stijene_su_visoke.mp3" },
              { text: "Rijeka Cetina je zelena.", correct: false, audioSrc: "/audio/hr/rijeka_cetina_je_zelena.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The high cliff"',
            options: [
              { text: "Visoka stijena", correct: true, audioSrc: "/audio/hr/visoka_stijena.mp3" },
              { text: "Predivni slap", correct: false, audioSrc: "/audio/hr/predivni_slap.mp3" },
              { text: "Duboki kanjon", correct: false, audioSrc: "/audio/hr/duboki_kanjon.mp3" },
              { text: "Mali drveni čamac", correct: false, audioSrc: "/audio/hr/mali_drveni_camac.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The beautiful waterfall"',
            options: [
              { text: "Predivni slap", correct: true, audioSrc: "/audio/hr/predivni_slap.mp3" },
              { text: "Visoka stijena", correct: false, audioSrc: "/audio/hr/visoka_stijena.mp3" },
              { text: "Duboki kanjon", correct: false, audioSrc: "/audio/hr/duboki_kanjon.mp3" },
              { text: "Mali drveni čamac", correct: false, audioSrc: "/audio/hr/mali_drveni_camac.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Deep canyon"',
            options: [
              { text: "Duboki kanjon", correct: true, audioSrc: "/audio/hr/duboki_kanjon.mp3" },
              { text: "Predivni slap", correct: false, audioSrc: "/audio/hr/predivni_slap.mp3" },
              { text: "Visoka stijena", correct: false, audioSrc: "/audio/hr/visoka_stijena.mp3" },
              { text: "Mali drveni čamac", correct: false, audioSrc: "/audio/hr/mali_drveni_camac.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Divljenje prirodi",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "We admire the emerald river."',
            options: [
              { text: "Divimo se smaragdnoj rijeci.", correct: true, audioSrc: "/audio/hr/divimo_se_smaragdnoj_rijeci.mp3" },
              { text: "Brza voda teče.", correct: false, audioSrc: "/audio/hr/brza_voda_tece.mp3" },
              { text: "Čamac se kreće kroz kanjon.", correct: false, audioSrc: "/audio/hr/camac_se_krece_kroz_kanjon.mp3" },
              { text: "Gledamo slap iz čamca.", correct: false, audioSrc: "/audio/hr/gledamo_slap_iz_camca.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The rapid water flows."',
            options: [
              { text: "Brza voda teče.", correct: true, audioSrc: "/audio/hr/brza_voda_tece.mp3" },
              { text: "Divimo se smaragdnoj rijeci.", correct: false, audioSrc: "/audio/hr/divimo_se_smaragdnoj_rijeci.mp3" },
              { text: "Čamac se kreće kroz kanjon.", correct: false, audioSrc: "/audio/hr/camac_se_krece_kroz_kanjon.mp3" },
              { text: "Stijena se uzdiže visoko.", correct: false, audioSrc: "/audio/hr/stijena_se_uzdize_visoko.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The boat moves through the canyon."',
            options: [
              { text: "Čamac se kreće kroz kanjon.", correct: true, audioSrc: "/audio/hr/camac_se_krece_kroz_kanjon.mp3" },
              { text: "Divimo se smaragdnoj rijeci.", correct: false, audioSrc: "/audio/hr/divimo_se_smaragdnoj_rijeci.mp3" },
              { text: "Brza voda teče.", correct: false, audioSrc: "/audio/hr/brza_voda_tece.mp3" },
              { text: "Gledamo slap iz čamca.", correct: false, audioSrc: "/audio/hr/gledamo_slap_iz_camca.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Steep rocks along the shore"',
            options: [
              { text: "Strme stijene uz obalu", correct: true, audioSrc: "/audio/hr/strme_stijene_uz_obalu.mp3" },
              { text: "Zelena rijeka Cetina", correct: false, audioSrc: "/audio/hr/zelena_rijeka_cetina.mp3" },
              { text: "Bijela riječna pjena", correct: false, audioSrc: "/audio/hr/bijela_rijecna_pjena.mp3" },
              { text: "Hladna planinska voda", correct: false, audioSrc: "/audio/hr/hladna_planinska_voda.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Kroz kanjon Cetine",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The river descends into the canyon."',
            options: [
              { text: "Rijeka se spušta u kanjon.", correct: true, audioSrc: "/audio/hr/rijeka_se_spusta_u_kanjon.mp3" },
              { text: "Divimo se glasnom slapu.", correct: false, audioSrc: "/audio/hr/divimo_se_glasnom_slapu.mp3" },
              { text: "Čamac prolazi pokraj stijena.", correct: false, audioSrc: "/audio/hr/camac_prolazi_pokraj_stijena.mp3" },
              { text: "Veslamo po rijeci.", correct: false, audioSrc: "/audio/hr/veslamo_po_rijeci.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "We admire the loud waterfall."',
            options: [
              { text: "Divimo se glasnom slapu.", correct: true, audioSrc: "/audio/hr/divimo_se_glasnom_slapu.mp3" },
              { text: "Rijeka se spušta u kanjon.", correct: false, audioSrc: "/audio/hr/rijeka_se_spusta_u_kanjon.mp3" },
              { text: "Čamac prolazi pokraj stijena.", correct: false, audioSrc: "/audio/hr/camac_prolazi_pokraj_stijena.mp3" },
              { text: "Divimo se ljepoti prirode.", correct: false, audioSrc: "/audio/hr/divimo_se_ljepoti_prirode.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The boat passes beside the rocks."',
            options: [
              { text: "Čamac prolazi pokraj stijena.", correct: true, audioSrc: "/audio/hr/camac_prolazi_pokraj_stijena.mp3" },
              { text: "Rijeka se spušta u kanjon.", correct: false, audioSrc: "/audio/hr/rijeka_se_spusta_u_kanjon.mp3" },
              { text: "Divimo se glasnom slapu.", correct: false, audioSrc: "/audio/hr/divimo_se_glasnom_slapu.mp3" },
              { text: "Slap pada u rijeku.", correct: false, audioSrc: "/audio/hr/slap_pada_u_rijeku.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Pure and green river water"',
            options: [
              { text: "Čista i zelena riječna voda", correct: true, audioSrc: "/audio/hr/cista_i_zelena_rijecna_voda.mp3" },
              { text: "Strme stijene uz obalu", correct: false, audioSrc: "/audio/hr/strme_stijene_uz_obalu.mp3" },
              { text: "Bijela riječna pjena", correct: false, audioSrc: "/audio/hr/bijela_rijecna_pjena.mp3" },
              { text: "Hladna planinska voda", correct: false, audioSrc: "/audio/hr/hladna_planinska_voda.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 44: STARI MLIN I KRUH ISPOD PEKE (Traditional Hearth & Watermill)
  // ==========================================
  {
    order: 44,
    title: "Unit 44",
    description: "Stari mlin i kruh ispod peke (Traditional Hearth & Watermill)",
    lessons: [
      {
        order: 1,
        title: "Mlin i ognjište",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Watermill"?',
            options: [
              { text: "Mlin", correct: true, imageSrc: "/mlin.svg", audioSrc: "/audio/hr/mlin.mp3" },
              { text: "Peka", correct: false, imageSrc: "/peka.svg", audioSrc: "/audio/hr/peka.mp3" },
              { text: "Brašno", correct: false, imageSrc: "/brasno.svg", audioSrc: "/audio/hr/brasno.mp3" },
              { text: "Vatra", correct: false, imageSrc: "/vatra.svg", audioSrc: "/audio/hr/vatra.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Baking dome"?',
            options: [
              { text: "Peka", correct: true, imageSrc: "/peka.svg", audioSrc: "/audio/hr/peka.mp3" },
              { text: "Mlin", correct: false, imageSrc: "/mlin.svg", audioSrc: "/audio/hr/mlin.mp3" },
              { text: "Brašno", correct: false, imageSrc: "/brasno.svg", audioSrc: "/audio/hr/brasno.mp3" },
              { text: "Vatra", correct: false, imageSrc: "/vatra.svg", audioSrc: "/audio/hr/vatra.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Flour"?',
            options: [
              { text: "Brašno", correct: true, imageSrc: "/brasno.svg", audioSrc: "/audio/hr/brasno.mp3" },
              { text: "Peka", correct: false, imageSrc: "/peka.svg", audioSrc: "/audio/hr/peka.mp3" },
              { text: "Mlin", correct: false, imageSrc: "/mlin.svg", audioSrc: "/audio/hr/mlin.mp3" },
              { text: "Vatra", correct: false, imageSrc: "/vatra.svg", audioSrc: "/audio/hr/vatra.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Fire"?',
            options: [
              { text: "Vatra", correct: true, imageSrc: "/vatra.svg", audioSrc: "/audio/hr/vatra.mp3" },
              { text: "Brašno", correct: false, imageSrc: "/brasno.svg", audioSrc: "/audio/hr/brasno.mp3" },
              { text: "Peka", correct: false, imageSrc: "/peka.svg", audioSrc: "/audio/hr/peka.mp3" },
              { text: "Mlin", correct: false, imageSrc: "/mlin.svg", audioSrc: "/audio/hr/mlin.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Okretanje mlina",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The watermill wheel turns."',
            options: [
              { text: "Mlinski kotač se okreće.", correct: true, audioSrc: "/audio/hr/mlinski_kotac_se_okrece.mp3" },
              { text: "Vatra gori u ognjištu.", correct: false, audioSrc: "/audio/hr/vatra_gori_u_ognjistu.mp3" },
              { text: "Mlin melje žito.", correct: false, audioSrc: "/audio/hr/mlin_melje_zito.mp3" },
              { text: "Stari kameni mlin.", correct: false, audioSrc: "/audio/hr/stari_kameni_mlin.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Warm fire"',
            options: [
              { text: "Topla vatra", correct: true, audioSrc: "/audio/hr/topla_vatra.mp3" },
              { text: "Bijelo brašno", correct: false, audioSrc: "/audio/hr/bijelo_brasno.mp3" },
              { text: "Kruh ispod peke", correct: false, audioSrc: "/audio/hr/kruh_ispod_peke.mp3" },
              { text: "Miris toplog kruha", correct: false, audioSrc: "/audio/hr/miris_toplog_kruha.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "White flour"',
            options: [
              { text: "Bijelo brašno", correct: true, audioSrc: "/audio/hr/bijelo_brasno.mp3" },
              { text: "Topla vatra", correct: false, audioSrc: "/audio/hr/topla_vatra.mp3" },
              { text: "Kruh ispod peke", correct: false, audioSrc: "/audio/hr/kruh_ispod_peke.mp3" },
              { text: "Miris toplog kruha", correct: false, audioSrc: "/audio/hr/miris_toplog_kruha.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Bread under the peka"',
            options: [
              { text: "Kruh ispod peke", correct: true, audioSrc: "/audio/hr/kruh_ispod_peke.mp3" },
              { text: "Topla vatra", correct: false, audioSrc: "/audio/hr/topla_vatra.mp3" },
              { text: "Bijelo brašno", correct: false, audioSrc: "/audio/hr/bijelo_brasno.mp3" },
              { text: "Miris toplog kruha", correct: false, audioSrc: "/audio/hr/miris_toplog_kruha.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Grijanje uz ognjište",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "We warm ourselves by the fire."',
            options: [
              { text: "Grijemo se uz vatru.", correct: true, audioSrc: "/audio/hr/grijemo_se_uz_vatru.mp3" },
              { text: "Mlin melje žito u brašno.", correct: false, audioSrc: "/audio/hr/mlin_melje_zito_u_brasno.mp3" },
              { text: "Peka se zagrijava na ognjištu.", correct: false, audioSrc: "/audio/hr/peka_se_zagrijava_na_ognjistu.mp3" },
              { text: "Vatra grije cijelu kuću.", correct: false, audioSrc: "/audio/hr/vatra_grije_cijelu_kucu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The mill grinds grain into flour."',
            options: [
              { text: "Mlin melje žito u brašno.", correct: true, audioSrc: "/audio/hr/mlin_melje_zito_u_brasno.mp3" },
              { text: "Grijemo se uz vatru.", correct: false, audioSrc: "/audio/hr/grijemo_se_uz_vatru.mp3" },
              { text: "Peka se zagrijava na ognjištu.", correct: false, audioSrc: "/audio/hr/peka_se_zagrijava_na_ognjistu.mp3" },
              { text: "Kruh se peče polako.", correct: false, audioSrc: "/audio/hr/kruh_se_pece_polako.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The dome heats up on the hearth."',
            options: [
              { text: "Peka se zagrijava na ognjištu.", correct: true, audioSrc: "/audio/hr/peka_se_zagrijava_na_ognjistu.mp3" },
              { text: "Grijemo se uz vatru.", correct: false, audioSrc: "/audio/hr/grijemo_se_uz_vatru.mp3" },
              { text: "Mlin melje žito u brašno.", correct: false, audioSrc: "/audio/hr/mlin_melje_zito_u_brasno.mp3" },
              { text: "Dim se diže iz dimnjaka.", correct: false, audioSrc: "/audio/hr/dim_se_dize_iz_dimnjaka.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Smell of fresh bread"',
            options: [
              { text: "Miris svježeg kruha", correct: true, audioSrc: "/audio/hr/miris_svjezeg_kruha.mp3" },
              { text: "Brašno za domaći kruh", correct: false, audioSrc: "/audio/hr/brasno_za_domaci_kruh.mp3" },
              { text: "Miris toplog kruha", correct: false, audioSrc: "/audio/hr/miris_toplog_kruha.mp3" },
              { text: "Kruh ispod peke", correct: false, audioSrc: "/audio/hr/kruh_ispod_peke.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Mirisi starog mlina",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The old watermill turns beside the river."',
            options: [
              { text: "Stari mlin se okreće pokraj rijeke.", correct: true, audioSrc: "/audio/hr/stari_mlin_se_okrece_pokraj_rijeke.mp3" },
              { text: "Obitelj se grije uz ognjište.", correct: false, audioSrc: "/audio/hr/obitelj_se_grije_uz_ognjiste.mp3" },
              { text: "Ukusna večera se priprema ispod peke.", correct: false, audioSrc: "/audio/hr/ukusna_vecera_se_priprema_ispod_peke.mp3" },
              { text: "Zlatna vatra pucketa.", correct: false, audioSrc: "/audio/hr/zlatna_vatra_pucketa.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The family warms themselves by the hearth."',
            options: [
              { text: "Obitelj se grije uz ognjište.", correct: true, audioSrc: "/audio/hr/obitelj_se_grije_uz_ognjiste.mp3" },
              { text: "Stari mlin se okreće pokraj rijeke.", correct: false, audioSrc: "/audio/hr/stari_mlin_se_okrece_pokraj_rijeke.mp3" },
              { text: "Ukusna večera se priprema ispod peke.", correct: false, audioSrc: "/audio/hr/ukusna_vecera_se_priprema_ispod_peke.mp3" },
              { text: "Voda pokreće veliki mlin.", correct: false, audioSrc: "/audio/hr/voda_pokrece_veliki_mlin.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Delicious dinner is preparing under the peka."',
            options: [
              { text: "Ukusna večera se priprema ispod peke.", correct: true, audioSrc: "/audio/hr/ukusna_vecera_se_priprema_ispod_peke.mp3" },
              { text: "Obitelj se grije uz ognjište.", correct: false, audioSrc: "/audio/hr/obitelj_se_grije_uz_ognjiste.mp3" },
              { text: "Stari mlin se okreće pokraj rijeke.", correct: false, audioSrc: "/audio/hr/stari_mlin_se_okrece_pokraj_rijeke.mp3" },
              { text: "Svježi kruh je spreman.", correct: false, audioSrc: "/audio/hr/svjezi_kruh_je_spreman.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Golden fire crackles."',
            options: [
              { text: "Zlatna vatra pucketa.", correct: true, audioSrc: "/audio/hr/zlatna_vatra_pucketa.mp3" },
              { text: "Stari mlin se okreće pokraj rijeke.", correct: false, audioSrc: "/audio/hr/stari_mlin_se_okrece_pokraj_rijeke.mp3" },
              { text: "Obitelj se grije uz ognjište.", correct: false, audioSrc: "/audio/hr/obitelj_se_grije_uz_ognjiste.mp3" },
              { text: "Mlin radi cijeli dan.", correct: false, audioSrc: "/audio/hr/mlin_radi_cijeli_dan.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 45: SLAVLJE SLAVODOBITNIKA (The Champion's Celebration Capstone)
  // ==========================================
  {
    order: 45,
    title: "Unit 45",
    description: "Slavlje slavodobitnika (The Champion's Celebration Capstone)",
    lessons: [
      {
        order: 1,
        title: "Pobjeda i tradicija",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Victory"?',
            options: [
              { text: "Pobjeda", correct: true, imageSrc: "/pobjeda.svg", audioSrc: "/audio/hr/pobjeda.mp3" },
              { text: "Medalja", correct: false, imageSrc: "/medalja.svg", audioSrc: "/audio/hr/medalja.mp3" },
              { text: "Slavlje", correct: false, imageSrc: "/slavlje.svg", audioSrc: "/audio/hr/slavlje.mp3" },
              { text: "Ponos", correct: false, imageSrc: "/ponos.svg", audioSrc: "/audio/hr/ponos.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Medal"?',
            options: [
              { text: "Medalja", correct: true, imageSrc: "/medalja.svg", audioSrc: "/audio/hr/medalja.mp3" },
              { text: "Pobjeda", correct: false, imageSrc: "/pobjeda.svg", audioSrc: "/audio/hr/pobjeda.mp3" },
              { text: "Slavlje", correct: false, imageSrc: "/slavlje.svg", audioSrc: "/audio/hr/slavlje.mp3" },
              { text: "Ponos", correct: false, imageSrc: "/ponos.svg", audioSrc: "/audio/hr/ponos.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Celebration"?',
            options: [
              { text: "Slavlje", correct: true, imageSrc: "/slavlje.svg", audioSrc: "/audio/hr/slavlje.mp3" },
              { text: "Medalja", correct: false, imageSrc: "/medalja.svg", audioSrc: "/audio/hr/medalja.mp3" },
              { text: "Pobjeda", correct: false, imageSrc: "/pobjeda.svg", audioSrc: "/audio/hr/pobjeda.mp3" },
              { text: "Ponos", correct: false, imageSrc: "/ponos.svg", audioSrc: "/audio/hr/ponos.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Pride"?',
            options: [
              { text: "Ponos", correct: true, imageSrc: "/ponos.svg", audioSrc: "/audio/hr/ponos.mp3" },
              { text: "Slavlje", correct: false, imageSrc: "/slavlje.svg", audioSrc: "/audio/hr/slavlje.mp3" },
              { text: "Medalja", correct: false, imageSrc: "/medalja.svg", audioSrc: "/audio/hr/medalja.mp3" },
              { text: "Pobjeda", correct: false, imageSrc: "/pobjeda.svg", audioSrc: "/audio/hr/pobjeda.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Radost pobjednika",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Everyone rejoices at the victory."',
            options: [
              { text: "Svi se raduju pobjedi.", correct: true, audioSrc: "/audio/hr/svi_se_raduju_pobjedi.mp3" },
              { text: "Pobjednik nosi medalju.", correct: false, audioSrc: "/audio/hr/pobjednik_nosi_medalju.mp3" },
              { text: "Narod pjeva i slavi.", correct: false, audioSrc: "/audio/hr/narod_pjeva_i_slavi.mp3" },
              { text: "Veliko slavlje.", correct: false, audioSrc: "/audio/hr/veliko_slavlje.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Golden medal"',
            options: [
              { text: "Zlatna medalja", correct: true, audioSrc: "/audio/hr/zlatna_medalja.mp3" },
              { text: "Veliko slavlje", correct: false, audioSrc: "/audio/hr/veliko_slavlje.mp3" },
              { text: "Istinski ponos", correct: false, audioSrc: "/audio/hr/istinski_ponos.mp3" },
              { text: "Sjajna zlatna medalja", correct: false, audioSrc: "/audio/hr/sjajna_zlatna_medalja.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Great celebration"',
            options: [
              { text: "Veliko slavlje", correct: true, audioSrc: "/audio/hr/veliko_slavlje.mp3" },
              { text: "Zlatna medalja", correct: false, audioSrc: "/audio/hr/zlatna_medalja.mp3" },
              { text: "Istinski ponos", correct: false, audioSrc: "/audio/hr/istinski_ponos.mp3" },
              { text: "Slavlje u cijelom gradu", correct: false, audioSrc: "/audio/hr/slavlje_u_cijelom_gradu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "True pride"',
            options: [
              { text: "Istinski ponos", correct: true, audioSrc: "/audio/hr/istinski_ponos.mp3" },
              { text: "Zlatna medalja", correct: false, audioSrc: "/audio/hr/zlatna_medalja.mp3" },
              { text: "Veliko slavlje", correct: false, audioSrc: "/audio/hr/veliko_slavlje.mp3" },
              { text: "Sjajna zlatna medalja", correct: false, audioSrc: "/audio/hr/sjajna_zlatna_medalja.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Ponos vitezova",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "We are proud of our knights."',
            options: [
              { text: "Ponosimo se našim vitezovima.", correct: true, audioSrc: "/audio/hr/ponosimo_se_nasim_vitezovima.mp3" },
              { text: "Pobjednik se raduje na konju.", correct: false, audioSrc: "/audio/hr/pobjednik_se_raduje_na_konju.mp3" },
              { text: "Grad slavi viteško natjecanje.", correct: false, audioSrc: "/audio/hr/grad_slavi_vitesko_natjecanje.mp3" },
              { text: "Ponosni vitez pozdravlja publiku.", correct: false, audioSrc: "/audio/hr/ponosni_vitez_pozdravlja_publiku.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The winner rejoices on the horse."',
            options: [
              { text: "Pobjednik se raduje na konju.", correct: true, audioSrc: "/audio/hr/pobjednik_se_raduje_na_konju.mp3" },
              { text: "Ponosimo se našim vitezovima.", correct: false, audioSrc: "/audio/hr/ponosimo_se_nasim_vitezovima.mp3" },
              { text: "Grad slavi viteško natjecanje.", correct: false, audioSrc: "/audio/hr/grad_slavi_vitesko_natjecanje.mp3" },
              { text: "Zlatna medalja sja.", correct: false, audioSrc: "/audio/hr/zlatna_medalja_sja.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "A shiny medal on the chest"',
            options: [
              { text: "Sjajna medalja na prsima", correct: true, audioSrc: "/audio/hr/sjajna_medalja_na_prsima.mp3" },
              { text: "Ponos hrvatske tradicije", correct: false, audioSrc: "/audio/hr/ponos_hrvatske_tradicije.mp3" },
              { text: "Zlatna medalja", correct: false, audioSrc: "/audio/hr/zlatna_medalja.mp3" },
              { text: "Slavlje u cijelom gradu", correct: false, audioSrc: "/audio/hr/slavlje_u_cijelom_gradu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The city celebrates the tournament."',
            options: [
              { text: "Grad slavi viteško natjecanje.", correct: true, audioSrc: "/audio/hr/grad_slavi_vitesko_natjecanje.mp3" },
              { text: "Ponosimo se našim vitezovima.", correct: false, audioSrc: "/audio/hr/ponosimo_se_nasim_vitezovima.mp3" },
              { text: "Pobjednik se raduje na konju.", correct: false, audioSrc: "/audio/hr/pobjednik_se_raduje_na_konju.mp3" },
              { text: "Svi pjevaju pobjedničku pjesmu.", correct: false, audioSrc: "/audio/hr/svi_pjevaju_pobjednicku_pjesmu.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Slavodobitnik Alke",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The champion proudly receives the gold medal."',
            options: [
              { text: "Slavodobitnik ponosno prima zlatnu medalju.", correct: true, audioSrc: "/audio/hr/slavodobitnik_ponosno_prima_zlatnu_medalju.mp3" },
              { text: "Cijeli grad se raduje i pjeva.", correct: false, audioSrc: "/audio/hr/cijeli_grad_se_raduje_i_pjeva.mp3" },
              { text: "Ponosimo se bogatom hrvatskom baštinom.", correct: false, audioSrc: "/audio/hr/ponosimo_se_bogatom_hrvatskom_bastinom.mp3" },
              { text: "Vitezovi ponosno jašu.", correct: false, audioSrc: "/audio/hr/vitezovi_ponosno_jasu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The whole town rejoices and sings."',
            options: [
              { text: "Cijeli grad se raduje i pjeva.", correct: true, audioSrc: "/audio/hr/cijeli_grad_se_raduje_i_pjeva.mp3" },
              { text: "Slavodobitnik ponosno prima zlatnu medalju.", correct: false, audioSrc: "/audio/hr/slavodobitnik_ponosno_prima_zlatnu_medalju.mp3" },
              { text: "Ponosimo se bogatom hrvatskom baštinom.", correct: false, audioSrc: "/audio/hr/ponosimo_se_bogatom_hrvatskom_bastinom.mp3" },
              { text: "Slavlje traje do kasno u noć.", correct: false, audioSrc: "/audio/hr/slavlje_traje_do_kasno_u_noc.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "We are proud of the rich Croatian heritage."',
            options: [
              { text: "Ponosimo se bogatom hrvatskom baštinom.", correct: true, audioSrc: "/audio/hr/ponosimo_se_bogatom_hrvatskom_bastinom.mp3" },
              { text: "Slavodobitnik ponosno prima zlatnu medalju.", correct: false, audioSrc: "/audio/hr/slavodobitnik_ponosno_prima_zlatnu_medalju.mp3" },
              { text: "Cijeli grad se raduje i pjeva.", correct: false, audioSrc: "/audio/hr/cijeli_grad_se_raduje_i_pjeva.mp3" },
              { text: "Zlatni plamen tradicije.", correct: false, audioSrc: "/audio/hr/zlatni_plamen_tradicije.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Congratulations, you finished the ninth world!"',
            options: [
              { text: "Čestitamo, završili ste deveti svijet!", correct: true, audioSrc: "/audio/hr/cestitamo_zavrsili_ste_deveti_svijet.mp3" },
              { text: "Zajedno slavimo veliku pobjedu!", correct: false, audioSrc: "/audio/hr/zajedno_slavimo_veliku_pobjedu.mp3" },
              { text: "Slavlje traje do kasno u noć!", correct: false, audioSrc: "/audio/hr/slavlje_traje_do_kasno_u_noc.mp3" },
              { text: "Vitezovi ponosno jašu!", correct: false, audioSrc: "/audio/hr/vitezovi_ponosno_jasu.mp3" },
            ],
          },
        ],
      },
    ],
  },
];

async function seedWorld9() {
  console.log("=== 🏇 SEEDING WORLD 9: SINJSKA ALKA & CETINA VALLEY (UNITS 41-45) ===\n");

  const courseResult = await sql`SELECT id FROM courses WHERE id = 1 LIMIT 1;`;
  if (courseResult.length === 0) {
    throw new Error("Course ID 1 not found!");
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

  console.log("\n✅ WORLD 9 SEEDED SUCCESSFULLY!");
}

seedWorld9().then(() => process.exit(0)).catch(e => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
