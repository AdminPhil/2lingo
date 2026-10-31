import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

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
  // UNIT 26: NA TRŽNICI I SEOSKOM IMANJU
  // ==========================================
  {
    order: 26,
    title: "Unit 26",
    description: "Na tržnici i seoskom imanju (At the Farmers Market & Village Farm)",
    lessons: [
      {
        order: 1,
        title: "Domaći plodovi",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Corn"?',
            options: [
              { text: "Kukuruz", correct: true, imageSrc: "/kukuruz.svg", audioSrc: "/audio/hr/kukuruz.mp3" },
              { text: "Jabuka", correct: false, imageSrc: "/apple.svg", audioSrc: "/audio/hr/jabuka.mp3" },
              { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
              { text: "Voda", correct: false, imageSrc: "/water.svg", audioSrc: "/audio/hr/voda.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Pumpkin"?',
            options: [
              { text: "Bundeva", correct: true, imageSrc: "/bundeva.svg", audioSrc: "/audio/hr/bundeva.mp3" },
              { text: "Kupus", correct: false, imageSrc: "/cabbage.svg", audioSrc: "/audio/hr/kupus.mp3" },
              { text: "Cvijet", correct: false, imageSrc: "/grass.svg", audioSrc: "/audio/hr/cvijet.mp3" },
              { text: "Kuća", correct: false, imageSrc: "/house.svg", audioSrc: "/audio/hr/kuca.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Honey"?',
            options: [
              { text: "Med", correct: true, imageSrc: "/med.svg", audioSrc: "/audio/hr/med.mp3" },
              { text: "Sir", correct: false, imageSrc: "/cheese.svg", audioSrc: "/audio/hr/sir.mp3" },
              { text: "Sol", correct: false, imageSrc: "/salt.svg", audioSrc: "/audio/hr/sol.mp3" },
              { text: "Sok", correct: false, imageSrc: "/juice.svg", audioSrc: "/audio/hr/sok.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Wheat"?',
            options: [
              { text: "Pšenica", correct: true, imageSrc: "/psenica.svg", audioSrc: "/audio/hr/psenica.mp3" },
              { text: "Drvo", correct: false, imageSrc: "/tree.svg", audioSrc: "/audio/hr/drvo.mp3" },
              { text: "Trava", correct: false, imageSrc: "/grass.svg", audioSrc: "/audio/hr/trava.mp3" },
              { text: "Oblak", correct: false, imageSrc: "/cloud.svg", audioSrc: "/audio/hr/oblak.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Rad na polju",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one means "To sow / To plant"?',
            options: [
              { text: "Sijati", correct: true, audioSrc: "/audio/hr/sijati.mp3" },
              { text: "Pas", correct: false, audioSrc: "/audio/hr/pas.mp3" },
              { text: "Kuća", correct: false, audioSrc: "/audio/hr/kuca.mp3" },
              { text: "More", correct: false, audioSrc: "/audio/hr/more.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one means "To harvest"?',
            options: [
              { text: "Žeti", correct: true, audioSrc: "/audio/hr/zeti.mp3" },
              { text: "Riba", correct: false, audioSrc: "/audio/hr/riba.mp3" },
              { text: "Voda", correct: false, audioSrc: "/audio/hr/voda.mp3" },
              { text: "Kula", correct: false, audioSrc: "/audio/hr/kula.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one means "In the field"?',
            options: [
              { text: "Na polju", correct: true, audioSrc: "/audio/hr/na_polju.mp3" },
              { text: "U sobi", correct: false, audioSrc: "/audio/hr/u_sobi.mp3" },
              { text: "Na stolu", correct: false, audioSrc: "/audio/hr/na_stolu.mp3" },
              { text: "U školi", correct: false, audioSrc: "/audio/hr/u_skoli.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one means "Golden wheat"?',
            options: [
              { text: "Zlatna pšenica", correct: true, audioSrc: "/audio/hr/zlatna_psenica.mp3" },
              { text: "Plavo more", correct: false, audioSrc: "/audio/hr/plavo_more.mp3" },
              { text: "Topla juha", correct: false, audioSrc: "/audio/hr/topla_juha.mp3" },
              { text: "Crvena jabuka", correct: false, audioSrc: "/audio/hr/crvena_jabuka.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Seoski život",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"We sow corn in the spring."',
            options: [
              { text: "Sijemo kukuruz u proljeće.", correct: true, audioSrc: "/audio/hr/sijemo_kukuruz_u_proljece.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"Bees make sweet honey."',
            options: [
              { text: "Pčele prave slatki med.", correct: true, audioSrc: "/audio/hr/pcele_prave_slatki_med.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"We harvest golden wheat in the field."',
            options: [
              { text: "Žanjemo zlatnu pšenicu na polju.", correct: true, audioSrc: "/audio/hr/zanjemo_zlatnu_psenicu_na_polju.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Grandma bakes bread from wheat."',
            options: [
              { text: "Baka peče kruh od pšenice.", correct: true, audioSrc: "/audio/hr/baka_pece_kruh_od_psenice.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "👑 Super Izazov: Zlatna Slavonija",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"There is sweet honey on the table."',
            options: [
              { text: "Na stolu je slatki med.", correct: true, audioSrc: "/audio/hr/na_stolu_je_slatki_med.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"We buy a big pumpkin at the market."',
            options: [
              { text: "Kupujemo veliku bundevu na tržnici.", correct: true, audioSrc: "/audio/hr/kupujemo_veliku_bundevu_na_trznici.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"The sun shines over the golden field."',
            options: [
              { text: "Sunce sja nad zlatnim poljem.", correct: true, audioSrc: "/audio/hr/sunce_sja_nad_zlatnim_poljem.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Hardworking hands work in the village."',
            options: [
              { text: "Vrijedne ruke rade na selu.", correct: true, audioSrc: "/audio/hr/vrijedne_ruke_rade_na_selu.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 5,
            question: '"Grandma bakes bread from wheat."',
            options: [
              { text: "Baka peče kruh od pšenice.", correct: true, audioSrc: "/audio/hr/baka_pece_kruh_od_psenice.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 27: DIVLJE ŽIVOTINJE KOPAČKOG RITA
  // ==========================================
  {
    order: 27,
    title: "Unit 27",
    description: "Divlje životinje Kopačkog rita (Wetland Wildlife & Bird Sanctuary)",
    lessons: [
      {
        order: 1,
        title: "Čuvari močvare",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Eagle"?',
            options: [
              { text: "Orao", correct: true, imageSrc: "/orao.svg", audioSrc: "/audio/hr/orao.mp3" },
              { text: "Galeb", correct: false, imageSrc: "/seagull.svg", audioSrc: "/audio/hr/galeb.mp3" },
              { text: "Ptica", correct: false, imageSrc: "/bird.svg", audioSrc: "/audio/hr/ptica.mp3" },
              { text: "Riba", correct: false, imageSrc: "/fish.svg", audioSrc: "/audio/hr/riba.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Heron"?',
            options: [
              { text: "Čaplja", correct: true, imageSrc: "/caplja.svg", audioSrc: "/audio/hr/caplja.mp3" },
              { text: "Patka", correct: false, imageSrc: "/duck.svg", audioSrc: "/audio/hr/patka.mp3" },
              { text: "Žaba", correct: false, imageSrc: "/frog.svg", audioSrc: "/audio/hr/zaba.mp3" },
              { text: "Pas", correct: false, imageSrc: "/dog.svg", audioSrc: "/audio/hr/pas.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Wild Boar"?',
            options: [
              { text: "Vepar", correct: true, imageSrc: "/vepar.svg", audioSrc: "/audio/hr/vepar.mp3" },
              { text: "Konj", correct: false, imageSrc: "/horse.svg", audioSrc: "/audio/hr/konj.mp3" },
              { text: "Krava", correct: false, imageSrc: "/cow.svg", audioSrc: "/audio/hr/krava.mp3" },
              { text: "Ovca", correct: false, imageSrc: "/sheep.svg", audioSrc: "/audio/hr/ovca.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Deer"?',
            options: [
              { text: "Jelen", correct: true, imageSrc: "/jelen.svg", audioSrc: "/audio/hr/jelen.mp3" },
              { text: "Medvjed", correct: false, imageSrc: "/medvjed.svg", audioSrc: "/audio/hr/medvjed.mp3" },
              { text: "Vuk", correct: false, imageSrc: "/wolf.svg", audioSrc: "/audio/hr/vuk.mp3" },
              { text: "Zec", correct: false, imageSrc: "/rabbit.svg", audioSrc: "/audio/hr/zec.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Moćna krila i brze noge",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one means "To fly"?',
            options: [
              { text: "Letjeti", correct: true, audioSrc: "/audio/hr/letjeti.mp3" },
              { text: "Kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
              { text: "Jabuka", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
              { text: "More", correct: false, audioSrc: "/audio/hr/more.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one means "To hunt"?',
            options: [
              { text: "Loviti", correct: true, audioSrc: "/audio/hr/loviti.mp3" },
              { text: "Voda", correct: false, audioSrc: "/audio/hr/voda.mp3" },
              { text: "Kula", correct: false, audioSrc: "/audio/hr/kula.mp3" },
              { text: "Sunce", correct: false, audioSrc: "/audio/hr/sunce.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one means "White heron"?',
            options: [
              { text: "Bijela čaplja", correct: true, audioSrc: "/audio/hr/bijela_caplja.mp3" },
              { text: "Topla juha", correct: false, audioSrc: "/audio/hr/topla_juha.mp3" },
              { text: "Zelena trava", correct: false, audioSrc: "/audio/hr/zelena_trava.mp3" },
              { text: "Plavo more", correct: false, audioSrc: "/audio/hr/plavo_more.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one means "Large eagle"?',
            options: [
              { text: "Veliki orao", correct: true, audioSrc: "/audio/hr/veliki_orao.mp3" },
              { text: "Mali pas", correct: false, audioSrc: "/audio/hr/mali_pas.mp3" },
              { text: "Stara kuca", correct: false, audioSrc: "/audio/hr/stara_kuca.mp3" },
              { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Kroz trsku i hrastove šume",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"The eagle flies high in the sky."',
            options: [
              { text: "Orao leti visoko na nebu.", correct: true, audioSrc: "/audio/hr/orao_leti_visoko_na_nebu.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"The white heron stands in the water."',
            options: [
              { text: "Bijela čaplja stoji u vodi.", correct: true, audioSrc: "/audio/hr/bijela_caplja_stoji_u_vodi.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"The deer runs through the green forest."',
            options: [
              { text: "Jelen trči kroz zelenu šumu.", correct: true, audioSrc: "/audio/hr/jelen_trci_kroz_zelenu_sumu.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"The wild boar searches for food."',
            options: [
              { text: "Divlji vepar traži hranu.", correct: true, audioSrc: "/audio/hr/divlji_vepar_trazi_hranu.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "👑 Super Izazov: Šumski Istraživač",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"Kopački rit is a home for birds."',
            options: [
              { text: "Kopački rit je dom za ptice.", correct: true, audioSrc: "/audio/hr/kopacki_rit_je_dom_za_ptice.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"We watch the eagle fly."',
            options: [
              { text: "Promatramo orla kako leti.", correct: true, audioSrc: "/audio/hr/promatramo_orla_kako_leti.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"A quiet river flows through the wetland."',
            options: [
              { text: "Tiha rijeka teče kroz močvaru.", correct: true, audioSrc: "/audio/hr/tiha_rijeka_tece_kroz_mocvaru.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"The deer runs through the green forest."',
            options: [
              { text: "Jelen trči kroz zelenu šumu.", correct: true, audioSrc: "/audio/hr/jelen_trci_kroz_zelenu_sumu.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 5,
            question: '"The eagle flies high in the sky."',
            options: [
              { text: "Orao leti visoko na nebu.", correct: true, audioSrc: "/audio/hr/orao_leti_visoko_na_nebu.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 28: U TRADICIONALNOJ KUHINJI KOD BAKE
  // ==========================================
  {
    order: 28,
    title: "Unit 28",
    description: "U tradicionalnoj kuhinji kod bake (Grandma's Kitchen & Baking)",
    lessons: [
      {
        order: 1,
        title: "Slatki mirisi",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Cake"?',
            options: [
              { text: "Kolač", correct: true, imageSrc: "/kolac.svg", audioSrc: "/audio/hr/kolac.mp3" },
              { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
              { text: "Sir", correct: false, imageSrc: "/cheese.svg", audioSrc: "/audio/hr/sir.mp3" },
              { text: "Jabuka", correct: false, imageSrc: "/apple.svg", audioSrc: "/audio/hr/jabuka.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Tea"?',
            options: [
              { text: "Čaj", correct: true, imageSrc: "/caj.svg", audioSrc: "/audio/hr/caj.mp3" },
              { text: "Sok", correct: false, imageSrc: "/juice.svg", audioSrc: "/audio/hr/sok.mp3" },
              { text: "Voda", correct: false, imageSrc: "/water.svg", audioSrc: "/audio/hr/voda.mp3" },
              { text: "Mlijeko", correct: false, imageSrc: "/milk.svg", audioSrc: "/audio/hr/mlijeko.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Pie"?',
            options: [
              { text: "Pita", correct: true, imageSrc: "/pita.svg", audioSrc: "/audio/hr/pita.mp3" },
              { text: "Burek", correct: false, imageSrc: "/burek.svg", audioSrc: "/audio/hr/burek.mp3" },
              { text: "Juha", correct: false, imageSrc: "/juha.svg", audioSrc: "/audio/hr/juha.mp3" },
              { text: "Sladoled", correct: false, imageSrc: "/ice_cream.svg", audioSrc: "/audio/hr/sladoled.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Cooking Pot"?',
            options: [
              { text: "Lonac", correct: true, imageSrc: "/lonac.svg", audioSrc: "/audio/hr/lonac.mp3" },
              { text: "Tanjur", correct: false, imageSrc: "/plate.svg", audioSrc: "/audio/hr/tanjur.mp3" },
              { text: "Čaša", correct: false, imageSrc: "/casa.svg", audioSrc: "/audio/hr/casa.mp3" },
              { text: "Nož", correct: false, imageSrc: "/noz.svg", audioSrc: "/audio/hr/noz.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Bakin recept",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one means "To stir"?',
            options: [
              { text: "Miješati", correct: true, audioSrc: "/audio/hr/mijesati.mp3" },
              { text: "Stol", correct: false, audioSrc: "/audio/hr/stol.mp3" },
              { text: "Knjiga", correct: false, audioSrc: "/audio/hr/knjiga.mp3" },
              { text: "Prozor", correct: false, audioSrc: "/audio/hr/prozor.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one means "To bake"?',
            options: [
              { text: "Peći", correct: true, audioSrc: "/audio/hr/peci.mp3" },
              { text: "Kuća", correct: false, audioSrc: "/audio/hr/kuca.mp3" },
              { text: "Rijeka", correct: false, audioSrc: "/audio/hr/rijeka.mp3" },
              { text: "Cipela", correct: false, audioSrc: "/audio/hr/cipele.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one means "Warm tea"?',
            options: [
              { text: "Topli čaj", correct: true, audioSrc: "/audio/hr/topli_caj.mp3" },
              { text: "Hladno more", correct: false, audioSrc: "/audio/hr/hladno_more.mp3" },
              { text: "Bijeli kruh", correct: false, audioSrc: "/audio/hr/bijeli_kruh.mp3" },
              { text: "Zelena trava", correct: false, audioSrc: "/audio/hr/zelena_trava.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one means "Sweet cake"?',
            options: [
              { text: "Slatki kolač", correct: true, audioSrc: "/audio/hr/slatki_kolac.mp3" },
              { text: "Slano more", correct: false, audioSrc: "/audio/hr/slano_more.mp3" },
              { text: "Stari most", correct: false, audioSrc: "/audio/hr/stari_most.mp3" },
              { text: "Veliki park", correct: false, audioSrc: "/audio/hr/veliki_park.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Toplina doma",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"Grandma bakes a sweet cake."',
            options: [
              { text: "Baka peče slatki kolač.", correct: true, audioSrc: "/audio/hr/baka_pece_slatki_kolac.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"We drink warm tea with honey."',
            options: [
              { text: "Pijemo topli čaj s medom.", correct: true, audioSrc: "/audio/hr/pijemo_topli_caj_s_medom.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"I stir the soup in a large pot."',
            options: [
              { text: "Miješam juhu u velikom loncu.", correct: true, audioSrc: "/audio/hr/mijesam_juhu_u_velikom_loncu.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Delicious pie smells good in the kitchen."',
            options: [
              { text: "Fina pita miriše u kuhinji.", correct: true, audioSrc: "/audio/hr/fina_pita_mirise_u_kuhinji.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "👑 Super Izazov: Mali Kuhar",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"The whole family sits at the table."',
            options: [
              { text: "Cijela obitelj sjedi za stolom.", correct: true, audioSrc: "/audio/hr/cijela_obitelj_sjedi_za_stolom.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"Thank you grandma for the delicious cake."',
            options: [
              { text: "Hvala baka na finom kolaču.", correct: true, audioSrc: "/audio/hr/hvala_baka_na_finom_kolacu.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"The kitchen is full of warmth."',
            options: [
              { text: "Kuhinja je puna topline.", correct: true, audioSrc: "/audio/hr/kuhinja_je_puna_topline.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"We drink warm tea with honey."',
            options: [
              { text: "Pijemo topli čaj s medom.", correct: true, audioSrc: "/audio/hr/pijemo_topli_caj_s_medom.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 5,
            question: '"Grandma bakes a sweet cake."',
            options: [
              { text: "Baka peče slatki kolač.", correct: true, audioSrc: "/audio/hr/baka_pece_slatki_kolac.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 29: RIJEČNA PLOVIDBA DUNAVOM I DRAVOM
  // ==========================================
  {
    order: 29,
    title: "Unit 29",
    description: "Riječna plovidba Dunavom i Dravom (River Navigation & Life on Water)",
    lessons: [
      {
        order: 1,
        title: "Na obali rijeke",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Bridge"?',
            options: [
              { text: "Most", correct: true, imageSrc: "/most.svg", audioSrc: "/audio/hr/most.mp3" },
              { text: "Vrata", correct: false, imageSrc: "/door.svg", audioSrc: "/audio/hr/vrata.mp3" },
              { text: "Kuća", correct: false, imageSrc: "/house.svg", audioSrc: "/audio/hr/kuca.mp3" },
              { text: "Zid", correct: false, imageSrc: "/zid.svg", audioSrc: "/audio/hr/zid.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Small Boat"?',
            options: [
              { text: "Čamac", correct: true, imageSrc: "/camac.svg", audioSrc: "/audio/hr/camac.mp3" },
              { text: "Brod", correct: false, imageSrc: "/boat.svg", audioSrc: "/audio/hr/brod.mp3" },
              { text: "Auto", correct: false, imageSrc: "/car.svg", audioSrc: "/audio/hr/auto.mp3" },
              { text: "Vlak", correct: false, imageSrc: "/train.svg", audioSrc: "/audio/hr/vlak.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Fisherman"?',
            options: [
              { text: "Ribar", correct: true, imageSrc: "/ribar.svg", audioSrc: "/audio/hr/ribar.mp3" },
              { text: "Mornar", correct: false, imageSrc: "/sailor.svg", audioSrc: "/audio/hr/mornar.mp3" },
              { text: "Učitelj", correct: false, imageSrc: "/teacher.svg", audioSrc: "/audio/hr/ucitelj.mp3" },
              { text: "Prijatelj", correct: false, imageSrc: "/prijatelji.svg", audioSrc: "/audio/hr/prijatelji.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Fishing Net"?',
            options: [
              { text: "Mreža", correct: true, imageSrc: "/mreza.svg", audioSrc: "/audio/hr/mreza.mp3" },
              { text: "Uže", correct: false, imageSrc: "/rope.svg", audioSrc: "/audio/hr/uze.mp3" },
              { text: "Sidro", correct: false, imageSrc: "/anchor.svg", audioSrc: "/audio/hr/sidro.mp3" },
              { text: "Lopta", correct: false, imageSrc: "/ball.svg", audioSrc: "/audio/hr/lopta.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Snaga rijeke",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one means "To row"?',
            options: [
              { text: "Veslati", correct: true, audioSrc: "/audio/hr/veslati.mp3" },
              { text: "Pas", correct: false, audioSrc: "/audio/hr/pas.mp3" },
              { text: "Sir", correct: false, audioSrc: "/audio/hr/sir.mp3" },
              { text: "Jabuka", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one means "To catch"?',
            options: [
              { text: "Uloviti", correct: true, audioSrc: "/audio/hr/uloviti.mp3" },
              { text: "Kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
              { text: "Knjiga", correct: false, audioSrc: "/audio/hr/knjiga.mp3" },
              { text: "Stol", correct: false, audioSrc: "/audio/hr/stol.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one means "Old bridge"?',
            options: [
              { text: "Stari most", correct: true, audioSrc: "/audio/hr/stari_most.mp3" },
              { text: "Plavo more", correct: false, audioSrc: "/audio/hr/plavo_more.mp3" },
              { text: "Zelena trava", correct: false, audioSrc: "/audio/hr/zelena_trava.mp3" },
              { text: "Topla juha", correct: false, audioSrc: "/audio/hr/topla_juha.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one means "Wooden boat"?',
            options: [
              { text: "Drveni čamac", correct: true, audioSrc: "/audio/hr/drveni_camac.mp3" },
              { text: "Velika kuca", correct: false, audioSrc: "/audio/hr/velika_kuca.mp3" },
              { text: "Zuti sesir", correct: false, audioSrc: "/audio/hr/zuti_sesir.mp3" },
              { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Riječne pustolovine",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"We row a boat on the calm Drava river."',
            options: [
              { text: "Veslamo čamcem po mirnoj Dravi.", correct: true, audioSrc: "/audio/hr/veslamo_camcem_po_mirnoj_dravi.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"The fisherman throws the net into the Danube."',
            options: [
              { text: "Ribar baca mrežu u Dunav.", correct: true, audioSrc: "/audio/hr/ribar_baca_mrezu_u_dunav.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"We cross over the big bridge."',
            options: [
              { text: "Prelazimo preko velikog mosta.", correct: true, audioSrc: "/audio/hr/prelazimo_preko_velikog_mosta.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"We caught a big fish."',
            options: [
              { text: "Ulovili smo veliku ribu.", correct: true, audioSrc: "/audio/hr/ulovili_smo_veliku_ribu.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "👑 Super Izazov: Dunavski Kapetan",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"We sail by boat towards Vukovar."',
            options: [
              { text: "Plovimo brodom prema Vukovaru.", correct: true, audioSrc: "/audio/hr/plovimo_brodom_prema_vukovaru.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"The Drava and Danube are powerful rivers."',
            options: [
              { text: "Drava i Dunav su snažne rijeke.", correct: true, audioSrc: "/audio/hr/drava_i_dunav_su_snazne_rijeke.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"The sun sets behind the bridge."',
            options: [
              { text: "Sunce zalazi iza mosta.", correct: true, audioSrc: "/audio/hr/sunce_zalazi_iza_mosta.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"We row a boat on the calm Drava river."',
            options: [
              { text: "Veslamo čamcem po mirnoj Dravi.", correct: true, audioSrc: "/audio/hr/veslamo_camcem_po_mirnoj_dravi.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 5,
            question: '"The fisherman throws the net into the Danube."',
            options: [
              { text: "Ribar baca mrežu u Dunav.", correct: true, audioSrc: "/audio/hr/ribar_baca_mrezu_u_dunav.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 30: VELIKA TAMBURICA I SEOSKA PROSLAVA
  // ==========================================
  {
    order: 30,
    title: "Unit 30",
    description: "Velika tamburica i seoska proslava (Folk Music, Costumes & Grand Festival)",
    lessons: [
      {
        order: 1,
        title: "Slavonsko veselje",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Music"?',
            options: [
              { text: "Glazba", correct: true, imageSrc: "/glazba.svg", audioSrc: "/audio/hr/glazba.mp3" },
              { text: "Knjiga", correct: false, imageSrc: "/book.svg", audioSrc: "/audio/hr/knjiga.mp3" },
              { text: "Igra", correct: false, imageSrc: "/game.svg", audioSrc: "/audio/hr/igra.mp3" },
              { text: "Škola", correct: false, imageSrc: "/school.svg", audioSrc: "/audio/hr/skola.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Song"?',
            options: [
              { text: "Pjesma", correct: true, imageSrc: "/pjesma.svg", audioSrc: "/audio/hr/pjesma.mp3" },
              { text: "Priča", correct: false, imageSrc: "/story.svg", audioSrc: "/audio/hr/prica.mp3" },
              { text: "Riječ", correct: false, imageSrc: "/word.svg", audioSrc: "/audio/hr/rijec.mp3" },
              { text: "Pismo", correct: false, imageSrc: "/letter.svg", audioSrc: "/audio/hr/pismo.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Folk Costume"?',
            options: [
              { text: "Nošnja", correct: true, imageSrc: "/nosnja.svg", audioSrc: "/audio/hr/nosnja.mp3" },
              { text: "Kapa", correct: false, imageSrc: "/hat.svg", audioSrc: "/audio/hr/kapa.mp3" },
              { text: "Majica", correct: false, imageSrc: "/tshirt.svg", audioSrc: "/audio/hr/majica.mp3" },
              { text: "Cipele", correct: false, imageSrc: "/shoes.svg", audioSrc: "/audio/hr/cipele.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Dance"?',
            options: [
              { text: "Ples", correct: true, imageSrc: "/ples.svg", audioSrc: "/audio/hr/ples.mp3" },
              { text: "Skok", correct: false, imageSrc: "/jump.svg", audioSrc: "/audio/hr/skok.mp3" },
              { text: "Trk", correct: false, imageSrc: "/run.svg", audioSrc: "/audio/hr/trk.mp3" },
              { text: "Smijeh", correct: false, imageSrc: "/smile.svg", audioSrc: "/audio/hr/smijeh.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Pjesma i tambure",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one means "To sing"?',
            options: [
              { text: "Pjevati", correct: true, audioSrc: "/audio/hr/pjevati.mp3" },
              { text: "Kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
              { text: "Voda", correct: false, audioSrc: "/audio/hr/voda.mp3" },
              { text: "Kuća", correct: false, audioSrc: "/audio/hr/kuca.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one means "To play an instrument"?',
            options: [
              { text: "Svirati", correct: true, audioSrc: "/audio/hr/svirati.mp3" },
              { text: "Pas", correct: false, audioSrc: "/audio/hr/pas.mp3" },
              { text: "Jabuka", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
              { text: "More", correct: false, audioSrc: "/audio/hr/more.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one means "Cheerful song"?',
            options: [
              { text: "Vesela pjesma", correct: true, audioSrc: "/audio/hr/vesela_pjesma.mp3" },
              { text: "Topla juha", correct: false, audioSrc: "/audio/hr/topla_juha.mp3" },
              { text: "Stari most", correct: false, audioSrc: "/audio/hr/stari_most.mp3" },
              { text: "Plavo more", correct: false, audioSrc: "/audio/hr/plavo_more.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one means "Slavonian folk costume"?',
            options: [
              { text: "Slavonska nošnja", correct: true, audioSrc: "/audio/hr/slavonska_nosnja.mp3" },
              { text: "Crvena jabuka", correct: false, audioSrc: "/audio/hr/crvena_jabuka.mp3" },
              { text: "Zelena trava", correct: false, audioSrc: "/audio/hr/zelena_trava.mp3" },
              { text: "Dobar dan", correct: false, audioSrc: "/audio/hr/dobar_dan.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Kolo radosti",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"The tamburitza players play a cheerful song."',
            options: [
              { text: "Tamburaši sviraju veselu pjesmu.", correct: true, audioSrc: "/audio/hr/tamburasi_sviraju_veselu_pjesmu.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"Together we all sing and dance."',
            options: [
              { text: "Svi zajedno pjevamo i plešemo.", correct: true, audioSrc: "/audio/hr/svi_zajedno_pjevamo_i_plesemo.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"Girls wear golden folk costumes."',
            options: [
              { text: "Djevojčice nose zlatnu nošnju.", correct: true, audioSrc: "/audio/hr/djevojcice_nose_zlatnu_nosnju.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"The folk dance spins in the village square."',
            options: [
              { text: "Kolo se vrti na seoskom trgu.", correct: true, audioSrc: "/audio/hr/kolo_se_vrti_na_seoskom_trgu.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "👑 Super Izazov: Gospodar Tamburice",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"This is the most beautiful Slavonian celebration."',
            options: [
              { text: "Ovo je najljepša slavonska proslava.", correct: true, audioSrc: "/audio/hr/ovo_je_najljepsa_slavonska_proslava.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"Together we all sing and dance."',
            options: [
              { text: "Svi zajedno pjevamo i plešemo.", correct: true, audioSrc: "/audio/hr/svi_zajedno_pjevamo_i_plesemo.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"The tamburitza players play a cheerful song."',
            options: [
              { text: "Tamburaši sviraju veselu pjesmu.", correct: true, audioSrc: "/audio/hr/tamburasi_sviraju_veselu_pjesmu.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Girls wear golden folk costumes."',
            options: [
              { text: "Djevojčice nose zlatnu nošnju.", correct: true, audioSrc: "/audio/hr/djevojcice_nose_zlatnu_nosnju.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 5,
            question: '"Congratulations, you have finished the sixth world!"',
            options: [
              { text: "Čestitamo, završili ste šesti svijet!", correct: true, audioSrc: "/audio/hr/cestitamo_zavrsili_ste_sesti_svijet.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
        ],
      },
    ],
  },
];

async function seedWorld6() {
  console.log("=== SEEDING WORLD 6 (UNITS 26–30) ===");

  const course = await sql`SELECT id FROM courses WHERE id = 1 LIMIT 1;`;
  if (!course.length) {
    throw new Error("Course ID 1 not found!");
  }
  const courseId = course[0].id;

  for (const unit of unitsData) {
    console.log(`\nProcessing Unit ${unit.order}: "${unit.title} - ${unit.description}"...`);

    // Upsert Unit
    const existingUnit = await sql`
      SELECT id FROM units WHERE course_id = ${courseId} AND "order" = ${unit.order};
    `;
    let unitId: number;
    if (existingUnit.length > 0) {
      unitId = existingUnit[0].id;
      await sql`
        UPDATE units SET title = ${unit.title}, description = ${unit.description} WHERE id = ${unitId};
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

  console.log("\n✅ WORLD 6 SEEDED SUCCESSFULLY!");
}

seedWorld6().then(() => process.exit(0)).catch(e => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
